import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { initialRussianRegions, initialIndianRegions } from '../data/regionsData';
import { soulStoriesData, heritageVideosData } from '../data/videosData';
import { initialOpportunities } from '../data/opportunitiesData';
import { heroicStoriesData, victoryQuotesData } from '../data/victoryData';
import { archaeologicalSitesData } from '../data/archaeologyData';
import { initialArticlesData } from '../data/articlesData';
import { authorsData } from '../data/literatureData';
import {
  DEFAULT_FEATURED_ACHIEVEMENT,
  DEFAULT_ACHIEVEMENT_ITEMS,
} from '../data/achievementsData';
import {
  loadPersistentItem,
  savePersistentItem,
  notifyPortalDataSynced,
} from './persistentStore';

export const ADMIN_EMAIL = 'ritikbalwan23@gmail.com';
const PENDING_PUBLIC_KEYS_STORAGE = 'sri_pending_public_publish_keys';
export const PUBLIC_CLOUD_STATUS_EVENT = 'sri:public-cloud-status';

export const PORTAL_SECTION_KEYS = [
  'sri_custom_regions',
  'sri_custom_soul_stories',
  'sri_custom_videos',
  'sri_custom_opportunities',
  'sri_custom_heroic_stories',
  'sri_victory_quotes',
  'sri_custom_archaeology_sites',
  'sri_custom_articles',
  'sri_custom_authors',
  'sri_featured_achievement',
  'sri_achievements_list',
] as const;

interface CloudSectionDoc {
  sectionKey: string;
  deletedIds: string[];
  orderIds: string[];
  isPublic: boolean;
}

interface CloudEntryDoc {
  entryId: string;
  sectionKey: string;
  itemId: string;
  payload: Record<string, unknown>;
  isPublic: boolean;
}

export interface PublicSyncStatus {
  isPublishing: boolean;
  lastPublishedAt: string | null;
  pendingKeysCount: number;
  lastError: string | null;
}

let syncStarted = false;
let unsubscribeSections: (() => void) | null = null;
let unsubscribeEntries: (() => void) | null = null;

const latestCloudSections = new Map<string, CloudSectionDoc>();
const latestCloudEntries = new Map<string, CloudEntryDoc>();
let applyMergeTimer: ReturnType<typeof setTimeout> | null = null;

let isPublishingNow = false;
let lastPublishedAt: string | null = null;
let lastPublishError: string | null = null;
const publishTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emitStatusUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(PUBLIC_CLOUD_STATUS_EVENT, {
        detail: getPublicSyncStatus(),
      })
    );
  }
}

export function getPublicSyncStatus(): PublicSyncStatus {
  return {
    isPublishing: isPublishingNow,
    lastPublishedAt,
    pendingKeysCount: getPendingPublicPublishKeys().length,
    lastError: lastPublishError,
  };
}

export function toSafeFirestoreId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned.slice(0, 160) || `id_${Date.now()}`;
}

export function canPublishToPublicCloud(): boolean {
  const user = auth.currentUser;
  if (!user) return false;
  return (
    user.email?.toLowerCase() === ADMIN_EMAIL &&
    user.emailVerified === true
  );
}

