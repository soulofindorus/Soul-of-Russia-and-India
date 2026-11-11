/**
 * Hybrid IndexedDB + localStorage persistence layer.
 * Browser localStorage is capped at ~5 MB total across all keys and silently
 * fails with QuotaExceededError when storing multiple uploaded photos.
 * IndexedDB provides hundreds of MBs of persistent storage across page reloads.
 */

const DB_NAME = 'sri_cultural_portal_db';
const DB_VERSION = 1;
const STORE_NAME = 'kv_store';

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

export async function savePersistentItem<T>(key: string, value: T): Promise<void> {
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

  // 2. Also update localStorage fast cache if it fits; if quota is exceeded,
  // remove the stale localStorage entry so reload hydrates from IndexedDB instead of stale data.
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  // 3. Trigger background Google Drive auto-sync if linked and active
  import('./googleDrive')
    .then(({ PORTAL_BACKUP_KEYS, scheduleDriveAutoSync }) => {
      if (PORTAL_BACKUP_KEYS.includes(key)) {
        scheduleDriveAutoSync();
      }
    })
    .catch(() => {});
}

export async function loadPersistentItem<T>(key: string): Promise<T | null> {
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
      return idbValue;
    }
  } catch (err) {
    console.warn(`IndexedDB load failed for "${key}":`, err);
  }

  // Fallback to localStorage if not yet in IndexedDB
  return readSyncCache<T>(key);
}

export function readSyncCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
