import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  Unlock,
} from 'lucide-react';
import {
  CefrLevelId,
  SchoolCourse,
  SchoolLesson,
  SchoolTabId,
  StudentProgressRecord,
} from '../../types/school';
import {
  COURSE_LEVELS,
  CURRICULUM_MODULES,
  TRKI_CORRESPONDENCE_TABLE,
} from '../../data/school/curriculumData';
import { AlphabetAcademyView } from './AlphabetAcademyView';
import { SchoolThemeTokens } from './schoolTheme';

interface CurriculumViewProps {
  theme: SchoolThemeTokens;
  selectedLevel: CefrLevelId;
  onSelectLevel: (levelId: CefrLevelId) => void;
  courses: SchoolCourse[];
  lessons: SchoolLesson[];
  progress: StudentProgressRecord;
  a0Mastered: boolean;
  onCompleteAlphabetCheck: (score: number, total: number) => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: SchoolTabId) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  theme,
  selectedLevel,
  onSelectLevel,
  courses,
  lessons,
  progress,
  a0Mastered,
  onCompleteAlphabetCheck,
  onOpenLesson,
  onNavigateTab,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod-a0-u1');
  const [unlockPreviewA1Plus, setUnlockPreviewA1Plus] = useState<boolean>(false);

  const activeLevelObj = COURSE_LEVELS.find((l) => l.id === selectedLevel) || COURSE_LEVELS[0];
  const levelModules = CURRICULUM_MODULES.filter((m) => m.levelId === selectedLevel);
  const isLockedA1Plus =
    selectedLevel !== 'pre-a1' && !a0Mastered && !unlockPreviewA1Plus && progress.completedLessonIds.length === 0;

  return (
    <div className="space-y-8">
      {/* Progression Map Header */}
      <div className={`rounded-2xl border p-6 space-y-5 ${theme.cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Course Progression Map · A0 → B2 + C1–C2 Reading
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Russian Curriculum & Alphabet Academy
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-3xl ${theme.text}`}>
              Every module lists clear learning outcomes. Interactive digital classroom lessons open
              immediately; upcoming syllabus modules appear transparently as scheduled academic
              outlines expandable by faculty.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('assessments')}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
          >
            Take Placement Test (Skip A0)
          </button>
        </div>

        {/* Courses Overview Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {courses.map((course) => (
            <div key={course.id} className={`rounded-xl border p-4 space-y-1 ${theme.subCardBg}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-bold ${theme.accentText}`}>{course.levelRange}</span>
                <span className={`text-[11px] ${theme.muted}`}>Lead: {course.instructor}</span>
              </div>
              <div className={`font-cinzel text-sm font-bold ${theme.heading}`}>{course.title}</div>
              <div className={`font-cyrillic text-xs ${theme.muted}`}>{course.titleRu}</div>
              <p className={`text-xs pt-1 ${theme.text}`}>{course.description}</p>
            </div>
          ))}
        </div>

        {/* Level Step Selector */}
        <div className="flex flex-wrap gap-2 pt-1">
          {COURSE_LEVELS.map((lvl) => {
            const active = lvl.id === selectedLevel;
            const publishedInLevel = lessons.filter(
              (ls) => ls.levelId === lvl.id && ls.status === 'published'
            ).length;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  onSelectLevel(lvl.id);
                  const firstMod = CURRICULUM_MODULES.find((m) => m.levelId === lvl.id);
                  if (firstMod) setExpandedModuleId(firstMod.id);
                }}
                className={`rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  active ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                <div className="text-xs font-bold">{lvl.code}</div>
                <div className={`text-[10px] ${active ? 'text-slate-200' : theme.muted}`}>
                  {lvl.moduleIds.length > 0
                    ? `${publishedInLevel} live lessons · ${lvl.moduleIds.length} modules`
                    : 'Reading Track'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Description & Objectives Card */}
      <div className={`rounded-2xl border p-6 space-y-5 ${theme.cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${theme.accentBgSoft}`}>
                {activeLevelObj.code}
              </span>
              <span className={`text-xs font-medium ${theme.muted}`}>
                TRKI Alignment: {activeLevelObj.trkiEquivalent}
              </span>
            </div>
            <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>
              {activeLevelObj.title}
            </h3>
            <p className={`font-cyrillic text-sm ${theme.muted}`}>{activeLevelObj.titleRu}</p>
            <p className={`text-sm leading-relaxed ${theme.text}`}>{activeLevelObj.description}</p>
            <p className={`text-xs italic ${theme.muted}`}>{activeLevelObj.trkiNote}</p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div className={`rounded-xl border p-4 space-y-1.5 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Key CEFR Can-Do Outcomes
              </div>
              <div className={`text-xs space-y-1 ${theme.text}`}>
                <p><strong>Speaking:</strong> {activeLevelObj.outcomes.speaking}</p>
                <p><strong>Reading:</strong> {activeLevelObj.outcomes.reading}</p>
                <p><strong>Writing:</strong> {activeLevelObj.outcomes.writing}</p>
              </div>
            </div>
            <div className={`rounded-xl border p-3.5 text-xs ${theme.subCardBg}`}>
              <span className={`font-bold ${theme.heading}`}>Entry Prerequisite: </span>
              <span className={theme.text}>{activeLevelObj.entryRequirements}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Soft A0 Lock Banner for A1+ if A0 hasn't been mastered yet */}
      {isLockedA1Plus && (
        <div className={`rounded-2xl border border-amber-500/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.subCardBg}`}>
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className={`text-sm font-bold ${theme.heading}`}>
                A0 Alphabet Checkpoint Recommended Before Advancing
              </div>
              <p className={`text-xs ${theme.text}`}>
                Master the Level 0 Alphabet Quiz (≥75%) or complete the Diagnostic Placement Test to
                unlock structured A1–B2 progression — or click Preview Anyway to inspect all lessons immediately.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectLevel('pre-a1')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
            >
              Open A0 Alphabet
            </button>
            <button
              type="button"
              onClick={() => setUnlockPreviewA1Plus(true)}
              className={`inline-flex items-center gap-1 rounded-lg border px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Preview Anyway</span>
            </button>
          </div>
        </div>
      )}

      {/* EMBEDDED FULL ALPHABET ACADEMY WHEN LEVEL 0 SELECTED */}
      {selectedLevel === 'pre-a1' && (
        <AlphabetAcademyView
          theme={theme}
          a0Mastered={a0Mastered}
          onCompleteAlphabetCheck={onCompleteAlphabetCheck}
          onOpenLesson={onOpenLesson}
        />
      )}

      {/* MODULES & SYLLABUS ACCORDION */}
      {levelModules.length > 0 && (
        <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={`font-cinzel text-xl font-bold ${theme.heading}`}>
              Syllabus Modules for {activeLevelObj.code}
            </h3>
            <span className={`text-xs font-semibold tabular-nums ${theme.muted}`}>
              {levelModules.length} total modules
            </span>
          </div>

          <div className="space-y-2.5">
            {levelModules.map((mod) => {
              const isExpanded = expandedModuleId === mod.id;
              const matchingLessons = lessons.filter(
                (ls) => mod.lessonIds.includes(ls.id) || ls.moduleId === mod.id
              );

              return (
                <div key={mod.id} className={`rounded-xl border ${theme.subCardBg}`}>
                  <button
                    type="button"
                    onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                    className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-bold ${theme.heading}`}>{mod.title}</span>
                        {matchingLessons.length > 0 ? (
                          <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            {matchingLessons.length} Live Lesson{matchingLessons.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className={`rounded border px-2 py-0.5 text-[10px] font-medium ${theme.border} ${theme.muted}`}>
                            Syllabus Outline
                          </span>
                        )}
                      </div>
                      <p className={`font-cyrillic text-xs ${theme.muted}`}>{mod.titleRu}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className={`h-4 w-4 shrink-0 ${theme.muted}`} />
                    ) : (
                      <ChevronDown className={`h-4 w-4 shrink-0 ${theme.muted}`} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className={`border-t p-4 space-y-4 ${theme.border}`}>
                      <p className={`text-xs sm:text-sm ${theme.text}`}>{mod.summary}</p>

                      {mod.learningOutcomes.length > 0 && (
                        <div className="space-y-1">
                          <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                            Module Outcomes
                          </div>
                          <ul className="space-y-1">
                            {mod.learningOutcomes.map((o, i) => (
                              <li key={i} className={`text-xs flex items-start gap-2 ${theme.text}`}>
                                <Sparkles className={`h-3 w-3 shrink-0 mt-0.5 ${theme.accentText}`} />
                                <span>{o}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {matchingLessons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {matchingLessons.map((ls) => {
                            const done = progress.completedLessonIds.includes(ls.id);
                            return (
                              <button
                                key={ls.id}
                                type="button"
                                onClick={() => onOpenLesson(ls.id)}
                                className={`rounded-xl border p-3.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${theme.cardBg} hover:border-amber-500`}
                              >
                                <div className="min-w-0">
                                  <div className={`text-xs font-bold truncate ${theme.heading}`}>
                                    {ls.title}
                                  </div>
                                  <div className={`font-cyrillic text-[11px] truncate ${theme.muted}`}>
                                    {ls.titleRu} · {ls.estimatedMinutes} min
                                  </div>
                                </div>
                                {done ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                ) : (
                                  <PlayCircle className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`rounded-lg border p-3 text-xs flex items-center justify-between gap-3 ${theme.cardBg}`}>
                          <span className={theme.muted}>
                            Syllabus Outline — Scheduled Expansion. Faculty members can publish full interactive lessons for this module inside the Teacher Panel.
                          </span>
                          {mod.assessmentId && (
                            <button
                              type="button"
                              onClick={() => onNavigateTab('assessments')}
                              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                            >
                              Take Module Exam
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* C1–C2 Note */}
      {(selectedLevel === 'c1' || selectedLevel === 'c2') && (
        <div className={`rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.cardBg}`}>
          <div className="space-y-1">
            <h4 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
              {activeLevelObj.code} Authentic Literary & Scholarly Reading Track
            </h4>
            <p className={`text-xs sm:text-sm ${theme.text}`}>
              Advanced C1 and C2 study is anchored in unadapted Pushkin, Tolstoy, and Turgenev texts
              inside our Reading Library, complete with idiomatic glossaries, Russian/Hindi/English
              parallels, and stylistics checks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('reading')}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shrink-0 cursor-pointer ${theme.primaryBtn}`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Open C1–C2 Readings</span>
          </button>
        </div>
      )}

      {/* Full TRKI Table at bottom */}
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex items-start gap-2.5">
          <ShieldAlert className={`h-5 w-5 shrink-0 mt-0.5 ${theme.accentText}`} />
          <p className={`text-xs leading-relaxed ${theme.text}`}>
            <strong>Certification Disclaimer:</strong> While our academic roadmap prepares students
            for CEFR and TORFL/TRKI benchmarks, completing this online course awards an institutional{' '}
            <em>Soul of Russia and India</em> School Completion Certificate and does not constitute an
            official Russian state TRKI/TORFL diploma.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-inherit">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={theme.tableHeader}>
                <th className="p-2.5 font-semibold">CEFR</th>
                <th className="p-2.5 font-semibold">TORFL / ТРКИ</th>
                <th className="p-2.5 font-semibold">Hours</th>
                <th className="p-2.5 font-semibold">Key Benchmarks</th>
              </tr>
            </thead>
            <tbody>
              {TRKI_CORRESPONDENCE_TABLE.map((row) => (
                <tr key={row.cefr} className={`border-t ${theme.tableRow}`}>
                  <td className={`p-2.5 font-bold ${theme.heading}`}>{row.cefr}</td>
                  <td className={`p-2.5 ${theme.text}`}>{row.trki}</td>
                  <td className={`p-2.5 tabular-nums ${theme.muted}`}>{row.hours}</td>
                  <td className={`p-2.5 ${theme.text}`}>{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
