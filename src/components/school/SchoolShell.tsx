import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Compass,
  Globe,
  GraduationCap,
  Home,
  Layers,
  LogIn,
  LogOut,
  Moon,
  Plane,
  Shield,
  Sun,
  Target,
  UserCheck,
  Volume2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Language } from '../../types';
import {
  AnnouncementRecord,
  AssessmentQuiz,
  BookmarkRecord,
  CefrLevelId,
  CertificateRecord,
  LessonVocabularyItem,
  QuizAttemptRecord,
  ReadingMaterial,
  SchoolCourse,
  SchoolLesson,
  SchoolTabId,
  SchoolUserProfile,
  SrsVocabRecord,
  StudentProgressRecord,
  UserRole,
  VideoReference,
  WritingSubmissionRecord,
} from '../../types/school';
import {
  DEFAULT_SCHOOL_COURSES,
  INITIAL_SCHOOL_ANNOUNCEMENTS,
} from '../../data/school/curriculumData';
import {
  ALL_BUNDLED_LESSONS,
  ASSESSMENT_QUIZZES,
  CURATED_VIDEO_REFERENCES,
  EXTRA_VOCABULARY_BANK,
} from '../../data/school/labsAndCoursesData';
import { READING_LIBRARY_ITEMS } from '../../data/school/readingLibraryData';
import {
  DEFAULT_STUDENT_PROGRESS,
  fetchBookmarks,
  fetchCertificates,
  fetchQuizAttempts,
  fetchStudentProgress,
  fetchWritingSubmissions,
  loadAllSchoolDynamicContent,
  recordQuizAttempt,
  saveStudentProgress,
  signInSchoolWithGoogle,
  signOutSchool,
  subscribeSchoolAuth,
  toggleBookmarkItem,
} from '../../utils/schoolFirebaseService';
import { getSchoolTheme } from './schoolTheme';
import { SchoolHomeView } from './SchoolHomeView';
import { CurriculumView } from './CurriculumView';
import { LessonReaderView } from './LessonReaderView';
import { ReadingLibraryView } from './ReadingLibraryView';
import { VocabularyLabView } from './VocabularyLabView';
import { GrammarLabView } from './GrammarLabView';
import { LifeInRussiaView } from './LifeInRussiaView';
import { CultureBridgeView } from './CultureBridgeView';
import { AssessmentsView } from './AssessmentsView';
import { StudentDashboardView } from './StudentDashboardView';
import { TeacherAdminPanelView } from './TeacherAdminPanelView';
import { EnrolmentView } from './EnrolmentView';
import { VideoLessonModal } from './VideoLessonModal';

interface SchoolShellProps {
  currentLang: Language;
}

