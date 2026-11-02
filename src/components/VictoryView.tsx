import React, { useState, useEffect } from 'react';
import { HeroicStory, WarEpoch, Language } from '../types';
import { heroicStoriesData } from '../data/victoryData';
import { translations } from '../i18n/translations';
import {
  Flame,
  Shield,
  Medal,
  Award,
  Search,
  Calendar,
  MapPin,
  Quote,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  PlusCircle,
  Trash2,
  Heart,
  Flag,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface VictoryViewProps {
  currentLang: Language;
  isAdmin?: boolean;
}

export const VictoryView: React.FC<VictoryViewProps> = ({ currentLang, isAdmin = false }) => {
  const t = translations[currentLang];

  // Dynamic stories state with localStorage persistence
  const [stories, setStories] = useState<HeroicStory[]>(() => {
    const saved = localStorage.getItem('sri_custom_heroic_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved heroic stories', e);
      }
    }
    return heroicStoriesData;
  });

  // Tributes paid counter
  const [tributesCount, setTributesCount] = useState<number>(() => {
    const saved = localStorage.getItem('sri_victory_tributes');
    return saved ? parseInt(saved, 10) : 1945;
  });
  const [hasPaidTribute, setHasPaidTribute] = useState<boolean>(false);

  // Filters & Search
  const [selectedEpoch, setSelectedEpoch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<HeroicStory | null>(null);

  // Admin Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleRu, setNewTitleRu] = useState('');
  const [newEpoch, setNewEpoch] = useState<WarEpoch>('ww2-great-patriotic');
  const [newWarName, setNewWarName] = useState('');
  const [newHeroName, setNewHeroName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDates, setNewDates] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newHeroAction, setNewHeroAction] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newBadge, setNewBadge] = useState('');

  const handlePayTribute = () => {
    if (hasPaidTribute) return;
    const newCount = tributesCount + 1;
    setTributesCount(newCount);
    setHasPaidTribute(true);
    localStorage.setItem('sri_victory_tributes', newCount.toString());
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroName.trim() || !newWarName.trim()) return;

    const created: HeroicStory = {
      id: `hero-custom-${Date.now()}`,
      title: newTitle.trim() || `The Heroic Stand of ${newHeroName.trim()}`,
      titleRu: newTitleRu.trim() || `Подвиг героя: ${newHeroName.trim()}`,
      epoch: newEpoch,
      warName: newWarName.trim(),
      warNameRu: newWarName.trim(),
      heroName: newHeroName.trim(),
      heroNameRu: newHeroName.trim(),
      roleOrRank: newRole.trim() || 'Heroic Combatant',
      roleOrRankRu: newRole.trim() || 'Герой Отечества',
      dates: newDates.trim() || 'Historical Period',
      location: newLocation.trim() || 'Eastern European Battlefield',
      locationRu: newLocation.trim() || 'Поле ратной славы',
      heroAction: newHeroAction.trim() || 'Demonstrated supreme valour and bravery in defense of the homeland.',
      heroActionRu: newHeroAction.trim() || 'Проявил беспримерное мужество и отвагу.',
      story: newStory.trim() || 'A chronicle of extraordinary courage and sacrifice.',
      storyRu: newStory.trim() || 'Летопись ратной славы и самопожертвования.',
      quote: newQuote.trim(),
      quoteRu: newQuote.trim(),
      image: newImage.trim() || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      badge: newBadge.trim() || 'Heroic Chronicle',
    };

    setStories((prev) => {
      const updated = [created, ...prev];
      try { localStorage.setItem('sri_custom_heroic_stories', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTitleRu('');
    setNewHeroName('');
    setNewWarName('');
    setNewRole('');
    setNewDates('');
    setNewLocation('');
    setNewHeroAction('');
    setNewStory('');
    setNewQuote('');
    setNewImage('');
    setNewBadge('');
  };

  const handleDeleteStory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this heroic chronicle?')) {
      setStories((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        try { localStorage.setItem('sri_custom_heroic_stories', JSON.stringify(updated)); } catch (err) {}
        return updated;
      });
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
    }
  };

  const epochLabels: { id: string; labelEn: string; labelRu: string; labelHi: string }[] = [
    { id: 'all', labelEn: 'All Epochs (Все эпохи)', labelRu: 'Все эпохи', labelHi: 'सभी काल' },
    { id: 'kievan-rus', labelEn: 'Kievan Rus & Medieval (1242–1380)', labelRu: 'Древняя Русь (1242–1380)', labelHi: 'प्राचीन रूस (1242–1380)' },
    { id: 'time-of-troubles', labelEn: 'Time of Troubles (1612)', labelRu: 'Смутное время (1612)', labelHi: 'संकट काल (1612)' },
    { id: 'peasant-uprisings', labelEn: 'Peasant Uprisings (1670–1775)', labelRu: 'Крестьянские восстания', labelHi: 'किसान विद्रोह (1670–1775)' },
    { id: 'napoleonic-1812', labelEn: 'Patriotic War of 1812 (Napoleon)', labelRu: 'Отечественная война 1812', labelHi: '1812 का युद्ध (नेपोलियन)' },
    { id: 'crimean-war', labelEn: 'Crimean War (1853–1856)', labelRu: 'Крымская война (1853–1856)', labelHi: 'क्रीमिया युद्ध (1853–1856)' },
    { id: 'ww1', labelEn: 'World War I (1914–1918)', labelRu: 'Первая мировая (1914–1918)', labelHi: 'प्रथम विश्व युद्ध' },
    { id: 'civil-war', labelEn: 'Civil War (1917–1922)', labelRu: 'Гражданская война', labelHi: 'गृहयुद्ध (1917–1922)' },
    { id: 'ww2-great-patriotic', labelEn: 'Great Patriotic War (WWII 1941–1945)', labelRu: 'Великая Отечественная (1941–1945)', labelHi: 'महान देशभक्ति युद्ध (1941–1945)' },
    { id: 'modern-valour', labelEn: 'Modern Valour (Till Today)', labelRu: 'Современный героизм', labelHi: 'आधुनिक शौर्य (आज तक)' },
  ];

  const filteredStories = stories.filter((story) => {
    const matchesEpoch = selectedEpoch === 'all' || story.epoch === selectedEpoch;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesEpoch;

    const matchesQuery =
      story.title.toLowerCase().includes(q) ||
      story.titleRu.toLowerCase().includes(q) ||
      story.heroName.toLowerCase().includes(q) ||
      story.heroNameRu.toLowerCase().includes(q) ||
      story.warName.toLowerCase().includes(q) ||
      story.warNameRu.toLowerCase().includes(q) ||
      story.location.toLowerCase().includes(q) ||
      story.heroAction.toLowerCase().includes(q) ||
      story.heroActionRu.toLowerCase().includes(q);

    return matchesEpoch && matchesQuery;
  });

  return (
    <section className="min-h-screen py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full flex flex-col items-center animate-fade-in">
      {/* Memorial Header with Eternal Flame */}
      <div className="text-center space-y-4 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-gradient-to-r from-red-950/60 via-amber-950/40 to-red-950/60 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase shadow-md">
          <Flame className="h-4 w-4 text-red-500 animate-pulse" />
          <span>Вечная слава героям • Immortal Memorial of Valour</span>
          <Flame className="h-4 w-4 text-red-500 animate-pulse" />
        </div>

        <h1 className="font-cinzel text-3xl xs:text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-wide break-words drop-shadow-sm">
          {currentLang === 'ru'
            ? 'ПАМЯТЬ ПОБЕДЫ'
            : currentLang === 'hi'
            ? 'विजय की स्मृति (ПАМЯТЬ ПОБЕДЫ)'
            : 'MEMORY OF VICTORY'}
        </h1>

        <p className="text-sm sm:text-lg text-slate-700 leading-relaxed font-serif-culture max-w-3xl mx-auto">
          {currentLang === 'ru'
            ? 'Летопись ратной славы, самопожертвования и народного подвига: от богатырских битв Древней Руси, крестьянских восстаний и Отечественной войны 1812 года до Великой Отечественной войны и современных героев.'
            : currentLang === 'hi'
            ? 'प्राचीन कीवियन रूस, किसान विद्रोह, 1812 के नेपोलियन युद्ध, प्रथम व द्वितीय विश्व युद्ध से लेकर आज तक के अमर वीरों, उनके ऐतिहासिक युद्धों और आत्मबलिदान की गौरवशाली गाथा।'
            : 'A chronicle of heroic warfare, self-sacrifice, and popular fortitude: from the bogatyr shields of Kievan Rus, peasant uprisings, and the Patriotic War of 1812 against Napoleon, to the Great Patriotic War (WWII) and modern defenders.'}
        </p>

        {/* Tribute & Eternal Flame Action Banner */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <button
            onClick={handlePayTribute}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer ${
              hasPaidTribute
                ? 'bg-red-800 text-white cursor-default'
                : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 hover:scale-105 active:scale-95'
            }`}
          >
            <Flame className="h-4 w-4 text-amber-200 fill-amber-300" />
            <span>
              {hasPaidTribute
                ? currentLang === 'ru'
                  ? 'Дань памяти отдана'
                  : 'Tribute Honoured'
                : currentLang === 'ru'
                ? 'Почтить память героев'
                : 'Pay Tribute to the Fallen'}
            </span>
            <span className="ml-1 rounded-full bg-black/30 px-2 py-0.5 text-xs font-mono">
              {tributesCount.toLocaleString()}
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-amber-500 bg-amber-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-800 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Add Heroic Chronicle (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Epochs Navigation & Filter Toolbar */}
      <div className="w-full space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ru'
                ? 'Поиск по герою, войне, дате или подвигу (Александр Невский, Бородино, Сталинград...)'
                : 'Search hero, war, date, location, or deed (Nevsky, Borodino, Stalingrad, Panfilov...)'
            }
            className="w-full rounded-2xl border border-slate-300 bg-white/90 pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 shadow-sm focus:border-red-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Horizontal Epoch Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin max-w-full justify-start sm:justify-center">
          {epochLabels.map((ep) => {
            const isSelected = selectedEpoch === ep.id;
            const count =
              ep.id === 'all' ? stories.length : stories.filter((s) => s.epoch === ep.id).length;

            return (
              <button
                key={ep.id}
                onClick={() => setSelectedEpoch(ep.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-800 text-white font-bold shadow-md scale-105'
                    : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>
                  {currentLang === 'ru' ? ep.labelRu : currentLang === 'hi' ? ep.labelHi : ep.labelEn}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-red-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Heroic Chronicles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {filteredStories.map((story) => {
          return (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-xl cursor-pointer"
            >
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

              <div className="space-y-4">
                {/* War Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-900 border border-red-200 uppercase tracking-wide truncate max-w-[200px]">
                    {currentLang === 'ru' ? story.warNameRu : story.warName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                    <Calendar className="h-3 w-3 text-red-600" />
                    <span>{story.dates}</span>
                  </span>
                </div>

                {/* Hero Name & Rank */}
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                    {currentLang === 'ru' ? story.heroNameRu : story.heroName}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800">
                    {currentLang === 'ru' ? story.roleOrRankRu : story.roleOrRank}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{currentLang === 'ru' ? story.locationRu || story.location : story.location}</span>
                </div>

                {/* Heroic Deed Summary */}
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3.5 text-xs text-slate-800 leading-relaxed font-serif-culture">
                  <span className="font-bold text-red-900 block mb-1">
                    {currentLang === 'ru' ? 'Ратный подвиг:' : 'Heroic Feat & Sacrifice:'}
                  </span>
                  {currentLang === 'ru' ? story.heroActionRu : story.heroAction}
                </div>

                {/* Historical Quotation */}
                {story.quote && (
                  <div className="relative pl-3 border-l-2 border-amber-500 text-xs italic text-slate-600">
                    <Quote className="h-3 w-3 text-amber-600 inline mr-1 -mt-1 opacity-60" />
                    <span>"{currentLang === 'ru' ? story.quoteRu || story.quote : story.quote}"</span>
                  </div>
                )}

                {/* Indo-Soviet / Bilateral Solidarity badge if present */}
                {story.solidarityNote && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-[11px] font-semibold text-amber-900 flex items-center gap-2">
                    <Medal className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{currentLang === 'ru' ? story.solidarityNoteRu || story.solidarityNote : story.solidarityNote}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
                  <span>{currentLang === 'ru' ? 'Читать хронику' : 'Inspect Dossier'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>

                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteStory(story.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete chronicle (Admin)"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Shield className="h-12 w-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="font-cinzel text-lg font-bold text-slate-700">No heroic chronicles matched your query</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or select "All Epochs".</p>
        </div>
      )}

      {/* Hero Dossier Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-red-500/40 bg-[#0d1424] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-5 right-5 rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              {/* Header Badge */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Medal className="h-4 w-4 text-amber-400" />
                <span>{selectedStory.badge || 'Heroic Dossier of Valour'}</span>
              </div>

              {/* Title & Name */}
              <div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  {currentLang === 'ru' ? selectedStory.heroNameRu : selectedStory.heroName}
                </h2>
                <p className="text-sm text-amber-300 mt-1 font-semibold">
                  {currentLang === 'ru' ? selectedStory.roleOrRankRu : selectedStory.roleOrRank}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400 shrink-0" />
                  <span>
                    <strong>{currentLang === 'ru' ? 'Сражение / Война:' : 'Battle / War:'}</strong>{' '}
                    {currentLang === 'ru' ? selectedStory.warNameRu : selectedStory.warName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>{currentLang === 'ru' ? 'Даты подвига:' : 'Date:'}</strong> {selectedStory.dates}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>{currentLang === 'ru' ? 'Место подвига:' : 'Location:'}</strong>{' '}
                    {currentLang === 'ru' ? selectedStory.locationRu || selectedStory.location : selectedStory.location}
                  </span>
                </div>
              </div>

              {/* Heroic Feat Highlight */}
              <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 space-y-1">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">
                  {currentLang === 'ru' ? 'Бессмертный подвиг:' : 'The Heroic Action & Sacrifice:'}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif-culture">
                  {currentLang === 'ru' ? selectedStory.heroActionRu : selectedStory.heroAction}
                </p>
              </div>

              {/* Full Historical Chronicle */}
              <div className="space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-amber-300">
                  {currentLang === 'ru' ? 'Историческая летопись' : 'Full Historical Narrative'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture whitespace-pre-line">
                  {currentLang === 'ru' ? selectedStory.storyRu : selectedStory.story}
                </p>
              </div>

              {/* Quotation */}
              {selectedStory.quote && (
                <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 p-4 italic text-xs sm:text-sm text-amber-200">
                  "{currentLang === 'ru' ? selectedStory.quoteRu || selectedStory.quote : selectedStory.quote}"
                </div>
              )}

              {/* Legacy / Outcome */}
              {selectedStory.outcomeOrLegacy && (
                <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">
                  <strong className="text-slate-300 block mb-1">
                    {currentLang === 'ru' ? 'Память и историческое наследие:' : 'Historical Legacy & Memorial:'}
                  </strong>
                  <span>{currentLang === 'ru' ? selectedStory.outcomeOrLegacyRu || selectedStory.outcomeOrLegacy : selectedStory.outcomeOrLegacy}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Heroic Story Modal */}
      {isAdmin && isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0c1424] p-6 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-red-500" />
                <span>Add Heroic Chronicle (Admin)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hero Name *</label>
                  <input
                    type="text"
                    required
                    value={newHeroName}
                    onChange={(e) => setNewHeroName(e.target.value)}
                    placeholder="e.g. Alexander Nevsky"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">War / Battle Name *</label>
                  <input
                    type="text"
                    required
                    value={newWarName}
                    onChange={(e) => setNewWarName(e.target.value)}
                    placeholder="e.g. Battle on the Ice (1242)"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Epoch / Period *</label>
                  <select
                    value={newEpoch}
                    onChange={(e) => setNewEpoch(e.target.value as WarEpoch)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="kievan-rus">Kievan Rus & Medieval (1242–1380)</option>
                    <option value="time-of-troubles">Time of Troubles (1612)</option>
                    <option value="peasant-uprisings">Peasant Uprisings (1670–1775)</option>
                    <option value="napoleonic-1812">Patriotic War of 1812 (Napoleon)</option>
                    <option value="crimean-war">Crimean War (1853–1856)</option>
                    <option value="ww1">World War I (1914–1918)</option>
                    <option value="civil-war">Civil War (1917–1922)</option>
                    <option value="ww2-great-patriotic">Great Patriotic War (WWII 1941–1945)</option>
                    <option value="modern-valour">Modern Valour (Till Today)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rank / Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Commander of Volunteer Regiment"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dates / Year</label>
                  <input
                    type="text"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    placeholder="e.g. 5 April 1242"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Battle Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Lake Peipus"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Heroic Action / Sacrifice *</label>
                <textarea
                  required
                  rows={2}
                  value={newHeroAction}
                  onChange={(e) => setNewHeroAction(e.target.value)}
                  placeholder="Summary of the heroic deed, sacrifice, or decisive action..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Chronicle / Story *</label>
                <textarea
                  required
                  rows={4}
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Detailed narrative of the battle, conditions, and bravery..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Historical Quote (Optional)</label>
                  <input
                    type="text"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="e.g. Whoever comes with a sword..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Photo / Emblem URL</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-5 py-2 font-bold text-white shadow-md hover:from-red-500 hover:to-amber-500 cursor-pointer"
                >
                  Publish Chronicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
