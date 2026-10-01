import React, { useState } from 'react';
import { Globe, Menu, X, Search, Compass, BookOpen, GraduationCap, Users, Sparkles, MapPin, Landmark } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'heritage', label: t.nav.heritage, icon: MapPin },
    { id: 'archaeology', label: t.nav.archaeology, icon: Landmark },
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
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-[#0b101b]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none min-w-0"
        >
          <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-transform group-hover:scale-105">
            <img
              src="/emblem.jpg"
              alt="Soul of Russia and India Emblem"
              className="h-full w-full object-cover"
              onError={(e) => {
                // fallback if loading takes a moment
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-xs">
              SRI
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-cinzel text-xs xs:text-sm sm:text-base md:text-xl font-bold tracking-wider text-slate-100 group-hover:text-amber-300 transition-colors truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
              SOUL OF RUSSIA & INDIA
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-200/80 font-serif-culture">
              <span>Душа России и Индии</span>
              <span className="text-amber-500">•</span>
              <span className="font-devanagari">भारत और रूस की आत्मा</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-all rounded-md ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Search & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 p-2 sm:px-3 sm:py-1.5 text-xs text-slate-300 hover:border-amber-400/50 hover:text-amber-300 transition-colors focus:outline-none shrink-0"
            title="Global Search"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.nav.search}</span>
            <kbd className="hidden rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-400 md:inline">⌘K</kbd>
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
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:text-amber-400 xl:hidden focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-amber-500/20 bg-[#090e18] px-4 pt-2 pb-6 xl:hidden animate-in fade-in slide-in-from-top-4 duration-200 space-y-4">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 text-amber-400" />
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
