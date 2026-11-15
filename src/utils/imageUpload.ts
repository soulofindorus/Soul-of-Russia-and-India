/**
 * Image and media upload processing, caching, and integrity validation utilities.
 *
 * Caching & Integrity Architecture (prevents UI flickering on reloads):
 * 1. Persistent Cache Storage (`sri-media-cache-v1`) + IndexedDB (`sri_drive_preview_{id}`)
 *    store verified image payloads locally with zero 5 MB localStorage quota impact.
 * 2. Integrity Manifest (`sri_media_integrity_manifest_v1`) stores canonical Drive sync URLs,
 *    MIME types, byte lengths, and FNV-1a binary checksums.
 * 3. On reload (before React's first paint) and after Google Drive sync completes,
 *    `validateAndWarmMediaFromPersistedData()` reconciles cached images against the
 *    authoritative persisted Drive sync records, purges stale/corrupted payloads (such as
 *    HTML error responses), and hydrates verified `blob:`/`data:` URLs into a synchronous
 *    in-memory map (`resolvedMediaSrcMemory`) so `normalizeMediaUrl()` resolves cached
 *    sources on Render #1 with zero flickering.
 */
import {
  getDriveAccessToken,
  uploadFileToGoogleDrive,
  fetchDriveFileBlob,
  PORTAL_BACKUP_KEYS,
} from './googleDrive';
import {
  loadPersistentItem,
  savePersistentItem,
  deletePersistentItem,
  getPersistentMemorySnapshot,
  readSyncCache,
} from './persistentStore';

export const MEDIA_CACHE_NAME = 'sri-media-cache-v1';
const MEDIA_INTEGRITY_MANIFEST_KEY = 'sri_media_integrity_manifest_v1';

export interface MediaIntegrityRecord {
  mediaKey: string;
  canonicalUrl: string;
  driveId?: string;
  integrityHash: string;
  byteLength: number;
  mimeType: string;
  verifiedAt: number;
}

export interface MediaIntegrityReport {
  totalReferenced: number;
  verifiedFromCache: number;
  invalidatedCount: number;
  warmedCount: number;
}

// Synchronous memory caches populated before first render and on upload/sync
const resolvedMediaSrcMemory = new Map<string, string>();
const inflightWarmups = new Map<string, Promise<string | null>>();
let manifestCache: Record<string, MediaIntegrityRecord> | null = null;

function readManifest(): Record<string, MediaIntegrityRecord> {
  if (manifestCache) return manifestCache;
  const stored = readSyncCache<Record<string, MediaIntegrityRecord>>(MEDIA_INTEGRITY_MANIFEST_KEY);
  manifestCache = stored && typeof stored === 'object' ? { ...stored } : {};
  return manifestCache;
}

function persistManifest(next: Record<string, MediaIntegrityRecord>): void {
  manifestCache = next;
  void savePersistentItem(MEDIA_INTEGRITY_MANIFEST_KEY, next, {
    skipDirty: true,
    skipDriveSync: true,
  });
}

function getCanonicalDriveUrl(driveId: string): string {
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
}

function getMediaKey(canonicalUrl: string, driveId?: string | null): string {
  return driveId ? `drive:${driveId}` : `url:${canonicalUrl}`;
}

function getCacheStorageKey(canonicalUrl: string, driveId?: string | null): string {
  // Always use an HTTPS URL so Cache Storage .put/.match accepts it in all browsers
  return driveId
    ? `https://sri-media-cache.local/drive/${encodeURIComponent(driveId)}`
    : canonicalUrl;
}

/**
 * Deterministic split 64-bit FNV-1a integrity hash over binary bytes.
 */
