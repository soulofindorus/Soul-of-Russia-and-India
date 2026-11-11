import React, { useState } from 'react';
import { Author, Language } from '../types';
import { authorsData } from '../data/literatureData';
import { translations } from '../i18n/translations';
import { BookOpen, Quote, Sparkles, Feather, Calendar, Clock, Bookmark, X, Edit3, Upload } from 'lucide-react';
import { readFileAsDataUrl } from '../utils/imageUpload';
import { savePersistentItem, loadPersistentItem } from '../utils/persistentStore';

interface LiteratureViewProps {
  currentLang: Language;
  isAdmin?: boolean;
}

export const LiteratureView: React.FC<LiteratureViewProps> = ({ currentLang, isAdmin = false }) => {
  const t = translations[currentLang];
  
  // Dynamic authors state with localStorage persistence
  const [authors, setAuthors] = useState<Author[]>(() => {
    const saved = localStorage.getItem('sri_custom_authors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved authors', e);
      }
    }
    return authorsData;
  });

  React.useEffect(() => {
    loadPersistentItem<Author[]>('sri_custom_authors').then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) {
        setAuthors(saved);
        setSelectedAuthor((prev) => (prev ? saved.find((a) => a.id === prev.id) || saved[0] : saved[0]));
      }
    });
  }, []);

  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(() => authors[0] || authorsData[0]);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const eras = ['All', 'Classical Literature', 'Soviet Literature', 'Poetry'];

  const filteredAuthors = authors.filter((a) => {
    if (selectedEra === 'All') return true;
    return a.era === selectedEra;
  });

  const handleStartEditAuthor = (author: Author) => {
    setEditingAuthor({ ...author });
  };

  const handlePortraitUpload = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setEditingAuthor((prev) => (prev ? { ...prev, portrait: dataUrl } : null));
    } catch (err) {
      console.error('Failed to read portrait file', err);
    }
  };

  const handleSaveEditAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    setAuthors((prev) => {
      const updated = prev.map((a) => (a.id === editingAuthor.id ? editingAuthor : a));
      void savePersistentItem('sri_custom_authors', updated);
      return updated;
    });

    if (selectedAuthor?.id === editingAuthor.id) {
      setSelectedAuthor(editingAuthor);
    }
    setEditingAuthor(null);
  };

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16 w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-4 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase shadow-sm">
          <Feather className="h-3.5 w-3.5 text-amber-600" />
          <span>Poetry • Philosophy • Moral Awakening</span>
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-wide break-words">
          {t.literature.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-serif-culture">
          {t.literature.subtitle}
        </p>
      </div>

      {/* Literary Journey Timeline Visual Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/85 p-4 sm:p-8 shadow-md w-full">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <h2 className="font-cinzel text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>{t.literature.timelineTitle} (1799 – 2008)</span>
          </h2>
          <span className="text-xs text-slate-500">Click author below to view dossier</span>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative flex items-center justify-between overflow-x-auto pb-4 gap-4 scrollbar-thin">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-400/60 to-amber-500/20 -translate-y-1/2 z-0" />
          {authors.map((author) => {
            const isSelected = selectedAuthor?.id === author.id;
            return (
              <button
                key={author.id}
                onClick={() => setSelectedAuthor(author)}
                className={`group relative z-10 flex shrink-0 flex-col items-center gap-2 text-center transition-transform hover:scale-105 focus:outline-none cursor-pointer ${
                  isSelected ? 'scale-110' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 overflow-hidden bg-white shadow-md ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-slate-300'
                  }`}
                >
                  <img
                    src={author.portrait}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="max-w-[100px]">
                  <span className="font-cinzel block text-[11px] font-bold text-slate-800 truncate group-hover:text-amber-700">
                    {author.name.split(' ').pop()}
                  </span>
                  <span className="block text-[9px] text-amber-700 font-semibold">{author.years}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Era */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {eras.map((era) => (
          <button
            key={era}
            onClick={() => setSelectedEra(era)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedEra === era
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Authors Spotlight & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Spotlight Active Author */}
        {selectedAuthor && (
          <div className="lg:col-span-8 rounded-3xl border border-amber-500/30 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-slate-800 pb-6">
              <img
                src={selectedAuthor.portrait}
                alt={selectedAuthor.name}
                className="h-32 w-32 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-300">
                      {selectedAuthor.era}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {selectedAuthor.years}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleStartEditAuthor(selectedAuthor)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit Author & Portrait</span>
                    </button>
                  )}
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  {currentLang === 'ru' ? selectedAuthor.nameRu : currentLang === 'hi' ? selectedAuthor.nameHi : selectedAuthor.name}
                </h2>
                <div className="text-xs text-amber-300/80 font-serif-culture">
                  {selectedAuthor.nameRu} • <span className="font-devanagari">{selectedAuthor.nameHi}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-serif-culture">
                  {selectedAuthor.biography}
                </p>
              </div>
            </div>

            {/* Selected Quotations */}
            <div className="space-y-3">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Quote className="h-4 w-4" />
                <span>{t.literature.quotes}</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedAuthor.selectedQuotations.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-1.5"
                  >
                    <p className="font-serif-culture text-sm sm:text-base italic text-amber-100">
                      {q.quote}
                    </p>
                    {q.quoteRu && (
                      <p className="text-xs text-amber-300/80 font-serif-culture">
                        {q.quoteRu}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block text-right">— {q.source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Major Works */}
            <div className="space-y-3">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{t.literature.majorWorks}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedAuthor.majorWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 block mb-0.5">{work.year}</span>
                      <h4 className="font-cinzel text-xs font-bold text-white line-clamp-1">{work.title}</h4>
                      {work.titleHi && (
                        <p className="text-xs font-semibold text-amber-300 font-devanagari mt-0.5">
                          {work.titleHi}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed mt-1 font-serif-culture">
                        {currentLang === 'hi' && work.descriptionHi ? work.descriptionHi : work.description}
                      </p>
                    </div>
                    {currentLang !== 'hi' && work.descriptionHi && (
                      <p className="text-[10px] text-amber-200/70 border-t border-slate-800/80 pt-1 font-devanagari line-clamp-2 mt-1">
                        {work.descriptionHi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Activities & Philosophical Parallels */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.literature.activities}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedAuthor.educationalActivities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">✦</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* All Authors Quick Grid */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="space-y-2">
            {filteredAuthors.map((author) => {
              const isSelected = selectedAuthor?.id === author.id;
              const worksInHindi = author.majorWorks
                .map((w) => w.titleHi || w.title)
                .join(' • ');

              return (
                <button
                  key={author.id}
                  onClick={() => setSelectedAuthor(author)}
                  className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-md ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img
                    src={author.portrait}
                    alt={author.name}
                    className="h-14 w-14 rounded-lg object-cover border border-slate-700 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <h4 className="font-cinzel text-sm font-bold text-white truncate">
                        {currentLang === 'ru' ? author.nameRu : currentLang === 'hi' ? author.nameHi : author.name}
                      </h4>
                      {currentLang !== 'hi' && author.nameHi && (
                        <span className="text-[11px] text-amber-300/80 font-devanagari shrink-0">
                          {author.nameHi}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {author.years} • {author.era}
                    </span>
                    {/* Hindi Translation of Works */}
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[11px] leading-relaxed">
                      <span className="text-amber-400/90 font-medium font-devanagari">रचनाएँ: </span>
                      <span className="text-slate-200 font-devanagari font-normal">
                        {worksInHindi}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Edit Author Modal */}
      {isAdmin && editingAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0c1424] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" />
                <span>Edit Author & Portrait (Admin)</span>
              </h3>
              <button
                onClick={() => setEditingAuthor(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAuthor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingAuthor.name}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Russian)</label>
                  <input
                    type="text"
                    value={editingAuthor.nameRu}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, nameRu: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={editingAuthor.nameHi}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, nameHi: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Era</label>
                  <select
                    value={editingAuthor.era}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, era: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="Classical Literature">Classical Literature</option>
                    <option value="Soviet Literature">Soviet Literature</option>
                    <option value="Contemporary Literature">Contemporary Literature</option>
                    <option value="Poetry">Poetry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lifespan / Years</label>
                  <input
                    type="text"
                    value={editingAuthor.years}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, years: e.target.value })}
                    placeholder="e.g. 1828–1910"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Biography *</label>
                <textarea
                  required
                  rows={4}
                  value={editingAuthor.biography}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, biography: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
                />
              </div>

              {/* Portrait Editing & Local File Upload */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">Author Portrait</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {editingAuthor.portrait && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 shadow">
                      <img src={editingAuthor.portrait} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editingAuthor.portrait}
                      onChange={(e) => setEditingAuthor({ ...editingAuthor, portrait: e.target.value })}
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
                            if (file) handlePortraitUpload(file);
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
                  onClick={() => setEditingAuthor(null)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                >
                  Save Author Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
