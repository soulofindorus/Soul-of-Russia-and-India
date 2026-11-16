export type CefrLevelId = 'pre-a1' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export type SchoolTabId =
  | 'home'
  | 'curriculum'
  | 'lesson'
  | 'reading'
  | 'vocabulary'
  | 'grammar'
  | 'life-in-russia'
  | 'culture'
  | 'assessments'
  | 'dashboard'
  | 'teacher'
  | 'enrol';

export type UserRole = 'student' | 'teacher' | 'admin';

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'case-ending'
  | 'verb-conjugation'
  | 'word-order'
  | 'error-correction'
  | 'dialogue-completion'
  | 'translation'
  | 'match-meaning';

export interface CourseLevel {
  id: CefrLevelId;
  code: string;
  title: string;
  titleRu: string;
  trkiEquivalent: string;
  trkiNote: string;
  estimatedHours: string;
  entryRequirements: string;
  description: string;
  objectives: string[];
  grammarSyllabus: string[];
  vocabularySyllabus: string[];
  outcomes: {
    speaking: string;
    listening: string;
    reading: string;
    writing: string;
  };
  culturalObjectives: string[];
  moduleIds: string[];
  finalAssessmentId: string;
}

export interface CurriculumModule {
  id: string;
  levelId: CefrLevelId;
  order: number;
  title: string;
  titleRu: string;
  summary: string;
  learningOutcomes: string[];
  lessonIds: string[];
  plannedTopics?: string[];
  assessmentId?: string;
}

export interface LessonVocabularyItem {
  id: string;
  word: string;
  stressed: string;
  translit: string;
  partOfSpeech: string;
  pronunciation: string;
  english: string;
  hindi: string;
  exampleRu: string;
  exampleEn: string;
  exampleHi?: string;
  topic: string;
  levelId: CefrLevelId;
  notes?: string;
}

export interface GrammarTable {
  title: string;
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface LessonExampleSentence {
  russian: string;
  stressed: string;
  translit: string;
  english: string;
  hindi: string;
}

export interface LessonDialogueLine {
  speaker: string;
  russian: string;
  stressed: string;
  translit: string;
  english: string;
  hindi: string;
}

export interface LessonExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  promptRu?: string;
  context?: string;
  options?: string[];
  wordBank?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation: string;
}

