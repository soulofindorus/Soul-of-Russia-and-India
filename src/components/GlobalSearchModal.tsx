import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Film, BookOpen, GraduationCap, Sparkles, Feather, ArrowRight, Landmark } from 'lucide-react';
import { Region, VideoItem, SoulStoryEpisode, Author, Opportunity, Language } from '../types';
import { archaeologicalSitesData } from '../data/archaeologyData';
import { heroicStoriesData } from '../data/victoryData';
import { initialArticlesData } from '../data/articlesData';
import { Flame, Newspaper } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  soulStories: SoulStoryEpisode[];
  heritageVideos: VideoItem[];
  authors: Author[];
  opportunities: Opportunity[];
  currentLang: Language;
  onSelectRegion: (region: Region) => void;
  onSelectVideo: (video: VideoItem | SoulStoryEpisode) => void;
  onNavigate: (section: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  regions,
  soulStories,
  heritageVideos,
  authors,
  opportunities,
  currentLang,
  onSelectRegion,
  onSelectVideo,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Matched results
  const matchedRegions = q
    ? regions.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.nameRu.toLowerCase().includes(q) ||
          r.nameHi.toLowerCase().includes(q) ||
          r.shortDescription.toLowerCase().includes(q)
      )
    : [];

  const matchedVideos = q
    ? [...soulStories, ...heritageVideos].filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.titleRu.toLowerCase().includes(q) ||
          v.titleHi.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q)
      )
    : [];

  const matchedAuthors = q
    ? authors.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.nameRu.toLowerCase().includes(q) ||
          a.biography.toLowerCase().includes(q)
      )
    : [];

  const matchedOpportunities = q
    ? opportunities.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.shortDescription.toLowerCase().includes(q)
      )
    : [];

  const matchedArchaeology = q
    ? archaeologicalSitesData.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameRu.toLowerCase().includes(q) ||
          s.nameHi.toLowerCase().includes(q) ||
          s.civilization.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q)
      )
    : [];

  const matchedVictory = q
    ? heroicStoriesData.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.titleRu.toLowerCase().includes(q) ||
          v.heroName.toLowerCase().includes(q) ||
          v.heroNameRu.toLowerCase().includes(q) ||
          v.warName.toLowerCase().includes(q) ||
          v.warNameRu.toLowerCase().includes(q)
      )
    : [];

  const matchedArticles = q
    ? initialArticlesData.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.titleRu && a.titleRu.toLowerCase().includes(q)) ||
          a.author.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedRegions.length +
    matchedArchaeology.length +
    matchedVictory.length +
    matchedArticles.length +
    matchedVideos.length +
    matchedAuthors.length +
    matchedOpportunities.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0c1424] shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-800 bg-[#080d18] px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-amber-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search regions, heritage sites, videos, authors, fellowships..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query ? (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>Type to search across the bilingual digital museum & opportunities portal.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Smolensk', 'Pushkin', 'Maslenitsa', 'Gnezdovo', 'Scholarship', 'Nalanda', 'Tolstoy'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-slate-400 hover:text-amber-300 hover:border-amber-500/30"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No results found for “<span className="text-amber-300">{query}</span>”. Try another term.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matched Archaeology */}
              {matchedArchaeology.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5" /> Archaeological Sites & Civilizations ({matchedArchaeology.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedArchaeology.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          onNavigate('archaeology');
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-slate-900/80 p-2.5 text-left hover:border-amber-400 hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={site.imageUrl}
                          alt={site.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {currentLang === 'ru' ? site.nameRu : currentLang === 'hi' ? site.nameHi : site.name}
                          </div>
                          <div className="text-[10px] text-amber-300/80">
                            {site.country === 'India' ? '🇮🇳 India' : '🇷🇺 Russia'} • {site.civilization}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Regions */}
              {matchedRegions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Regions & Archaeological Sites ({matchedRegions.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedRegions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => {
                          onSelectRegion(region);
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={region.image}
                          alt={region.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{region.name}</div>
                          <div className="text-[10px] text-amber-300/80">{region.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Videos */}
              {matchedVideos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5" /> Videos & Soul Story Episodes ({matchedVideos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedVideos.map((vid) => (
                      <button
                        key={vid.id}
                        onClick={() => {
                          onSelectVideo(vid);
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{vid.title}</div>
                          <div className="text-[10px] text-slate-400">{vid.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Authors */}
              {matchedAuthors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Feather className="h-3.5 w-3.5" /> Classical Authors & Literature ({matchedAuthors.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedAuthors.map((author) => (
                      <button
                        key={author.id}
                        onClick={() => {
                          onNavigate('literature');
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={author.portrait}
                          alt={author.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{author.name}</div>
                          <div className="text-[10px] text-amber-300/80">{author.years}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Victory Chronicles */}
              {matchedVictory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-red-500" /> Память победы • Heroic Chronicles ({matchedVictory.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedVictory.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onNavigate('victory');
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-red-950/60 bg-red-950/20 p-2.5 text-left hover:border-red-500/50 hover:bg-red-950/40 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-900/40 text-amber-300 font-bold border border-red-500/30 shrink-0">
                          <Flame className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{v.heroName}</div>
                          <div className="text-[10px] text-amber-300/80 truncate">{v.warName} • {v.dates}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Articles */}
              {matchedArticles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Newspaper className="h-3.5 w-3.5" /> Articles & Blogs ({matchedArticles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedArticles.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => {
                          onNavigate('articles');
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={art.image}
                          alt={art.title}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{art.title}</div>
                          <div className="text-[10px] text-slate-400">{art.author} • {art.category}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Opportunities */}
              {matchedOpportunities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" /> Opportunities & Scholarships ({matchedOpportunities.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {matchedOpportunities.map((opp) => (
                      <button
                        key={opp.id}
                        onClick={() => {
                          onNavigate('opportunities');
                          onClose();
                        }}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{opp.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {opp.category} • {opp.country} • {opp.funding}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-amber-400 shrink-0 ml-2">
                          View →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
