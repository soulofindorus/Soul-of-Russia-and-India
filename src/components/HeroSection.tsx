import React from 'react';
import { Language, VideoItem, SoulStoryEpisode, Region } from '../types';
import { translations } from '../i18n/translations';
import { regionsData } from '../data/regionsData';
import { LeafletMapSection } from './LeafletMapSection';
import {
  Compass,
  Film,
  MapPin,
  BookOpen,
  GraduationCap,
  Sparkles,
  Play,
  ArrowRight,
  Quote,
  Flame,
  Calendar,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  currentLang: Language;
  onNavigate: (section: string) => void;
  onPlayFeaturedVideo: () => void;
  onSelectRegion: (regionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onNavigate,
  onPlayFeaturedVideo,
  onSelectRegion,
}) => {
  const t = translations[currentLang];

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center">
      {/* Dynamic Background with Russia ⇄ India Split Atmosphere */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Left side deep blue Russian glow */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] rounded-full bg-blue-900/25 blur-[100px] sm:blur-[120px]" />
        {/* Right side saffron warm Indian glow */}
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] rounded-full bg-orange-700/20 blur-[100px] sm:blur-[120px]" />
        {/* Center gold subtle aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[350px] w-[500px] sm:h-[450px] sm:w-[650px] rounded-full bg-amber-500/10 blur-[120px] sm:blur-[140px]" />
        {/* Subtle decorative grid/ornament pattern */}
        <div className="absolute inset-0 bg-ornament-pattern opacity-30 pointer-events-none" />
      </div>

      {/* Main Hero Banner */}
      <div className="mx-auto w-full max-w-7xl px-3 pt-12 pb-16 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 flex flex-col items-center">
        {/* Visual Bridge Badge */}
        <div className="inline-flex max-w-[95vw] flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-amber-400/40 bg-slate-900/80 px-3.5 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs shadow-[0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-md">
          <span className="flex items-center gap-1 font-bold text-blue-300">
            <span>🇷🇺</span>
            <span>Россия</span>
          </span>
          <span className="text-amber-400">✦</span>
          <span className="font-cinzel font-bold tracking-wider text-amber-200 uppercase">
            Cultural Bridge • Мост Культур
          </span>
          <span className="text-amber-400">✦</span>
          <span className="flex items-center gap-1 font-bold text-orange-300">
            <span>🇮🇳</span>
            <span>भारत</span>
          </span>
        </div>

        {/* Central Emblem */}
        <div className="mx-auto flex justify-center">
          <div className="group relative flex h-24 w-24 sm:h-36 sm:w-36 items-center justify-center rounded-full border-2 border-amber-400/70 p-1 shadow-[0_0_35px_rgba(212,175,55,0.3)] backdrop-blur-md transition-transform duration-500 hover:scale-105">
            <img
              src="/emblem.jpg"
              alt="Soul of Russia and India Emblem"
              className="h-full w-full rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
          </div>
        </div>

        {/* Trilingual Main Headings */}
        <div className="space-y-3 max-w-4xl mx-auto w-full">
          <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide sm:tracking-wider text-slate-100 drop-shadow-lg break-words">
            {t.hero.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-base xs:text-lg sm:text-2xl font-serif-culture text-amber-200">
            <span className="tracking-wide">Душа России и Индии</span>
            <span className="hidden sm:inline text-amber-500">•</span>
            <span className="font-devanagari tracking-wide text-orange-200">भारत और रूस की आत्मा</span>
          </div>

          <p className="mx-auto max-w-2xl text-xs sm:text-base text-slate-300 leading-relaxed font-serif-culture pt-1 sm:pt-2 px-2">
            “{t.hero.subtitle}”
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
          <button
            onClick={() => onNavigate('heritage')}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] focus:outline-none"
          >
            <Compass className="h-4 w-4 text-slate-950 transition-transform group-hover:rotate-45" />
            <span>{t.hero.exploreBtn}</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>

          <button
            onClick={onPlayFeaturedVideo}
            className="group flex items-center gap-2.5 rounded-full border border-amber-500/40 bg-slate-900/80 px-8 py-3.5 text-sm font-bold text-slate-100 shadow-md backdrop-blur-md transition-all hover:border-amber-400 hover:bg-slate-800 hover:text-amber-300 focus:outline-none"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <Play className="h-3 w-3 fill-slate-950 ml-0.5" />
            </div>
            <span>{t.hero.watchVideoBtn}</span>
          </button>
        </div>

        {/* 4 Interactive Gateway Cards below Hero */}
        <div className="pt-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {/* 1. HERITAGE CARD */}
            <button
              onClick={() => onNavigate('heritage')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-[#0c1424] p-6 transition-all duration-300 hover:border-blue-400/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:-translate-y-1 focus:outline-none"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  {t.hero.heritageCardTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-serif-culture">
                  {t.hero.heritageCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <span>Open Maps & Archaeology</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 2. LANGUAGE CARD */}
            <button
              onClick={() => onNavigate('language')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-[#0c1424] p-6 transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:-translate-y-1 focus:outline-none"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.hero.languageCardTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-serif-culture">
                  {t.hero.languageCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span>Master Russian & Hindi</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 3. OPPORTUNITIES CARD */}
            <button
              onClick={() => onNavigate('opportunities')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-[#0c1424] p-6 transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 focus:outline-none"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {t.hero.opportunitiesCardTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-serif-culture">
                  {t.hero.opportunitiesCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span>View Fellowships</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 4. SOUL OF RUSSIA AND INDIA CARD */}
            <button
              onClick={() => onNavigate('about')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-b from-orange-950/20 to-[#0c1424] p-6 transition-all duration-300 hover:border-orange-400/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.2)] hover:-translate-y-1 focus:outline-none"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                  {t.hero.storiesCardTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-serif-culture">
                  {t.hero.storiesCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange-400">
                <span>Meet the Team & Vision</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Interactive Leaflet Map Section for Russia and India */}
        <LeafletMapSection
          currentLang={currentLang}
          regions={regionsData}
          onSelectRegion={onSelectRegion}
          onNavigate={onNavigate}
        />

        {/* Dynamic Cultural Highlights Row (Quote, Word of the Day, Cultural Bridge) */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Quote of the Day */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Quote className="h-4 w-4" />
              <span>Quote of the Day</span>
            </div>
            <p className="font-serif-culture text-sm italic text-slate-200 leading-relaxed">
              “The highest wisdom is based on universal love and unity. Truth is one, though the sages know it by many names.”
            </p>
            <div className="text-xs text-amber-300/80 font-semibold">
              — Leo Tolstoy to Mahatma Gandhi (1909)
            </div>
          </div>

          {/* Cultural Bridge of the Week */}
          <button
            onClick={() => onNavigate('connections')}
            className="group rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 space-y-3 text-left hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Flame className="h-4 w-4" />
                <span>Bridge of the Week</span>
              </div>
              <span className="text-[10px] text-amber-400">Inspect →</span>
            </div>
            <h4 className="font-cinzel text-base font-bold text-white group-hover:text-amber-300">
              Maslenitsa × Holi
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              Welcoming spring through solar round pancakes (Blini) and radiant color pigments (Gulal).
            </p>
          </button>

          {/* Word of the Day & Shared Cognate */}
          <button
            onClick={() => onNavigate('language')}
            className="group rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 space-y-3 text-left hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Sparkles className="h-4 w-4" />
                <span>Linguistic Cognate</span>
              </div>
              <span className="text-[10px] text-blue-400">Learn →</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-cinzel text-xl font-bold text-blue-300">Огонь (Ogon)</span>
              <span className="text-slate-500">⇄</span>
              <span className="font-devanagari text-lg font-bold text-orange-300">अग्नि (Agni)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Meaning: "Fire / Sacrificial Flame" — an ancient shared Indo-European root spanning thousands of years.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
