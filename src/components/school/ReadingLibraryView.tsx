import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Printer,
  Search,
  Volume2,
  XCircle,
} from 'lucide-react';
import { BookmarkRecord, CefrLevelId, ReadingMaterial } from '../../types/school';
import { speakRussian, stripRussianStressMarks } from '../../utils/russianSpeech';
import { SchoolThemeTokens } from './schoolTheme';

interface ReadingLibraryViewProps {
  theme: SchoolThemeTokens;
  readings: ReadingMaterial[];
  bookmarks: BookmarkRecord[];
  initialLevelFilter?: CefrLevelId | 'all';
  onToggleBookmark: (item: { itemId: string; itemType: 'reading'; title: string; levelId: CefrLevelId }) => void;
}

export const ReadingLibraryView: React.FC<ReadingLibraryViewProps> = ({
  theme,
  readings,
  bookmarks,
  initialLevelFilter = 'all',
  onToggleBookmark,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>(initialLevelFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeId, setActiveId] = useState<string>(readings[0]?.id || '');
  const [showEn, setShowEn] = useState<boolean>(true);
  const [showHi, setShowHi] = useState<boolean>(true);
  const [showStress, setShowStress] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const filtered = readings.filter((r) => {
    const matchesLevel = levelFilter === 'all' || r.levelId === levelFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.titleRu.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.genre.toLowerCase().includes(q);
    return matchesLevel && matchesQuery;
  });

  const active = readings.find((r) => r.id === activeId) || filtered[0] || readings[0];
  const isBookmarked = active
    ? bookmarks.some((b) => b.itemId === active.id && b.itemType === 'reading')
    : false;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className={`no-print rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Graded Literature & Parallel Texts · Библиотека
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Russian Reading Library (A1 – C2)
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${theme.text}`}>
              Progress from everyday A1 postcards to unadapted Pushkin, Tolstoy, and Turgenev
              classics with toggleable English/Hindi parallel translations and glossaries.
            </p>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, authors..."
              className={`w-full rounded-xl border pl-9 pr-3 py-2 text-xs sm:text-sm ${theme.inputCls}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                levelFilter === lvl ? theme.primaryBtn : theme.secondaryBtn
              }`}
            >
              {lvl === 'all' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reading List */}
        <div className="no-print lg:col-span-4 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {filtered.map((item) => {
            const isSel = active?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  setAnswers({});
                  setChecked({});
                }}
                className={`w-full rounded-xl border p-4 text-left space-y-1.5 transition-colors cursor-pointer ${
                  isSel ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase">
                  <span className={isSel ? 'text-amber-300' : theme.accentText}>
                    {item.levelId} · {item.genre}
                  </span>
                  <span className={isSel ? 'text-slate-300' : theme.muted}>
                    {item.estimatedMinutes} min
                  </span>
                </div>
                <div className="font-cinzel text-sm font-bold">{item.title}</div>
                <div className={`font-cyrillic text-xs ${isSel ? 'text-slate-200' : theme.muted}`}>
                  {item.titleRu}
                </div>
                <div className={`text-[11px] ${isSel ? 'text-slate-300' : theme.muted}`}>
                  {item.author}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className={`rounded-xl border p-6 text-center text-xs ${theme.cardBg} ${theme.muted}`}>
              No readings match your current filter.
            </div>
          )}
        </div>

        {/* Active Reading Workspace */}
        {active && (
          <div className={`print-lesson-sheet lg:col-span-8 rounded-2xl border p-6 sm:p-8 space-y-6 ${theme.cardBg}`}>
            <div className="border-b pb-5 border-inherit flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
                  <span className={`rounded border px-2 py-0.5 ${theme.accentBgSoft}`}>
                    {active.levelId}
                  </span>
                  <span className={theme.muted}>{active.genre}</span>
                </div>
                <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>{active.title}</h3>
                <p className={`font-cyrillic text-base ${theme.muted}`}>{active.titleRu}</p>
                <p className={`text-xs ${theme.muted}`}>
                  {active.author} · {active.source} ({active.licenseNote})
                </p>
              </div>

              <div className="no-print flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => speakRussian(active.textRu.join(' '), { rate: 0.85 })}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onToggleBookmark({
                      itemId: active.id,
                      itemType: 'reading',
                      title: active.title,
                      levelId: active.levelId,
                    })
                  }
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                    isBookmarked ? theme.accentBgSoft : theme.secondaryBtn
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
                >
                  <Printer className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Translation Toggles */}
            <div className="no-print flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStress((s) => !s)}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  showStress ? theme.accentBgSoft : theme.secondaryBtn
                }`}
              >
                Stress Marks ({showStress ? 'Shown' : 'Hidden'})
              </button>
              <button
                type="button"
                onClick={() => setShowEn((s) => !s)}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  showEn ? theme.accentBgSoft : theme.secondaryBtn
                }`}
              >
                English ({showEn ? 'Shown' : 'Hidden'})
              </button>
              <button
                type="button"
                onClick={() => setShowHi((s) => !s)}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  showHi ? theme.accentBgSoft : theme.secondaryBtn
                }`}
              >
                Hindi ({showHi ? 'Shown' : 'Hidden'})
              </button>
            </div>

            {active.audioUrl && <audio controls src={active.audioUrl} className="w-full h-9" />}

            {/* Parallel Text Paragraphs */}
            <div className="space-y-4 max-w-[70ch]">
              {active.textRu.map((para, i) => (
                <div key={i} className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-cyrillic text-base sm:text-lg leading-relaxed ${theme.heading}`}>
                      {showStress ? para : stripRussianStressMarks(para)}
                    </p>
                    <button
                      type="button"
                      onClick={() => speakRussian(para, { rate: 0.85 })}
                      className={`no-print rounded border p-1.5 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {showEn && active.textEn[i] && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
                      {active.textEn[i]}
                    </p>
                  )}
                  {showHi && active.textHi[i] && (
                    <p className={`font-devanagari text-xs leading-relaxed ${theme.muted}`}>
                      {active.textHi[i]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Key Vocabulary & Idioms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl border p-4 space-y-2.5 ${theme.subCardBg}`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Key Vocabulary</span>
                </div>
                <div className="space-y-2">
                  {active.vocabulary.map((v) => (
                    <div key={v.word} className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <span className={`font-cyrillic font-bold ${theme.heading}`}>
                          {v.stressed}
                        </span>
                        <div className={theme.text}>{v.english}</div>
                        <div className={`font-devanagari ${theme.muted}`}>{v.hindi}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakRussian(v.word)}
                        className={`rounded border p-1 cursor-pointer ${theme.secondaryBtn}`}
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl border p-4 space-y-2.5 ${theme.subCardBg}`}>
                <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  Expressions & Grammar Notes
                </div>
                {active.expressions.map((exp) => (
                  <div key={exp.russian} className="text-xs space-y-0.5">
                    <div className={`font-cyrillic font-bold ${theme.heading}`}>{exp.russian}</div>
                    <div className={theme.text}>{exp.english}</div>
                    <div className={theme.muted}>{exp.usage}</div>
                  </div>
                ))}
                <ul className="space-y-1 pt-2 border-t border-inherit text-xs">
                  {active.grammarNotes.map((note, idx) => (
                    <li key={idx} className={theme.text}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comprehension Questions */}
            {active.comprehensionQuestions.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-inherit">
                <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
                  Reading Comprehension Check
                </h4>
                {active.comprehensionQuestions.map((cq) => {
                  const chosen = answers[cq.id] || '';
                  const done = Boolean(checked[cq.id]);
                  const ok = chosen === cq.correctAnswer;
                  return (
                    <div key={cq.id} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                      <p className={`text-sm font-bold ${theme.heading}`}>{cq.prompt}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(cq.options || []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={done}
                            onClick={() => setAnswers((p) => ({ ...p, [cq.id]: opt }))}
                            className={`rounded-lg border px-3 py-2 text-left text-xs sm:text-sm cursor-pointer ${
                              done
                                ? opt === cq.correctAnswer
                                  ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700'
                                  : chosen === opt
                                  ? 'border-red-500 bg-red-500/15 text-red-700'
                                  : theme.cardBg
                                : chosen === opt
                                ? `${theme.accentBgSoft} font-bold`
                                : theme.cardBg
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {!done ? (
                        <button
                          type="button"
                          disabled={!chosen}
                          onClick={() => setChecked((p) => ({ ...p, [cq.id]: true }))}
                          className={`rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40 ${theme.primaryBtn}`}
                        >
                          Check Answer
                        </button>
                      ) : (
                        <div className="flex items-start gap-2 text-xs">
                          {ok ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                          <span className={theme.text}>{cq.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