function parseSchoolSubHash(): { tab: SchoolTabId; lessonId?: string; level?: CefrLevelId } {
  if (typeof window === 'undefined') return { tab: 'home' };
  const raw = window.location.hash.replace(/^#/, '').trim();
  const parts = raw.split('/').filter(Boolean);
  if (parts[0] !== 'language') return { tab: 'home' };

  const seg = parts[1] as SchoolTabId | 'alphabet' | undefined;
  if (!seg) return { tab: 'home' };
  if (seg === 'alphabet') return { tab: 'curriculum', level: 'pre-a1' };
  if (seg === 'lesson' && parts[2]) return { tab: 'lesson', lessonId: parts[2] };

  const validTabs: SchoolTabId[] = [
    'home',
    'curriculum',
    'lesson',
    'reading',
    'vocabulary',
    'grammar',
    'life-in-russia',
    'culture',
    'assessments',
    'dashboard',
    'teacher',
    'enrol',
  ];
  return validTabs.includes(seg as SchoolTabId) ? { tab: seg as SchoolTabId } : { tab: 'home' };
}

export const SchoolShell: React.FC<SchoolShellProps> = ({ currentLang }) => {
  const initialRoute = parseSchoolSubHash();
  const [activeTab, setActiveTab] = useState<SchoolTabId>(initialRoute.tab);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialRoute.lessonId || 'lesson-a0-1'
  );
  const [selectedLevel, setSelectedLevel] = useState<CefrLevelId>(
    initialRoute.level || 'pre-a1'
  );
  const [isDark, setIsDark] = useState<boolean>(false);

  // Firebase Auth & Student State
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [profile, setProfile] = useState<SchoolUserProfile | null>(null);
  const [authNotice, setAuthNotice] = useState<string>('');

  const [progress, setProgress] = useState<StudentProgressRecord>(DEFAULT_STUDENT_PROGRESS);
  const [attempts, setAttempts] = useState<QuizAttemptRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [writingSubmissions, setWritingSubmissions] = useState<WritingSubmissionRecord[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  // Dynamic CMS collections overlaid onto bundled data
  const [dynamicLessons, setDynamicLessons] = useState<SchoolLesson[]>([]);
  const [dynamicVocab, setDynamicVocab] = useState<LessonVocabularyItem[]>([]);
  const [dynamicReadings, setDynamicReadings] = useState<ReadingMaterial[]>([]);
  const [dynamicQuizzes, setDynamicQuizzes] = useState<AssessmentQuiz[]>([]);
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [dynamicVideos, setDynamicVideos] = useState<VideoReference[]>([]);
  const [dynamicCourses, setDynamicCourses] = useState<SchoolCourse[]>([]);

  // Active Video Modal
  const [activeVideo, setActiveVideo] = useState<VideoReference | null>(null);

  const theme = useMemo(() => getSchoolTheme(isDark), [isDark]);

  // Listen to auth state changes
  useEffect(() => {
    const unsub = subscribeSchoolAuth((state) => {
      setUser(state.user);
      setRole(state.role);
      setProfile(state.profile);
    });
    return () => unsub();
  }, []);

  // Load Student data whenever auth changes
  const refreshUserStudyData = useCallback(async (currentUser: User | null) => {
    const [prog, quizAtts, bms] = await Promise.all([
      fetchStudentProgress(currentUser),
      fetchQuizAttempts(currentUser),
      fetchBookmarks(currentUser),
    ]);
    setProgress(prog);
    setAttempts(quizAtts);
    setBookmarks(bms);

    if (currentUser && currentUser.emailVerified) {
      const [subs, certs] = await Promise.all([
        fetchWritingSubmissions(currentUser, false),
        fetchCertificates(currentUser, false),
      ]);
      setWritingSubmissions(subs);
      setCertificates(certs);
    } else {
      setWritingSubmissions([]);
      setCertificates([]);
    }
  }, []);

  useEffect(() => {
    void refreshUserStudyData(user);
  }, [user, refreshUserStudyData]);

  // Load Faculty CMS overlays from Firestore
  const refreshDynamicContent = useCallback(async () => {
    const dyn = await loadAllSchoolDynamicContent(false);
    setDynamicLessons(dyn.lessons);
    setDynamicVocab(dyn.vocabulary);
    setDynamicReadings(dyn.readings);
    setDynamicQuizzes(dyn.quizzes);
    setDynamicAnnouncements(dyn.announcements);
    setDynamicVideos(dyn.videos);
    setDynamicCourses(dyn.courses);
  }, []);

  useEffect(() => {
    void refreshDynamicContent();
  }, [refreshDynamicContent]);

  // Listen for browser hash changes within #language/...
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseSchoolSubHash();
      if (window.location.hash.startsWith('#language')) {
        setActiveTab(parsed.tab);
        if (parsed.lessonId) setActiveLessonId(parsed.lessonId);
        if (parsed.level) setSelectedLevel(parsed.level);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTab = (
    tab: SchoolTabId,
    opts?: { lessonId?: string; levelId?: CefrLevelId }
  ) => {
    setActiveTab(tab);
    if (opts?.lessonId) setActiveLessonId(opts.lessonId);
    if (opts?.levelId) setSelectedLevel(opts.levelId);

    const nextHash =
      tab === 'home'
        ? '#language'
        : tab === 'lesson' && (opts?.lessonId || activeLessonId)
        ? `#language/lesson/${opts?.lessonId || activeLessonId}`
        : `#language/${tab}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Merge bundled + Firestore dynamic records
  const mergedLessons = useMemo(
    () => [...ALL_BUNDLED_LESSONS, ...dynamicLessons],
    [dynamicLessons]
  );

  const mergedVocabBank = useMemo(() => {
    const map = new Map<string, LessonVocabularyItem>();
    mergedLessons.forEach((ls) =>
      ls.vocabulary.forEach((v) => {
        if (!map.has(v.id)) map.set(v.id, v);
      })
    );
    [...EXTRA_VOCABULARY_BANK, ...dynamicVocab].forEach((v) => {
      if (!map.has(v.id)) map.set(v.id, v);
    });
    return Array.from(map.values());
  }, [mergedLessons, dynamicVocab]);

  const mergedReadings = useMemo(
    () => [...READING_LIBRARY_ITEMS, ...dynamicReadings],
    [dynamicReadings]
  );

  const mergedQuizzes = useMemo(
    () => [...ASSESSMENT_QUIZZES, ...dynamicQuizzes],
    [dynamicQuizzes]
  );

  const mergedAnnouncements = useMemo(
    () =>
      dynamicAnnouncements.length > 0
        ? [...dynamicAnnouncements, ...INITIAL_SCHOOL_ANNOUNCEMENTS]
        : INITIAL_SCHOOL_ANNOUNCEMENTS,
    [dynamicAnnouncements]
  );

  const mergedVideos = useMemo(
    () => [...dynamicVideos, ...CURATED_VIDEO_REFERENCES],
    [dynamicVideos]
  );

  const mergedCourses = useMemo(
    () => [...DEFAULT_SCHOOL_COURSES, ...dynamicCourses],
    [dynamicCourses]
  );

  // Check if Level 0 A0 has been passed via Alphabet Check or Placement >= A1
  const a0Mastered = useMemo(() => {
    const levelIndex = ['pre-a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'].indexOf(
      progress.currentLevel
    );
    if (levelIndex >= 1) return true;
    return attempts.some(
      (a) =>
        (a.quizId === 'quiz-a0-alphabet' && a.passed) ||
        (a.quizId === 'quiz-placement' && a.recommendedLevel && a.recommendedLevel !== 'pre-a1')
    );
  }, [progress.currentLevel, attempts]);

  // Auth Handlers
  const handleSignIn = async () => {
    setAuthNotice('');
    const res = await signInSchoolWithGoogle();
    if (res.error) setAuthNotice(res.error);
  };

  const handleSignOut = async () => {
    await signOutSchool();
  };

  // Progress Actions
  const handleMarkLessonComplete = async (lessonId: string) => {
    const completed = progress.completedLessonIds.includes(lessonId)
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, lessonId];
    const saved = await saveStudentProgress(user, {
      ...progress,
      completedLessonIds: completed,
      lastLessonId: lessonId,
    });
    setProgress(saved);
  };

  const handleSelectLesson = async (lessonId: string) => {
    setActiveLessonId(lessonId);
    navigateTab('lesson', { lessonId });
    const saved = await saveStudentProgress(user, {
      ...progress,
      lastLessonId: lessonId,
    });
    setProgress(saved);
  };

  const handleToggleSaveVocab = async (wordId: string) => {
    const exists = progress.savedVocabIds.includes(wordId);
    const updated = exists
      ? progress.savedVocabIds.filter((id) => id !== wordId)
      : [...progress.savedVocabIds, wordId];
    const saved = await saveStudentProgress(user, {
      ...progress,
      savedVocabIds: updated,
    });
    setProgress(saved);
  };

  const handleUpdateSrsRecord = async (record: SrsVocabRecord) => {
    const saved = await saveStudentProgress(user, {
      ...progress,
      srsRecords: {
        ...(progress.srsRecords || {}),
        [record.wordId]: record,
      },
    });
    setProgress(saved);
  };

  const handleToggleBookmark = async (item: {
    itemId: string;
    itemType: 'lesson' | 'reading';
    title: string;
    levelId: CefrLevelId;
  }) => {
    const updated = await toggleBookmarkItem(user, bookmarks, item);
    setBookmarks(updated);
  };

  const handleRecordAttempt = async (
    quiz: AssessmentQuiz,
    score: number,
    total: number,
    recommendedLevel?: CefrLevelId
  ) => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= quiz.passingScorePct;
    const rec = await recordQuizAttempt(user, {
      quizId: quiz.id,
      quizTitle: quiz.title,
      levelId: quiz.levelId,
      score,
      totalQuestions: total,
      percentage,
      passed,
      recommendedLevel,
    });
    setAttempts((prev) => [rec, ...prev]);
  };

  const handleCompleteAlphabetCheck = async (score: number, total: number) => {
    const quizObj = ASSESSMENT_QUIZZES.find((q) => q.id === 'quiz-a0-alphabet')!;
    await handleRecordAttempt(quizObj, score, total);
    if (total > 0 && score / total >= 0.75 && progress.currentLevel === 'pre-a1') {
      const saved = await saveStudentProgress(user, { ...progress, currentLevel: 'a1' });
      setProgress(saved);
    }
  };

  const handleApplyRecommendedLevel = async (lvl: CefrLevelId) => {
    const saved = await saveStudentProgress(user, { ...progress, currentLevel: lvl });
    setProgress(saved);
    navigateTab('curriculum', { levelId: lvl });
  };

  const navItems: { id: SchoolTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'School Home', icon: Home },
    { id: 'curriculum', label: 'A0–B2 & Alphabet', icon: Layers },
    { id: 'lesson', label: 'Classroom', icon: BookOpen },
    { id: 'reading', label: 'Reading Library', icon: Compass },
    { id: 'vocabulary', label: 'Vocab Lab & Quiz', icon: Volume2 },
    { id: 'grammar', label: 'Grammar Lab', icon: GraduationCap },
    { id: 'life-in-russia', label: 'Life in Russia', icon: Plane },
    { id: 'culture', label: 'Culture Bridge', icon: Globe },
    { id: 'assessments', label: 'Tests & Placement', icon: Target },
    { id: 'dashboard', label: 'Dashboard', icon: Award },
    { id: 'enrol', label: 'Enrol', icon: UserCheck },
    ...(role === 'teacher' || role === 'admin'
      ? [{ id: 'teacher' as const, label: 'Faculty Panel', icon: Shield }]
      : []),
  ];

  return (
    <div className={`w-full min-h-screen transition-colors ${theme.pageBg}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* SCHOOL SUB-NAVIGATION HEADER */}
        <header className={`no-print rounded-2xl border p-4 space-y-3 shadow-sm ${theme.cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c1b33] text-amber-300 font-cinzel font-bold text-lg shrink-0">
                Я
              </div>
              <div>
                <div className={`font-cinzel text-sm sm:text-base font-bold ${theme.heading}`}>
                  School of Foreign Languages – Russian
                </div>
                <div className={`font-cyrillic text-[11px] ${theme.muted}`}>
                  Школа иностранных языков · Soul of Russia and India · Teacher: Sarika Kumari
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDark((d) => !d)}
                aria-label="Toggle school light or dark reading theme"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.secondaryBtn}`}
              >
                {isDark ? <Sun className="h-3.5 w-3.5 text-amber-300" /> : <Moon className="h-3.5 w-3.5" />}
                <span>{isDark ? 'Day Theme' : 'Night Study'}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTab('dashboard')}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${theme.accentBgSoft}`}
                  >
                    {user.displayName?.split(' ')[0] || 'Account'} ({role})
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    title="Sign out"
                    className={`rounded-lg border p-1.5 cursor-pointer ${theme.secondaryBtn}`}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Google Sign In</span>
                </button>
              )}
            </div>
          </div>

          {authNotice && (
            <div className="text-xs font-medium text-amber-600">{authNotice}</div>
          )}

          {/* Horizontal Tab Bar */}
          <nav aria-label="Russian School Sections" className="flex flex-wrap gap-1.5 border-t pt-3 border-inherit">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active ? theme.primaryBtn : theme.secondaryBtn
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* ACTIVE SUB-VIEW */}
        <main className="w-full">
          {activeTab === 'home' && (
            <SchoolHomeView
              theme={theme}
              progress={progress}
              announcements={mergedAnnouncements}
              featuredLessons={mergedLessons}
              onNavigateTab={navigateTab}
            />
          )}

          {activeTab === 'curriculum' && (
            <CurriculumView
              theme={theme}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              courses={mergedCourses}
              lessons={mergedLessons}
              progress={progress}
              a0Mastered={a0Mastered}
              onCompleteAlphabetCheck={handleCompleteAlphabetCheck}
              onOpenLesson={handleSelectLesson}
              onNavigateTab={navigateTab}
            />
          )}

          {activeTab === 'lesson' && (
            <LessonReaderView
              theme={theme}
              user={user}
              lessons={mergedLessons}
              activeLessonId={activeLessonId}
              allVocabBank={mergedVocabBank}
              videoReferences={mergedVideos}
              progress={progress}
              bookmarks={bookmarks}
              onSelectLesson={handleSelectLesson}
              onToggleSaveVocab={handleToggleSaveVocab}
              onToggleBookmark={(item) => handleToggleBookmark(item)}
              onMarkLessonComplete={handleMarkLessonComplete}
              onOpenVideo={setActiveVideo}
              onSignInRequest={handleSignIn}
            />
          )}

          {activeTab === 'reading' && (
            <ReadingLibraryView
              theme={theme}
              readings={mergedReadings}
              bookmarks={bookmarks}
              onToggleBookmark={(item) => handleToggleBookmark(item)}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyLabView
              theme={theme}
              currentLang={currentLang}
              vocabBank={mergedVocabBank}
              progress={progress}
              onToggleSaveVocab={handleToggleSaveVocab}
              onUpdateSrsRecord={handleUpdateSrsRecord}
            />
          )}

          {activeTab === 'grammar' && <GrammarLabView theme={theme} />}

          {activeTab === 'life-in-russia' && <LifeInRussiaView theme={theme} />}

          {activeTab === 'culture' && <CultureBridgeView theme={theme} />}

          {activeTab === 'assessments' && (
            <AssessmentsView
              theme={theme}
              quizzes={mergedQuizzes}
              attempts={attempts}
              onRecordAttempt={handleRecordAttempt}
              onApplyRecommendedLevel={handleApplyRecommendedLevel}
            />
          )}

          {activeTab === 'dashboard' && (
            <StudentDashboardView
              theme={theme}
              user={user}
              profile={profile}
              progress={progress}
              lessons={mergedLessons}
              attempts={attempts}
              bookmarks={bookmarks}
              writingSubmissions={writingSubmissions}
              certificates={certificates}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              onOpenLesson={handleSelectLesson}
              onNavigateTab={navigateTab}
            />
          )}

          {activeTab === 'enrol' && (
            <EnrolmentView theme={theme} user={user} onSignIn={handleSignIn} />
          )}

          {activeTab === 'teacher' && (
            <TeacherAdminPanelView
              theme={theme}
              user={user}
              role={role}
              dynamicLessons={dynamicLessons}
              dynamicVideos={dynamicVideos}
              dynamicAnnouncements={dynamicAnnouncements}
              onContentChanged={refreshDynamicContent}
              onSignIn={handleSignIn}
            />
          )}
        </main>
      </div>

      {/* Video Study Modal */}
      <VideoLessonModal
        video={activeVideo}
        theme={theme}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};