export interface SchoolLesson {
  id: string;
  levelId: CefrLevelId;
  moduleId: string;
  order: number;
  title: string;
  titleRu: string;
  estimatedMinutes: number;
  status: 'published' | 'coming-soon';
  objectives: string[];
  introduction: string;
  vocabulary: LessonVocabularyItem[];
  grammarExplanation: {
    heading: string;
    body: string[];
    indianLearnerTip?: string;
  }[];
  grammarTables: GrammarTable[];
  exampleSentences: LessonExampleSentence[];
  dialogue: {
    title: string;
    setting: string;
    lines: LessonDialogueLine[];
  };
  readingPassage: {
    title: string;
    attribution?: string;
    russian: string[];
    english: string[];
    hindi: string[];
  };
  listeningExercise: {
    instruction: string;
    spokenTextRu: string;
    transcriptEn: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  speakingPractice: {
    scenario: string;
    prompts: {
      promptEn: string;
      modelRu: string;
      translit: string;
      tip: string;
    }[];
  };
  writingExercise: {
    prompt: string;
    guidance: string;
    sampleAnswerRu: string;
    sampleAnswerEn: string;
  };
  culturalNote: string;
  indiaRussiaEquivalent: {
    title: string;
    similarity: string;
    difference: string;
    pedagogicalTakeaway: string;
  };
  exercises: LessonExercise[];
  summary: string[];
  homework: string[];
  audioUrl?: string;
  isCustom?: boolean;
}

export interface ReadingMaterial {
  id: string;
  levelId: CefrLevelId;
  title: string;
  titleRu: string;
  author: string;
  source: string;
  licenseNote: string;
  genre: string;
  estimatedMinutes: number;
  textRu: string[];
  textEn: string[];
  textHi: string[];
  vocabulary: {
    word: string;
    stressed: string;
    english: string;
    hindi: string;
  }[];
  expressions: {
    russian: string;
    english: string;
    usage: string;
  }[];
  grammarNotes: string[];
  comprehensionQuestions: LessonExercise[];
  audioUrl?: string;
  isPublished?: boolean;
}

export interface GrammarTopicGuide {
  id: string;
  levelId: CefrLevelId;
  title: string;
  titleRu: string;
  summary: string;
  steps: {
    heading: string;
    explanation: string;
    examples: { ru: string; translit: string; en: string; hi?: string }[];
  }[];
  tables: GrammarTable[];
  comparisons: {
    title: string;
    formA: string;
    formB: string;
    explanation: string;
  }[];
  indianLearnerMistakes: {
    mistake: string;
    whyItHappens: string;
    correction: string;
  }[];
  exercises: LessonExercise[];
}

export interface LifeInRussiaModule {
  id: string;
  order: number;
  title: string;
  titleRu: string;
  category: 'Arrival' | 'University' | 'Transit' | 'Daily Life' | 'Culture & Etiquette';
  summary: string;
  phrases: {
    russian: string;
    stressed: string;
    translit: string;
    english: string;
    hindi: string;
    context: string;
  }[];
  dialogue: {
    title: string;
    location: string;
    lines: LessonDialogueLine[];
  };
  etiquetteAndTips: string[];
  commonMisunderstanding: {
    situation: string;
    whatHappens: string;
    howToNavigate: string;
  };
}

export interface CultureBridgeLesson {
  id: string;
  title: string;
  titleRu: string;
  category: string;
  summary: string;
  russianContext: string;
  indianEquivalent: string;
  keyDifferences: string;
  keyExpressions: {
    russian: string;
    stressed: string;
    english: string;
    hindiComparison: string;
  }[];
  proverb?: {
    russian: string;
    literal: string;
    meaning: string;
    indianParallel: string;
  };
}

export interface AssessmentQuiz {
  id: string;
  title: string;
  titleRu: string;
  kind: 'placement' | 'level' | 'module';
  levelId?: CefrLevelId;
  description: string;
  passingScorePct: number;
  questions: (LessonExercise & { targetLevel?: CefrLevelId })[];
  isPublished?: boolean;
}

export interface SchoolCourse {
  id: string;
  title: string;
  titleRu: string;
  levelRange: string;
  description: string;
  instructor: string;
  isPublished: boolean;
}

export interface SrsVocabRecord {
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewIso: string;
  lastQuality: number;
}

export interface StudentProgressRecord {
  userId: string;
  studentName?: string;
  currentLevel: CefrLevelId;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  savedVocabIds: string[];
  srsRecords?: Record<string, SrsVocabRecord>;
  lastLessonId?: string;
  streakDays: number;
  lastStudyDate?: string;
  updatedAt?: unknown;
}

export interface QuizAttemptRecord {
  attemptId: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  levelId?: CefrLevelId;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  recommendedLevel?: CefrLevelId;
  createdAt?: unknown;
}

export interface BookmarkRecord {
  bookmarkId: string;
  userId: string;
  itemId: string;
  itemType: 'lesson' | 'reading';
  title: string;
  levelId?: CefrLevelId;
  createdAt?: unknown;
}

export interface WritingSubmissionRecord {
  submissionId: string;
  userId: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  levelId?: CefrLevelId;
  prompt: string;
  responseText: string;
  status: 'submitted' | 'reviewed';
  teacherFeedback?: string;
  reviewedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface EnrolmentRecord {
  enrolmentId: string;
  userId: string;
  studentName: string;
  email: string;
  country: string;
  currentProficiency: string;
  preferredCourse: string;
  learningGoals: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'archived';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CertificateRecord {
  certId: string;
  userId: string;
  studentName: string;
  levelId: CefrLevelId;
  levelTitle: string;
  certificateCode: string;
  issuedBy: string;
  enabled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  body: string;
  levelId?: string;
  authorName: string;
  date: string;
  isPublished: boolean;
}

export interface SchoolUserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  currentLevel: CefrLevelId;
  preferredUiLang: 'en' | 'ru' | 'hi';
  country?: string;
  learningGoal?: string;
}

export interface VideoReference {
  id: string;
  levelId: CefrLevelId;
  moduleId: string;
  lessonId?: string;
  title: string;
  titleRu: string;
  channelName: string;
  url: string;
  youtubeId?: string;
  searchUrl: string;
  topic: string;
  description: string;
  teacherNotes: string;
  comprehensionQuestion?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  isPublished: boolean;
}

export interface AlphabetLetterDetail {
  id: string;
  order: number;
  upper: string;
  lower: string;
  name: string;
  nameRu: string;
  type: 'vowel' | 'consonant' | 'sign';
  ipa: string;
  englishApprox: string;
  pronunciationLimitation: string;
  hindiGuide: string;
  voicedPair?: string;
  hardSoftInfo: string;
  exampleWords: {
    word: string;
    stressed: string;
    translit: string;
    english: string;
    hindi: string;
  }[];
  writingNotes: string;
  listeningContrast?: {
    targetWord: string;
    distractorWord: string;
    hint: string;
  };
}

