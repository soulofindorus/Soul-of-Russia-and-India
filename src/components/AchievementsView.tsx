import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { formatVideoEmbedUrl } from './VideoPlayerModal';
import {
  readFileAsDataUrl,
  normalizeMediaUrl,
  getDriveVideoEmbedUrl,
} from '../utils/imageUpload';
import {
  Award,
  Trophy,
  Film,
  Image as ImageIcon,
  FileBadge2,
  PlusCircle,
  PenTool,
  Trash2,
  X,
  Upload,
  Save,
  Play,
  Calendar,
  Eye,
} from 'lucide-react';

export interface FeaturedAchievement {
  videoUrl: string;
  badgeEn: string;
  badgeRu: string;
  badgeHi: string;
  titleEn: string;
  titleRu: string;
  titleHi: string;
  captionEn: string;
  captionRu: string;
  captionHi: string;
  date: string;
}

export type AchievementItemType = 'certificate' | 'photo' | 'video';

export interface AchievementItem {
  id: string;
  type: AchievementItemType;
  titleEn: string;
  titleRu: string;
  titleHi: string;
  captionEn: string;
  captionRu: string;
  captionHi: string;
  issuer?: string;
  date: string;
  mediaUrl: string;
  thumbnailUrl?: string;
}

const DEFAULT_FEATURED: FeaturedAchievement = {
  videoUrl: 'https://youtu.be/Dt3C7TK_fac?si=CEJ6x0kTzMcGA0Tu',
  badgeEn: 'Second Prize · Eurasian Awards',
  badgeRu: 'Вторая премия · Евразийская премия',
  badgeHi: 'द्वितीय पुरस्कार · यूरेशियन अवार्ड्स',
  titleEn: 'Second Prize Winner — Eurasian Awards',
  titleRu: 'Лауреат II премии — Евразийская премия (Eurasian Awards)',
  titleHi: 'द्वितीय पुरस्कार विजेता — यूरेशियन अवार्ड्स',
  captionEn:
    'Honored to receive the Second Prize at the prestigious Eurasian Awards, recognizing contributions to youth cultural diplomacy, comparative heritage studies, and Russia–India friendship.',
  captionRu:
    'Почётная вторая премия на престижной Евразийской премии за вклад в молодёжную культурную дипломатию, изучение общего наследия и укрепление российско-индийской дружбы.',
  captionHi:
    'प्रतिष्ठित यूरेशियन अवार्ड्स में युवा सांस्कृतिक कूटनीति, साझा विरासत अध्ययन और भारत-रूस मैत्री को सुदृढ़ करने में योगदान के लिए द्वितीय पुरस्कार प्राप्त करने का गौरव।',
  date: '2025',
};

const DEFAULT_ITEMS: AchievementItem[] = [
  {
    id: 'ach-cert-1',
    type: 'certificate',
    titleEn: 'Eurasian Awards — Second Prize Certificate',
    titleRu: 'Диплом II степени — Евразийская премия',
    titleHi: 'यूरेशियन अवार्ड्स — द्वितीय पुरस्कार प्रमाणपत्र',
    captionEn:
      'Official certificate awarded for securing Second Prize in international youth cultural diplomacy and intercultural research.',
    captionRu:
      'Официальный диплом лауреата II премии за достижения в сфере международной молодёжной культурной дипломатии.',
    captionHi:
      'अंतरराष्ट्रीय युवा सांस्कृतिक कूटनीति एवं अंतर-सांस्कृतिक शोध में द्वितीय पुरस्कार प्राप्त करने का आधिकारिक प्रमाणपत्र।',
    issuer: 'Eurasian Awards Committee',
    date: '2025',
    mediaUrl: '/cultural_images/novgorod_kremlin.jpg',
  },
  {
    id: 'ach-photo-1',
    type: 'photo',
    titleEn: 'Russia–India Cultural Dialogue Presentation',
    titleRu: 'Презентация российско-индийского культурного диалога',
    titleHi: 'भारत-रूस सांस्कृतिक संवाद प्रस्तुति',
    captionEn:
      'Representing bilateral heritage initiatives, comparative linguistics, and student collaboration between India and Russia.',
    captionRu:
      'Представление двусторонних проектов в области культурного наследия, языкознания и студенческого сотрудничества России и Индии.',
    captionHi:
      'भारत और रूस के बीच द्विपक्षीय विरासत पहल, तुलनात्मक भाषा विज्ञान और छात्र सहयोग का प्रतिनिधित्व।',
    issuer: 'International Youth Forum',
    date: '2025',
    mediaUrl: '/cultural_images/russian_hospitality.jpg',
  },
  {
    id: 'ach-video-1',
    type: 'video',
    titleEn: 'Eurasian Awards — Award Ceremony & Highlight Reel',
    titleRu: 'Церемония награждения Евразийской премии',
    titleHi: 'यूरेशियन अवार्ड्स — सम्मान समारोह वीडियो',
    captionEn:
      'Recorded moment from the Eurasian Awards ceremony celebrating Second Prize recognition.',
    captionRu:
      'Памятные кадры церемонии вручения Второй премии на Евразийской премии.',
    captionHi:
      'यूरेशियन अवार्ड्स सम्मान समारोह में द्वितीय पुरस्कार प्राप्त करने के अविस्मरणीय क्षण।',
    issuer: 'Eurasian Awards',
    date: '2025',
    mediaUrl: 'https://youtu.be/Dt3C7TK_fac?si=CEJ6x0kTzMcGA0Tu',
    thumbnailUrl: '/cultural_images/smolensk_fortress.jpg',
  },
];

