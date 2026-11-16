import React, { useState } from 'react';
import {
  CheckCircle2,
  Keyboard,
  Play,
  RotateCcw,
  Volume2,
  XCircle,
  BookOpen,
  Headphones,
  Sparkles,
} from 'lucide-react';
import {
  A0_ALPHABET_QUIZ,
  A0_PHONOLOGY_UNITS,
  A0_TYPING_DRILLS,
  RUSSIAN_ALPHABET_33,
  RUSSIAN_KEYBOARD_ROWS,
} from '../../data/school/alphabetData';
import { hasRussianVoice, isSpeechSynthesisSupported, speakRussian } from '../../utils/russianSpeech';
import { SchoolThemeTokens } from './schoolTheme';

interface AlphabetAcademyViewProps {
  theme: SchoolThemeTokens;
  a0Mastered: boolean;
  onCompleteAlphabetCheck: (score: number, total: number) => void;
  onOpenLesson: (lessonId: string) => void;
}

type AcademySubTab = 'chart' | 'units' | 'typing' | 'quiz';

export const AlphabetAcademyView: React.FC<AlphabetAcademyViewProps> = ({
  theme,
  a0Mastered,
  onCompleteAlphabetCheck,
  onOpenLesson,
}) => {
  const [subTab, setSubTab] = useState<AcademySubTab>('chart');
  const [selectedLetterId, setSelectedLetterId] = useState<string>(RUSSIAN_ALPHABET_33[0].id);
  const [typeFilter, setTypeFilter] = useState<'all' | 'vowel' | 'consonant' | 'sign'>('all');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [listeningChoice, setListeningChoice] = useState<string>('');
  const [listeningChecked, setListeningChecked] = useState<boolean>(false);

  // Typing trainer state
  const [drillIdx, setDrillIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [drillsCompleted, setDrillsCompleted] = useState<number>(0);

  // Alphabet recognition quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Phonology unit accordion
  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number>(0);

  const speechReady = isSpeechSynthesisSupported();
  const ruVoiceAvailable = hasRussianVoice();

  const selectedLetter =
    RUSSIAN_ALPHABET_33.find((l) => l.id === selectedLetterId) || RUSSIAN_ALPHABET_33[0];

  const filteredLetters = RUSSIAN_ALPHABET_33.filter(
    (l) => typeFilter === 'all' || l.type === typeFilter
  );

  const handleSelectLetter = (letterId: string) => {
    setSelectedLetterId(letterId);
    setListeningChoice('');
    setListeningChecked(false);
    const letter = RUSSIAN_ALPHABET_33.find((l) => l.id === letterId);
    if (letter && letter.exampleWords[0]) {
      speakRussian(letter.exampleWords[0].word, { rate: speechRate });
    }
  };

  const currentDrill = A0_TYPING_DRILLS[drillIdx] || A0_TYPING_DRILLS[0];
  const isDrillMatch = typedInput.trim().toLowerCase() === currentDrill.target.toLowerCase();

  const handleVirtualKey = (charRu: string) => {
    setTypedInput((prev) => prev + charRu);
  };

  const handleNextDrill = () => {
    if (isDrillMatch) {
      setDrillsCompleted((c) => c + 1);
    }
    setTypedInput('');
    setDrillIdx((idx) => (idx + 1) % A0_TYPING_DRILLS.length);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const correct = A0_ALPHABET_QUIZ.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    onCompleteAlphabetCheck(correct, A0_ALPHABET_QUIZ.length);
  };

  const quizScore = A0_ALPHABET_QUIZ.filter((q) => quizAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="space-y-6">
      {/* Header & Voice Note */}
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${theme.accentBgSoft}`}>
                Level 0 · A0 Pre-A1
              </span>
              {a0Mastered && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  A0 Checkpoint Passed
                </span>
              )}
            </div>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
              Cyrillic Alphabet & Pronunciation Academy (33 Letters)
            </h2>
            <p className={`text-xs sm:text-sm ${theme.text}`}>
              Click any Cyrillic letter below to inspect its IPA, English approximation, honest phonetic
              limitations, Hindi sound guide, handwriting notes, and stress-marked word examples.
            </p>
          </div>

          {/* Speech Speed Control */}
          <div className={`rounded-xl border p-3 shrink-0 space-y-1.5 ${theme.subCardBg}`}>
            <div className="flex items-center justify-between gap-3 text-xs font-semibold">
              <span className={theme.muted}>Speech Speed</span>
              <span className={`tabular-nums ${theme.heading}`}>{speechRate}x</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0.7, 0.85, 1.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-semibold tabular-nums cursor-pointer ${
                    speechRate === rate ? theme.primaryBtn : theme.secondaryBtn
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
            <div className={`text-[11px] ${theme.muted}`}>
              {speechReady
                ? ruVoiceAvailable
                  ? 'Browser ru-RU speech active'
                  : 'Browser Web Speech ready'
                : 'Audio synthesis unavailable in this browser'}
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className={`flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${theme.border}`}>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'chart' as const, label: '33-Letter Interactive Chart' },
              { id: 'units' as const, label: 'Units 1, 3–6 Phonology Theory' },
              { id: 'typing' as const, label: 'ЙЦУКЕН Keyboard Trainer' },
              { id: 'quiz' as const, label: 'Alphabet Mastery Quiz' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSubTab(item.id)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  subTab === item.id ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenLesson('lesson-a0-1')}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Open Lesson 0.1–0.3</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE 33-LETTER CHART + DETAIL PANEL */}
      {subTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 33-letter Grid */}
          <div className={`lg:col-span-6 rounded-2xl border p-5 space-y-4 ${theme.cardBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.heading}`}>
                Click a Cyrillic Letter
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'vowel', 'consonant', 'sign'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold capitalize cursor-pointer ${
                      typeFilter === t ? theme.accentBgSoft : theme.secondaryBtn
                    }`}
                  >
                    {t === 'all' ? 'All (33)' : `${t}s`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {filteredLetters.map((item) => {
                const active = item.id === selectedLetter.id;
                const badgeColor =
                  item.type === 'vowel'
                    ? 'text-rose-500'
                    : item.type === 'sign'
                    ? 'text-amber-500'
                    : 'text-sky-500';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLetter(item.id)}
                    className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                      active
                        ? `${theme.primaryBtn} ring-2 ring-amber-400/60`
                        : `${theme.subCardBg} hover:border-amber-500/60`
                    }`}
                  >
                    <div className="font-cyrillic text-xl sm:text-2xl font-bold leading-tight">
                      {item.upper} {item.lower}
                    </div>
                    <div
                      className={`text-[10px] mt-1 font-medium truncate ${
                        active ? 'text-amber-200' : theme.muted
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className={`text-[9px] font-bold uppercase ${active ? 'text-white/80' : badgeColor}`}>
                      {item.ipa.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Letter Inspector */}
          <div className={`lg:col-span-6 rounded-2xl border p-6 space-y-5 ${theme.cardBg}`}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 border-inherit">
              <div className="flex items-center gap-4">
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border font-cyrillic text-4xl font-bold ${theme.subCardBg} ${theme.heading}`}>
                  {selectedLetter.upper}{selectedLetter.lower}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${theme.accentBgSoft}`}>
                      #{selectedLetter.order} · {selectedLetter.type}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${theme.muted}`}>
                      IPA {selectedLetter.ipa}
                    </span>
                  </div>
                  <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>
                    Letter «{selectedLetter.upper}» ({selectedLetter.name})
                  </h3>
                  <p className={`font-cyrillic text-xs ${theme.muted}`}>
                    Russian letter name: {selectedLetter.nameRu}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  speakRussian(
                    selectedLetter.exampleWords.map((w) => w.word).join(', '),
                    { rate: speechRate }
                  )
                }
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
              >
                <Volume2 className="h-4 w-4" />
                <span>Hear Examples</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className={`rounded-xl border p-3.5 space-y-1 ${theme.subCardBg}`}>
                <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                  English Approximation & Articulation
                </div>
                <p className={`text-sm font-medium ${theme.heading}`}>{selectedLetter.englishApprox}</p>
                <p className={`text-xs leading-relaxed ${theme.text}`}>
                  <strong>Limitation to watch:</strong> {selectedLetter.pronunciationLimitation}
                </p>
              </div>

              <div className={`rounded-xl border p-3.5 space-y-1 ${theme.subCardBg}`}>
                <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                  Hindi Sound Guide (हिंदी उच्चारण)
                </div>
                <p className={`font-devanagari text-sm leading-relaxed ${theme.text}`}>
                  {selectedLetter.hindiGuide}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`rounded-xl border p-3 text-xs space-y-1 ${theme.subCardBg}`}>
                  <div className={`font-bold uppercase tracking-wider text-[10px] ${theme.muted}`}>
                    Hard / Soft & Voicing
                  </div>
                  <p className={theme.text}>{selectedLetter.hardSoftInfo}</p>
                  {selectedLetter.voicedPair && (
                    <p className={`font-semibold ${theme.accentText}`}>{selectedLetter.voicedPair}</p>
                  )}
                </div>

                <div className={`rounded-xl border p-3 text-xs space-y-1 ${theme.subCardBg}`}>
                  <div className={`font-bold uppercase tracking-wider text-[10px] ${theme.muted}`}>
                    Handwriting & Print Notes
                  </div>
                  <p className={theme.text}>{selectedLetter.writingNotes}</p>
                </div>
              </div>
            </div>

            {/* Stressed Example Words */}
            <div className="space-y-2">
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.heading}`}>
                Example Words with Stress Marks (Click Audio)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedLetter.exampleWords.map((ex) => (
                  <button
                    key={ex.word}
                    type="button"
                    onClick={() => speakRussian(ex.word, { rate: speechRate })}
                    className={`rounded-xl border p-3 text-left transition-colors cursor-pointer hover:border-amber-500 ${theme.subCardBg}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-cyrillic text-base font-bold ${theme.heading}`}>
                        {ex.stressed}
                      </span>
                      <Play className={`h-3.5 w-3.5 shrink-0 ${theme.accentText}`} />
                    </div>
                    <div className={`text-[11px] font-mono ${theme.muted}`}>{ex.translit}</div>
                    <div className={`text-xs font-semibold mt-1 ${theme.text}`}>{ex.english}</div>
                    <div className={`font-devanagari text-[11px] ${theme.muted}`}>{ex.hindi}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Listening Discrimination */}
            {selectedLetter.listeningContrast && (
              <div className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                    <Headphones className="h-3.5 w-3.5" />
                    <span>Listening Discrimination Check</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      speakRussian(selectedLetter.listeningContrast!.targetWord, { rate: speechRate })
                    }
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Play Target Sound</span>
                  </button>
                </div>
                <p className={`text-xs ${theme.text}`}>
                  Click Play Target Sound above and choose the matching word ({selectedLetter.listeningContrast.hint}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    selectedLetter.listeningContrast.targetWord,
                    selectedLetter.listeningContrast.distractorWord,
                  ]
                    .sort()
                    .map((wordOpt) => (
                      <button
                        key={wordOpt}
                        type="button"
                        onClick={() => {
                          setListeningChoice(wordOpt);
                          setListeningChecked(true);
                        }}
                        className={`rounded-lg border px-4 py-2 font-cyrillic text-sm font-bold cursor-pointer ${
                          listeningChecked
                            ? wordOpt === selectedLetter.listeningContrast!.targetWord
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600'
                              : listeningChoice === wordOpt
                              ? 'border-red-500 bg-red-500/15 text-red-600'
                              : theme.secondaryBtn
                            : theme.secondaryBtn
                        }`}
                      >
                        {wordOpt}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: UNITS 1, 3, 4, 5, 6 PHONOLOGY THEORY */}
      {subTab === 'units' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-2">
            {A0_PHONOLOGY_UNITS.map((unit, idx) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => setSelectedUnitIdx(idx)}
                className={`w-full rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  selectedUnitIdx === idx ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className={`text-[11px] font-bold uppercase tracking-wider ${selectedUnitIdx === idx ? 'text-amber-300' : theme.accentText}`}>
                  Unit {unit.unitNumber}
                </div>
                <div className="font-cinzel text-sm font-bold mt-0.5">{unit.title}</div>
                <div className={`font-cyrillic text-xs mt-1 ${selectedUnitIdx === idx ? 'text-slate-300' : theme.muted}`}>
                  {unit.titleRu}
                </div>
              </button>
            ))}
          </div>

          <div className={`lg:col-span-8 rounded-2xl border p-6 space-y-5 ${theme.cardBg}`}>
            {(() => {
              const unit = A0_PHONOLOGY_UNITS[selectedUnitIdx] || A0_PHONOLOGY_UNITS[0];
              return (
                <>
                  <div className="border-b pb-4 border-inherit space-y-1">
                    <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                      Level 0 Phonology Unit {unit.unitNumber}
                    </div>
                    <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>{unit.title}</h3>
                    <p className={`font-cyrillic text-sm ${theme.muted}`}>{unit.titleRu}</p>
                    <p className={`text-sm pt-1 leading-relaxed ${theme.text}`}>{unit.summary}</p>
                  </div>

                  <div className="space-y-4">
                    {unit.sections.map((sec) => (
                      <div key={sec.heading} className={`rounded-xl border p-4 space-y-2.5 ${theme.subCardBg}`}>
                        <h4 className={`text-sm font-bold ${theme.heading}`}>{sec.heading}</h4>
                        <ul className="space-y-2">
                          {sec.points.map((pt, i) => (
                            <li key={i} className={`text-xs sm:text-sm leading-relaxed flex items-start gap-2 ${theme.text}`}>
                              <span className={`font-bold ${theme.accentText}`}>•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: ЙЦУКЕН KEYBOARD & TYPING TRAINER */}
      {subTab === 'typing' && (
        <div className={`rounded-2xl border p-6 space-y-6 ${theme.cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <Keyboard className="h-4 w-4" />
                <span>Russian ЙЦУКЕН Keyboard Lab</span>
              </div>
              <h3 className={`font-cinzel text-xl font-bold mt-1 ${theme.heading}`}>
                Click On-Screen Cyrillic Keys or Type With Your Russian Keyboard
              </h3>
            </div>
            <div className={`text-xs font-semibold tabular-nums ${theme.muted}`}>
              Drills completed: <span className={theme.heading}>{drillsCompleted}</span>
            </div>
          </div>

          <div className={`rounded-xl border p-5 space-y-4 ${theme.subCardBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className={`text-xs ${theme.muted}`}>Target Russian Word ({currentDrill.hint})</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-cyrillic text-3xl font-bold ${theme.heading}`}>
                    {currentDrill.target}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakRussian(currentDrill.target, { rate: speechRate })}
                    className={`rounded-lg border p-2 cursor-pointer ${theme.secondaryBtn}`}
                    aria-label="Hear target word"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className={`text-xs font-mono ${theme.muted}`}>
                Translit hint: {currentDrill.en}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type or click Cyrillic keys below..."
                className={`flex-1 rounded-xl border px-4 py-3 font-cyrillic text-lg font-semibold ${theme.inputCls}`}
              />
              <button
                type="button"
                onClick={() => setTypedInput('')}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleNextDrill}
                className={`rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
              >
                {isDrillMatch ? 'Excellent! Next Word →' : 'Skip Word →'}
              </button>
            </div>

            {typedInput.length > 0 && (
              <div className={`text-xs font-semibold ${isDrillMatch ? 'text-emerald-600' : theme.muted}`}>
                {isDrillMatch
                  ? `Matched «${currentDrill.target}» accurately.`
                  : `Keep typing (${typedInput.length} / ${currentDrill.target.length} letters)`}
              </div>
            )}
          </div>

          {/* Virtual ЙЦУКЕН Layout */}
          <div className="space-y-2 overflow-x-auto pb-2">
            {RUSSIAN_KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5 min-w-[540px]">
                {row.map((k) => (
                  <button
                    key={k.keyRu}
                    type="button"
                    onClick={() => handleVirtualKey(k.keyRu)}
                    className={`flex flex-col items-center justify-center rounded-lg border px-3 py-2 min-w-[42px] transition-colors cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <span className="font-cyrillic text-sm font-bold">{k.label}</span>
                    <span className={`text-[9px] uppercase ${theme.muted}`}>{k.keyEn}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALPHABET MASTERY RECOGNITION QUIZ */}
      {subTab === 'quiz' && (
        <div className={`rounded-2xl border p-6 space-y-6 ${theme.cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-inherit">
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <Sparkles className="h-4 w-4" />
                <span>Level 0 Checkpoint Quiz</span>
              </div>
              <h3 className={`font-cinzel text-xl font-bold mt-1 ${theme.heading}`}>
                Alphabet, False Friends, Devoicing & Intonation Mastery Check
              </h3>
              <p className={`text-xs mt-1 ${theme.text}`}>
                Score 75% (6/8) or higher to certify Level 0 completion and unlock A1 modules.
              </p>
            </div>
            {quizSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Check</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {A0_ALPHABET_QUIZ.map((q, idx) => {
              const chosen = quizAnswers[q.id];
              const isCorrect = chosen === q.correctAnswer;
              return (
                <div key={q.id} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                  <div className={`text-sm font-bold ${theme.heading}`}>
                    {idx + 1}. {q.prompt}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const active = chosen === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`rounded-lg border px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                            quizSubmitted
                              ? opt === q.correctAnswer
                                ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700'
                                : active
                                ? 'border-red-500 bg-red-500/15 text-red-700'
                                : `${theme.cardBg} opacity-60`
                              : active
                              ? `${theme.accentBgSoft} font-bold`
                              : `${theme.cardBg} hover:border-slate-400`
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="flex items-start gap-2 text-xs pt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span className={theme.text}>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              type="button"
              disabled={Object.keys(quizAnswers).length < A0_ALPHABET_QUIZ.length}
              onClick={handleSubmitQuiz}
              className={`rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-45 ${theme.primaryBtn}`}
            >
              Submit Alphabet Mastery Check ({Object.keys(quizAnswers).length}/{A0_ALPHABET_QUIZ.length})
            </button>
          ) : (
            <div className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              quizScore >= 6 ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-amber-500/40 bg-amber-500/10'
            }`}>
              <div>
                <div className={`text-base font-bold ${theme.heading}`}>
                  Score: {quizScore} / {A0_ALPHABET_QUIZ.length} ({Math.round((quizScore / A0_ALPHABET_QUIZ.length) * 100)}%)
                </div>
                <p className={`text-xs mt-0.5 ${theme.text}`}>
                  {quizScore >= 6
                    ? 'Level 0 mastered! Level A1 structured lessons are now unlocked.'
                    : 'Review Units 3–5 above and try again to clear the 75% checkpoint.'}
                </p>
              </div>
              {quizScore >= 6 && (
                <button
                  type="button"
                  onClick={() => onOpenLesson('lesson-a1-1')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  Start Level A1 Lesson 1.1 →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
