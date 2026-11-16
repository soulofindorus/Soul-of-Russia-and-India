import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  FileText,
  Flame,
  LogIn,
  LogOut,
  PlayCircle,
  Printer,
  ShieldAlert,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  BookmarkRecord,
  CertificateRecord,
  QuizAttemptRecord,
  SchoolLesson,
  SchoolTabId,
  SchoolUserProfile,
  StudentProgressRecord,
  WritingSubmissionRecord,
} from '../../types/school';
import { SchoolThemeTokens } from './schoolTheme';

interface StudentDashboardViewProps {
  theme: SchoolThemeTokens;
  user: User | null;
  profile: SchoolUserProfile | null;
  progress: StudentProgressRecord;
  lessons: SchoolLesson[];
  attempts: QuizAttemptRecord[];
  bookmarks: BookmarkRecord[];
  writingSubmissions: WritingSubmissionRecord[];
  certificates: CertificateRecord[];
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: SchoolTabId) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  theme,
  user,
  profile,
  progress,
  lessons,
  attempts,
  bookmarks,
  writingSubmissions,
  certificates,
  onSignIn,
  onSignOut,
  onOpenLesson,
  onNavigateTab,
}) => {
  const [activeCert, setActiveCert] = useState<CertificateRecord | null>(null);

  const avgQuizPct =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
      : 0;

  const resumeId = progress.lastLessonId || lessons[0]?.id || 'lesson-a0-1';
  const resumeLesson = lessons.find((l) => l.id === resumeId) || lessons[0];

  return (
    <div className="space-y-6">
      {/* Top Account Card */}
      <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
            Student Portal · Личный кабинет
          </span>
          <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
            {user ? `Welcome, ${profile?.displayName || user.displayName || 'Learner'}` : 'Guest Study Workspace'}
          </h2>
          <p className={`text-xs sm:text-sm ${theme.text}`}>
            {user
              ? `Signed in as ${user.email} · Synced across devices with Firestore.`
              : 'Your progress is currently stored in this browser. Sign in with Google to sync lessons, flashcards, writing feedback, and certificates across devices.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onSignOut}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-4 space-y-1 ${theme.cardBg}`}>
          <div className={`text-xs ${theme.muted}`}>Current CEFR Track</div>
          <div className={`font-cinzel text-2xl font-bold uppercase ${theme.heading}`}>
            {progress.currentLevel === 'pre-a1' ? 'A0' : progress.currentLevel}
          </div>
          <div className={`text-[11px] ${theme.accentText}`}>Recommended / Active Level</div>
        </div>

        <div className={`rounded-2xl border p-4 space-y-1 ${theme.cardBg}`}>
          <div className={`text-xs ${theme.muted}`}>Lessons Completed</div>
          <div className={`font-cinzel text-2xl font-bold tabular-nums ${theme.heading}`}>
            {progress.completedLessonIds.length} / {lessons.length}
          </div>
          <div className={`text-[11px] ${theme.muted}`}>Verified checkpoints</div>
        </div>

        <div className={`rounded-2xl border p-4 space-y-1 ${theme.cardBg}`}>
          <div className={`text-xs ${theme.muted}`}>Study Streak & Vocab</div>
          <div className={`font-cinzel text-2xl font-bold tabular-nums flex items-center gap-2 ${theme.heading}`}>
            <Flame className="h-5 w-5 text-amber-500" />
            <span>{progress.streakDays}d</span>
          </div>
          <div className={`text-[11px] ${theme.muted}`}>
            {progress.savedVocabIds.length} saved flashcards
          </div>
        </div>

        <div className={`rounded-2xl border p-4 space-y-1 ${theme.cardBg}`}>
          <div className={`text-xs ${theme.muted}`}>Quiz Average</div>
          <div className={`font-cinzel text-2xl font-bold tabular-nums ${theme.heading}`}>
            {attempts.length > 0 ? `${avgQuizPct}%` : '—'}
          </div>
          <div className={`text-[11px] ${theme.muted}`}>
            {attempts.length} recorded attempt{attempts.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Resume Last Lesson */}
      {resumeLesson && (
        <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.cardBg}`}>
          <div className="space-y-1">
            <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
              Continue Study Session
            </div>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>{resumeLesson.title}</h3>
            <p className={`font-cyrillic text-xs ${theme.muted}`}>{resumeLesson.titleRu}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenLesson(resumeLesson.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shrink-0 cursor-pointer ${theme.primaryBtn}`}
          >
            <PlayCircle className="h-4 w-4" />
            <span>Resume Lesson</span>
          </button>
        </div>
      )}

      {/* Main Two Columns: Quiz Attempts + Bookmarks + Writing Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Writing Submissions & Feedback */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 space-y-4 ${theme.cardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className={`h-4 w-4 ${theme.accentText}`} />
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                Writing Assignments & Feedback
              </h3>
            </div>
            <span className={`text-xs tabular-nums ${theme.muted}`}>{writingSubmissions.length}</span>
          </div>

          {writingSubmissions.length === 0 ? (
            <p className={`text-xs ${theme.muted}`}>
              No writing responses submitted yet. Complete Section 9 inside any Digital Classroom lesson to submit work for Sarika Kumari’s review.
            </p>
          ) : (
            <div className="space-y-3">
              {writingSubmissions.map((sub) => (
                <div key={sub.submissionId} className={`rounded-xl border p-3.5 space-y-2 ${theme.subCardBg}`}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={`font-bold ${theme.heading}`}>{sub.lessonTitle}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        sub.status === 'reviewed'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className={`font-cyrillic text-xs ${theme.text}`}>{sub.responseText}</p>
                  {sub.teacherFeedback && (
                    <div className={`rounded-lg border p-2.5 text-xs ${theme.accentBgSoft}`}>
                      <strong>Teacher Feedback:</strong> {sub.teacherFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessment History & Bookmarks */}
        <div className="lg:col-span-6 space-y-6">
          <div className={`rounded-2xl border p-5 space-y-3 ${theme.cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                  Recent Assessment Scores
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('assessments')}
                className={`text-xs font-bold hover:underline cursor-pointer ${theme.accentText}`}
              >
                New Test →
              </button>
            </div>
            {attempts.length === 0 ? (
              <p className={`text-xs ${theme.muted}`}>No quizzes recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {attempts.slice(0, 5).map((att) => (
                  <div key={att.attemptId} className={`rounded-lg border p-3 flex items-center justify-between text-xs ${theme.subCardBg}`}>
                    <div>
                      <div className={`font-bold ${theme.heading}`}>{att.quizTitle}</div>
                      {att.recommendedLevel && (
                        <div className={theme.muted}>Recommended: {att.recommendedLevel.toUpperCase()}</div>
                      )}
                    </div>
                    <span className={`font-bold tabular-nums ${att.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {att.score}/{att.totalQuestions} ({att.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`rounded-2xl border p-5 space-y-3 ${theme.cardBg}`}>
            <div className="flex items-center gap-2">
              <Bookmark className={`h-4 w-4 ${theme.accentText}`} />
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Bookmarked Materials</h3>
            </div>
            {bookmarks.length === 0 ? (
              <p className={`text-xs ${theme.muted}`}>
                Bookmark lessons or reading texts to keep quick shortcuts here.
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bm) => (
                  <button
                    key={bm.bookmarkId}
                    type="button"
                    onClick={() =>
                      bm.itemType === 'lesson'
                        ? onOpenLesson(bm.itemId)
                        : onNavigateTab('reading')
                    }
                    className={`w-full rounded-lg border p-3 flex items-center justify-between text-left text-xs cursor-pointer ${theme.subCardBg}`}
                  >
                    <span className={`font-semibold ${theme.heading}`}>{bm.title}</span>
                    <span className={`uppercase text-[10px] font-bold ${theme.accentText}`}>
                      {bm.itemType}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authorized School Certificates */}
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className={`h-5 w-5 ${theme.accentText}`} />
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
              School Completion Certificates
            </h3>
          </div>
          <span className={`text-[11px] flex items-center gap-1 ${theme.muted}`}>
            <ShieldAlert className="h-3.5 w-3.5" />
            Issued by faculty upon course completion (Institutional Record)
          </span>
        </div>

        {certificates.length === 0 ? (
          <p className={`text-xs ${theme.text}`}>
            When authorized by faculty after level assessments, your printable{' '}
            <em>Soul of Russia and India — School of Foreign Languages</em> completion certificates
            will appear here. (Note: These are institutional school records and do not serve as
            official Russian state TRKI/TORFL certificates.)
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <div key={cert.certId} className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${theme.subCardBg}`}>
                <div>
                  <div className={`text-sm font-bold ${theme.heading}`}>{cert.levelTitle}</div>
                  <div className={`text-xs ${theme.muted}`}>
                    Code: {cert.certificateCode} · Issued by {cert.issuedBy}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  View / Print
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className={`print-lesson-sheet relative w-full max-w-2xl rounded-2xl border-2 border-amber-500/60 p-8 sm:p-10 text-center space-y-5 shadow-2xl ${theme.cardBg}`}>
            <button
              type="button"
              onClick={() => setActiveCert(null)}
              className={`no-print absolute right-4 top-4 rounded-lg border p-2 cursor-pointer ${theme.secondaryBtn}`}
            >
              <X className="h-4 w-4" />
            </button>
            <div className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.accentText}`}>
              Soul of Russia and India · Душа России и Индии
            </div>
            <h3 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
              Certificate of Course Completion
            </h3>
            <p className={`text-sm ${theme.text}`}>This certifies that</p>
            <div className={`font-cinzel text-2xl font-bold underline decoration-amber-500/60 ${theme.heading}`}>
              {activeCert.studentName}
            </div>
            <p className={`text-sm leading-relaxed ${theme.text}`}>
              has successfully completed structured Russian coursework for{' '}
              <strong>{activeCert.levelTitle}</strong> in accordance with the academic curriculum of
              the School of Foreign Languages – Russian.
            </p>
            <div className={`grid grid-cols-2 gap-4 pt-4 border-t border-inherit text-xs ${theme.muted}`}>
              <div>
                <strong>Faculty Authorization</strong>
                <div>{activeCert.issuedBy}</div>
              </div>
              <div>
                <strong>Verification Code</strong>
                <div className="font-mono">{activeCert.certificateCode}</div>
              </div>
            </div>
            <p className={`text-[10px] ${theme.muted}`}>
              Institutional educational record issued by Soul of Russia and India. Not an official
              Russian Federation state TRKI/TORFL diploma.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className={`no-print inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
