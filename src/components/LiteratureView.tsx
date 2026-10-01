import React, { useState } from 'react';
import { Author, Language } from '../types';
import { authorsData } from '../data/literatureData';
import { translations } from '../i18n/translations';
import { BookOpen, Quote, Sparkles, Feather, Calendar, Clock, Bookmark, X } from 'lucide-react';

interface LiteratureViewProps {
  currentLang: Language;
}

export const LiteratureView: React.FC<LiteratureViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(authorsData[0]);
  const [detailModalAuthor, setDetailModalAuthor] = useState<Author | null>(null);

  const eras = ['All', 'Classical Literature', 'Soviet Literature', 'Poetry'];

  const filteredAuthors = authorsData.filter((a) => {
    if (selectedEra === 'All') return true;
    return a.era === selectedEra;
  });

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16 w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
          <Feather className="h-3.5 w-3.5" />
          <span>Poetry • Philosophy • Moral Awakening</span>
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-wide break-words">
          {t.literature.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-serif-culture">
          {t.literature.subtitle}
        </p>
      </div>

      {/* Literary Journey Timeline Visual Header */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-[#0c1424] via-[#101b33] to-[#0c1424] p-4 sm:p-8 shadow-xl w-full">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="font-cinzel text-lg font-bold text-amber-300 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{t.literature.timelineTitle} (1799 – 2008)</span>
          </h2>
          <span className="text-xs text-slate-400">Click author below to view dossier</span>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative flex items-center justify-between overflow-x-auto pb-4 gap-4 scrollbar-thin">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/10 via-amber-400/40 to-amber-500/10 -translate-y-1/2 z-0" />
          {authorsData.map((author) => {
            const isSelected = selectedAuthor?.id === author.id;
            return (
              <button
                key={author.id}
                onClick={() => setSelectedAuthor(author)}
                className={`group relative z-10 flex shrink-0 flex-col items-center gap-2 text-center transition-transform hover:scale-105 focus:outline-none ${
                  isSelected ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 overflow-hidden bg-slate-900 shadow-md ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-700'
                  }`}
                >
                  <img
                    src={author.portrait}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="max-w-[100px]">
                  <span className="font-cinzel block text-[11px] font-bold text-white truncate group-hover:text-amber-300">
                    {author.name.split(' ').pop()}
                  </span>
                  <span className="block text-[9px] text-amber-400/80">{author.years}</span>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-300">
                    {selectedAuthor.era}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedAuthor.years}
                  </span>
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
    </section>
  );
};
