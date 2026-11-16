import {
  AnnouncementRecord,
  CourseLevel,
  CurriculumModule,
  SchoolCourse,
} from '../../types/school';

export const DEFAULT_SCHOOL_COURSES: SchoolCourse[] = [
  {
    id: 'course-general-russian',
    title: 'Comprehensive Russian Language Programme (A0 – B2)',
    titleRu: 'Полный курс русского языка (A0 – B2)',
    levelRange: 'A0 (Pre-A1) → B2',
    description:
      'Complete academic pathway from the 33-letter Cyrillic alphabet and pronunciation through upper-intermediate fluency, aligned with CEFR and TORFL/TRKI syllabi.',
    instructor: 'Sarika Kumari',
    isPublished: true,
  },
  {
    id: 'course-life-study-russia',
    title: 'Russian for Life & University Study in Russia',
    titleRu: 'Русский язык для жизни и учёбы в России',
    levelRange: 'A1 – B1 Practical Track',
    description:
      'Essential campus, hostel, banking, metro, pharmacy, airport immigration, and classroom communication tailored especially for Indian and international students moving to Russia.',
    instructor: 'Sarika Kumari',
    isPublished: true,
  },
];

export const TRKI_CORRESPONDENCE_TABLE = [
  {
    cefr: 'Pre-A1 (A0)',
    trki: 'Вводно-фонетический курс (Introductory Phonetics & Script)',
    hours: '25–40 hrs',
    scope: 'All 33 Cyrillic letters, vowel reduction, palatalization, final devoicing, ИК intonation patterns, keyboard typing, basic survival phrases.',
  },
  {
    cefr: 'A1',
    trki: 'ТЭУ / Elementary Level (Элементарный уровень)',
    hours: '100–120 hrs',
    scope: 'Basic survival communication (~780 words), present/past/future tense, noun genders, singular Nominative, Prepositional, Accusative, Genitive, Dative.',
  },
  {
    cefr: 'A2',
    trki: 'ТБУ / Basic Level (Базовый уровень)',
    hours: '160–200 hrs',
    scope: 'Everyday social & study independence (~1,300 words), all 6 cases in singular & plural, verbal aspect intro, unprefixed motion verbs, comparatives.',
  },
  {
    cefr: 'B1',
    trki: 'ТРКИ-1 / First Certification Level (Первый уровень)',
    hours: '360–450 hrs (cumulative)',
    scope: 'University preparatory readiness (~2,300 words), prefixed verbs of motion, participles, verbal adverbs, complex syntax, expressing opinions.',
  },
  {
    cefr: 'B2',
    trki: 'ТРКИ-2 / Second Certification Level (Второй уровень)',
    hours: '650–800 hrs (cumulative)',
    scope: 'Professional & full academic freedom (~10,000 passive / ~4,000 active words), stylistic registers, media/journalistic discourse, nuanced aspect.',
  },
  {
    cefr: 'C1 – C2',
    trki: 'ТРКИ-3 & ТРКИ-4 (Advanced Reading & Academic Reference)',
    hours: '950+ hrs',
    scope: 'Mastery of Russian classical/modern literature, idioms, stylistics, academic research discourse (currently offered as graded C1–C2 Reading Library tracks).',
  },
];

