import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { auth } from '../lib/firebase';
import {
  loadPersistentItem,
  savePersistentItem,
  getDirtyPortalKeys,
  notifyPortalDataSynced,
} from './persistentStore';

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const GIS_SCOPES = ['https://www.googleapis.com/auth/drive.file', 'openid', 'email', 'profile'];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({ prompt: 'select_account' });

const APP_FOLDER_NAME = 'Soul of Russia & India Media';
const BACKUP_FILE_NAME = 'sri_portal_backup.json';
const DRIVE_LINK_META_KEY = 'sri_drive_link_meta';

export const PORTAL_BACKUP_KEYS = [
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
];

export interface DriveStorageQuota {
  limitBytes?: number;
  usageBytes?: number;
  usageInDriveBytes?: number;
}

export interface DriveLinkMeta {
  email: string;
  displayName?: string;
  folderId?: string;
  backupFileId?: string;
  lastSyncedAt?: string;
  autoSync: boolean;
  storageQuota?: DriveStorageQuota;
}

export interface DriveUserInfo {
  email: string | null;
  displayName?: string | null;
}

// In-memory cache only for OAuth access token (never stored in localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedTokenExpiresAt = 0;
let cachedFolderId: string | null = null;
let cachedDriveUser: DriveUserInfo | null = null;

// Eagerly initialized GIS token client so popup opens synchronously on click
interface GisTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GisTokenClient {
  requestAccessToken: (opts?: { prompt?: string; login_hint?: string }) => void;
}

let gisTokenClient: GisTokenClient | null = null;
let pendingGisResolve: ((resp: GisTokenResponse) => void) | null = null;
let pendingGisReject: ((err: Error) => void) | null = null;

function getGisOauth2() {
  if (typeof window === 'undefined') return undefined;
  const win = window as unknown as {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: GisTokenResponse) => void;
            error_callback?: (err: { type?: string; message?: string }) => void;
          }) => GisTokenClient;
        };
      };
    };
  };
  return win.google?.accounts?.oauth2;
}

function ensureGisTokenClient(): GisTokenClient | null {
  if (gisTokenClient) return gisTokenClient;
  const oauth2 = getGisOauth2();
  const clientId = (firebaseConfig as { oAuthClientId?: string }).oAuthClientId;
  if (!oauth2 || !clientId) return null;

  gisTokenClient = oauth2.initTokenClient({
    client_id: clientId,
    scope: GIS_SCOPES.join(' '),
    callback: (resp: GisTokenResponse) => {
      if (resp.error || !resp.access_token) {
        const msg = resp.error_description || resp.error || 'Google Drive authorization was cancelled.';
        pendingGisReject?.(new Error(msg));
      } else {
        pendingGisResolve?.(resp);
      }
      pendingGisResolve = null;
      pendingGisReject = null;
    },
    error_callback: (err) => {
      const msg =
        err?.type === 'popup_closed'
          ? 'Google sign-in window was closed before completing.'
          : err?.type === 'popup_failed_to_open'
          ? 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.'
          : err?.message || 'Google Drive connection failed.';
      pendingGisReject?.(new Error(msg));
      pendingGisResolve = null;
      pendingGisReject = null;
    },
  });

  return gisTokenClient;
}

/**
 * Call early on app mount/modal open so GIS token client is initialized
 * BEFORE the user clicks "Sign in with Google".
 */
export function preloadGoogleDriveClient(): void {
  if (typeof window === 'undefined') return;
  if (ensureGisTokenClient()) return;

  const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
  if (existing) {
    existing.addEventListener('load', () => {
      ensureGisTokenClient();
    });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    ensureGisTokenClient();
  };
  document.head.appendChild(script);
}

let firebaseDomainRejected = false;

export function getDriveAuthDiagnostics() {
  return {
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    hostname: typeof window !== 'undefined' ? window.location.hostname : '',
    projectId: firebaseConfig.projectId,
    oAuthClientId: (firebaseConfig as { oAuthClientId?: string }).oAuthClientId || '',
    authDomain: firebaseConfig.authDomain,
  };
}

