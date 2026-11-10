import React, { useState, useMemo, useEffect } from 'react';
import { Region, VideoItem, SoulStoryEpisode, Language, VideoCategory } from '../types';
import { translations } from '../i18n/translations';
import { InteractiveMap } from './InteractiveMap';
import { formatVideoEmbedUrl } from './VideoPlayerModal';
import { normalizeMediaUrl, readFileAsDataUrl } from '../utils/imageUpload';
import {
  Film,
  Play,
  Clock,
  Landmark,
  MapPin,
  PlusCircle,
  Trash2,
  X,
  PenTool,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
} from 'lucide-react';

interface HeritageViewProps {
  currentLang: Language;
  regions: Region[];
  soulStories: SoulStoryEpisode[];
  heritageVideos: VideoItem[];
  onSelectRegion: (region: Region) => void;
  onPlayVideo: (item: VideoItem | SoulStoryEpisode) => void;
  isAdmin?: boolean;
  onAddRegion?: (region: Region) => void;
  onUpdateRegion?: (region: Region) => void;
  onDeleteRegion?: (regionId: string) => void;
  onAddVideo?: (vid: VideoItem) => void;
  onDeleteVideo?: (vidId: string) => void;
  onUpdateVideo?: (
    videoId: string,
    updates: {
      videoUrl: string;
      title?: string;
      titleRu?: string;
      titleHi?: string;
      thumbnail?: string;
      shortDescription?: string;
      duration?: string;
      category?: VideoCategory;
    }
  ) => void;
}

const ITEMS_PER_PAGE = 18;