export const COURSE_LEVELS: CourseLevel[] = [
  {
    id: 'pre-a1',
    code: 'A0 / Pre-A1',
    title: 'Absolute Beginner: Alphabet & Pronunciation',
    titleRu: 'Уровень 0: Абсолютный начинающий',
    trkiEquivalent: 'Вводно-фонетический курс (Pre-TRKI Foundation)',
    trkiNote:
      'Foundation bridge prior to ТЭУ. School completion records are internal educational certificates issued by Soul of Russia and India and are not official Russian state TRKI certificates.',
    estimatedHours: '30–40 hours',
    entryRequirements: 'No prior knowledge of Russian or Cyrillic required.',
    description:
      'Master every one of the 33 Cyrillic letters, eliminate Latin false-friend confusion, train accurate Russian stress and vowel reduction, and read connected sentences fluently.',
    objectives: [
      'Recognize, pronounce, and type all 33 Cyrillic letters without relying on Latin transliteration.',
      'Master hard vs. soft consonants (palatalization), word-final devoicing, and vowel reduction (аканье / иканье).',
      'Distinguish Ь, Ъ, Ы, Й, Ш vs. Щ, and apply ИК-1, ИК-2, and ИК-3 intonation.',
      'Read syllables, high-frequency everyday words, and basic introductory sentences aloud.',
    ],
    grammarSyllabus: [
      'Russian sound system & Cyrillic script architecture',
      '10 vowel letters pairing hard/soft consonant quality',
      'Role of Ь (soft sign) & Ъ (hard sign)',
      'Statement vs. yes/no question intonation (ИК-1 vs. ИК-3)',
    ],
    vocabularySyllabus: [
      'First greetings and polite expressions',
      'Internationalisms & everyday city words (метро́, па́рк, кафе́, университе́т)',
      'Basic Russia–India cultural cognates (бра́т, ма́ть, до́м, вода́)',
    ],
    outcomes: {
      speaking: 'Pronounce names, greetings, and simple words intelligibly with accurate stress.',
      listening: 'Hear differences between hard/soft consonants, Ш/Щ, and statement vs. question pitch.',
      reading: 'Decode printed Russian words, street signs, and short A0 dialogues without transliteration.',
      writing: 'Handwrite cursive basics cleanly and type Cyrillic phrases using ЙЦУКЕН.',
    },
    culturalObjectives: [
      'Understand Cyrillic heritage (Cyril and Methodius) and Indo-European links with Sanskrit/Hindi.',
    ],
    moduleIds: [
      'mod-a0-u1',
      'mod-a0-u2',
      'mod-a0-u3',
      'mod-a0-u4',
      'mod-a0-u5',
      'mod-a0-u6',
    ],
    finalAssessmentId: 'quiz-a0-alphabet',
  },
  {
    id: 'a1',
    code: 'A1',
    title: 'Beginner (Начальный уровень)',
    titleRu: 'Уровень 1: Начальный (A1)',
    trkiEquivalent: 'ТЭУ — Элементарный уровень (CEFR A1)',
    trkiNote:
      'Aligned with ТЭУ descriptors (~780 core words). Completion earns a Soul of Russia and India A1 School Certificate (not an official state TRKI diploma).',
    estimatedHours: '100–120 hours',
    entryRequirements: 'Completion of Level 0 Alphabet Academy (or A1+ placement test score).',
    description:
      'Build real communicative confidence: introduce yourself, talk about family, study, daily routine, food, weather, prices, and navigate Russian cities using foundational grammar.',
    objectives: [
      'Identify grammatical gender (он, она, оно) and form regular/irregular noun plurals.',
      'Conjugate Group I and Group II verbs in the present tense, and use past & compound future.',
      'Use Prepositional (location), Accusative (direct objects), Genitive (possession/negation), and basic Dative.',
      'Conduct everyday dialogues in shops, cafés, classrooms, and city transit.',
    ],
    grammarSyllabus: [
      'Personal & possessive pronouns (мой, твой, наш)',
      'Gender of nouns & plural rules (including 7-letter spelling rule)',
      'Present tense Conjugation I & II + Быть in Past & Future',
      'Prepositional case with в/на, Accusative, Genitive, intro Dative',
      'Adjective agreement & Cardinal numbers 1–100',
    ],
    vocabularySyllabus: [
      'Greetings, nationalities, languages & professions',
      'Family, classroom objects & city places',
      'Food, cafés, shopping, weather, days & telling time',
    ],
    outcomes: {
      speaking: 'Introduce yourself, order food, ask for directions, and describe daily schedules.',
      listening: 'Understand slow, clearly articulated phrases on familiar personal & daily topics.',
      reading: 'Read short menus, schedules, simple messages, and adapted cultural paragraphs.',
      writing: 'Fill out registration forms and write 5–8 sentence paragraphs about yourself and family.',
    },
    culturalObjectives: [
      'Master polite вы vs. informal ты, Russian patronymics, and basic etiquette.',
    ],
    moduleIds: Array.from({ length: 24 }, (_, idx) => `mod-a1-${idx + 1}`),
    finalAssessmentId: 'quiz-a1-mastery',
  },
  {
    id: 'a2',
    code: 'A2',
    title: 'Elementary (Элементарный / Базовый)',
    titleRu: 'Уровень 2: Элементарный (A2)',
    trkiEquivalent: 'ТБУ — Базовый уровень (CEFR A2)',
    trkiNote:
      'Aligned with ТБУ (Basic Level) communicative benchmarks (~1,300 words).',
    estimatedHours: '120–150 hours',
    entryRequirements: 'Completion of Level 1 (A1) or placement recommendation A2.',
    description:
      'Move beyond isolated phrases into connected storytelling: command all 6 Russian cases across singular and plural, verbal aspect (НСВ/СВ), and unprefixed verbs of motion.',
    objectives: [
      'Control all six cases (Nominative, Genitive, Dative, Accusative, Instrumental, Prepositional) in singular & plural.',
      'Distinguish Imperfective (НСВ) vs. Perfective (СВ) verbs to express process vs. completed result.',
      'Use unidirectional vs. multidirectional verbs of motion (идти/ходить, ехать/ездить).',
      'Form imperatives, reflexive verbs (-ся), comparatives, and simple reason/time clauses.',
    ],
    grammarSyllabus: [
      'Complete 6-case system including Instrumental & Dative experiences (Мне нравится / Мне нужно)',
      'Plural case endings & adjective-noun agreement in all cases',
      'Verbal aspect pairs (делать/сделать, писать/написать, читать/прочитать)',
      'Unprefixed verbs of motion on foot and by transport',
      'Imperatives, comparatives, reflexive -ся verbs',
    ],
    vocabularySyllabus: [
      'Travel, railways, housing, university life & hobbies',
      'Health basics, invitations, holidays, city services & appointments',
    ],
    outcomes: {
      speaking: 'Narrate past events, discuss weekend plans, explain preferences, and handle travel changes.',
      listening: 'Follow routine announcements, short dialogues, and university instructions.',
      reading: 'Understand personal emails, simple news briefs, and adapted Russian short stories.',
      writing: 'Compose informal/semi-formal letters, invitations, and coherent 120-word stories.',
    },
    culturalObjectives: [
      'Explore Russian hospitality traditions, dachas, railways, and university student etiquette.',
    ],
    moduleIds: Array.from({ length: 20 }, (_, idx) => `mod-a2-${idx + 1}`),
    finalAssessmentId: 'quiz-a2-mastery',
  },
  {
    id: 'b1',
    code: 'B1',
    title: 'Intermediate (Средний уровень)',
    titleRu: 'Уровень 3: Средний (B1)',
    trkiEquivalent: 'ТРКИ-1 — Первый сертификационный уровень (CEFR B1)',
    trkiNote:
      'Corresponds to the academic threshold required for Russian university undergraduate degree entry (~2,300 words).',
    estimatedHours: '180–220 hours',
    entryRequirements: 'Completion of Level 2 (A2) or placement recommendation B1.',
    description:
      'Transition to independent academic and professional Russian: master prefixed verbs of motion, participles, verbal adverbs (деепричастия), indirect speech, and nuanced aspect.',
    objectives: [
      'Use spatial prefixes on motion verbs (при-, у-, в-, вы-, под-, от-, пере-, до-) accurately.',
      'Form and read active/passive participles and imperfective/perfective adverbial participles.',
      'Construct complex sentences with который, чтобы, потому что, поэтому, хотя, несмотря на.',
      'Report indirect speech and express conditions (если бы + past tense).',
    ],
    grammarSyllabus: [
      'All cases consolidation & exceptions (-у locative, indeclinable nouns)',
      'Verbal aspect in the negative, infinitive, and imperative',
      'Prefixed verbs of motion (входить/войти, приезжать/приехать)',
      'Active & passive participles + Деепричастия (verbal adverbs)',
      'Indirect speech, subjunctive (бы), & complex subordinate clauses',
    ],
    vocabularySyllabus: [
      'Higher education, career, technology, culture, media & environment',
      'Connecting discourse markers (во-первых, таким образом, следовательно)',
    ],
    outcomes: {
      speaking: 'Defend viewpoints, summarize articles, and participate comfortably in university seminars.',
      listening: 'Comprehend lectures, interviews, and unscripted conversations at natural speed.',
      reading: 'Read authentic journalism, Chekhov/Pushkin adapted/unabridged prose, and university handouts.',
      writing: 'Draft structured essays, formal university emails, and opinion summaries.',
    },
    culturalObjectives: [
      'Engage with Russian literary classics, cinema, and Indo-Russian intellectual dialogues.',
    ],
    moduleIds: Array.from({ length: 20 }, (_, idx) => `mod-b1-${idx + 1}`),
    finalAssessmentId: 'quiz-b1-mastery',
  },
  {
    id: 'b2',
    code: 'B2',
    title: 'Upper Intermediate (Выше среднего)',
    titleRu: 'Уровень 4: Выше среднего (B2)',
    trkiEquivalent: 'ТРКИ-2 — Второй сертификационный уровень (CEFR B2)',
    trkiNote:
      'Corresponds to ТРКИ-2 professional & graduate fluency benchmarks.',
    estimatedHours: '200+ hours',
    entryRequirements: 'Completion of Level 3 (B1) or placement recommendation B2.',
    description:
      'Refine stylistic control across formal academic, journalistic, and literary registers; command idioms, nuanced word order (theme/rheme), and persuasive argumentation.',
    objectives: [
      'Differentiate functional styles: colloquial, journalistic (публицистический), official-business, and scientific.',
      'Use subtle aspectual meanings (annulled result, repetitive past, general factual) naturally.',
      'Apply idiomatic expressions, phraseology, and syntactic expressiveness (theme-rheme inversion).',
      'Analyze unadapted Russian literature, academic texts, and cultural debates.',
    ],
    grammarSyllabus: [
      'Nuanced verbal aspect & aspectual competition in discourse',
      'Figurative uses of verbs of motion & verbal government',
      'Full participial & adverbial clause condensation in written prose',
      'Russian syntax, word order (актуальное членение), & punctuation logic',
      'Word formation (prefixes/suffixes) & stylistic synonymy',
    ],
    vocabularySyllabus: [
      'International diplomacy, cultural criticism, economics, law & humanities',
      'High-frequency Russian phraseological idioms (фразеологизмы)',
    ],
    outcomes: {
      speaking: 'Argue persuasively in debates, deliver academic presentations, and adjust register fluidly.',
      listening: 'Follow rapid native discussions, documentaries, and subtle irony.',
      reading: 'Read contemporary essays, authentic press editorials, and classical prose without heavy dictionary dependence.',
      writing: 'Write analytical essays, formal proposals, and critical reviews with stylistic polish.',
    },
    culturalObjectives: [
      'Explore Tagore–Tolstoy–Roerich philosophy, Silver Age poetry, and contemporary Eurasian scholarship.',
    ],
    moduleIds: Array.from({ length: 20 }, (_, idx) => `mod-b2-${idx + 1}`),
    finalAssessmentId: 'quiz-b2-mastery',
  },
  {
    id: 'c1',
    code: 'C1',
    title: 'Advanced (Продвинутый)',
    titleRu: 'Уровень 5: Продвинутый (C1)',
    trkiEquivalent: 'ТРКИ-3 (CEFR C1)',
    trkiNote:
      'Supported through C1–C2 Authentic Reading Library passages and advanced discourse studies.',
    estimatedHours: '250+ hours',
    entryRequirements: 'B2 proficiency.',
    description:
      'Engage directly with unadapted nineteenth- and twentieth-century Russian prose, philosophical essays, historical primary sources, and high-register academic Russian.',
    objectives: [
      'Read Pushkin, Tolstoy, Chekhov, and contemporary Russian journalism in the original.',
      'Analyze subtle modal particles (же, ведь, ли, -то, хоть) and pragmatic nuance.',
    ],
    grammarSyllabus: [
      'Pragmatic particles & expressive syntax',
      'Archaic vs. modern lexical strata in literature',
    ],
    vocabularySyllabus: ['Literary criticism, historiography, diplomatic discourse'],
    outcomes: {
      speaking: 'Express complex abstract ideas spontaneously and precisely.',
      listening: 'Understand extended academic lectures and cultural broadcasts.',
      reading: 'Read long literary and scholarly works with appreciation of style.',
      writing: 'Produce clear, well-structured academic papers.',
    },
    culturalObjectives: ['Deep literary analysis across Russian & Indian traditions.'],
    moduleIds: [],
    finalAssessmentId: 'quiz-b2-mastery',
  },
  {
    id: 'c2',
    code: 'C2',
    title: 'Proficiency (Владение в совершенстве)',
    titleRu: 'Уровень 6: Владение в совершенстве (C2)',
    trkiEquivalent: 'ТРКИ-4 (CEFR C2)',
    trkiNote:
      'Near-native literary, idiomatic, and stylistic mastery; supported in the Reading Library and Comparative Stylistics track.',
    estimatedHours: 'Open scholarly mastery track',
    entryRequirements: 'C1 proficiency.',
    description:
      'Synthesize complex historical, philosophical, and literary sources with precision, nuance, and full appreciation of subtext, rhythm, and cross-cultural resonance.',
    objectives: [
      'Interpret unadapted classical poetry, philosophical correspondence, and subtle rhetorical devices.',
    ],
    grammarSyllabus: ['Rhetorical figures, stylistic register shifting, historical prose'],
    vocabularySyllabus: ['Philosophical, literary, and idiomatic breadth'],
    outcomes: {
      speaking: 'Speak effortlessly on any cultural, scholarly, or diplomatic subject.',
      listening: 'Understand any spoken variety with zero strain.',
      reading: 'Critically evaluate subtle prose, poetry, and archival texts.',
      writing: 'Author publication-grade essays in Russian.',
    },
    culturalObjectives: ['Lead Indo-Russian literary translation and scholarship.'],
    moduleIds: [],
    finalAssessmentId: 'quiz-b2-mastery',
  },
];

