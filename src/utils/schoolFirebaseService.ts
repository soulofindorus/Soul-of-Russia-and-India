import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, handleFirestoreError, OperationType, storage } from '../lib/firebase';
import {
  AnnouncementRecord,
  AssessmentQuiz,
  BookmarkRecord,
  CefrLevelId,
  CertificateRecord,
  EnrolmentRecord,
  LessonVocabularyItem,
  QuizAttemptRecord,
  ReadingMaterial,
  SchoolCourse,
  SchoolLesson,
  SchoolUserProfile,
  StudentProgressRecord,
  UserRole,
  VideoReference,
  WritingSubmissionRecord,
} from '../types/school';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'ritikbalwan23@gmail.com';
export const BOOTSTRAPPED_TEACHER_EMAIL = 'sarikakumari10500@gmail.com';

const GUEST_PROGRESS_KEY = 'sri_school_guest_progress_v1';
const GUEST_BOOKMARKS_KEY = 'sri_school_guest_bookmarks_v1';
const GUEST_ATTEMPTS_KEY = 'sri_school_guest_attempts_v1';

export function sanitizeFirestoreId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return (cleaned || `id-${Date.now()}`).slice(0, 140);
}

export function isFacultyEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return lower === BOOTSTRAPPED_ADMIN_EMAIL || lower === BOOTSTRAPPED_TEACHER_EMAIL;
}

export async function resolveUserRole(user: User | null): Promise<UserRole> {
  if (!user) return 'student';
  const emailLower = (user.email || '').trim().toLowerCase();

  if (user.emailVerified && emailLower === BOOTSTRAPPED_ADMIN_EMAIL) {
    return 'admin';
  }
  if (user.emailVerified && emailLower === BOOTSTRAPPED_TEACHER_EMAIL) {
    return 'teacher';
  }

  try {
    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    if (adminSnap.exists()) return 'admin';
  } catch {
    // ignore lookup permission issue for regular users
  }

  try {
    const teacherSnap = await getDoc(doc(db, 'school_teachers', user.uid));
    if (teacherSnap.exists() && teacherSnap.data()?.active === true) return 'teacher';
  } catch {
    // ignore
  }

  return 'student';
}

export async function ensureSchoolUserProfile(user: User, role: UserRole): Promise<SchoolUserProfile> {
  const userRef = doc(db, 'school_users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const d = snap.data();
      return {
        uid: user.uid,
        displayName: String(d.displayName || user.displayName || 'Student'),
        email: String(d.email || user.email || ''),
        role: (d.role as UserRole) || role,
        currentLevel: (d.currentLevel as CefrLevelId) || 'pre-a1',
        preferredUiLang: (d.preferredUiLang as 'en' | 'ru' | 'hi') || 'en',
        country: d.country ? String(d.country) : undefined,
        learningGoal: d.learningGoal ? String(d.learningGoal) : undefined,
      };
    }

    const baseProfile: SchoolUserProfile = {
      uid: user.uid,
      displayName: (user.displayName || user.email?.split('@')[0] || 'Learner').slice(0, 110),
      email: user.email || 'learner@soulindorus.site',
      role: 'student',
      currentLevel: 'pre-a1',
      preferredUiLang: 'en',
    };

    if (user.emailVerified) {
      await setDoc(userRef, {
        ...baseProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return { ...baseProfile, role };
  } catch (err) {
    console.warn('School profile check note:', err);
    return {
      uid: user.uid,
      displayName: user.displayName || 'Learner',
      email: user.email || '',
      role,
      currentLevel: 'pre-a1',
      preferredUiLang: 'en',
    };
  }
}

export async function signInSchoolWithGoogle(): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('popup-closed-by-user')) {
      return { user: null, error: 'Sign-in window was closed before completing.' };
    }
    return { user: null, error: message };
  }
}

export async function signOutSchool(): Promise<void> {
  await signOut(auth);
}

export function subscribeSchoolAuth(
  callback: (state: { user: User | null; role: UserRole; profile: SchoolUserProfile | null }) => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, role: 'student', profile: null });
      return;
    }
    const role = await resolveUserRole(user);
    const profile = await ensureSchoolUserProfile(user, role);
    callback({ user, role, profile });
  });
}

// =========================================================================
// STUDENT PROGRESS (FIRESTORE + GUEST LOCAL FALLBACK)
// =========================================================================