export function computeBytesIntegrityHash(bytes: Uint8Array): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < bytes.byteLength; i++) {
    const b = bytes[i];
    h1 ^= b;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= b ^ (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}-${h2.toString(16).padStart(8, '0')}-${bytes.byteLength}`;
}

/**
 * Validates binary payload magic bytes + MIME type so HTML error/login pages are never cached.
 */
export function isValidImageBytes(mimeType: string, bytes: Uint8Array): boolean {
  if (!bytes || bytes.byteLength < 12) return false;

  const lowerMime = (mimeType || '').toLowerCase();
  if (lowerMime.includes('text/html') || lowerMime.includes('application/json')) {
    return false;
  }

  // Reject HTML/XML error responses disguised with generic content-type
  const headAscii = String.fromCharCode(...bytes.slice(0, Math.min(32, bytes.byteLength)))
    .trimStart()
    .toLowerCase();
  if (headAscii.startsWith('<!doctype') || headAscii.startsWith('<html')) {
    return false;
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true;
  }
  // GIF: GIF87a / GIF89a
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return true;
  }
  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return true;
  }
  // SVG
  if (lowerMime.includes('svg') || headAscii.startsWith('<svg') || headAscii.includes('<svg')) {
    return true;
  }
  // BMP / ICO / AVIF fallback if server explicitly labeled image/*
  if (lowerMime.startsWith('image/') && bytes.byteLength >= 32) {
    return true;
  }

  return false;
}

export function isValidImageDataUrl(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  if (!/^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) {
    return false;
  }
  return dataUrl.length > 64;
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } | null {
  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;
    const header = dataUrl.slice(0, commaIdx);
    const base64 = dataUrl.slice(commaIdx + 1);
    const mimeMatch = header.match(/^data:([^;]+);base64$/i);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    if (!isValidImageBytes(mimeType, bytes)) return null;
    return { blob: new Blob([bytes], { type: mimeType }), mimeType };
  } catch {
    return null;
  }
}

async function openMediaCache(): Promise<Cache | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  try {
    return await window.caches.open(MEDIA_CACHE_NAME);
  } catch {
    return null;
  }
}

async function storeVerifiedBlobInCache(
  canonicalUrl: string,
  driveId: string | null,
  blob: Blob
): Promise<string | null> {
  try {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const mimeType = blob.type || 'image/jpeg';
    if (!isValidImageBytes(mimeType, bytes)) {
      return null;
    }

    const integrityHash = computeBytesIntegrityHash(bytes);
    const mediaKey = getMediaKey(canonicalUrl, driveId);
    const cacheKey = getCacheStorageKey(canonicalUrl, driveId);

    const cache = await openMediaCache();
    if (cache) {
      const response = new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(bytes.byteLength),
          'X-SRI-Integrity': integrityHash,
          'X-SRI-Canonical-URL': canonicalUrl,
        },
      });
      await cache.put(cacheKey, response);
    }

    const manifest = readManifest();
    manifest[mediaKey] = {
      mediaKey,
      canonicalUrl,
      driveId: driveId || undefined,
      integrityHash,
      byteLength: bytes.byteLength,
      mimeType,
      verifiedAt: Date.now(),
    };
    persistManifest(manifest);

    // Promote immediately into synchronous memory cache (reuse single object URL per key)
    const existingObjUrl = resolvedMediaSrcMemory.get(mediaKey);
    if (existingObjUrl && existingObjUrl.startsWith('blob:')) {
      return existingObjUrl;
    }

    const blobUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    resolvedMediaSrcMemory.set(mediaKey, blobUrl);
    resolvedMediaSrcMemory.set(canonicalUrl, blobUrl);
    if (driveId) {
      resolvedMediaSrcMemory.set(getCanonicalDriveUrl(driveId), blobUrl);
    }
    return blobUrl;
  } catch {
    return null;
  }
}

async function readAndVerifyCachedBlobUrl(
  canonicalUrl: string,
  driveId: string | null
): Promise<string | null> {
  const mediaKey = getMediaKey(canonicalUrl, driveId);
  const existing = resolvedMediaSrcMemory.get(mediaKey) || resolvedMediaSrcMemory.get(canonicalUrl);
  if (existing) return existing;

  const cache = await openMediaCache();
  if (!cache) return null;

  const cacheKey = getCacheStorageKey(canonicalUrl, driveId);
  try {
    const matched = await cache.match(cacheKey);
    if (!matched) return null;

    const buffer = await matched.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const mimeType = matched.headers.get('Content-Type') || 'image/jpeg';

    if (!isValidImageBytes(mimeType, bytes)) {
      await cache.delete(cacheKey);
      return null;
    }

    const manifest = readManifest();
    const record = manifest[mediaKey];
    const computedHash = computeBytesIntegrityHash(bytes);

    // Validate canonical source & binary checksum against integrity manifest
    if (record) {
      const canonicalMismatch = record.canonicalUrl !== canonicalUrl;
      const hashMismatch =
        Boolean(record.integrityHash) && record.integrityHash !== computedHash;
      const sizeMismatch =
        record.byteLength > 0 && record.byteLength !== bytes.byteLength;

      if (canonicalMismatch || hashMismatch || sizeMismatch) {
        await cache.delete(cacheKey);
        delete manifest[mediaKey];
        persistManifest(manifest);
        return null;
      }
    } else {
      // Backfill manifest record if Cache Storage holds a verified binary image
      manifest[mediaKey] = {
        mediaKey,
        canonicalUrl,
        driveId: driveId || undefined,
        integrityHash: computedHash,
        byteLength: bytes.byteLength,
        mimeType,
        verifiedAt: Date.now(),
      };
      persistManifest(manifest);
    }

    const blobUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    resolvedMediaSrcMemory.set(mediaKey, blobUrl);
    resolvedMediaSrcMemory.set(canonicalUrl, blobUrl);
    if (driveId) {
      resolvedMediaSrcMemory.set(getCanonicalDriveUrl(driveId), blobUrl);
    }
    return blobUrl;
  } catch {
    return null;
  }
}

/**
 * Recursively collects all persisted image/media URLs from PORTAL_BACKUP_KEYS datasets.
 */
function collectPersistedMediaSources(
  dataMap: Record<string, unknown>
): Array<{ rawUrl: string; canonicalUrl: string; driveId: string | null }> {
  const seen = new Set<string>();
  const collected: Array<{ rawUrl: string; canonicalUrl: string; driveId: string | null }> = [];
  const mediaFieldNames = new Set([
    'image',
    'imageUrl',
    'thumbnail',
    'thumbnailUrl',
    'portrait',
    'portraitUrl',
    'mediaUrl',
    'galleryImages',
  ]);

  const inspectString = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return;
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) return;

    const driveId = extractGoogleDriveFileId(trimmed);
    const canonicalUrl = driveId ? getCanonicalDriveUrl(driveId) : trimmed;
    const key = getMediaKey(canonicalUrl, driveId);
    if (seen.has(key)) return;
    seen.add(key);
    collected.push({ rawUrl: trimmed, canonicalUrl, driveId });
  };

  const walk = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && mediaFieldNames.has(k)) {
          inspectString(v);
        } else if (Array.isArray(v) && k === 'galleryImages') {
          for (const g of v) {
            if (typeof g === 'string') inspectString(g);
          }
        } else if (v && typeof v === 'object') {
          walk(v);
        }
      }
    }
  };

  for (const key of PORTAL_BACKUP_KEYS) {
    if (key in dataMap) {
      walk(dataMap[key]);
    }
  }

  return collected;
}

/**
 * Validates cached image integrity against persisted Google Drive sync data and hydrates
 * verified `blob:`/`data:` URLs synchronously into memory to eliminate reload flickering.
 */
export async function validateAndWarmMediaFromPersistedData(
  explicitDataMap?: Record<string, unknown>
): Promise<MediaIntegrityReport> {
  const snapshot = explicitDataMap || getPersistentMemorySnapshot();
  const sources = collectPersistedMediaSources(snapshot);
  const manifest = readManifest();
  const activeKeys = new Set(sources.map((s) => getMediaKey(s.canonicalUrl, s.driveId)));

  let verifiedFromCache = 0;
  let invalidatedCount = 0;
  let warmedCount = 0;

  // 1. Invalidate manifest/cache entries whose canonical URL changed in Drive sync
  let manifestChanged = false;
  for (const [key, record] of Object.entries(manifest)) {
    const matchingSource = sources.find(
      (s) => getMediaKey(s.canonicalUrl, s.driveId) === key
    );
    if (matchingSource && record.canonicalUrl !== matchingSource.canonicalUrl) {
      const cache = await openMediaCache();
      await cache?.delete(getCacheStorageKey(record.canonicalUrl, record.driveId || null));
      resolvedMediaSrcMemory.delete(key);
      resolvedMediaSrcMemory.delete(record.canonicalUrl);
      delete manifest[key];
      manifestChanged = true;
      invalidatedCount += 1;
    } else if (sources.length > 0 && !activeKeys.has(key) && Date.now() - record.verifiedAt > 86_400_000) {
      // Prune orphaned cache entries older than 24h no longer referenced by synced data
      const cache = await openMediaCache();
      await cache?.delete(getCacheStorageKey(record.canonicalUrl, record.driveId || null));
      resolvedMediaSrcMemory.delete(key);
      resolvedMediaSrcMemory.delete(record.canonicalUrl);
      delete manifest[key];
      manifestChanged = true;
      invalidatedCount += 1;
    }
  }
  if (manifestChanged) {
    persistManifest(manifest);
  }

  // 2. Hydrate verified Cache API blobs and IndexedDB `sri_drive_preview_*` entries into memory
  await Promise.all(
    sources.map(async ({ rawUrl, canonicalUrl, driveId }) => {
      const mediaKey = getMediaKey(canonicalUrl, driveId);
      if (resolvedMediaSrcMemory.has(mediaKey)) {
        verifiedFromCache += 1;
        return;
      }

      // Check Cache Storage first
      const cachedBlobUrl = await readAndVerifyCachedBlobUrl(canonicalUrl, driveId);
      if (cachedBlobUrl) {
        resolvedMediaSrcMemory.set(rawUrl, cachedBlobUrl);
        verifiedFromCache += 1;
        return;
      }

      // Fallback: check IndexedDB `sri_drive_preview_{id}` and promote verified preview into Cache + memory
      if (driveId) {
        const previewKey = `sri_drive_preview_${driveId}`;
        const previewDataUrl = await loadPersistentItem<string>(previewKey);
        if (previewDataUrl) {
          if (!isValidImageDataUrl(previewDataUrl)) {
            await deletePersistentItem(previewKey);
            invalidatedCount += 1;
            return;
          }
          const converted = dataUrlToBlob(previewDataUrl);
          if (converted) {
            const promotedUrl = await storeVerifiedBlobInCache(
              canonicalUrl,
              driveId,
              converted.blob
            );
            if (promotedUrl) {
              resolvedMediaSrcMemory.set(rawUrl, promotedUrl);
              verifiedFromCache += 1;
              return;
            }
          }
          // Even if Cache Storage is unavailable (e.g. strict private browsing), promote verified data URL
          resolvedMediaSrcMemory.set(mediaKey, previewDataUrl);
          resolvedMediaSrcMemory.set(canonicalUrl, previewDataUrl);
          resolvedMediaSrcMemory.set(rawUrl, previewDataUrl);
          verifiedFromCache += 1;
          return;
        }
      }

      // If Drive OAuth session is currently unlocked, quietly warm uncached Drive images in background
      if (driveId && getDriveAccessToken()) {
        const warmed = await warmSingleMediaSource(canonicalUrl, driveId);
        if (warmed) {
          resolvedMediaSrcMemory.set(rawUrl, warmed);
          warmedCount += 1;
        }
      }
    })
  );

  return {
    totalReferenced: sources.length,
    verifiedFromCache,
    invalidatedCount,
    warmedCount,
  };
}

/**
 * Fetches & caches a single Drive or same-origin media asset with integrity validation.
 */
async function warmSingleMediaSource(
  canonicalUrl: string,
  driveId: string | null
): Promise<string | null> {
  const mediaKey = getMediaKey(canonicalUrl, driveId);
  const existing = resolvedMediaSrcMemory.get(mediaKey);
  if (existing) return existing;

  const inflight = inflightWarmups.get(mediaKey);
  if (inflight) return inflight;

  const task = (async () => {
    try {
      // 1. Check existing Cache API entry first
      const fromCache = await readAndVerifyCachedBlobUrl(canonicalUrl, driveId);
      if (fromCache) return fromCache;

      // 2. If Drive ID and authenticated, fetch exact binary via Drive API (reliable CORS + auth)
      if (driveId && getDriveAccessToken()) {
        const blob = await fetchDriveFileBlob(driveId);
        if (blob) {
          const cached = await storeVerifiedBlobInCache(canonicalUrl, driveId, blob);
          if (cached) return cached;
        }
      }

      // 3. For same-origin static assets (e.g. /cultural_images/*), cache with CORS/same-origin check
      if (canonicalUrl.startsWith('/')) {
        const res = await fetch(canonicalUrl);
        if (res.ok) {
          const blob = await res.blob();
          const cached = await storeVerifiedBlobInCache(canonicalUrl, null, blob);
          if (cached) return cached;
        }
      }

      return null;
    } catch {
      return null;
    } finally {
      inflightWarmups.delete(mediaKey);
    }
  })();

  inflightWarmups.set(mediaKey, task);
  return task;
}

/**
 * Resizes and compresses an image file using an offscreen canvas to keep
 * file size compact (~100KB-250KB per image instead of 10MB+).
 */
export function compressImage(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or GIF, preserve as raw data URL without lossy canvas conversion
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts chosen image/video files into a persistent media URL.
 * - If Google Drive is connected: uploads full-quality file straight to Google Drive,
 *   caches the verified binary payload in Cache Storage (`sri-media-cache-v1`), records
 *   its integrity hash, AND saves a local preview in IndexedDB for instant flicker-free display.
 * - Otherwise: compresses images locally to IndexedDB.
 */
export async function readFileAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Please select a valid image or video file.');
  }

  if (getDriveAccessToken()) {
    try {
      const uploaded = await uploadFileToGoogleDrive(file);
      if (uploaded?.url) {
        if (file.type.startsWith('image/') && uploaded.id) {
          const canonicalUrl = getCanonicalDriveUrl(uploaded.id);
          // Cache the exact uploaded image blob immediately with integrity verification
          void storeVerifiedBlobInCache(canonicalUrl, uploaded.id, file);

          // Also keep compact preview in IndexedDB as durable secondary backup
          compressImage(file, 800, 800, 0.72)
            .then((previewDataUrl) =>
              savePersistentItem(`sri_drive_preview_${uploaded.id}`, previewDataUrl, {
                skipDirty: true,
                skipDriveSync: true,
              })
            )
            .catch(() => {});
        }
        return uploaded.url;
      }
    } catch (err) {
      console.warn('Google Drive upload failed, falling back to local compressed storage:', err);
    }
  }

  // Local compressed storage fallback
  if (file.type.startsWith('image/')) {
    try {
      return await compressImage(file);
    } catch {
      // Fallback to raw data URL if canvas fails
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts the Google Drive file ID from share links, lh3 CDN URLs, or thumbnail URLs.
 */
export function extractGoogleDriveFileId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|thumbnail\?(?:[^&]+&)*id=|uc\?(?:[^&]+&)*id=)|docs\.google\.com\/file\/d\/|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{20,})/
  );
  return match ? match[1] : null;
}

/**
 * Resolves a media URL synchronously using the integrity-verified memory cache when available,
 * preventing reload flicker for Google Drive and cached assets.
 */
export function normalizeMediaUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const driveId = extractGoogleDriveFileId(trimmed);
  const canonicalUrl = driveId ? getCanonicalDriveUrl(driveId) : trimmed;
  const mediaKey = getMediaKey(canonicalUrl, driveId);

  const cachedSrc =
    resolvedMediaSrcMemory.get(mediaKey) ||
    resolvedMediaSrcMemory.get(canonicalUrl) ||
    resolvedMediaSrcMemory.get(trimmed);

  if (cachedSrc) {
    return cachedSrc;
  }

  // Quietly warm Drive or local assets in background for subsequent views/reloads
  if ((driveId && getDriveAccessToken()) || canonicalUrl.startsWith('/')) {
    void warmSingleMediaSource(canonicalUrl, driveId);
  }

  return canonicalUrl;
}

/**
 * Multi-stage integrity-checked image error fallback handler:
 * 0. Check verified Cache Storage (`sri-media-cache-v1`)
 * 1. Try alternate Drive URL (`lh3.googleusercontent.com/d/{id}` or `drive.google.com/thumbnail?id={id}`)
 * 2. Check IndexedDB cached preview (`sri_drive_preview_{id}`) with structural integrity check
 * 3. Fetch directly from Drive API with active OAuth token, validate & promote to Cache Storage
 * 4. Only then fall back to `fallbackUrl`
 */
export async function handleMediaImageError(
  imgEl: HTMLImageElement,
  originalUrl: string | undefined,
  fallbackUrl: string
): Promise<void> {
  const stage = Number(imgEl.dataset.fallbackStage || '0');
  const driveId = extractGoogleDriveFileId(originalUrl || imgEl.src);

  if (driveId) {
    const canonicalUrl = getCanonicalDriveUrl(driveId);

    if (stage < 1) {
      imgEl.dataset.fallbackStage = '1';

      // Check verified Cache Storage first before hitting network again
      const verifiedCached = await readAndVerifyCachedBlobUrl(canonicalUrl, driveId);
      if (verifiedCached && imgEl.src !== verifiedCached) {
        imgEl.src = verifiedCached;
        return;
      }

      imgEl.src = imgEl.src.includes('lh3.googleusercontent.com')
        ? canonicalUrl
        : `https://lh3.googleusercontent.com/d/${driveId}`;
      return;
    }

    if (stage < 2) {
      imgEl.dataset.fallbackStage = '2';
      const previewKey = `sri_drive_preview_${driveId}`;
      const cached = await loadPersistentItem<string>(previewKey);
      if (cached) {
        if (isValidImageDataUrl(cached)) {
          const converted = dataUrlToBlob(cached);
          if (converted) {
            const promoted = await storeVerifiedBlobInCache(
              canonicalUrl,
              driveId,
              converted.blob
            );
            if (promoted) {
              imgEl.src = promoted;
              return;
            }
          }
          resolvedMediaSrcMemory.set(getMediaKey(canonicalUrl, driveId), cached);
          imgEl.src = cached;
          return;
        }
        // Purge corrupted preview from IndexedDB
        await deletePersistentItem(previewKey);
      }
    }

    if (stage < 3) {
      imgEl.dataset.fallbackStage = '3';
      const blob = await fetchDriveFileBlob(driveId);
      if (blob) {
        const verifiedUrl = await storeVerifiedBlobInCache(canonicalUrl, driveId, blob);
        if (verifiedUrl) {
          imgEl.src = verifiedUrl;
          return;
        }
      }
    }
  }

  if (imgEl.dataset.fallbackApplied !== 'true') {
    imgEl.dataset.fallbackApplied = 'true';
    imgEl.src = fallbackUrl;
  }
}

