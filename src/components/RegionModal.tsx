import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Film,
  Landmark,
  CheckCircle2,
  Edit3,
  Upload,
  Star,
  Lightbulb,
  Award,
  Trash2,
  Plus,
} from 'lucide-react';
import { Region, Language } from '../types';
import { translations } from '../i18n/translations';
import { readFileAsDataUrl, normalizeMediaUrl } from '../utils/imageUpload';

interface RegionModalProps {
  region: Region | null;
  currentLang: Language;
  onClose: () => void;
  onPlayVideo: (region: Region) => void;
  isAdmin?: boolean;
  onUpdateRegion?: (updated: Region) => void;
  onDeleteRegion?: (regionId: string) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  currentLang,
  onClose,
  onPlayVideo,
  isAdmin = false,
  onUpdateRegion,
  onDeleteRegion,
}) => {
  if (!region) return null;
  const t = translations[currentLang];

  const [viewLang, setViewLang] = useState<Language>(currentLang);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formData, setFormData] = useState<Region>({ ...region });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    setViewLang(currentLang);
  }, [currentLang]);

  useEffect(() => {
    setFormData({ ...region });
    setIsEditing(false);
    setConfirmDelete(false);
    setNewGalleryUrl('');
  }, [region]);

  const fallbackImg =
    region.country === 'Russia'
      ? '/cultural_images/novgorod_kremlin.jpg'
      : '/cultural_images/indian_gaon.jpg';

  const handlePhotoUpload = async (file: File, isGallery = false) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (isGallery) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), dataUrl],
        }));
      } else {
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      }
    } catch (err) {
      console.error('Failed to read image file', err);
    }
  };

  const handleAddGalleryUrl = () => {
    const cleaned = normalizeMediaUrl(newGalleryUrl.trim());
    if (!cleaned) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), cleaned],
    }));
    setNewGalleryUrl('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateRegion) {
      onUpdateRegion({
        ...formData,
        image: normalizeMediaUrl(formData.image) || fallbackImg,
        videoUrl: formData.videoUrl?.trim() || '',
      });
    }
    setIsEditing(false);
  };

  const pick = (en?: string, ru?: string, hi?: string) => {
    if (viewLang === 'ru') return ru || en || '';
    if (viewLang === 'hi') return hi || en || '';
    return en || '';
  };

  const pickList = (en?: string[], ru?: string[], hi?: string[]) => {
    if (viewLang === 'ru') return ru && ru.length > 0 ? ru : en || [];
    if (viewLang === 'hi') return hi && hi.length > 0 ? hi : en || [];
    return en || [];
  };

  const regionName = pick(region.name, region.nameRu, region.nameHi);
  const capitalName = pick(region.capital, region.capitalRu, region.capitalHi);
  const subtitle = pick(region.subtitle, region.subtitleRu, region.subtitleHi);
  const shortDesc = pick(region.shortDescription, region.shortDescriptionRu, region.shortDescriptionHi);
  const heritageInfo = pick(region.heritageInfo, region.heritageInfoRu, region.heritageInfoHi);
  const archInfo = pick(region.archaeologicalInfo, region.archaeologicalInfoRu, region.archaeologicalInfoHi);
  const historicalPlaces = pickList(region.historicalPlaces, region.historicalPlacesRu, region.historicalPlacesHi);
  const specificFeatures = pickList(region.specificFeatures, region.specificFeaturesRu, region.specificFeaturesHi);
  const funFacts = pickList(region.funFacts, region.funFactsRu, region.funFactsHi);
  const traditions = pickList(region.traditions, region.traditionsRu, region.traditionsHi);

  const allPhotos = [
    normalizeMediaUrl(region.image) || fallbackImg,
    ...(region.galleryImages || []).map((g) => normalizeMediaUrl(g)).filter(Boolean),
  ];

  const labels = {
    heritageSites:
      viewLang === 'ru'
        ? 'Важные объекты наследия и памятники'
        : viewLang === 'hi'
        ? 'प्रमुख विरासत स्थल एवं स्मारक'
        : 'Important Heritage Sites & Monuments',
    features:
      viewLang === 'ru'
        ? 'Уникальные особенности региона'
        : viewLang === 'hi'
        ? 'क्षेत्र की विशिष्ट विशेषताएँ'
        : 'Specific Regional Features',
    facts:
      viewLang === 'ru'
        ? 'Интересные факты'
        : viewLang === 'hi'
        ? 'रोचक तथ्य'
        : 'Notable Facts',
    gallery:
      viewLang === 'ru'
        ? 'Фотогалерея региона'
        : viewLang === 'hi'
        ? 'क्षेत्रीय फोटो दीर्घा'
        : 'Regional Photo Gallery',
    unesco:
      viewLang === 'ru'
        ? 'Объекты Всемирного наследия ЮНЕСКО'
        : viewLang === 'hi'
        ? 'यूनेस्को विश्व धरोहर स्थल'
        : 'UNESCO World Heritage Sites',
    capital:
      viewLang === 'ru' ? 'Столица' : viewLang === 'hi' ? 'राजधानी' : 'Capital',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1424] shadow-2xl">
        {/* Top Action Controls */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-[#0c1424]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800/80">
          {/* Language Switcher inside Dossier */}
          {!isEditing ? (
            <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/90 p-1">
              {(['en', 'ru', 'hi'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setViewLang(lng)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    viewLang === lng
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lng === 'en' ? 'English' : lng === 'ru' ? 'Русский' : 'हिन्दी'}
                </button>
              ))}
            </div>
          ) : (
            <span className="font-cinzel text-sm font-bold text-amber-300 flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Admin Region Editor
            </span>
          )}

          <div className="flex items-center gap-2">
            {isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="whitespace-nowrap shrink-0 flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs shadow transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Region</span>
              </button>
            )}
            {isAdmin && onDeleteRegion && !isEditing && (
              confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onDeleteRegion(region.id);
                      onClose();
                    }}
                    className="whitespace-nowrap shrink-0 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1.5 text-xs cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="whitespace-nowrap shrink-0 rounded-lg bg-slate-800 text-slate-300 px-2 py-1.5 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors cursor-pointer"
                  title="Delete Region"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Comprehensive Admin Region Edit Form */
          <div className="p-5 sm:p-6 text-xs text-slate-200">
            <form onSubmit={handleSave} className="space-y-5">
              {/* Names (EN/RU/HI) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Russian)</label>
                  <input
                    type="text"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={formData.nameHi}
                    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Country, Type, Zone, Coordinates */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value as 'Russia' | 'India' })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  >
                    <option value="Russia">Russia</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Region Type</label>
                  <input
                    type="text"
                    value={formData.regionType || ''}
                    onChange={(e) => setFormData({ ...formData, regionType: e.target.value })}
                    placeholder="Oblast / Republic / State"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">District / Zone</label>
                  <input
                    type="text"
                    value={formData.federalDistrictOrZone || ''}
                    onChange={(e) => setFormData({ ...formData, federalDistrictOrZone: e.target.value })}
                    placeholder="Central / South"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat ?? ''}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng ?? ''}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              {/* Capital (EN/RU/HI) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capital (EN)</label>
                  <input
                    type="text"
                    value={formData.capital || ''}
                    onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capital (RU)</label>
                  <input
                    type="text"
                    value={formData.capitalRu || ''}
                    onChange={(e) => setFormData({ ...formData, capitalRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capital (HI)</label>
                  <input
                    type="text"
                    value={formData.capitalHi || ''}
                    onChange={(e) => setFormData({ ...formData, capitalHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle (EN)</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle (RU)</label>
                  <input
                    type="text"
                    value={formData.subtitleRu || ''}
                    onChange={(e) => setFormData({ ...formData, subtitleRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle (HI)</label>
                  <input
                    type="text"
                    value={formData.subtitleHi || ''}
                    onChange={(e) => setFormData({ ...formData, subtitleHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overview (EN) *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overview (RU)</label>
                  <textarea
                    rows={3}
                    value={formData.shortDescriptionRu || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescriptionRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overview (HI)</label>
                  <textarea
                    rows={3}
                    value={formData.shortDescriptionHi || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescriptionHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Heritage Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Info (EN) *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.heritageInfo}
                    onChange={(e) => setFormData({ ...formData, heritageInfo: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Info (RU)</label>
                  <textarea
                    rows={3}
                    value={formData.heritageInfoRu || ''}
                    onChange={(e) => setFormData({ ...formData, heritageInfoRu: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Info (HI)</label>
                  <textarea
                    rows={3}
                    value={formData.heritageInfoHi || ''}
                    onChange={(e) => setFormData({ ...formData, heritageInfoHi: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Historical Places (one per line) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Sites (EN, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.historicalPlaces || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        historicalPlaces: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Sites (RU, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.historicalPlacesRu || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        historicalPlacesRu: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heritage Sites (HI, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.historicalPlacesHi || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        historicalPlacesHi: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Specific Features (one per line) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specific Features (EN, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.specificFeatures || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificFeatures: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specific Features (RU, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.specificFeaturesRu || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificFeaturesRu: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specific Features (HI, 1 per line)</label>
                  <textarea
                    rows={3}
                    value={(formData.specificFeaturesHi || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificFeaturesHi: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Fun Facts (one per line) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notable Facts (EN, 1 per line)</label>
                  <textarea
                    rows={2}
                    value={(formData.funFacts || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funFacts: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notable Facts (RU, 1 per line)</label>
                  <textarea
                    rows={2}
                    value={(formData.funFactsRu || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funFactsRu: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notable Facts (HI, 1 per line)</label>
                  <textarea
                    rows={2}
                    value={(formData.funFactsHi || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funFactsHi: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Video & Primary Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video URL (YouTube / Google Drive / MP4)</label>
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video Title</label>
                  <input
                    type="text"
                    value={formData.videoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Cover Photo & Gallery */}
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">Primary Photo (URL, Google Drive, or Device Upload)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {formData.image && (
                    <img
                      src={normalizeMediaUrl(formData.image) || fallbackImg}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                      alt="Preview"
                      className="w-24 h-20 rounded-lg object-cover border border-amber-500/40 shrink-0"
                    />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL or Google Drive share link"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Cover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, false);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Additional Gallery Photos */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-semibold">Additional Gallery Photos</label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Paste photo URL or Google Drive link..."
                      className="flex-1 min-w-[180px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-amber-300 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add URL
                    </button>
                    <label className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-amber-300 cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, true);
                        }}
                      />
                    </label>
                  </div>
                  {formData.galleryImages && formData.galleryImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.galleryImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative h-14 w-20 rounded-lg overflow-hidden border border-slate-700">
                          <img
                            src={normalizeMediaUrl(imgUrl)}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImg;
                            }}
                            alt={`Gallery ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                galleryImages: (prev.galleryImages || []).filter((_, i) => i !== idx),
                              }))
                            }
                            className="absolute top-0.5 right-0.5 rounded bg-black/80 p-0.5 text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-6 py-2 font-bold text-slate-950 shadow-lg cursor-pointer"
                >
                  Save Region Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Museum / Editorial Trilingual Dossier View */
          <>
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={normalizeMediaUrl(region.image) || fallbackImg}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = fallbackImg;
                }}
                alt={regionName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-[#0c1424]/45 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-300 mb-1">
                  {region.country === 'Russia' ? 'Russian Federation' : 'Republic of India'}
                  {region.regionType ? ` · ${region.regionType}` : ''}
                  {region.federalDistrictOrZone ? ` · ${region.federalDistrictOrZone}` : ''}
                  {capitalName ? ` · ${labels.capital}: ${capitalName}` : ''}
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                  {regionName}
                </h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-amber-200/90 font-serif-culture">
                  <span>{region.name}</span>
                  <span>·</span>
                  <span>{region.nameRu}</span>
                  <span>·</span>
                  <span className="font-devanagari">{region.nameHi}</span>
                </div>
                {subtitle && (
                  <p className="mt-1 text-xs text-slate-300 italic max-w-2xl">“{subtitle}”</p>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Overview */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-sm leading-relaxed text-slate-200">{shortDesc}</p>
              </div>

              {/* Heritage & Architecture */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-cinzel text-base font-bold">
                  <Landmark className="h-5 w-5" />
                  <span>{labels.heritageSites}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{heritageInfo}</p>
              </div>

              {/* UNESCO Sites */}
              {region.unescoSites && region.unescoSites.length > 0 && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>{labels.unesco}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.unescoSites.map((site, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Places Grid */}
              {historicalPlaces.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.heritage.placesLabel}</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {historicalPlaces.map((place, idx) => (
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
              )}

              {/* Specific Features & Notable Facts */}
              {(specificFeatures.length > 0 || funFacts.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specificFeatures.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        <span>{labels.features}</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {specificFeatures.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {funFacts.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                        <span>{labels.facts}</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {funFacts.map((fact, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Archaeological Info */}
              {archInfo && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{t.heritage.archaeologyBadge}</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200">{archInfo}</p>
                </div>
              )}

              {/* Traditions */}
              {traditions.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {t.heritage.traditionsLabel}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {traditions.map((tradition, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-amber-500/20 bg-slate-900 px-3 py-1 text-xs text-amber-200 font-medium"
                      >
                        ✦ {tradition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {allPhotos.length > 1 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {labels.gallery}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {allPhotos.map((src, i) => (
                      <div key={i} className="aspect-video overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                        <img
                          src={src}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImg;
                          }}
                          alt={`${regionName} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Player Action */}
              {region.videoUrl && (
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 block">
                      {region.videoTitle || `${regionName} Heritage Documentary`}
                    </span>
                    {viewLang === 'ru'
                      ? 'Смотреть документальный видеоматериал о регионе'
                      : viewLang === 'hi'
                      ? 'क्षेत्रीय विरासत वृत्तचित्र देखें'
                      : 'Watch regional heritage & cultural documentary'}
                  </div>
                  <button
                    onClick={() => onPlayVideo(region)}
                    className="whitespace-nowrap shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer"
                  >
                    <Film className="h-4 w-4" />
                    <span>{t.heritage.watchHeritageVideo}</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
