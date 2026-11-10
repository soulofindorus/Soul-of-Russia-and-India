import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import {
  culturalQuizQuestions,
  initialLeaderboardEntries,
  LeaderboardEntry,
  QuizDomain,
  CulturalQuizQuestion,
} from '../data/culturalQuizData';
import {
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Landmark,
  Languages,
  Globe2,
  Compass,
  Medal,
  Send,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playErrorTone } from '../utils/quizAudio';

interface CulturalQuizModuleProps {
  currentLang: Language;
  onScoreEarned?: (points: number) => void;
}

const LEADERBOARD_STORAGE_KEY = 'sri_cultural_quiz_leaderboard';

interface ShuffledQuizQuestion {
  question: CulturalQuizQuestion;
  optionOrder: number[];
}

function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestions(list: CulturalQuizQuestion[], limit?: number): ShuffledQuizQuestion[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const sliced = limit ? copy.slice(0, limit) : copy;
  return sliced.map((question) => ({
    question,
    optionOrder: shuffleIndices(question.options.en.length),
  }));
}

export const CulturalQuizModule: React.FC<CulturalQuizModuleProps> = ({
  currentLang,
  onScoreEarned,
}) => {
  const [viewMode, setViewMode] = useState<'arena' | 'leaderboard'>('arena');
  const [selectedDomain, setSelectedDomain] = useState<QuizDomain | 'all'>('all');
  const [leaderboardFilter, setLeaderboardFilter] = useState<QuizDomain | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sri_quiz_sound_enabled');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  // Quiz session state
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<ShuffledQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Leaderboard submission state
  const [playerName, setPlayerName] = useState('');
  const [affiliation, setAffiliation] = useState<'India' | 'Russia' | 'International'>('India');
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse error
    }
    return initialLeaderboardEntries;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
    } catch {
      // ignore quota error
    }
  }, [leaderboard]);

  const copy = {
    en: {
      title: 'Grand Cultural Quiz: Russia & India',
      subtitle:
        'Test your mastery of shared history, linguistic roots, and geography across Russia and India. Build streaks and claim your place on the leaderboard.',
      arenaTab: 'Quiz Arena',
      leaderboardTab: 'Leaderboard',
      chooseDomain: 'Choose Your Challenge Track',
      allDomains: 'All Domains (10 Questions)',
      history: 'History',
      language: 'Language',
      geography: 'Geography',
      startQuiz: 'Start Cultural Quiz',
      questionOf: 'Question',
      of: 'of',
      scoreLabel: 'Quiz Score',
      streakLabel: 'Streak',
      nextQuestion: 'Next Question',
      viewResults: 'View Final Results',
      quizComplete: 'Challenge Complete!',
      accuracy: 'Accuracy',
      bestStreak: 'Best Streak',
      totalPoints: 'Total Points',
      saveToLeaderboard: 'Submit Score to Leaderboard',
      yourName: 'Your Name',
      namePlaceholder: 'Enter your name...',
      affiliationLabel: 'Affiliation',
      submitScore: 'Save to Leaderboard',
      scoreSaved: 'Score recorded on the Cultural Leaderboard!',
      viewLeaderboard: 'View Leaderboard',
      playAgain: 'Play Again',
      rank: 'Rank',
      player: 'Scholar',
      domain: 'Track',
      accuracyCol: 'Accuracy',
      streakCol: 'Streak',
      pointsCol: 'Points',
      youBadge: 'You',
      clearMyScores: 'Clear My Entries',
      noEntries: 'No entries in this category yet. Complete a quiz to set the first record!',
      streakBonusHint: '+5 streak bonus per consecutive correct answer',
    },
    ru: {
      title: 'Большая культурная викторина: Россия и Индия',
      subtitle:
        'Проверьте знания общей истории, языкового родства и географии России и Индии. Набирайте серии правильных ответов и займите место в таблице лидеров.',
      arenaTab: 'Викторина',
      leaderboardTab: 'Таблица лидеров',
      chooseDomain: 'Выберите направление',
      allDomains: 'Все темы (10 вопросов)',
      history: 'История',
      language: 'Языки',
      geography: 'География',
      startQuiz: 'Начать викторину',
      questionOf: 'Вопрос',
      of: 'из',
      scoreLabel: 'Счёт',
      streakLabel: 'Серия',
      nextQuestion: 'Следующий вопрос',
      viewResults: 'Показать результаты',
      quizComplete: 'Испытание завершено!',
      accuracy: 'Точность',
      bestStreak: 'Лучшая серия',
      totalPoints: 'Итого баллов',
      saveToLeaderboard: 'Добавить результат в таблицу лидеров',
      yourName: 'Ваше имя',
      namePlaceholder: 'Введите имя...',
      affiliationLabel: 'Страна / регион',
      submitScore: 'Сохранить результат',
      scoreSaved: 'Ваш результат добавлен в таблицу лидеров!',
      viewLeaderboard: 'Открыть таблицу лидеров',
      playAgain: 'Сыграть ещё раз',
      rank: 'Место',
      player: 'Участник',
      domain: 'Тема',
      accuracyCol: 'Точность',
      streakCol: 'Серия',
      pointsCol: 'Баллы',
      youBadge: 'Вы',
      clearMyScores: 'Удалить мои записи',
      noEntries: 'В этой категории пока нет записей. Пройдите викторину первым!',
      streakBonusHint: '+5 бонусных баллов за серию правильных ответов',
    },
    hi: {
      title: 'महा सांस्कृतिक प्रश्नोत्तरी: रूस और भारत',
      subtitle:
        'रूस और भारत के साझा इतिहास, भाषाई जड़ों और भूगोल पर अपने ज्ञान की परीक्षा लें। लगातार सही उत्तर दें और लीडरबोर्ड पर शीर्ष स्थान प्राप्त करें।',
      arenaTab: 'प्रश्नोत्तरी',
      leaderboardTab: 'लीडरबोर्ड',
      chooseDomain: 'अपना विषय चुनें',
      allDomains: 'सभी विषय (10 प्रश्न)',
      history: 'इतिहास',
      language: 'भाषा',
      geography: 'भूगोल',
      startQuiz: 'प्रश्नोत्तरी शुरू करें',
      questionOf: 'प्रश्न',
      of: '/',
      scoreLabel: 'स्कोर',
      streakLabel: 'लगातार सही',
      nextQuestion: 'अगला प्रश्न',
      viewResults: 'अंतिम परिणाम देखें',
      quizComplete: 'प्रश्नोत्तरी पूर्ण!',
      accuracy: 'सटीकता',
      bestStreak: 'सर्वश्रेष्ठ स्ट्रीक',
      totalPoints: 'कुल अंक',
      saveToLeaderboard: 'लीडरबोर्ड में अपना स्कोर दर्ज करें',
      yourName: 'आपका नाम',
      namePlaceholder: 'अपना नाम लिखें...',
      affiliationLabel: 'संबद्धता',
      submitScore: 'लीडरबोर्ड में सहेजें',
      scoreSaved: 'आपका स्कोर सांस्कृतिक लीडरबोर्ड में दर्ज हो गया है!',
      viewLeaderboard: 'लीडरबोर्ड देखें',
      playAgain: 'फिर से खेलें',
      rank: 'रैंक',
      player: 'प्रतिभागी',
      domain: 'विषय',
      accuracyCol: 'सटीकता',
      streakCol: 'स्ट्रीक',
      pointsCol: 'अंक',
      youBadge: 'आप',
      clearMyScores: 'मेरी प्रविष्टियाँ हटाएँ',
      noEntries: 'इस श्रेणी में अभी कोई रिकॉर्ड नहीं है। पहला रिकॉर्ड बनाने के लिए क्विज़ खेलें!',
      streakBonusHint: 'लगातार सही उत्तरों पर +5 बोनस अंक',
    },
  }[currentLang];

  const domainLabels: Record<QuizDomain | 'all', string> = {
    all: currentLang === 'ru' ? 'Все темы' : currentLang === 'hi' ? 'सभी विषय' : 'All Domains',
    history: copy.history,
    language: copy.language,
    geography: copy.geography,
  };

  const handleStartQuiz = (domainOverride?: QuizDomain | 'all') => {
    const activeDom = domainOverride ?? selectedDomain;
    const pool =
      activeDom === 'all'
        ? shuffleQuestions(culturalQuizQuestions, 10)
        : shuffleQuestions(
            culturalQuizQuestions.filter((q) => q.domain === activeDom)
          );

    setQuestions(pool);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSessionScore(0);
    setCorrectCount(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setQuizCompleted(false);
    setHasSubmittedScore(false);
    setQuizStarted(true);
    setViewMode('arena');
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sri_quiz_sound_enabled', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectOption = (origIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(origIdx);

    const currentQ = questions[currentIndex].question;
    const isCorrect = origIdx === currentQ.correctIndex;

    if (isCorrect) {
      if (soundEnabled) {
        playSuccessChime();
      }
      const nextStreak = currentStreak + 1;
      const streakBonus = nextStreak >= 2 ? 5 : 0;
      const earned = currentQ.points + streakBonus;

      setSessionScore((prev) => prev + earned);
      setCorrectCount((prev) => prev + 1);
      setCurrentStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      onScoreEarned?.(earned);

      try {
        confetti({
          particleCount: 30,
          spread: 48,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore
      }
    } else {
      if (soundEnabled) {
        playErrorTone();
      }
      setCurrentStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleSubmitLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed || hasSubmittedScore) return;

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const newEntry: LeaderboardEntry = {
      id: `lb-user-${Date.now()}`,
      playerName: trimmed,
      affiliation,
      domain: selectedDomain,
      score: sessionScore,
      accuracy,
      streak: bestStreak,
      date: new Date().toISOString().split('T')[0],
      isUser: true,
    };

    setLeaderboard((prev) =>
      [...prev, newEntry].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
    );
    setHasSubmittedScore(true);
    setLastSubmittedId(newEntry.id);
    setLeaderboardFilter(selectedDomain);
  };

  const handleClearUserEntries = () => {
    setLeaderboard((prev) => prev.filter((entry) => !entry.isUser));
    setLastSubmittedId(null);
  };

  const filteredLeaderboard = useMemo(() => {
    const base =
      leaderboardFilter === 'all'
        ? leaderboard
        : leaderboard.filter((item) => item.domain === leaderboardFilter);
    return [...base].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
  }, [leaderboard, leaderboardFilter]);

  const hasUserEntries = useMemo(() => leaderboard.some((e) => e.isUser), [leaderboard]);

  const activeItem = questions[currentIndex];
  const activeQuestion = activeItem?.question;
  const accuracyPct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-amber-500/25 bg-[#0c1424] p-5 sm:p-8 lg:p-10 shadow-2xl space-y-8 w-full">
      {/* Module Header + Sound Toggle + Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-800 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            {copy.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
            {copy.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          {/* Audio Feedback Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Quiz Audio' : 'Enable Quiz Audio'}
            aria-label={soundEnabled ? 'Mute Quiz Audio' : 'Enable Quiz Audio'}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              soundEnabled
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>
              {soundEnabled
                ? currentLang === 'ru'
                  ? 'Звук вкл'
                  : currentLang === 'hi'
                  ? 'ध्वनि चालू'
                  : 'Sound On'
                : currentLang === 'ru'
                ? 'Без звука'
                : currentLang === 'hi'
                ? 'ध्वनि बंद'
                : 'Muted'}
            </span>
          </button>

          {/* Segmented Control */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('arena')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{copy.arenaTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('leaderboard')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>{copy.leaderboardTab}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: QUIZ ARENA ================= */}
      {viewMode === 'arena' && (
        <div className="space-y-6">
          {/* Setup / Start Screen */}
          {!quizStarted && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-1">
                <h4 className="font-cinzel text-lg font-bold text-amber-300">
                  {copy.chooseDomain}
                </h4>
                <p className="text-xs text-slate-400">{copy.streakBonusHint}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 'all' as const,
                    label: copy.allDomains,
                    icon: Compass,
                    meta: '10 Questions · 200+ pts',
                  },
                  {
                    id: 'history' as const,
                    label: copy.history,
                    icon: Landmark,
                    meta: '6 Questions · Russia & India',
                  },
                  {
                    id: 'language' as const,
                    label: copy.language,
                    icon: Languages,
                    meta: '6 Questions · Sanskrit & Cyrillic',
                  },
                  {
                    id: 'geography' as const,
                    label: copy.geography,
                    icon: Globe2,
                    meta: '6 Questions · Peaks, Seas & Rivers',
                  },
                ].map((track) => {
                  const Icon = track.icon;
                  const isSelected = selectedDomain === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedDomain(track.id)}
                      className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-amber-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-cinzel text-sm font-bold text-white">
                          {track.label}
                        </div>
                        <div className="text-[11px] text-slate-400">{track.meta}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => handleStartQuiz()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-extrabold text-slate-950 shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{copy.startQuiz}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Active Question Screen */}
          {quizStarted && !quizCompleted && activeQuestion && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Top Progress & Live Stats */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <span className="font-bold text-amber-300">
                      {copy.questionOf} {currentIndex + 1} {copy.of} {questions.length}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="capitalize text-slate-300">
                      {domainLabels[activeQuestion.domain]}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-slate-400">{activeQuestion.country}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Trophy className="h-3.5 w-3.5" />
                      {copy.scoreLabel}: {sessionScore}
                    </span>
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame className="h-3.5 w-3.5" />
                      {copy.streakLabel}: {currentStreak}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
                <h4 className="font-serif-culture text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {activeQuestion.question[currentLang]}
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {activeItem.optionOrder.map((origIdx) => {
                    const optionText = activeQuestion.options[currentLang][origIdx];
                    const isAnswered = selectedOption !== null;
                    const isChosen = selectedOption === origIdx;
                    const isCorrectOption = origIdx === activeQuestion.correctIndex;

                    let style =
                      'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-amber-400 hover:bg-slate-800';
                    if (isAnswered) {
                      if (isCorrectOption) {
                        style = 'border-emerald-500 bg-emerald-700/80 text-white font-bold';
                      } else if (isChosen) {
                        style = 'border-red-500 bg-red-800/80 text-white';
                      } else {
                        style = 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={origIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(origIdx)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition-all cursor-pointer disabled:cursor-default ${style}`}
                      >
                        <span className="pr-3">{optionText}</span>
                        {isAnswered && isCorrectOption && (
                          <CheckCircle className="h-4 w-4 text-emerald-200 shrink-0" />
                        )}
                        {isAnswered && isChosen && !isCorrectOption && (
                          <XCircle className="h-4 w-4 text-red-200 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Next Button */}
                {selectedOption !== null && (
                  <div className="space-y-4 pt-2">
                    <div className="rounded-xl border border-slate-700/80 bg-black/40 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeQuestion.explanation[currentLang]}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>
                          {currentIndex + 1 < questions.length
                            ? copy.nextQuestion
                            : copy.viewResults}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Complete & Leaderboard Submission */}
          {quizStarted && quizCompleted && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Medal className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-cinzel text-2xl font-bold text-white">
                  {copy.quizComplete}
                </h4>
                <p className="text-xs text-slate-400">
                  {domainLabels[selectedDomain]} · {questions.length}{' '}
                  {currentLang === 'ru' ? 'вопросов' : currentLang === 'hi' ? 'प्रश्न' : 'Questions'}
                </p>
              </div>

              {/* Score Summary Grid */}
              <div className="grid grid-cols-3 gap-3 border-y border-slate-800 py-5">
                <div>
                  <div className="text-xs text-slate-400">{copy.totalPoints}</div>
                  <div className="font-cinzel text-2xl font-extrabold text-amber-400 mt-1">
                    {sessionScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">{copy.accuracy}</div>
                  <div className="font-cinzel text-2xl font-extrabold text-emerald-400 mt-1">
                    {accuracyPct}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">{copy.bestStreak}</div>
                  <div className="font-cinzel text-2xl font-extrabold text-orange-400 mt-1">
                    {bestStreak}
                  </div>
                </div>
              </div>

              {/* Submit to Leaderboard Form */}
              {!hasSubmittedScore ? (
                <form onSubmit={handleSubmitLeaderboard} className="space-y-4 text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {copy.saveToLeaderboard}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {copy.yourName}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={32}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder={copy.namePlaceholder}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {copy.affiliationLabel}
                      </label>
                      <select
                        value={affiliation}
                        onChange={(e) =>
                          setAffiliation(e.target.value as 'India' | 'Russia' | 'International')
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="India">🇮🇳 India</option>
                        <option value="Russia">🇷🇺 Russia</option>
                        <option value="International">🌍 International</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartQuiz()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{copy.playAgain}</span>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{copy.submitScore}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-300">
                    {copy.scoreSaved}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode('leaderboard')}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Trophy className="h-3.5 w-3.5" />
                      <span>{copy.viewLeaderboard}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartQuiz()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{copy.playAgain}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: LEADERBOARD ================= */}
      {viewMode === 'leaderboard' && (
        <div className="space-y-5">
          {/* Domain Filter + Clear User Entries */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
              {(['all', 'history', 'language', 'geography'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setLeaderboardFilter(dom)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    leaderboardFilter === dom
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {domainLabels[dom]}
                </button>
              ))}
            </div>

            {hasUserEntries && (
              <button
                type="button"
                onClick={handleClearUserEntries}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-400 hover:text-red-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{copy.clearMyScores}</span>
              </button>
            )}
          </div>

          {/* Ranked Table */}
          {filteredLeaderboard.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center text-xs sm:text-sm text-slate-400">
              {copy.noEntries}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">{copy.rank}</th>
                    <th className="py-3 px-4">{copy.player}</th>
                    <th className="py-3 px-4">{copy.domain}</th>
                    <th className="py-3 px-4 text-right">{copy.accuracyCol}</th>
                    <th className="py-3 px-4 text-right">{copy.streakCol}</th>
                    <th className="py-3 px-4 text-right">{copy.pointsCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                  {filteredLeaderboard.map((entry, idx) => {
                    const rank = idx + 1;
                    const isHighlighted = entry.id === lastSubmittedId || entry.isUser;
                    const flag =
                      entry.affiliation === 'India'
                        ? '🇮🇳'
                        : entry.affiliation === 'Russia'
                        ? '🇷🇺'
                        : '🌍';

                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          isHighlighted
                            ? 'bg-amber-500/10 text-amber-100'
                            : 'text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-cinzel font-bold">
                          <span
                            className={
                              rank === 1
                                ? 'text-amber-400'
                                : rank === 2
                                ? 'text-slate-300'
                                : rank === 3
                                ? 'text-orange-400'
                                : 'text-slate-500'
                            }
                          >
                            #{rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 font-semibold">
                            <span>{flag}</span>
                            <span>{entry.playerName}</span>
                            {entry.isUser && (
                              <span className="text-[11px] font-bold text-amber-400">
                                ({copy.youBadge})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{entry.date}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-300">
                          {domainLabels[entry.domain]}
                        </td>
                        <td className="py-3.5 px-4 text-right text-emerald-400 font-semibold">
                          {entry.accuracy}%
                        </td>
                        <td className="py-3.5 px-4 text-right text-orange-400 font-semibold">
                          {entry.streak}
                        </td>
                        <td className="py-3.5 px-4 text-right font-cinzel font-extrabold text-amber-300">
                          {entry.score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
