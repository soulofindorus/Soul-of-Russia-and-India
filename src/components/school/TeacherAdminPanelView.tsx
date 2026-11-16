import React, { useEffect, useState } from 'react';
import {
  Award,
  BookPlus,
  CheckCircle2,
  FileAudio,
  FileText,
  Lock,
  Megaphone,
  MessageSquare,
  PlaySquare,
  PlusCircle,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  AnnouncementRecord,
  CefrLevelId,
  EnrolmentRecord,
  LessonVocabularyItem,
  ReadingMaterial,
  SchoolCourse,
  SchoolLesson,
  UserRole,
  VideoReference,
  WritingSubmissionRecord,
} from '../../types/school';
import {
  deleteSchoolContentDoc,
  extractYouTubeVideoId,
  fetchEnrolments,
  fetchWritingSubmissions,
  grantTeacherAccess,
  issueSchoolCertificate,
  reviewWritingSubmission,
  saveSchoolContentDoc,
  updateEnrolmentStatus,
  uploadSchoolAudioToStorage,
} from '../../utils/schoolFirebaseService';
import { SchoolThemeTokens } from './schoolTheme';

interface TeacherAdminPanelViewProps {
  theme: SchoolThemeTokens;
  user: User | null;
  role: UserRole;
  dynamicLessons: SchoolLesson[];
  dynamicVideos: VideoReference[];
  dynamicAnnouncements: AnnouncementRecord[];
  onContentChanged: () => Promise<void>;
  onSignIn: () => void;
}

type FacultyTab =
  | 'lessons'
  | 'vocab'
  | 'reading'
  | 'videos'
  | 'audio'
  | 'writing'
  | 'enrolments'
  | 'announcements'
  | 'teachers';

