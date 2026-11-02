import React, { useState } from 'react';
import { Globe, Menu, X, Search, Compass, BookOpen, GraduationCap, Users, Sparkles, MapPin, Landmark, Flame, Newspaper } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenSearch: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenSearch,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'heritage', label: t.nav.heritage, icon: MapPin },
    { id: 'archaeology', label: t.nav.archaeology, icon: Landmark },
    { id: 'victory', label: t.nav.victory || 'Память победы', icon: Flame },
    { id: 'articles', label: t.nav.articles || 'Articles & Blogs', icon: Newspaper },
    { id: 'language', label: t.nav.language, icon: BookOpen },
    { id: 'opportunities', label: t.nav.opportunities, icon: GraduationCap },
    { id: 'connections', label: t.nav.connections, icon: Sparkles },
    { id: 'literature', label: t.nav.literature, icon: BookOpen },
    { id: 'games', label: t.nav.games, icon: Sparkles },
    { id: 'about', label: t.nav.about, icon: Users },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-white/60 backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none min-w-0"
        >
          <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105 bg-white">
            <img
              src="/emblem.jpg"
              alt="Soul of Russia and India Emblem"
              className="h-full w-full object-cover"
              onError={(e) => {
                // fallback if loading takes a moment
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 text-xs">
              SRI
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-cinzel text-xs xs:text-sm sm:text-base md:text-xl font-bold tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
              SOUL OF RUSSIA & INDIA
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-800/90 font-serif-culture font-semibold">
              <span className="text-blue-900 font-bold">Душа России и Индии</span>
              <span className="text-amber-600">•</span>
              <span className="font-devanagari text-orange-800 font-bold">भारत और रूस की आत्मा</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-0.5 2xl:gap-1 xl:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2 2xl:px-2.5 py-1.5 text-xs 2xl:text-sm font-semibold transition-all rounded-md whitespace-nowrap ${
                  isActive
                    ? 'text-amber-800 bg-amber-500/15 border-b-2 border-amber-600 font-bold shadow-sm'
                    : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Search & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Admin Indicator */}
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Admin Session Active - Click to manage"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="hidden sm:inline">Admin Mode</span>
            </button>
          )}

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/90 p-2 sm:px-3 sm:py-1.5 text-xs text-slate-700 hover:border-amber-500 hover:text-amber-800 shadow-sm transition-colors focus:outline-none shrink-0"
            title="Global Search"
          >
            <Search className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden md:inline">{t.nav.search}</span>
            <kbd className="hidden rounded bg-slate-100 border border-slate-200 px-1 py-0.5 text-[10px] text-slate-500 md:inline">⌘K</kbd>
          </button>

          {/* Persistent Language Switcher: EN | Русский | हिन्दी */}
          <LanguageSwitcher
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            variant="navbar"
          />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-slate-300 bg-white/90 text-slate-700 hover:text-amber-700 shadow-sm xl:hidden focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-amber-500/30 bg-white/95 px-4 pt-2 pb-6 xl:hidden animate-in fade-in slide-in-from-top-4 duration-200 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-500/50 shadow-sm'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="h-4 w-4 text-amber-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Persistent Language Selector */}
          <div className="border-t border-slate-800 pt-3">
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={(lang) => {
                onLanguageChange(lang);
                setMobileMenuOpen(false);
              }}
              variant="drawer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Globe className="h-3.5 w-3.5" /> {currentLang.toUpperCase()} Mode Active
            </span>
            <span className="font-serif-culture text-amber-300/80">Культурный мост • सांस्कृतिक सेतु</span>
          </div>
        </div>
      )}
    </header>
  );
};
