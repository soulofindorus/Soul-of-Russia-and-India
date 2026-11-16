import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PlaySquare,
  Printer,
  Send,
  Sparkles,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  BookmarkRecord,
  LessonVocabularyItem,
  SchoolLesson,
  StudentProgressRecord,
  VideoReference,
} from '../../types/school';
import { speakRussian, stripRussianStressMarks } from '../../utils/russianSpeech';
import { submitWritingExercise } from '../../utils/schoolFirebaseService';
import { SchoolThemeTokens } from './schoolTheme';

interface LessonReaderViewProps {
  theme: SchoolThemeTokens;
  user: User | null;
  lessons: SchoolLesson[];
  activeLessonId: string;
  allVocabBank: LessonVocabularyItem[];
  videoReferences: VideoReference[];
  progress: StudentProgressRecord;
  bookmarks: BookmarkRecord[];
  onSelectLesson: (lessonId: string) => void;
  onToggleSaveVocab: (vocabId: string) => void;
  onToggleBookmark: (item: { itemId: string; itemType: 'lesson'; title: string; levelId: SchoolLesson['levelId'] }) => void;
  onMarkLessonComplete: (lessonId: string) => void;
  onOpenVideo: (video: VideoReference) => void;
  onSignInRequest: () => void;
}

export const LessonReaderView: React.FC<LessonReaderViewProps> = ({
  theme,
  user,
  lessons,
  activeLessonId,
  allVocabBank,
  videoReferences,
  progress,
  bookmarks,
  onSelectLesson,
  onToggleSaveVocab,
  onToggleBookmark,
  onMarkLessonComplete,
  onOpenVideo,
  onSignInRequest,
}) => {
  const [navOpen, setNavOpen] = useState<boolean>(true);
  const [distractionFree, setDistractionFree] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [showStress, setShowStress] = useState<boolean>(true);
  const [showTranslit, setShowTranslit] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showHindi, setShowHindi] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  // Word Inspector state for clickable Russian text
  const [inspectedWord, setInspectedWord] = useState<{ token: string; match?: LessonVocabularyItem } | null>(null);

  // Listening check state
  const [listeningChoice, setListeningChoice] = useState<string>('');
  const [listeningSubmitted, setListeningSubmitted] = useState<boolean>(false);

  // Lesson Exercises state
  const [exerciseInputs, setExerciseInputs] = useState<Record<string, string>>({});
  const [exerciseSubmitted, setExerciseSubmitted] = useState<Record<string, boolean>>({});

  // Writing exercise state
  const [writingText, setWritingText] = useState<string>('');
  const [writingStatus, setWritingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [writingMsg, setWritingMsg] = useState<string>('');
  const [showSampleWriting, setShowSampleWriting] = useState<boolean>(false);

  const lesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const currentIndex = lessons.findIndex((l) => l.id === lesson?.id);
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const isCompleted = lesson ? progress.completedLessonIds.includes(lesson.id) : false;
  const isBookmarked = lesson
    ? bookmarks.some((b) => b.itemId === lesson.id && b.itemType === 'lesson')
    : false;

  const lessonVideos = useMemo(() => {
    if (!lesson) return [];
    const direct = videoReferences.filter((v) => v.lessonId === lesson.id);
    if (direct.length > 0) return direct;
    return videoReferences.filter((v) => v.levelId === lesson.levelId).slice(0, 2);
  }, [lesson, videoReferences]);

  const combinedVocabMap = useMemo(() => {
    const map = new Map<string, LessonVocabularyItem>();
    [...(lesson?.vocabulary || []), ...allVocabBank].forEach((v) => {
      const clean = stripRussianStressMarks(v.word).toLowerCase();
      if (!map.has(clean)) map.set(clean, v);
    });
    return map;
  }, [lesson, allVocabBank]);

  if (!lesson) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${theme.cardBg}`}>
        <p className={theme.text}>No lessons available yet.</p>
      </div>
    );
  }

  const formatRu = (stressed: string, plain?: string) =>
    showStress ? stressed : plain || stripRussianStressMarks(stressed);

  const fontClass =
    fontScale === 'sm' ? 'text-sm' : fontScale === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';

  const checkedCount = lesson.exercises.filter((ex) => exerciseSubmitted[ex.id]).length;
  const correctCount = lesson.exercises.filter((ex) => {
    if (!exerciseSubmitted[ex.id]) return false;
    const ans = (exerciseInputs[ex.id] || '').trim().toLowerCase();
    const expected = ex.correctAnswer.trim().toLowerCase();
    const accepted = (ex.acceptedAnswers || []).map((a) => a.trim().toLowerCase());
    return ans === expected || accepted.includes(ans);
  }).length;

  const handleInspectWord = (rawToken: string) => {
    const cleaned = stripRussianStressMarks(rawToken)
      .replace(/[.,!?;:«»"()—–]/g, '')
      .trim()
      .toLowerCase();
    if (!cleaned) return;
    const exact = combinedVocabMap.get(cleaned);
    let partial: LessonVocabularyItem | undefined = exact;
    if (!partial && cleaned.length >= 4) {
      const stem = cleaned.slice(0, cleaned.length - 1);
      for (const [k, v] of combinedVocabMap.entries()) {
        if (k.startsWith(stem) || cleaned.startsWith(k.slice(0, Math.max(3, k.length - 1)))) {
          partial = v;
          break;
        }
      }
    }
    setInspectedWord({ token: rawToken.replace(/[.,!?;:«»"()—–]/g, ''), match: partial });
    speakRussian(cleaned, { rate: speechRate });
  };

  const renderClickableRussian = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, idx) => {
      if (/^\s+$/.test(part)) return <React.Fragment key={idx}>{part}</React.Fragment>;
      return (
        <button
          key={idx}
          type="button"
          onClick={() => handleInspectWord(part)}
          title="Click to hear & inspect word"
          className="inline hover:bg-amber-400/20 rounded px-0.5 transition-colors cursor-pointer"
        >
          {part}
        </button>
      );
    });
  };

  const handleCheckExercise = (exId: string) => {
    if (!exerciseInputs[exId]?.trim()) return;
    setExerciseSubmitted((prev) => ({ ...prev, [exId]: true }));
  };

  const handleWritingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writingText.trim()) return;
    if (!user) {
      setWritingStatus('error');
      setWritingMsg('Please sign in with Google above to submit writing for teacher feedback.');
      return;
    }
    setWritingStatus('saving');
    try {
      await submitWritingExercise(user, {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        levelId: lesson.levelId,
        prompt: lesson.writingExercise.prompt,
        responseText: writingText.trim(),
      });
      setWritingStatus('saved');
      setWritingMsg('Submitted! View your status and Sarika Kumari’s review in Student Dashboard.');
      setWritingText('');
    } catch (err: unknown) {
      setWritingStatus('error');
      setWritingMsg(err instanceof Error ? err.message : 'Unable to save writing right now.');
    }
  };

  const handleSwitchLesson = (id: string) => {
    setExerciseInputs({});
    setExerciseSubmitted({});
    setListeningChoice('');
    setListeningSubmitted(false);
    setWritingText('');
    setWritingStatus('idle');
    setInspectedWord(null);
    onSelectLesson(id);
  };

  const levelsOrder: SchoolLesson['levelId'][] = ['pre-a1', 'a1', 'a2', 'b1', 'b2'];

  return (
    <div className="space-y-4">
      {/* Top Reader Toolbar */}
      <div className={`no-print rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${theme.cardBg}`}>
        <div className="flex flex-wrap items-center gap-2">
          {!distractionFree && (
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
            >
              {navOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
              <span>{navOpen ? 'Hide Syllabus' : 'Lessons'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDistractionFree((d) => !d)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
          >
            {distractionFree ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{distractionFree ? 'Exit Focus Mode' : 'Focus Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Worksheet</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onToggleBookmark({
                itemId: lesson.id,
                itemType: 'lesson',
                title: lesson.title,
                levelId: lesson.levelId,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              isBookmarked ? theme.accentBgSoft : theme.secondaryBtn
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>

        {/* Display toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowStress((s) => !s)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
              showStress ? theme.accentBgSoft : theme.secondaryBtn
            }`}
          >
            Stress ({showStress ? 'On' : 'Off'})
          </button>
          <button
            type="button"
            onClick={() => setShowTranslit((s) => !s)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
              showTranslit ? theme.accentBgSoft : theme.secondaryBtn
            }`}
          >
            Translit
          </button>
          <button
            type="button"
            onClick={() => setShowEnglish((s) => !s)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
              showEnglish ? theme.accentBgSoft : theme.secondaryBtn
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setShowHindi((s) => !s)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
              showHindi ? theme.accentBgSoft : theme.secondaryBtn
            }`}
          >
            HI
          </button>

          <div className="flex items-center gap-1 ml-1">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFontScale(sz)}
                className={`rounded-md border px-2 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                  fontScale === sz ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                {sz === 'sm' ? 'A-' : sz === 'md' ? 'A' : 'A+'}
              </button>
            ))}
          </div>

          <select
            aria-label="Audio speed"
            value={speechRate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${theme.inputCls}`}
          >
            <option value={0.7}>0.7x Slow</option>
            <option value={0.85}>0.85x Clear</option>
            <option value={1.0}>1.0x Natural</option>
          </select>
        </div>
      </div>

      {/* 3-Column Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: COLLAPSIBLE SYLLABUS NAV */}
        {!distractionFree && navOpen && (
          <aside className={`no-print lg:col-span-3 rounded-2xl border p-4 space-y-4 lg:sticky lg:top-20 max-h-[82vh] overflow-y-auto ${theme.cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <span className={`text-xs font-bold uppercase tracking-wider ${theme.heading}`}>
                Course Navigator
              </span>
              <span className={`text-[11px] font-semibold tabular-nums ${theme.muted}`}>
                {progress.completedLessonIds.length}/{lessons.length} done
              </span>
            </div>

            <div className="space-y-4">
              {levelsOrder.map((lvlId) => {
                const lvlLessons = lessons.filter((ls) => ls.levelId === lvlId);
                if (lvlLessons.length === 0) return null;
                return (
                  <div key={lvlId} className="space-y-1.5">
                    <div className={`text-[11px] font-bold uppercase tracking-wider px-1 ${theme.accentText}`}>
                      {lvlId === 'pre-a1' ? 'A0 · Pre-A1 Alphabet' : `Level ${lvlId.toUpperCase()}`}
                    </div>
                    <div className="space-y-1">
                      {lvlLessons.map((ls) => {
                        const active = ls.id === lesson.id;
                        const done = progress.completedLessonIds.includes(ls.id);
                        return (
                          <button
                            key={ls.id}
                            type="button"
                            onClick={() => handleSwitchLesson(ls.id)}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                              active ? theme.primaryBtn : theme.subCardBg
                            }`}
                          >
                            <span className="font-semibold leading-snug line-clamp-2">
                              {ls.title}
                            </span>
                            {done && (
                              <CheckCircle2
                                className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                                  active ? 'text-amber-300' : 'text-emerald-600'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: 14-PART LESSON READER */}
        <article
          className={`print-lesson-sheet ${
            distractionFree
              ? 'lg:col-span-12 max-w-4xl mx-auto w-full'
              : navOpen
              ? 'lg:col-span-6'
              : 'lg:col-span-9'
          } rounded-2xl border p-6 sm:p-8 space-y-8 ${theme.cardBg}`}
        >
          {/* Optional Word Inspector Drawer Bar */}
          {inspectedWord && (
            <div className={`no-print rounded-xl border border-amber-500/40 p-4 flex items-start justify-between gap-4 ${theme.subCardBg}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`font-cyrillic text-lg font-bold ${theme.heading}`}>
                    {inspectedWord.match ? inspectedWord.match.stressed : inspectedWord.token}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakRussian(inspectedWord.token, { rate: speechRate })}
                    className={`rounded-md p-1 border cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {inspectedWord.match ? (
                  <div className={`text-xs space-y-0.5 ${theme.text}`}>
                    <div>
                      <strong>EN:</strong> {inspectedWord.match.english} ·{' '}
                      <strong>HI:</strong>{' '}
                      <span className="font-devanagari">{inspectedWord.match.hindi}</span>
                    </div>
                    <div className={theme.muted}>
                      {inspectedWord.match.partOfSpeech} · IPA {inspectedWord.match.pronunciation}
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs ${theme.muted}`}>
                    Pronounced aloud via Russian speech synthesizer. Check the Vocabulary grid below for core stems.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectedWord(null)}
                className={`p-1 rounded border cursor-pointer ${theme.secondaryBtn}`}
                aria-label="Close word inspector"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* 1. Header & Objectives */}
          <header className="border-b pb-6 border-inherit space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase ${theme.accentBgSoft}`}>
                  {lesson.levelId === 'pre-a1' ? 'A0 / Pre-A1' : lesson.levelId.toUpperCase()}
                </span>
                <span className={`text-xs font-medium tabular-nums ${theme.muted}`}>
                  Approx. {lesson.estimatedMinutes} min
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                )}
              </div>

              {lesson.audioUrl && (
                <audio controls src={lesson.audioUrl} className="h-8 max-w-xs" />
              )}
            </div>

            <div>
              <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold leading-tight ${theme.heading}`}>
                {lesson.title}
              </h2>
              <p className={`font-cyrillic text-base mt-1 ${theme.muted}`}>{lesson.titleRu}</p>
            </div>

            {/* Objectives */}
            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Learning Objectives
              </div>
              <ul className="space-y-1.5">
                {lesson.objectives.map((obj, idx) => (
                  <li key={idx} className={`text-xs sm:text-sm flex items-start gap-2 ${theme.text}`}>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${theme.accentText}`} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* 2. Introduction */}
          <section id="sec-intro" className="space-y-2 max-w-[72ch]">
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>1. Overview & Context</h3>
            <p className={`${fontClass} leading-relaxed ${theme.text}`}>{lesson.introduction}</p>
          </section>

          {/* 3. Vocabulary Grid */}
          <section id="sec-vocab" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                2. Core Lesson Vocabulary
              </h3>
              <span className={`text-xs ${theme.muted}`}>
                Click audio or save words to your flashcard deck
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.vocabulary.map((v) => {
                const isSaved = progress.savedVocabIds.includes(v.id);
                return (
                  <div key={v.id} className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-cyrillic text-lg font-bold ${theme.heading}`}>
                            {formatRu(v.stressed, v.word)}
                          </span>
                          <button
                            type="button"
                            onClick={() => speakRussian(v.word, { rate: speechRate })}
                            className={`rounded-md border p-1 cursor-pointer ${theme.secondaryBtn}`}
                            aria-label={`Play ${v.word}`}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className={`text-[11px] font-mono ${theme.muted}`}>
                          {showTranslit && `${v.translit} · `}
                          {v.pronunciation} · {v.partOfSpeech}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSaveVocab(v.id)}
                        className={`no-print rounded-md border px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                          isSaved ? theme.accentBgSoft : theme.secondaryBtn
                        }`}
                      >
                        {isSaved ? 'Saved' : '+ Save'}
                      </button>
                    </div>

                    <div className="text-xs space-y-0.5">
                      {showEnglish && (
                        <div className={`font-semibold ${theme.heading}`}>{v.english}</div>
                      )}
                      {showHindi && (
                        <div className={`font-devanagari ${theme.text}`}>{v.hindi}</div>
                      )}
                    </div>

                    <div className={`border-t pt-2 text-xs space-y-0.5 ${theme.border}`}>
                      <button
                        type="button"
                        onClick={() => speakRussian(v.exampleRu, { rate: speechRate })}
                        className={`text-left font-cyrillic font-medium hover:underline cursor-pointer ${theme.heading}`}
                      >
                        {formatRu(v.exampleRu)}
                      </button>
                      {showEnglish && <div className={theme.muted}>{v.exampleEn}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Grammar Explanations + Tables */}
          <section id="sec-grammar" className="space-y-4">
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
              3. Grammar Mechanics & Indian-Learner Guidance
            </h3>

            <div className="space-y-4 max-w-[72ch]">
              {lesson.grammarExplanation.map((g) => (
                <div key={g.heading} className={`rounded-xl border p-5 space-y-3 ${theme.subCardBg}`}>
                  <h4 className={`text-sm sm:text-base font-bold ${theme.heading}`}>{g.heading}</h4>
                  <div className="space-y-2">
                    {g.body.map((para, i) => (
                      <p key={i} className={`${fontClass} leading-relaxed ${theme.text}`}>
                        {para}
                      </p>
                    ))}
                  </div>
                  {g.indianLearnerTip && (
                    <div className={`rounded-lg border p-3 text-xs leading-relaxed ${theme.accentBgSoft}`}>
                      <strong>Hindi / Indian Learner Insight:</strong> {g.indianLearnerTip}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tables */}
            {lesson.grammarTables.map((tbl) => (
              <div key={tbl.title} className="space-y-2">
                <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  {tbl.title}
                </div>
                <div className="overflow-x-auto rounded-xl border border-inherit">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className={theme.tableHeader}>
                        {tbl.headers.map((h) => (
                          <th key={h} className="p-2.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.map((r, rIdx) => (
                        <tr key={rIdx} className={`border-t ${theme.tableRow}`}>
                          {r.map((cell, cIdx) => (
                            <td key={cIdx} className={`p-2.5 font-cyrillic ${cIdx === 0 ? 'font-semibold' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          {/* 5. Model Example Sentences */}
          <section id="sec-examples" className="space-y-3">
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
              4. Example Sentences (Click Any Word)
            </h3>
            <div className="space-y-2.5">
              {lesson.exampleSentences.map((ex, idx) => (
                <div key={idx} className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${theme.subCardBg}`}>
                  <div className="space-y-1">
                    <div className={`font-cyrillic text-base sm:text-lg font-semibold ${theme.heading}`}>
                      {renderClickableRussian(formatRu(ex.stressed, ex.russian))}
                    </div>
                    {showTranslit && (
                      <div className={`text-xs font-mono ${theme.muted}`}>{ex.translit}</div>
                    )}
                    {showEnglish && <div className={`text-xs sm:text-sm ${theme.text}`}>{ex.english}</div>}
                    {showHindi && (
                      <div className={`font-devanagari text-xs ${theme.muted}`}>{ex.hindi}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => speakRussian(ex.russian, { rate: speechRate })}
                    className={`no-print rounded-lg border p-2 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                    aria-label="Hear sentence"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Realistic Dialogue */}
          <section id="sec-dialogue" className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                  5. Dialogue: {lesson.dialogue.title}
                </h3>
                <p className={`text-xs ${theme.muted}`}>{lesson.dialogue.setting}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  speakRussian(lesson.dialogue.lines.map((l) => l.russian).join('. '), {
                    rate: speechRate,
                  })
                }
                className={`no-print inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Play All</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {lesson.dialogue.lines.map((line, i) => (
                <div key={i} className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${theme.subCardBg}`}>
                  <div className="space-y-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                      {line.speaker}
                    </span>
                    <div className={`font-cyrillic text-base font-semibold ${theme.heading}`}>
                      {renderClickableRussian(formatRu(line.stressed, line.russian))}
                    </div>
                    {showTranslit && <div className={`text-xs font-mono ${theme.muted}`}>{line.translit}</div>}
                    {showEnglish && <div className={`text-xs sm:text-sm ${theme.text}`}>{line.english}</div>}
                    {showHindi && <div className={`font-devanagari text-xs ${theme.muted}`}>{line.hindi}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => speakRussian(line.russian, { rate: speechRate })}
                    className={`no-print rounded-lg border p-2 shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                    aria-label="Play dialogue line"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Reading Passage */}
          <section id="sec-reading" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                6. Reading Passage: {lesson.readingPassage.title}
              </h3>
              <button
                type="button"
                onClick={() =>
                  speakRussian(lesson.readingPassage.russian.join(' '), { rate: speechRate })
                }
                className={`no-print inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Read Aloud</span>
              </button>
            </div>

            <div className={`rounded-xl border p-5 space-y-4 max-w-[72ch] ${theme.subCardBg}`}>
              {lesson.readingPassage.russian.map((paraRu, idx) => (
                <div key={idx} className="space-y-1.5 border-b last:border-b-0 pb-3 last:pb-0 border-inherit">
                  <p className={`font-cyrillic ${fontClass} font-medium leading-relaxed ${theme.heading}`}>
                    {renderClickableRussian(formatRu(paraRu))}
                  </p>
                  {showEnglish && lesson.readingPassage.english[idx] && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
                      {lesson.readingPassage.english[idx]}
                    </p>
                  )}
                  {showHindi && lesson.readingPassage.hindi[idx] && (
                    <p className={`font-devanagari text-xs leading-relaxed ${theme.muted}`}>
                      {lesson.readingPassage.hindi[idx]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 8. Listening Comprehension */}
          <section id="sec-listening" className="space-y-3">
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
              7. Listening Comprehension
            </h3>
            <div className={`rounded-xl border p-5 space-y-4 ${theme.subCardBg}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Headphones className={`h-4 w-4 ${theme.accentText}`} />
                  <span className={theme.text}>{lesson.listeningExercise.instruction}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakRussian(lesson.listeningExercise.spokenTextRu, { rate: speechRate })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Play Audio Prompt</span>
                </button>
              </div>

              <p className={`text-sm font-bold ${theme.heading}`}>
                {lesson.listeningExercise.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lesson.listeningExercise.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={listeningSubmitted}
                    onClick={() => setListeningChoice(opt)}
                    className={`rounded-lg border px-3.5 py-2.5 text-left text-xs sm:text-sm cursor-pointer ${
                      listeningSubmitted
                        ? opt === lesson.listeningExercise.correctAnswer
                          ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700'
                          : listeningChoice === opt
                          ? 'border-red-500 bg-red-500/15 text-red-700'
                          : theme.cardBg
                        : listeningChoice === opt
                        ? `${theme.accentBgSoft} font-bold`
                        : theme.cardBg
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {!listeningSubmitted ? (
                <button
                  type="button"
                  disabled={!listeningChoice}
                  onClick={() => setListeningSubmitted(true)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 ${theme.primaryBtn}`}
                >
                  Verify Answer
                </button>
              ) : (
                <div className={`rounded-lg border p-3 text-xs space-y-1 ${theme.cardBg}`}>
                  <div className="font-bold">
                    {listeningChoice === lesson.listeningExercise.correctAnswer
                      ? 'Correct!'
                      : `Expected: ${lesson.listeningExercise.correctAnswer}`}
                  </div>
                  <p className={theme.text}>{lesson.listeningExercise.explanation}</p>
                  <p className={theme.muted}>
                    Transcript: {lesson.listeningExercise.spokenTextRu} — {lesson.listeningExercise.transcriptEn}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 9. Speaking Prompts & 10. Writing Submission */}
          <section id="sec-practice" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`rounded-xl border p-5 space-y-3 ${theme.subCardBg}`}>
              <h3 className={`font-cinzel text-base font-bold ${theme.heading}`}>
                8. Guided Speaking Practice
              </h3>
              <p className={`text-xs ${theme.muted}`}>{lesson.speakingPractice.scenario}</p>
              <div className="space-y-3">
                {lesson.speakingPractice.prompts.map((sp, i) => (
                  <div key={i} className={`rounded-lg border p-3 space-y-1 ${theme.cardBg}`}>
                    <div className={`text-xs font-bold ${theme.heading}`}>{sp.promptEn}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-cyrillic text-xs font-semibold ${theme.accentText}`}>
                        Model: {sp.modelRu}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakRussian(sp.modelRu, { rate: speechRate })}
                        className={`rounded border p-1 cursor-pointer ${theme.secondaryBtn}`}
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className={`text-[11px] ${theme.muted}`}>{sp.tip}</div>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleWritingSubmit}
              className={`no-print rounded-xl border p-5 space-y-3 flex flex-col justify-between ${theme.subCardBg}`}
            >
              <div className="space-y-2">
                <h3 className={`font-cinzel text-base font-bold ${theme.heading}`}>
                  9. Writing Assignment (Teacher Reviewed)
                </h3>
                <p className={`text-xs font-semibold ${theme.text}`}>{lesson.writingExercise.prompt}</p>
                <p className={`text-[11px] ${theme.muted}`}>{lesson.writingExercise.guidance}</p>
                <textarea
                  rows={4}
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  placeholder="Write your Russian response here..."
                  className={`w-full rounded-lg border p-3 font-cyrillic text-sm ${theme.inputCls}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSampleWriting((s) => !s)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold cursor-pointer ${theme.accentText} hover:underline`}
                  >
                    {showSampleWriting ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{showSampleWriting ? 'Hide Sample' : 'View Model Sample'}</span>
                  </button>

                  {user ? (
                    <button
                      type="submit"
                      disabled={writingStatus === 'saving' || !writingText.trim()}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-45 ${theme.primaryBtn}`}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{writingStatus === 'saving' ? 'Submitting...' : 'Submit to Teacher'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onSignInRequest}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                    >
                      Sign In with Google to Submit
                    </button>
                  )}
                </div>

                {writingMsg && (
                  <p className={`text-xs font-medium ${writingStatus === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {writingMsg}
                  </p>
                )}

                {showSampleWriting && (
                  <div className={`rounded-lg border p-3 text-xs space-y-1 ${theme.cardBg}`}>
                    <div className={`font-cyrillic font-semibold ${theme.heading}`}>
                      {lesson.writingExercise.sampleAnswerRu}
                    </div>
                    <div className={theme.muted}>{lesson.writingExercise.sampleAnswerEn}</div>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* 11. Cultural Note & India–Russia Comparison */}
          <section id="sec-culture" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Cultural Note</span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>{lesson.culturalNote}</p>
            </div>

            <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <Globe className="h-3.5 w-3.5" />
                <span>{lesson.indiaRussiaEquivalent.title}</span>
              </div>
              <p className={`text-xs leading-relaxed ${theme.text}`}>
                <strong>Similarity:</strong> {lesson.indiaRussiaEquivalent.similarity}
              </p>
              <p className={`text-xs leading-relaxed ${theme.text}`}>
                <strong>Key Difference:</strong> {lesson.indiaRussiaEquivalent.difference}
              </p>
            </div>
          </section>

          {/* 12. Interactive Exercises */}
          <section id="sec-exercises" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                10. Interactive Mastery Exercises
              </h3>
              <span className={`text-xs font-semibold tabular-nums ${theme.muted}`}>
                Checked {checkedCount}/{lesson.exercises.length} · Score {correctCount}/{lesson.exercises.length}
              </span>
            </div>

            <div className="space-y-4">
              {lesson.exercises.map((ex, idx) => {
                const chosen = exerciseInputs[ex.id] || '';
                const submitted = Boolean(exerciseSubmitted[ex.id]);
                const normalizedChosen = chosen.trim().toLowerCase();
                const isCorrect =
                  normalizedChosen === ex.correctAnswer.trim().toLowerCase() ||
                  (ex.acceptedAnswers || []).some((a) => a.trim().toLowerCase() === normalizedChosen);

                return (
                  <div key={ex.id} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                        Exercise {idx + 1} · {ex.type}
                      </span>
                    </div>
                    <p className={`text-sm font-bold ${theme.heading}`}>{ex.prompt}</p>

                    {ex.options && ex.options.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ex.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={submitted}
                            onClick={() => setExerciseInputs((prev) => ({ ...prev, [ex.id]: opt }))}
                            className={`rounded-lg border px-3.5 py-2 text-left text-xs sm:text-sm cursor-pointer ${
                              submitted
                                ? opt === ex.correctAnswer
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
                    ) : (
                      <input
                        type="text"
                        disabled={submitted}
                        value={chosen}
                        onChange={(e) => setExerciseInputs((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                        placeholder="Type your Russian answer..."
                        className={`w-full rounded-lg border px-3.5 py-2.5 font-cyrillic text-sm ${theme.inputCls}`}
                      />
                    )}

                    {!submitted ? (
                      <button
                        type="button"
                        disabled={!chosen.trim()}
                        onClick={() => handleCheckExercise(ex.id)}
                        className={`no-print rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40 ${theme.primaryBtn}`}
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div className={`rounded-lg border p-3 text-xs space-y-1 ${theme.cardBg}`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Correct
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="h-4 w-4" /> Answer: {ex.correctAnswer}
                            </span>
                          )}
                        </div>
                        <p className={theme.text}>{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 13. Summary & 14. Homework + Verified Completion Footer */}
          <footer className="border-t pt-6 border-inherit space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
                <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  Lesson Takeaways
                </div>
                <ul className="space-y-1 text-xs">
                  {lesson.summary.map((s, i) => (
                    <li key={i} className={`flex items-start gap-2 ${theme.text}`}>
                      <span>•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
                <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  Recommended Homework
                </div>
                <ul className="space-y-1 text-xs">
                  {lesson.homework.map((hw, i) => (
                    <li key={i} className={`flex items-start gap-2 ${theme.text}`}>
                      <span>{i + 1}.</span>
                      <span>{hw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`no-print rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.subCardBg}`}>
              <div className="space-y-0.5">
                <div className={`text-sm font-bold ${theme.heading}`}>
                  {isCompleted ? 'Lesson Verified as Complete' : 'Verify Lesson Completion'}
                </div>
                <p className={`text-xs ${theme.muted}`}>
                  {checkedCount > 0
                    ? `Checked ${checkedCount}/${lesson.exercises.length} practice tasks.`
                    : 'Complete or check at least one practice exercise above before marking complete.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isCompleted && (
                  <button
                    type="button"
                    disabled={checkedCount === 0 && lesson.exercises.length > 0}
                    onClick={() => onMarkLessonComplete(lesson.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-45 ${theme.primaryBtn}`}
                  >
                    Mark Lesson Complete
                  </button>
                )}
                {nextLesson && (
                  <button
                    type="button"
                    onClick={() => handleSwitchLesson(nextLesson.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <span>Next: {nextLesson.title.split(':')[0]}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </footer>
        </article>

        {/* RIGHT COLUMN: OUTLINE, VIDEO REFERENCES & QUICK CARDS */}
        {!distractionFree && (
          <aside className="no-print lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            {/* Lesson Outline */}
            <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.heading}`}>
                <FileText className="h-3.5 w-3.5" />
                <span>Lesson Outline</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { id: 'sec-intro', label: '1. Overview' },
                  { id: 'sec-vocab', label: '2. Vocabulary' },
                  { id: 'sec-grammar', label: '3. Grammar & Tables' },
                  { id: 'sec-examples', label: '4. Example Sentences' },
                  { id: 'sec-dialogue', label: '5. Dialogue' },
                  { id: 'sec-reading', label: '6. Reading Passage' },
                  { id: 'sec-listening', label: '7. Listening' },
                  { id: 'sec-practice', label: '8–9. Speaking & Writing' },
                  { id: 'sec-exercises', label: '10. Exercises' },
                ].map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`rounded-md px-2 py-1 hover:underline ${theme.text}`}
                  >
                    {sec.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Video Lessons / Видеоуроки */}
            <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                <PlaySquare className="h-4 w-4" />
                <span>Video Lessons · Видеоуроки</span>
              </div>

              {lessonVideos.length === 0 ? (
                <p className={`text-xs ${theme.muted}`}>
                  Curated channel guides available in Curriculum and Assessments.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {lessonVideos.map((vid) => (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => onOpenVideo(vid)}
                      className={`w-full rounded-xl border p-3 text-left space-y-1 transition-colors cursor-pointer hover:border-amber-500 ${theme.subCardBg}`}
                    >
                      <div className={`text-xs font-bold leading-snug ${theme.heading}`}>{vid.title}</div>
                      <div className={`text-[11px] ${theme.muted}`}>{vid.channelName}</div>
                      <div className={`text-[11px] font-semibold ${theme.accentText}`}>
                        Open Video Study Card →
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Click-to-Hear Tip */}
            <div className={`rounded-2xl border p-4 space-y-2 ${theme.cardBg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.heading}`}>
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Study Tip</span>
              </div>
              <p className={`text-xs leading-relaxed ${theme.text}`}>
                Click any Cyrillic word inside Example Sentences, Dialogues, or Reading Passages to
                pronounce it aloud and view its meaning.
              </p>
              <div className={`text-[11px] font-semibold ${theme.muted}`}>
                <BookOpen className="inline h-3 w-3 mr-1" />
                Saved Vocab: {progress.savedVocabIds.length} cards
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
