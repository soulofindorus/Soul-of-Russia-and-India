import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, X, Lock, Mail, LogOut, CheckCircle2, KeyRound, Eye, EyeOff } from 'lucide-react';

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
        onClose();
      }, 900);
    } else {
      setErrorMsg('Invalid email or password. Please verify your administrator credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0b1220] p-6 shadow-2xl text-slate-200">
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
                Site Management & Content Controls
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
        <div className="mt-5 space-y-4">
          {isAdmin ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Admin Session Active</span>
                </div>
                <div className="text-xs text-slate-300">
                  Role: <span className="font-mono text-emerald-300 font-bold">Authorized Site Administrator</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  You have full privileges to add/delete opportunities and videos across the site. Normal visitors will not see these editing controls.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border border-slate-800 rounded-xl p-3 bg-slate-900/50">
                <span className="font-bold text-slate-300 block mb-1">Active Admin Privileges:</span>
                <p>• Write & publish articles with photos and videos in Articles & Blogs</p>
                <p>• Add & delete heroic chronicles in Memory of Victory (Память победы)</p>
                <p>• Add & delete bilateral fellowships, grants, and opportunities</p>
                <p>• Add & delete documentary videos in the Heritage portal</p>
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
                Add and delete actions are restricted exclusively to the site administrator. Please authenticate with your admin credentials to unlock content editing.
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
