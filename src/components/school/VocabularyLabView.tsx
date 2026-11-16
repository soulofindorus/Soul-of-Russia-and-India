import React, { useMemo, useState } from 'react';
import {
  BookmarkCheck,
  BookmarkPlus,
  Gamepad2,
  Layers,
  RotateCw,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Language } from '../../types';
import { LessonVocabularyItem, SrsVocabRecord, StudentProgressRecord } from '../../types/school';
import { speakRussian } from '../../utils/russianSpeech';
import { VocabularyQuiz } from '../VocabularyQuiz';
import { SchoolThemeTokens } from './schoolTheme';

interface VocabularyLabViewProps {
  theme: SchoolThemeTokens;
  currentLang: Language;
  vocabBank: LessonVocabularyItem[];
  progress: StudentProgressRecord;
  onToggleSaveVocab: (wordId: string) => void;
  onUpdateSrsRecord: (record: SrsVocabRecord) => void;
}

type VocabSubMode = 'explorer' | 'flashcards' | 'quiz';

export const VocabularyLabView: React.FC<VocabularyLabViewProps> = ({
  theme,
  currentLang,
  vocabBank,
  progress,
  onToggleSaveVocab,
  onUpdateSrsRecord,
}) => {
  const [mode, setMode] = useState<VocabSubMode>('explorer');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // SM-2 Flashcard state
  const [cardIdx, setCardIdx] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [deckMode, setDeckMode] = useState<'all' | 'saved'>('all');

  const filteredVocab = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vocabBank.filter((v) => {
      const matchLvl = levelFilter === 'all' || v.levelId === levelFilter;
      const matchSaved = !onlySaved || progress.savedVocabIds.includes(v.id);
      const matchSearch =
        !q ||
        v.word.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q) ||
        v.translit.toLowerCase().includes(q) ||
        v.topic.toLowerCase().includes(q);
      return matchLvl && matchSaved && matchSearch;
    });
  }, [vocabBank, levelFilter, onlySaved, searchQuery, progress.savedVocabIds]);

  const srsDeck = useMemo(() => {
    const base =
      deckMode === 'saved' && progress.savedVocabIds.length > 0
        ? vocabBank.filter((v) => progress.savedVocabIds.includes(v.id))
        : vocabBank;
    const now = Date.now();
    return [...base].sort((a, b) => {
      const recA = progress.srsRecords?.[a.id];
      const recB = progress.srsRecords?.[b.id];
      const dueA = recA ? new Date(recA.nextReviewIso).getTime() : 0;
      const dueB = recB ? new Date(recB.nextReviewIso).getTime() : 0;
      const isDueA = dueA <= now ? 0 : 1;
      const isDueB = dueB <= now ? 0 : 1;
      return isDueA - isDueB || dueA - dueB;
    });
  }, [vocabBank, deckMode, progress.savedVocabIds, progress.srsRecords]);

  const currentCard = srsDeck[cardIdx % Math.max(1, srsDeck.length)];

  const handleRateSm2 = (quality: 1 | 3 | 4 | 5) => {
    if (!currentCard) return;
    const prev = progress.srsRecords?.[currentCard.id] || {
      wordId: currentCard.id,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewIso: new Date().toISOString(),
      lastQuality: 3,
    };

    let repetitions = prev.repetitions;
    let intervalDays = prev.intervalDays;
    let easeFactor = prev.easeFactor;

    if (quality < 3) {
      repetitions = 0;
      intervalDays = 1;
    } else {
      if (repetitions === 0) intervalDays = 1;
      else if (repetitions === 1) intervalDays = 6;
      else intervalDays = Math.round(intervalDays * easeFactor);
      repetitions += 1;
    }

    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);

    onUpdateSrsRecord({
      wordId: currentCard.id,
      easeFactor: Number(easeFactor.toFixed(2)),
      intervalDays,
      repetitions,
      nextReviewIso: nextDate.toISOString(),
      lastQuality: quality,
    });

    setRevealed(false);
    setCardIdx((i) => (i + 1) % Math.max(1, srsDeck.length));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Lexical Bank & Spaced Repetition · Словарь
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Russian Vocabulary Lab & Quiz Arena
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${theme.text}`}>
              Search stress-marked vocabulary with IPA, Hindi & English glosses, practice with SM-2
              spaced-repetition flashcards, or launch the trilingual quiz challenge.
            </p>
          </div>

          <div className={`text-xs font-semibold tabular-nums rounded-xl border px-4 py-2.5 ${theme.subCardBg}`}>
            <div>Total Words: <span className={theme.heading}>{vocabBank.length}</span></div>
            <div>Saved Deck: <span className={theme.accentText}>{progress.savedVocabIds.length} cards</span></div>
          </div>
        </div>

        {/* Sub-mode tabs */}
        <div className="flex flex-wrap gap-2 border-t pt-4 border-inherit">
          <button
            type="button"
            onClick={() => setMode('explorer')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold cursor-pointer ${
              mode === 'explorer' ? theme.primaryBtn : theme.secondaryBtn
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Vocabulary Explorer ({vocabBank.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('flashcards');
              setRevealed(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold cursor-pointer ${
              mode === 'flashcards' ? theme.primaryBtn : theme.secondaryBtn
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>SM-2 Flashcard Trainer</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold cursor-pointer ${
              mode === 'quiz' ? theme.primaryBtn : theme.secondaryBtn
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Russian–Hindi–English Quiz Game</span>
          </button>
        </div>
      </div>

      {/* MODE 1: VOCABULARY EXPLORER */}
      {mode === 'explorer' && (
        <div className="space-y-4">
          <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${theme.cardBg}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'pre-a1', 'a1', 'a2', 'b1', 'b2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                    levelFilter === lvl ? theme.primaryBtn : theme.secondaryBtn
                  }`}
                >
                  {lvl === 'all' ? 'All' : lvl}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOnlySaved((s) => !s)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  onlySaved ? theme.accentBgSoft : theme.secondaryBtn
                }`}
              >
                Saved Only ({progress.savedVocabIds.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Cyrillic or English..."
                className={`w-full rounded-xl border pl-9 pr-3 py-1.5 text-xs sm:text-sm ${theme.inputCls}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((v) => {
              const saved = progress.savedVocabIds.includes(v.id);
              return (
                <div key={v.id} className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 ${theme.cardBg}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-bold uppercase ${theme.accentText}`}>
                          {v.levelId} · {v.topic}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <h3 className={`font-cyrillic text-xl font-bold ${theme.heading}`}>
                            {v.stressed}
                          </h3>
                          <button
                            type="button"
                            onClick={() => speakRussian(v.word)}
                            className={`rounded-md border p-1 cursor-pointer ${theme.secondaryBtn}`}
                            aria-label={`Pronounce ${v.word}`}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className={`text-[11px] font-mono ${theme.muted}`}>
                          {v.translit} · {v.pronunciation} · {v.partOfSpeech}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSaveVocab(v.id)}
                        className={`rounded-lg border p-1.5 cursor-pointer ${
                          saved ? theme.accentBgSoft : theme.secondaryBtn
                        }`}
                        title={saved ? 'Remove from saved deck' : 'Save to deck'}
                      >
                        {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <div className={`font-bold ${theme.heading}`}>{v.english}</div>
                      <div className={`font-devanagari ${theme.text}`}>{v.hindi}</div>
                    </div>
                  </div>

                  <div className={`border-t pt-2.5 text-xs space-y-0.5 ${theme.border}`}>
                    <button
                      type="button"
                      onClick={() => speakRussian(v.exampleRu)}
                      className={`text-left font-cyrillic font-medium hover:underline cursor-pointer ${theme.heading}`}
                    >
                      {v.exampleRu}
                    </button>
                    <div className={theme.muted}>{v.exampleEn}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SM-2 FLASHCARDS */}
      {mode === 'flashcards' && (
        <div className={`rounded-2xl border p-6 sm:p-8 max-w-2xl mx-auto space-y-6 ${theme.cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeckMode('all');
                  setCardIdx(0);
                  setRevealed(false);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  deckMode === 'all' ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                Full Deck ({vocabBank.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeckMode('saved');
                  setCardIdx(0);
                  setRevealed(false);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  deckMode === 'saved' ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                My Saved Deck ({progress.savedVocabIds.length})
              </button>
            </div>
            <span className={`text-xs font-semibold tabular-nums ${theme.muted}`}>
              Card {(cardIdx % Math.max(1, srsDeck.length)) + 1} / {srsDeck.length}
            </span>
          </div>

          {currentCard ? (
            <div className={`rounded-2xl border p-6 sm:p-8 text-center space-y-5 ${theme.subCardBg}`}>
              <div className="space-y-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                  {currentCard.levelId} · {currentCard.partOfSpeech}
                </span>
                <div className={`font-cyrillic text-3xl sm:text-4xl font-bold ${theme.heading}`}>
                  {currentCard.stressed}
                </div>
                <div className={`text-xs font-mono ${theme.muted}`}>
                  {currentCard.translit} · {currentCard.pronunciation}
                </div>
                <button
                  type="button"
                  onClick={() => speakRussian(currentCard.word, { rate: 0.85 })}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Listen</span>
                </button>
              </div>

              {!revealed ? (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  <RotateCw className="h-4 w-4" />
                  <span>Reveal Meaning & Examples</span>
                </button>
              ) : (
                <div className={`space-y-4 border-t pt-5 border-inherit animate-in fade-in`}>
                  <div className="space-y-1">
                    <div className={`text-lg font-bold ${theme.heading}`}>{currentCard.english}</div>
                    <div className={`font-devanagari text-base ${theme.text}`}>{currentCard.hindi}</div>
                  </div>
                  <div className={`rounded-xl border p-3 text-xs space-y-1 ${theme.cardBg}`}>
                    <div className={`font-cyrillic font-semibold ${theme.heading}`}>{currentCard.exampleRu}</div>
                    <div className={theme.muted}>{currentCard.exampleEn}</div>
                  </div>

                  <div className="space-y-2">
                    <div className={`text-[11px] font-semibold uppercase tracking-wider ${theme.muted}`}>
                      Rate Recall Quality (Updates SM-2 Next Interval)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRateSm2(1)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 cursor-pointer"
                      >
                        Again (1d)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateSm2(3)}
                        className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-500/20 cursor-pointer"
                      >
                        Hard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateSm2(4)}
                        className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500/20 cursor-pointer"
                      >
                        Good
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateSm2(5)}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        Easy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* MODE 3: EMBEDDED VOCABULARY QUIZ GAME */}
      {mode === 'quiz' && (
        <div className="w-full">
          <VocabularyQuiz currentLang={currentLang} />
        </div>
      )}
    </div>
  );
};
