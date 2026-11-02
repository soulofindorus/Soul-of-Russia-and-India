import React, { useState } from 'react';
import {
  X,
  Link2,
  Copy,
  Check,
  Globe,
  Share2,
  ExternalLink,
  Server,
  Layers,
  Sparkles,
  Compass,
  Landmark,
  Flame,
  Newspaper,
  BookOpen,
  GraduationCap,
  Users,
  MapPin,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import {
  REGISTERED_SECTIONS,
  SectionMeta,
  getDirectLinksForSection,
  copyToClipboard,
} from '../utils/routing';

interface DirectLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  currentLang: Language;
  onNavigateSection: (sectionId: string) => void;
}

export const DirectLinkModal: React.FC<DirectLinkModalProps> = ({
  isOpen,
  onClose,
  activeSection,
  currentLang,
  onNavigateSection,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'all' | 'dns'>('current');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customDomainInput, setCustomDomainInput] = useState<string>('soulofrussiaandindia.org');

  if (!isOpen) return null;

  const currentMeta =
    REGISTERED_SECTIONS.find((s) => s.id === activeSection) || REGISTERED_SECTIONS[0];
  const links = getDirectLinksForSection(currentMeta.id, customDomainInput);

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2500);
    }
  };

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'home':
        return Compass;
      case 'heritage':
        return MapPin;
      case 'archaeology':
        return Landmark;
      case 'victory':
        return Flame;
      case 'articles':
        return Newspaper;
      case 'language':
        return BookOpen;
      case 'opportunities':
        return GraduationCap;
      case 'connections':
        return Sparkles;
      case 'literature':
        return BookOpen;
      case 'games':
        return Sparkles;
      case 'about':
        return Users;
      default:
        return Link2;
    }
  };

  const CurrentIcon = getSectionIcon(currentMeta.id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-amber-500/30 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 bg-gradient-to-r from-amber-50 via-white to-blue-50 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 shadow-sm">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-slate-900">
                  Direct Links & DNS Subdomains
                </h3>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Deep Linking
                </span>
              </div>
              <p className="text-xs text-slate-500 font-serif-culture">
                Прямые ссылки для каждого элемента • प्रत्येक तत्व के सीधे लिंक
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 sm:px-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors whitespace-nowrap ${
              activeTab === 'current'
                ? 'border-amber-600 text-amber-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CurrentIcon className="h-4 w-4 text-amber-600" />
            <span>Current Section ({currentMeta.titleEn})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-amber-600 text-amber-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-blue-600" />
            <span>All 11 Website Subdomains</span>
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors whitespace-nowrap ${
              activeTab === 'dns'
                ? 'border-amber-600 text-amber-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="h-4 w-4 text-emerald-600" />
            <span>DNS CNAME & Setup Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Current Section */}
          {activeTab === 'current' && (
            <div className="space-y-5">
              {/* Highlight Banner */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-800">
                      <CurrentIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          {currentMeta.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-xs font-bold text-slate-600">
                          subdomain: {currentMeta.primarySubdomain}.*
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 font-cinzel">
                        {currentMeta.titleEn}
                      </h4>
                      <p className="text-xs text-slate-600">{currentMeta.descriptionEn}</p>
                    </div>
                  </div>

                  {/* Quick Copy Main Share Link Button */}
                  <button
                    onClick={() => handleCopy(links.hashUrl, 'primary-current')}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all shrink-0 ${
                      copiedKey === 'primary-current'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {copiedKey === 'primary-current' ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Direct Share Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ready-to-send Links List */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ready-to-Share Formats (Choose Any)
                </h5>

                {/* 1. Universal Hash Direct Link (100% Reliable everywhere) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-200 bg-white p-3 hover:border-amber-400 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px] font-bold">
                        RECOMMENDED
                      </span>
                      <span>Universal Direct Link (Works on any browser & server)</span>
                    </div>
                    <p className="font-mono text-xs text-slate-800 truncate mt-0.5 select-all">
                      {links.hashUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(links.hashUrl, 'hash-link')}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-400 transition-colors shrink-0"
                  >
                    {copiedKey === 'hash-link' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Subdomain Simulation (Instant test on Cloud Run / any URL) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-200 bg-white p-3 hover:border-amber-400 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-bold">
                        SUBDOMAIN SIMULATION
                      </span>
                      <span>Simulated Subdomain URL (Opens this exact element directly)</span>
                    </div>
                    <p className="font-mono text-xs text-slate-800 truncate mt-0.5 select-all">
                      {links.simulatedSubdomainUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(links.simulatedSubdomainUrl, 'sub-sim')}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-400 transition-colors shrink-0"
                  >
                    {copiedKey === 'sub-sim' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* 3. Direct Clean Path */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-200 bg-white p-3 hover:border-amber-400 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.5 text-[10px] font-bold">
                        CLEAN PATH
                      </span>
                      <span>Canonical URL Path</span>
                    </div>
                    <p className="font-mono text-xs text-slate-800 truncate mt-0.5 select-all">
                      {links.pathUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(links.pathUrl, 'path-link')}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-400 transition-colors shrink-0"
                  >
                    {copiedKey === 'path-link' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* 4. Custom DNS Subdomain Format */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                      <span className="rounded bg-emerald-200 text-emerald-900 px-1.5 py-0.5 text-[10px] font-bold">
                        CUSTOM DOMAIN SUBDOMAIN
                      </span>
                      <span>With your domain configured in DNS</span>
                    </div>
                    <p className="font-mono text-xs text-emerald-950 truncate mt-0.5 font-bold select-all">
                      {links.customDnsSubdomainUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(links.customDnsSubdomainUrl, 'custom-sub')}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shrink-0"
                  >
                    {copiedKey === 'custom-sub' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Deep Link Quick Tips */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>Deep Link Directly to Specific Videos & Regions</span>
                </div>
                <p>
                  You can also link directly to any video episode or regional dossier by appending{' '}
                  <code className="bg-white border px-1 py-0.5 rounded text-amber-700 font-mono">
                    #video=id
                  </code>{' '}
                  or{' '}
                  <code className="bg-white border px-1 py-0.5 rounded text-blue-700 font-mono">
                    #region=id
                  </code>
                  . When the visitor clicks it, the website automatically loads the page and opens the exact video or dossier modal!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: All 11 Sections Directory */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    All Website Elements & Subdomain Catalog
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click "Copy Direct Link" on any element below to share that exact section.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Domain preview:</span>
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs font-mono text-slate-700 w-44"
                    placeholder="yourdomain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REGISTERED_SECTIONS.map((sec) => {
                  const SecIcon = getSectionIcon(sec.id);
                  const isCurrent = sec.id === activeSection;
                  const secLinks = getDirectLinksForSection(sec.id, customDomainInput);
                  const isCopied = copiedKey === `sec-${sec.id}`;

                  return (
                    <div
                      key={sec.id}
                      className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-300'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                              <SecIcon className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                                {sec.titleEn}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-serif-culture">
                                {sec.titleRu}
                              </p>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="rounded bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold">
                              Viewing
                            </span>
                          )}
                        </div>

                        {/* Subdomain pill & link format */}
                        <div className="bg-slate-50 rounded-lg p-2 font-mono text-[11px] text-slate-700 border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between text-slate-500 text-[10px] font-sans">
                            <span className="font-bold text-amber-800">
                              DNS Subdomain: {sec.primarySubdomain}.{customDomainInput}
                            </span>
                            <span>{sec.canonicalPath}</span>
                          </div>
                          <div className="truncate text-slate-800 select-all font-semibold">
                            {secLinks.hashUrl}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => handleCopy(secLinks.hashUrl, `sec-${sec.id}`)}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2.5 text-xs font-bold transition-all ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Copied Link</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Direct Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            onNavigateSection(sec.id);
                            onClose();
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                          title="Jump to this section right now"
                        >
                          <span>Open</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DNS Configuration Guide */}
          {activeTab === 'dns' && (
            <div className="space-y-5 text-slate-700 text-xs sm:text-sm">
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <Server className="h-4 w-4 text-blue-700" />
                  <span>How DNS Subdomains Work with this Application</span>
                </div>
                <p className="text-blue-950/90 text-xs leading-relaxed">
                  The application includes a built-in <strong>subdomain parser</strong> that inspects the browser's incoming host header (<code className="bg-white/80 px-1 py-0.5 rounded font-mono">window.location.hostname</code>). When a user visits <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">victory.yourdomain.com</code>, the app automatically detects the <code className="bg-white/80 px-1 py-0.5 rounded font-mono">victory</code> subdomain and instantly routes directly to the Memory of Victory section without any redirects!
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Recommended DNS Record Configuration
                </h4>
                <p className="text-xs text-slate-500">
                  In your domain registrar DNS settings (e.g., Cloudflare, GoDaddy, Namecheap, Google Cloud DNS), add these CNAME records pointing to your root domain:
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Subdomain (Host)</th>
                        <th className="py-2.5 px-3">Target / Points To</th>
                        <th className="py-2.5 px-3">Direct Element Opened</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                      <tr className="bg-amber-50/50 font-bold">
                        <td className="py-2 px-3 text-amber-800">CNAME</td>
                        <td className="py-2 px-3">* (Wildcard)</td>
                        <td className="py-2 px-3">@ (Root Domain)</td>
                        <td className="py-2 px-3 font-sans text-xs text-slate-700">
                          Automatically routes ALL subdomains below at once!
                        </td>
                      </tr>
                      {REGISTERED_SECTIONS.map((sec) => (
                        <tr key={sec.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-blue-700">CNAME</td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {sec.primarySubdomain}
                          </td>
                          <td className="py-2 px-3 text-slate-600">@ (or app host)</td>
                          <td className="py-2 px-3 font-sans text-xs text-slate-700">
                            {sec.titleEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cloudflare / Reverse proxy note */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Instant Testing Without Waiting for DNS Propagation</span>
                </div>
                <p className="text-emerald-950/90 leading-relaxed">
                  While DNS records propagate worldwide (which can take 10 to 60 minutes), you can test any subdomain right now on the preview domain using the simulated query parameter format:
                  <br />
                  <code className="inline-block mt-1 bg-white border border-emerald-300 rounded px-2 py-1 font-mono text-emerald-900 font-bold">
                    {window.location.origin}/?subdomain=victory
                  </code>{' '}
                  or{' '}
                  <code className="inline-block mt-1 bg-white border border-emerald-300 rounded px-2 py-1 font-mono text-emerald-900 font-bold">
                    {window.location.origin}/#victory
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-amber-600" />
            <span>Deep links automatically support Russian, Hindi, and English</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-1.5 transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
