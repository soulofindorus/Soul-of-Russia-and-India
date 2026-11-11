import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { loadPersistentItem } from './persistentStore';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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

export interface DriveLinkMeta {
  email: string;
  folderId?: string;
  backupFileId?: string;
  lastSyncedAt?: string;
  autoSync: boolean;
}

// In-memory cache only for OAuth access token (never stored in localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedFolderId: string | null = null;

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
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthSuccess?.(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (!user) {
        cachedAccessToken = null;
        cachedFolderId = null;
      }
      onAuthFailure?.();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token.');
    }
    cachedAccessToken = credential.accessToken;
    cachedFolderId = null;

    const existingMeta = getLinkedDriveMeta();
    const folderId = await getOrCreateAppFolder(cachedAccessToken).catch(() => existingMeta?.folderId);
    saveLinkedDriveMeta({
      email: result.user.email || existingMeta?.email || 'Connected Account',
      folderId,
      backupFileId: existingMeta?.backupFileId,
      lastSyncedAt: existingMeta?.lastSyncedAt,
      autoSync: existingMeta?.autoSync ?? true,
    });

    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleDrive = async (): Promise<void> => {
  cachedAccessToken = null;
  cachedFolderId = null;
  saveLinkedDriveMeta(null);
  await auth.signOut();
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentDriveUser = (): User | null => {
  return auth.currentUser;
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

async function makeFilePublicReader(accessToken: string, fileId: string): Promise<void> {
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
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
  } catch {
    // Non-fatal if organization policy restricts anyone-with-link
  }
}

export interface DriveMediaFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  url: string;
}

export async function uploadFileToGoogleDrive(file: File): Promise<DriveMediaFile> {
  const accessToken = cachedAccessToken;
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

  const isVideo = (uploaded.mimeType || file.type || '').startsWith('video/');
  const url = isVideo
    ? `https://drive.google.com/file/d/${uploaded.id}/preview`
    : `https://lh3.googleusercontent.com/d/${uploaded.id}`;

  return {
    id: uploaded.id,
    name: uploaded.name,
    mimeType: uploaded.mimeType,
    size: uploaded.size,
    createdTime: uploaded.createdTime,
    url,
  };
}

export async function listDriveMediaFiles(): Promise<DriveMediaFile[]> {
  const accessToken = cachedAccessToken;
  if (!accessToken) return [];

  const folderId = await getOrCreateAppFolder(accessToken);
  const query = encodeURIComponent(
    `'${folderId}' in parents and trashed = false and name != '${BACKUP_FILE_NAME}'`
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=createdTime desc&pageSize=50&fields=files(id,name,mimeType,size,createdTime)`,
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
  return files.map((f: { id: string; name: string; mimeType: string; size?: string; createdTime?: string }) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: f.size,
    createdTime: f.createdTime,
    url: f.mimeType?.startsWith('video/')
      ? `https://drive.google.com/file/d/${f.id}/preview`
      : `https://lh3.googleusercontent.com/d/${f.id}`,
  }));
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const accessToken = cachedAccessToken;
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
  const accessToken = cachedAccessToken;
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

export async function saveBackupToGoogleDrive(
  payload: Record<string, unknown>,
  existingFileId?: string
): Promise<string> {
  const accessToken = cachedAccessToken;
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
  const accessToken = cachedAccessToken;
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

let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedules a background sync of portal edits to Google Drive whenever
 * an active Drive session and auto-sync are enabled.
 */
export function scheduleDriveAutoSync(): void {
  const meta = getLinkedDriveMeta();
  if (!meta?.autoSync || !cachedAccessToken) return;

  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(async () => {
    try {
      const dataMap: Record<string, unknown> = {};
      for (const key of PORTAL_BACKUP_KEYS) {
        const val = await loadPersistentItem<unknown>(key);
        if (val !== null) {
          dataMap[key] = val;
        }
      }
      const existing = await findDriveBackupFile();
      await saveBackupToGoogleDrive(
        { exportedAt: new Date().toISOString(), data: dataMap },
        existing?.id
      );
    } catch {
      // Non-fatal background sync
    }
  }, 1500);
}