/**
 * If the link is a Google Drive video link, converts it to the official embed preview player:
 * https://drive.google.com/file/d/FILE_ID/preview
 */
export function getDriveVideoEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const driveId = extractGoogleDriveFileId(url.trim());
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return null;
}

/**
 * Returns media cache and integrity statistics for diagnostics or inspection.
 */
export function getMediaCacheStats(): {
  verifiedMemoryEntries: number;
  manifestRecords: number;
} {
  const manifest = readManifest();
  return {
    verifiedMemoryEntries: resolvedMediaSrcMemory.size,
    manifestRecords: Object.keys(manifest).length,
  };
}

/**
 * Returns current localStorage consumption and remaining capacity.
 */
export function getLocalStorageUsage(): {
  usedBytes: number;
  usedKB: string;
  usedMB: string;
  estimatedLimitMB: number;
  percentUsed: string;
} {
  let totalChars = 0;
  try {
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalChars += (localStorage[key]?.length || 0) + key.length;
      }
    }
  } catch (e) {
    console.warn('Unable to measure localStorage', e);
  }

  const usedBytes = totalChars * 2;
  const usedKB = (usedBytes / 1024).toFixed(1);
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
  const estimatedLimitMB = 5.0;
  const percentUsed = ((parseFloat(usedMB) / estimatedLimitMB) * 100).toFixed(1);

  return {
    usedBytes,
    usedKB,
    usedMB,
    estimatedLimitMB,
    percentUsed,
  };
}