export const DEFAULT_STUDENT_PROGRESS: StudentProgressRecord = {
  userId: 'guest',
  currentLevel: 'pre-a1',
  enrolledCourseIds: ['course-general-russian'],
  completedLessonIds: [],
  savedVocabIds: [],
  srsRecords: {},
  streakDays: 1,
};

export function loadGuestProgress(): StudentProgressRecord {
  try {
    const raw = localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return DEFAULT_STUDENT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgressRecord>;
    return {
      ...DEFAULT_STUDENT_PROGRESS,
      ...parsed,
      enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds)
        ? parsed.enrolledCourseIds
        : DEFAULT_STUDENT_PROGRESS.enrolledCourseIds,
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      savedVocabIds: Array.isArray(parsed.savedVocabIds) ? parsed.savedVocabIds : [],
      srsRecords: parsed.srsRecords || {},
    };
  } catch {
    return DEFAULT_STUDENT_PROGRESS;
  }
}

export function saveGuestProgress(progress: StudentProgressRecord): void {
  try {
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage quota
  }
}

export async function fetchStudentProgress(user: User | null): Promise<StudentProgressRecord> {
  if (!user || !user.emailVerified) {
    return loadGuestProgress();
  }
  const docPath = `school_progress/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'school_progress', user.uid));
    if (!snap.exists()) {
      const guest = loadGuestProgress();
      return {
        ...guest,
        userId: user.uid,
        studentName: user.displayName || guest.studentName || 'Student',
      };
    }
    const d = snap.data();
    return {
      userId: user.uid,
      studentName: d.studentName ? String(d.studentName) : user.displayName || undefined,
      currentLevel: (d.currentLevel as CefrLevelId) || 'pre-a1',
      enrolledCourseIds: Array.isArray(d.enrolledCourseIds) ? d.enrolledCourseIds : ['course-general-russian'],
      completedLessonIds: Array.isArray(d.completedLessonIds) ? d.completedLessonIds : [],
      savedVocabIds: Array.isArray(d.savedVocabIds) ? d.savedVocabIds : [],
      srsRecords: (d.srsRecords as StudentProgressRecord['srsRecords']) || {},
      lastLessonId: d.lastLessonId ? String(d.lastLessonId) : undefined,
      streakDays: typeof d.streakDays === 'number' ? d.streakDays : 1,
      lastStudyDate: d.lastStudyDate ? String(d.lastStudyDate) : undefined,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, docPath);
  }
}

export async function saveStudentProgress(
  user: User | null,
  progress: StudentProgressRecord
): Promise<StudentProgressRecord> {
  const today = new Date().toISOString().slice(0, 10);
  let nextStreak = progress.streakDays || 1;
  if (progress.lastStudyDate && progress.lastStudyDate !== today) {
    const prevDate = new Date(progress.lastStudyDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) nextStreak += 1;
    else if (diffDays > 1) nextStreak = 1;
  }

  const normalized: StudentProgressRecord = {
    ...progress,
    streakDays: nextStreak,
    lastStudyDate: today,
  };

  if (!user || !user.emailVerified) {
    saveGuestProgress(normalized);
    return normalized;
  }

  const docPath = `school_progress/${user.uid}`;
  try {
    const payload: Record<string, unknown> = {
      userId: user.uid,
      studentName: (normalized.studentName || user.displayName || 'Student').slice(0, 110),
      currentLevel: normalized.currentLevel,
      enrolledCourseIds: normalized.enrolledCourseIds.slice(0, 100),
      completedLessonIds: normalized.completedLessonIds.slice(0, 500),
      savedVocabIds: normalized.savedVocabIds.slice(0, 500),
      srsRecords: normalized.srsRecords || {},
      streakDays: normalized.streakDays,
      lastStudyDate: normalized.lastStudyDate,
      updatedAt: serverTimestamp(),
    };
    if (normalized.lastLessonId) {
      payload.lastLessonId = normalized.lastLessonId.slice(0, 160);
    }

    await setDoc(doc(db, 'school_progress', user.uid), payload);
    saveGuestProgress(normalized);
    return normalized;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

// =========================================================================
// QUIZ ATTEMPTS
// =========================================================================

export async function recordQuizAttempt(
  user: User | null,
  input: Omit<QuizAttemptRecord, 'attemptId' | 'userId' | 'createdAt'>
): Promise<QuizAttemptRecord> {
  const attemptId = sanitizeFirestoreId(`attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const record: QuizAttemptRecord = {
    attemptId,
    userId: user?.uid || 'guest',
    ...input,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(GUEST_ATTEMPTS_KEY) || '[]') as QuizAttemptRecord[];
    localStorage.setItem(GUEST_ATTEMPTS_KEY, JSON.stringify([record, ...existing].slice(0, 50)));
  } catch {
    // ignore
  }

  if (user && user.emailVerified) {
    const path = `school_quiz_attempts/${attemptId}`;
    try {
      const data: Record<string, unknown> = {
        attemptId,
        userId: user.uid,
        quizId: record.quizId.slice(0, 120),
        quizTitle: record.quizTitle.slice(0, 180),
        score: record.score,
        totalQuestions: record.totalQuestions,
        percentage: record.percentage,
        passed: record.passed,
        createdAt: serverTimestamp(),
      };
      if (record.levelId) data.levelId = record.levelId;
      if (record.recommendedLevel) data.recommendedLevel = record.recommendedLevel;
      await setDoc(doc(db, 'school_quiz_attempts', attemptId), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  return record;
}

export async function fetchQuizAttempts(user: User | null): Promise<QuizAttemptRecord[]> {
  if (!user || !user.emailVerified) {
    try {
      return JSON.parse(localStorage.getItem(GUEST_ATTEMPTS_KEY) || '[]') as QuizAttemptRecord[];
    } catch {
      return [];
    }
  }
  const path = 'school_quiz_attempts';
  try {
    const q = query(collection(db, path), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as QuizAttemptRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// =========================================================================
// BOOKMARKS
// =========================================================================

export async function fetchBookmarks(user: User | null): Promise<BookmarkRecord[]> {
  if (!user || !user.emailVerified) {
    try {
      return JSON.parse(localStorage.getItem(GUEST_BOOKMARKS_KEY) || '[]') as BookmarkRecord[];
    } catch {
      return [];
    }
  }
  const path = 'school_bookmarks';
  try {
    const q = query(collection(db, path), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as BookmarkRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function toggleBookmarkItem(
  user: User | null,
  currentBookmarks: BookmarkRecord[],
  item: { itemId: string; itemType: 'lesson' | 'reading'; title: string; levelId?: CefrLevelId }
): Promise<BookmarkRecord[]> {
  const existing = currentBookmarks.find(
    (b) => b.itemId === item.itemId && b.itemType === item.itemType
  );

  if (existing) {
    const filtered = currentBookmarks.filter((b) => b.bookmarkId !== existing.bookmarkId);
    if (!user || !user.emailVerified) {
      localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(filtered));
      return filtered;
    }
    const path = `school_bookmarks/${existing.bookmarkId}`;
    try {
      await deleteDoc(doc(db, 'school_bookmarks', existing.bookmarkId));
      return filtered;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  const bookmarkId = sanitizeFirestoreId(`bm-${user?.uid?.slice(0, 12) || 'guest'}-${item.itemType}-${item.itemId}`);
  const created: BookmarkRecord = {
    bookmarkId,
    userId: user?.uid || 'guest',
    itemId: item.itemId,
    itemType: item.itemType,
    title: item.title.slice(0, 190),
    levelId: item.levelId,
  };
  const updated = [created, ...currentBookmarks];

  if (!user || !user.emailVerified) {
    localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  }

  const path = `school_bookmarks/${bookmarkId}`;
  try {
    const data: Record<string, unknown> = {
      bookmarkId,
      userId: user.uid,
      itemId: created.itemId.slice(0, 160),
      itemType: created.itemType,
      title: created.title,
      createdAt: serverTimestamp(),
    };
    if (created.levelId) data.levelId = created.levelId;
    await setDoc(doc(db, 'school_bookmarks', bookmarkId), data);
    return updated;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// =========================================================================
// WRITING SUBMISSIONS
// =========================================================================

export async function submitWritingExercise(
  user: User,
  input: {
    lessonId: string;
    lessonTitle: string;
    levelId?: CefrLevelId;
    prompt: string;
    responseText: string;
  }
): Promise<WritingSubmissionRecord> {
  const submissionId = sanitizeFirestoreId(`wr-${user.uid.slice(0, 10)}-${Date.now()}`);
  const path = `school_writing_submissions/${submissionId}`;
  try {
    const record: Record<string, unknown> = {
      submissionId,
      userId: user.uid,
      studentName: (user.displayName || user.email?.split('@')[0] || 'Student').slice(0, 110),
      lessonId: input.lessonId.slice(0, 150),
      lessonTitle: input.lessonTitle.slice(0, 190),
      prompt: input.prompt.slice(0, 480),
      responseText: input.responseText.trim().slice(0, 3900),
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.levelId) record.levelId = input.levelId;
    await setDoc(doc(db, 'school_writing_submissions', submissionId), record);
    return {
      ...(record as unknown as WritingSubmissionRecord),
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function fetchWritingSubmissions(
  user: User | null,
  asFaculty = false
): Promise<WritingSubmissionRecord[]> {
  if (!user || !user.emailVerified) return [];
  const path = 'school_writing_submissions';
  try {
    const q = asFaculty && isFacultyEmail(user.email)
      ? collection(db, path)
      : query(collection(db, path), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as WritingSubmissionRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function reviewWritingSubmission(
  reviewerUid: string,
  submissionId: string,
  feedback: string
): Promise<void> {
  const path = `school_writing_submissions/${submissionId}`;
  try {
    await updateDoc(doc(db, 'school_writing_submissions', submissionId), {
      status: 'reviewed',
      teacherFeedback: feedback.trim().slice(0, 1900),
      reviewedBy: reviewerUid,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// =========================================================================
// ENROLMENTS & CERTIFICATES
// =========================================================================

export async function submitSchoolEnrolment(
  user: User,
  input: Omit<EnrolmentRecord, 'enrolmentId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<EnrolmentRecord> {
  const enrolmentId = sanitizeFirestoreId(`enrol-${user.uid.slice(0, 10)}-${Date.now()}`);
  const path = `school_enrolments/${enrolmentId}`;
  try {
    const payload: Record<string, unknown> = {
      enrolmentId,
      userId: user.uid,
      studentName: input.studentName.trim().slice(0, 115),
      email: input.email.trim().slice(0, 175),
      country: input.country.trim().slice(0, 75),
      currentProficiency: input.currentProficiency.trim().slice(0, 55),
      preferredCourse: input.preferredCourse.trim().slice(0, 155),
      learningGoals: input.learningGoals.trim().slice(0, 580),
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.message?.trim()) payload.message = input.message.trim().slice(0, 1450);

    await setDoc(doc(db, 'school_enrolments', enrolmentId), payload);
    return payload as unknown as EnrolmentRecord;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function fetchEnrolments(user: User | null, asFaculty = false): Promise<EnrolmentRecord[]> {
  if (!user || !user.emailVerified) return [];
  const path = 'school_enrolments';
  try {
    const q = asFaculty && isFacultyEmail(user.email)
      ? collection(db, path)
      : query(collection(db, path), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as EnrolmentRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateEnrolmentStatus(
  enrolmentId: string,
  status: 'pending' | 'confirmed' | 'archived'
): Promise<void> {
  const path = `school_enrolments/${enrolmentId}`;
  try {
    await updateDoc(doc(db, 'school_enrolments', enrolmentId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function fetchCertificates(user: User | null, asFaculty = false): Promise<CertificateRecord[]> {
  if (!user || !user.emailVerified) return [];
  const path = 'school_certificates';
  try {
    const q = asFaculty && isFacultyEmail(user.email)
      ? collection(db, path)
      : query(collection(db, path), where('userId', '==', user.uid), where('enabled', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as CertificateRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function issueSchoolCertificate(
  input: Omit<CertificateRecord, 'certId' | 'createdAt' | 'updatedAt'>
): Promise<CertificateRecord> {
  const certId = sanitizeFirestoreId(`cert-${input.userId.slice(0, 10)}-${input.levelId}-${Date.now()}`);
  const path = `school_certificates/${certId}`;
  try {
    const payload = {
      certId,
      userId: input.userId.trim().slice(0, 125),
      studentName: input.studentName.trim().slice(0, 115),
      levelId: input.levelId,
      levelTitle: input.levelTitle.trim().slice(0, 155),
      certificateCode: input.certificateCode.trim().slice(0, 60),
      issuedBy: input.issuedBy.trim().slice(0, 115),
      enabled: input.enabled,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'school_certificates', certId), payload);
    return payload as unknown as CertificateRecord;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// =========================================================================
// DYNAMIC TEACHER / ADMIN CMS COLLECTIONS
// =========================================================================

export type SchoolContentCollection =
  | 'school_courses'
  | 'school_levels'
  | 'school_modules'
  | 'school_lessons'
  | 'school_vocabulary'
  | 'school_reading_materials'
  | 'school_quizzes'
  | 'school_questions'
  | 'school_announcements'
  | 'school_video_references';

export type SchoolContentType =
  | 'course'
  | 'level'
  | 'module'
  | 'lesson'
  | 'vocabulary'
  | 'reading'
  | 'quiz'
  | 'question'
  | 'announcement'
  | 'video';

export async function fetchSchoolContentDocs<T>(
  collectionName: SchoolContentCollection,
  includeDrafts = false
): Promise<T[]> {
  try {
    const q = includeDrafts
      ? collection(db, collectionName)
      : query(collection(db, collectionName), where('isPublished', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...(data.payload as T),
        id: data.docId,
        isPublished: Boolean(data.isPublished),
      };
    });
  } catch (err) {
    console.warn(`Unable to load ${collectionName} from Firestore, using bundled curriculum:`, err);
    return [];
  }
}

export async function saveSchoolContentDoc<T extends Record<string, unknown>>(
  user: User,
  collectionName: SchoolContentCollection,
  contentType: SchoolContentType,
  rawId: string,
  payload: T,
  options?: { levelId?: string; isPublished?: boolean }
): Promise<string> {
  const docId = sanitizeFirestoreId(rawId);
  const path = `${collectionName}/${docId}`;
  const refDoc = doc(db, collectionName, docId);
  const isPublished = options?.isPublished ?? true;

  try {
    const existing = await getDoc(refDoc);
    if (existing.exists()) {
      const updatePayload: Record<string, unknown> = {
        isPublished,
        payload,
        updatedBy: user.uid,
        updatedAt: serverTimestamp(),
      };
      if (options?.levelId) updatePayload.levelId = options.levelId;
      await updateDoc(refDoc, updatePayload);
    } else {
      const createPayload: Record<string, unknown> = {
        docId,
        contentType,
        isPublished,
        payload,
        createdBy: user.uid,
        updatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (options?.levelId) createPayload.levelId = options.levelId;
      await setDoc(refDoc, createPayload);
    }
    return docId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteSchoolContentDoc(
  collectionName: SchoolContentCollection,
  docId: string
): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function loadAllSchoolDynamicContent(includeDrafts = false): Promise<{
  lessons: SchoolLesson[];
  vocabulary: LessonVocabularyItem[];
  readings: ReadingMaterial[];
  quizzes: AssessmentQuiz[];
  announcements: AnnouncementRecord[];
  videos: VideoReference[];
  courses: SchoolCourse[];
}> {
  const [lessons, vocabulary, readings, quizzes, announcements, videos, courses] = await Promise.all([
    fetchSchoolContentDocs<SchoolLesson>('school_lessons', includeDrafts),
    fetchSchoolContentDocs<LessonVocabularyItem>('school_vocabulary', includeDrafts),
    fetchSchoolContentDocs<ReadingMaterial>('school_reading_materials', includeDrafts),
    fetchSchoolContentDocs<AssessmentQuiz>('school_quizzes', includeDrafts),
    fetchSchoolContentDocs<AnnouncementRecord>('school_announcements', includeDrafts),
    fetchSchoolContentDocs<VideoReference>('school_video_references', includeDrafts),
    fetchSchoolContentDocs<SchoolCourse>('school_courses', includeDrafts),
  ]);
  return { lessons, vocabulary, readings, quizzes, announcements, videos, courses };
}

export async function grantTeacherAccess(
  adminUid: string,
  targetUid: string,
  displayName: string,
  email: string
): Promise<void> {
  const cleanUid = targetUid.trim();
  const path = `school_teachers/${cleanUid}`;
  try {
    await setDoc(doc(db, 'school_teachers', cleanUid), {
      uid: cleanUid,
      displayName: displayName.trim().slice(0, 115),
      email: email.trim().slice(0, 175),
      active: true,
      createdBy: adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// =========================================================================
// FIREBASE STORAGE AUDIO UPLOAD
// =========================================================================

export async function uploadSchoolAudioToStorage(
  file: File,
  folder: 'lessons' | 'reading' | 'alphabet'
): Promise<{ url?: string; error?: string }> {
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectRef = ref(storage, `school-audio/${folder}/${Date.now()}-${safeName}`);
    await uploadBytes(objectRef, file, { contentType: file.type || 'audio/mpeg' });
    const url = await getDownloadURL(objectRef);
    return { url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      error: `Audio upload failed (${msg}). You may still paste an external MP3/audio URL below.`,
    };
  }
}

export function extractYouTubeVideoId(rawUrl: string): string | undefined {
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;
  const match =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ||
    trimmed.match(/^([a-zA-Z0-9_-]{11})$/);
  return match ? match[1] : undefined;
}
