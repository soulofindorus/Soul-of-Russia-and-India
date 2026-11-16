import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  PlayCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  AnnouncementRecord,
  CefrLevelId,
  SchoolLesson,
  SchoolTabId,
  StudentProgressRecord,
} from '../../types/school';
import {
  COURSE_LEVELS,
  SCHOOL_FAQ_ITEMS,
  SCHOOL_WHY_LEARN_PILLARS,
  TRKI_CORRESPONDENCE_TABLE,
} from '../../data/school/curriculumData';
import { DEFAULT_FEATURED_ACHIEVEMENT } from '../../data/achievementsData';
import { SchoolThemeTokens } from './schoolTheme';
import moscowCampusImg from '../../assets/images/novgorod_kremlin_1790951822350.jpg';
import spbHallImg from '../../assets/images/smolensk_fortress_1790951841321.jpg';
import lifeStudyImg from '../../assets/images/ru_hospitality_1790951910819.jpg';
import sarikaImg from '../../assets/images/regenerated_image_1790026251186.jpg';

interface SchoolHomeViewProps {
  theme: SchoolThemeTokens;
  progress: StudentProgressRecord;
  announcements: AnnouncementRecord[];
  featuredLessons: SchoolLesson[];
  onNavigateTab: (tab: SchoolTabId, opts?: { lessonId?: string; levelId?: CefrLevelId }) => void;
}

