/**
 * Image and media upload processing utilities for live client-side administrative edits.
 * Automatically compresses large camera/gallery photos before saving to prevent localStorage overflow.
 */

/**
 * Resizes and compresses an image file using an offscreen canvas to keep
 * file size well within browser localStorage limits (~150KB-300KB per image instead of 10MB+).
 */
export function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
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

        // High-quality downsampling
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
 * Converts chosen image/video files into Base64 Data URLs.
 * Automatically optimizes images to protect localStorage capacity.
 */
export async function readFileAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Please select a valid image or video file.');
  }

  // Optimize images through canvas compression
  if (file.type.startsWith('image/')) {
    try {
      return await compressImage(file);
    } catch {
      // Fallback to uncompressed data URL if canvas fails
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
 * Returns current localStorage consumption and remaining capacity.
 * Browsers generally allocate 5 MB to 10 MB per origin for synchronous localStorage.
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

  // UTF-16 strings take ~2 bytes per character in JavaScript memory/storage
  const usedBytes = totalChars * 2;
  const usedKB = (usedBytes / 1024).toFixed(1);
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
  const estimatedLimitMB = 5.0; // Standard baseline for Chrome, Safari, Firefox
  const percentUsed = ((parseFloat(usedMB) / estimatedLimitMB) * 100).toFixed(1);

  return {
    usedBytes,
    usedKB,
    usedMB,
    estimatedLimitMB,
    percentUsed,
  };
}

/**
 * Extracts the file ID from any standard Google Drive shareable link.
 * Matches:
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/...
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^&]+&)*id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]{20,})/
  );
  return match ? match[1] : null;
}

/**
 * Converts any media URL:
 * If the link is a Google Drive share link, converts it to Google's direct CDN
 * image stream (https://lh3.googleusercontent.com/d/FILE_ID) which displays
 * in full original resolution in <img> tags without consuming any localStorage!
 */
export function normalizeMediaUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return trimmed;
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


