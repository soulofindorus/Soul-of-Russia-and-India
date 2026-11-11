import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  X,
  Lock,
  Mail,
  LogOut,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  HardDrive,
  CloudUpload,
  CloudDownload,
  RefreshCw,
  Trash2,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import {
  initGoogleDriveAuth,
  signInWithGoogleDrive,
  signOutGoogleDrive,
  getDriveAccessToken,
  getCurrentDriveUser,
  listDriveMediaFiles,
  deleteDriveFile,
  findDriveBackupFile,
  saveBackupToGoogleDrive,
  restoreBackupFromGoogleDrive,
  getLinkedDriveMeta,
  setDriveAutoSync,
  PORTAL_BACKUP_KEYS,
  DriveMediaFile,
  DriveLinkMeta,
  DriveUserInfo,
} from '../utils/googleDrive';
import { loadPersistentItem, savePersistentItem } from '../utils/persistentStore';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  adminEmail?: string;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google Drive state
  const [driveUser, setDriveUser] = useState<DriveUserInfo | null>(() => getCurrentDriveUser());
  const [linkedMeta, setLinkedMeta] = useState<DriveLinkMeta | null>(() => getLinkedDriveMeta());
  const [needsDriveAuth, setNeedsDriveAuth] = useState<boolean>(() => !getDriveAccessToken());
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveStatus, setDriveStatus] = useState<string>('');
  const [driveError, setDriveError] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<DriveMediaFile[]>([]);
  const [showDriveFiles, setShowDriveFiles] = useState(false);

  // Explicit user confirmation states for mutating/destructive Drive operations
  const [pendingConfirm, setPendingConfirm] = useState<
    | { type: 'overwrite_backup'; existingFileId: string }
    | { type: 'restore_backup' }
    | { type: 'delete_file'; file: DriveMediaFile }
    | null
  >(null);

  useEffect(() => {
    const unsub = initGoogleDriveAuth(
      (user) => {
        setDriveUser(user);
        setLinkedMeta(getLinkedDriveMeta());
        setNeedsDriveAuth(false);
      },
      () => {
        setLinkedMeta(getLinkedDriveMeta());
        setNeedsDriveAuth(!getDriveAccessToken());
      }
    );
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = emailInput.trim();
    const cleanPass = passInput.trim();
    const success = onLogin(cleanEmail, cleanPass);

    if (success) {
      setSuccessMsg('Admin credentials verified. You now have full editing access across the site.');
      setTimeout(() => {
        setSuccessMsg('');
        setEmailInput('');
        setPassInput('');
      }, 900);
    } else {
      setErrorMsg('Invalid email or password. Please verify your administrator credentials.');
    }
  };

  const handleGoogleDriveSignIn = async () => {
    setDriveError('');
    setDriveStatus('');
    setIsDriveLoading(true);
    try {
      const result = await signInWithGoogleDrive();
      setDriveUser(result.user);
      setLinkedMeta(getLinkedDriveMeta());
      setNeedsDriveAuth(false);
      setDriveStatus('Google Drive is linked and auto-sync is active. New uploads will save directly to your Drive.');
    } catch (err) {
      setDriveError(
        err instanceof Error ? err.message : 'Google Drive sign-in was cancelled or failed.'
      );
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleGoogleDriveDisconnect = async () => {
    await signOutGoogleDrive();
    setDriveUser(null);
    setLinkedMeta(null);
    setNeedsDriveAuth(true);
    setDriveFiles([]);
    setShowDriveFiles(false);
    setDriveStatus('');
    setDriveError('');
  };

  const handleToggleAutoSync = () => {
    if (!linkedMeta) return;
    const next = !linkedMeta.autoSync;
    setDriveAutoSync(next);
    setLinkedMeta({ ...linkedMeta, autoSync: next });
  };

  const handleLoadDriveFiles = async () => {
    setDriveError('');
    setIsDriveLoading(true);
    try {
      const files = await listDriveMediaFiles();
      setDriveFiles(files);
      setShowDriveFiles(true);
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Could not load Drive files.');
    } finally {
      setIsDriveLoading(false);
    }
  };

  const executeBackupToDrive = async (existingFileId?: string) => {
    setDriveError('');
    setDriveStatus('');
    setIsDriveLoading(true);
    try {
      const payload: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        data: {},
      };
      const dataMap: Record<string, unknown> = {};
      for (const key of PORTAL_BACKUP_KEYS) {
        const val = await loadPersistentItem<unknown>(key);
        if (val !== null) {
          dataMap[key] = val;
        }
      }
      payload.data = dataMap;
      await saveBackupToGoogleDrive(payload, existingFileId);
      setLinkedMeta(getLinkedDriveMeta());
      setDriveStatus('Portal edits & media links backed up to Google Drive.');
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Backup to Google Drive failed.');
    } finally {
      setIsDriveLoading(false);
      setPendingConfirm(null);
    }
  };

  const handleRequestBackup = async () => {
    setDriveError('');
    setDriveStatus('');
    setIsDriveLoading(true);
    try {
      const existing = await findDriveBackupFile();
      if (existing) {
        setPendingConfirm({ type: 'overwrite_backup', existingFileId: existing.id });
        setIsDriveLoading(false);
      } else {
        await executeBackupToDrive();
      }
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Could not check Google Drive backup.');
      setIsDriveLoading(false);
    }
  };

  const executeRestoreFromDrive = async () => {
    setDriveError('');
    setDriveStatus('');
    setIsDriveLoading(true);
    try {
      const backup = await restoreBackupFromGoogleDrive();
      if (!backup || !backup.data || typeof backup.data !== 'object') {
        setDriveError('No backup file found in your Google Drive folder yet.');
      } else {
        const entries = Object.entries(backup.data as Record<string, unknown>);
        for (const [key, val] of entries) {
          await savePersistentItem(key, val);
        }
        setDriveStatus('Backup restored from Google Drive! Reloading site to apply changes...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Restore from Google Drive failed.');
    } finally {
      setIsDriveLoading(false);
      setPendingConfirm(null);
    }
  };

  const executeDeleteDriveFile = async (file: DriveMediaFile) => {
    setDriveError('');
    setIsDriveLoading(true);
    try {
      await deleteDriveFile(file.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));
      setDriveStatus(`Deleted "${file.name}" from Google Drive.`);
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Failed to delete file from Drive.');
    } finally {
      setIsDriveLoading(false);
      setPendingConfirm(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#0b1220] p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">
                Administrator Access
              </h3>
              <p className="text-xs text-amber-300/80">
                Site Management & Google Drive Cloud Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {isAdmin ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Admin Session Active</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  You have full editing access across Heritage, Victory, Archaeology, Articles, Literature, and Achievements.
                </p>
              </div>

              {/* Google Drive Unlimited Cloud Storage Card */}
              <div className="rounded-2xl border border-blue-500/30 bg-slate-900/70 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">
                      Google Drive Cloud Storage
                    </span>
                  </div>
                  {linkedMeta && (
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {needsDriveAuth ? 'Linked (Reconnect Session)' : 'Connected & Auto-Syncing'}
                    </span>
                  )}
                </div>

                {linkedMeta && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px]">
                    <div className="text-slate-300">
                      Linked Account: <span className="font-semibold text-blue-300">{linkedMeta.email}</span>
                      {linkedMeta.lastSyncedAt && (
                        <span className="text-slate-500 ml-2">
                          · Last synced {new Date(linkedMeta.lastSyncedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={linkedMeta.autoSync}
                        onChange={handleToggleAutoSync}
                        className="accent-amber-500 cursor-pointer"
                      />
                      <span>Auto-Sync Edits</span>
                    </label>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Connect your Google Drive so uploaded photos and videos are stored directly in your{' '}
                  <span className="text-slate-200 font-medium">Soul of Russia &amp; India Media</span>{' '}
                  Drive folder with full quality and unlimited capacity.
                </p>

                {driveError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-2.5 text-[11px] text-red-300">
                    {driveError}
                  </div>
                )}

                {driveStatus && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-[11px] text-emerald-300">
                    {driveStatus}
                  </div>
                )}

                {/* Confirmation Dialog for Mutating/Destructive Drive Actions */}
                {pendingConfirm && (
                  <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-3 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2 text-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        {pendingConfirm.type === 'overwrite_backup' &&
                          "Overwrite existing 'sri_portal_backup.json' in your Google Drive with your current portal edits?"}
                        {pendingConfirm.type === 'restore_backup' &&
                          'Restore portal edits from Google Drive? This will replace your current local edits.'}
                        {pendingConfirm.type === 'delete_file' &&
                          `Delete "${pendingConfirm.file.name}" from Google Drive? This action cannot be undone.`}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPendingConfirm(null)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isDriveLoading}
                        onClick={() => {
                          if (pendingConfirm.type === 'overwrite_backup') {
                            void executeBackupToDrive(pendingConfirm.existingFileId);
                          } else if (pendingConfirm.type === 'restore_backup') {
                            void executeRestoreFromDrive();
                          } else if (pendingConfirm.type === 'delete_file') {
                            void executeDeleteDriveFile(pendingConfirm.file);
                          }
                        }}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold cursor-pointer ${
                          pendingConfirm.type === 'delete_file'
                            ? 'bg-red-600 text-white hover:bg-red-500'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                      >
                        {pendingConfirm.type === 'delete_file'
                          ? 'Confirm Delete'
                          : pendingConfirm.type === 'restore_backup'
                          ? 'Confirm Restore'
                          : 'Confirm Overwrite'}
                      </button>
                    </div>
                  </div>
                )}

                {needsDriveAuth ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Official "Sign in with Google" button style */}
                    <button
                      type="button"
                      disabled={isDriveLoading}
                      onClick={handleGoogleDriveSignIn}
                      className="inline-flex items-center gap-3 rounded-full border border-[#747775] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] shadow-sm hover:bg-[#f7f8f8] active:bg-[#eeeeee] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="h-4 w-4 shrink-0"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                      <span>
                        {isDriveLoading
                          ? 'Connecting...'
                          : linkedMeta
                          ? 'Reconnect Drive Session'
                          : 'Sign in with Google'}
                      </span>
                    </button>
                    {linkedMeta && (
                      <button
                        type="button"
                        onClick={handleGoogleDriveDisconnect}
                        className="rounded-xl border border-slate-700 bg-slate-900 hover:border-red-400 px-3 py-2 text-[11px] font-semibold text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        Unlink Drive
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {driveUser?.email && (
                      <div className="text-[11px] text-slate-300">
                        Signed in as <span className="font-semibold text-blue-300">{driveUser.email}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isDriveLoading}
                        onClick={handleRequestBackup}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-[11px] font-bold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>Backup Edits to Drive</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDriveLoading}
                        onClick={() => setPendingConfirm({ type: 'restore_backup' })}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:border-blue-400 px-3 py-2 text-[11px] font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <CloudDownload className="h-3.5 w-3.5" />
                        <span>Restore from Drive</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDriveLoading}
                        onClick={handleLoadDriveFiles}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:border-amber-400 px-3 py-2 text-[11px] font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isDriveLoading ? 'animate-spin' : ''}`} />
                        <span>Manage Drive Files</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleDriveDisconnect}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:border-red-400 px-3 py-2 text-[11px] font-semibold text-slate-400 hover:text-red-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Disconnect</span>
                      </button>
                    </div>

                    {showDriveFiles && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-2 max-h-44 overflow-y-auto">
                        <div className="text-[11px] font-bold text-slate-300">
                          Uploaded Media in Drive ({driveFiles.length})
                        </div>
                        {driveFiles.length === 0 ? (
                          <div className="text-[11px] text-slate-500">
                            No media uploaded to Drive yet. Any photo or video you upload in Edit modals will appear here.
                          </div>
                        ) : (
                          driveFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between gap-2 rounded-lg border border-slate-800/80 bg-slate-900/60 px-2.5 py-1.5 text-[11px]"
                            >
                              <span className="truncate text-slate-200" title={file.name}>
                                {file.name}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                  title="Open file"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setPendingConfirm({ type: 'delete_file', file })}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                  title="Delete from Google Drive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out of Admin</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Add and delete actions are restricted exclusively to the site administrator. Please authenticate with your admin credentials to unlock content editing and Google Drive cloud storage.
              </p>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-red-300">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Administrator Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter administrator email..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Administrator Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    placeholder="Enter administrator password..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-amber-500/70" />
                  Protected Portal
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-500 hover:to-amber-400 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Authenticate Admin</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
