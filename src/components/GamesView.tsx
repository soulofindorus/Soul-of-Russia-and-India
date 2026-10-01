import React, { useState } from 'react';
import { Language } from '../types';
import {
  wordMatchPairs,
  emojiGrammarItems,
  cultureObjectItems,
  regionGuessItems,
  literaryQuizItems,
} from '../data/gamesData';
import { translations } from '../i18n/translations';
import { Sparkles, Trophy, CheckCircle, XCircle, HelpCircle, RotateCcw, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamesViewProps {
  currentLang: Language;
}

export const GamesView: React.FC<GamesViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'match' | 'emoji' | 'origin' | 'region' | 'quiz'>('match');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // 1. Word Match State
  const [selectedRussianWord, setSelectedRussianWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchWrong, setMatchWrong] = useState(false);

  // 2. Emoji Grammar State
  const [emojiAnswers, setEmojiAnswers] = useState<Record<string, string>>({});
  const [emojiSubmitted, setEmojiSubmitted] = useState<Record<string, boolean>>({});

  // 3. Cultural Origin State
  const [originAnswers, setOriginAnswers] = useState<Record<string, 'Russia' | 'India'>>({});
  const [originSubmitted, setOriginSubmitted] = useState<Record<string, boolean>>({});

  // 4. Region Guess State
  const [regionAnswers, setRegionAnswers] = useState<Record<string, string>>({});
  const [regionSubmitted, setRegionSubmitted] = useState<Record<string, boolean>>({});

  // 5. Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const triggerReward = () => {
    setScore((s) => s + 10);
    setStreak((st) => st + 1);
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleRussianClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedRussianWord(id);
    setMatchWrong(false);
  };

  const handleMeaningClick = (id: string) => {
    if (!selectedRussianWord || matchedPairs.includes(id)) return;

    if (selectedRussianWord === id) {
      // Match success!
      setMatchedPairs((prev) => [...prev, id]);
      setSelectedRussianWord(null);
      triggerReward();
    } else {
      // Wrong match
      setMatchWrong(true);
      setStreak(0);
      setTimeout(() => {
        setMatchWrong(false);
        setSelectedRussianWord(null);
      }, 700);
    }
  };

  const handleEmojiSelect = (itemId: string, option: string, correct: string) => {
    setEmojiAnswers((prev) => ({ ...prev, [itemId]: option }));
    setEmojiSubmitted((prev) => ({ ...prev, [itemId]: true }));

    if (option === correct) {
      triggerReward();
    } else {
      setStreak(0);
    }
  };

  const handleOriginSelect = (itemId: string, choice: 'Russia' | 'India', actual: 'Russia' | 'India') => {
    setOriginAnswers((prev) => ({ ...prev, [itemId]: choice }));
    setOriginSubmitted((prev) => ({ ...prev, [itemId]: true }));

    if (choice === actual) {
      triggerReward();
    } else {
      setStreak(0);
    }
  };

  const handleRegionSelect = (itemId: string, choice: string, actual: string) => {
    setRegionAnswers((prev) => ({ ...prev, [itemId]: choice }));
    setRegionSubmitted((prev) => ({ ...prev, [itemId]: true }));

    if (choice === actual) {
      triggerReward();
    } else {
      setStreak(0);
    }
  };

  const handleQuizSelect = (itemId: string, choice: string, actual: string) => {
    setQuizAnswers((prev) => ({ ...prev, [itemId]: choice }));
    setQuizSubmitted((prev) => ({ ...prev, [itemId]: true }));

    if (choice === actual) {
      triggerReward();
    } else {
      setStreak(0);
    }
  };

  const handleResetAll = () => {
    setSelectedRussianWord(null);
    setMatchedPairs([]);
    setEmojiAnswers({});
    setEmojiSubmitted({});
    setOriginAnswers({});
    setOriginSubmitted({});
    setRegionAnswers({});
    setRegionSubmitted({});
    setQuizAnswers({});
    setQuizSubmitted({});
    setScore(0);
    setStreak(0);
  };

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-4 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Interactive Culture & Language Games</span>
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-wide break-words">
          {t.games.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-serif-culture">
          {t.games.subtitle}
        </p>

        {/* Live Score Counter & Streak */}
        <div className="inline-flex max-w-[95vw] flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl border border-slate-200/90 bg-white/90 px-4 sm:px-6 py-2 shadow-md">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="text-xs text-slate-500 uppercase font-semibold">Score:</span>
            <span className="font-cinzel text-lg font-bold text-amber-700">{score}</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600 animate-pulse" />
            <span className="text-xs text-slate-500 uppercase font-semibold">Streak:</span>
            <span className="font-cinzel text-lg font-bold text-orange-600">{streak}</span>
          </div>
          <button
            onClick={handleResetAll}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 border-l border-slate-300 pl-4 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'match', label: t.games.tabs.wordMatch },
          { id: 'emoji', label: t.games.tabs.emojiGrammar },
          { id: 'origin', label: t.games.tabs.russianOrIndian },
          { id: 'region', label: t.games.tabs.guessRegion },
          { id: 'quiz', label: t.games.tabs.literaryQuiz },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Word Match */}
      {activeTab === 'match' && (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Word Match: Russian ⇄ Hindi & English
            </h3>
            <p className="text-xs text-slate-400">
              Click a Russian word on the left, then click its corresponding Hindi / English meaning on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Russian Words Column */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                🇷🇺 Русский словарь (Russian Words)
              </h4>
              {wordMatchPairs.map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                const isSelected = selectedRussianWord === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={isMatched}
                    onClick={() => handleRussianClick(p.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isMatched
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 opacity-60'
                        : isSelected
                        ? matchWrong
                          ? 'border-red-500 bg-red-950/40 text-red-300 animate-shake'
                          : 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400'
                        : 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-serif-culture text-base font-bold">{p.russian}</span>
                      <span className="ml-2 text-xs text-slate-400 italic">[{p.pronunciation}]</span>
                    </div>
                    {isMatched ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-500 uppercase">{p.category}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Meanings Column */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                🇮🇳 Hindi / English Meanings
              </h4>
              {[...wordMatchPairs].reverse().map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    disabled={isMatched}
                    onClick={() => handleMeaningClick(p.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isMatched
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 opacity-60'
                        : selectedRussianWord
                        ? 'border-amber-500/40 bg-slate-900/80 hover:border-amber-400 hover:bg-amber-500/10 cursor-pointer'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 opacity-80'
                    }`}
                  >
                    <div>
                      <span className="font-devanagari text-base font-bold text-orange-300">
                        {p.hindi}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">({p.english})</span>
                    </div>
                    {isMatched && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Emoji Grammar */}
      {activeTab === 'emoji' && (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Emoji Grammar: Emotional Expressions & Adverbs
            </h3>
            <p className="text-xs text-slate-400">
              Select the correct grammatical form to express the emotion represented by the emoji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {emojiGrammarItems.map((item) => {
              const chosen = emojiAnswers[item.id];
              const isSubmitted = emojiSubmitted[item.id];
              const isCorrect = chosen === item.correct;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-6 space-y-4 transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : 'border-red-500/50 bg-red-950/20'
                      : 'border-slate-800 bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs text-slate-400 italic">{item.meaning}</span>
                  </div>

                  <p className="font-serif-culture text-2xl font-bold text-white tracking-wide">
                    {item.prompt}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {item.options.map((opt) => {
                      const isChosen = chosen === opt;
                      let btnStyle = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400';

                      if (isSubmitted) {
                        if (opt === item.correct) {
                          btnStyle = 'border-emerald-500 bg-emerald-700 text-white font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-red-500 bg-red-800 text-white line-through';
                        } else {
                          btnStyle = 'border-slate-800 bg-slate-900 text-slate-600 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => handleEmojiSelect(item.id, opt, item.correct)}
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <p className="text-xs text-slate-300 bg-black/40 rounded-lg p-3 leading-relaxed">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Russian or Indian? */}
      {activeTab === 'origin' && (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Russian or Indian? (Cultural Artifact Identifier)
            </h3>
            <p className="text-xs text-slate-400">
              Look at the cultural tradition or artifact and determine whether it originates in Russia or India!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {cultureObjectItems.map((item) => {
              const chosen = originAnswers[item.id];
              const isSubmitted = originSubmitted[item.id];
              const isCorrect = chosen === item.origin;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col overflow-hidden rounded-2xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : 'border-red-500/60 bg-red-950/20'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-white">{item.name}</h4>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2">{item.description}</p>
                    </div>

                    {!isSubmitted ? (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleOriginSelect(item.id, 'Russia', item.origin)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-950/60 py-2 text-xs font-bold text-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <span>🇷🇺 Russia</span>
                        </button>
                        <button
                          onClick={() => handleOriginSelect(item.id, 'India', item.origin)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-orange-600 bg-orange-950/60 py-2 text-xs font-bold text-orange-200 hover:bg-orange-600 hover:text-white transition-colors"
                        >
                          <span>🇮🇳 India</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-black/50 p-2.5 space-y-1 text-xs text-slate-200">
                        <div className="font-bold flex items-center gap-1">
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> Correct! Origin: {item.origin}
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" /> Origin is {item.origin}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.funFact}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Guess the Region */}
      {activeTab === 'region' && (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Guess the Region: Landscapes & Fortress Walls
            </h3>
            <p className="text-xs text-slate-400">
              Identify the geographic realm from panoramic clues and architectural hints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {regionGuessItems.map((item) => {
              const chosen = regionAnswers[item.id];
              const isSubmitted = regionSubmitted[item.id];
              const isCorrect = chosen === item.correct;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4"
                >
                  <div className="relative aspect-video w-full">
                    <img src={item.image} alt="Region clue" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-cinzel text-sm font-bold text-white">{item.question}</h4>
                    <p className="text-xs text-amber-300 italic">Clue: {item.clue}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.options.map((opt) => {
                        let btn = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400';
                        if (isSubmitted) {
                          if (opt === item.correct) btn = 'border-emerald-500 bg-emerald-700 text-white font-bold';
                          else if (opt === chosen) btn = 'border-red-500 bg-red-800 text-white';
                          else btn = 'border-slate-800 bg-slate-900 text-slate-600';
                        }
                        return (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => handleRegionSelect(item.id, opt, item.correct)}
                            className={`rounded-lg border p-2.5 text-xs text-left transition-all ${btn}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <p className="text-xs text-slate-300 bg-black/40 rounded-lg p-2.5">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Literary Quiz */}
      {activeTab === 'quiz' && (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Literary Quiz: Tolstoy, Pushkin, Dostoevsky & Tagore
            </h3>
            <p className="text-xs text-slate-400">
              Test your understanding of classical literature and intercultural correspondence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {literaryQuizItems.map((q) => {
              const chosen = quizAnswers[q.id];
              const isSubmitted = quizSubmitted[q.id];
              const isCorrect = chosen === q.correct;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
                >
                  <p className="font-serif-culture text-base font-bold text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      let btn = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400';
                      if (isSubmitted) {
                        if (opt === q.correct) btn = 'border-emerald-500 bg-emerald-700 text-white font-bold';
                        else if (opt === chosen) btn = 'border-red-500 bg-red-800 text-white';
                        else btn = 'border-slate-800 bg-slate-900 text-slate-600';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => handleQuizSelect(q.id, opt, q.correct)}
                          className={`w-full rounded-lg border p-2.5 text-xs text-left transition-all ${btn}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <p className="text-xs text-slate-300 bg-black/40 rounded-lg p-3">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