export const TeacherAdminPanelView: React.FC<TeacherAdminPanelViewProps> = ({
  theme,
  user,
  role,
  dynamicLessons,
  dynamicVideos,
  dynamicAnnouncements,
  onContentChanged,
  onSignIn,
}) => {
  const isAuthorized = role === 'teacher' || role === 'admin';
  const [tab, setTab] = useState<FacultyTab>('lessons');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Faculty records
  const [submissions, setSubmissions] = useState<WritingSubmissionRecord[]>([]);
  const [enrolments, setEnrolments] = useState<EnrolmentRecord[]>([]);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  // Lesson form state
  const [lsLevel, setLsLevel] = useState<CefrLevelId>('a1');
  const [lsModuleId, setLsModuleId] = useState<string>('mod-a1-6');
  const [lsTitle, setLsTitle] = useState<string>('');
  const [lsTitleRu, setLsTitleRu] = useState<string>('');
  const [lsIntro, setLsIntro] = useState<string>('');
  const [lsGrammarTitle, setLsGrammarTitle] = useState<string>('');
  const [lsGrammarBody, setLsGrammarBody] = useState<string>('');
  const [lsReadingRu, setLsReadingRu] = useState<string>('');
  const [lsReadingEn, setLsReadingEn] = useState<string>('');
  const [lsCulturalNote, setLsCulturalNote] = useState<string>('');
  const [lsAudioUrl, setLsAudioUrl] = useState<string>('');

  // Vocab form state
  const [vcWord, setVcWord] = useState<string>('');
  const [vcStressed, setVcStressed] = useState<string>('');
  const [vcTranslit, setVcTranslit] = useState<string>('');
  const [vcEn, setVcEn] = useState<string>('');
  const [vcHi, setVcHi] = useState<string>('');
  const [vcExRu, setVcExRu] = useState<string>('');
  const [vcExEn, setVcExEn] = useState<string>('');
  const [vcLevel, setVcLevel] = useState<CefrLevelId>('a1');

  // Reading form state
  const [rdTitle, setRdTitle] = useState<string>('');
  const [rdTitleRu, setRdTitleRu] = useState<string>('');
  const [rdLevel, setRdLevel] = useState<CefrLevelId>('a2');
  const [rdAuthor, setRdAuthor] = useState<string>('Sarika Kumari');
  const [rdTextRu, setRdTextRu] = useState<string>('');
  const [rdTextEn, setRdTextEn] = useState<string>('');
  const [rdTextHi, setRdTextHi] = useState<string>('');

  // Video Reference form state
  const [vdTitle, setVdTitle] = useState<string>('');
  const [vdTitleRu, setVdTitleRu] = useState<string>('');
  const [vdLevel, setVdLevel] = useState<CefrLevelId>('a1');
  const [vdLessonId, setVdLessonId] = useState<string>('lesson-a1-1');
  const [vdChannel, setVdChannel] = useState<string>('');
  const [vdUrl, setVdUrl] = useState<string>('');
  const [vdNotes, setVdNotes] = useState<string>('');

  // Audio upload state
  const [audioFolder, setAudioFolder] = useState<'lessons' | 'reading' | 'alphabet'>('lessons');
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string>('');

  // Announcements & Course form
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annBody, setAnnBody] = useState<string>('');
  const [annLevel, setAnnLevel] = useState<string>('All Levels');
  const [crsTitle, setCrsTitle] = useState<string>('');
  const [crsTitleRu, setCrsTitleRu] = useState<string>('');
  const [crsRange, setCrsRange] = useState<string>('A1 – A2');
  const [crsDesc, setCrsDesc] = useState<string>('');

  // Certificate issuance form
  const [certUid, setCertUid] = useState<string>('');
  const [certName, setCertName] = useState<string>('');
  const [certLevel, setCertLevel] = useState<CefrLevelId>('a1');
  const [certLevelTitle, setCertLevelTitle] = useState<string>('Level 1 (A1 Elementary) Completion');

  // Admin grant teacher form
  const [teacherUid, setTeacherUid] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [teacherEmail, setTeacherEmail] = useState<string>('');

  useEffect(() => {
    if (!user || !isAuthorized) return;
    fetchWritingSubmissions(user, true)
      .then(setSubmissions)
      .catch(() => {});
    fetchEnrolments(user, true)
      .then(setEnrolments)
      .catch(() => {});
  }, [user, isAuthorized]);

  if (!user || !isAuthorized) {
    return (
      <div className={`rounded-2xl border p-8 max-w-2xl mx-auto text-center space-y-4 ${theme.cardBg}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-600">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>
          Faculty & Teacher Control Panel
        </h2>
        <p className={`text-sm leading-relaxed ${theme.text}`}>
          Access is restricted exclusively to authorized administrators and verified faculty
          members (including lead teacher Sarika Kumari).
        </p>
        {!user ? (
          <button
            type="button"
            onClick={onSignIn}
            className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
          >
            Sign In with Authorized Faculty Google Account
          </button>
        ) : (
          <p className={`text-xs ${theme.muted}`}>
            Signed in as {user.email} ({role}). Request faculty authorization from the portal administrator.
          </p>
        )}
      </div>
    );
  }

  const handlePublishLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lsTitle.trim() || !lsIntro.trim()) return;
    setSaving(true);
    setStatusMsg('');
    try {
      const lessonId = `custom-lesson-${Date.now()}`;
      const payload: SchoolLesson = {
        id: lessonId,
        levelId: lsLevel,
        moduleId: lsModuleId.trim() || `mod-${lsLevel}-1`,
        order: 99,
        title: lsTitle.trim(),
        titleRu: lsTitleRu.trim() || lsTitle.trim(),
        estimatedMinutes: 30,
        status: 'published',
        objectives: ['Master the grammar and expressions introduced in this teacher-authored lesson.'],
        introduction: lsIntro.trim(),
        vocabulary: [],
        grammarExplanation: [
          {
            heading: lsGrammarTitle.trim() || 'Key Grammar Focus',
            body: [lsGrammarBody.trim() || lsIntro.trim()],
          },
        ],
        grammarTables: [],
        exampleSentences: [],
        dialogue: { title: 'Classroom Dialogue', setting: 'School Seminar', lines: [] },
        readingPassage: {
          title: lsTitle.trim(),
          russian: lsReadingRu.trim() ? lsReadingRu.trim().split('\n') : [lsTitleRu.trim() || lsIntro.trim()],
          english: lsReadingEn.trim() ? lsReadingEn.trim().split('\n') : [lsIntro.trim()],
          hindi: [],
        },
        listeningExercise: {
          instruction: 'Listen carefully to the passage.',
          spokenTextRu: lsReadingRu.trim() || lsTitleRu.trim() || 'Добро пожаловать на урок!',
          transcriptEn: lsReadingEn.trim() || lsIntro.trim(),
          question: 'Did you hear the lesson phrase clearly?',
          options: ['Yes, understood', 'Replay for stress practice'],
          correctAnswer: 'Yes, understood',
          explanation: 'Use the audio speed control to review difficult words.',
        },
        speakingPractice: { scenario: 'Practice aloud', prompts: [] },
        writingExercise: {
          prompt: `Write 3–4 Russian sentences practicing: ${lsTitle.trim()}`,
          guidance: 'Check verb endings and cases before submitting.',
          sampleAnswerRu: lsReadingRu.trim() || 'Сегодня я изучаю русский язык.',
          sampleAnswerEn: lsReadingEn.trim() || 'Today I study Russian.',
        },
        culturalNote: lsCulturalNote.trim() || 'Added by School Faculty.',
        indiaRussiaEquivalent: {
          title: 'Cross-Linguistic Comparison',
          similarity: 'Shared study vocabulary.',
          difference: 'Pay close attention to Russian word stress and case endings.',
          pedagogicalTakeaway: 'Read the passage aloud twice.',
        },
        exercises: [],
        summary: [lsTitle.trim()],
        homework: ['Write 5 original sentences and submit them for review.'],
        audioUrl: lsAudioUrl.trim() || undefined,
        isCustom: true,
      };
      await saveSchoolContentDoc(
        user,
        'school_lessons',
        'lesson',
        lessonId,
        payload as unknown as Record<string, unknown>,
        { levelId: lsLevel, isPublished: true }
      );
      setLsTitle('');
      setLsTitleRu('');
      setLsIntro('');
      setLsGrammarBody('');
      setLsReadingRu('');
      setLsReadingEn('');
      setStatusMsg('Lesson published to the Digital Classroom.');
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Failed to publish lesson.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vcWord.trim() || !vcEn.trim()) return;
    setSaving(true);
    try {
      const id = `voc-custom-${Date.now()}`;
      const payload: LessonVocabularyItem = {
        id,
        word: vcWord.trim(),
        stressed: vcStressed.trim() || vcWord.trim(),
        translit: vcTranslit.trim() || vcWord.trim(),
        partOfSpeech: 'vocabulary item',
        pronunciation: '',
        english: vcEn.trim(),
        hindi: vcHi.trim() || '',
        exampleRu: vcExRu.trim() || vcWord.trim(),
        exampleEn: vcExEn.trim() || vcEn.trim(),
        topic: 'Faculty Deck',
        levelId: vcLevel,
      };
      await saveSchoolContentDoc(
        user,
        'school_vocabulary',
        'vocabulary',
        id,
        payload as unknown as Record<string, unknown>,
        { levelId: vcLevel, isPublished: true }
      );
      setVcWord('');
      setVcStressed('');
      setVcTranslit('');
      setVcEn('');
      setVcHi('');
      setVcExRu('');
      setVcExEn('');
      setStatusMsg('Vocabulary card added to Vocabulary Lab.');
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error saving vocabulary.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rdTitle.trim() || !rdTextRu.trim()) return;
    setSaving(true);
    try {
      const id = `read-custom-${Date.now()}`;
      const payload: ReadingMaterial = {
        id,
        levelId: rdLevel,
        title: rdTitle.trim(),
        titleRu: rdTitleRu.trim() || rdTitle.trim(),
        author: rdAuthor.trim() || 'Sarika Kumari',
        source: 'School Faculty Publication',
        licenseNote: 'Faculty curriculum text',
        genre: 'Guided Reading',
        estimatedMinutes: 6,
        textRu: rdTextRu.trim().split('\n').filter(Boolean),
        textEn: rdTextEn.trim().split('\n').filter(Boolean),
        textHi: rdTextHi.trim().split('\n').filter(Boolean),
        vocabulary: [],
        expressions: [],
        grammarNotes: ['Faculty curated reading text.'],
        comprehensionQuestions: [],
        isPublished: true,
      };
      await saveSchoolContentDoc(
        user,
        'school_reading_materials',
        'reading',
        id,
        payload as unknown as Record<string, unknown>,
        { levelId: rdLevel, isPublished: true }
      );
      setRdTitle('');
      setRdTitleRu('');
      setRdTextRu('');
      setRdTextEn('');
      setRdTextHi('');
      setStatusMsg('Reading passage published to Library.');
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error publishing reading.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vdTitle.trim() || !vdUrl.trim()) return;
    setSaving(true);
    try {
      const id = `vidref-custom-${Date.now()}`;
      const ytId = extractYouTubeVideoId(vdUrl);
      const payload: VideoReference = {
        id,
        levelId: vdLevel,
        moduleId: `mod-${vdLevel}-1`,
        lessonId: vdLessonId.trim() || undefined,
        title: vdTitle.trim(),
        titleRu: vdTitleRu.trim() || vdTitle.trim(),
        channelName: vdChannel.trim() || 'Faculty Curated Channel',
        url: vdUrl.trim(),
        youtubeId: ytId,
        searchUrl: vdUrl.trim(),
        topic: 'Video Lesson',
        description: vdNotes.trim() || vdTitle.trim(),
        teacherNotes: vdNotes.trim() || 'Recommended supplementary lesson video.',
        isPublished: true,
      };
      await saveSchoolContentDoc(
        user,
        'school_video_references',
        'video',
        id,
        payload as unknown as Record<string, unknown>,
        { levelId: vdLevel, isPublished: true }
      );
      setVdTitle('');
      setVdTitleRu('');
      setVdChannel('');
      setVdUrl('');
      setVdNotes('');
      setStatusMsg(
        ytId
          ? `Verified YouTube embed (${ytId}) attached and published.`
          : 'Video link attached to Video Lessons panel.'
      );
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Failed to save video reference.');
    } finally {
      setSaving(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const res = await uploadSchoolAudioToStorage(file, audioFolder);
    setSaving(false);
    if (res.url) {
      setUploadedAudioUrl(res.url);
      setLsAudioUrl(res.url);
      setStatusMsg('Audio uploaded cleanly to Firebase Storage and copied into the Lesson Audio field.');
    } else {
      setStatusMsg(res.error || 'Upload error.');
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) return;
    setSaving(true);
    try {
      const id = `ann-${Date.now()}`;
      const payload: AnnouncementRecord = {
        id,
        title: annTitle.trim(),
        body: annBody.trim(),
        levelId: annLevel,
        authorName: user.displayName || 'Sarika Kumari',
        date: new Date().toISOString().slice(0, 10),
        isPublished: true,
      };
      await saveSchoolContentDoc(
        user,
        'school_announcements',
        'announcement',
        id,
        payload as unknown as Record<string, unknown>,
        { isPublished: true }
      );
      setAnnTitle('');
      setAnnBody('');
      setStatusMsg('Announcement posted to School Homepage.');
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error posting announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsTitle.trim() || !crsDesc.trim()) return;
    setSaving(true);
    try {
      const id = `course-${Date.now()}`;
      const payload: SchoolCourse = {
        id,
        title: crsTitle.trim(),
        titleRu: crsTitleRu.trim() || crsTitle.trim(),
        levelRange: crsRange,
        description: crsDesc.trim(),
        instructor: user.displayName || 'Sarika Kumari',
        isPublished: true,
      };
      await saveSchoolContentDoc(
        user,
        'school_courses',
        'course',
        id,
        payload as unknown as Record<string, unknown>,
        { isPublished: true }
      );
      setCrsTitle('');
      setCrsTitleRu('');
      setCrsDesc('');
      setStatusMsg('Course track published.');
      await onContentChanged();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error publishing course.');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewWriting = async (subId: string) => {
    const fb = feedbackDrafts[subId];
    if (!fb?.trim()) return;
    setSaving(true);
    try {
      await reviewWritingSubmission(user.uid, subId, fb);
      const updated = await fetchWritingSubmissions(user, true);
      setSubmissions(updated);
      setStatusMsg('Teacher feedback saved to student dashboard.');
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error reviewing submission.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnrolment = async (enrolId: string, nextStatus: 'pending' | 'confirmed' | 'archived') => {
    setSaving(true);
    try {
      await updateEnrolmentStatus(enrolId, nextStatus);
      const updated = await fetchEnrolments(user, true);
      setEnrolments(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleIssueCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certUid.trim() || !certName.trim()) return;
    setSaving(true);
    try {
      const code = `SRI-${certLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await issueSchoolCertificate({
        userId: certUid.trim(),
        studentName: certName.trim(),
        levelId: certLevel,
        levelTitle: certLevelTitle.trim(),
        certificateCode: code,
        issuedBy: user.displayName || 'Sarika Kumari',
        enabled: true,
      });
      setCertName('');
      setStatusMsg(`Certificate ${code} issued to student ${certUid.slice(0, 8)}...`);
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error issuing certificate.');
    } finally {
      setSaving(false);
    }
  };

  const handleGrantTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherUid.trim() || !teacherEmail.trim()) return;
    setSaving(true);
    try {
      await grantTeacherAccess(user.uid, teacherUid, teacherName || 'Faculty Member', teacherEmail);
      setTeacherUid('');
      setTeacherName('');
      setTeacherEmail('');
      setStatusMsg('Teacher UID authorized cleanly in school_teachers.');
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Only portal admins can grant teacher access.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className={`h-4 w-4 ${theme.accentText}`} />
              <span className={theme.accentText}>Authenticated Faculty Workspace ({role.toUpperCase()})</span>
            </div>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Teacher & Curriculum Administration Panel
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${theme.text}`}>
              Create and publish Russian lessons, vocabulary flashcards, reading passages, verified
              YouTube video embeds, MP3 audio recordings, review student writing, and issue completion certificates.
            </p>
          </div>
          <div className={`text-xs font-semibold ${theme.muted}`}>
            Faculty: {user.email}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4 border-inherit">
          {[
            { id: 'lessons' as const, label: 'Lessons', icon: BookPlus },
            { id: 'vocab' as const, label: 'Vocabulary', icon: PlusCircle },
            { id: 'reading' as const, label: 'Readings', icon: FileText },
            { id: 'videos' as const, label: 'Video Embeds', icon: PlaySquare },
            { id: 'audio' as const, label: 'Audio Upload', icon: FileAudio },
            { id: 'writing' as const, label: `Writing Review (${submissions.length})`, icon: MessageSquare },
            { id: 'enrolments' as const, label: 'Enrolments & Certs', icon: Award },
            { id: 'announcements' as const, label: 'Notices & Courses', icon: Megaphone },
            ...(role === 'admin' ? [{ id: 'teachers' as const, label: 'Teacher Access', icon: Users }] : []),
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer ${
                  tab === item.id ? theme.primaryBtn : theme.secondaryBtn
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {statusMsg && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* TAB: PUBLISH LESSON */}
      {tab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handlePublishLesson} className={`lg:col-span-7 rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Publish New Classroom Lesson</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">CEFR Level</span>
                <select value={lsLevel} onChange={(e) => setLsLevel(e.target.value as CefrLevelId)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`}>
                  <option value="pre-a1">A0 / Pre-A1</option>
                  <option value="a1">A1</option>
                  <option value="a2">A2</option>
                  <option value="b1">B1</option>
                  <option value="b2">B2</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Target Module ID</span>
                <input value={lsModuleId} onChange={(e) => setLsModuleId(e.target.value)} placeholder="e.g. mod-a1-6" className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">Lesson Title (English) *</span>
                <input required value={lsTitle} onChange={(e) => setLsTitle(e.target.value)} placeholder="Lesson 1.6: Adjectives..." className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Russian Title</span>
                <input value={lsTitleRu} onChange={(e) => setLsTitleRu(e.target.value)} placeholder="Урок 1.6: Прилагательные" className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Introduction *</span>
              <textarea required rows={2} value={lsIntro} onChange={(e) => setLsIntro(e.target.value)} className={`w-full rounded-lg border p-3 ${theme.inputCls}`} />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">Grammar Heading</span>
                <input value={lsGrammarTitle} onChange={(e) => setLsGrammarTitle(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Audio URL (optional MP3)</span>
                <input value={lsAudioUrl} onChange={(e) => setLsAudioUrl(e.target.value)} placeholder="https://..." className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Grammar Explanation</span>
              <textarea rows={3} value={lsGrammarBody} onChange={(e) => setLsGrammarBody(e.target.value)} className={`w-full rounded-lg border p-3 ${theme.inputCls}`} />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">Reading Passage (Russian)</span>
                <textarea rows={3} value={lsReadingRu} onChange={(e) => setLsReadingRu(e.target.value)} className={`w-full rounded-lg border p-2.5 font-cyrillic ${theme.inputCls}`} />
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Reading Translation (English)</span>
                <textarea rows={3} value={lsReadingEn} onChange={(e) => setLsReadingEn(e.target.value)} className={`w-full rounded-lg border p-2.5 ${theme.inputCls}`} />
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Cultural Note</span>
              <input value={lsCulturalNote} onChange={(e) => setLsCulturalNote(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
              {saving ? 'Publishing...' : 'Publish Lesson to Classroom'}
            </button>
          </form>

          <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
              Published Dynamic Lessons ({dynamicLessons.length})
            </h4>
            {dynamicLessons.length === 0 ? (
              <p className={`text-xs ${theme.muted}`}>No faculty-added custom lessons yet.</p>
            ) : (
              <div className="space-y-2">
                {dynamicLessons.map((dl) => (
                  <div key={dl.id} className={`rounded-xl border p-3 flex items-center justify-between gap-2 text-xs ${theme.subCardBg}`}>
                    <div>
                      <div className={`font-bold ${theme.heading}`}>{dl.title}</div>
                      <div className={theme.muted}>{dl.levelId.toUpperCase()} · {dl.moduleId}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSchoolContentDoc('school_lessons', dl.id).then(onContentChanged)}
                      className="rounded border border-red-500/40 p-1.5 text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: VOCABULARY */}
      {tab === 'vocab' && (
        <form onSubmit={handleSaveVocab} className={`rounded-2xl border p-6 max-w-2xl space-y-4 ${theme.cardBg}`}>
          <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Add Word to Vocabulary Lab</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-semibold">Russian Word *</span>
              <input required value={vcWord} onChange={(e) => setVcWord(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">With Stress Mark</span>
              <input value={vcStressed} onChange={(e) => setVcStressed(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">CEFR Level</span>
              <select value={vcLevel} onChange={(e) => setVcLevel(e.target.value as CefrLevelId)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`}>
                <option value="pre-a1">A0</option>
                <option value="a1">A1</option>
                <option value="a2">A2</option>
                <option value="b1">B1</option>
                <option value="b2">B2</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-semibold">Transliteration</span>
              <input value={vcTranslit} onChange={(e) => setVcTranslit(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">English Meaning *</span>
              <input required value={vcEn} onChange={(e) => setVcEn(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">Hindi Meaning</span>
              <input value={vcHi} onChange={(e) => setVcHi(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-devanagari ${theme.inputCls}`} />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-semibold">Example Sentence (RU)</span>
              <input value={vcExRu} onChange={(e) => setVcExRu(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">Example Translation (EN)</span>
              <input value={vcExEn} onChange={(e) => setVcExEn(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
          </div>
          <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
            Publish Vocabulary Card
          </button>
        </form>
      )}

      {/* TAB: READING MATERIAL */}
      {tab === 'reading' && (
        <form onSubmit={handleSaveReading} className={`rounded-2xl border p-6 max-w-3xl space-y-4 ${theme.cardBg}`}>
          <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Publish Reading Library Passage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-semibold">Title (EN) *</span>
              <input required value={rdTitle} onChange={(e) => setRdTitle(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">Title (RU)</span>
              <input value={rdTitleRu} onChange={(e) => setRdTitleRu(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">CEFR Level</span>
              <select value={rdLevel} onChange={(e) => setRdLevel(e.target.value as CefrLevelId)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`}>
                <option value="a1">A1</option>
                <option value="a2">A2</option>
                <option value="b1">B1</option>
                <option value="b2">B2</option>
                <option value="c1">C1</option>
                <option value="c2">C2</option>
              </select>
            </label>
          </div>
          <label className="block space-y-1 text-xs">
            <span className="font-semibold">Author / Attribution</span>
            <input value={rdAuthor} onChange={(e) => setRdAuthor(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
          </label>
          <label className="block space-y-1 text-xs">
            <span className="font-semibold">Russian Paragraphs (One per line) *</span>
            <textarea required rows={4} value={rdTextRu} onChange={(e) => setRdTextRu(e.target.value)} className={`w-full rounded-lg border p-3 font-cyrillic ${theme.inputCls}`} />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="font-semibold">English Paragraphs (Matching lines)</span>
              <textarea rows={3} value={rdTextEn} onChange={(e) => setRdTextEn(e.target.value)} className={`w-full rounded-lg border p-3 ${theme.inputCls}`} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold">Hindi Paragraphs (Matching lines)</span>
              <textarea rows={3} value={rdTextHi} onChange={(e) => setRdTextHi(e.target.value)} className={`w-full rounded-lg border p-3 font-devanagari ${theme.inputCls}`} />
            </label>
          </div>
          <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
            Publish Reading Text
          </button>
        </form>
      )}

      {/* TAB: VERIFIED VIDEO EMBEDS */}
      {tab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSaveVideo} className={`lg:col-span-7 rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Attach Verified Video Lesson (YouTube URL)</h3>
            <p className={`text-xs ${theme.muted}`}>
              Paste any real YouTube watch URL (e.g. https://www.youtube.com/watch?v=...). The system
              extracts the 11-character ID and enables safe inline playback inside Lesson Reader.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">Video Title *</span>
                <input required value={vdTitle} onChange={(e) => setVdTitle(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Russian Title</span>
                <input value={vdTitleRu} onChange={(e) => setVdTitleRu(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-cyrillic ${theme.inputCls}`} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold">Level</span>
                <select value={vdLevel} onChange={(e) => setVdLevel(e.target.value as CefrLevelId)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`}>
                  <option value="pre-a1">A0</option>
                  <option value="a1">A1</option>
                  <option value="a2">A2</option>
                  <option value="b1">B1</option>
                  <option value="b2">B2</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Target Lesson ID</span>
                <input value={vdLessonId} onChange={(e) => setVdLessonId(e.target.value)} placeholder="lesson-a1-1" className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
              <label className="space-y-1">
                <span className="font-semibold">Channel Name</span>
                <input value={vdChannel} onChange={(e) => setVdChannel(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">YouTube Video URL *</span>
              <input required value={vdUrl} onChange={(e) => setVdUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Teacher Study Notes</span>
              <textarea rows={2} value={vdNotes} onChange={(e) => setVdNotes(e.target.value)} className={`w-full rounded-lg border p-3 ${theme.inputCls}`} />
            </label>
            <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
              Attach Video Lesson
            </button>
          </form>

          <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h4 className={`font-cinzel text-base font-bold ${theme.heading}`}>
              Faculty Video Links ({dynamicVideos.length})
            </h4>
            {dynamicVideos.map((dv) => (
              <div key={dv.id} className={`rounded-xl border p-3 flex items-center justify-between gap-2 text-xs ${theme.subCardBg}`}>
                <div>
                  <div className={`font-bold ${theme.heading}`}>{dv.title}</div>
                  <div className={theme.muted}>{dv.levelId.toUpperCase()} · {dv.youtubeId || 'External link'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteSchoolContentDoc('school_video_references', dv.id).then(onContentChanged)}
                  className="rounded border border-red-500/40 p-1.5 text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AUDIO UPLOAD */}
      {tab === 'audio' && (
        <div className={`rounded-2xl border p-6 max-w-2xl space-y-4 ${theme.cardBg}`}>
          <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Upload Pronunciation MP3 to Firebase Storage</h3>
          <div className="flex flex-wrap gap-3 items-center text-xs">
            <select value={audioFolder} onChange={(e) => setAudioFolder(e.target.value as 'lessons' | 'reading' | 'alphabet')} className={`rounded-lg border px-3 py-2 ${theme.inputCls}`}>
              <option value="lessons">lessons/</option>
              <option value="alphabet">alphabet/</option>
              <option value="reading">reading/</option>
            </select>
            <input type="file" accept="audio/*" onChange={handleAudioUpload} className="text-xs" />
          </div>
          {uploadedAudioUrl && (
            <div className={`rounded-xl border p-3 text-xs space-y-2 ${theme.subCardBg}`}>
              <div className="font-semibold">Uploaded Audio URL:</div>
              <input readOnly value={uploadedAudioUrl} className={`w-full rounded border px-2 py-1 text-xs ${theme.inputCls}`} />
              <audio controls src={uploadedAudioUrl} className="w-full h-8" />
            </div>
          )}
        </div>
      )}

      {/* TAB: WRITING REVIEW */}
      {tab === 'writing' && (
        <div className={`rounded-2xl border p-6 space-y-4 ${theme.cardBg}`}>
          <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Student Writing Submissions</h3>
          {submissions.length === 0 ? (
            <p className={`text-xs ${theme.muted}`}>No student writing submissions awaiting review.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div key={s.submissionId} className={`rounded-xl border p-4 space-y-3 ${theme.subCardBg}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className={`font-bold ${theme.heading}`}>{s.studentName}</span> ·{' '}
                      <span className={theme.muted}>{s.lessonTitle}</span>
                    </div>
                    <span className={`uppercase text-[10px] font-bold ${s.status === 'reviewed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className={`text-xs ${theme.muted}`}>Prompt: {s.prompt}</div>
                  <div className={`rounded-lg border p-3 font-cyrillic text-sm ${theme.cardBg}`}>
                    {s.responseText}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={feedbackDrafts[s.submissionId] ?? (s.teacherFeedback || '')}
                      onChange={(e) => setFeedbackDrafts((p) => ({ ...p, [s.submissionId]: e.target.value }))}
                      placeholder="Write constructive Russian/English feedback..."
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`}
                    />
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleReviewWriting(s.submissionId)}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}
                    >
                      Save Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ENROLMENTS & CERTIFICATES */}
      {tab === 'enrolments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-7 rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Student Enrolments ({enrolments.length})</h3>
            {enrolments.map((en) => (
              <div key={en.enrolmentId} className={`rounded-xl border p-4 space-y-2 text-xs ${theme.subCardBg}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className={`font-bold ${theme.heading}`}>
                    {en.studentName} ({en.email})
                  </div>
                  <span className={`font-bold uppercase ${theme.accentText}`}>{en.status}</span>
                </div>
                <div className={theme.text}>{en.preferredCourse} · {en.currentProficiency} · {en.country}</div>
                <div className={theme.muted}>UID: <span className="font-mono">{en.userId}</span></div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button" onClick={() => handleToggleEnrolment(en.enrolmentId, 'confirmed')} className={`rounded border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${theme.primaryBtn}`}>
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCertUid(en.userId);
                      setCertName(en.studentName);
                    }}
                    className={`rounded border px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${theme.secondaryBtn}`}
                  >
                    Fill Certificate Form →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleIssueCert} className={`lg:col-span-5 rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Issue School Completion Certificate</h3>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Student Firebase UID *</span>
              <input required value={certUid} onChange={(e) => setCertUid(e.target.value)} className={`w-full rounded-lg border px-3 py-2 font-mono ${theme.inputCls}`} />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Student Full Name *</span>
              <input required value={certName} onChange={(e) => setCertName(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Level Completed</span>
              <select value={certLevel} onChange={(e) => setCertLevel(e.target.value as CefrLevelId)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`}>
                <option value="pre-a1">A0 / Pre-A1 Alphabet</option>
                <option value="a1">Level 1 (A1)</option>
                <option value="a2">Level 2 (A2)</option>
                <option value="b1">Level 3 (B1)</option>
                <option value="b2">Level 4 (B2)</option>
              </select>
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Certificate Title</span>
              <input value={certLevelTitle} onChange={(e) => setCertLevelTitle(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${theme.inputCls}`} />
            </label>
            <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
              Authorize & Issue Certificate
            </button>
          </form>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS & COURSES */}
      {tab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handlePublishAnnouncement} className={`rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Post School Announcement</h3>
            <input required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Notice headline *" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
            <input value={annLevel} onChange={(e) => setAnnLevel(e.target.value)} placeholder="Target Level (e.g. A1, All Levels)" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
            <textarea required rows={3} value={annBody} onChange={(e) => setAnnBody(e.target.value)} placeholder="Message for students..." className={`w-full rounded-lg border p-3 text-xs ${theme.inputCls}`} />
            <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
              Post Bulletin
            </button>

            <div className="pt-3 space-y-2">
              {dynamicAnnouncements.map((a) => (
                <div key={a.id} className={`rounded-lg border p-2.5 flex items-center justify-between text-xs ${theme.subCardBg}`}>
                  <span className="font-semibold truncate">{a.title}</span>
                  <button type="button" onClick={() => deleteSchoolContentDoc('school_announcements', a.id).then(onContentChanged)} className="text-red-500 cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </form>

          <form onSubmit={handleCreateCourse} className={`rounded-2xl border p-6 space-y-3 ${theme.cardBg}`}>
            <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Create New Course Track</h3>
            <input required value={crsTitle} onChange={(e) => setCrsTitle(e.target.value)} placeholder="Course title (EN) *" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
            <input value={crsTitleRu} onChange={(e) => setCrsTitleRu(e.target.value)} placeholder="Russian course title" className={`w-full rounded-lg border px-3 py-2 text-xs font-cyrillic ${theme.inputCls}`} />
            <input value={crsRange} onChange={(e) => setCrsRange(e.target.value)} placeholder="Level range (e.g. A1 – A2)" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
            <textarea required rows={3} value={crsDesc} onChange={(e) => setCrsDesc(e.target.value)} placeholder="Course description..." className={`w-full rounded-lg border p-3 text-xs ${theme.inputCls}`} />
            <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
              Publish Course Track
            </button>
          </form>
        </div>
      )}

      {/* TAB: ADMIN-ONLY AUTHORIZE TEACHER UID */}
      {tab === 'teachers' && role === 'admin' && (
        <form onSubmit={handleGrantTeacher} className={`rounded-2xl border p-6 max-w-xl space-y-4 ${theme.cardBg}`}>
          <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>Authorize Additional Teacher UID (Admin Only)</h3>
          <p className={`text-xs ${theme.muted}`}>
            Bootstrapped accounts (ritikbalwan23@gmail.com and sarikakumari10500@gmail.com) are
            automatically authorized. Use this form to grant teacher permissions to another signed-in Firebase UID.
          </p>
          <input required value={teacherUid} onChange={(e) => setTeacherUid(e.target.value)} placeholder="Firebase User UID *" className={`w-full rounded-lg border px-3 py-2 text-xs font-mono ${theme.inputCls}`} />
          <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Faculty Name" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
          <input required type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} placeholder="Faculty Email *" className={`w-full rounded-lg border px-3 py-2 text-xs ${theme.inputCls}`} />
          <button type="submit" disabled={saving} className={`rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer ${theme.primaryBtn}`}>
            Authorize Faculty Account
          </button>
        </form>
      )}
    </div>
  );
};
