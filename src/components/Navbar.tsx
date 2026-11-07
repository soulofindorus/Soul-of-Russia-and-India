import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Menu,
  X,
  Search,
  Compass,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  MapPin,
  Landmark,
  Flame,
  Newspaper,
  ChevronDown,
} from 'lucide-react';
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const t = translations[currentLang];

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items (always visible on desktop 1024px+)
  const primaryNavItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'heritage', label: t.nav.heritage, icon: MapPin },
    { id: 'archaeology', label: t.nav.archaeology, icon: Landmark },
    { id: 'victory', label: t.nav.victory || 'Память победы', icon: Flame },
    { id: 'articles', label: t.nav.articles || 'Articles & Blogs', icon: Newspaper },
    { id: 'language', label: t.nav.language, icon: BookOpen },
    { id: 'opportunities', label: t.nav.opportunities, icon: GraduationCap },
  ];

  // Secondary items (shown in "More" dropdown on laptops/standard desktops, and inline on 2xl+ displays)
  const secondaryNavItems = [
    {
      id: 'connections',
      label: t.nav.connections,
      icon: Sparkles,
      desc: currentLang === 'ru' ? 'Мост культур и хронология' : currentLang === 'hi' ? 'सांस्कृतिक सेतु और समयरेखा' : 'Civilizational Bridge & Shared History',
    },
    {
      id: 'literature',
      label: t.nav.literature,
      icon: BookOpen,
      desc: currentLang === 'ru' ? 'Толстой, Ганди, Пушкин, Тагор' : currentLang === 'hi' ? 'टॉलस्टॉय, गांधी, टैगोर, पुश्किन' : 'Tolstoy, Gandhi, Pushkin & Tagore',
    },
    {
      id: 'games',
      label: t.nav.games,
      icon: Sparkles,
      desc: currentLang === 'ru' ? 'Культурные викторины и тесты' : currentLang === 'hi' ? 'सांस्कृतिक प्रश्नोत्तरी' : 'Cultural Quizzes & Word Puzzles',
    },
    {
      id: 'about',
      label: t.nav.about,
      icon: Users,
      desc: currentLang === 'ru' ? 'Команда и миссия проекта' : currentLang === 'hi' ? 'परियोजना नेतृत्व और विजन' : 'Project Leadership & Vision',
    },
  ];

  // Full item list for mobile menu
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeSection);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const moreLabel =
    currentLang === 'ru'
      ? 'Ещё'
      : currentLang === 'hi'
      ? 'अन्य'
      : 'Explore More';

  const getNavDisplayLabel = (id: string, defaultLabel: string): React.ReactNode => {
    if (id === 'victory') {
      if (currentLang === 'en') return 'Victory';
      if (currentLang === 'hi') return 'विजय';
      return (
        <span>
          <span className="hidden xl:inline">Память </span>Победы
        </span>
      );
    }
    if (id === 'articles') {
      if (currentLang === 'en') return 'Articles';
      if (currentLang === 'hi') return 'लेख';
      return 'Статьи';
    }
    if (id === 'opportunities') {
      if (currentLang === 'ru') {
        return (
          <span>
            <span className="hidden xl:inline">Возможности</span>
            <span className="xl:hidden">Гранты</span>
          </span>
        );
      }
    }
    return defaultLabel;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-white/85 backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left Column: Brand Logo aligned with page left boundary (shrink-0 min-w-max prevents squishing or hiding) */}
        <div className="flex items-center shrink-0 min-w-max mr-2 lg:mr-3 xl:mr-6">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none shrink-0 cursor-pointer select-none"
            title="Soul of Russia & India - Home"
          >
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105 bg-white">
              <img
                src="/emblem.jpg"
                alt="Soul of Russia and India Emblem"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 text-xs">
                SRI
              </span>
            </div>

            <div className="flex flex-col shrink-0 min-w-max">
              <div className="font-cinzel text-xs xs:text-sm sm:text-base md:text-lg font-bold tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors whitespace-nowrap leading-tight">
                SOUL OF RUSSIA & INDIA
              </div>
              {/* Single-line bilingual subtitle (strict whitespace-nowrap, never wraps vertically) */}
              <div className="hidden xl:flex items-center gap-1.5 text-[10px] xl:text-[11px] text-amber-800/90 font-serif-culture font-semibold whitespace-nowrap leading-tight mt-0.5">
                <span className="text-blue-900 font-bold whitespace-nowrap">Душа России и Индии</span>
                <span className="text-amber-600 font-bold">•</span>
                <span className="font-devanagari text-orange-800 font-bold whitespace-nowrap">भारत और रूस की आत्मा</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Column: Symmetrically centered Navigation Pill Bar (1024px+) */}
        <nav className="hidden lg:flex items-center justify-center shrink-0 mx-auto px-1">
          <div className="flex items-center gap-0.5 xl:gap-1 rounded-full p-1 border border-amber-500/25 bg-amber-50/50 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Primary Nav Links */}
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              const displayLabel = getNavDisplayLabel(item.id, item.label);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-[13px] font-semibold transition-all duration-200 rounded-full whitespace-nowrap cursor-pointer select-none ${
                    item.id === 'home' ? 'hidden 2xl:inline-block' : ''
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                      : 'text-slate-700 hover:text-amber-900 hover:bg-white/80'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-amber-300/60 mx-0.5" />

            {/* "Explore More ▾" Dropdown Menu */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-[13px] font-semibold transition-all duration-200 rounded-full whitespace-nowrap cursor-pointer select-none ${
                  isSecondaryActive
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-white/80'
                }`}
                title="More Cultural Sections"
              >
                <span>{moreLabel}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-slate-950' : 'text-amber-700'
                  }`}
                />
              </button>

              {/* Floating Dropdown Card */}
              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-amber-500/30 bg-white/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 text-slate-800">
                  <div className="px-3 py-1.5 border-b border-amber-500/20 text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center justify-between">
                    <span>Cultural Dimensions</span>
                    <span className="text-amber-600">✦</span>
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-100/90 text-amber-950 border border-amber-500/40 font-bold shadow-sm'
                            : 'hover:bg-amber-50/80 text-slate-700 hover:text-amber-900'
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-snug">{item.label}</div>
                          <div className="text-[10px] text-slate-500 leading-snug mt-0.5 truncate">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Right Column: Search, Admin & Language Switcher aligned with page right boundary */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ml-auto">
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
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/90 p-2 sm:px-3 sm:py-1.5 text-xs text-slate-700 hover:border-amber-500 hover:text-amber-800 shadow-sm transition-colors focus:outline-none shrink-0 cursor-pointer"
            title="Global Search"
          >
            <Search className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden md:inline">{t.nav.search}</span>
            <kbd className="hidden rounded bg-slate-100 border border-slate-200 px-1 py-0.5 text-[10px] text-slate-500 md:inline">⌘K</kbd>
          </button>

          {/* Compact Dropdown Language Switcher */}
          <LanguageSwitcher
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            variant="navbar"
          />

          {/* Mobile & Tablet Menu Toggle (shown on screens < 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 hover:text-amber-700 shadow-sm lg:hidden focus:outline-none shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accessible on phones and tablets) */}
      {mobileMenuOpen && (
        <div className="border-b border-amber-500/30 bg-white/95 px-4 pt-3 pb-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 py-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-500/50 shadow-sm font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-amber-50/80 border border-slate-200/60'
                  }`}
                >
                  <Icon className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Persistent Language Selector */}
          <div className="border-t border-slate-200 pt-3">
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={(lang) => {
                onLanguageChange(lang);
                setMobileMenuOpen(false);
              }}
              variant="drawer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-500 font-serif-culture">
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <Globe className="h-3.5 w-3.5" /> {currentLang.toUpperCase()} Mode Active
            </span>
            <span className="text-amber-800 font-medium">Культурный мост • सांस्कृतिक सेतु</span>
          </div>
        </div>
      )}
    </header>
  );
};
