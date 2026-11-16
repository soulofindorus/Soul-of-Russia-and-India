import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import {
  AssessmentQuiz,
  CefrLevelId,
  QuizAttemptRecord,
} from '../../types/school';
import { SchoolThemeTokens } from './schoolTheme';

interface AssessmentsViewProps {
  theme: SchoolThemeTokens;
  quizzes: AssessmentQuiz[];
  attempts: QuizAttemptRecord[];
  onRecordAttempt: (
    quiz: AssessmentQuiz,
    score: number,
    total: number,
    recommendedLevel?: CefrLevelId
  ) => Promise<void>;
  onApplyRecommendedLevel: (level: CefrLevelId) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  theme,
  quizzes,
  attempts,
  onRecordAttempt,
  onApplyRecommendedLevel,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || 'quiz-placement');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{
    score: number;
    total: number;
    pct: number;
    passed: boolean;
    recommended?: CefrLevelId;
  } | null>(null);

  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  const computeRecommendedLevel = (quiz: AssessmentQuiz, ansMap: Record<string, string>): CefrLevelId => {
    const order: CefrLevelId[] = ['pre-a1', 'a1', 'a2', 'b1', 'b2'];
    let highest = 0; // pre-a1 default
    for (let i = 0; i < order.length; i++) {
      const lvl = order[i];
      const qs = quiz.questions.filter((q) => q.targetLevel === lvl);
      if (qs.length === 0) continue;
      const correctInLvl = qs.filter((q) => ansMap[q.id] === q.correctAnswer).length;
      if (correctInLvl / qs.length >= 0.5) {
        highest = Math.min(order.length - 1, i + 1);
      } else {
        break;
      }
    }
    return order[highest];
  };

  const handleSubmit = async () => {
    if (!activeQuiz) return;
    const total = activeQuiz.questions.length;
    const score = activeQuiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= activeQuiz.passingScorePct;
    const recommended =
      activeQuiz.kind === 'placement' ? computeRecommendedLevel(activeQuiz, answers) : undefined;

    setSubmitted(true);
    setLastResult({ score, total, pct, passed, recommended });
    await onRecordAttempt(activeQuiz, score, total, recommended);
  };

  const resetQuiz = (id?: string) => {
    if (id) setSelectedQuizId(id);
    setAnswers({});
    setSubmitted(false);
    setLastResult(null);
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Target className={`h-4 w-4 ${theme.accentText}`} />
          <span className={theme.accentText}>CEFR Diagnostic & Level Mastery · Контроль</span>
        </div>
        <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
          Placement Test & Level Assessments
        </h2>
        <p className={`text-xs sm:text-sm max-w-3xl ${theme.text}`}>
          Use the Diagnostic Placement Test to find your recommended CEFR entry level (Pre-A1 to
          B2), or complete official School Mastery Checks at the end of any level.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quiz List */}
        <div className="lg:col-span-4 space-y-2.5">
          {quizzes.map((qz) => {
            const active = qz.id === activeQuiz?.id;
            const pastBest = attempts
              .filter((a) => a.quizId === qz.id)
              .sort((a, b) => b.percentage - a.percentage)[0];
            return (
              <button
                key={qz.id}
                type="button"
                onClick={() => resetQuiz(qz.id)}
                className={`w-full rounded-xl border p-4 text-left space-y-1 transition-colors cursor-pointer ${
                  active ? theme.primaryBtn : theme.cardBg
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase">
                  <span className={active ? 'text-amber-300' : theme.accentText}>
                    {qz.kind === 'placement' ? 'Placement' : `${(qz.levelId || 'A0').toUpperCase()} Exam`}
                  </span>
                  {pastBest && (
                    <span className={active ? 'text-emerald-300' : 'text-emerald-600'}>
                      Best: {pastBest.percentage}%
                    </span>
                  )}
                </div>
                <div className="font-cinzel text-sm font-bold leading-snug">{qz.title}</div>
                <div className={`font-cyrillic text-xs ${active ? 'text-slate-200' : theme.muted}`}>
                  {qz.titleRu}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Exam Workspace */}
        {activeQuiz && (
          <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 space-y-6 ${theme.cardBg}`}>
            <div className="border-b pb-4 border-inherit flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>
                  {activeQuiz.title}
                </h3>
                <p className={`font-cyrillic text-sm ${theme.muted}`}>{activeQuiz.titleRu}</p>
                <p className={`text-xs sm:text-sm pt-1 ${theme.text}`}>{activeQuiz.description}</p>
                <div className={`text-xs font-semibold ${theme.muted}`}>
                  {activeQuiz.questions.length} questions · Pass threshold: {activeQuiz.passingScorePct}%
                </div>
              </div>

              {submitted && (
                <button
                  type="button"
                  onClick={() => resetQuiz()}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold shrink-0 cursor-pointer ${theme.secondaryBtn}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake</span>
                </button>
              )}
            </div>

            {submitted && lastResult && (
              <div
                className={`rounded-xl border p-5 space-y-3 ${
                  lastResult.passed
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-amber-500/40 bg-amber-500/10'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${lastResult.passed ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                      Score: {lastResult.score}/{lastResult.total} ({lastResult.pct}%)
                    </span>
                  </div>
                  <span className={`text-xs font-bold uppercase ${lastResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {lastResult.passed ? 'Passed Benchmark' : 'Keep Practicing'}
                  </span>
                </div>

                {lastResult.recommended && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className={`text-xs sm:text-sm font-semibold ${theme.heading}`}>
                      Recommended Entry Level:{' '}
                      <span className={theme.accentText}>
                        {lastResult.recommended.toUpperCase()}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => onApplyRecommendedLevel(lastResult.recommended!)}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                    >
                      Open {lastResult.recommended.toUpperCase()} Curriculum →
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => {
                const chosen = answers[q.id] || '';
                const ok = chosen === q.correctAnswer;
                return (
                  <div key={q.id} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold uppercase ${theme.accentText}`}>
                        Question {idx + 1}
                      </span>
                      {q.targetLevel && (
                        <span className={`text-[10px] font-semibold uppercase ${theme.muted}`}>
                          Target: {q.targetLevel}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-bold ${theme.heading}`}>{q.prompt}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options || []).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          disabled={submitted}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                          className={`rounded-lg border px-3.5 py-2.5 text-left text-xs sm:text-sm cursor-pointer ${
                            submitted
                              ? opt === q.correctAnswer
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
                    {submitted && (
                      <div className="flex items-start gap-2 text-xs">
                        {ok ? (
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

            {!submitted && (
              <button
                type="button"
                disabled={Object.keys(answers).length < activeQuiz.questions.length}
                onClick={handleSubmit}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-45 ${theme.primaryBtn}`}
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>
                  Submit Assessment ({Object.keys(answers).length}/{activeQuiz.questions.length})
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