export const SchoolHomeView: React.FC<SchoolHomeViewProps> = ({
  theme,
  progress,
  announcements,
  featuredLessons,
  onNavigateTab,
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const completedCount = progress.completedLessonIds.length;
  const resumeLessonId = progress.lastLessonId || 'lesson-a0-1';

  return (
    <div className="space-y-14">
      {/* A. HERO SECTION */}
      <section
        className={`relative overflow-hidden rounded-2xl border ${theme.border} ${
          theme.isDark ? 'bg-[#0b1528]' : 'bg-[#0c1b33]'
        } text-white shadow-xl`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-200">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Soul of Russia and India · Academic Portal</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300/90">
                  SCHOOL OF FOREIGN LANGUAGES
                </p>
                <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white">
                  Learn Russian. Discover a New World.
                </h1>
                <p className="font-cyrillic text-base sm:text-xl font-medium text-slate-200">
                  Изучайте русский язык. Откройте для себя новый мир.
                </p>
              </div>

              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                A structured, student-centered academy teaching Russian from absolute beginner
                (33 Cyrillic letters and pronunciation) through A1, A2, B1, and B2 fluency with
                C1–C2 literary reading — built for Indian learners, university applicants, and
                global students of Eurasian culture.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('lesson', { lessonId: resumeLessonId })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#9b1c2e] hover:bg-[#b52236] px-5 py-3 text-sm font-semibold text-white transition-colors cursor-pointer shadow-sm"
              >
                <PlayCircle className="h-4 w-4" />
                <span>{completedCount > 0 ? 'Continue Learning' : 'Start Learning'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('curriculum')}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 hover:bg-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                <Layers className="h-4 w-4" />
                <span>Explore Courses</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('assessments')}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300/40 bg-transparent hover:bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-200 transition-colors cursor-pointer"
              >
                <Target className="h-4 w-4" />
                <span>Take a Placement Test</span>
              </button>
            </div>

            {/* Quick status bar */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-xs">
              <div>
                <div className="text-slate-400">Progression</div>
                <div className="font-semibold text-white mt-0.5 tabular-nums">A0 → B2 + C1–C2 Reader</div>
              </div>
              <div>
                <div className="text-slate-400">Alphabet Academy</div>
                <div className="font-semibold text-white mt-0.5 tabular-nums">33 Letters + IPA + Hindi</div>
              </div>
              <div>
                <div className="text-slate-400">Your Progress</div>
                <div className="font-semibold text-amber-300 mt-0.5 tabular-nums">
                  {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'} completed
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={moscowCampusImg}
              alt="Historic Russian Kremlin architecture along the river representing classical Russian heritage"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33] via-[#0c1b33]/35 to-transparent lg:bg-gradient-to-r lg:from-[#0c1b33] lg:via-[#0c1b33]/20 lg:to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-[#0c1b33]/85 p-3.5 backdrop-blur-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                First Stop for New Learners
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-200">
                  Interactive 33-letter Cyrillic & Sound Lab with ЙЦУКЕН typing practice
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('curriculum', { levelId: 'pre-a1' })}
                  className="shrink-0 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-[#0c1b33] hover:bg-amber-100 cursor-pointer"
                >
                  Open A0
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS BANNER (when active) */}
      {announcements.length > 0 && (
        <section className={`rounded-xl border p-4 sm:p-5 ${theme.cardBg}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                Academic Bulletin · {announcements[0].levelId || 'School Notice'}
              </div>
              <h2 className={`text-sm sm:text-base font-bold ${theme.heading}`}>
                {announcements[0].title}
              </h2>
              <p className={`text-xs sm:text-sm ${theme.text}`}>{announcements[0].body}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('enrol')}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${theme.secondaryBtn}`}
            >
              Register / Enquire
            </button>
          </div>
        </section>
      )}

      {/* B. EDUCATIONAL APPROACH & MISSION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between space-y-5 ${theme.cardBg}`}>
          <div className="space-y-3">
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Pedagogical Mission
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
              Bridging India & Eurasia Through Academic Russian
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${theme.text}`}>
              As an educational pillar of <strong>Soul of Russia and India (Душа России и Индии)</strong>,
              this school rejects mechanical memorization. Instead, we combine classical Russian
              phonetics and CEFR/TORFL grammar progression with clear Hindi and English linguistic
              comparisons — showing Indian and international learners how dental consonants, dative
              experiencers, and shared Indo-European roots make Russian intuitive.
            </p>
            <p className={`text-sm leading-relaxed ${theme.text}`}>
              Every module prepares learners both for scholarly reading (Pushkin, Tolstoy, Chekhov)
              and for real life at universities in Moscow, Saint Petersburg, Kazan, or anywhere Russian
              is spoken.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className={`rounded-xl border p-4 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Honest Phonetic Guidance
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${theme.text}`}>
                We never simplify sounds into misleading rhymes; every letter lists its IPA, honest
                Hindi/English limitations, and real Russian audio.
              </p>
            </div>
            <div className={`rounded-xl border p-4 ${theme.subCardBg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Transparent Benchmarking
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${theme.text}`}>
                Aligned with CEFR & TORFL/TRKI descriptors. School completion certificates record
                your study with us cleanly without claiming state certification.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <div className={`overflow-hidden rounded-2xl border ${theme.cardBg}`}>
            <div className="h-44 overflow-hidden">
              <img
                src={spbHallImg}
                alt="Historic Russian cathedral and fortress architectural ensemble"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Graded Reader (A1 – C2)
              </div>
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                Classical & Cultural Reading Library
              </h3>
              <p className={`text-xs leading-relaxed ${theme.text}`}>
                Read parallel Russian, English, and Hindi passages — from A1 postcards to Tolstoy,
                Pushkin, and Turgenev in the original.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('reading')}
                className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer ${theme.accentText} hover:underline`}
              >
                <span>Browse Reading Library</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className={`overflow-hidden rounded-2xl border ${theme.cardBg}`}>
            <div className="h-40 overflow-hidden">
              <img
                src={lifeStudyImg}
                alt="Traditional Russian hospitality welcome with karavai bread and samovar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                University Readiness Track
              </div>
              <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>
                Russian for Life & Study in Russia
              </h3>
              <p className={`text-xs leading-relaxed ${theme.text}`}>
                8 field-tested survival modules: airport immigration, hostel check-in, metro,
                vegetarian ordering, banking, classrooms, and winter etiquette.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('life-in-russia')}
                className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer ${theme.accentText} hover:underline`}
              >
                <span>Open Practical Track</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* C. LEARNING LEVELS (A0 / A1 / A2 / B1 / B2 / C1 / C2) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Structured Syllabus
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Learning Levels (A0 Pre-A1 to C2)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('curriculum')}
            className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer ${theme.accentText} hover:underline`}
          >
            <span>Open Full Curriculum Map & TRKI Alignment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSE_LEVELS.map((lvl) => (
            <div
              key={lvl.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${theme.cardBg}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold tabular-nums ${theme.accentBgSoft}`}>
                    {lvl.code}
                  </span>
                  <span className={`text-[11px] font-medium ${theme.muted}`}>
                    {lvl.estimatedHours}
                  </span>
                </div>
                <div>
                  <h3 className={`font-cinzel text-lg font-bold ${theme.heading}`}>{lvl.title}</h3>
                  <p className={`font-cyrillic text-xs mt-0.5 ${theme.muted}`}>{lvl.titleRu}</p>
                </div>
                <p className={`text-xs leading-relaxed ${theme.text}`}>{lvl.description}</p>
                <div className={`text-[11px] font-medium pt-1 ${theme.muted}`}>
                  TRKI Ref: {lvl.trkiEquivalent}
                </div>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${theme.border}`}>
                <span className={`text-xs font-semibold tabular-nums ${theme.muted}`}>
                  {lvl.moduleIds.length > 0
                    ? `${lvl.moduleIds.length} syllabus modules`
                    : 'Guided Literature Track'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    lvl.id === 'c1' || lvl.id === 'c2'
                      ? onNavigateTab('reading', { levelId: lvl.id })
                      : onNavigateTab('curriculum', { levelId: lvl.id })
                  }
                  className={`inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${theme.accentText} hover:underline`}
                >
                  <span>{lvl.id === 'c1' || lvl.id === 'c2' ? 'Open Readings' : 'Explore Level'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* D. WHY LEARN WITH US (8 PILLARS) */}
      <section className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${theme.cardBg}`}>
        <div className="max-w-2xl">
          <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
            Methodology
          </span>
          <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
            Why Learn Russian With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHOOL_WHY_LEARN_PILLARS.map((item) => (
            <div key={item.title} className={`rounded-xl border p-4 space-y-2 ${theme.subCardBg}`}>
              <CheckCircle2 className={`h-4 w-4 ${theme.accentText}`} />
              <h3 className={`text-sm font-bold ${theme.heading}`}>{item.title}</h3>
              <p className={`font-cyrillic text-[11px] ${theme.muted}`}>{item.titleRu}</p>
              <p className={`text-xs leading-relaxed ${theme.text}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* E. TEACHER SPOTLIGHT (SARIKA KUMARI) & VERIFIED ACHIEVEMENT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sarika Kumari Faculty Profile */}
        <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between gap-6 ${theme.cardBg}`}>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-amber-500/40 shadow-md">
              <img
                src={sarikaImg}
                alt="Sarika Kumari — Head of Project and Russian Language Teacher"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${theme.accentBgSoft}`}>
                <GraduationCap className="h-3.5 w-3.5" />
                Faculty Lead & Russian Instructor
              </span>
              <h3 className={`font-cinzel text-2xl font-bold ${theme.heading}`}>Sarika Kumari</h3>
              <p className={`text-xs font-semibold ${theme.accentText}`}>
                Head of Project · Soul of Russia and India · Russian Language Teacher
              </p>
              <p className={`text-sm leading-relaxed ${theme.text}`}>
                Dedicated to building authentic academic, linguistic, and cultural dialogue between
                India and Russia. Teaches Russian phonetics, foundational grammar, and cultural
                literacy tailored for university aspirants and lifelong learners.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                <span className={`inline-flex items-center gap-1 ${theme.muted}`}>
                  <MapPin className="h-3.5 w-3.5" />
                  New Delhi · Moscow Cultural Bridge
                </span>
                <a
                  href="mailto:sarikakumari10500@gmail.com"
                  className={`inline-flex items-center gap-1 font-semibold hover:underline ${theme.accentText}`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>sarikakumari10500@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 border-t pt-4 ${theme.border}`}>
            <div>
              <div className={`text-xs ${theme.muted}`}>Writing Reviews</div>
              <div className={`text-sm font-bold ${theme.heading}`}>Direct Teacher Feedback</div>
            </div>
            <div>
              <div className={`text-xs ${theme.muted}`}>Curriculum Focus</div>
              <div className={`text-sm font-bold ${theme.heading}`}>A0 Phonology → B2 Prose</div>
            </div>
            <div>
              <div className={`text-xs ${theme.muted}`}>Faculty Office</div>
              <button
                type="button"
                onClick={() => onNavigateTab('enrol')}
                className={`text-sm font-bold hover:underline cursor-pointer ${theme.accentText}`}
              >
                Request Study Guidance →
              </button>
            </div>
          </div>
        </div>

        {/* Genuine Verified Recognition (NO invented testimonials) */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between space-y-4 ${theme.cardBg}`}>
          <div className="space-y-3">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${theme.accentBgSoft}`}>
              <Award className="h-3.5 w-3.5" />
              Verified Institutional Recognition
            </span>
            <h3 className={`font-cinzel text-xl font-bold ${theme.heading}`}>
              {DEFAULT_FEATURED_ACHIEVEMENT.titleEn}
            </h3>
            <p className={`font-cyrillic text-xs ${theme.muted}`}>
              {DEFAULT_FEATURED_ACHIEVEMENT.titleRu} ({DEFAULT_FEATURED_ACHIEVEMENT.date})
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
              {DEFAULT_FEATURED_ACHIEVEMENT.captionEn}
            </p>
          </div>

          <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-2 ${theme.border}`}>
            <a
              href={DEFAULT_FEATURED_ACHIEVEMENT.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold ${theme.primaryBtn}`}
            >
              <span>Watch Award Ceremony</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <span className={`text-[11px] ${theme.muted}`}>
              Source: Official Portal Record
            </span>
          </div>
        </div>
      </section>

      {/* F. FEATURED INTERACTIVE LESSONS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
              Digital Classroom Preview
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${theme.heading}`}>
              Featured Structured Lessons
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('lesson', { lessonId: featuredLessons[0]?.id || 'lesson-a0-1' })}
            className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer ${theme.accentText} hover:underline`}
          >
            <span>Enter Classroom Reader</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredLessons.slice(0, 6).map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onNavigateTab('lesson', { lessonId: lesson.id })}
              className={`text-left rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md cursor-pointer ${theme.cardBg}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${theme.accentBgSoft}`}>
                    {lesson.levelId.toUpperCase()}
                  </span>
                  <span className={`text-[11px] tabular-nums ${theme.muted}`}>
                    ~{lesson.estimatedMinutes} min
                  </span>
                </div>
                <h3 className={`font-cinzel text-base font-bold leading-snug ${theme.heading}`}>
                  {lesson.title}
                </h3>
                <p className={`font-cyrillic text-xs ${theme.muted}`}>{lesson.titleRu}</p>
                <p className={`text-xs line-clamp-2 ${theme.text}`}>{lesson.introduction}</p>
              </div>
              <div className={`inline-flex items-center gap-1 text-xs font-bold ${theme.accentText}`}>
                <BookOpen className="h-3.5 w-3.5" />
                <span>Study Lesson →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* G. CEFR ↔ TORFL/TRKI TRANSPARENCY SNAPSHOT */}
      <section className={`rounded-2xl border p-6 sm:p-8 space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className={`font-cinzel text-xl sm:text-2xl font-bold ${theme.heading}`}>
              CEFR & TORFL / ТРКИ Framework Alignment
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${theme.text}`}>
              We follow international CEFR and Russian TORFL (ТРКИ) academic progressions transparently.
              School completion certificates verify coursework completed at Soul of Russia and India and
              do not substitute for official Russian state TRKI testing centers.
            </p>
          </div>
          <Compass className={`h-6 w-6 shrink-0 hidden sm:block ${theme.accentText}`} />
        </div>

        <div className="overflow-x-auto rounded-xl border border-inherit">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className={theme.tableHeader}>
                <th className="p-3 font-semibold">CEFR Level</th>
                <th className="p-3 font-semibold">TORFL / ТРКИ Alignment</th>
                <th className="p-3 font-semibold">Est. Study Hours</th>
                <th className="p-3 font-semibold">Core Linguistic Scope</th>
              </tr>
            </thead>
            <tbody>
              {TRKI_CORRESPONDENCE_TABLE.map((row) => (
                <tr key={row.cefr} className={`border-t ${theme.tableRow}`}>
                  <td className={`p-3 font-bold whitespace-nowrap ${theme.heading}`}>{row.cefr}</td>
                  <td className={`p-3 font-medium ${theme.text}`}>{row.trki}</td>
                  <td className={`p-3 whitespace-nowrap tabular-nums ${theme.muted}`}>{row.hours}</td>
                  <td className={`p-3 ${theme.text}`}>{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* H. FREQUENTLY ASKED QUESTIONS */}
      <section className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${theme.cardBg}`}>
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
            Learner Guide
          </span>
          <h2 className={`font-cinzel text-2xl font-bold mt-1 ${theme.heading}`}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {SCHOOL_FAQ_ITEMS.map((faq, idx) => {
            const open = openFaqIdx === idx;
            return (
              <div key={faq.q} className={`rounded-xl border ${theme.subCardBg}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer"
                >
                  <span className={`text-sm font-bold ${theme.heading}`}>{faq.q}</span>
                  {open ? (
                    <ChevronUp className={`h-4 w-4 shrink-0 ${theme.muted}`} />
                  ) : (
                    <ChevronDown className={`h-4 w-4 shrink-0 ${theme.muted}`} />
                  )}
                </button>
                {open && (
                  <div className={`px-4 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${theme.border} ${theme.text}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* I. ENROLMENT CALL TO ACTION */}
      <section
        className={`rounded-2xl border p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          theme.isDark ? 'bg-[#101c33] border-slate-700' : 'bg-[#0c1b33] border-[#0c1b33]'
        } text-white`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Admissions & Self-Paced Study Open</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold">
            Ready to Begin Your Russian Language Journey?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Register your study profile, take the 5-minute diagnostic placement check, or start
            directly with Level 0 Alphabet Academy today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('enrol')}
            className="rounded-lg bg-[#9b1c2e] hover:bg-[#b52236] px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Enrol in the School
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('curriculum', { levelId: 'pre-a1' })}
            className="rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Start A0 Alphabet Free
          </button>
        </div>
      </section>
    </div>
  );
};
