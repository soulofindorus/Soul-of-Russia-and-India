import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
  variant?: 'navbar' | 'compact' | 'drawer';
}

interface LanguageOption {
  code: Language;
  shortLabel: string;
  nativeLabel: string;
  englishLabel: string;
  flag: string;
  script: string;
  region: string;
  themeGradient: string;
  badgeBorder: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    shortLabel: 'EN',
    nativeLabel: 'English',
    englishLabel: 'English',
    flag: '🇬🇧',
    script: 'Latin',
    region: 'International',
    themeGradient: 'from-amber-600 to-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    badgeBorder: 'border-amber-400/80',
  },
  {
    code: 'ru',
    shortLabel: 'РУС',
    nativeLabel: 'Русский',
    englishLabel: 'Russian',
    flag: '🇷🇺',
    script: 'Кириллица',
    region: 'Россия',
    themeGradient: 'from-blue-700 via-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    badgeBorder: 'border-blue-400/80',
  },
  {
    code: 'hi',
    shortLabel: 'हिं',
    nativeLabel: 'हिन्दी',
    englishLabel: 'Hindi',
    flag: '🇮🇳',
    script: 'देवनागरी',
    region: 'भारत',
    themeGradient: 'from-orange-600 via-amber-600 to-amber-500 text-white font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]',
    badgeBorder: 'border-orange-400/80',
  },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
  className = '',
  variant = 'navbar',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Update HTML lang attribute whenever language changes for accessibility and fonts
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const selectLanguage = (code: Language) => {
    if (code !== currentLang) {
      onLanguageChange(code);
      try {
        localStorage.setItem('sri_lang', code);
        // Dispatch custom event for any listeners
        window.dispatchEvent(new CustomEvent('sri:lang-changed', { detail: code }));
      } catch (err) {
        console.warn('Could not persist language to localStorage', err);
      }
    }
    setDropdownOpen(false);
  };

  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // Drawer / Mobile layout
  if (variant === 'drawer') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <Globe className="h-3.5 w-3.5" />
            <span>Select Interface Language</span>
          </span>
          <span className="text-[10px] text-slate-500">Auto-persisted</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                type="button"
                className={`relative flex flex-col items-center justify-center rounded-xl p-2.5 transition-all text-center border ${
                  isSelected
                    ? `border-amber-400 bg-amber-500/20 text-white ring-1 ring-amber-400/80 shadow-md`
                    : `border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850`
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-xl mb-0.5">{lang.flag}</span>
                <span className="text-xs font-bold font-serif-culture">
                  {lang.nativeLabel}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang.englishLabel}
                </span>
                {isSelected && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Navbar Segmented Control with Dropdown Details
  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      role="region"
      aria-label="Language selection"
    >
      {/* Compact Elegant Dropdown Pill Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        type="button"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        title={`Current Language: ${currentOption.nativeLabel} (${currentOption.englishLabel}) - Click to change`}
        className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/40 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:border-amber-500 hover:bg-amber-50/50 transition-all focus:outline-none shrink-0 cursor-pointer"
      >
        <span className="text-sm shrink-0">{currentOption.flag}</span>
        <span className="hidden sm:inline font-serif-culture font-bold text-slate-900 whitespace-nowrap">
          {currentOption.nativeLabel}
        </span>
        <span className="inline sm:hidden font-serif-culture font-bold text-slate-900 whitespace-nowrap text-[11px]">
          {currentOption.shortLabel}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-amber-600 transition-transform duration-200 shrink-0 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Detailed Language Switcher Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-amber-500/30 bg-white/95 p-3 shadow-[0_10px_35px_rgba(15,23,42,0.15)] backdrop-blur-xl z-50 text-slate-800"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 px-1.5 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Globe className="h-4 w-4 text-amber-600" />
                <span>Language & Script</span>
              </div>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-300">
                Persistent
              </span>
            </div>

            {/* Language list with full details */}
            <div className="space-y-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;

                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    type="button"
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-slate-900'
                        : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-culture text-sm font-bold text-slate-900 group-hover:text-amber-800">
                            {lang.nativeLabel}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({lang.englishLabel})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>{lang.script}</span>
                          <span>•</span>
                          <span className="text-amber-700">{lang.region}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer with Cultural Motto */}
            <div className="mt-3 border-t border-slate-200 pt-2 px-1 text-[10px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-700">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Trilingual Civilization Portal</span>
              </span>
              <span className="text-slate-400">v1.2</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
