import React, { useState } from 'react';
import { Region, VideoItem, SoulStoryEpisode, Language, VideoCategory } from '../types';
import { translations } from '../i18n/translations';
import { InteractiveMap } from './InteractiveMap';
import { Film, Play, Compass, Filter, Sparkles, Clock, Globe, Landmark, MapPin } from 'lucide-react';

interface HeritageViewProps {
  currentLang: Language;
  regions: Region[];
  soulStories: SoulStoryEpisode[];
  heritageVideos: VideoItem[];
  onSelectRegion: (region: Region) => void;
  onPlayVideo: (item: VideoItem | SoulStoryEpisode) => void;
}

export const HeritageView: React.FC<HeritageViewProps> = ({
  currentLang,
  regions,
  soulStories,
  heritageVideos,
  onSelectRegion,
  onPlayVideo,
}) => {
  const t = translations[currentLang];
  const [activeMapCountry, setActiveMapCountry] = useState<'Russia' | 'India'>('Russia');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('All');
  const [videoCountryFilter, setVideoCountryFilter] = useState<string>('All');

  const categories: VideoCategory[] = [
    'Archaeology',
    'Architecture',
    'Traditions',
    'Festivals',
    'History',
    'Nature',
    'People',
    'Science',
    'Cities',
    'Cultural Connections',
  ];

  const filteredRegions = regions.filter((r) => r.country === activeMapCountry);

  const filteredVideos = heritageVideos.filter((vid) => {
    const matchesCategory = videoCategoryFilter === 'All' || vid.category === videoCategoryFilter;
    const matchesCountry =
      videoCountryFilter === 'All' ||
      vid.country === videoCountryFilter ||
      vid.country === 'Both';
    return matchesCategory && matchesCountry;
  });

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16 w-full flex flex-col items-center">
      {/* Top Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
          <Landmark className="h-3.5 w-3.5" />
          <span>Archaeology • Architecture • Sacred Traditions</span>
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-wide break-words">
          {t.heritage.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-serif-culture">
          {t.heritage.subtitle}
        </p>
      </div>

      {/* Two Large Interactive Map Switcher Cards */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Russian Map Card */}
          <button
            onClick={() => setActiveMapCountry('Russia')}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 focus:outline-none ${
              activeMapCountry === 'Russia'
                ? 'border-blue-400 bg-gradient-to-br from-blue-950/60 to-slate-900 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-2 ring-blue-400'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🇷🇺</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  activeMapCountry === 'Russia'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {activeMapCountry === 'Russia' ? 'Active Map' : 'Switch to Russia'}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
              {t.heritage.russiaMapTab}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Explore Smolensk & Gnezdovo archaeology, Saint Petersburg White Nights, Moscow Kremlin, Tatarstan, and the pristine depths of Lake Baikal.
            </p>
          </button>

          {/* Indian Map Card */}
          <button
            onClick={() => setActiveMapCountry('India')}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 focus:outline-none ${
              activeMapCountry === 'India'
                ? 'border-amber-400 bg-gradient-to-br from-amber-950/60 to-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-2 ring-amber-400'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🇮🇳</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  activeMapCountry === 'India'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {activeMapCountry === 'India' ? 'Active Map' : 'Switch to India'}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              {t.heritage.indiaMapTab}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Discover Delhi’s Red Fort, ancient Nalanda University ruins in Bihar, desert forts of Rajasthan, Varanasi Ghats, Konark Sun Temple, and high Ladakh gompas.
            </p>
          </button>
        </div>

        {/* The Interactive Map */}
        <InteractiveMap
          country={activeMapCountry}
          regions={filteredRegions}
          selectedRegionId={null}
          onSelectRegion={onSelectRegion}
          currentLang={currentLang}
        />
      </div>

      {/* SOUL STORIES VIDEO SERIES (Main Project Video Series) */}
      <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#0e172a] to-[#070c18] p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
              <Film className="h-4 w-4" />
              <span>Flagship Documentary Series</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
              {t.heritage.videoSeriesTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl font-serif-culture">
              {t.heritage.videoSeriesSubtitle}
            </p>
          </div>
          <div className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 self-start md:self-auto">
            {soulStories.length} Episodes Available
          </div>
        </div>

        {/* Cinematic Grid of Episodes */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {soulStories.map((episode) => {
            const title =
              currentLang === 'ru'
                ? episode.titleRu
                : currentLang === 'hi'
                ? episode.titleHi
                : episode.title;

            return (
              <div
                key={episode.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:-translate-y-1"
              >
                {/* Thumbnail & Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Episode Badge */}
                  <div className="absolute top-3 left-3 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
                    EP {episode.episodeNumber < 10 ? `0${episode.episodeNumber}` : episode.episodeNumber}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-slate-200 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>{episode.duration}</span>
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => onPlayVideo(episode)}
                    className="absolute inset-0 flex items-center justify-center focus:outline-none"
                    aria-label={`Play ${title}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/90 text-slate-950 shadow-lg transition-transform duration-200 group-hover:scale-125">
                      <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{episode.location}</span>
                  </div>
                  <h3 className="font-cinzel text-sm font-bold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                    {episode.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {episode.keyThemes.slice(0, 2).map((theme, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300"
                        >
                          #{theme}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => onPlayVideo(episode)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Watch →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HERITAGE VIDEO SYSTEM / ARCHIVE */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              {t.heritage.allVideosTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Filter by archaeological and cultural categories
            </p>
          </div>

          {/* Filters: Country & Category */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Filters */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-1">
              {(['All', 'Russia', 'India'] as const).map((cntry) => (
                <button
                  key={cntry}
                  onClick={() => setVideoCountryFilter(cntry)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    videoCountryFilter === cntry
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cntry === 'All' ? t.heritage.filterAll : cntry}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <select
              value={videoCategoryFilter}
              onChange={(e) => setVideoCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="All">{t.heritage.categoryAll}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredVideos.map((vid) => {
            const title =
              currentLang === 'ru' ? vid.titleRu : currentLang === 'hi' ? vid.titleHi : vid.title;

            return (
              <div
                key={vid.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1322] transition-all hover:border-amber-500/40 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute top-2.5 left-2.5 rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    {vid.category}
                  </span>

                  {vid.duration && (
                    <span className="absolute bottom-2.5 right-2.5 rounded bg-black/70 px-2 py-0.5 text-[10px] text-slate-300">
                      {vid.duration}
                    </span>
                  )}

                  <button
                    onClick={() => onPlayVideo(vid)}
                    className="absolute inset-0 flex items-center justify-center focus:outline-none"
                    aria-label={`Play ${title}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-slate-950 opacity-90 transition-transform group-hover:scale-110">
                      <Play className="h-4 w-4 fill-slate-950 ml-0.5" />
                    </div>
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{vid.country} • {vid.region}</span>
                    <span>{vid.date}</span>
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                    {vid.shortDescription}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Category: {vid.category}</span>
                    <button
                      onClick={() => onPlayVideo(vid)}
                      className="font-semibold text-amber-400 hover:text-amber-300"
                    >
                      Play Video →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