// Build full structured module catalog for A0 (6), A1 (24), A2 (20), B1 (20), B2 (20)
export const CURRICULUM_MODULES: CurriculumModule[] = [
  // ======================== LEVEL 0 (A0): 6 UNITS ========================
  {
    id: 'mod-a0-u1',
    levelId: 'pre-a1',
    order: 1,
    title: 'Unit 1: Introduction to Russian & Cyrillic',
    titleRu: 'Юнит 1: Знакомство с русским языком и кириллицей',
    summary: 'Origin of Russian, Cyrillic vs. Latin false friends, and effective study habits.',
    learningOutcomes: ['Identify all Latin–Cyrillic false friends', 'Explain Indo-European links with Sanskrit/Hindi'],
    lessonIds: ['lesson-a0-1'],
  },
  {
    id: 'mod-a0-u2',
    levelId: 'pre-a1',
    order: 2,
    title: 'Unit 2: The Complete 33-Letter Russian Alphabet',
    titleRu: 'Юнит 2: Русский алфавит (33 буквы)',
    summary: 'Interactive mastery of every Cyrillic letter with IPA, English & Hindi comparisons, audio, writing, and recognition quizzes.',
    learningOutcomes: ['Name and sound out all 33 letters accurately', 'Pass the Alphabet Mastery Check (≥75%)'],
    lessonIds: ['lesson-a0-1'],
    assessmentId: 'quiz-a0-alphabet',
  },
  {
    id: 'mod-a0-u3',
    levelId: 'pre-a1',
    order: 3,
    title: 'Unit 3: Vowels, Reduction & Consonant System',
    titleRu: 'Юнит 3: Гласные, редукция и система согласных',
    summary: 'Hard/soft vowels, unstressed о/е/я reduction, palatalization, final devoicing, and voicing assimilation.',
    learningOutcomes: ['Apply аканье (о -> а) accurately', 'Devoice word-final paired consonants naturally'],
    lessonIds: ['lesson-a0-2'],
  },
  {
    id: 'mod-a0-u4',
    levelId: 'pre-a1',
    order: 4,
    title: 'Unit 4: Special Letters (Ь, Ъ, Ы, Й, Е, Ё, Ю, Я)',
    titleRu: 'Юнит 4: Особые буквы и сочетания',
    summary: 'Conquering Ь vs Ъ, distinguishing Ы vs И, consonant Й, and palatalizing vs [j]-initial vowels.',
    learningOutcomes: ['Pronounce Ы without sliding to И or У', 'Hear and produce soft vs hard consonant minimal pairs'],
    lessonIds: ['lesson-a0-2'],
  },
  {
    id: 'mod-a0-u5',
    levelId: 'pre-a1',
    order: 5,
    title: 'Unit 5: Word Stress & Intonation (ИК-1 – ИК-4)',
    titleRu: 'Юнит 5: Ударение и интонационные конструкции',
    summary: 'Unpredictable Russian word stress and asking yes/no vs question-word questions naturally.',
    learningOutcomes: ['Differentiate statements (ИК-1) from yes/no questions (ИК-3)'],
    lessonIds: ['lesson-a0-3'],
  },
  {
    id: 'mod-a0-u6',
    levelId: 'pre-a1',
    order: 6,
    title: 'Unit 6: Connected Reading, Handwriting & Typing Lab',
    titleRu: 'Юнит 6: Чтение, письмо и русская клавиатура',
    summary: 'Syllables to connected sentences, cursive warnings, ЙЦУКЕН keyboard trainer, and dictation.',
    learningOutcomes: ['Read short Russian dialogues smoothly', 'Type basic greetings in Cyrillic'],
    lessonIds: ['lesson-a0-3'],
    assessmentId: 'quiz-a0-alphabet',
  },

  // ======================== LEVEL 1 (A1): 24 MODULES ========================
  ...[
    { n: 1, t: 'Greetings & First Contacts', ru: 'Приветствия и знакомство', lessons: ['lesson-a1-1'] },
    { n: 2, t: 'Personal Pronouns & "Who is this?"', ru: 'Личные местоимения и Кто это? Что это?', lessons: ['lesson-a1-1'] },
    { n: 3, t: 'Noun Gender (Masculine, Feminine, Neuter)', ru: 'Род имён существительных', lessons: ['lesson-a1-2'] },
    { n: 4, t: 'Plural Nouns & 7-Letter Spelling Rule', ru: 'Множественное число и орфографическое правило', lessons: ['lesson-a1-2'] },
    { n: 5, t: 'Possessive Pronouns & "Whose?"', ru: 'Притяжательные местоимения (мой, твой, наш)', lessons: ['lesson-a1-2'] },
    { n: 6, t: 'Adjectives & Agreement in Gender and Number', ru: 'Прилагательные и согласование', lessons: [], topics: ['Hard vs. soft adjective endings (-ый/-ий, -ая/-яя, -ое/-ее)', 'Describing colours, sizes, and nationalities'] },
    { n: 7, t: 'Present Tense: Conjugation I (-ать/-ять)', ru: 'Настоящее время: I спряжение', lessons: ['lesson-a1-3'] },
    { n: 8, t: 'Present Tense: Conjugation II (-ить) & Negation', ru: 'Настоящее время: II спряжение и отрицание', lessons: ['lesson-a1-3'] },
    { n: 9, t: 'Languages, Nationalities & Speaking ("по-русски")', ru: 'Языки, национальности и речь', lessons: ['lesson-a1-3'] },
    { n: 10, t: 'Prepositional Case: Location with В and НА', ru: 'Предложный падеж: место (где?)', lessons: ['lesson-a1-4'] },
    { n: 11, t: 'Accusative Case: Direct Objects (Inanimate & Animate)', ru: 'Винительный падеж (что? кого?)', lessons: ['lesson-a1-4'] },
    { n: 12, t: 'Numbers 0–100, Age & Prices', ru: 'Числа 0–100, возраст и цены', lessons: ['lesson-a1-5'] },
    { n: 13, t: 'Family & Professions', ru: 'Семья и профессии', lessons: [], topics: ['Extended family vocabulary', 'Genitive possession ("У меня есть брат")'] },
    { n: 14, t: 'My Home & Room', ru: 'Мой дом и комната', lessons: [], topics: ['Furniture and prepositions в/на/рядом', 'Describing a room or hostel'] },
    { n: 15, t: 'Food, Drinks & Ordering at a Café', ru: 'Еда, напитки и заказ в кафе', lessons: ['lesson-a1-5'] },
    { n: 16, t: 'Daily Routine & Reflexive Basics', ru: 'Распорядок дня и возвратные глаголы', lessons: ['lesson-a1-5'] },
    { n: 17, t: 'Days of the Week & Telling Time', ru: 'Дни недели и время', lessons: [], topics: ['В понедельник (Accusative for days)', 'Который час?'] },
    { n: 18, t: 'Past Tense Formation (-л, -ла, -ло, -ли)', ru: 'Прошедшее время глагола', lessons: [], topics: ['Past tense stems and stress shifts', 'Saying what you did yesterday'] },
    { n: 19, t: 'Compound Future Tense (Быть + Infinitive)', ru: 'Будущее сложное время', lessons: [], topics: ['Я буду учиться / работать', 'Planning tomorrow'] },
    { n: 20, t: 'Genitive Case Basics: Origin & Absence ("Нет...")', ru: 'Родительный падеж: принадлежность и отсутствие', lessons: [], topics: ['Откуда вы? (из Индии, из России)', 'У меня нет + Genitive'] },
    { n: 21, t: 'Intro to Dative Case (Age & "Мне нравится")', ru: 'Дательный падеж: Мне нравится / Мне 20 лет', lessons: [], topics: ['Dative personal pronouns', 'Expressing likes and age'] },
    { n: 22, t: 'City Transport & Asking Directions', ru: 'Городской транспорт и ориентирование', lessons: [], topics: ['Как пройти к метро?', 'На автобусе / на поезде'] },
    { n: 23, t: 'Weather & Seasons of the Year', ru: 'Погода и времена года', lessons: [], topics: ['Impersonal adverbs (холодно, тепло, жарко)', 'Зимой, весной, летом, осенью'] },
    { n: 24, t: 'A1 Comprehensive Revision & TRKI ТЭУ Practice', ru: 'Итоговое повторение и тест уровня A1', lessons: [], topics: ['Integrated reading, listening, and dialogue review', 'Level A1 Mastery Assessment'], assess: 'quiz-a1-mastery' },
  ].map((m) => ({
    id: `mod-a1-${m.n}`,
    levelId: 'a1' as const,
    order: m.n,
    title: `Module ${m.n}: ${m.t}`,
    titleRu: m.ru,
    summary:
      m.lessons.length > 0
        ? `Includes interactive digital classroom lesson (${m.t}).`
        : `Syllabus module covering: ${(m.topics || []).join('; ')}.`,
    learningOutcomes: m.topics || [`Apply ${m.t.toLowerCase()} in guided speaking and comprehension tasks`],
    lessonIds: m.lessons,
    plannedTopics: m.topics,
    assessmentId: m.assess,
  })),

  // ======================== LEVEL 2 (A2): 20 MODULES ========================
  ...[
    { n: 1, t: 'Review & Diagnostic of A1 Foundations', ru: 'Повторение базы уровня A1', lessons: [] },
    { n: 2, t: 'Genitive Case Singular & Plural (All Functions)', ru: 'Родительный падеж в единственном и множественном числе', lessons: ['lesson-a2-1'] },
    { n: 3, t: 'Dative Case: Recipients, Needs & Feelings', ru: 'Дательный падеж: адресат, возраст, состояние', lessons: ['lesson-a2-1'] },
    { n: 4, t: 'Instrumental Case: Companions, Professions & Means', ru: 'Творительный падеж (с кем? кем? чем?)', lessons: ['lesson-a2-2'] },
    { n: 5, t: 'Complete Six-Case System Mastery', ru: 'Система шести падежей русского языка', lessons: ['lesson-a2-2'] },
    { n: 6, t: 'Plural Nouns & Adjectives in All Cases', ru: 'Множественное число во всех падежах', lessons: [] },
    { n: 7, t: 'Verbal Aspect Basics (Imperfective vs. Perfective)', ru: 'Виды глагола: НСВ и СВ', lessons: ['lesson-a2-3'] },
    { n: 8, t: 'Verbal Aspect in Past & Future Tenses', ru: 'Виды глагола в прошедшем и будущем времени', lessons: ['lesson-a2-3'] },
    { n: 9, t: 'Unprefixed Verbs of Motion (Идти/Ходить, Ехать/Ездить)', ru: 'Глаголы движения без приставок', lessons: ['lesson-a2-3'] },
    { n: 10, t: 'Reflexive Verbs (-ся) in Everyday Speech', ru: 'Возвратные глаголы (-ся / -сь)', lessons: [] },
    { n: 11, t: 'Modal Verbs & Expressions (Мочь, Хотеть, Должен, Надо)', ru: 'Модальность и необходимость', lessons: [] },
    { n: 12, t: 'Imperatives & Polite Requests', ru: 'Повелительное наклонение глагола', lessons: [] },
    { n: 13, t: 'Comparative & Superlative Adjectives and Adverbs', ru: 'Сравнительная и превосходная степень', lessons: [] },
    { n: 14, t: 'Time Clauses (Когда, Пока, После того как)', ru: 'Выражение времени в сложном предложении', lessons: [] },
    { n: 15, t: 'Cause, Purpose & Result (Потому что, Поэтому, Чтобы)', ru: 'Причина, следствие и цель', lessons: [] },
    { n: 16, t: 'Dates, Calendar & Biographical Storytelling', ru: 'Даты, годы и биография', lessons: [] },
    { n: 17, t: 'Health, Pharmacy & Everyday Services', ru: 'Здоровье, аптека и бытовые услуги', lessons: [] },
    { n: 18, t: 'Travel, Hotels & Railway Journeys', ru: 'Путешествия, гостиница и вокзал', lessons: [] },
    { n: 19, t: 'Study Life, Hobbies & Russian Cultural Events', ru: 'Учёба, интересы и культурный досуг', lessons: [] },
    { n: 20, t: 'A2 Revision & TRKI ТБУ Readiness Exam', ru: 'Итоговое повторение и тест уровня A2', lessons: [], assess: 'quiz-a2-mastery' },
  ].map((m) => ({
    id: `mod-a2-${m.n}`,
    levelId: 'a2' as const,
    order: m.n,
    title: `Module ${m.n}: ${m.t}`,
    titleRu: m.ru,
    summary:
      m.lessons.length > 0
        ? `Includes complete A2 classroom lesson covering ${m.t}.`
        : `Planned A2 syllabus topic covering ${m.t}.`,
    learningOutcomes: [`Demonstrate accurate A2 control of ${m.t.toLowerCase()}`],
    lessonIds: m.lessons,
    plannedTopics: m.lessons.length === 0 ? [`Detailed grammar, dialogue, and practice for ${m.t}`] : undefined,
    assessmentId: m.assess,
  })),

  // ======================== LEVEL 3 (B1): 20 MODULES ========================
  ...[
    { n: 1, t: 'Consolidating Complex Case Meanings & Exceptions', ru: 'Трудные случаи падежной системы', lessons: [] },
    { n: 2, t: 'Prefixed Verbs of Motion (При-, У-, В-, Вы-, Пере-)', ru: 'Глаголы движения с приставками', lessons: ['lesson-b1-1'] },
    { n: 3, t: 'Spatial & Figurative Verbs of Motion (Нести/Носить, Везти/Возить)', ru: 'Транзитивные глаголы движения и переносные значения', lessons: ['lesson-b1-1'] },
    { n: 4, t: 'Aspectual Pairs in Negation, Infinitive & Imperative', ru: 'Употребление видов глагола в инфинитиве, отрицании и императиве', lessons: ['lesson-b1-2'] },
    { n: 5, t: 'Short-Form Adjectives & Active States', ru: 'Краткие прилагательные', lessons: [] },
    { n: 6, t: 'Active Participles (Present & Past)', ru: 'Действительные причастия', lessons: ['lesson-b1-3'] },
    { n: 7, t: 'Passive Participles & Short Passive Constructions', ru: 'Страдательные причастия и пассивный залог', lessons: ['lesson-b1-3'] },
    { n: 8, t: 'Verbal Adverbs / Adverbial Participles (Деепричастия)', ru: 'Деепричастия несовершенного и совершенного вида', lessons: ['lesson-b1-3'] },
    { n: 9, t: 'Relative Clauses with Который in All Cases', ru: 'Определительные предложения со словом «который»', lessons: [] },
    { n: 10, t: 'Real & Unreal Conditions (Если / Если бы)', ru: 'Реальное и нереальное условие (сослагательное наклонение)', lessons: [] },
    { n: 11, t: 'Indirect Speech & Reporting Verbs', ru: 'Прямая и косвенная речь', lessons: [] },
    { n: 12, t: 'Concessive Clauses (Хотя, Несмотря на то что)', ru: 'Уступительные конструкции', lessons: [] },
    { n: 13, t: 'Indefinite & Negative Pronouns (Кто-то, Кто-нибудь, Никто, Некого)', ru: 'Неопределённые и отрицательные местоимения', lessons: [] },
    { n: 14, t: 'Higher Education, Academic Debates & Research Vocabulary', ru: 'Высшее образование и академическая дискуссия', lessons: [] },
    { n: 15, t: 'Society, Media & Critical Summarization', ru: 'Общество, СМИ и реферирование текста', lessons: [] },
    { n: 16, t: 'Career, Resumes & Formal Correspondence', ru: 'Карьера, резюме и деловая переписка', lessons: [] },
    { n: 17, t: 'Geography, Ecology & Sustainable Eurasia', ru: 'География, природа и экология', lessons: [] },
    { n: 18, t: 'Arts, Literature & Film Appreciation', ru: 'Искусство, литература и кино', lessons: [] },
    { n: 19, t: 'Expressing Agreement, Doubt & Nuanced Argument', ru: 'Выражение мнения, согласия и сомнения', lessons: [] },
    { n: 20, t: 'B1 Comprehensive Review & TRKI-1 Benchmark Assessment', ru: 'Итоговый обзор и тест уровня B1', lessons: [], assess: 'quiz-b1-mastery' },
  ].map((m) => ({
    id: `mod-b1-${m.n}`,
    levelId: 'b1' as const,
    order: m.n,
    title: `Module ${m.n}: ${m.t}`,
    titleRu: m.ru,
    summary:
      m.lessons.length > 0
        ? `Includes comprehensive B1 classroom lesson covering ${m.t}.`
        : `Planned B1 syllabus module covering ${m.t}.`,
    learningOutcomes: [`Use ${m.t.toLowerCase()} in extended spoken and written discourse`],
    lessonIds: m.lessons,
    plannedTopics: m.lessons.length === 0 ? [`Authentic prose analysis and structured drills on ${m.t}`] : undefined,
    assessmentId: m.assess,
  })),

  // ======================== LEVEL 4 (B2): 20 MODULES ========================
  ...[
    { n: 1, t: 'Advanced Aspectual Competition & Discourse Perspective', ru: 'Конкуренция видов глагола в дискурсе', lessons: ['lesson-b2-1'] },
    { n: 2, t: 'Academic & Scientific Syntax (Научный стиль)', ru: 'Синтаксис научного стиля речи', lessons: ['lesson-b2-1'] },
    { n: 3, t: 'Journalistic Style & Media Analysis (Публицистический стиль)', ru: 'Публицистический стиль и язык СМИ', lessons: ['lesson-b2-2'] },
    { n: 4, t: 'Official-Business Style & Institutional Rhetoric', ru: 'Официально-деловой стиль', lessons: [] },
    { n: 5, t: 'Idioms, Phraseologisms & Figurative Speech', ru: 'Фразеологизмы и образная речь', lessons: ['lesson-b2-2'] },
    { n: 6, t: 'Nuanced Word Order (Theme / Rheme) & Emphasis', ru: 'Актуальное членение предложения и порядок слов', lessons: [] },
    { n: 7, t: 'Literary Discourse & Classical Prose Reading', ru: 'Художественный стиль и классическая проза', lessons: ['lesson-b2-3'] },
    { n: 8, t: 'Persuasive Argumentation & Counter-Arguments', ru: 'Аргументация, полемика и контраргументация', lessons: ['lesson-b2-3'] },
    { n: 9, t: 'Word Formation: Productive Prefixes & Abstract Suffixes', ru: 'Словообразование: приставки и суффиксы', lessons: [] },
    { n: 10, t: 'Nuances of Verbal Government (Управление глаголов)', ru: 'Трудные случаи глагольного управления', lessons: [] },
    { n: 11, t: 'Modal Particles & Conversational Subtext (Же, Ведь, Ли, Вряд ли)', ru: 'Модальные частицы и подтекст', lessons: [] },
    { n: 12, t: 'Complex Punctuation & Participial Condensing', ru: 'Пунктуация и синтаксическая компрессия', lessons: [] },
    { n: 13, t: 'Collective & Fractional Numerals with Case Mastery', ru: 'Собирательные и дробные числительные', lessons: [] },
    { n: 14, t: 'History, Cultural Diplomacy & Bilateral Relations', ru: 'История, культура и международный диалог', lessons: [] },
    { n: 15, t: 'Economics, Innovation & Global Challenges', ru: 'Экономика, технологии и вызовы современности', lessons: [] },
    { n: 16, t: 'Irony, Metaphor & Sociolinguistic Registers', ru: 'Ирония, метафора и речевые регистры', lessons: [] },
    { n: 17, t: 'Academic Abstract Writing & Presentations', ru: 'Написание аннотаций и научные выступления', lessons: [] },
    { n: 18, t: 'Translating Nuance Between Russian, Hindi & English', ru: 'Теория и практика перевода (русский–хинди–английский)', lessons: [] },
    { n: 19, t: 'Contemporary Russian Essays & Debates', ru: 'Современная публицистика и дебаты', lessons: [] },
    { n: 20, t: 'B2 Capstone Synthesis & TRKI-2 Benchmark Assessment', ru: 'Итоговый синтез и тест уровня B2', lessons: [], assess: 'quiz-b2-mastery' },
  ].map((m) => ({
    id: `mod-b2-${m.n}`,
    levelId: 'b2' as const,
    order: m.n,
    title: `Module ${m.n}: ${m.t}`,
    titleRu: m.ru,
    summary:
      m.lessons.length > 0
        ? `Includes full B2 seminar lesson covering ${m.t}.`
        : `Planned B2 seminar module covering ${m.t}.`,
    learningOutcomes: [`Demonstrate upper-intermediate precision in ${m.t.toLowerCase()}`],
    lessonIds: m.lessons,
    plannedTopics: m.lessons.length === 0 ? [`Stylistic analysis, authentic reading, and essay tasks on ${m.t}`] : undefined,
    assessmentId: m.assess,
  })),
];