interface AchievementsViewProps {
  currentLang: Language;
  isAdmin?: boolean;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  currentLang,
  isAdmin = false,
}) => {
  const [frameLang, setFrameLang] = useState<Language>(currentLang);
  const [filterType, setFilterType] = useState<'all' | AchievementItemType>('all');

  useEffect(() => {
    setFrameLang(currentLang);
  }, [currentLang]);

  const [featured, setFeatured] = useState<FeaturedAchievement>(() => {
    try {
      const saved = localStorage.getItem('sri_featured_achievement');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.videoUrl) return { ...DEFAULT_FEATURED, ...parsed };
      }
    } catch {}
    return DEFAULT_FEATURED;
  });

  const [items, setItems] = useState<AchievementItem[]>(() => {
    try {
      const saved = localStorage.getItem('sri_achievements_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ITEMS;
  });

  const saveFeatured = (next: FeaturedAchievement) => {
    setFeatured(next);
    try {
      localStorage.setItem('sri_featured_achievement', JSON.stringify(next));
    } catch {}
  };

  const saveItems = (next: AchievementItem[]) => {
    setItems(next);
    try {
      localStorage.setItem('sri_achievements_list', JSON.stringify(next));
    } catch {}
  };

  // Edit Featured Modal
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  const [featForm, setFeatForm] = useState<FeaturedAchievement>(featured);

  // Add/Edit Item Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<Omit<AchievementItem, 'id'>>({
    type: 'certificate',
    titleEn: '',
    titleRu: '',
    titleHi: '',
    captionEn: '',
    captionRu: '',
    captionHi: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    mediaUrl: '',
    thumbnailUrl: '',
  });

  // Lightbox / Preview Modal
  const [activePreviewItem, setActivePreviewItem] = useState<AchievementItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const pick = (en?: string, ru?: string, hi?: string, langOverride?: Language) => {
    const lang = langOverride || currentLang;
    if (lang === 'ru') return ru || en || '';
    if (lang === 'hi') return hi || en || '';
    return en || '';
  };

  const renderVideoPlayer = (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
      return (
        <video
          src={trimmed}
          controls
          className="w-full h-full object-contain bg-black"
        />
      );
    }

    const driveEmbed = getDriveVideoEmbedUrl(trimmed);
    const embedUrl = driveEmbed || formatVideoEmbedUrl(trimmed);

    return (
      <iframe
        src={embedUrl}
        title="Achievement Video Player"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  };

  const openAddItemModal = () => {
    setEditingItemId(null);
    setItemForm({
      type: 'certificate',
      titleEn: '',
      titleRu: '',
      titleHi: '',
      captionEn: '',
      captionRu: '',
      captionHi: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      mediaUrl: '',
      thumbnailUrl: '',
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: AchievementItem) => {
    setEditingItemId(item.id);
    setItemForm({
      type: item.type,
      titleEn: item.titleEn,
      titleRu: item.titleRu,
      titleHi: item.titleHi,
      captionEn: item.captionEn,
      captionRu: item.captionRu,
      captionHi: item.captionHi,
      issuer: item.issuer || '',
      date: item.date,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || '',
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.titleEn.trim()) return;

    const cleanMedia =
      itemForm.type === 'video'
        ? itemForm.mediaUrl.trim()
        : normalizeMediaUrl(itemForm.mediaUrl.trim()) || '/cultural_images/novgorod_kremlin.jpg';

    const cleanThumb =
      normalizeMediaUrl(itemForm.thumbnailUrl?.trim() || '') ||
      '/cultural_images/smolensk_fortress.jpg';

    const payload: AchievementItem = {
      id: editingItemId || `ach-${Date.now()}`,
      type: itemForm.type,
      titleEn: itemForm.titleEn.trim(),
      titleRu: itemForm.titleRu.trim() || itemForm.titleEn.trim(),
      titleHi: itemForm.titleHi.trim() || itemForm.titleEn.trim(),
      captionEn: itemForm.captionEn.trim(),
      captionRu: itemForm.captionRu.trim() || itemForm.captionEn.trim(),
      captionHi: itemForm.captionHi.trim() || itemForm.captionEn.trim(),
      issuer: itemForm.issuer?.trim() || '',
      date: itemForm.date.trim() || '2025',
      mediaUrl: cleanMedia,
      thumbnailUrl: itemForm.type === 'video' ? cleanThumb : undefined,
    };

    if (editingItemId) {
      saveItems(items.map((it) => (it.id === editingItemId ? payload : it)));
    } else {
      saveItems([payload, ...items]);
    }
    setIsItemModalOpen(false);
  };

  const filteredItems = items.filter((it) => filterType === 'all' || it.type === filterType);

  const headings = {
    eyebrow:
      currentLang === 'ru'
        ? 'Награды · Дипломы · Культурная дипломатия'
        : currentLang === 'hi'
        ? 'पुरस्कार · प्रमाणपत्र · सांस्कृतिक कूटनीति'
        : 'Honors · Certificates · Cultural Diplomacy',
    title:
      currentLang === 'ru'
        ? 'Достижения и награды'
        : currentLang === 'hi'
        ? 'उपलब्धियाँ एवं सम्मान'
        : 'Achievements & Honors',
    subtitle:
      currentLang === 'ru'
        ? 'Видеохроника международных наград, дипломы и фотогалерея достижений.'
        : currentLang === 'hi'
        ? 'अंतरराष्ट्रीय पुरस्कारों का वीडियो संग्रह, प्रमाणपत्र और उपलब्धियों की फोटो दीर्घा।'
        : 'Featured award video showcase alongside uploaded certificates, achievement photographs, and milestone videos.',
    galleryTitle:
      currentLang === 'ru'
        ? 'Сертификаты, фотографии и видео достижений'
        : currentLang === 'hi'
        ? 'प्रमाणपत्र, फोटो और उपलब्धियों के वीडियो'
        : 'Certificates, Achievement Photos & Videos',
  };

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="text-xs font-bold tracking-[0.18em] text-amber-700 uppercase">
          <Trophy className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-amber-600" />
          {headings.eyebrow}
        </div>
        <h1 className="font-cinzel text-2xl sm:text-5xl font-extrabold text-slate-900 tracking-wide">
          {headings.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 font-serif-culture leading-relaxed">
          {headings.subtitle}
        </p>
      </div>

      {/* SECTION 1: Editable Featured Achievement Video Frame with Title Frame & Short Caption */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#0c1424] to-[#070d18] p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4 text-amber-400" />
            <span>{pick(featured.badgeEn, featured.badgeRu, featured.badgeHi, frameLang)}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{featured.date}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Trilingual Switcher for Featured Frame */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
              {(['en', 'ru', 'hi'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setFrameLang(lng)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                    frameLang === lng
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lng === 'en' ? 'EN' : lng === 'ru' ? 'RU' : 'HI'}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setFeatForm(featured);
                  setIsEditingFeatured(true);
                }}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold shadow cursor-pointer"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Edit Frame</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Frame */}
          <div className="lg:col-span-7 aspect-video w-full overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-xl">
            {renderVideoPlayer(featured.videoUrl)}
          </div>

          {/* Title Frame & Short Caption */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-amber-500/25 bg-slate-900/70 p-5 sm:p-6 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                {frameLang === 'ru'
                  ? 'Заголовок и описание достижения'
                  : frameLang === 'hi'
                  ? 'उपलब्धि शीर्षक एवं संक्षिप्त विवरण'
                  : 'Achievement Title & Caption'}
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-snug">
                {pick(featured.titleEn, featured.titleRu, featured.titleHi, frameLang)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
                {pick(featured.captionEn, featured.captionRu, featured.captionHi, frameLang)}
              </p>
            </div>

            {/* Secondary language preview strip */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5 text-[11px] text-slate-400">
              <div className="truncate">
                <strong className="text-amber-300">EN:</strong> {featured.titleEn}
              </div>
              <div className="truncate">
                <strong className="text-amber-300">RU:</strong> {featured.titleRu}
              </div>
              <div className="truncate font-devanagari">
                <strong className="text-amber-300">HI:</strong> {featured.titleHi}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Uploadable Certificates, Achievement Photos & Videos */}
      <div className="rounded-3xl border border-amber-500/20 bg-[#0b1322] p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-white">
              {headings.galleryTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentLang === 'ru'
                ? 'Нажмите на карточку, чтобы открыть диплом, фотографию или видео в полном размере.'
                : currentLang === 'hi'
                ? 'प्रमाणपत्र, फोटो या वीडियो को बड़े आकार में देखने के लिए किसी भी कार्ड पर क्लिक करें।'
                : 'Click any certificate, photo, or video card to view in full detail.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
              {(
                [
                  { id: 'all', en: 'All', ru: 'Все', hi: 'सभी' },
                  { id: 'certificate', en: 'Certificates', ru: 'Дипломы', hi: 'प्रमाणपत्र' },
                  { id: 'photo', en: 'Photos', ru: 'Фото', hi: 'फोटो' },
                  { id: 'video', en: 'Videos', ru: 'Видео', hi: 'वीडियो' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                    filterType === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {pick(tab.en, tab.ru, tab.hi)}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={openAddItemModal}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold shadow cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Upload Certificate / Photo / Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No items in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const title = pick(item.titleEn, item.titleRu, item.titleHi);
              const caption = pick(item.captionEn, item.captionRu, item.captionHi);
              const previewImg =
                item.type === 'video'
                  ? item.thumbnailUrl || '/cultural_images/smolensk_fortress.jpg'
                  : normalizeMediaUrl(item.mediaUrl) || '/cultural_images/novgorod_kremlin.jpg';

              return (
                <div
                  key={item.id}
                  onClick={() => setActivePreviewItem(item)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75 hover:border-amber-400/60 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <img
                      src={previewImg}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/cultural_images/novgorod_kremlin.jpg';
                      }}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/90 text-slate-950 shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    )}

                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/75 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                      {item.type === 'certificate' ? (
                        <FileBadge2 className="h-3 w-3" />
                      ) : item.type === 'photo' ? (
                        <ImageIcon className="h-3 w-3" />
                      ) : (
                        <Film className="h-3 w-3" />
                      )}
                      {item.type}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-amber-400/90">
                      <span className="truncate">{item.issuer || 'Achievement'}</span>
                      <span className="inline-flex items-center gap-1 shrink-0 text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed flex-1">
                      {caption}
                    </p>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{item.type === 'video' ? 'Watch' : 'View Full'}</span>
                      </span>

                      {isAdmin && (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-1.5 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                            title="Edit"
                          >
                            <PenTool className="h-3.5 w-3.5" />
                          </button>

                          {confirmDeleteId === item.id ? (
                            <button
                              onClick={() => {
                                saveItems(items.filter((x) => x.id !== item.id));
                                setConfirmDeleteId(null);
                              }}
                              className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white cursor-pointer"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/50 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Edit Featured Achievement Video Frame */}
      {isAdmin && isEditingFeatured && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-500/40 bg-[#0c1424] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white">
                Edit Featured Achievement Video & Caption
              </h3>
              <button
                onClick={() => setIsEditingFeatured(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveFeatured(featForm);
                setIsEditingFeatured(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">
                  Video URL (YouTube, Google Drive, or MP4) or Upload Video
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    required
                    value={featForm.videoUrl}
                    onChange={(e) => setFeatForm({ ...featForm, videoUrl: e.target.value })}
                    className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 font-semibold text-amber-300 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await readFileAsDataUrl(file);
                          setFeatForm({ ...featForm, videoUrl: dataUrl });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Badge (EN)</label>
                  <input
                    type="text"
                    value={featForm.badgeEn}
                    onChange={(e) => setFeatForm({ ...featForm, badgeEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Badge (RU)</label>
                  <input
                    type="text"
                    value={featForm.badgeRu}
                    onChange={(e) => setFeatForm({ ...featForm, badgeRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Badge (HI)</label>
                  <input
                    type="text"
                    value={featForm.badgeHi}
                    onChange={(e) => setFeatForm({ ...featForm, badgeHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white font-devanagari"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Year / Date</label>
                  <input
                    type="text"
                    value={featForm.date}
                    onChange={(e) => setFeatForm({ ...featForm, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Title (English) *</label>
                  <input
                    required
                    type="text"
                    value={featForm.titleEn}
                    onChange={(e) => setFeatForm({ ...featForm, titleEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (Russian)</label>
                  <input
                    type="text"
                    value={featForm.titleRu}
                    onChange={(e) => setFeatForm({ ...featForm, titleRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={featForm.titleHi}
                    onChange={(e) => setFeatForm({ ...featForm, titleHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Short Caption (EN) *</label>
                  <textarea
                    required
                    rows={3}
                    value={featForm.captionEn}
                    onChange={(e) => setFeatForm({ ...featForm, captionEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Short Caption (RU)</label>
                  <textarea
                    rows={3}
                    value={featForm.captionRu}
                    onChange={(e) => setFeatForm({ ...featForm, captionRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Short Caption (HI)</label>
                  <textarea
                    rows={3}
                    value={featForm.captionHi}
                    onChange={(e) => setFeatForm({ ...featForm, captionHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingFeatured(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 font-bold text-slate-950 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Featured Frame
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Certificate, Photo, or Video */}
      {isAdmin && isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-500/40 bg-[#0c1424] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white">
                {editingItemId
                  ? 'Edit Achievement Item'
                  : 'Upload Certificate, Photo, or Video'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={itemForm.type}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, type: e.target.value as AchievementItemType })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="photo">Achievement Photo</option>
                    <option value="video">Achievement Video</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Issuer / Event</label>
                  <input
                    type="text"
                    value={itemForm.issuer || ''}
                    onChange={(e) => setItemForm({ ...itemForm, issuer: e.target.value })}
                    placeholder="e.g. Eurasian Awards"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date / Year</label>
                  <input
                    type="text"
                    value={itemForm.date}
                    onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Title (English) *</label>
                  <input
                    required
                    type="text"
                    value={itemForm.titleEn}
                    onChange={(e) => setItemForm({ ...itemForm, titleEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (Russian)</label>
                  <input
                    type="text"
                    value={itemForm.titleRu}
                    onChange={(e) => setItemForm({ ...itemForm, titleRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={itemForm.titleHi}
                    onChange={(e) => setItemForm({ ...itemForm, titleHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Caption (English)</label>
                  <textarea
                    rows={2}
                    value={itemForm.captionEn}
                    onChange={(e) => setItemForm({ ...itemForm, captionEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Caption (Russian)</label>
                  <textarea
                    rows={2}
                    value={itemForm.captionRu}
                    onChange={(e) => setItemForm({ ...itemForm, captionRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Caption (Hindi)</label>
                  <textarea
                    rows={2}
                    value={itemForm.captionHi}
                    onChange={(e) => setItemForm({ ...itemForm, captionHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/80 p-3.5">
                <label className="block font-semibold">
                  {itemForm.type === 'video'
                    ? 'Video URL (YouTube / Google Drive / MP4) or Upload Video'
                    : 'Certificate / Photo URL, Google Drive Link, or Upload from Device'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={itemForm.mediaUrl}
                    onChange={(e) => setItemForm({ ...itemForm, mediaUrl: e.target.value })}
                    placeholder={
                      itemForm.type === 'video'
                        ? 'https://youtu.be/... or Google Drive link'
                        : 'https://... or Google Drive share link'
                    }
                    className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-2 font-semibold text-amber-300 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept={itemForm.type === 'video' ? 'video/*' : 'image/*'}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await readFileAsDataUrl(file);
                          setItemForm({ ...itemForm, mediaUrl: dataUrl });
                        }
                      }}
                    />
                  </label>
                </div>

                {itemForm.type === 'video' && (
                  <div className="pt-2">
                    <label className="block text-slate-400 mb-1">Optional Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={itemForm.thumbnailUrl || ''}
                      onChange={(e) => setItemForm({ ...itemForm, thumbnailUrl: e.target.value })}
                      placeholder="/cultural_images/smolensk_fortress.jpg"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 font-bold text-slate-950 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingItemId ? 'Save Changes' : 'Add to Achievements'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {activePreviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1424] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {activePreviewItem.type} · {activePreviewItem.date}
              </span>
              <button
                onClick={() => setActivePreviewItem(null)}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {activePreviewItem.type === 'video' ? (
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
                  {renderVideoPlayer(activePreviewItem.mediaUrl)}
                </div>
              ) : (
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center max-h-[60vh]">
                  <img
                    src={
                      normalizeMediaUrl(activePreviewItem.mediaUrl) ||
                      '/cultural_images/novgorod_kremlin.jpg'
                    }
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/cultural_images/novgorod_kremlin.jpg';
                    }}
                    alt={pick(
                      activePreviewItem.titleEn,
                      activePreviewItem.titleRu,
                      activePreviewItem.titleHi
                    )}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {pick(
                    activePreviewItem.titleEn,
                    activePreviewItem.titleRu,
                    activePreviewItem.titleHi
                  )}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {pick(
                    activePreviewItem.captionEn,
                    activePreviewItem.captionRu,
                    activePreviewItem.captionHi
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