function isTokenValid(): boolean {
  if (!cachedAccessToken) return false;
  if (cachedTokenExpiresAt && Date.now() >= cachedTokenExpiresAt - 60_000) {
    return false;
  }
  return true;
}

export function getLinkedDriveMeta(): DriveLinkMeta | null {
  try {
    const raw = localStorage.getItem(DRIVE_LINK_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DriveLinkMeta;
  } catch {
    return null;
  }
}

function saveLinkedDriveMeta(meta: DriveLinkMeta | null): void {
  try {
    if (!meta) {
      localStorage.removeItem(DRIVE_LINK_META_KEY);
    } else {
      localStorage.setItem(DRIVE_LINK_META_KEY, JSON.stringify(meta));
    }
  } catch {
    // ignore
  }
}

export const initGoogleDriveAuth = (
  onAuthSuccess?: (user: DriveUserInfo, token: string) => void,
  onAuthFailure?: () => void
) => {
  preloadGoogleDriveClient();
  return onAuthStateChanged(auth, (user: User | null) => {
    if ((user || cachedDriveUser) && isTokenValid()) {
      const info: DriveUserInfo = user
        ? { email: user.email, displayName: user.displayName }
        : cachedDriveUser!;
      onAuthSuccess?.(info, cachedAccessToken!);
    } else if (!isSigningIn) {
      if (!user && !cachedDriveUser) {
        cachedAccessToken = null;
        cachedFolderId = null;
      }
      onAuthFailure?.();
    }
  });
};

async function fetchDriveAboutInfo(accessToken: string): Promise<{
  user: DriveUserInfo;
  storageQuota?: DriveStorageQuota;
}> {
  try {
    const res = await fetch(
      'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,displayName),storageQuota(limit,usage,usageInDrive)',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const user: DriveUserInfo = {
        email: data.user?.emailAddress || getLinkedDriveMeta()?.email || 'Connected Google Account',
        displayName: data.user?.displayName || null,
      };
      const storageQuota: DriveStorageQuota | undefined = data.storageQuota
        ? {
            limitBytes: data.storageQuota.limit ? Number(data.storageQuota.limit) : undefined,
            usageBytes: data.storageQuota.usage ? Number(data.storageQuota.usage) : undefined,
            usageInDriveBytes: data.storageQuota.usageInDrive
              ? Number(data.storageQuota.usageInDrive)
              : undefined,
          }
        : undefined;
      return { user, storageQuota };
    }
  } catch {
    // non-fatal
  }
  return {
    user: { email: getLinkedDriveMeta()?.email || 'Connected Google Account' },
  };
}

function requestGisTokenSynchronously(promptMode: 'select_account' | 'consent' | '' = 'select_account'): Promise<GisTokenResponse> {
  const client = ensureGisTokenClient();
  if (!client) {
    return Promise.reject(
      new Error('Google Sign-In is still initializing. Please wait a second and click again.')
    );
  }

  return new Promise<GisTokenResponse>((resolve, reject) => {
    pendingGisResolve = resolve;
    pendingGisReject = reject;

    const meta = getLinkedDriveMeta();
    const opts: { prompt?: string; login_hint?: string } = { prompt: promptMode };
    if (meta?.email && meta.email !== 'Connected Google Account') {
      opts.login_hint = meta.email;
    }

    try {
      client.requestAccessToken(opts);
    } catch (err) {
      pendingGisResolve = null;
      pendingGisReject = null;
      reject(err instanceof Error ? err : new Error('Failed to open Google sign-in window.'));
    }
  });
}

export interface ConnectDriveResult {
  user: DriveUserInfo;
  accessToken: string;
  restoredCount: number;
  storageQuota?: DriveStorageQuota;
}

export const signInWithGoogleDrive = async (): Promise<ConnectDriveResult> => {
  isSigningIn = true;
  try {
    let accessToken: string;
    let expiresIn = 3500;
    let userInfo: DriveUserInfo = { email: null };

    const meta = getLinkedDriveMeta();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    // 1. Primary path (per Google Workspace / Firebase Auth spec):
    //    Use Firebase signInWithPopup which routes OAuth via authDomain (firebaseapp.com/__/auth/handler)
    //    and avoids GIS Error 400: origin_mismatch on preview domains whenever Firebase Authorized Domains includes this host.
    if (!firebaseDomainRejected) {
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential?.accessToken) {
          throw new Error('Failed to obtain Google Drive access token.');
        }
        accessToken = credential.accessToken;
        userInfo = { email: result.user.email, displayName: result.user.displayName };
      } catch (firebaseErr: unknown) {
        const code = (firebaseErr as { code?: string })?.code || '';
        if (
          code === 'auth/unauthorized-domain' ||
          code === 'auth/operation-not-supported-in-this-environment'
        ) {
          firebaseDomainRejected = true;
          try {
            const resp = await requestGisTokenSynchronously(meta?.email ? '' : 'select_account');
            if (!resp.access_token) {
              throw new Error('Failed to obtain Google Drive access token.');
            }
            accessToken = resp.access_token;
            expiresIn = resp.expires_in || 3500;
            try {
              const cred = GoogleAuthProvider.credential(null, accessToken);
              const fbRes = await signInWithCredential(auth, cred);
              userInfo = { email: fbRes.user.email, displayName: fbRes.user.displayName };
            } catch {
              // Non-fatal if Firebase ID token exchange unavailable
            }
          } catch (gisErr: unknown) {
            const gisMsg = gisErr instanceof Error ? gisErr.message : String(gisErr);
            if (gisMsg.toLowerCase().includes('popup_failed_to_open') || gisMsg.toLowerCase().includes('pop-up')) {
              throw new Error(
                `Domain "${hostname}" is not yet authorized in Firebase Auth, and the fallback popup was blocked. Please allow pop-ups or authorize "${origin}" below.`
              );
            }
            throw new Error(
              `Origin/Domain authorization required (origin_mismatch / auth/unauthorized-domain) for "${origin}". Register this URL in Google Cloud Console (Authorized JavaScript origins) or Firebase Authentication (Authorized domains).`
            );
          }
        } else {
          throw firebaseErr;
        }
      }
    } else {
      // 2. Direct GIS path (when Firebase rejected domain; triggered synchronously on click)
      try {
        const resp = await requestGisTokenSynchronously(meta?.email ? '' : 'select_account').catch(
          (err: Error) => {
            if (meta?.email && err.message.includes('consent')) {
              return requestGisTokenSynchronously('select_account');
            }
            throw err;
          }
        );
        if (!resp.access_token) {
          throw new Error('Failed to obtain Google Drive access token.');
        }
        accessToken = resp.access_token;
        expiresIn = resp.expires_in || 3500;
        try {
          const cred = GoogleAuthProvider.credential(null, accessToken);
          const fbRes = await signInWithCredential(auth, cred);
          userInfo = { email: fbRes.user.email, displayName: fbRes.user.displayName };
        } catch {
          // Non-fatal
        }
      } catch (gisErr: unknown) {
        const gisMsg = gisErr instanceof Error ? gisErr.message : String(gisErr);
        throw new Error(
          `${gisMsg} (If you saw Error 400: origin_mismatch, register "${origin}" under Authorized JavaScript origins in Google Cloud Console or add "${hostname}" to Firebase Authorized domains.)`
        );
      }
    }

    cachedAccessToken = accessToken;
    cachedTokenExpiresAt = Date.now() + expiresIn * 1000;
    cachedFolderId = null;

    const about = await fetchDriveAboutInfo(accessToken);
    if (!userInfo.email) {
      userInfo = about.user;
    }
    cachedDriveUser = userInfo;

    const existingMeta = getLinkedDriveMeta();
    const folderId = await getOrCreateAppFolder(accessToken).catch(() => existingMeta?.folderId);
    saveLinkedDriveMeta({
      email: userInfo.email || existingMeta?.email || 'Connected Account',
      displayName: userInfo.displayName || existingMeta?.displayName,
      folderId,
      backupFileId: existingMeta?.backupFileId,
      lastSyncedAt: existingMeta?.lastSyncedAt,
      autoSync: existingMeta?.autoSync ?? true,
      storageQuota: about.storageQuota || existingMeta?.storageQuota,
    });

    // Automatically restore/merge any saved items from Google Drive so nothing is ever lost!
    const restoredCount = await syncWithGoogleDriveBackup().catch(() => 0);

    // Publish all restored/local edits to Public Cloud Firestore so everyone sees updates in any browser
    import('./publicCloudSync')
      .then(({ publishAllLocalEditsToPublicCloud }) => publishAllLocalEditsToPublicCloud())
      .catch(() => {});

    return {
      user: userInfo,
      accessToken,
      restoredCount,
      storageQuota: about.storageQuota,
    };
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleDrive = async (): Promise<void> => {
  cachedAccessToken = null;
  cachedTokenExpiresAt = 0;
  cachedFolderId = null;
  cachedDriveUser = null;
  saveLinkedDriveMeta(null);
  try {
    await auth.signOut();
  } catch {
    // ignore
  }
};

export const getDriveAccessToken = (): string | null => {
  return isTokenValid() ? cachedAccessToken : null;
};

export const getCurrentDriveUser = (): DriveUserInfo | null => {
  if (cachedDriveUser) return cachedDriveUser;
  if (auth.currentUser) {
    return { email: auth.currentUser.email, displayName: auth.currentUser.displayName };
  }
  const meta = getLinkedDriveMeta();
  if (meta?.email) {
    return { email: meta.email, displayName: meta.displayName };
  }
  return null;
};

export const setDriveAutoSync = (enabled: boolean): void => {
  const meta = getLinkedDriveMeta();
  if (meta) {
    saveLinkedDriveMeta({ ...meta, autoSync: enabled });
  }
};

async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  if (cachedFolderId) return cachedFolderId;

  const query = encodeURIComponent(
    `name = '${APP_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (Array.isArray(searchData.files) && searchData.files.length > 0) {
      cachedFolderId = searchData.files[0].id;
      return cachedFolderId!;
    }
  } else if (searchRes.status === 401) {
    cachedAccessToken = null;
    throw new Error('Google Drive session expired. Please reconnect.');
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Could not create media folder in Google Drive.');
  }
  const created = await createRes.json();
  cachedFolderId = created.id;
  return cachedFolderId!;
}

async function makeFilePublicReader(accessToken: string, fileId: string): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
      if (res.ok) return true;
    } catch {
      // retry once
    }
  }
  return false;
}

export interface DriveMediaFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  url: string;
}

export function buildDriveMediaUrl(fileId: string, mimeType?: string): string {
  const isVideo = (mimeType || '').startsWith('video/');
  if (isVideo) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // Google Drive's official thumbnail CDN is far more resilient than lh3.googleusercontent.com/d/ across Safari & Chrome
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

export async function uploadFileToGoogleDrive(file: File): Promise<DriveMediaFile> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) {
    throw new Error('Google Drive session needs to be unlocked.');
  }

  const folderId = await getOrCreateAppFolder(accessToken);

  const metadata = {
    name: `${Date.now()}_${file.name}`,
    parents: [folderId],
    mimeType: file.type || 'application/octet-stream',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!uploadRes.ok) {
    if (uploadRes.status === 401) {
      cachedAccessToken = null;
    }
    throw new Error(`Google Drive upload failed (${uploadRes.status}).`);
  }

  const uploaded = await uploadRes.json();
  await makeFilePublicReader(accessToken, uploaded.id);

  const mimeType = uploaded.mimeType || file.type || '';
  const url = buildDriveMediaUrl(uploaded.id, mimeType);

  return {
    id: uploaded.id,
    name: uploaded.name,
    mimeType,
    size: uploaded.size,
    createdTime: uploaded.createdTime,
    url,
  };
}

export async function fetchDriveFileBlob(fileId: string): Promise<Blob | null> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) return null;

  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

export async function fetchDriveFileBlobUrl(fileId: string): Promise<string | null> {
  const blob = await fetchDriveFileBlob(fileId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function listDriveMediaFiles(): Promise<DriveMediaFile[]> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) return [];

  const folderId = await getOrCreateAppFolder(accessToken);
  const query = encodeURIComponent(
    `'${folderId}' in parents and trashed = false and name != '${BACKUP_FILE_NAME}'`
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=createdTime desc&pageSize=100&fields=files(id,name,mimeType,size,createdTime)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) cachedAccessToken = null;
    throw new Error('Failed to list Google Drive files.');
  }

  const data = await res.json();
  const files = Array.isArray(data.files) ? data.files : [];
  return files.map(
    (f: { id: string; name: string; mimeType: string; size?: string; createdTime?: string }) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size,
      createdTime: f.createdTime,
      url: buildDriveMediaUrl(f.id, f.mimeType),
    })
  );
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) throw new Error('Google Drive session is not active.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 404) {
    if (res.status === 401) cachedAccessToken = null;
    throw new Error('Failed to delete file from Google Drive.');
  }
}

export async function findDriveBackupFile(): Promise<{ id: string; modifiedTime?: string } | null> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) return null;

  const folderId = await getOrCreateAppFolder(accessToken);
  const query = encodeURIComponent(
    `'${folderId}' in parents and name = '${BACKUP_FILE_NAME}' and trashed = false`
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,modifiedTime)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data.files) && data.files.length > 0 ? data.files[0] : null;
}

function mergeArrayById(localArr: unknown[], driveArr: unknown[]): unknown[] {
  const byId = new Map<string, Record<string, unknown>>();
  const orderedIds: string[] = [];

  for (const item of driveArr) {
    if (item && typeof item === 'object' && 'id' in item) {
      const id = String((item as { id: unknown }).id);
      byId.set(id, item as Record<string, unknown>);
      orderedIds.push(id);
    }
  }
  for (const item of localArr) {
    if (item && typeof item === 'object' && 'id' in item) {
      const id = String((item as { id: unknown }).id);
      if (!byId.has(id)) {
        orderedIds.unshift(id);
      }
      byId.set(id, { ...(byId.get(id) || {}), ...(item as Record<string, unknown>) });
    }
  }
  return orderedIds.map((id) => byId.get(id)!).filter(Boolean);
}

export async function saveBackupToGoogleDrive(
  payload: Record<string, unknown>,
  existingFileId?: string
): Promise<string> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) throw new Error('Google Drive session is not active.');

  const folderId = await getOrCreateAppFolder(accessToken);
  const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

  let fileId = existingFileId;
  if (fileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: jsonBlob,
      }
    );
    if (!res.ok) throw new Error('Failed to update Google Drive backup.');
    const data = await res.json();
    fileId = data.id;
  } else {
    const form = new FormData();
    form.append(
      'metadata',
      new Blob(
        [
          JSON.stringify({
            name: BACKUP_FILE_NAME,
            parents: [folderId],
            mimeType: 'application/json',
          }),
        ],
        { type: 'application/json' }
      )
    );
    form.append('file', jsonBlob);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );
    if (!res.ok) throw new Error('Failed to create Google Drive backup.');
    const data = await res.json();
    fileId = data.id;
  }

  const meta = getLinkedDriveMeta();
  if (meta) {
    saveLinkedDriveMeta({
      ...meta,
      folderId,
      backupFileId: fileId,
      lastSyncedAt: new Date().toISOString(),
    });
  }
  return fileId!;
}

export async function restoreBackupFromGoogleDrive(): Promise<Record<string, unknown> | null> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) throw new Error('Google Drive session is not active.');

  const existing = await findDriveBackupFile();
  if (!existing) return null;

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) throw new Error('Failed to download Google Drive backup.');
  return (await res.json()) as Record<string, unknown>;
}

/**
 * Smart non-destructive sync on Drive connect:
 * 1. Downloads existing `sri_portal_backup.json` from Google Drive (if any).
 * 2. Restores/merges any Drive items missing locally into IndexedDB & notifies the UI.
 * 3. Only writes back locally modified ("dirty") keys so a fresh session NEVER wipes Drive items.
 */
export async function syncWithGoogleDriveBackup(): Promise<number> {
  const accessToken = getDriveAccessToken();
  if (!accessToken) return 0;

  let restoredKeys = 0;
  const existing = await findDriveBackupFile();
  let driveData: Record<string, unknown> = {};

  if (existing) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        const parsed = (await res.json()) as { data?: Record<string, unknown> };
        if (parsed?.data && typeof parsed.data === 'object') {
          driveData = parsed.data;
        }
      }
    } catch {
      // ignore read failure
    }
  }

  const dirtySet = new Set(getDirtyPortalKeys());
  const mergedPayload: Record<string, unknown> = { ...driveData };

  for (const key of PORTAL_BACKUP_KEYS) {
    const localVal = await loadPersistentItem<unknown>(key);
    const driveVal = driveData[key];

    if (driveVal !== undefined && driveVal !== null) {
      if (localVal === null || localVal === undefined || !dirtySet.has(key)) {
        // Local has no edits for this key: restore authoritative Drive version
        await savePersistentItem(key, driveVal, {
          skipDirty: true,
          skipDriveSync: true,
          skipPublicPublish: true,
        });
        restoredKeys += 1;
      } else if (Array.isArray(localVal) && Array.isArray(driveVal)) {
        // Both modified: merge unique items by id
        const combined = mergeArrayById(localVal, driveVal);
        mergedPayload[key] = combined;
        await savePersistentItem(key, combined, {
          skipDirty: true,
          skipDriveSync: true,
          skipPublicPublish: true,
        });
        restoredKeys += 1;
      } else {
        mergedPayload[key] = localVal;
      }
    } else if (localVal !== null && localVal !== undefined) {
      mergedPayload[key] = localVal;
    }
  }

  // Validate cached image integrity against synced Drive data & warm verified previews BEFORE notifying UI
  try {
    const { validateAndWarmMediaFromPersistedData } = await import('./imageUpload');
    await validateAndWarmMediaFromPersistedData(mergedPayload);
  } catch {
    // Non-fatal
  }

  if (restoredKeys > 0) {
    notifyPortalDataSynced();
  }

  // If there were local edits not yet in Drive, upload the merged backup
  if (Object.keys(mergedPayload).length > 0 && (!existing || dirtySet.size > 0)) {
    await saveBackupToGoogleDrive(
      { exportedAt: new Date().toISOString(), data: mergedPayload },
      existing?.id
    );
  } else if (existing) {
    const meta = getLinkedDriveMeta();
    if (meta) {
      saveLinkedDriveMeta({
        ...meta,
        backupFileId: existing.id,
        lastSyncedAt: new Date().toISOString(),
      });
    }
  }

  return restoredKeys;
}

let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;

async function flushDriveAutoSyncNow(): Promise<void> {
  const meta = getLinkedDriveMeta();
  const accessToken = getDriveAccessToken();
  if (!meta?.autoSync || !accessToken) return;

  try {
    const existing = await findDriveBackupFile();
    let existingData: Record<string, unknown> = {};
    if (existing) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.ok) {
          const parsed = (await res.json()) as { data?: Record<string, unknown> };
          if (parsed?.data && typeof parsed.data === 'object') {
            existingData = parsed.data;
          }
        }
      } catch {
        // ignore
      }
    }

    const dirtySet = new Set(getDirtyPortalKeys());
    const dataMap: Record<string, unknown> = { ...existingData };

    for (const key of PORTAL_BACKUP_KEYS) {
      const localVal = await loadPersistentItem<unknown>(key);
      if (localVal === null || localVal === undefined) continue;

      if (!existingData[key] || dirtySet.has(key)) {
        if (Array.isArray(localVal) && Array.isArray(existingData[key])) {
          // Preserve items from Drive that aren't in local unless local is authoritative
          dataMap[key] = localVal;
        } else {
          dataMap[key] = localVal;
        }
      }
    }

    await saveBackupToGoogleDrive(
      { exportedAt: new Date().toISOString(), data: dataMap },
      existing?.id
    );
  } catch {
    // Non-fatal background sync
  }
}

/**
 * Schedules a fast background sync of portal edits to Google Drive whenever
 * an active Drive session and auto-sync are enabled.
 */
export function scheduleDriveAutoSync(): void {
  const meta = getLinkedDriveMeta();
  if (!meta?.autoSync || !getDriveAccessToken()) return;

  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    void flushDriveAutoSyncNow();
  }, 500);
}