export const SCHOOL_WHY_LEARN_PILLARS = [
  {
    title: 'Structured Learning Paths',
    titleRu: 'Системная программа A0–C2',
    desc: 'Every concept builds deliberately from the 33 Cyrillic letters and phonology through B2+ discourse aligned with CEFR & TORFL/TRKI descriptors.',
  },
  {
    title: 'Practical Communication',
    titleRu: 'Живое общение с первого дня',
    desc: 'Realistic university, city, airport, café, and cultural dialogues prepare you for real conversations in Moscow, Saint Petersburg, or anywhere Russian is spoken.',
  },
  {
    title: 'Experienced Faculty Leadership',
    titleRu: 'Опытный преподаватель',
    desc: 'Guided by Sarika Kumari (Head of Project & Russian Language Teacher), bridging Russian linguistics cleanly for Indian and international learners.',
  },
  {
    title: 'Grammar Explained Clearly',
    titleRu: 'Понятная грамматика без зубрёжки',
    desc: 'Cases, aspects, and motion verbs presented visually with structured tables, exceptions, and side-by-side "Common Mistakes Made by Indian Learners".',
  },
  {
    title: 'Cultural Immersion',
    titleRu: 'Язык сквозь культуру',
    desc: 'Learn names, patronymics, ты/вы etiquette, Pushkin, Tolstoy, festivals, and authentic Indo-Russian literary dialogues alongside vocabulary.',
  },
  {
    title: 'Reading & Listening Lab',
    titleRu: 'Чтение и аудирование',
    desc: 'Graded library texts from A1 to C2 with side-by-side English and Hindi support, stress marks, clickable vocabulary, and speech synthesis.',
  },
  {
    title: 'Active Checkpoints & Feedback',
    titleRu: 'Контроль знаний и обратная связь',
    desc: 'Placement testing, multi-format exercises, module checks, and teacher-reviewed writing exercises.',
  },
  {
    title: 'Personal Progress Tracking',
    titleRu: 'Личный кабинет студента',
    desc: 'Resume exactly where you paused, review spaced-repetition vocabulary cards, bookmark readings, and track completed modules.',
  },
];

