import React, { useState } from 'react';
import { X, MapPin, Compass, Sparkles, BookOpen, Film, Landmark, Trees, CheckCircle2, Edit3, Upload } from 'lucide-react';
import { Region, Language } from '../types';
import { translations } from '../i18n/translations';
import { readFileAsDataUrl } from '../utils/imageUpload';

interface RegionModalProps {
  region: Region | null;
  currentLang: Language;
  onClose: () => void;
  onPlayVideo: (region: Region) => void;
  isAdmin?: boolean;
  onUpdateRegion?: (updated: Region) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  currentLang,
  onClose,
  onPlayVideo,
  isAdmin = false,
  onUpdateRegion,
}) => {
  if (!region) return null;
  const t = translations[currentLang];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Region>({ ...region });

  // Keep formData synced if region changes
  React.useEffect(() => {
    setFormData({ ...region });
    setIsEditing(false);
  }, [region]);

  const handlePhotoUpload = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      console.error('Failed to read image file', err);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateRegion) {
      onUpdateRegion(formData);
    }
    setIsEditing(false);
  };

  const regionName =
    currentLang === 'ru' ? region.nameRu : currentLang === 'hi' ? region.nameHi : region.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1424] shadow-2xl">
        {/* Admin Edit Button & Close Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs shadow-lg backdrop-blur-md transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Region & Photo</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-slate-300 backdrop-blur-md hover:bg-black hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isEditing ? (
          /* Admin Region Edit Form */
          <div className="p-6 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" />
                <span>Edit Regional Heritage & Photos (Admin)</span>
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Russian)</label>
                  <input
                    type="text"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={formData.nameHi}
                    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value as 'Russia' | 'India' })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="Russia">🇷🇺 Russia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Climate / Geo Note</label>
                  <input
                    type="text"
                    value={formData.climateOrGeo || ''}
                    onChange={(e) => setFormData({ ...formData, climateOrGeo: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cultural Short Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Heritage & Historical Architecture *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.heritageInfo}
                  onChange={(e) => setFormData({ ...formData, heritageInfo: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Archaeological Excavations & Antiquity</label>
                <textarea
                  rows={2}
                  value={formData.archaeologicalInfo || ''}
                  onChange={(e) => setFormData({ ...formData, archaeologicalInfo: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video Documentary URL</label>
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video Title</label>
                  <input
                    type="text"
                    value={formData.videoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                    placeholder="e.g. Heritage of Vladimir & Suzdal"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Photo Editing & Upload */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">Region Photo (URL or Upload from Device)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {formData.image && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 shadow">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL (https://...)"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">JPG, PNG, WebP supported</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                >
                  Save Region Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-amber-500 hover:to-amber-400 transition-all focus:outline-none cursor-pointer"
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