export const HeritageView: React.FC<HeritageViewProps> = ({
  currentLang,
  regions,
  soulStories,
  heritageVideos,
  onSelectRegion,
  onPlayVideo,
  isAdmin = false,
  onAddRegion,
  onAddVideo,
  onDeleteVideo,
  onUpdateVideo,
}) => {
  const t = translations[currentLang];
  const [activeMapCountry, setActiveMapCountry] = useState<'Russia' | 'India'>('Russia');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('All');
  const [videoCountryFilter, setVideoCountryFilter] = useState<string>('All');
  const [confirmDeleteVideoId, setConfirmDeleteVideoId] = useState<string | null>(null);

  // Admin Add Region Modal State
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [regCountry, setRegCountry] = useState<'Russia' | 'India'>('Russia');
  const [regType, setRegType] = useState('Oblast');
  const [regZone, setRegZone] = useState('Central');
  const [regName, setRegName] = useState('');
  const [regNameRu, setRegNameRu] = useState('');
  const [regNameHi, setRegNameHi] = useState('');
  const [regCapital, setRegCapital] = useState('');
  const [regCapitalRu, setRegCapitalRu] = useState('');
  const [regCapitalHi, setRegCapitalHi] = useState('');
  const [regSubtitle, setRegSubtitle] = useState('');
  const [regSubtitleRu, setRegSubtitleRu] = useState('');
  const [regSubtitleHi, setRegSubtitleHi] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regDescRu, setRegDescRu] = useState('');
  const [regDescHi, setRegDescHi] = useState('');
  const [regHeritage, setRegHeritage] = useState('');
  const [regHeritageRu, setRegHeritageRu] = useState('');
  const [regHeritageHi, setRegHeritageHi] = useState('');
  const [regPlaces, setRegPlaces] = useState('');
  const [regFeatures, setRegFeatures] = useState('');
  const [regFacts, setRegFacts] = useState('');
  const [regTraditions, setRegTraditions] = useState('');
  const [regLat, setRegLat] = useState('55.75');
  const [regLng, setRegLng] = useState('37.61');
  const [regImage, setRegImage] = useState('');
  const [regVideoUrl, setRegVideoUrl] = useState('');

  // Admin Edit Video State
  const [editingVideo, setEditingVideo] = useState<(VideoItem | SoulStoryEpisode) | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleRu, setEditTitleRu] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editThumb, setEditThumb] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCategory, setEditCategory] = useState<VideoCategory>('Archaeology');
  const [editDesc, setEditDesc] = useState('');

  // Admin Add Video Modal State
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleRu, setNewTitleRu] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newCountry, setNewCountry] = useState<'Russia' | 'India' | 'Both'>('Russia');
  const [newRegion, setNewRegion] = useState('');
  const [newCategory, setNewCategory] = useState<VideoCategory>('Archaeology');
  const [newUrl, setNewUrl] = useState('');
  const [newThumb, setNewThumb] = useState('');
  const [newDuration, setNewDuration] = useState('15:00');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    setSelectedZone('All');
    setSelectedType('All');
    setSearchQuery('');
    setCurrentPage(1);
  }, [activeMapCountry]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedZone, selectedType]);

  const russiaCount = useMemo(
    () => regions.filter((r) => r.country === 'Russia').length,
    [regions]
  );
  const indiaCount = useMemo(
    () => regions.filter((r) => r.country === 'India').length,
    [regions]
  );

  const countryRegions = useMemo(
    () => regions.filter((r) => r.country === activeMapCountry),
    [regions, activeMapCountry]
  );

  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    countryRegions.forEach((r) => {
      if (r.federalDistrictOrZone) zones.add(r.federalDistrictOrZone);
    });
    return ['All', ...Array.from(zones).sort()];
  }, [countryRegions]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    countryRegions.forEach((r) => {
      if (r.regionType) types.add(r.regionType);
    });
    return ['All', ...Array.from(types).sort()];
  }, [countryRegions]);

  const filteredRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return countryRegions.filter((r) => {
      const matchZone = selectedZone === 'All' || r.federalDistrictOrZone === selectedZone;
      const matchType = selectedType === 'All' || r.regionType === selectedType;
      if (!matchZone || !matchType) return false;
      if (!q) return true;
      const haystack = [
        r.name,
        r.nameRu,
        r.nameHi,
        r.capital,
        r.capitalRu,
        r.capitalHi,
        r.shortDescription,
        ...(r.historicalPlaces || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [countryRegions, selectedZone, selectedType, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRegions.length / ITEMS_PER_PAGE));
  const paginatedRegions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRegions, currentPage]);

  const getLocalized = (en?: string, ru?: string, hi?: string) => {
    if (currentLang === 'ru') return ru || en || '';
    if (currentLang === 'hi') return hi || en || '';
    return en || '';
  };

  const handleCreateRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !onAddRegion) return;

    const fallbackImg =
      regCountry === 'Russia'
        ? '/cultural_images/novgorod_kremlin.jpg'
        : '/cultural_images/indian_gaon.jpg';

    const created: Region = {
      id: `${regCountry === 'Russia' ? 'ru' : 'in'}-custom-${Date.now()}`,
      country: regCountry,
      regionType: regType.trim() || (regCountry === 'Russia' ? 'Oblast' : 'State'),
      federalDistrictOrZone: regZone.trim() || 'Central',
      capital: regCapital.trim() || regName.trim(),
      capitalRu: regCapitalRu.trim() || regCapital.trim(),
      capitalHi: regCapitalHi.trim() || regCapital.trim(),
      name: regName.trim(),
      nameRu: regNameRu.trim() || regName.trim(),
      nameHi: regNameHi.trim() || regName.trim(),
      subtitle: regSubtitle.trim(),
      subtitleRu: regSubtitleRu.trim() || regSubtitle.trim(),
      subtitleHi: regSubtitleHi.trim() || regSubtitle.trim(),
      mapX: 50,
      mapY: 50,
      lat: parseFloat(regLat) || (regCountry === 'Russia' ? 55.75 : 22.5),
      lng: parseFloat(regLng) || (regCountry === 'Russia' ? 37.61 : 79.0),
      shortDescription: regDesc.trim() || 'Cultural and historical region.',
      shortDescriptionRu: regDescRu.trim() || regDesc.trim(),
      shortDescriptionHi: regDescHi.trim() || regDesc.trim(),
      heritageInfo: regHeritage.trim() || regDesc.trim() || 'Rich regional monuments and heritage.',
      heritageInfoRu: regHeritageRu.trim() || regHeritage.trim(),
      heritageInfoHi: regHeritageHi.trim() || regHeritage.trim(),
      historicalPlaces: regPlaces
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      specificFeatures: regFeatures
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      funFacts: regFacts
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      traditions: regTraditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image: normalizeMediaUrl(regImage.trim()) || fallbackImg,
      videoUrl: regVideoUrl.trim() || undefined,
    };

    onAddRegion(created);
    setActiveMapCountry(regCountry);
    setIsAddRegionOpen(false);
    setRegName('');
    setRegNameRu('');
    setRegNameHi('');
    setRegCapital('');
    setRegCapitalRu('');
    setRegCapitalHi('');
    setRegSubtitle('');
    setRegSubtitleRu('');
    setRegSubtitleHi('');
    setRegDesc('');
    setRegDescRu('');
    setRegDescHi('');
    setRegHeritage('');
    setRegHeritageRu('');
    setRegHeritageHi('');
    setRegPlaces('');
    setRegFeatures('');
    setRegFacts('');
    setRegTraditions('');
    setRegImage('');
    setRegVideoUrl('');
  };

  const handleOpenEditModal = (target: VideoItem | SoulStoryEpisode) => {
    setEditingVideo(target);
    setEditTitle(target.title);
    setEditTitleRu(target.titleRu);
    setEditUrl(target.videoUrl);
    setEditThumb(target.thumbnail);
    setEditDuration('duration' in target && target.duration ? target.duration : '15:00');
    if ('category' in target) {
      setEditCategory(target.category);
      setEditDesc(target.shortDescription);
    } else {
      setEditDesc((target as SoulStoryEpisode).description);
    }
  };

  const handleSaveVideoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !onUpdateVideo) return;
    const formattedUrl = formatVideoEmbedUrl(editUrl);
    onUpdateVideo(editingVideo.id, {
      videoUrl: formattedUrl,
      title: editTitle.trim(),
      titleRu: editTitleRu.trim(),
      thumbnail: editThumb.trim(),
      duration: editDuration.trim(),
      shortDescription: editDesc.trim(),
      category: editCategory,
    });
    setEditingVideo(null);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !onAddVideo) return;

    const createdVideo: VideoItem = {
      id: `vid-custom-${Date.now()}`,
      title: newTitle.trim(),
      titleRu: newTitleRu.trim() || newTitle.trim(),
      titleHi: newTitleHi.trim() || newTitle.trim(),
      country: newCountry,
      region: newRegion.trim() || (newCountry === 'Russia' ? 'Russia' : 'India'),
      category: newCategory,
      videoUrl: newUrl.trim() || 'https://www.youtube.com/embed/oXSEBaTBZpA',
      thumbnail: newThumb.trim() || '/cultural_images/novgorod_kremlin.jpg',
      duration: newDuration.trim() || '15:00',
      shortDescription: newDesc.trim() || 'Documentary exploring bilateral cultural heritage.',
      date: new Date().toISOString().split('T')[0],
    };

    onAddVideo(createdVideo);
    setIsAddVideoModalOpen(false);
    setNewTitle('');
    setNewTitleRu('');
    setNewTitleHi('');
    setNewRegion('');
    setNewUrl('');
    setNewThumb('');
    setNewDesc('');
  };

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

  const filteredVideos = heritageVideos.filter((vid) => {
    const matchesCategory = videoCategoryFilter === 'All' || vid.category === videoCategoryFilter;
    const matchesCountry =
      videoCountryFilter === 'All' ||
      vid.country === videoCountryFilter ||
      vid.country === 'Both';
    return matchesCategory && matchesCountry;
  });

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-14 w-full flex flex-col items-center">
      {/* Top Editorial Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto w-full">
        <div className="text-xs font-bold tracking-[0.18em] text-amber-700 uppercase">
          <Landmark className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-amber-600" />
          Archaeology · Architecture · Living Heritage Atlas
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-wide break-words">
          {t.heritage.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-serif-culture">
          {currentLang === 'ru'
            ? `Полный атлас наследия: все ${russiaCount} регионов Российской Федерации и все ${indiaCount} штатов и союзных территорий Республики Индия.`
            : currentLang === 'hi'
            ? `संपूर्ण विरासत मानचित्र: रूसी संघ के सभी ${russiaCount} क्षेत्र और भारत के सभी ${indiaCount} राज्य एवं केंद्र शासित प्रदेश।`
            : `Complete Eurasian Heritage Atlas: all ${russiaCount} regions of the Russian Federation and all ${indiaCount} States & Union Territories of India.`}
        </p>
      </div>

      {/* Country Switcher Cards */}
      <div className="w-full space-y-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <button
            onClick={() => setActiveMapCountry('Russia')}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-200 cursor-pointer ${
              activeMapCountry === 'Russia'
                ? 'border-blue-400 bg-gradient-to-br from-blue-950/90 to-slate-900 shadow-xl ring-2 ring-blue-400'
                : 'border-slate-800 bg-slate-900/85 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Russian Federation · {russiaCount} Regions
              </span>
              <span
                className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${
                  activeMapCountry === 'Russia'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {activeMapCountry === 'Russia' ? 'Active Atlas' : 'Explore Russia'}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
              {t.heritage.russiaMapTab}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Federal Cities, 24 Republics, 9 Krais, 48 Oblasts, Jewish Autonomous Oblast & 4 Autonomous Okrugs—from Kaliningrad to Chukotka.
            </p>
          </button>

          <button
            onClick={() => setActiveMapCountry('India')}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-200 cursor-pointer ${
              activeMapCountry === 'India'
                ? 'border-amber-400 bg-gradient-to-br from-amber-950/90 to-slate-900 shadow-xl ring-2 ring-amber-400'
                : 'border-slate-800 bg-slate-900/85 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Republic of India · {indiaCount} States & UTs
              </span>
              <span
                className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${
                  activeMapCountry === 'India'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {activeMapCountry === 'India' ? 'Active Atlas' : 'Explore India'}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
              {t.heritage.indiaMapTab}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              All 28 States & 8 Union Territories—from Ladakh and Kashmir to Kanyakumari, Gujarat’s Dholavira to the Northeast’s Living Root Bridges.
            </p>
          </button>
        </div>

        {/* Interactive Map */}
        <InteractiveMap
          country={activeMapCountry}
          regions={filteredRegions}
          selectedRegionId={null}
          onSelectRegion={onSelectRegion}
          currentLang={currentLang}
        />

        {/* Regional Directory with Search, Filters, Pagination & Admin Add/Edit */}
        <div className="rounded-2xl border border-amber-500/20 bg-[#0b1322] p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                {activeMapCountry === 'Russia'
                  ? currentLang === 'ru'
                    ? 'Регионы Российской Федерации'
                    : currentLang === 'hi'
                    ? 'रूसी संघ के क्षेत्र'
                    : 'Regions of the Russian Federation'
                  : currentLang === 'ru'
                  ? 'Штаты и союзные территории Индии'
                  : currentLang === 'hi'
                  ? 'भारत के राज्य और केंद्र शासित प्रदेश'
                  : 'States & Union Territories of India'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredRegions.length} of {countryRegions.length} mapped regions · Click any card for sites, features, facts & media
              </p>
            </div>

            {isAdmin && onAddRegion && (
              <button
                onClick={() => {
                  setRegCountry(activeMapCountry);
                  setIsAddRegionOpen(true);
                }}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold shadow cursor-pointer self-start lg:self-auto"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Admin: Add New Region</span>
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  currentLang === 'ru'
                    ? 'Поиск по названию, столице, памятнику...'
                    : currentLang === 'hi'
                    ? 'नाम, राजधानी या विरासत स्थल खोजें...'
                    : 'Search region, capital, or heritage site...'
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              {availableZones.map((z) => (
                <option key={z} value={z}>
                  {z === 'All'
                    ? activeMapCountry === 'Russia'
                      ? 'All Federal Districts'
                      : 'All Zones'
                    : z}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              {availableTypes.map((tp) => (
                <option key={tp} value={tp}>
                  {tp === 'All' ? 'All Region Types' : tp}
                </option>
              ))}
            </select>
          </div>

          {/* Regions Grid */}
          {paginatedRegions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No regions match your current search or filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedRegions.map((region) => {
                const fallbackImg =
                  region.country === 'Russia'
                    ? '/cultural_images/novgorod_kremlin.jpg'
                    : '/cultural_images/indian_gaon.jpg';
                const name = getLocalized(region.name, region.nameRu, region.nameHi);
                const capital = getLocalized(region.capital, region.capitalRu, region.capitalHi);
                const desc = getLocalized(
                  region.shortDescription,
                  region.shortDescriptionRu,
                  region.shortDescriptionHi
                );

                return (
                  <div
                    key={region.id}
                    onClick={() => onSelectRegion(region)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-400/60 transition-all cursor-pointer"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                      <img
                        src={normalizeMediaUrl(region.image) || fallbackImg}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImg;
                        }}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      {isAdmin && (
                        <span className="absolute top-2.5 right-2.5 rounded-md bg-black/75 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          Admin Edit
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4 space-y-2">
                      <div className="text-[11px] font-medium text-amber-400/90 truncate">
                        {region.regionType || region.country}
                        {region.federalDistrictOrZone ? ` · ${region.federalDistrictOrZone}` : ''}
                        {capital ? ` · ${capital}` : ''}
                      </div>

                      <h3 className="font-cinzel text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {name}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed flex-1">
                        {desc}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[65%]">
                          {region.historicalPlaces?.[0] || 'Heritage Sites'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400 whitespace-nowrap shrink-0">
                          <Eye className="h-3 w-3" />
                          <span>Dossier</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="whitespace-nowrap shrink-0 inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-40 hover:border-amber-400 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="whitespace-nowrap shrink-0 inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-40 hover:border-amber-400 cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOUL STORIES VIDEO SERIES */}
      <div className="w-full rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#0e172a] to-[#070c18] p-6 sm:p-10 shadow-2xl space-y-8">
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
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-300 hover:border-amber-400/50 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={episode.thumbnail}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/cultural_images/novgorod_kremlin.jpg';
                    }}
                    alt={episode.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
                    EP {episode.episodeNumber < 10 ? `0${episode.episodeNumber}` : episode.episodeNumber}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-slate-200 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>{episode.duration}</span>
                  </div>

                  <button
                    onClick={() => onPlayVideo(episode)}
                    className="absolute inset-0 flex items-center justify-center focus:outline-none cursor-pointer"
                    aria-label={`Play ${title}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/90 text-slate-950 shadow-lg transition-transform duration-200 group-hover:scale-125">
                      <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                    </div>
                  </button>

                  {isAdmin && onUpdateVideo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(episode);
                      }}
                      className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 rounded-md bg-black/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 px-2 py-1 text-[10px] font-bold border border-amber-500/40 transition-all cursor-pointer shadow-md"
                    >
                      <PenTool className="h-3 w-3" />
                      <span>Edit Video</span>
                    </button>
                  )}
                </div>

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
                    <span className="text-[11px] text-slate-400">
                      {episode.keyThemes.slice(0, 2).join(' · ')}
                    </span>
                    <button
                      onClick={() => onPlayVideo(episode)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
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

      {/* HERITAGE VIDEO ARCHIVE */}
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-slate-900">
              {t.heritage.allVideosTitle}
            </h2>
            <p className="text-xs text-slate-600">
              Filter by archaeological and cultural categories
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              {(['All', 'Russia', 'India'] as const).map((cntry) => (
                <button
                  key={cntry}
                  onClick={() => setVideoCountryFilter(cntry)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    videoCountryFilter === cntry
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cntry === 'All' ? t.heritage.filterAll : cntry}
                </button>
              ))}
            </div>

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

            {isAdmin && (
              <button
                onClick={() => setIsAddVideoModalOpen(true)}
                className="whitespace-nowrap shrink-0 flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold shadow cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Admin: Add Video</span>
              </button>
            )}
          </div>
        </div>

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
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/cultural_images/novgorod_kremlin.jpg';
                    }}
                    alt={vid.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    {vid.category}
                  </span>
                  {vid.duration && (
                    <span className="absolute bottom-2.5 right-2.5 rounded bg-black/70 px-2 py-0.5 text-[10px] text-slate-300">
                      {vid.duration}
                    </span>
                  )}
                  <button
                    onClick={() => onPlayVideo(vid)}
                    className="absolute inset-0 flex items-center justify-center focus:outline-none cursor-pointer"
                    aria-label={`Play ${title}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-slate-950 opacity-90 transition-transform group-hover:scale-110">
                      <Play className="h-4 w-4 fill-slate-950 ml-0.5" />
                    </div>
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>
                      {vid.country} · {vid.region}
                    </span>
                    <span>{vid.date}</span>
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                    {vid.shortDescription}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">{vid.category}</span>
                    <div className="flex items-center gap-2">
                      {isAdmin && onUpdateVideo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(vid);
                          }}
                          className="p-1 rounded text-amber-400 hover:bg-amber-950/60 border border-amber-500/30 cursor-pointer"
                          title="Edit Video"
                        >
                          <PenTool className="h-3 w-3" />
                        </button>
                      )}
                      {isAdmin && onDeleteVideo && (
                        confirmDeleteVideoId === vid.id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteVideo(vid.id);
                              setConfirmDeleteVideoId(null);
                            }}
                            className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white cursor-pointer"
                          >
                            Confirm
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteVideoId(vid.id);
                            }}
                            className="p-1 rounded text-red-400 hover:bg-red-950/60 border border-red-500/30 cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )
                      )}
                      <button
                        onClick={() => onPlayVideo(vid)}
                        className="font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                      >
                        Play →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Add New Region Modal */}
      {isAdmin && isAddRegionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0a1220] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-amber-400" />
                <span>Admin: Add New Region</span>
              </h3>
              <button
                onClick={() => setIsAddRegionOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRegion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Region Name (EN) *</label>
                  <input
                    required
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region Name (RU)</label>
                  <input
                    type="text"
                    value={regNameRu}
                    onChange={(e) => setRegNameRu(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region Name (HI)</label>
                  <input
                    type="text"
                    value={regNameHi}
                    onChange={(e) => setRegNameHi(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <select
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value as 'Russia' | 'India')}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  >
                    <option value="Russia">Russia</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <input
                    type="text"
                    value={regType}
                    onChange={(e) => setRegType(e.target.value)}
                    placeholder="Oblast / State"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">District / Zone</label>
                  <input
                    type="text"
                    value={regZone}
                    onChange={(e) => setRegZone(e.target.value)}
                    placeholder="Central / North"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={regLat}
                    onChange={(e) => setRegLat(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={regLng}
                    onChange={(e) => setRegLng(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Capital (EN)</label>
                  <input
                    type="text"
                    value={regCapital}
                    onChange={(e) => setRegCapital(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Capital (RU)</label>
                  <input
                    type="text"
                    value={regCapitalRu}
                    onChange={(e) => setRegCapitalRu(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Capital (HI)</label>
                  <input
                    type="text"
                    value={regCapitalHi}
                    onChange={(e) => setRegCapitalHi(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Short Description (EN) *</label>
                  <textarea
                    required
                    rows={2}
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Short Description (RU)</label>
                  <textarea
                    rows={2}
                    value={regDescRu}
                    onChange={(e) => setRegDescRu(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Short Description (HI)</label>
                  <textarea
                    rows={2}
                    value={regDescHi}
                    onChange={(e) => setRegDescHi(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Heritage Info (EN) *</label>
                  <textarea
                    required
                    rows={2}
                    value={regHeritage}
                    onChange={(e) => setRegHeritage(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Heritage Info (RU)</label>
                  <textarea
                    rows={2}
                    value={regHeritageRu}
                    onChange={(e) => setRegHeritageRu(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Heritage Info (HI)</label>
                  <textarea
                    rows={2}
                    value={regHeritageHi}
                    onChange={(e) => setRegHeritageHi(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Heritage Sites (1 per line)</label>
                  <textarea
                    rows={2}
                    value={regPlaces}
                    onChange={(e) => setRegPlaces(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Specific Features (1 per line)</label>
                  <textarea
                    rows={2}
                    value={regFeatures}
                    onChange={(e) => setRegFeatures(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Notable Facts (1 per line)</label>
                  <textarea
                    rows={2}
                    value={regFacts}
                    onChange={(e) => setRegFacts(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Traditions (comma-separated)</label>
                  <input
                    type="text"
                    value={regTraditions}
                    onChange={(e) => setRegTraditions(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Video URL (YouTube / Google Drive / MP4)</label>
                  <input
                    type="text"
                    value={regVideoUrl}
                    onChange={(e) => setRegVideoUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Photo URL, Google Drive Link, or Upload</label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={regImage}
                    onChange={(e) => setRegImage(e.target.value)}
                    placeholder="https://... or /cultural_images/..."
                    className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-amber-300 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await readFileAsDataUrl(file);
                          setRegImage(dataUrl);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRegionOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 font-bold text-slate-950 cursor-pointer"
                >
                  Add Region to Atlas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Video Modal */}
      {isAdmin && isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#0a1220] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Film className="h-4 w-4 text-amber-400" />
                <span>Admin: Add New Heritage Video</span>
              </h3>
              <button
                onClick={() => setIsAddVideoModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title (Russian)</label>
                  <input
                    type="text"
                    value={newTitleRu}
                    onChange={(e) => setNewTitleRu(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={newTitleHi}
                    onChange={(e) => setNewTitleHi(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value as 'Russia' | 'India' | 'Both')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  >
                    <option value="Russia">Russia</option>
                    <option value="India">India</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Region</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VideoCategory)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={newThumb}
                    onChange={(e) => setNewThumb(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Video Modal */}
      {isAdmin && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0c1424] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <PenTool className="h-5 w-5 text-amber-400" />
                <span>Admin: Edit & Replace Video</span>
              </h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video URL *</label>
                <input
                  type="text"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title (Russian)</label>
                  <input
                    type="text"
                    value={editTitleRu}
                    onChange={(e) => setEditTitleRu(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={editThumb}
                    onChange={(e) => setEditThumb(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