export const SCHOOL_FAQ_ITEMS = [
  {
    q: 'Do I need any prior knowledge of Russian or Cyrillic to start?',
    a: 'No. Level 0 (A0 / Pre-A1) is built for complete beginners. You start with our interactive 33-letter Cyrillic & Pronunciation Academy before unlocking Level A1 grammar.',
  },
  {
    q: 'Can I skip the Alphabet module if I already read Russian?',
    a: 'Yes! Take our Placement Test in the Assessments tab or score at least 75% on the Alphabet Mastery Quiz to jump directly into A1, A2, B1, or B2.',
  },
  {
    q: 'Is this course helpful for Indian students preparing to study in Russia?',
    a: 'Yes. In addition to general Russian (A0–B2), our "Russian for Life and Study in Russia" track teaches campus, hostel, immigration, metro, banking, supermarket, classroom, and etiquette communication specifically tailored for Indian and international students.',
  },
  {
    q: 'Do certificates from this school count as an official Russian state TRKI/TORFL certificate?',
    a: 'No—and we state that transparently everywhere. Our syllabus is carefully aligned with CEFR and TORFL/TRKI benchmarks, and students earn downloadable completion certificates from Soul of Russia and India when authorized by our faculty, whereas official state TRKI exams must be taken at accredited testing centers.',
  },
  {
    q: 'How do audio pronunciation and Hindi explanations work?',
    a: 'Lessons include stress marks (\u0301), IPA transcription, browser Web Speech API Russian (ru-RU) playback with speed control (0.7x, 0.85x, 1.0x), optional native audio files uploaded by teachers, and linguistically honest Hindi/English notes that explain differences rather than misleading approximations.',
  },
];

export const INITIAL_SCHOOL_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: 'ann-welcome-2026',
    title: 'Welcome to the School of Foreign Languages – Russian',
    body: 'Start with Level 0 Alphabet Academy if you are new to Cyrillic, or take the Placement Test to find your CEFR entry level (A1–B2). Guided by teacher Sarika Kumari.',
    levelId: 'All Levels',
    authorName: 'Sarika Kumari',
    date: '2026',
    isPublished: true,
  },
  {
    id: 'ann-life-in-russia',
    title: 'New Track: Russian for Life & Study in Russia',
    body: 'Preparing for Moscow, Saint Petersburg, Kazan, or Novosibirsk universities? Explore our 8 survival communication modules covering airports, hostels, classrooms, banking, and cultural etiquette.',
    levelId: 'Practical Track',
    authorName: 'School Faculty',
    date: '2026',
    isPublished: true,
  },
];
