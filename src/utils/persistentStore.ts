/**
 * Hybrid IndexedDB + quota-safe localStorage persistence layer with synchronous memory snapshot.
 * - IndexedDB holds full datasets and cached Drive media previews (hundreds of MBs).
 * - `hydratePersistentMemoryCache()` pre-loads IndexedDB into an in-memory Map before React mounts
 *   so `readSyncCache()` returns full datasets synchronously on Render #1 (zero reload flicker).
 * - localStorage only caches compact payloads (< 350 KB) so massive datasets like the
 *   125-region atlas never overflow the 5 MB quota and evict smaller user uploads.
 * - Tracks locally modified keys ("dirty keys") so Drive cloud sync merges safely
 *   without overwriting existing Drive backups with empty local state.
 */

const DB_NAME = 'sri_cultural_portal_db';
const DB_VERSION = 1;
const STORE_NAME = 'kv_store';
const DIRTY_KEYS_STORAGE = 'sri_dirty_portal_keys';
const LOCAL_STORAGE_ITEM_CAP = 350 * 1024; // ~350 KB max per localStorage entry

export const PORTAL_DATA_SYNCED_EVENT = 'sri:portal-data-synced';

// Synchronous in-memory mirror populated at startup and kept in sync on every write/delete
const memoryCache = new Map<string, unknown>();
let isMemoryHydrated = false;
let hydrationPromise: Promise<void> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Loads all IndexedDB entries into the synchronous memoryCache in a single cursor pass.
 * Safe to call multiple times; concurrent callers share the same in-flight promise.
 */
export async function hydratePersistentMemoryCache(): Promise<void> {
  if (isMemoryHydrated) return;
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const db = await openDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();

        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            const key = String(cursor.key);
            if (!memoryCache.has(key)) {
              memoryCache.set(key, cursor.value);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Persistent memory cache hydration skipped:', err);
    } finally {
      isMemoryHydrated = true;
      hydrationPromise = null;
    }
  })();

  return hydrationPromise;
}

/**
 * Returns a plain-object snapshot of all currently hydrated `sri_*` keys
 * (from memoryCache + localStorage fallback).
 */
export function getPersistentMemorySnapshot(): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('sri_')) continue;
      if (memoryCache.has(key)) continue;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          snapshot[key] = JSON.parse(raw);
        } catch {
          snapshot[key] = raw;
        }
      }
    }
  } catch {
    // ignore localStorage access issues
  }

  memoryCache.forEach((val, key) => {
    snapshot[key] = val;
  });

  return snapshot;
}

export function getDirtyPortalKeys(): string[] {
  try {
    const raw = localStorage.getItem(DIRTY_KEYS_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markPortalKeyDirty(key: string): void {
  try {
    const current = new Set(getDirtyPortalKeys());
    current.add(key);
    localStorage.setItem(DIRTY_KEYS_STORAGE, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }
}

export function notifyPortalDataSynced(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PORTAL_DATA_SYNCED_EVENT));
  }
}

export interface SavePersistentOptions {
  skipDirty?: boolean;
  skipDriveSync?: boolean;
}

export async function savePersistentItem<T>(
  key: string,
  value: T,
  options: SavePersistentOptions = {}
): Promise<void> {
  memoryCache.set(key, value);

  if (!options.skipDirty && key.startsWith('sri_')) {
    markPortalKeyDirty(key);
  }

  // 1. Always persist to IndexedDB first (high capacity, survives reloads)
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB save failed for "${key}":`, err);
  }

  // 2. Mirror to localStorage ONLY if serialized payload is compact (< 350 KB).
  // Large payloads (e.g. 125 regions or base64 previews) stay safely in IndexedDB
  // without starving or evicting other sections from localStorage.
  try {
    const serialized = JSON.stringify(value);
    if (serialized.length <= LOCAL_STORAGE_ITEM_CAP) {
      localStorage.setItem(key, serialized);
    } else {
      // Remove oversized key from localStorage so IndexedDB remains the single source of truth
      localStorage.removeItem(key);
    }
  } catch {
    // Quota reached: remove largest non-essential key or this key from localStorage,
    // leaving IndexedDB intact.
    try {
      localStorage.removeItem('sri_custom_regions');
      const serialized = JSON.stringify(value);
      if (serialized.length <= LOCAL_STORAGE_ITEM_CAP) {
        localStorage.setItem(key, serialized);
      }
    } catch {
      // ignore
    }
  }

  // 3. Trigger background Google Drive auto-sync if linked and active
  if (!options.skipDriveSync) {
    import('./googleDrive')
      .then(({ PORTAL_BACKUP_KEYS, scheduleDriveAutoSync }) => {
        if (PORTAL_BACKUP_KEYS.includes(key)) {
          scheduleDriveAutoSync();
        }
      })
      .catch(() => {});
  }
}

export async function deletePersistentItem(key: string): Promise<void> {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export async function loadPersistentItem<T>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) {
    const cached = memoryCache.get(key) as T | undefined;
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  }

  try {
    const db = await openDatabase();
    const idbValue = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
    if (idbValue !== null && idbValue !== undefined) {
      memoryCache.set(key, idbValue);
      return idbValue;
    }
  } catch (err) {
    console.warn(`IndexedDB load failed for "${key}":`, err);
  }

  // Fallback to localStorage if not yet in IndexedDB
  return readSyncCache<T>(key);
}

export function readSyncCache<T>(key: string): T | null {
  if (memoryCache.has(key)) {
    const mem = memoryCache.get(key);
    if (mem !== null && mem !== undefined) {
      return mem as T;
    }
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}