export function getPendingPublicPublishKeys(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_PUBLIC_KEYS_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markPendingPublicPublishKey(key: string): void {
  try {
    const set = new Set(getPendingPublicPublishKeys());
    set.add(key);
    localStorage.setItem(PENDING_PUBLIC_KEYS_STORAGE, JSON.stringify(Array.from(set)));
    emitStatusUpdate();
  } catch {
    // ignore
  }
}

export function clearPendingPublicPublishKey(key: string): void {
  try {
    const set = new Set(getPendingPublicPublishKeys());
    if (set.delete(key)) {
      localStorage.setItem(PENDING_PUBLIC_KEYS_STORAGE, JSON.stringify(Array.from(set)));
      emitStatusUpdate();
    }
  } catch {
    // ignore
  }
}

function getDefaultDataset(sectionKey: string): unknown {
  switch (sectionKey) {
    case 'sri_custom_regions':
      return [...initialRussianRegions, ...initialIndianRegions];
    case 'sri_custom_soul_stories':
      return soulStoriesData;
    case 'sri_custom_videos':
      return heritageVideosData;
    case 'sri_custom_opportunities':
      return initialOpportunities;
    case 'sri_custom_heroic_stories':
      return heroicStoriesData;
    case 'sri_victory_quotes':
      return victoryQuotesData;
    case 'sri_custom_archaeology_sites':
      return archaeologicalSitesData;
    case 'sri_custom_articles':
      return initialArticlesData;
    case 'sri_custom_authors':
      return authorsData;
    case 'sri_featured_achievement':
      return DEFAULT_FEATURED_ACHIEVEMENT;
    case 'sri_achievements_list':
      return DEFAULT_ACHIEVEMENT_ITEMS;
    default:
      return null;
  }
}

/**
 * Recursively strips undefined values and normalizes data for Firestore Maps/Lists.
 */
function sanitizeForFirestore<T>(val: T): T {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = sanitizeForFirestore(v);
      }
    }
    return out as T;
  }
  return val;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>).filter(
      (k) => (a as Record<string, unknown>)[k] !== undefined
    );
    const keysB = Object.keys(b as Record<string, unknown>).filter(
      (k) => (b as Record<string, unknown>)[k] !== undefined
    );
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (
        !deepEqual(
          (a as Record<string, unknown>)[k],
          (b as Record<string, unknown>)[k]
        )
      ) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function computeShortHash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= c ^ (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

function shrinkDataUrlIfNeeded(dataUrl: string, maxChars = 650_000): Promise<string> {
  if (dataUrl.length <= maxChars || typeof document === 'undefined') {
    return Promise.resolve(dataUrl);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 900;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.72);
        resolve(compressed.length <= 850_000 ? compressed : canvas.toDataURL('image/jpeg', 0.55));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Publishes a compressed web-ready image to `/portal_media/{mediaId}` so every visitor
 * on any browser can load it without Google Drive authentication or CORS/cookie issues.
 */
export async function publishPublicMediaDoc(
  rawMediaId: string,
  dataUrl: string,
  mimeType = 'image/jpeg',
  driveFileId?: string
): Promise<string | null> {
  if (!canPublishToPublicCloud()) return null;
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const safeId = toSafeFirestoreId(rawMediaId);
  const compactDataUrl = await shrinkDataUrlIfNeeded(dataUrl);
  if (compactDataUrl.length > 890_000) {
    return null;
  }

  const docPath = `portal_media/${safeId}`;
  const docRef = doc(db, 'portal_media', safeId);

  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      const updateFields: Record<string, unknown> = {
        dataUrl: compactDataUrl,
        mimeType: mimeType.slice(0, 64),
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      };
      if (driveFileId) {
        updateFields.driveFileId = driveFileId.slice(0, 160);
      }
      await updateDoc(docRef, updateFields);
    } else {
      const createFields: Record<string, unknown> = {
        mediaId: safeId,
        dataUrl: compactDataUrl,
        mimeType: mimeType.slice(0, 64),
        isPublic: true,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (driveFileId) {
        createFields.driveFileId = driveFileId.slice(0, 160);
      }
      await setDoc(docRef, createFields);
    }
    return safeId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

/**
 * Reads a public media document from Firestore (`/portal_media/{mediaId}`).
 */
export async function fetchPublicMediaDataUrl(rawMediaId: string): Promise<string | null> {
  const safeId = toSafeFirestoreId(rawMediaId);
  const docPath = `portal_media/${safeId}`;
  try {
    const snap = await getDoc(doc(db, 'portal_media', safeId));
    if (!snap.exists()) return null;
    const data = snap.data() as { dataUrl?: string };
    return typeof data?.dataUrl === 'string' ? data.dataUrl : null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
      handleFirestoreError(err, OperationType.GET, docPath);
    }
    return null;
  }
}

const MEDIA_FIELDS = new Set([
  'image',
  'imageUrl',
  'thumbnail',
  'thumbnailUrl',
  'portrait',
  'portraitUrl',
  'mediaUrl',
]);

/**
 * Ensures any uploaded `data:` images or Google Drive previews on a modified item
 * are published to `/portal_media/{mediaId}` and replaced with compact `sri-media://`
 * references inside Firestore `portal_entries`.
 */
async function prepareItemMediaForPublicCloud(
  item: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { extractGoogleDriveFileId } = await import('./imageUpload');
  const next: Record<string, unknown> = { ...item };

  const processUrl = async (val: string): Promise<string> => {
    const trimmed = val.trim();
    if (!trimmed) return trimmed;

    // 1. Data URL: extract to `/portal_media/img_{hash}` and store compact reference
    if (trimmed.startsWith('data:image/')) {
      const mediaId = `img_${computeShortHash(trimmed)}`;
      const mimeMatch = trimmed.match(/^data:([^;]+);base64,/i);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const publishedId = await publishPublicMediaDoc(mediaId, trimmed, mimeType).catch(() => null);
      if (publishedId) {
        return `sri-media://${publishedId}`;
      }
      return trimmed;
    }

    // 2. Google Drive URL: also publish local Drive preview backup to `/portal_media/drive_{id}`
    const driveId = extractGoogleDriveFileId(trimmed);
    if (driveId) {
      const preview = await loadPersistentItem<string>(`sri_drive_preview_${driveId}`);
      if (preview && preview.startsWith('data:image/')) {
        void publishPublicMediaDoc(`drive_${driveId}`, preview, 'image/jpeg', driveId).catch(
          () => {}
        );
      }
    }

    return trimmed;
  };

  for (const field of MEDIA_FIELDS) {
    const v = next[field];
    if (typeof v === 'string' && v.trim()) {
      next[field] = await processUrl(v);
    }
  }

  if (Array.isArray(next.galleryImages)) {
    next.galleryImages = await Promise.all(
      next.galleryImages.map((g) => (typeof g === 'string' ? processUrl(g) : g))
    );
  }

  return sanitizeForFirestore(next);
}

async function upsertPortalEntryDoc(
  sectionKey: string,
  itemId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const safeSectionKey = toSafeFirestoreId(sectionKey);
  const safeItemId = toSafeFirestoreId(itemId);
  const entryId = toSafeFirestoreId(`${safeSectionKey}__${safeItemId}`);
  const docPath = `portal_entries/${entryId}`;
  const docRef = doc(db, 'portal_entries', entryId);

  const sanitizedPayload = sanitizeForFirestore({
    ...payload,
    id: typeof payload.id === 'string' && payload.id ? payload.id : itemId,
  });

  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      await updateDoc(docRef, {
        payload: sanitizedPayload,
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        entryId,
        sectionKey: safeSectionKey,
        itemId: safeItemId,
        payload: sanitizedPayload,
        isPublic: true,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

async function upsertPortalSectionMetaDoc(
  sectionKey: string,
  deletedIds: string[],
  orderIds: string[]
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const safeSectionKey = toSafeFirestoreId(sectionKey);
  const docPath = `portal_sections/${safeSectionKey}`;
  const docRef = doc(db, 'portal_sections', safeSectionKey);

  const cleanDeleted = deletedIds.map((id) => String(id).slice(0, 160)).slice(0, 500);
  const cleanOrder = orderIds.map((id) => String(id).slice(0, 160)).slice(0, 500);

  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      await updateDoc(docRef, {
        deletedIds: cleanDeleted,
        orderIds: cleanOrder,
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      });
    } else if (cleanDeleted.length > 0 || cleanOrder.length > 0) {
      await setDoc(docRef, {
        sectionKey: safeSectionKey,
        deletedIds: cleanDeleted,
        orderIds: cleanOrder,
        isPublic: true,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

/**
 * Publishes any changed/added/deleted items in `sectionKey` from local storage to public Firestore.
 */
export async function publishSectionToPublicCloud(sectionKey: string): Promise<boolean> {
  if (!canPublishToPublicCloud()) {
    markPendingPublicPublishKey(sectionKey);
    return false;
  }

  const localVal = await loadPersistentItem<unknown>(sectionKey);
  if (localVal === null || localVal === undefined) {
    clearPendingPublicPublishKey(sectionKey);
    return false;
  }

  const defaultVal = getDefaultDataset(sectionKey);

  if (sectionKey === 'sri_featured_achievement' && typeof localVal === 'object' && !Array.isArray(localVal)) {
    const defaultObj = defaultVal as Record<string, unknown>;
    if (!deepEqual(sanitizeForFirestore(localVal), sanitizeForFirestore(defaultObj))) {
      const prepared = await prepareItemMediaForPublicCloud(localVal as Record<string, unknown>);
      await upsertPortalEntryDoc(sectionKey, 'featured', prepared);
    }
    clearPendingPublicPublishKey(sectionKey);
    lastPublishedAt = new Date().toISOString();
    lastPublishError = null;
    emitStatusUpdate();
    return true;
  }

  if (!Array.isArray(localVal) || !Array.isArray(defaultVal)) {
    return false;
  }

  const defaultItems = defaultVal as Array<Record<string, unknown>>;
  const localItems = localVal as Array<Record<string, unknown>>;

  const defaultById = new Map<string, Record<string, unknown>>();
  defaultItems.forEach((d) => {
    if (d && d.id) defaultById.set(String(d.id), sanitizeForFirestore(d));
  });

  const localById = new Map<string, Record<string, unknown>>();
  localItems.forEach((l) => {
    if (l && l.id) localById.set(String(l.id), sanitizeForFirestore(l));
  });

  // 1. Identify modified default items & newly added custom items
  const changedOrCustomItems: Array<{ id: string; item: Record<string, unknown> }> = [];
  const customOrderIds: string[] = [];

  for (const item of localItems) {
    if (!item || !item.id) continue;
    const id = String(item.id);
    const defItem = defaultById.get(id);
    if (!defItem) {
      customOrderIds.push(id);
      changedOrCustomItems.push({ id, item });
    } else if (!deepEqual(sanitizeForFirestore(item), defItem)) {
      changedOrCustomItems.push({ id, item });
    }
  }

  // 2. Deleted default items
  const deletedIds = defaultItems
    .filter((d) => d && d.id && !localById.has(String(d.id)))
    .map((d) => String(d.id));

  // 3. Upsert changed/custom items in Firestore
  const activeEntryIds = new Set<string>();
  for (const { id, item } of changedOrCustomItems) {
    const prepared = await prepareItemMediaForPublicCloud(item);
    await upsertPortalEntryDoc(sectionKey, id, prepared);
    activeEntryIds.add(toSafeFirestoreId(`${toSafeFirestoreId(sectionKey)}__${toSafeFirestoreId(id)}`));
  }

  // 4. Delete obsolete entries in Firestore for this section that are no longer customized/present
  for (const [entryId, entryDoc] of latestCloudEntries.entries()) {
    if (entryDoc.sectionKey === sectionKey && !activeEntryIds.has(entryId)) {
      const docPath = `portal_entries/${entryId}`;
      try {
        await deleteDoc(doc(db, 'portal_entries', entryId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  }

  // 5. Update section metadata (deletedIds & custom order)
  await upsertPortalSectionMetaDoc(sectionKey, deletedIds, customOrderIds);

  clearPendingPublicPublishKey(sectionKey);
  lastPublishedAt = new Date().toISOString();
  lastPublishError = null;
  emitStatusUpdate();
  return true;
}

/**
 * Publishes all locally modified sections (regions, stories, articles, etc.) to public Firestore.
 */
export async function publishAllLocalEditsToPublicCloud(): Promise<number> {
  if (!canPublishToPublicCloud()) return 0;

  isPublishingNow = true;
  lastPublishError = null;
  emitStatusUpdate();

  let publishedCount = 0;
  try {
    for (const key of PORTAL_SECTION_KEYS) {
      const ok = await publishSectionToPublicCloud(key);
      if (ok) publishedCount += 1;
    }
    return publishedCount;
  } catch (err) {
    lastPublishError = err instanceof Error ? err.message : 'Failed to publish updates.';
    emitStatusUpdate();
    throw err;
  } finally {
    isPublishingNow = false;
    emitStatusUpdate();
  }
}

export function schedulePublicCloudPublish(sectionKey: string): void {
  if (!(PORTAL_SECTION_KEYS as readonly string[]).includes(sectionKey)) return;

  if (!canPublishToPublicCloud()) {
    markPendingPublicPublishKey(sectionKey);
    return;
  }

  const prev = publishTimers.get(sectionKey);
  if (prev) clearTimeout(prev);

  publishTimers.set(
    sectionKey,
    setTimeout(() => {
      publishTimers.delete(sectionKey);
      isPublishingNow = true;
      emitStatusUpdate();
      publishSectionToPublicCloud(sectionKey)
        .catch((err) => {
          lastPublishError = err instanceof Error ? err.message : 'Publish failed.';
          markPendingPublicPublishKey(sectionKey);
        })
        .finally(() => {
          isPublishingNow = false;
          emitStatusUpdate();
        });
    }, 350)
  );
}

/**
 * Hydrates any `sri-media://` URLs referenced inside cloud payloads before notifying UI.
 */
async function warmPublicMediaRefsFromPayloads(payloads: Array<Record<string, unknown>>): Promise<void> {
  const mediaIds = new Set<string>();

  const inspectVal = (val: unknown) => {
    if (typeof val === 'string' && val.startsWith('sri-media://')) {
      mediaIds.add(val.slice('sri-media://'.length));
    } else if (Array.isArray(val)) {
      val.forEach(inspectVal);
    }
  };

  for (const p of payloads) {
    for (const field of MEDIA_FIELDS) {
      inspectVal(p[field]);
    }
    inspectVal(p.galleryImages);
  }

  if (mediaIds.size === 0) return;

  const { warmPublicMediaById } = await import('./imageUpload');
  await Promise.all(Array.from(mediaIds).map((id) => warmPublicMediaById(id)));
}

/**
 * Merges live Firestore `portal_sections` + `portal_entries` with defaults and writes to local store
 * so ALL visitors (in any browser) immediately render admin updates.
 */
async function applyCloudSnapshotToLocalPortal(): Promise<void> {
  const pendingSet = new Set(getPendingPublicPublishKeys());
  const allPayloads: Array<Record<string, unknown>> = [];

  for (const entry of latestCloudEntries.values()) {
    if (entry.payload) allPayloads.push(entry.payload);
  }

  await warmPublicMediaRefsFromPayloads(allPayloads);

  let updatedAny = false;

  for (const sectionKey of PORTAL_SECTION_KEYS) {
    // Do not overwrite an admin's unpublished local edits before they sign in to publish
    if (pendingSet.has(sectionKey) && !canPublishToPublicCloud()) {
      continue;
    }

    const sectionEntries: CloudEntryDoc[] = [];
    for (const entry of latestCloudEntries.values()) {
      if (entry.sectionKey === sectionKey) {
        sectionEntries.push(entry);
      }
    }
    const sectionMeta = latestCloudSections.get(sectionKey);

    if (sectionEntries.length === 0 && !sectionMeta) {
      continue;
    }

    if (sectionKey === 'sri_featured_achievement') {
      const featEntry = sectionEntries.find((e) => e.itemId === 'featured') || sectionEntries[0];
      if (featEntry?.payload) {
        const mergedObj = { ...DEFAULT_FEATURED_ACHIEVEMENT, ...featEntry.payload };
        await savePersistentItem(sectionKey, mergedObj, {
          skipDirty: true,
          skipDriveSync: true,
          skipPublicPublish: true,
        });
        updatedAny = true;
      }
      continue;
    }

    const defaultVal = getDefaultDataset(sectionKey);
    if (!Array.isArray(defaultVal)) continue;

    const defaultItems = defaultVal as Array<Record<string, unknown>>;
    const defaultIds = new Set(defaultItems.map((d) => String(d.id)));
    const deletedSet = new Set(sectionMeta?.deletedIds || []);

    const overrideById = new Map<string, Record<string, unknown>>();
    for (const entry of sectionEntries) {
      const id = String(entry.payload?.id || entry.itemId);
      overrideById.set(id, entry.payload);
    }

    // Custom added items ordered by `orderIds`
    const customOrdered: Record<string, unknown>[] = [];
    const seenCustom = new Set<string>();
    for (const ordId of sectionMeta?.orderIds || []) {
      const item = overrideById.get(ordId);
      if (item && !defaultIds.has(ordId)) {
        customOrdered.push(item);
        seenCustom.add(ordId);
      }
    }
    for (const [id, item] of overrideById.entries()) {
      if (!defaultIds.has(id) && !seenCustom.has(id)) {
        customOrdered.push(item);
        seenCustom.add(id);
      }
    }

    // Default items merged with any cloud overrides, excluding deleted defaults
    const mergedDefaults = defaultItems
      .filter((def) => !deletedSet.has(String(def.id)))
      .map((def) => {
        const id = String(def.id);
        const override = overrideById.get(id);
        return override ? { ...def, ...override } : def;
      });

    const finalArray = [...customOrdered, ...mergedDefaults];
    await savePersistentItem(sectionKey, finalArray, {
      skipDirty: true,
      skipDriveSync: true,
      skipPublicPublish: true,
    });
    updatedAny = true;
  }

  if (updatedAny) {
    notifyPortalDataSynced();
  }
}

function scheduleApplyCloudMerge(): void {
  if (applyMergeTimer) clearTimeout(applyMergeTimer);
  applyMergeTimer = setTimeout(() => {
    void applyCloudSnapshotToLocalPortal();
  }, 60);
}

/**
 * Starts public Firestore read & real-time sync for all site visitors (no login required).
 */
export function startPublicCloudSync(): () => void {
  if (syncStarted) {
    return () => {};
  }
  syncStarted = true;

  const sectionsQuery = query(
    collection(db, 'portal_sections'),
    where('isPublic', '==', true)
  );
  const entriesQuery = query(
    collection(db, 'portal_entries'),
    where('isPublic', '==', true)
  );

  // Initial fast one-shot fetch
  Promise.all([getDocs(sectionsQuery), getDocs(entriesQuery)])
    .then(([secSnap, entSnap]) => {
      latestCloudSections.clear();
      secSnap.forEach((d) => {
        latestCloudSections.set(d.id, d.data() as CloudSectionDoc);
      });

      latestCloudEntries.clear();
      entSnap.forEach((d) => {
        latestCloudEntries.set(d.id, d.data() as CloudEntryDoc);
      });

      return applyCloudSnapshotToLocalPortal();
    })
    .catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        handleFirestoreError(err, OperationType.LIST, 'portal_entries');
      }
    });

  // Real-time listeners so live updates appear immediately across browsers
  unsubscribeSections = onSnapshot(
    sectionsQuery,
    (snapshot) => {
      latestCloudSections.clear();
      snapshot.forEach((d) => {
        latestCloudSections.set(d.id, d.data() as CloudSectionDoc);
      });
      scheduleApplyCloudMerge();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portal_sections');
    }
  );

  unsubscribeEntries = onSnapshot(
    entriesQuery,
    (snapshot) => {
      latestCloudEntries.clear();
      snapshot.forEach((d) => {
        latestCloudEntries.set(d.id, d.data() as CloudEntryDoc);
      });
      scheduleApplyCloudMerge();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portal_entries');
    }
  );

  const unsubscribeAuth = onAuthStateChanged(auth, () => {
    emitStatusUpdate();
    if (canPublishToPublicCloud() && getPendingPublicPublishKeys().length > 0) {
      void publishAllLocalEditsToPublicCloud().catch(() => {});
    }
  });

  return () => {
    unsubscribeSections?.();
    unsubscribeEntries?.();
    unsubscribeAuth();
    unsubscribeSections = null;
    unsubscribeEntries = null;
    syncStarted = false;
  };
}
