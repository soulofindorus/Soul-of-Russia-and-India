import React, { useState } from 'react';
import { GrammarLesson, GrammarExercise, Language } from '../types';
import { russianGrammarLessons, hindiLanguageGuides } from '../data/languageData';
import { translations } from '../i18n/translations';
import { BookOpen, CheckCircle, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LanguageViewProps {
  currentLang: Language;
}

export const LanguageView: React.FC<LanguageViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeLanguageTab, setActiveLanguageTab] = useState<'russian' | 'hindi'>('russian');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLessonId, setActiveLessonId] = useState<string>(russianGrammarLessons[0].id);

  // Exercise state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Cases',
    'Verbs',
    'Adjectives',
    'Gender',
    'Aspect',
    'Prepositions',
    'Pronouns',
    'Adverbs',
    'Sentence structure',
  ];

  const filteredLessons = russianGrammarLessons.filter((lesson) => {
    if (selectedCategory === 'All') return true;
    return lesson.category === selectedCategory;
  });

  const currentLesson =
    russianGrammarLessons.find((l) => l.id === activeLessonId) || russianGrammarLessons[0];

  const handleSelectOption = (exerciseId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: option }));
  };

  const handleSubmitExercise = (exercise: GrammarExercise) => {
    const chosen = selectedAnswers[exercise.id];
    if (!chosen) return;

    setSubmittedExercises((prev) => ({ ...prev, [exercise.id]: true }));

    if (chosen === exercise.correctAnswer) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleResetLesson = () => {
    setSelectedAnswers({});
    setSubmittedExercises({});
  };

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Interactive Cultural Linguistics</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-wide">
          {t.language.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif-culture">
          {t.language.subtitle}
        </p>
      </div>

      {/* Language Choice Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-amber-500/30 bg-slate-900/90 p-1.5 shadow-xl">
          <button
            onClick={() => setActiveLanguageTab('russian')}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
              activeLanguageTab === 'russian'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🇷🇺</span>
            <span>{t.language.russianTab}</span>
          </button>
          <button
            onClick={() => setActiveLanguageTab('hindi')}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
              activeLanguageTab === 'hindi'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🇮🇳</span>
            <span>{t.language.hindiTab}</span>
          </button>
        </div>
      </div>

      {/* RUSSIAN LANGUAGE PLATFORM */}
      {activeLanguageTab === 'russian' && (
        <div className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Lessons List */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Available Grammar Lessons</span>
              </h3>
              <div className="space-y-2">
                {filteredLessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        handleResetLesson();
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        isActive
                          ? 'border-amber-400 bg-amber-500/15 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          {lesson.category}
                        </span>
                        <span className="text-[10px] text-slate-500">{lesson.level}</span>
                      </div>
                      <h4 className="font-cinzel mt-2 text-sm font-bold text-slate-100 line-clamp-2">
                        {currentLang === 'ru' ? lesson.titleRu : currentLang === 'hi' ? lesson.titleHi : lesson.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {lesson.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Lesson Workspace */}
            <div className="lg:col-span-8 space-y-8 rounded-2xl border border-amber-500/20 bg-[#0c1424] p-6 sm:p-8 shadow-2xl">
              {/* Lesson Title Header */}
              <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <span>Category: {currentLesson.category}</span>
                    <span>•</span>
                    <span>Level: {currentLesson.level}</span>
                  </div>
                  <h2 className="font-cinzel text-2xl font-bold text-white sm:text-3xl">
                    {currentLang === 'ru' ? currentLesson.titleRu : currentLang === 'hi' ? currentLesson.titleHi : currentLesson.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 font-serif-culture">
                    {currentLesson.description}
                  </p>
                </div>
                <button
                  onClick={handleResetLesson}
                  className="self-start flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.language.resetLesson}</span>
                </button>
              </div>

              {/* Grammar Rules Section */}
              <div className="space-y-4">
                <h3 className="font-cinzel text-base font-bold text-amber-300 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-400" />
                  <span>Grammar Rules & Formulations</span>
                </h3>
                <div className="space-y-3">
                  {currentLesson.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-slate-100">{rule.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{rule.explanation}</p>
                      <div className="mt-2 space-y-1 rounded-lg bg-black/40 p-2.5 font-mono text-xs text-amber-200/90">
                        {rule.examples.map((ex, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">▶</span>
                            <span>{ex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Practice Exercises */}
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span>{t.language.exercisesTitle}</span>
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">
                    {currentLesson.exercises.length} Exercises in this module
                  </span>
                </div>

                <div className="space-y-6">
                  {currentLesson.exercises.map((ex, index) => {
                    const chosen = selectedAnswers[ex.id];
                    const isSubmitted = submittedExercises[ex.id];
                    const isCorrect = chosen === ex.correctAnswer;

                    return (
                      <div
                        key={ex.id}
                        className={`rounded-xl border p-5 transition-all ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-emerald-500/50 bg-emerald-950/20'
                              : 'border-red-500/50 bg-red-950/20'
                            : 'border-slate-800 bg-slate-900/40'
                        }`}
                      >
                        {/* Question Prompt */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Exercise #{index + 1}
                          </span>
                          {ex.type === 'emoji-grammar' && (
                            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300 font-semibold">
                              Emoji Grammar
                            </span>
                          )}
                        </div>

                        <p className="font-serif-culture text-xl sm:text-2xl font-bold text-white mb-4">
                          {ex.question}
                        </p>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                          {ex.options.map((option) => {
                            const isChosen = chosen === option;
                            let btnStyle = 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-amber-400';

                            if (isSubmitted) {
                              if (option === ex.correctAnswer) {
                                btnStyle = 'border-emerald-500 bg-emerald-700 text-white font-bold';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'border-red-500 bg-red-800/80 text-white line-through';
                              } else {
                                btnStyle = 'border-slate-800 bg-slate-900 text-slate-500 opacity-60';
                              }
                            } else if (isChosen) {
                              btnStyle = 'border-amber-400 bg-amber-500/25 text-amber-200 font-bold ring-1 ring-amber-400';
                            }

                            return (
                              <button
                                key={option}
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(ex.id, option)}
                                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-all text-left ${btnStyle}`}
                              >
                                <span>{option}</span>
                                {isSubmitted && option === ex.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 text-emerald-300 shrink-0" />
                                )}
                                {isSubmitted && isChosen && !isCorrect && (
                                  <XCircle className="h-4 w-4 text-red-300 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Submit Action or Feedback */}
                        {!isSubmitted ? (
                          <button
                            onClick={() => handleSubmitExercise(ex)}
                            disabled={!chosen}
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                              chosen
                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {t.language.checkAnswer}
                          </button>
                        ) : (
                          <div className="mt-3 rounded-lg border border-slate-800 bg-black/40 p-3 space-y-1.5 animate-in fade-in">
                            <div className="flex items-center gap-2 text-xs font-bold">
                              {isCorrect ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" /> {t.language.correctFeedback}
                                </span>
                              ) : (
                                <span className="text-red-400 flex items-center gap-1">
                                  <XCircle className="h-4 w-4" /> {t.language.incorrectFeedback}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {currentLang === 'ru' && ex.explanationRu
                                ? ex.explanationRu
                                : currentLang === 'hi' && ex.explanationHi
                                ? ex.explanationHi
                                : ex.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HINDI LANGUAGE & SHARED COGNATES PLATFORM */}
      {activeLanguageTab === 'hindi' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hindiLanguageGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-2xl border border-amber-500/25 bg-[#0c1424] p-6 sm:p-8 shadow-xl space-y-4"
              >
                <div className="flex items-center gap-2 text-amber-400 font-cinzel text-lg font-bold">
                  <Sparkles className="h-5 w-5" />
                  <h3>{currentLang === 'hi' ? guide.titleHi : currentLang === 'ru' ? guide.titleRu : guide.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
                  {guide.description}
                </p>

                {guide.keyPoints && (
                  <div className="space-y-2 pt-2">
                    {guide.keyPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                      >
                        <span className="font-devanagari text-base font-bold text-amber-300">
                          {pt.letter}
                        </span>
                        <span className="text-slate-400">{pt.sound}</span>
                        <span className="text-slate-300 italic">{pt.meaning}</span>
                      </div>
                    ))}
                  </div>
                )}

                {guide.comparisons && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-3 text-[11px] font-bold text-amber-400/90 border-b border-slate-800 pb-1 uppercase tracking-wider">
                      <span>Russian</span>
                      <span>Hindi / Sanskrit</span>
                      <span>English</span>
                    </div>
                    {guide.comparisons.map((c, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 rounded-md bg-slate-900/50 p-2 text-xs border border-slate-800/60 hover:border-amber-500/30 transition-colors"
                      >
                        <span className="font-bold text-blue-300">{c.russian}</span>
                        <span className="font-devanagari font-bold text-orange-300">{c.hindi}</span>
                        <span className="text-slate-400">{c.english}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
