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
      {/* Subtle Ambient Veil */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/30 pointer-events-none" />
      </div>

      {/* Main Hero Banner */}
      <div className="mx-auto w-full max-w-7xl px-3 pt-12 pb-16 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 flex flex-col items-center">
        {/* Visual Bridge Badge */}
        <div className="inline-flex max-w-[95vw] flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-amber-500/40 bg-white/90 px-3.5 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs shadow-[0_4px_20px_rgba(212,175,55,0.18)] backdrop-blur-md">
          <span className="flex items-center gap-1 font-bold text-blue-900">
            <span>🇷🇺</span>
            <span>Россия</span>
          </span>
          <span className="text-amber-600">✦</span>
          <span className="font-cinzel font-bold tracking-wider text-amber-800 uppercase">
            Cultural Bridge • Мост Культур
          </span>
          <span className="text-amber-600">✦</span>
          <span className="flex items-center gap-1 font-bold text-orange-800">
            <span>🇮🇳</span>
            <span>भारत</span>
          </span>
        </div>

        {/* Central Emblem */}
        <div className="mx-auto flex justify-center">
          <div className="group relative flex h-24 w-24 sm:h-36 sm:w-36 items-center justify-center rounded-full border-2 border-amber-500 p-1 shadow-[0_0_35px_rgba(212,175,55,0.25)] backdrop-blur-md transition-transform duration-500 hover:scale-105 bg-white">
            <img
              src="/emblem.jpg"
              alt="Soul of Russia and India Emblem"
              className="h-full w-full rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Trilingual Main Headings */}
        <div className="space-y-3 max-w-4xl mx-auto w-full">
          <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide sm:tracking-wider text-slate-900 drop-shadow-sm break-words">
            {t.hero.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-base xs:text-lg sm:text-2xl font-serif-culture font-semibold text-center">
            <span className="tracking-wide text-blue-900 font-bold">Душа России и Индии</span>
            <span className="hidden sm:inline text-amber-600 font-bold">•</span>
            <span className="font-devanagari tracking-wide text-orange-800 font-bold">भारत और रूस की आत्मा</span>
          </div>

          <p className="mx-auto max-w-2xl text-xs sm:text-base text-slate-700 leading-relaxed font-serif-culture pt-1 sm:pt-2 px-2 font-medium">
            “{t.hero.subtitle}”
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
          <button
            onClick={() => onNavigate('heritage')}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all hover:scale-105 hover:shadow-[0_6px_35px_rgba(212,175,55,0.45)] focus:outline-none cursor-pointer"
          >
            <Compass className="h-4 w-4 text-slate-950 transition-transform group-hover:rotate-45" />
            <span>{t.hero.exploreBtn}</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>

          <button
            onClick={onPlayFeaturedVideo}
            className="group flex items-center gap-2.5 rounded-full border border-slate-300 bg-white/90 px-8 py-3.5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all hover:border-amber-500 hover:bg-white hover:text-amber-700 focus:outline-none cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <Play className="h-3 w-3 fill-slate-950 ml-0.5" />
            </div>
            <span>{t.hero.watchVideoBtn}</span>
          </button>
        </div>

        {/* 4 Interactive Gateway Cards below Hero */}
        <div className="pt-12 w-full">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {/* 1. HERITAGE CARD */}
            <button
              onClick={() => onNavigate('heritage')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-md transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 focus:outline-none text-left"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {t.hero.heritageCardTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-serif-culture">
                  {t.hero.heritageCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <span>Open Maps & Archaeology</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 2. LANGUAGE CARD */}
            <button
              onClick={() => onNavigate('language')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-md transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 focus:outline-none text-left"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {t.hero.languageCardTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-serif-culture">
                  {t.hero.languageCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                <span>Master Russian & Hindi</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 3. OPPORTUNITIES CARD */}
            <button
              onClick={() => onNavigate('opportunities')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-md transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 focus:outline-none text-left"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.hero.opportunitiesCardTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-serif-culture">
                  {t.hero.opportunitiesCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span>View Fellowships</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* 4. SOUL OF RUSSIA AND INDIA CARD */}
            <button
              onClick={() => onNavigate('about')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-md transition-all duration-300 hover:border-orange-400 hover:shadow-xl hover:-translate-y-1 focus:outline-none text-left"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                  {t.hero.storiesCardTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-serif-culture">
                  {t.hero.storiesCardDesc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange-700">
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
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          {/* Quote of the Day */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/85 p-6 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Quote className="h-4 w-4" />
              <span>Quote of the Day</span>
            </div>
            <p className="font-serif-culture text-sm italic text-slate-700 leading-relaxed font-medium">
              “The highest wisdom is based on universal love and unity. Truth is one, though the sages know it by many names.”
            </p>
            <div className="text-xs text-amber-800 font-bold">
              — Leo Tolstoy to Mahatma Gandhi (1909)
            </div>
          </div>

          {/* Cultural Bridge of the Week */}
          <button
            onClick={() => onNavigate('connections')}
            className="group rounded-2xl border border-slate-200/90 bg-white/85 p-6 space-y-3 text-left hover:border-amber-400 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
                <Flame className="h-4 w-4" />
                <span>Bridge of the Week</span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Inspect →</span>
            </div>
            <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-amber-700">
              Maslenitsa × Holi
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              Welcoming spring through solar round pancakes (Blini) and radiant color pigments (Gulal).
            </p>
          </button>

          {/* Word of the Day & Shared Cognate */}
          <button
            onClick={() => onNavigate('language')}
            className="group rounded-2xl border border-slate-200/90 bg-white/85 p-6 space-y-3 text-left hover:border-blue-400 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>Linguistic Cognate</span>
              </div>
              <span className="text-[10px] text-blue-700 font-bold">Learn →</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-cinzel text-xl font-bold text-blue-900">Огонь (Ogon)</span>
              <span className="text-slate-400">⇄</span>
              <span className="font-devanagari text-lg font-bold text-orange-800">अग्नि (Agni)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Meaning: "Fire / Sacrificial Flame" — an ancient shared Indo-European root spanning thousands of years.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
