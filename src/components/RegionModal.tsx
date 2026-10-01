import React, { useState } from 'react';
import { X, MapPin, Compass, Sparkles, BookOpen, Film, Landmark, Trees, CheckCircle2 } from 'lucide-react';
import { Region, Language } from '../types';
import { translations } from '../i18n/translations';

interface RegionModalProps {
  region: Region | null;
  currentLang: Language;
  onClose: () => void;
  onPlayVideo: (region: Region) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  currentLang,
  onClose,
  onPlayVideo,
}) => {
  if (!region) return null;
  const t = translations[currentLang];

  const regionName =
    currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1424] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-slate-300 backdrop-blur-md hover:bg-black hover:text-white transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image & Badge */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={region.image}
            alt={region.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-[#0c1424]/40 to-transparent" />

          {/* Floating Badge */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-slate-950 uppercase tracking-wide">
                <MapPin className="h-3.5 w-3.5" />
                {region.country === 'Russia' ? '🇷🇺 Россия • Russia' : '🇮🇳 भारत • India'}
              </span>
              {region.climateOrGeo && (
                <span className="hidden sm:inline-block rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs text-slate-300 border border-slate-700">
                  {region.climateOrGeo}
                </span>
              )}
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-white sm:text-3xl drop-shadow-md">
              {regionName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-amber-200/90 font-serif-culture">
              <span>{region.nameRu}</span>
              <span>•</span>
              <span className="font-devanagari">{region.nameHi}</span>
            </div>
            {region.subtitle && (
              <p className="mt-1 text-xs text-slate-300 italic max-w-xl">
                “{region.subtitle}”
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Cultural Description */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm leading-relaxed text-slate-200">
              {region.shortDescription}
            </p>
          </div>

          {/* Heritage Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel text-base font-bold">
              <Landmark className="h-5 w-5" />
              <span>Heritage & Historical Architecture</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {region.heritageInfo}
            </p>
          </div>

          {/* Archaeological Information */}
          {region.archaeologicalInfo && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{t.heritage.archaeologyBadge}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                {region.archaeologicalInfo}
              </p>
            </div>
          )}

          {/* Historical Places List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {t.heritage.placesLabel}
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {region.historicalPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{place}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traditions & Living Customs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {t.heritage.traditionsLabel}
            </h4>
            <div className="flex flex-wrap gap-2">
              {region.traditions.map((tradition, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-amber-500/20 bg-slate-900 px-3 py-1 text-xs text-amber-200 font-medium"
                >
                  ✦ {tradition}
                </span>
              ))}
            </div>
          </div>

          {/* Video Player Action */}
          {region.videoUrl && (
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200 block">
                  {region.videoTitle || 'Regional Heritage Video'}
                </span>
                Watch archaeological excavation & cultural documentary
              </div>
              <button
                onClick={() => onPlayVideo(region)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-amber-500 hover:to-amber-400 transition-all focus:outline-none"
              >
                <Film className="h-4 w-4" />
                <span>{t.heritage.watchHeritageVideo}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
