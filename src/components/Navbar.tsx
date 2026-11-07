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
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-white/90 backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
      {/* Container:
          On mobile (<1024px): clean flex layout with logo on left, actions on right.
          On desktop & tablets (>=1024px): 3-column CSS Grid.
          Separate grid cells GUARANTEE that nav bar can NEVER physically overlap the logo or search button!
      */}
      <div className="mx-auto flex lg:grid lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr] h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Left Column: Brand Logo aligned with page left boundary */}
        <div className="flex items-center shrink-0 min-w-max justify-start z-10">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none shrink-0 cursor-pointer select-none"
            title="Soul of Russia & India - Home"
          >
            <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105 bg-white">
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
              <div className="font-cinzel text-xs sm:text-sm md:text-base lg:text-[17px] font-bold tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors whitespace-nowrap leading-tight">
                SOUL OF RUSSIA & INDIA
              </div>
              {/* Single-line bilingual subtitle (strict whitespace-nowrap, visible on xl+ displays) */}
              <div className="hidden xl:flex items-center gap-1.5 text-[10px] xl:text-[11px] text-amber-800/90 font-serif-culture font-semibold whitespace-nowrap leading-tight mt-0.5">
                <span className="text-blue-900 font-bold whitespace-nowrap">Душа России и Индии</span>
                <span className="text-amber-600 font-bold">•</span>
                <span className="font-devanagari text-orange-800 font-bold whitespace-nowrap">भारत और रूस की आत्मा</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Column: Symmetrically Centered Navigation Pill Bar (IN-FLOW: IMPOSSIBLE TO OVERLAP!) */}
        <nav className="hidden lg:flex items-center justify-center px-1">
          <div className="flex items-center gap-0.5 xl:gap-1 rounded-full p-1 border border-amber-500/25 bg-amber-50/70 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Primary Nav Links */}
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              const displayLabel = getNavDisplayLabel(item.id, item.label);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1 xl:py-1.5 text-xs xl:text-[13px] font-semibold transition-all duration-200 rounded-full whitespace-nowrap cursor-pointer select-none ${
                    item.id === 'home'
                      ? 'hidden 2xl:inline-block'
                      : item.id === 'opportunities'
                      ? 'hidden xl:inline-block'
                      : ''
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

            {/* "Explore More ▾" Dropdown Menu (Accessible via Hover and Click) */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-2 xl:px-2.5 2xl:px-3 py-1 xl:py-1.5 text-xs xl:text-[13px] font-semibold transition-all duration-200 rounded-full whitespace-nowrap cursor-pointer select-none ${
                  isSecondaryActive
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-white/80'
                }`}
                title="More Cultural Sections & Subsections"
              >
                <span>{moreLabel}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-slate-950' : 'text-amber-700'
                  }`}
                />
              </button>

              {/* Floating Dropdown Card showing All Subsections */}
              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-80 rounded-2xl border border-amber-500/30 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 text-slate-800">
                  <div className="px-3 py-1.5 border-b border-amber-500/20 text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center justify-between">
                    <span>Cultural Subsections</span>
                    <span className="text-amber-600 text-xs font-semibold">Portals ✦</span>
                  </div>

                  {/* Opportunities is included here on screens where it's hidden in the pill bar */}
                  <button
                    onClick={() => handleNavClick('opportunities')}
                    className={`xl:hidden w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-all cursor-pointer ${
                      activeSection === 'opportunities'
                        ? 'bg-amber-100/90 text-amber-950 border border-amber-500/40 font-bold shadow-sm'
                        : 'hover:bg-amber-50/80 text-slate-700 hover:text-amber-900'
                    }`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 shrink-0">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-snug">{t.nav.opportunities}</div>
                      <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
                        {currentLang === 'ru' ? 'Гранты, стипендии и стажировки' : currentLang === 'hi' ? 'छात्रवृत्तियां और अवसर' : 'Scholarships, Fellowships & Exchanges'}
                      </div>
                    </div>
                  </button>

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
                          <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
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
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 z-10">
          {/* Admin Indicator */}
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-50/90 px-2 sm:px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm hover:bg-emerald-100 transition-colors cursor-pointer"
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

          {/* Compact Dropdown Language Switcher (Flag + Native/Short Label) */}
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

      {/* Responsive Mobile Drawer (Formatted for Mobile Portrait, Landscape & Tablets) */}
      {mobileMenuOpen && (
        <div className="border-b border-amber-500/30 bg-white/98 backdrop-blur-xl px-3 sm:px-6 pt-3 pb-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 space-y-4 shadow-2xl max-h-[82vh] overflow-y-auto overscroll-contain">
          {/* Section Category 1: Core Civilizational Portals */}
          <div className="space-y-1.5">
            <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
              <span>Core Portals & Memorials</span>
              <span className="text-[10px] text-slate-500 font-normal">Heritage & History</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const displayLabel = getNavDisplayLabel(item.id, item.label);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between rounded-xl p-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-amber-50/50 text-slate-800 hover:bg-amber-100/70 border border-amber-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                        isActive ? 'bg-black/10 text-slate-950' : 'bg-amber-500/15 text-amber-700'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-left font-medium leading-tight">
                        {displayLabel}
                      </span>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-slate-950 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Category 2: Cultural Bridge & Exploration */}
          <div className="space-y-1.5 border-t border-slate-200 pt-3">
            <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
              <span>Cultural Bridge & Knowledge</span>
              <span className="text-[10px] text-slate-500 font-normal">Civilizational Connection</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between rounded-xl p-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-50 text-slate-800 hover:bg-amber-50/80 border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                        isActive ? 'bg-black/10 text-slate-950' : 'bg-amber-500/15 text-amber-700'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="leading-tight font-medium">{item.label}</div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-slate-950 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
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

          {/* Footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2 text-[11px] text-slate-500 font-serif-culture">
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
