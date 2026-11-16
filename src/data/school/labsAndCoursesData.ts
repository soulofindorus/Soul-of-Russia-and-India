import {
  AssessmentQuiz,
  CultureBridgeLesson,
  GrammarTopicGuide,
  LessonVocabularyItem,
  LifeInRussiaModule,
  SchoolLesson,
  VideoReference,
} from '../../types/school';
import { LESSONS_A0_TO_A1 } from './lessonsA0ToA1';
import { LESSONS_A2_TO_B2 } from './lessonsA2ToB2';

export const ALL_BUNDLED_LESSONS: SchoolLesson[] = [
  ...LESSONS_A0_TO_A1,
  ...LESSONS_A2_TO_B2,
];

// =========================================================================
// 1. GRAMMAR LAB GUIDES (A1 – B2)
// =========================================================================

export const GRAMMAR_LAB_GUIDES: GrammarTopicGuide[] = [
  {
    id: 'gram-a1-gender-plurals',
    levelId: 'a1',
    title: 'Noun Gender, Agreement & the 7-Letter Spelling Rule',
    titleRu: 'Род существительных, множественное число и орфографическое правило',
    summary:
      'Every Russian noun is Masculine (он), Feminine (она), or Neuter (оно) by its dictionary ending. Possessives, adjectives, and past-tense verbs must all agree with this gender.',
    steps: [
      {
        heading: '1. Identifying Noun Gender at a Glance',
        explanation:
          'Masculine nouns usually end in a hard consonant (брат, стол) or -й (музей). Feminine nouns end in -а / -я (книга, семья). Neuter nouns end in -о / -е (окно, море) or -мя (время, имя).',
        examples: [
          { ru: 'мой но́вый го́род (м.р.)', translit: 'moy novyy gorod', en: 'my new city', hi: 'मेरा नया शहर' },
          { ru: 'моя́ интере́сная кни́га (ж.р.)', translit: 'moya interesnaya kniga', en: 'my interesting book', hi: 'मेरी रोचक किताब' },
          { ru: 'моё тёплое мо́ре (ср.р.)', translit: 'moyo tyoploe more', en: 'my warm sea', hi: 'मेरा गरम समुद्र' },
        ],
      },
      {
        heading: '2. Nouns Ending in -Ь & Natural Male Relatives',
        explanation:
          'Nouns ending in a soft sign (-ь) can be masculine (словарь, день, преподаватель) or feminine (ночь, тетрадь, дверь, площадь). Meanwhile, па́па, де́душка, дя́дя refer to male people and remain Masculine despite ending in -а!',
        examples: [
          { ru: 'до́брый па́па (masc.)', translit: 'dobryy papa', en: 'kind father', hi: 'दयालु पिताजी' },
          { ru: 'больша́я пло́щадь (fem.)', translit: 'bolshaya ploshchad', en: 'large square', hi: 'बड़ा चौक' },
        ],
      },
      {
        heading: '3. Regular Plurals & the 7-Letter Spelling Rule',
        explanation:
          'Masculine & Feminine nouns take -ы (hard) or -и (soft). HOWEVER, after к, г, х, ж, ш, ч, щ, NEVER write ы — always write и (кни́га → кни́ги, ру́чка → ру́чки, това́рищ → това́рищи). Note also the stressed masculine -а plurals: го́род → города́, до́м → дома́, па́спорт → паспорта́.',
        examples: [
          { ru: 'студе́нт → студе́нты', translit: 'student -> studenty', en: 'student -> students', hi: 'छात्र' },
          { ru: 'кни́га → кни́ги (7-letter rule)', translit: 'kniga -> knigi', en: 'book -> books', hi: 'किताबें' },
          { ru: 'го́род → города́ (mobile stress)', translit: 'gorod -> goroda', en: 'city -> cities', hi: 'शहर' },
        ],
      },
    ],
    tables: [
      {
        title: 'Gender & Possessive Quick Matrix',
        headers: ['Gender', 'Pronoun', 'Noun Ending', 'Possessive (my / our)', 'Plural Pattern'],
        rows: [
          ['Masculine (Мужской)', 'он', 'consonant, -й, -ь', 'мой, наш', '-ы / -и (-а́ exceptions)'],
          ['Feminine (Женский)', 'она', '-а, -я, -ь', 'моя́, на́ша', '-ы / -и'],
          ['Neuter (Средний)', 'оно', '-о, -е, -мя', 'моё, на́ше', '-а / -я'],
        ],
      },
    ],
    comparisons: [
      {
        title: 'Neuter -о/-е vs. Feminine -а/-я Plurals',
        formA: 'о́кна (windows, pl.) / моря́ (seas, pl.)',
        formB: 'города́ (cities, masc. pl.)',
        explanation:
          'Neuter nouns always end in -а/-я in the plural (письмо́ → пи́сьма). A smaller group of high-frequency masculine nouns (до́м, го́род, па́спорт, ве́чер, гла́з) also take stressed -а́.',
      },
    ],
    indianLearnerMistakes: [
      {
        mistake: 'Treating па́па or дя́дя as feminine because of -а ending.',
        whyItHappens: 'Visual over-reliance on the ending -а overrides biological gender.',
        correction: 'Always say «мо́й па́па», «на́ш де́душка», never «моя папа».',
      },
      {
        mistake: 'Writing «книгы» or «студенткы» with -ы after к/г.',
        whyItHappens: 'Applying the default hard plural ending -ы mechanically after velars.',
        correction: 'Remember the 7-letter guard (г, к, х, ж, ш, ч, щ): always write И (кни́ги, де́вушки).',
      },
    ],
    exercises: [
      {
        id: 'gl-a1-1',
        type: 'multiple-choice',
        prompt: 'Choose the correct phrase for "my new passport":',
        options: ['моя́ но́вая па́спорт', 'мо́й но́вый па́спорт', 'моё но́вое па́спорт'],
        correctAnswer: 'мо́й но́вый па́спорт',
        explanation: 'Па́спорт ends in a consonant (masculine), so it takes мо́й and но́вый.',
      },
      {
        id: 'gl-a1-2',
        type: 'multiple-choice',
        prompt: 'What is the correct plural of «кни́га» (book)?',
        options: ['кни́гы', 'кни́ги', 'кни́га'],
        correctAnswer: 'кни́ги',
        explanation: 'By the 7-letter spelling rule, write и (not ы) after г.',
      },
      {
        id: 'gl-a1-3',
        type: 'multiple-choice',
        prompt: 'Select the right plural form of «го́род» (city):',
        options: ['го́роды', 'го́роди', 'города́'],
        correctAnswer: 'города́',
        explanation: 'Го́род belongs to the masculine stressed -а́ plural group: города́.',
      },
    ],
  },
  {
    id: 'gram-a2-six-cases',
    levelId: 'a2',
    title: 'The Complete Six-Case System (Singular & Plural Map)',
    titleRu: 'Система шести падежей русского языка',
    summary:
      'Russian uses six grammatical cases so word order can remain flexible without losing who acts, who receives, who owns, or where something sits.',
    steps: [
      {
        heading: '1. Why Six Cases Exist (Analogy with Hindi Postpositions)',
        explanation:
          'Hindi uses postpositions placed AFTER the noun (दिल्ली में, दोस्त को, किताब का, कलम से). Russian folds that exact role directly onto the noun and adjective ENDINGS.',
        examples: [
          { ru: 'Я в Де́ли / в Москве́ (Prep.)', translit: 'Ya v Deli / v Moskve', en: 'I am in Delhi / Moscow', hi: 'मैं दिल्ली / मॉस्को में हूँ' },
          { ru: 'Я даю́ кни́гу дру́гу (Acc. + Dat.)', translit: 'Ya dayu knigu drugu', en: 'I give a book to my friend', hi: 'मैं दोस्त को किताब देता हूँ' },
          { ru: 'Я пишу́ ру́чкой (Instr.)', translit: 'Ya pishu ruchkoy', en: 'I write with a pen', hi: 'मैं कलम से लिखता हूँ' },
        ],
      },
      {
        heading: '2. Essential Preposition–Case Pairings',
        explanation:
          'в / на + Prepositional = Static location (где?). в / на + Accusative = Destination/Direction (куда?). из / с / у / от / без / для + Genitive. к / по + Dative. с (with companion) + Instrumental.',
        examples: [
          { ru: 'Я иду́ в университе́т (Acc. — direction).', translit: 'Ya idu v universitet.', en: 'I am going into the university.', hi: 'मैं विश्वविद्यालय जा रहा हूँ।' },
          { ru: 'Я сейча́с в университе́те (Prep. — location).', translit: 'Ya seychas v universitete.', en: 'I am at the university right now.', hi: 'मैं अभी विश्वविद्यालय में हूँ।' },
        ],
      },
    ],
    tables: [
      {
        title: 'Summary of the Six Russian Cases (Singular Hard Stems)',
        headers: ['Case (Падеж)', 'Questions', 'Masc. (брат/стол)', 'Fem. (сестра/книга)', 'Neut. (окно)', 'Core Function'],
        rows: [
          ['1. Nominative (Имени́тельный)', 'кто? что?', 'стол / брат', 'кни́га / сестра́', 'окно́', 'Subject of the verb; dictionary form'],
          ['2. Genitive (Роди́тельный)', 'кого́? чего́?', 'стола́ / бра́та', 'кни́ги / сестры́', 'окна́', 'Possession, negation (нет), origin (из), numbers'],
          ['3. Dative (Да́тельный)', 'кому́? чему́?', 'столу́ / бра́ту', 'кни́ге / сестре́', 'окну́', 'Recipient, age (мне 20 лет), feelings (мне нра́вится)'],
          ['4. Accusative (Вини́тельный)', 'кого́? что?', 'стол / бра́та*', 'кни́гу / сестру́', 'окно́', 'Direct object, motion toward (в/на), days'],
          ['5. Instrumental (Твори́тельный)', 'ке́м? че́м?', 'столо́м / бра́том', 'кни́гой / сестро́й', 'окно́м', 'Tool, with (с + Instr.), profession after быть/стать'],
          ['6. Prepositional (Предло́жный)', 'о ко́м? о чём? где?', 'в столе́ / о бра́те', 'в кни́ге / о сестре́', 'в окне́', 'Location (в/на), topic (о/об)'],
        ],
      },
    ],
    comparisons: [
      {
        title: 'Inanimate vs. Animate Masculine Accusative',
        formA: 'Я ви́жу но́вый сто́л (inanimate)',
        formB: 'Я ви́жу но́вого студе́нта (animate)',
        explanation:
          'For inanimate masculine singular nouns, Accusative equals Nominative. For living masculine beings (лю́ди/живо́тные), Accusative adopts the Genitive ending (-а/-я, adjective -ого/-его).',
      },
    ],
    indianLearnerMistakes: [
      {
        mistake: 'Saying «Я живу́ в Москва́» instead of «в Москве́».',
        whyItHappens: 'Forgetting to shift the dictionary nominative after static preposition в.',
        correction: 'Always put feminine -а nouns into -е after static в/на: в Москве́, в И́ндии, на по́чте.',
      },
      {
        mistake: 'Using Nominative after «нет»: «У меня́ не́т время».',
        whyItHappens: 'Hindi has no case change after नहीं; Russian requires Genitive of absence.',
        correction: 'Use Genitive: «У меня́ не́т вре́мени», «У меня́ не́т биле́та».',
      },
    ],
    exercises: [
      {
        id: 'gl-a2-1',
        type: 'case-ending',
        prompt: 'Complete with the correct case: «Я рабо́таю в Москве́ с мо́им _____ (дру́г).»',
        options: ['дру́га', 'дру́гом', 'дру́гу', 'дру́ге'],
        correctAnswer: 'дру́гом',
        explanation: 'Preposition с ("together with") takes Instrumental case: дру́гом.',
      },
      {
        id: 'gl-a2-2',
        type: 'case-ending',
        prompt: 'Complete: «Сего́дня в библиоте́ке не́т _____ (на́ш преподава́тель).»',
        options: ['на́шего преподава́теля', 'на́шему преподава́телю', 'на́ш преподава́тель'],
        correctAnswer: 'на́шего преподава́теля',
        explanation: 'Не́т (absence) always governs the Genitive case.',
      },
      {
        id: 'gl-a2-3',
        type: 'multiple-choice',
        prompt: 'Which preposition triggers Accusative when you say "I am walking TO the park"?',
        options: ['Я иду́ в па́рке', 'Я иду́ в па́рк', 'Я иду́ у па́рка'],
        correctAnswer: 'Я иду́ в па́рк',
        explanation: 'Motion toward a destination (куда?) uses в/на + Accusative (в па́рк).',
      },
    ],
  },
  {
    id: 'gram-a2-aspect-motion',
    levelId: 'a2',
    title: 'Verbal Aspect (НСВ vs. СВ) & Unprefixed Verbs of Motion',
    titleRu: 'Виды глагола и бесприставочные глаголы движения',
    summary:
      'Understanding why nearly every Russian verb comes in an Imperfective/Perfective pair, and how Идти/Ходить & Ехать/Ездить distinguish one-way motion in progress from habitual round trips.',
    steps: [
      {
        heading: '1. Imperfective (НСВ) vs. Perfective (СВ)',
        explanation:
          'Imperfective describes ongoing process, habit, duration, or simple naming of an activity (вчера́ я два часа́ чита́л). Perfective highlights completion, a single concrete result, or sequential actions (я уже́ прочита́л кни́гу). Note: Perfective verbs have NO present tense—conjugated СВ verbs mean simple future!',
        examples: [
          { ru: 'Я весь ве́чер писа́л письмо́ (НСВ — process).', translit: 'Ya ves vecher pisal pismo.', en: 'I spent the evening writing the letter.', hi: 'मैं पूरी शाम पत्र लिखता रहा।' },
          { ru: 'Я наконе́ц написа́л письмо́ (СВ — completed result).', translit: 'Ya nakonets napisal pismo.', en: 'I finally finished writing the letter.', hi: 'मैंने आखिरकार पत्र लिख दिया।' },
          { ru: 'Я за́втра прочита́ю э́ту статью́ (СВ future).', translit: 'Ya zavtra prochitayu etu statyu.', en: 'I will finish reading this article tomorrow.', hi: 'मैं कल यह लेख पढ़ लूँगा।' },
        ],
      },
      {
        heading: '2. Unprefixed Verbs of Motion: On Foot vs. By Transport',
        explanation:
          'Unlike English "to go", Russian separates motion ON FOOT (идти́ / ходи́ть) from motion BY VEHICLE (е́хать / е́здить). Furthermore, unidirectional verbs (идти́, е́хать) denote moving in ONE direction right now, while multidirectional verbs (ходи́ть, е́здить) denote habits, round trips, or wandering.',
        examples: [
          { ru: 'Сейча́с я иду́ на ле́кцию (right now, on foot).', translit: 'Seychas ya idu na lektsiyu.', en: 'I am walking to the lecture right now.', hi: 'मैं अभी लेक्चर के लिए पैदल जा रहा हूँ।' },
          { ru: 'Ка́ждый день я хожу́ в университе́т (habit, round trip).', translit: 'Kazhdyy den ya khozhu v universitet.', en: 'Every day I walk to the university.', hi: 'मैं रोज़ विश्वविद्यालय जाता हूँ।' },
        ],
      },
    ],
    tables: [
      {
        title: 'Core Aspect Signal Triggers & Unprefixed Motion Pairs',
        headers: ['Concept', 'Imperfective / Multidirectional', 'Perfective / Unidirectional', 'Typical Signal Words'],
        rows: [
          ['Aspect in Action', 'чита́ть, писа́ть, де́лать', 'прочита́ть, написа́ть, сде́лать', 'долго, обычно, всегда (НСВ) vs. уже, вдруг, сразу (СВ)'],
          ['Motion on Foot', 'ходи́ть (round trip / habit)', 'идти́ (one direction now)', 'ка́ждый де́нь (ходить) vs. сейча́с (идти)'],
          ['Motion by Vehicle', 'е́здить (round trip / habit)', 'е́хать (one direction now)', 'ле́том мы е́здили в Со́чи vs. я е́ду в метро́'],
        ],
      },
    ],
    comparisons: [
      {
        title: 'Past Tense Round Trip: Ходи́л vs. Пошёл',
        formA: 'Вчера́ мы ходи́ли в музе́й.',
        formB: 'Вчера́ он пошёл в музе́й (и ещё там).',
        explanation:
          'Ходи́ли / е́здили implies "went AND returned". Пошёл / поехал focuses on setting off in one direction (possibly still there or leading to the next action).',
      },
    ],
    indianLearnerMistakes: [
      {
        mistake: 'Saying «Я вчера́ ходи́л в Москву́ из Де́ли».',
        whyItHappens: 'Forgetting that ходи́ть strictly means walking on foot (unless idioms like ходят поезда).',
        correction: 'For cities or distant travel, use vehicle/flight verbs: «Я е́здил / лета́л в Москву́».',
      },
    ],
    exercises: [
      {
        id: 'gl-a2-asp-1',
        type: 'multiple-choice',
        prompt: '«Он уже́ _____ (finished writing) э́тот докла́д.»',
        options: ['писа́л', 'написа́л', 'пи́шет'],
        correctAnswer: 'написа́л',
        explanation: 'Уже́ (already) paired with a completed single outcome requires Perfective написа́л.',
      },
      {
        id: 'gl-a2-asp-2',
        type: 'multiple-choice',
        prompt: '«Обы́чно на ле́кции студе́нты _____ на метро́.»',
        options: ['е́дут', 'е́здят', 'иду́т'],
        correctAnswer: 'е́здят',
        explanation: 'Обы́чно (habitually by transport) calls for multidirectional е́здить → е́здят.',
      },
    ],
  },
  {
    id: 'gram-b1-prefixed-participles',
    levelId: 'b1',
    title: 'Prefixed Verbs of Motion & Participles / Verbal Adverbs (B1)',
    titleRu: 'Приставочные глаголы движения, причастия и деепричастия',
    summary:
      'Spatial prefixes (при-, у-, в-, вы-, под-, от-, пере-, до-) give precise directional geometry, while participles and деепричастия condense complex written sentences.',
    steps: [
      {
        heading: '1. Spatial Prefixes on Ходить/Идти & Ездить/Ехать',
        explanation:
          'Adding a prefix turns the multidirectional verb (приходить, приезжать) into IMPERFECTIVE, and the unidirectional verb (прийти́, прие́хать) into PERFECTIVE!',
        examples: [
          { ru: 'при- (arrival): Студе́нт прие́хал из И́ндии.', translit: 'Student priyekhal iz Indii.', en: 'The student arrived from India.', hi: 'छात्र भारत से आ पहुँचा।' },
          { ru: 'в- / во- (entering): Преподава́тель вошёл в аудито́рию.', translit: 'Prepodavatel voshyol v auditoriyu.', en: 'The lecturer entered the lecture hall.', hi: 'शिक्षक कक्षा में दाखिल हुए।' },
          { ru: 'пере- (crossing): Мы перешли́ че́рез у́лицу.', translit: 'My pereshli cherez ulitsu.', en: 'We crossed the street.', hi: 'हमने सड़क पार की।' },
        ],
      },
      {
        heading: '2. Participles (Причастия) & Verbal Adverbs (Деепричастия)',
        explanation:
          'Participles replace «который + verb» (студе́нт, изуча́ющий ру́сский язы́к = student who studies Russian). Verbal adverbs (чита́я / прочита́в) replace «когда я читал / после того как я прочитал» when BOTH clauses share the same subject!',
        examples: [
          { ru: 'кни́га, напи́санная Толсты́м', translit: 'kniga, napisannaya Tolstoym', en: 'the book written by Tolstoy', hi: 'टॉल्स्टॉय द्वारा लिखी गई किताब' },
          { ru: 'Прочита́в письмо́, он улыбну́лся.', translit: 'Prochitav pismo, on ulybnulsya.', en: 'Having read the letter, he smiled.', hi: 'पत्र पढ़कर वह मुस्कुराया।' },
        ],
      },
    ],
    tables: [
      {
        title: 'Key B1 Spatial Prefixes',
        headers: ['Prefix', 'Spatial Meaning', 'Pair (НСВ / СВ)', 'Preposition Pair'],
        rows: [
          ['при-', 'Arrival at destination', 'приходи́ть / прийти́', 'в / на (+ Acc.) or из (+ Gen.)'],
          ['у-', 'Departure away', 'уходи́ть / уйти́', 'из / с (+ Gen.)'],
          ['в- (во-)', 'Entering an enclosed space', 'входи́ть / войти́', 'в (+ Acc.)'],
          ['вы-', 'Exiting an enclosed space', 'выходи́ть / выйти́', 'из (+ Gen.)'],
          ['пере-', 'Crossing from one side to other', 'переходи́ть / перейти́', 'че́рез (+ Acc.) or Prep.'],
          ['под- / от-', 'Approaching closely / stepping away', 'подходи́ть / отходи́ть', 'к (+ Dat.) / от (+ Gen.)'],
        ],
      },
    ],
    comparisons: [
      {
        title: 'Active Participle (-ущ-/-ющ-) vs. Passive Past Participle (-нн-/-т-)',
        formA: 'дру́г, присла́вший письмо́ (friend who sent the letter)',
        formB: 'письмо́, при́сланное дру́гом (letter sent by the friend)',
        explanation:
          'Active participles describe the DOER of the action; passive participles describe the OBJECT acted upon, often placing the doer in the Instrumental case without a preposition.',
      },
    ],
    indianLearnerMistakes: [
      {
        mistake: 'Using a деепричастие when the two actions have DIFFERENT subjects (e.g., «Войдя в комнату, телефон зазвонил»).',
        whyItHappens: 'In Russian, the subject of the main verb MUST be the exact actor of the деепричастие—otherwise it implies "the phone entered the room"!',
        correction: 'If subjects differ, use «Когда́ я вошёл в ко́мнату, зазвони́л телефо́н».',
      },
    ],
    exercises: [
      {
        id: 'gl-b1-1',
        type: 'multiple-choice',
        prompt: '«Делега́ция вчера́ _____ в Санкт-Петербу́рг.» (arrived by transport, single completed event)',
        options: ['прие́хала', 'приезжа́ла', 'пришла́'],
        correctAnswer: 'прие́хала',
        explanation: 'Transport arrival at a distant city uses приезжать/приехать; single completed arrival is Perfective прие́хала.',
      },
      {
        id: 'gl-b1-2',
        type: 'multiple-choice',
        prompt: 'Choose the grammatically valid sentence with a деепричастие:',
        options: [
          'Слу́шая му́зыку, у меня́ улучша́ется настрое́ние.',
          'Слу́шая му́зыку, я всегда́ отдыха́ю.',
        ],
        correctAnswer: 'Слу́шая му́зыку, я всегда́ отдыха́ю.',
        explanation: 'Both "listening" and "resting" share the subject «я».',
      },
    ],
  },
  {
    id: 'gram-b2-register-syntax',
    levelId: 'b2',
    title: 'Functional Styles, Aspectual Competition & Theme–Rheme Word Order (B2)',
    titleRu: 'Функциональные стили, конкуренция видов и порядок слов',
    summary:
      'Move from "correct Russian" to authentic academic, journalistic, and literary precision by controlling information focus (тема/рема), nominalizations, and subtle aspectual choices.',
    steps: [
      {
        heading: '1. Theme (Known Info) vs. Rheme (New Focus)',
        explanation:
          'While Russian cases allow flexible word order, placing a word at the VERY END of a neutral written sentence makes it the NEW focal information (Рема). Compare: «Л. Н. Толсто́й переписывался с Ганди» (New info: with Gandhi) vs. «С Ганди переписывался Л. Н. Толсто́й» (New info: WHO corresponded? Tolstoy!).',
        examples: [
          { ru: 'За́втра конфере́нция откро́ется в университе́те.', translit: 'Zavtra konferentsiya otkroyetsya v universitete.', en: 'Tomorrow the conference opens AT THE UNIVERSITY (focus on where).', hi: 'कल सम्मेलन विश्वविद्यालय में शुरू होगा।' },
          { ru: 'В университе́те за́втра откро́ется конфере́нция.', translit: 'V universitete zavtra otkroyetsya konferentsiya.', en: 'At the university tomorrow, A CONFERENCE will open (focus on what).', hi: 'विश्वविद्यालय में कल एक सम्मेलन शुरू होगा।' },
        ],
      },
      {
        heading: '2. Aspectual Nuances: General-Factual НСВ vs. Annulled Action',
        explanation:
          'When asking whether an action ever occurred ("Вы чита́ли «Войну́ и ми́р»?") or stating a general fact without caring about completion focus, native speakers use Imperfective (общефактическое значение НСВ). Similarly, «Я открыва́л окно́» can mean "I opened the window (and later closed it again)"—an annulled result.',
        examples: [
          { ru: 'Вы уже́ быва́ли в Петерго́фе? — Да, бы́л.', translit: 'Vy uzhe byvali v Petergofe?', en: 'Have you ever been to Peterhof?', hi: 'क्या आप कभी पेतेरगोफ़ गए हैं?' },
          { ru: 'Кто открыва́л окно́? В ко́мнате прохла́дно.', translit: 'Kto otkryval okno?', en: 'Who opened the window earlier (it’s closed again now, yet chilly)?', hi: 'खिड़की किसने खोली थी?' },
        ],
      },
    ],
    tables: [
      {
        title: 'Register Shifts Across Functional Styles (B2)',
        headers: ['Meaning', 'Conversational (Разговорный)', 'Journalistic / Essay', 'Academic / Scientific'],
        rows: [
          ['Because of', 'потому́ что', 'ввиду́ того́ что / благоря́', 'всле́дствие того́ что'],
          ['To decide', 'реши́ть / наду́мать', 'приня́ть реше́ние', 'бы́ло приня́то реше́ние (passive)'],
          ['About / Regarding', 'про (+ Acc.) / о (+ Prep.)', 'каса́тельно / в отноше́нии', 'относи́тельно / примени́тельно к'],
        ],
      },
    ],
    comparisons: [
      {
        title: 'Preposition благодаря́ (+ Dat.) vs. из-за (+ Gen.)',
        formA: 'Благодаря́ ва́шей по́мощи проект уда́лся. (Positive cause)',
        formB: 'Из-за си́льного дождя́ ре́йс задержа́ли. (Negative obstacle)',
        explanation:
          'Never use благодаря́ for negative misfortunes ("thanks to the traffic jam") in standard B2 prose; reserve благодаря́ + Dative strictly for positive enabling factors and из-за + Genitive for hindrances.',
      },
    ],
    indianLearnerMistakes: [
      {
        mistake: 'Overusing «благодаря» for negative outcomes («благодаря болезни я не пришёл»).',
        whyItHappens: 'Literal mental glossing or confusing cause prepositions.',
        correction: 'Use «из-за боле́зни» (negative) and save «благодаря́ поддер́жке» for positive causes.',
      },
    ],
    exercises: [
      {
        id: 'gl-b2-1',
        type: 'multiple-choice',
        prompt: 'Select the formal sentence honoring positive cause semantics:',
        options: [
          'Благодаря́ си́льному моро́зу по́езд опозда́л.',
          'Благодаря́ соде́йствию преподава́телей студе́нты успе́шно защити́ли дипло́м.',
          'Из-за усердной по́мощи друзей он победил.',
        ],
        correctAnswer: 'Благодаря́ соде́йствию преподава́телей студе́нты успе́шно защити́ли дипло́м.',
        explanation: 'Благодаря́ requires Dative and conveys a positive outcome.',
      },
      {
        id: 'gl-b2-2',
        type: 'multiple-choice',
        prompt: 'What does «Кто-то уже́ бра́л мо́й слова́рь?» express with Imperfective «бра́л»?',
        options: [
          'A prolonged 3-hour process',
          'General factual / annulled action (the dictionary was taken and returned/moved)',
          'Future expectation',
        ],
        correctAnswer: 'General factual / annulled action (the dictionary was taken and returned/moved)',
        explanation: 'Imperfective past бра́л here indicates a past action whose physical state has since reversed or focuses purely on whether it happened.',
      },
    ],
  },
];

// =========================================================================
// 2. EXTRA VOCABULARY LAB BANK (merged dynamically with Lesson vocab)
// =========================================================================

export const EXTRA_VOCABULARY_BANK: LessonVocabularyItem[] = [
  {
    id: 'vlab-a0-spasibo',
    word: 'спасибо',
    stressed: 'спаси́бо',
    translit: 'spasibo',
    partOfSpeech: 'interjection',
    pronunciation: '[spɐˈsʲibə]',
    english: 'thank you',
    hindi: 'धन्यवाद',
    exampleRu: 'Большо́е спаси́бо за ва́шу по́мощь!',
    exampleEn: 'Thank you very much for your help!',
    exampleHi: 'आपकी मदद के लिए बहुत धन्यवाद!',
    topic: 'Politeness & Greetings',
    levelId: 'pre-a1',
  },
  {
    id: 'vlab-a0-pozhaluysta',
    word: 'пожалуйста',
    stressed: 'пожа́луйста',
    translit: 'pozhaluysta',
    partOfSpeech: 'particle / interjection',
    pronunciation: '[pɐˈʐalʊjstə]',
    english: 'please / you are welcome',
    hindi: 'कृपया / आपका स्वागत है',
    exampleRu: 'Скажи́те, пожа́луйста, где метро́?',
    exampleEn: 'Tell me, please, where is the metro?',
    exampleHi: 'कृपया बताइए, मेट्रो कहाँ है?',
    topic: 'Politeness & Greetings',
    levelId: 'pre-a1',
  },
  {
    id: 'vlab-a1-voda',
    word: 'вода',
    stressed: 'вода́',
    translit: 'voda',
    partOfSpeech: 'noun (fem.)',
    pronunciation: '[vɐˈda]',
    english: 'water',
    hindi: 'पानी',
    exampleRu: 'Да́йте, пожа́луйста, стака́н воды́ без га́за.',
    exampleEn: 'Please give me a glass of still water.',
    exampleHi: 'कृपया बिना गैस वाला एक गिलास पानी दीजिए।',
    topic: 'Food & Daily Needs',
    levelId: 'a1',
  },
  {
    id: 'vlab-a1-obshchezhitiye',
    word: 'общежитие',
    stressed: 'общежи́тие',
    translit: 'obshchezhitiye',
    partOfSpeech: 'noun (neut.)',
    pronunciation: '[ɐpɕːɪˈʐɨtʲɪjə]',
    english: 'student dormitory / hostel',
    hindi: 'छात्रावास / हॉस्टल',
    exampleRu: 'На́ше общежи́тие нахо́дится ря́дом с университе́том.',
    exampleEn: 'Our dormitory is located next to the university.',
    exampleHi: 'हमारा हॉस्टल विश्वविद्यालय के पास स्थित है।',
    topic: 'University & Living',
    levelId: 'a1',
  },
  {
    id: 'vlab-a1-prepodavatel',
    word: 'преподаватель',
    stressed: 'преподава́тель',
    translit: 'prepodavatel',
    partOfSpeech: 'noun (masc.)',
    pronunciation: '[prʲɪpədɐˈvatʲɪlʲ]',
    english: 'university lecturer / instructor',
    hindi: 'प्रोफेसर / शिक्षक',
    exampleRu: 'Са́рика Кума́ри — на́ш преподава́тель ру́сского языка́.',
    exampleEn: 'Sarika Kumari is our Russian language teacher.',
    exampleHi: 'सारिका कुमारी हमारी रूसी भाषा की शिक्षिका हैं।',
    topic: 'University & Living',
    levelId: 'a1',
  },
  {
    id: 'vlab-a1-biblioteka',
    word: 'библиотека',
    stressed: 'библиоте́ка',
    translit: 'biblioteka',
    partOfSpeech: 'noun (fem.)',
    pronunciation: '[bʲɪblʲɪɐˈtʲekə]',
    english: 'library',
    hindi: 'पुस्तकालय',
    exampleRu: 'Студе́нты чита́ют кни́ги в библиоте́ке.',
    exampleEn: 'Students read books in the library.',
    exampleHi: 'छात्र पुस्तकालय में किताबें पढ़ते हैं।',
    topic: 'University & Living',
    levelId: 'a1',
  },
  {
    id: 'vlab-a1-slovar',
    word: 'словарь',
    stressed: 'слова́рь',
    translit: 'slovar',
    partOfSpeech: 'noun (masc., Gen. словаря́)',
    pronunciation: '[slɐˈvarʲ]',
    english: 'dictionary',
    hindi: 'शब्दकोश',
    exampleRu: 'Э́то ру́сско-инди́йский слова́рь.',
    exampleEn: 'This is a Russian-Indian dictionary.',
    exampleHi: 'यह एक रूसी-भारतीय शब्दकोश है।',
    topic: 'University & Living',
    levelId: 'a1',
  },
  {
    id: 'vlab-a2-raspisanije',
    word: 'расписание',
    stressed: 'расписа́ние',
    translit: 'raspisaniye',
    partOfSpeech: 'noun (neut.)',
    pronunciation: '[rəspʲɪˈsanʲɪjə]',
    english: 'schedule / timetable',
    hindi: 'समय-सारिणी',
    exampleRu: 'Посмотри́ расписа́ние экза́менов на са́йте.',
    exampleEn: 'Check the exam schedule on the website.',
    exampleHi: 'वेबसाइट पर परीक्षाओं की समय-सारिणी देखें।',
    topic: 'University & Living',
    levelId: 'a2',
  },
  {
    id: 'vlab-a2-bilet',
    word: 'билет',
    stressed: 'биле́т',
    translit: 'bilet',
    partOfSpeech: 'noun (masc.)',
    pronunciation: '[bʲɪˈlʲet]',
    english: 'ticket / exam prompt card',
    hindi: 'टिकट',
    exampleRu: 'Я купи́л биле́т на по́езд Москва́ — Каза́нь.',
    exampleEn: 'I bought a ticket for the Moscow–Kazan train.',
    exampleHi: 'मैंने मॉस्को–कज़ान ट्रेन का टिकट खरीदा।',
    topic: 'Travel & Transit',
    levelId: 'a2',
  },
  {
    id: 'vlab-a2-peresadka',
    word: 'пересадка',
    stressed: 'переса́дка',
    translit: 'peresadka',
    partOfSpeech: 'noun (fem.)',
    pronunciation: '[pʲɪrʲɪˈsatkə]',
    english: 'transfer / connection (metro/flight)',
    hindi: 'बदली / ट्रांसफर',
    exampleRu: 'На ста́нции «Ки́евская» ну́жно сде́лать переса́дку.',
    exampleEn: 'At Kievskaya station you need to make a transfer.',
    exampleHi: 'कीवस्काया स्टेशन पर आपको ट्रेन बदलनी होगी।',
    topic: 'Travel & Transit',
    levelId: 'a2',
  },
  {
    id: 'vlab-a2-vegetarianskiy',
    word: 'вегетарианский',
    stressed: 'вегетариа́нский',
    translit: 'vegetarianskiy',
    partOfSpeech: 'adjective',
    pronunciation: '[vʲɪɡʲɪtərʲɪˈanskʲɪj]',
    english: 'vegetarian',
    hindi: 'शाकाहारी',
    exampleRu: 'У ва́с есть вегетариа́нское блю́до без мя́са?',
    exampleEn: 'Do you have a vegetarian dish without meat?',
    exampleHi: 'क्या आपके पास बिना मांस का कोई शाकाहारी व्यंजन है?',
    topic: 'Food & Daily Needs',
    levelId: 'a2',
  },
  {
    id: 'vlab-b1-registratsiya',
    word: 'регистрация',
    stressed: 'регистра́ция',
    translit: 'registratsiya',
    partOfSpeech: 'noun (fem.)',
    pronunciation: '[rʲɪɡʲɪˈstrat͡sɨjə]',
    english: 'migration registration / check-in',
    hindi: 'पंजीकरण / रजिस्ट्रेशन',
    exampleRu: 'Иностра́нные студе́нты оформля́ют регистра́цию в декана́те.',
    exampleEn: 'International students process migration registration at the dean’s office.',
    exampleHi: 'विदेशी छात्र डीन के कार्यालय में पंजीकरण कराते हैं।',
    topic: 'University & Legal',
    levelId: 'b1',
  },
  {
    id: 'vlab-b1-nauka',
    word: 'исследование',
    stressed: 'иссле́дование',
    translit: 'issledovaniye',
    partOfSpeech: 'noun (neut.)',
    pronunciation: '[ɪˈslʲedəvənʲɪjə]',
    english: 'research / scholarly study',
    hindi: 'अनुसंधान / शोध',
    exampleRu: 'Он прово́дит иссле́дование по исто́рии культу́ры.',
    exampleEn: 'He conducts research on cultural history.',
    exampleHi: 'वे सांस्कृतिक इतिहास पर शोध कर रहे हैं।',
    topic: 'Academic Russian',
    levelId: 'b1',
  },
  {
    id: 'vlab-b2-sotrudnichestvo',
    word: 'сотрудничество',
    stressed: 'сотру́дничество',
    translit: 'sotrudnichestvo',
    partOfSpeech: 'noun (neut.)',
    pronunciation: '[sɐˈtrudnʲɪtɕɪstvə]',
    english: 'cooperation / collaboration',
    hindi: 'सहयोग',
    exampleRu: 'Культу́рное сотру́дничество Росси́и и И́ндии развива́ется.',
    exampleEn: 'Cultural cooperation between Russia and India is growing.',
    exampleHi: 'रूस और भारत के बीच सांस्कृतिक सहयोग बढ़ रहा है।',
    topic: 'Cultural Diplomacy',
    levelId: 'b2',
  },
  {
    id: 'vlab-b2-vzaimoponimaniye',
    word: 'взаимопонимание',
    stressed: 'взаимопонима́ние',
    translit: 'vzaimoponimaniye',
    partOfSpeech: 'noun (neut.)',
    pronunciation: '[vzɐɪməpənʲɪˈmanʲɪjə]',
    english: 'mutual understanding',
    hindi: 'पारस्परिक समझ',
    exampleRu: 'Изуче́ние языка́ укрепля́ет взаимопонима́ние наро́дов.',
    exampleEn: 'Language learning strengthens mutual understanding between peoples.',
    exampleHi: 'भाषा सीखना लोगों के बीच पारस्परिक समझ को मजबूत करता है।',
    topic: 'Cultural Diplomacy',
    levelId: 'b2',
  },
];

// =========================================================================
// 3. RUSSIAN FOR LIFE AND STUDY IN RUSSIA (8 PRACTICAL MODULES)
// =========================================================================

export const LIFE_IN_RUSSIA_MODULES: LifeInRussiaModule[] = [
  {
    id: 'life-1-airport',
    order: 1,
    title: 'Airport Arrival, Passport Control & Migration Card',
    titleRu: 'Аэропорт, паспортный контроль и миграционная карта',
    category: 'Arrival',
    summary:
      'Essential Russian phrases at Sheremetyevo, Domodedovo, Pulkovo, or regional airports: migration cards (миграцио́нная ка́рта), university invitations, customs, and getting an official taxi counter ride.',
    phrases: [
      {
        russian: 'Я прилетел учиться в университет.',
        stressed: 'Я прилете́л учи́ться в университе́т.',
        translit: 'Ya priletel uchitsya v universitet.',
        english: 'I flew here to study at university. (f.: прилете́ла)',
        hindi: 'मैं विश्वविद्यालय में पढ़ने आया हूँ / आई हूँ।',
        context: 'Passport control booth',
      },
      {
        russian: 'Вот мой паспорт, виза и приглашение.',
        stressed: 'Во́т мо́й па́спорт, ви́за и приглаше́ние.',
        translit: 'Vot moy pasport, viza i priglasheniye.',
        english: 'Here is my passport, visa, and invitation letter.',
        hindi: 'यहाँ मेरा पासपोर्ट, वीज़ा और आमंत्रण पत्र है।',
        context: 'Border officer request',
      },
      {
        russian: 'Сохраните миграционную карту!',
        stressed: 'Сохрани́те миграцио́нную ка́рту!',
        translit: 'Sokhranite migratsionnuyu kartu!',
        english: 'Keep your migration card safe! (Never lose this paper slip.)',
        hindi: 'अपना माइग्रेशन कार्ड संभालकर रखें!',
        context: 'Critical border rule',
      },
      {
        russian: 'Где официальная стойка такси или аэроэкспресс?',
        stressed: 'Где официа́льная сто́йка такси́ и́ли аэроэкспре́сс?',
        translit: 'Gde ofitsialnaya stoyka taksi ili aeroekspress?',
        english: 'Where is the official taxi desk or Aeroexpress train?',
        hindi: 'आधिकारिक टैक्सी काउंटर या एयरोएक्सप्रेस कहाँ है?',
        context: 'Arrivals hall',
      },
    ],
    dialogue: {
      title: 'At Moscow Passport Control',
      location: 'Sheremetyevo International Terminal',
      lines: [
        {
          speaker: 'Офицер',
          russian: 'Добрый день. Ваш паспорт и цель визита?',
          stressed: 'До́брый де́нь. Ва́ш па́спорт и це́ль визи́та?',
          translit: 'Dobryy den. Vash pasport i tsel vizita?',
          english: 'Good day. Your passport and purpose of visit?',
          hindi: 'नमस्ते। आपका पासपोर्ट और यात्रा का उद्देश्य?',
        },
        {
          speaker: 'Студент',
          russian: 'Здравствуйте. Я приехал учиться в Москве. Вот виза и письмо из университета.',
          stressed: 'Здра́вствуйте. Я прие́хал учи́ться в Москве́. Во́т ви́за и письмо́ из университе́та.',
          translit: 'Zdravstvuyte. Ya priyekhal uchitsya v Moskve. Vot viza i pismo iz universiteta.',
          english: 'Hello. I came to study in Moscow. Here is my visa and university letter.',
          hindi: 'नमस्ते। मैं मॉस्को में पढ़ने आया हूँ। यह रहा वीज़ा और विश्वविद्यालय का पत्र।',
        },
        {
          speaker: 'Офицер',
          russian: 'Хорошо. Возьмите миграционную карту и не теряйте её.',
          stressed: 'Хорошо́. Возьми́те миграцио́нную ка́рту и не теря́йте её.',
          translit: 'Khorosho. Vozmite migratsionnuyu kartu i ne teryayte yeyo.',
          english: 'Alright. Take your migration card and do not lose it.',
          hindi: 'ठीक है। अपना माइग्रेशन कार्ड लें और इसे न खोएं।',
        },
      ],
    },
    etiquetteAndTips: [
      'Check immediately that your name spelling, passport number, and entry stamp date on the Migration Card are accurate before leaving passport control.',
      'Keep university contact phone numbers offline on paper in case SIM roaming isn’t active at landing.',
    ],
    commonMisunderstanding: {
      situation: 'Unlicensed taxi drivers approaching you inside arrivals.',
      whatHappens: 'Private touts quote inflated cash fares compared to Aeroexpress or app rides (Yandex Go).',
      howToNavigate: 'Politely say «Спаси́бо, не́т» ("No thank you") and head to the official Aeroexpress signs or airport taxi counter.',
    },
  },
  {
    id: 'life-2-hostel',
    order: 2,
    title: 'Hostel Check-In, Immigration Registration & Dean’s Office',
    titleRu: 'Общежитие, регистрация и деканат',
    category: 'University',
    summary:
      'Checking into student dormitories (общежи́тие), completing mandatory migration registration within 7 working days (or university deadline), and speaking with the commandant (коменда́нт).',
    phrases: [
      {
        russian: 'Я новый студент из Индии. Вот ордер на заселение.',
        stressed: 'Я но́вый студе́нт из И́ндии. Во́т о́рдер на заселе́ние.',
        translit: 'Ya novyy student iz Indii. Vot order na zaseleniye.',
        english: 'I am a new student from India. Here is my room assignment slip.',
        hindi: 'मैं भारत से नया छात्र हूँ। यह कमरे की आवंटन पर्ची है।',
        context: 'Hostel commandant office',
      },
      {
        russian: 'Когда нужно оформить регистрацию в паспортном отделе?',
        stressed: 'Когда́ ну́жно офо́рмить регистра́цию в па́спортном отде́ле?',
        translit: 'Kogda nuzhno oformit registratsiyu v pasportnom otdele?',
        english: 'When do I need to process migration registration at the visa office?',
        hindi: 'पासपोर्ट कार्यालय में पंजीकरण कब कराना होगा?',
        context: 'International students department',
      },
      {
        russian: 'Где находится прачечная и общая кухня?',
        stressed: 'Где нахо́дится пра́чечная и о́бщая ку́хня?',
        translit: 'Gde nakhoditsya prachechnaya i obshchaya kukhnya?',
        english: 'Where are the laundry room and shared kitchen?',
        hindi: 'लॉन्ड्री रूम और साझा रसोई कहाँ हैं?',
        context: 'Dorm orientation',
      },
    ],
    dialogue: {
      title: 'Meeting the Hostel Commandant',
      location: 'Student Dormitory Reception',
      lines: [
        {
          speaker: 'Студент',
          russian: 'Здравствуйте! Меня зовут Каран. Я на первый курс.',
          stressed: 'Здра́вствуйте! Меня́ зову́т Кара́н. Я на пе́рвый ку́рс.',
          translit: 'Zdravstvuyte! Menya zovut Karan. Ya na pervyy kurs.',
          english: 'Hello! My name is Karan. I am a first-year student.',
          hindi: 'नमस्ते! मेरा नाम करण है। मैं प्रथम वर्ष का छात्र हूँ।',
        },
        {
          speaker: 'Комендант',
          russian: 'Добро пожаловать! Ваша комната — триста четыре, третий этаж.',
          stressed: 'Добро́ пожа́ловать! Ва́ша ко́мната — три́ста четы́ре, тре́тий эта́ж.',
          translit: 'Dobro pozhalovat! Vasha komnata — trista chetyre, tretiy etazh.',
          english: 'Welcome! Your room is 304, third floor.',
          hindi: 'स्वागत है! आपका कमरा नंबर 304, तीसरी मंजिल पर है।',
        },
      ],
    },
    etiquetteAndTips: [
      'Always carry your Student Pass (про́пуск) when entering/exiting Russian hostels—security guards check passes strictly.',
      'Submit passport + migration card copies to the International Office immediately upon check-in so your registration never lapses.',
    ],
    commonMisunderstanding: {
      situation: 'Leaving the city for a weekend trip resets hotel/hostel registration.',
      whatHappens: 'Staying at a hotel in another city prints a new hotel registration; upon return to Moscow, notify your hostel passport office immediately.',
      howToNavigate: 'Ask «Ну́жно ли обнови́ть регистра́цию по́сле поез́дки?» after every intercity trip.',
    },
  },
  {
    id: 'life-3-metro',
    order: 3,
    title: 'Metro, Buses, Troika Card & Intercity Railways',
    titleRu: 'Метро, карта «Тройка», автобусы и вокзалы',
    category: 'Transit',
    summary:
      'Navigating the Moscow & St. Petersburg metro systems, topping up transport cards (ка́рта «Тро́йка» / «Подоро́жник»), reading platform direction signs, and asking for stops.',
    phrases: [
      {
        russian: 'Пожалуйста, одну карту «Тройка» и пополните на пятьсот рублей.',
        stressed: 'Пожа́луйста, одну́ ка́рту «Тро́йка» и попо́лните на пятьсо́т рубле́й.',
        translit: 'Pozhaluysta, odnu kartu "Troyka" i popolnite na pyatsot rubley.',
        english: 'Please, one Troika card and top it up with 500 rubles.',
        hindi: 'कृपया एक ट्रोइका कार्ड दें और उसमें 500 रूबल रिचार्ज करें।',
        context: 'Metro ticket window',
      },
      {
        russian: 'Вы выходите на следующей остановке?',
        stressed: 'Вы выхо́дите на сле́дующей остано́вке?',
        translit: 'Vy vykhodite na sleduyushchey ostanovke?',
        english: 'Are you getting off at the next stop?',
        hindi: 'क्या आप अगले स्टेशन/स्टॉप पर उतर रहे हैं?',
        context: 'Crowded metro / bus exit',
      },
      {
        russian: 'Переход на кольцевую линию — в центре зала?',
        stressed: 'Перехо́д на кольцеву́ю ли́нию — в це́нтре за́ла?',
        translit: 'Perekhod na koltsevuyu liniyu — v tsentre zala?',
        english: 'Is the transfer to the Circle Line in the center of the hall?',
        hindi: 'क्या सर्कल लाइन के लिए रास्ता हॉल के बीच में है?',
        context: 'Metro platform',
      },
    ],
    dialogue: {
      title: 'Asking for Directions Inside the Metro',
      location: 'Central Metro Interchange',
      lines: [
        {
          speaker: 'Пассажир',
          russian: 'Извините, пожалуйста, как проехать до станции «Университет»?',
          stressed: 'Извини́те, пожа́луйста, ка́к прое́хать до ста́нции «Университе́т»?',
          translit: 'Izvinite, pozhaluysta, kak proyekhat do stantsii "Universitet"?',
          english: 'Excuse me, please, how do I get to Universitet station?',
          hindi: 'माफ कीजिए, युनिवर्सितेत स्टेशन कैसे जाएं?',
        },
        {
          speaker: 'Москвич',
          russian: 'Это красная линия. Прямо три остановки без пересадки.',
          stressed: 'Э́то кра́сная ли́ния. Пря́мо три́ остано́вки бе́з переса́дки.',
          translit: 'Eto krasnaya liniya. Pryamo tri ostanovki bez peresadki.',
          english: 'That is the red line. Straight ahead three stops without changing.',
          hindi: 'यह रेड लाइन है। बिना ट्रेन बदले सीधे तीन स्टॉप।',
        },
      ],
    },
    etiquetteAndTips: [
      'On metro escalators, ALWAYS stand on the right side and leave the left side open for people walking quickly.',
      'Hold the heavy glass metro entry doors for the person behind you so they don’t swing back!',
    ],
    commonMisunderstanding: {
      situation: 'Standing on the left side of a Moscow escalator during rush hour.',
      whatHappens: 'Commuters hurrying to catch a train expect the left lane clear.',
      howToNavigate: 'Step promptly onto the right side («Встава́йте спра́ва, прохо́дите сле́ва»).',
    },
  },
  {
    id: 'life-4-food',
    order: 4,
    title: 'Supermarkets, Cafés & Clear Vegetarian Communication',
    titleRu: 'Магазин, кафе и вегетарианский заказ без ошибок',
    category: 'Daily Life',
    summary:
      'Essential phrases for grocery shopping, university canteens (столо́вая), payment at self-checkouts, and explicitly communicating vegetarian/no-egg/no-meat preferences in Russian.',
    phrases: [
      {
        russian: 'Я вегетарианец. Без мяса, без рыбы и без куриного бульона.',
        stressed: 'Я вегетариа́нец. Бе́з мя́са, бе́з ры́бы и бе́з кури́ного бульо́на.',
        translit: 'Ya vegetarianets. Bez myasa, bez ryby i bez kurinogo bulyona.',
        english: 'I am vegetarian. No meat, no fish, and no chicken broth. (f.: вегетариа́нка)',
        hindi: 'मैं शाकाहारी हूँ। बिना मांस, बिना मछली और बिना चिकन शोरबे के।',
        context: 'Crucial clarification in Russian cafés',
      },
      {
        russian: 'В этом супе есть мясо или мясной бульон?',
        stressed: 'В э́том су́пе е́сть мя́со и́ли мясно́й бульо́н?',
        translit: 'V etom supe yest myaso ili myasnoy bulyon?',
        english: 'Does this soup contain meat or meat broth?',
        hindi: 'क्या इस सूप में मांस या मीट का शोरबा है?',
        context: 'Restaurant menu check',
      },
      {
        russian: 'Пакет нужен? — Нет, спасибо, оплата картой.',
        stressed: 'Паке́т ну́жен? — Не́т, спаси́бо, опла́та ка́ртой.',
        translit: 'Paket nuzhen? — Net, spasibo, oplata kartoy.',
        english: 'Do you need a bag? — No thank you, paying by card.',
        hindi: 'क्या थैली चाहिए? — नहीं धन्यवाद, कार्ड से भुगतान।',
        context: 'Supermarket cashier',
      },
    ],
    dialogue: {
      title: 'Ordering Vegetarian Lunch in a University Столовая',
      location: 'Campus Canteen',
      lines: [
        {
          speaker: 'Студентка',
          russian: 'Здравствуйте! Скажите, пожалуйста, гречка и овощи без мяса?',
          stressed: 'Здра́вствуйте! Скажи́те, пожа́луйста, гре́чка и о́вощи бе́з мя́са?',
          translit: 'Zdravstvuyte! Skazhite, pozhaluysta, grechka i ovoshchi bez myasa?',
          english: 'Hello! Please tell me, are the buckwheat and vegetables meat-free?',
          hindi: 'नमस्ते! कृपया बताइए, क्या कुट्टू और सब्ज़ियाँ बिना मांस की हैं?',
        },
        {
          speaker: 'Повар',
          russian: 'Да, полностью постное блюдо, на растительном масле.',
          stressed: 'Да́, по́лностью по́стное блю́до, на расти́тельном ма́сле.',
          translit: 'Da, polnostyu postnoye blyudo, na rastitelnom masle.',
          english: 'Yes, it is a completely Lenten/vegan dish, cooked in vegetable oil.',
          hindi: 'हाँ, यह पूरी तरह से शाकाहारी/वनस्पति तेल में बना व्यंजन है।',
        },
      ],
    },
    etiquetteAndTips: [
      'Magic keyword in Russian supermarkets and bakeries: «по́стное» (Lenten/plant-based—zero meat, dairy, or eggs!).',
      'Always ask specifically about chicken broth («кури́ный бульо́н») and fish («ры́ба»), as some traditional menus treat chicken or fish separately from red meat («мя́со»).',
    ],
    commonMisunderstanding: {
      situation: 'Assuming "vegetable soup" in Russia is always vegetarian.',
      whatHappens: 'Many soups (like щи or борщ) use beef or chicken stock as their base even when topped with vegetables.',
      howToNavigate: 'Ask explicitly: «Овощно́й су́п на воде́ и́ли на мясно́м бульо́не?» (On water or meat broth?).',
    },
  },
  {
    id: 'life-5-banking-sim',
    order: 5,
    title: 'SIM Card Activation, Bank Card (МИР) & Official Receipts',
    titleRu: 'Сим-карта, банковская карта и документы',
    category: 'Daily Life',
    summary:
      'Getting a local Russian SIM card with your passport, opening a student MIR bank account (ка́рта «Мир»), and asking about commission fees and balance checks.',
    phrases: [
      {
        russian: 'Я хочу купить местную сим-карту для интернета и звонков.',
        stressed: 'Я хочу́ купи́ть ме́стную сим-ка́рту для интерне́та и звонко́в.',
        translit: 'Ya khochu kupit mestnuyu sim-kartu dlya interneta i zvonkov.',
        english: 'I want to buy a local SIM card for data and calls.',
        hindi: 'मैं इंटरनेट और कॉल के लिए स्थानीय सिम कार्ड खरीदना चाहता हूँ।',
        context: 'Mobile carrier store (MTS, Beeline, Megafon, Tele2)',
      },
      {
        russian: 'Какие документы нужны, чтобы открыть банковскую карту?',
        stressed: 'Каки́е докуме́нты нужны́, что́бы откры́ть ба́нковскую ка́рту?',
        translit: 'Kakiye dokumenty nuzhny, chtoby otkryt bankovskuyu kartu?',
        english: 'What documents are needed to open a bank card?',
        hindi: 'बैंक कार्ड खुलवाने के लिए कौन-से दस्तावेज़ चाहिए?',
        context: 'Bank branch',
      },
    ],
    dialogue: {
      title: 'At a Mobile Store & Bank Counter',
      location: 'City Bank Branch',
      lines: [
        {
          speaker: 'Клиент',
          russian: 'Здравствуйте. Мне нужно открыть студенческую карту для стипендии.',
          stressed: 'Здра́вствуйте. Мне́ ну́жно откры́ть студе́нческую ка́рту для стипе́ндии.',
          translit: 'Zdravstvuyte. Mne nuzhno otkryt studencheskuyu kartu dlya stipendii.',
          english: 'Hello. I need to open a student card for my stipend/living expenses.',
          hindi: 'नमस्ते। मुझे अपनी छात्रवृत्ति के लिए एक छात्र बैंक कार्ड खुलवाना है।',
        },
        {
          speaker: 'Специалист',
          russian: 'Покажите, пожалуйста, паспорт, нотариальный перевод и регистрацию.',
          stressed: 'Покажи́те, пожа́луйста, па́спорт, нотариа́льный перево́д и регистра́цию.',
          translit: 'Pokazhite, pozhaluysta, pasport, notarialnyy perevod i registratsiyu.',
          english: 'Please show your passport, notarized translation, and registration.',
          hindi: 'कृपया अपना पासपोर्ट, नोटरीकृत अनुवाद और पंजीकरण दिखाएं।',
        },
      ],
    },
    etiquetteAndTips: [
      'Always carry your passport, migration card, hostel registration slip, and notarized Russian passport translation when visiting banks or mobile offices.',
      'Only buy SIM cards from official branded stores (сало́н свя́зи), never unregistered street kiosks.',
    ],
    commonMisunderstanding: {
      situation: 'Bringing only a photocopy of your passport.',
      whatHappens: 'Russian banks and telecom operators legally require original passport + notarized Russian translation.',
      howToNavigate: 'Ask your university international office where certified notarized translations («нотариа́льный перево́д па́спорта») are done on Day 2.',
    },
  },
  {
    id: 'life-6-classroom',
    order: 6,
    title: 'Inside the University Classroom & Talking with Professors',
    titleRu: 'В аудитории и общение с преподавателем',
    category: 'University',
    summary:
      'Academic Russian for lectures, seminars, asking instructors to repeat slowly, understanding assignments (зачё́т vs. экза́мен), and addressing faculty respectfully.',
    phrases: [
      {
        russian: 'Извините, можно задать вопрос?',
        stressed: 'Извини́те, мо́жно зада́ть вопро́с?',
        translit: 'Izvinite, mozhno zadat vopros?',
        english: 'Excuse me, may I ask a question?',
        hindi: 'माफ कीजिए, क्या मैं एक प्रश्न पूछ सकता हूँ?',
        context: 'During seminar or lecture',
      },
      {
        russian: 'Повторите, пожалуйста, немного медленнее.',
        stressed: 'Повтори́те, пожа́луйста, немно́го ме́дленнее.',
        translit: 'Povtorite, pozhaluysta, nemnogo medlenneye.',
        english: 'Could you please repeat a little more slowly?',
        hindi: 'कृपया थोड़ा धीरे दोहराएं।',
        context: 'When following rapid explanations',
      },
      {
        russian: 'Когда консультация перед экзаменом?',
        stressed: 'Когда́ консульта́ция пе́ред экза́меном?',
        translit: 'Kogda konsultatsiya pered ekzamenom?',
        english: 'When is the pre-exam consultation?',
        hindi: 'परीक्षा से पहले परामर्श (कंसल्टेशन) कब है?',
        context: 'Academic calendar',
      },
    ],
    dialogue: {
      title: 'Speaking with a Professor After Seminar',
      location: 'University Department Hallway',
      lines: [
        {
          speaker: 'Студент',
          russian: 'Елена Сергеевна, здравствуйте! Я хотел уточнить тему домашней работы.',
          stressed: 'Еле́на Серге́евна, здра́вствуйте! Я хоте́л уточни́ть те́му дома́шней рабо́ты.',
          translit: 'Yelena Sergeyevna, zdravstvuyte! Ya khotel utochnit temu domashney raboty.',
          english: 'Hello Elena Sergeyevna! I wanted to clarify the homework topic.',
          hindi: 'नमस्ते येलेना सर्गेयेवना! मैं होमवर्क के विषय को स्पष्ट करना चाहता था।',
        },
        {
          speaker: 'Преподаватель',
          russian: 'Конечно, Анвар. Нужно прочитать две статьи и подготовить тезисы к пятнице.',
          stressed: 'Коне́чно, Анва́р. Ну́жно прочита́ть две́ статьи́ и подгото́вить те́зисы к пя́тнице.',
          translit: 'Konechno, Anvar. Nuzhno prochitat dve statyi i podgotovit tezisy k pyatnitse.',
          english: 'Of course, Anvar. You need to read two articles and prepare thesis points by Friday.',
          hindi: 'बिल्कुल, अनवर। शुक्रवार तक दो लेख पढ़ने हैं और मुख्य बिंदु तैयार करने हैं।',
        },
      ],
    },
    etiquetteAndTips: [
      'Always address university lecturers by First Name + Patronymic (e.g., Ива́н Петро́вич, Са́рика-преподаватель / Еле́на Серге́евна) and use «Вы», NEVER «ты» or "Sir/Ma’am".',
      'Know the difference between «зачё́т» (Pass/Fail credit test) and «экза́мен» (graded 5-point exam where 5 = Отли́чно, 4 = Хорошо́, 3 = Удовлетвори́тельно).',
    ],
    commonMisunderstanding: {
      situation: 'Calling a professor "Teacher!" or "Sir!" directly in Russian.',
      whatHappens: 'Literal translations like «Учи́тель!» or «Сэр!» sound unnatural or awkward in Russian universities.',
      howToNavigate: 'Learn each professor’s First Name + Patronymic on day one, or politely start with «Извини́те, пожа́луйста...».',
    },
  },
  {
    id: 'life-7-pharmacy',
    order: 7,
    title: 'Everyday Pharmacy & Clinic Check-In Basics',
    titleRu: 'Аптека и приём у врача (базовые фразы)',
    category: 'Daily Life',
    summary:
      'Essential everyday communication for asking for common remedies at an апте́ка (pharmacy), reading dosages, booking an appointment, and sharing basic symptoms clearly (non-clinical communication guide).',
    phrases: [
      {
        russian: 'Где ближайшая аптека? Мне нужен термометр и пластырь.',
        stressed: 'Где ближа́йшая апте́ка? Мне́ ну́жен термо́метр и пла́стырь.',
        translit: 'Gde blizhayshaya apteka? Mne nuzhen termometr i plastyr.',
        english: 'Where is the nearest pharmacy? I need a thermometer and band-aids.',
        hindi: 'नज़दीकी मेडिकल स्टोर कहाँ है? मुझे थर्मामीटर और बैंड-एड चाहिए।',
        context: 'Everyday pharmacy errands',
      },
      {
        russian: 'У меня болит голова / горло. Что вы посоветуете без рецепта?',
        stressed: 'У меня́ боли́т голова́ / го́рло. Что́ вы посове́туете бе́з реце́пта?',
        translit: 'U menya bolit golova / gorlo. Chto vy posovetuyete bez retsepta?',
        english: 'I have a headache / sore throat. What over-the-counter item do you recommend?',
        hindi: 'मेरे सिर / गले में दर्द है। बिना प्रिस्क्रिप्शन के आप क्या सुझाएंगे?',
        context: 'Talking to a pharmacist',
      },
      {
        russian: 'У меня есть медицинская страховка.',
        stressed: 'У меня́ е́сть медици́нская страхо́вка.',
        translit: 'U menya yest meditsinskaya strakhovka.',
        english: 'I have student medical insurance.',
        hindi: 'मेरे पास मेडिकल बीमा (इंश्योरेंस) है।',
        context: 'University clinic reception',
      },
    ],
    dialogue: {
      title: 'At the Pharmacy Counter',
      location: 'Neighborhood Аптека',
      lines: [
        {
          speaker: 'Студент',
          russian: 'Здравствуйте. У вас есть капли от насморка и пастилки для горла?',
          stressed: 'Здра́вствуйте. У ва́с е́сть ка́пли от на́сморка и пасти́лки для го́рла?',
          translit: 'Zdravstvuyte. U vas yest kapli ot nasmorka i pastilki dlya gorla?',
          english: 'Hello. Do you have nasal drops and throat lozenges?',
          hindi: 'नमस्ते। क्या आपके पास नाक की ड्रॉप्स और गले की गोलियाँ हैं?',
        },
        {
          speaker: 'Фармацевт',
          russian: 'Да, конечно. Вот эти, принимайте по одной три раза в день после еды.',
          stressed: 'Да́, коне́чно. Во́т э́ти, принима́йте по одно́й три́ ра́за в де́нь по́сле еды́.',
          translit: 'Da, konechno. Vot eti, prinimayte po odnoy tri raza v den posle yedy.',
          english: 'Yes, of course. Here are these—take one three times a day after meals.',
          hindi: 'हाँ, बिल्कुल। इन्हें दिन में तीन बार भोजन के बाद एक-एक लें।',
        },
      ],
    },
    etiquetteAndTips: [
      'Always ask «По́сле еды́ и́ли до еды́?» ("After meals or before meals?") and confirm «Ско́лько ра́з в де́нь?» ("How many times a day?").',
      'Keep your university medical insurance (ДМС полис) and emergency 112/103 numbers saved cleanly in your phone.',
    ],
    commonMisunderstanding: {
      situation: 'Expecting certain antibiotics or strong tablets without a prescription.',
      whatHappens: 'Russian pharmacies strictly enforce «по реце́пту» (prescription-only) rules for antibiotics and specialized medicines.',
      howToNavigate: 'Use your university clinic («студе́нческая поликли́ника») with your student ДМС insurance whenever a doctor consultation or prescription is required.',
    },
  },
  {
    id: 'life-8-winter-etiquette',
    order: 8,
    title: 'Winter Wardrobe, Cloakrooms (Гардероб) & Cultural Dos and Don’ts',
    titleRu: 'Зимняя одежда, гардероб и повседневный этикет',
    category: 'Culture & Etiquette',
    summary:
      'Surviving Russian winters smoothly, using mandatory university/museum coat checks (гардеро́б), removing shoes indoors, and navigating smiling/politeness customs without misinterpreting reserve as coldness.',
    phrases: [
      {
        russian: 'Можно сдать куртку в гардероб?',
        stressed: 'Мо́жно сда́ть ку́ртку в гардеро́б?',
        translit: 'Mozhno sdat kurtku v garderob?',
        english: 'May I check my winter jacket into the cloakroom?',
        hindi: 'क्या मैं अपनी जैकेट क्लोकरूम (गार्देरोब) में जमा कर सकता हूँ?',
        context: 'Required in Russian universities, theaters, and museums',
      },
      {
        russian: 'Какая сегодня температура? На улице минус пятнадцать.',
        stressed: 'Кака́я сего́дня температу́ра? На у́лице ми́нус пятна́дцать.',
        translit: 'Kakaya segodnya temperatura? Na ulitse minus pyatnadtsat.',
        english: 'What is the temperature today? It is minus 15 outside.',
        hindi: 'आज तापमान कितना है? बाहर माइनस पंद्रह डिग्री है।',
        context: 'Winter weather check',
      },
      {
        russian: 'Где здесь тапочки? / Можно снять обувь?',
        stressed: 'Где зде́сь та́почки? / Мо́жно сня́ть о́бувь?',
        translit: 'Gde zdes tapochki? / Mozhno snyat obuv?',
        english: 'Where are the house slippers? / Shall I take off my shoes?',
        hindi: 'यहाँ घर की चप्पलें कहाँ हैं? / क्या मैं जूते उतार दूँ?',
        context: 'Visiting a Russian home',
      },
    ],
    dialogue: {
      title: 'Entering the University Building in January',
      location: 'University Lobby Cloakroom',
      lines: [
        {
          speaker: 'Гардеробщица',
          russian: 'Молодой человек, верхнюю одежду нужно обязательно оставить в гардеробе!',
          stressed: 'Молодо́й челове́к, ве́рхнюю оде́жду ну́жно обяза́тельно оста́вить в гардеро́бе!',
          translit: 'Molodoy chelovek, verkhnyuyu odezhdu nuzhno obyazatelno ostavit v garderobe!',
          english: 'Young man, outerwear must be left in the cloakroom!',
          hindi: 'सुनिए, बाहर का भारी कोट/जैकेट क्लोकरूम में रखना अनिवार्य है!',
        },
        {
          speaker: 'Студент',
          russian: 'Простите, пожалуйста, вот моя куртка. Спасибо за номерок!',
          stressed: 'Прости́те, пожа́луйста, во́т моя́ ку́ртка. Спаси́бо за номеро́к!',
          translit: 'Prostite, pozhaluysta, vot moya kurtka. Spasibo za nomerok!',
          english: 'Sorry, please—here is my jacket. Thank you for the coat check tag!',
          hindi: 'क्षमा कीजिए, यह रही मेरी जैकेट। टोकन नंबर के लिए धन्यवाद!',
        },
      ],
    },
    etiquetteAndTips: [
      'Wait before handing items or shaking hands ACROSS a doorway threshold («не передава́йте че́рез поро́г»)—step fully inside first!',
      'Buy warm waterproof boots with thick non-slip soles (зи́мние боти́нки) and thermal layers rather than wearing only heavy sweaters indoors (Russian buildings are kept very warm!).',
    ],
    commonMisunderstanding: {
      situation: 'Strangers or cashiers not smiling broadly at passersby.',
      whatHappens: 'Indian and American guests sometimes interpret an unsmiling expression on the metro or at counters as rudeness.',
      howToNavigate: 'In Russian culture, smiles signal genuine personal warmth rather than routine customer service. Once a conversation begins politely, people are warm, helpful, and deeply hospitable.',
    },
  },
];

// =========================================================================
// 4. LANGUAGE THROUGH CULTURE — 8 CULTURAL BRIDGE LESSONS
// =========================================================================

export const CULTURE_BRIDGE_LESSONS: CultureBridgeLesson[] = [
  {
    id: 'cult-1-ty-vy',
    title: 'Polite «Вы» vs. Intimate «Ты» (Respect in Speech)',
    titleRu: 'Этикет обращения: «Вы» и «ты»',
    category: 'Social Etiquette',
    summary:
      'Why Russian separates respectful Вы from familiar ты—remarkably close to Hindi आप vs. तुम/तू!',
    russianContext:
      'Вы is used with strangers, elders, teachers, doctors, officials, and in any professional setting—even when smiling warmly. Moving to ты happens only by mutual agreement («Мо́жно на ты?»).',
    indianEquivalent:
      'Mirrors Hindi «आप» (respectful singular/plural) vs. «तुम» (friendly peers) and «तू» (intimate childhood friends/family).',
    keyDifferences:
      'Remember that Russian verbs take plural endings with Вы even when addressing a single person («Вы говори́те», «Вы бы́ли»), just like Hindi «आप बोलते हैं» takes plural verb agreement!',
    keyExpressions: [
      {
        russian: 'Вы не подскажете, как пройти к музею?',
        stressed: 'Вы не подска́жете, ка́к пройти́ к музе́ю?',
        english: 'Could you kindly tell me how to walk to the museum?',
        hindiComparison: 'क्या आप बताएंगे... ("आप" जैसा विनम्र रूप)',
      },
      {
        russian: 'Давайте перейдём на «ты»?',
        stressed: 'Дава́йте перейдём на «ты»?',
        english: 'Shall we switch to informal "ty"?',
        hindiComparison: 'क्या हम अब "तुम" कहकर बात कर सकते हैं?',
      },
    ],
    proverb: {
      russian: 'Ве́жливость ничего́ не сто́ит, но прино́сит мно́гое.',
      literal: 'Politeness costs nothing, yet brings much.',
      meaning: 'Respectful speech opens every door across cultures.',
      indianParallel: 'मीठे बोल सबके मन को जीत लेते हैं।',
    },
  },
  {
    id: 'cult-2-names',
    title: 'Russian Three-Part Names & Patronymics (И́мя–О́тчество–Фами́лия)',
    titleRu: 'Русские имена, отчества и уменьшительные формы',
    category: 'Identity & Names',
    summary:
      'Decoding First Name + Patronymic (derived from the father’s name) + Surname, plus affectionate diminutives like Саша from Александр.',
    russianContext:
      'Every Russian citizen holds three parts: И́мя (Александр), О́тчество (Серге́евич / Серге́евна — "son/daughter of Sergey"), and Фами́лия (Пу́шкин / Ивано́ва — gender-inflected!). Calling a professor «Господи́н Ивано́в» sounds stiff; calling them by First Name + Patronymic («Ива́н Серге́евич») shows warm, dignified respect.',
    indianEquivalent:
      'Comparable to patronymic middle names in parts of Maharashtra and Gujarat, paired with respectful Hindi «जी» (-ji) suffixes—here baked straight into the father’s name.',
    keyDifferences:
      'In informal circles, full names shrink to affectionate short forms: Александр → Са́ша / Шу́ра; Михаи́л → Ми́ша; Екатери́на → Ка́тя; Мари́я → Ма́ша. Never assume these are different people!',
    keyExpressions: [
      {
        russian: 'Как ваше имя и отчество?',
        stressed: 'Ка́к ва́ше и́мя и о́тчество?',
        english: 'What are your first name and patronymic?',
        hindiComparison: 'आपका शुभ नाम और पितृनाम क्या है?',
      },
      {
        russian: 'Зовите меня просто Аня.',
        stressed: 'Зови́те меня́ про́сто А́ня.',
        english: 'Just call me Anya.',
        hindiComparison: 'आप मुझे केवल अन्या कहकर बुला सकते हैं।',
      },
    ],
  },
  {
    id: 'cult-3-hospitality',
    title: 'Russian Tea Hospitality (Чаепи́тие) & Atithi Devo Bhava',
    titleRu: 'Русское гостеприимство и традиция чаепития',
    category: 'Hospitality',
    summary:
      'The samovar table, never arriving empty-handed («с пусты́ми рука́ми»), and why refusing three cups of tea may disappoint a host.',
    russianContext:
      'Inviting someone «на ча́й» (for tea) implies a full spread of sweets, pies (пироги́), jam (варе́нье), lemon, and deep unhurried conversation.',
    indianEquivalent:
      'Deeply resonates with Indian «अतिथि देवो भव» (Atithi Devo Bhava) and welcoming every visitor immediately with chai and sweets.',
    keyDifferences:
      'Bring flowers in an ODD number only (3, 5, 7—even numbers are strictly for funerals!) or chocolates/pastries when invited to a Russian home.',
    keyExpressions: [
      {
        russian: 'Проходите, пожалуйста, к столу! Угощайтесь!',
        stressed: 'Проходи́те, пожа́луйста, к столу́! Угоща́йтесь!',
        english: 'Come to the table, please! Help yourself!',
        hindiComparison: 'कृपया मेज़ पर आइए, और संकोच न करें, भोजन/चाय लें!',
      },
      {
        russian: 'Нельзя приходить в гости с пустыми руками.',
        stressed: 'Нельзя́ приходи́ть в го́сти с пусты́ми рука́ми.',
        english: 'One should never visit guests empty-handed.',
        hindiComparison: 'मेज़बान के घर खाली हाथ नहीं जाना चाहिए।',
      },
    ],
    proverb: {
      russian: 'Го́сть на поро́г — в до́ме пра́здник.',
      literal: 'A guest at the doorstep means a celebration in the house.',
      meaning: 'Welcoming guests brings joy to the household.',
      indianParallel: 'अतिथि देवो भव — अतिथि के आने से घर पावन होता है।',
    },
  },
  {
    id: 'cult-4-seasons-festivals',
    title: 'Maslenitsa, New Year & Indian Seasonal Festivals (Holi & Diwali)',
    titleRu: 'Масленица, Новый год и праздники Индии',
    category: 'Traditions & Festivals',
    summary:
      'Exploring how both Russia and India celebrate light, spring renewal, pancakes/sweets, and family gatherings.',
    russianContext:
      'Maslenitsa celebrates the end of winter with golden round blini (блины́) symbolizing the returning sun. New Year’s Eve (Но́вый го́д) is Russia’s biggest family holiday with decorated ёлка trees and Olivier salad.',
    indianEquivalent:
      'Maslenitsa aligns chronologically and spiritually with Vasant Panchami & Holi—celebrating winter’s farewell, spring renewal, bonfires, and festive sweets like gujiya.',
    keyDifferences:
      'Notice festive Russian greetings: «С пра́здником!» (Happy holiday!) and «С Но́вым го́дом!» use «С + Instrumental case».',
    keyExpressions: [
      {
        russian: 'Поздравляю вас с праздником весны и света!',
        stressed: 'Поздравля́ю ва́с с пра́здником весны́ и све́та!',
        english: 'Congratulations on the festival of spring and light!',
        hindiComparison: 'वसंत और प्रकाश के पर्व की हार्दिक शुभकामनाएँ!',
      },
      {
        russian: 'Вкусные блины с мёдом и чаем!',
        stressed: 'Вку́сные блины́ с мёдом и ча́ем!',
        english: 'Delicious blini with honey and tea!',
        hindiComparison: 'शहद और चाय के साथ स्वादिष्ट ब्लिनी!',
      },
    ],
  },
  {
    id: 'cult-5-family',
    title: 'Family Bonds, Ба́бушка / Де́душка & Respect for Elders',
    titleRu: 'Семья, бабушки, дедушки и уважение к старшим',
    category: 'Family Culture',
    summary:
      'Exploring intergenerational warmth, dachas (да́чи), and kinship vocabulary in Russian and Indian families.',
    russianContext:
      'Grandparents (ба́бушка и де́душка) play an indispensable role raising grandchildren, sharing folklore, and cooking seasonal preserves at the family country cottage (да́ча).',
    indianEquivalent:
      'Closely parallels Indian दादा-दादी / नाना-नानी households where elders anchor cultural memory, cooking, and moral stories.',
    keyDifferences:
      'Hindi names each branch separately (चाचा/मामा, दादा/नाना), whereas Russian uses shared terms (дя́дя = uncle on either side; ба́бушка = either grandmother) plus exact phrases like «двою́родный бра́т» (cousin).',
    keyExpressions: [
      {
        russian: 'Моя семья всегда поддерживает меня.',
        stressed: 'Моя́ семья́ всегда́ подде́рживает меня́.',
        english: 'My family always supports me.',
        hindiComparison: 'मेरा परिवार हमेशा मेरा साथ देता है।',
      },
    ],
  },
  {
    id: 'cult-6-literature',
    title: 'Tolstoy, Tagore, Pushkin & Afanasy Nikitin’s Voyage Beyond Three Seas',
    titleRu: 'Толстой, Тагор, Пушкин и Афанасий Никитин',
    category: 'Literary Heritage',
    summary:
      'How Russian and Indian writers forged a 500-year literary and philosophical bridge—essential cultural literacy for every Russian learner.',
    russianContext:
      'From 15th-century merchant Afanasy Nikitin’s travelogue «Хоже́ние за три́ моря́» describing Bidar and Parvat, to Leo Tolstoy’s correspondence with Mahatma Gandhi, to Rabindranath Tagore’s 1930 Moscow visit.',
    indianEquivalent:
      'Premchand, Tagore, and Gandhi deeply read Tolstoy and Chekhov; Russian translations of the Ramayana, Panchatantra, and Tagore remain classics in Russian libraries.',
    keyDifferences:
      'In Russia, memorizing Pushkin’s poems («У лукомо́рья ду́б зелёный...», «Я ва́с люби́л...») is a universal cultural bond shared across generations.',
    keyExpressions: [
      {
        russian: 'Литература соединяет сердца России и Индии.',
        stressed: 'Литерату́ра соединя́ет сердца́ Росси́и и И́ндии.',
        english: 'Literature unites the hearts of Russia and India.',
        hindiComparison: 'साहित्य रूस और भारत के हृदयों को जोड़ता है।',
      },
    ],
  },
  {
    id: 'cult-7-proverbs',
    title: 'Living Russian Proverbs (Посло́вицы) & Indian Wisdom Parallels',
    titleRu: 'Русские пословицы и мудрость языка',
    category: 'Proverbs & Idioms',
    summary:
      'Mastering authentic Russian proverbs adds rhythm, cultural depth, and B1–B2 speaking polish.',
    russianContext:
      'Russians weave classic proverbs seamlessly into daily conversation to summarize wisdom succinctly without lecturing.',
    indianEquivalent:
      'Functions identically to Hindi कहावतें और लोकोक्तियाँ—compact folk metaphors passed across centuries.',
    keyDifferences:
      'Russian proverbs frequently omit "is/are" and use compact rhymes or parallel halves.',
    keyExpressions: [
      {
        russian: 'Век живи — век учись.',
        stressed: 'Ве́к живи́ — ве́к учи́сь.',
        english: 'Live a century — learn a century (Never stop learning).',
        hindiComparison: 'सीखने की कोई उम्र नहीं होती — जीवन भर सीखते रहो।',
      },
      {
        russian: 'Терпение и труд всё перетрут.',
        stressed: 'Терпе́ние и тру́д всё перетру́т.',
        english: 'Patience and hard work grind through everything.',
        hindiComparison: 'धैर्य और परिश्रम से सब कुछ संभव है / करत-करत अभ्यास के...',
      },
      {
        russian: 'Лучше один раз увидеть, чем сто раз услышать.',
        stressed: 'Лу́чше оди́н ра́з уви́деть, че́м сто́ ра́з услы́шать.',
        english: 'Better to see once than hear a hundred times.',
        hindiComparison: 'सौ बार सुनने से एक बार देखना बेहतर है।',
      },
    ],
    proverb: {
      russian: 'Ста́рый дру́г лу́чше но́вых дву́х.',
      literal: 'An old friend is better than two new ones.',
      meaning: 'Tried-and-tested friendship is priceless.',
      indianParallel: 'पुराना मित्र सौ नए मित्रों से बढ़कर होता है।',
    },
  },
  {
    id: 'cult-8-table-gifts',
    title: 'Gift Etiquette, Flowers, Weather & Home Visits',
    titleRu: 'Подарки, цветы и этикет в гостях',
    category: 'Home & Gift Etiquette',
    summary:
      'Small cultural gestures that instantly endear you to Russian hosts, colleagues, and friends.',
    russianContext:
      'Always remove outdoor shoes at the entrance, expect hosts to offer house slippers (та́почки), avoid shaking hands across a doorway, and present odd numbers of flowers for joyful occasions.',
    indianEquivalent:
      'Removing footwear at the threshold aligns naturally with Indian home customs; similarly, gifting sweets/tea reflects shared South Asian and Eurasian warmth.',
    keyDifferences:
      'Even numbers of flowers (2, 4, 6, 12) are strictly reserved for memorials and funerals in Russia—always verify 1, 3, 5, or 7 when gifting bouquets!',
    keyExpressions: [
      {
        russian: 'Это вам скромный подарок из Индии.',
        stressed: 'Э́то ва́м скро́мный пода́рок из И́ндии.',
        english: 'Here is a modest gift from India for you.',
        hindiComparison: 'भारत की ओर से आपके लिए यह एक छोटा-सा उपहार है।',
      },
    ],
  },
];

// =========================================================================
// 5. CURATED VIDEO REFERENCES (ZERO INVENTED YOUTUBE IDs)
// =========================================================================
// Note: Curated YouTube topic search links to trusted channels. Teachers can
// paste specific verified YouTube video URLs inside TeacherAdminPanelView to
// render inline embeds via extractYouTubeVideoId().

export const CURATED_VIDEO_REFERENCES: VideoReference[] = [
  {
    id: 'vidref-a0-alphabet',
    levelId: 'pre-a1',
    moduleId: 'mod-a0-u2',
    lessonId: 'lesson-a0-1',
    title: 'Complete Russian Alphabet Pronunciation (Native Coach)',
    titleRu: 'Русский алфавит: произношение всех 33 букв',
    channelName: 'Real Russian Club / Amazing Russian',
    url: 'https://www.youtube.com/results?search_query=Real+Russian+Club+Russian+Alphabet+Pronunciation',
    searchUrl: 'https://www.youtube.com/results?search_query=Real+Russian+Club+Russian+Alphabet+Pronunciation',
    topic: 'Cyrillic Script & Sounds',
    description:
      'Watch native articulation of lips and tongue position while contrasting Latin false friends (В, Н, Р, С, У, Х) and elusive Ы / Щ.',
    teacherNotes:
      'Pause after every five letters and mirror the speaker’s jaw tension aloud. Teachers may attach a specific verified YouTube URL or upload custom classroom video/audio from the Teacher Panel.',
    comprehensionQuestion: {
      question: 'Why must you watch native lip posture for Russian В and Ы?',
      options: [
        'В touches upper teeth to lower lip ([v]) and Ы keeps lips unrounded & spread',
        'Both letters are completely silent',
        'Both require rounding lips tightly like О',
      ],
      correctAnswer: 'В touches upper teeth to lower lip ([v]) and Ы keeps lips unrounded & spread',
      explanation: 'Clear articulation prevents confusing В with English W/B and keeps Ы distinct from У or И.',
    },
    isPublished: true,
  },
  {
    id: 'vidref-a0-phonetics',
    levelId: 'pre-a1',
    moduleId: 'mod-a0-u3',
    lessonId: 'lesson-a0-2',
    title: 'Vowel Reduction (Аканье) & Hard/Soft Consonants Explained',
    titleRu: 'Редукция гласных и твёрдые/мягкие согласные',
    channelName: 'Be Fluent in Russian / Amazing Russian',
    url: 'https://www.youtube.com/results?search_query=Russian+vowel+reduction+akanie+hard+soft+consonants',
    searchUrl: 'https://www.youtube.com/results?search_query=Russian+vowel+reduction+akanie+hard+soft+consonants',
    topic: 'Phonology & Stress',
    description:
      'Hear minimal pairs like брат vs брать and молоко́ pronounced at slow and natural conversational speed.',
    teacherNotes:
      'Compare how the first two O’s in молоко́ sound close to "а" while only the final stressed О stays rounded.',
    comprehensionQuestion: {
      question: 'In «молоко́», which syllable keeps a clean [o] sound?',
      options: ['The first syllable (мо-)', 'The middle syllable (-ло-)', 'Only the final stressed syllable (-ко́)'],
      correctAnswer: 'Only the final stressed syllable (-ко́)',
      explanation: 'Unstressed о reduces toward [ɐ/ə] under аканье.',
    },
    isPublished: true,
  },
  {
    id: 'vidref-a1-greetings',
    levelId: 'a1',
    moduleId: 'mod-a1-1',
    lessonId: 'lesson-a1-1',
    title: 'First Russian Conversations & Polite Greetings in Moscow',
    titleRu: 'Первые диалоги: знакомство и приветствия',
    channelName: 'Easy Russian (Street Interviews)',
    url: 'https://www.youtube.com/results?search_query=Easy+Russian+greetings+introducing+yourself+A1',
    searchUrl: 'https://www.youtube.com/results?search_query=Easy+Russian+greetings+introducing+yourself+A1',
    topic: 'A1 Real-Life Dialogues',
    description:
      'Hear everyday speakers in Moscow and Saint Petersburg greet friends with Привет/Как дела vs formal Здравствуйте.',
    teacherNotes:
      'Pay attention to rising ИК-3 pitch on "Как дела?" and "А вы?".',
    isPublished: true,
  },
  {
    id: 'vidref-a1-cases-intro',
    levelId: 'a1',
    moduleId: 'mod-a1-10',
    lessonId: 'lesson-a1-4',
    title: 'Prepositional vs. Accusative Case (Где vs. Куда)',
    titleRu: 'Предложный и винительный падежи: где и куда',
    channelName: 'Russian With Max / Amazing Russian',
    url: 'https://www.youtube.com/results?search_query=Russian+Prepositional+vs+Accusative+gde+kuda',
    searchUrl: 'https://www.youtube.com/results?search_query=Russian+Prepositional+vs+Accusative+gde+kuda',
    topic: 'A1 Case Grammar',
    description:
      'Visual city tour contrasting static locations («Я в университе́те») with movement («Я иду́ в университе́т»).',
    teacherNotes:
      'Write five original sentences about your daily commute after watching.',
    isPublished: true,
  },
  {
    id: 'vidref-a2-aspect',
    levelId: 'a2',
    moduleId: 'mod-a2-7',
    lessonId: 'lesson-a2-3',
    title: 'Mastering Russian Verbal Aspect (Imperfective vs. Perfective)',
    titleRu: 'Виды глагола в живой речи (НСВ / СВ)',
    channelName: 'Russian With Max',
    url: 'https://www.youtube.com/results?search_query=Russian+With+Max+verbal+aspect+imperfective+perfective',
    searchUrl: 'https://www.youtube.com/results?search_query=Russian+With+Max+verbal+aspect+imperfective+perfective',
    topic: 'A2 Verbal Aspect',
    description:
      'Storytelling breakdown illustrating process vs. finished result with clear visual timelines.',
    teacherNotes:
      'Notice how sequences of completed steps chain Perfective verbs together.',
    isPublished: true,
  },
  {
    id: 'vidref-b1-motion',
    levelId: 'b1',
    moduleId: 'mod-b1-2',
    lessonId: 'lesson-b1-1',
    title: 'Prefixed Verbs of Motion Visualized (При-, У-, В-, Вы-)',
    titleRu: 'Глаголы движения с приставками на примерах',
    channelName: 'Be Fluent in Russian',
    url: 'https://www.youtube.com/results?search_query=Russian+prefixed+verbs+of+motion+pri+u+vy',
    searchUrl: 'https://www.youtube.com/results?search_query=Russian+prefixed+verbs+of+motion+pri+u+vy',
    topic: 'B1 Motion Prefixes',
    description:
      'Clear diagrammatic walk-through showing how prefixes reshape идти́/ходи́ть and е́хать/е́здить.',
    teacherNotes:
      'Revisit Lesson 3.1 examples alongside this visual summary.',
    isPublished: true,
  },
  {
    id: 'vidref-b2-culture-media',
    levelId: 'b2',
    moduleId: 'mod-b2-3',
    lessonId: 'lesson-b2-2',
    title: 'Natural Speed B2 Interviews & Stylistic Registers',
    titleRu: 'Живая речь, культура и стилистика (B2)',
    channelName: 'Russian With Max / Easy Russian',
    url: 'https://www.youtube.com/results?search_query=Russian+With+Max+culture+interviews+natural+speed',
    searchUrl: 'https://www.youtube.com/results?search_query=Russian+With+Max+culture+interviews+natural+speed',
    topic: 'B2 Discourse & Culture',
    description:
      'Unscripted cultural conversations focusing on idioms, intonation nuance, and rapid comprehension.',
    teacherNotes:
      'Summarize the speaker’s main viewpoint in 5 formal B2 sentences in the Writing tab.',
    isPublished: true,
  },
];

// =========================================================================
// 6. ASSESSMENTS & DIAGNOSTIC PLACEMENT TEST (A0 – B2)
// =========================================================================

export const ASSESSMENT_QUIZZES: AssessmentQuiz[] = [
  {
    id: 'quiz-placement',
    title: 'Diagnostic Placement Test (A0 Pre-A1 → B2)',
    titleRu: 'Диагностический тест для определения уровня',
    kind: 'placement',
    description:
      'Answer 12 progressive questions spanning Cyrillic script, core A1–A2 cases, B1 motion/participles, and B2 stylistic precision to identify your recommended starting CEFR level.',
    passingScorePct: 50,
    questions: [
      {
        id: 'pl-1',
        targetLevel: 'pre-a1',
        type: 'multiple-choice',
        prompt: 'Question 1 (A0 Script): How is the Russian word «рестора́н» pronounced?',
        options: ['pectopah', 'restoran', 'pestopan', 'rectopan'],
        correctAnswer: 'restoran',
        explanation: 'Cyrillic Р=[r], С=[s], Н=[n]. Thus рестора́н = restoran.',
      },
      {
        id: 'pl-2',
        targetLevel: 'pre-a1',
        type: 'multiple-choice',
        prompt: 'Question 2 (A0 Phonology): Which consonant loses its voicing at the end of «хле́б»?',
        options: ['[b] devoices to [p]', '[b] turns into [v]', 'It remains [b]'],
        correctAnswer: '[b] devoices to [p]',
        explanation: 'Word-final voiced consonants devoice to their voiceless pair: б → п.',
      },
      {
        id: 'pl-3',
        targetLevel: 'a1',
        type: 'multiple-choice',
        prompt: 'Question 3 (A1 Gender): Choose the right match: «_____ но́вая шко́ла».',
        options: ['мо́й', 'моя́', 'моё', 'мои́'],
        correctAnswer: 'моя́',
        explanation: 'Шко́ла ends in -а (feminine singular), requiring моя́.',
      },
      {
        id: 'pl-4',
        targetLevel: 'a1',
        type: 'multiple-choice',
        prompt: 'Question 4 (A1 Prepositional): «Мо́й дру́г живёт и у́чится _____ Москве́.»',
        options: ['в', 'на', 'у', 'к'],
        correctAnswer: 'в',
        explanation: 'Cities take static preposition в + Prepositional case (в Москве́).',
      },
      {
        id: 'pl-5',
        targetLevel: 'a1',
        type: 'multiple-choice',
        prompt: 'Question 5 (A1 Verbs): «Мы хорошо́ _____ по-ру́сски.»',
        options: ['говорю́', 'говори́шь', 'говори́м', 'говоря́т'],
        correctAnswer: 'говори́м',
        explanation: '1st person plural «мы» takes -им in Conjugation II: говори́м.',
      },
      {
        id: 'pl-6',
        targetLevel: 'a2',
        type: 'case-ending',
        prompt: 'Question 6 (A2 Genitive Negation): «К сожале́нию, у меня́ сего́дня не́т _____ .»',
        options: ['вре́мя', 'вре́мени', 'вре́менем'],
        correctAnswer: 'вре́мени',
        explanation: 'Не́т triggers Genitive; neuter -мя noun вре́мя declines to вре́мени.',
      },
      {
        id: 'pl-7',
        targetLevel: 'a2',
        type: 'multiple-choice',
        prompt: 'Question 7 (A2 Dative & Age): «Ско́лько _____ ле́т?» (to ask politely "How old are you?")',
        options: ['ва́м', 'вы́', 'ва́с', 'ва́ми'],
        correctAnswer: 'ва́м',
        explanation: 'Age expressions use Dative pronouns: Ско́лько ва́м ле́т? Мне́ 21 го́д.',
      },
      {
        id: 'pl-8',
        targetLevel: 'a2',
        type: 'multiple-choice',
        prompt: 'Question 8 (A2 Aspect): «Ка́ждый ве́чер я _____ кни́гу, но вчера́ я наконец _____ её.»',
        options: [
          'чита́л / прочита́л',
          'прочита́л / чита́л',
          'прочита́л / прочита́л',
        ],
        correctAnswer: 'чита́л / прочита́л',
        explanation: 'Repeated habit uses НСВ чита́л; finished result yesterday uses СВ прочита́л.',
      },
      {
        id: 'pl-9',
        targetLevel: 'b1',
        type: 'multiple-choice',
        prompt: 'Question 9 (B1 Prefixed Motion): «По́езд _____ на вокзáл то́чно по расписа́нию.»',
        options: ['при́был / прие́хал', 'пришёл (on foot)', 'вы́шел'],
        correctAnswer: 'при́был / прие́хал',
        explanation: 'Trains/transport arriving at a station use при́был or прие́хал.',
      },
      {
        id: 'pl-10',
        targetLevel: 'b1',
        type: 'multiple-choice',
        prompt: 'Question 10 (B1 Participles): «Рома́н, _____ в девятна́дцатом ве́ке, остаётся актуа́льным.»',
        options: ['напи́санный', 'пи́шущий', 'написа́в'],
        correctAnswer: 'напи́санный',
        explanation: 'Passive past participle agreeing with masculine «рома́н»: напи́санный.',
      },
      {
        id: 'pl-11',
        targetLevel: 'b2',
        type: 'multiple-choice',
        prompt: 'Question 11 (B2 Cause Prepositions): «_____ поддер́жке университе́та конфере́нция прошла́ успе́шно.»',
        options: ['Благодаря́', 'Из-за', 'Вопреки́', 'Недоста́точно'],
        correctAnswer: 'Благодаря́',
        explanation: 'Благодаря́ + Dative expresses positive enabling support.',
      },
      {
        id: 'pl-12',
        targetLevel: 'b2',
        type: 'multiple-choice',
        prompt: 'Question 12 (B2 Aspect Nuance): «Кто _____ дверь? В ко́мнате хо́лодно, хотя́ она́ за́крыта.»',
        options: ['открыва́л', 'откро́ет', 'бу́дет открыва́ть'],
        correctAnswer: 'открыва́л',
        explanation: 'Annulled past result (door opened earlier and now closed) uses Imperfective открыва́л.',
      },
    ],
    isPublished: true,
  },
  {
    id: 'quiz-a0-alphabet',
    title: 'Level 0 (A0): Alphabet & Phonology Mastery Assessment',
    titleRu: 'Итоговый тест уровня A0: Алфавит и фонетика',
    kind: 'level',
    levelId: 'pre-a1',
    description:
      'Pass this checkpoint (≥75%) to unlock full Level A1 structured lessons (or demonstrate proficiency via Placement Test).',
    passingScorePct: 75,
    questions: [
      {
        id: 'qa0-1',
        type: 'multiple-choice',
        prompt: 'Which letter always makes the rolled [r] sound?',
        options: ['П', 'Р', 'В', 'Л'],
        correctAnswer: 'Р',
        explanation: 'Cyrillic Р represents [r], whereas П is [p].',
      },
      {
        id: 'qa0-2',
        type: 'multiple-choice',
        prompt: 'Which vowel NEVER carries stress distortion in standard Russian because it is ALWAYS stressed?',
        options: ['Е', 'О', 'Ё', 'А'],
        correctAnswer: 'Ё',
        explanation: 'In Russian orthography, Ё is always stressed (except rare loanwords/compounds).',
      },
      {
        id: 'qa0-3',
        type: 'multiple-choice',
        prompt: 'Which sign softens the preceding consonant (e.g., мать vs мат)?',
        options: ['Ъ', 'Ь', 'Ы', 'Й'],
        correctAnswer: 'Ь',
        explanation: 'Ь (мя́гкий зна́к) indicates palatalization of the consonant before it.',
      },
      {
        id: 'qa0-4',
        type: 'multiple-choice',
        prompt: 'How is «Н» pronounced in Russian «на́ш»?',
        options: ['[n] as in no', '[h] as in hot', '[m] as in mom'],
        correctAnswer: '[n] as in no',
        explanation: 'Н is a classic false friend: looks like Latin H, pronounced [n].',
      },
      {
        id: 'qa0-5',
        type: 'multiple-choice',
        prompt: 'What happens to final «д» in «го́род»?',
        options: ['Devoices to [t]', 'Turns into [z]', 'Becomes silent'],
        correctAnswer: 'Devoices to [t]',
        explanation: 'Final paired voiced consonants devoice cleanly: д → т.',
      },
      {
        id: 'qa0-6',
        type: 'multiple-choice',
        prompt: 'Identify the long, soft palatal consonant among the choices:',
        options: ['Ш', 'Ж', 'Щ', 'Ц'],
        correctAnswer: 'Щ',
        explanation: 'Щ [ɕː] is always soft and long, while Ш, Ж, Ц are always hard.',
      },
    ],
    isPublished: true,
  },
  {
    id: 'quiz-a1-mastery',
    title: 'Level 1 (A1) Mastery Exam (ТЭУ Benchmark)',
    titleRu: 'Экзамен уровня A1 (Элементарный)',
    kind: 'level',
    levelId: 'a1',
    description:
      'Covers noun genders, regular/7-letter plurals, Present Tense I & II, Prepositional location, Accusative objects, and everyday A1 dialogue.',
    passingScorePct: 70,
    questions: [
      {
        id: 'qa1-1',
        type: 'multiple-choice',
        prompt: '«Э́то на́ш но́вый _____ .» (Choose the masculine noun)',
        options: ['университе́т', 'шко́ла', 'общежи́тие', 'кни́га'],
        correctAnswer: 'университе́т',
        explanation: 'На́ш но́вый agrees only with masculine университе́т.',
      },
      {
        id: 'qa1-2',
        type: 'multiple-choice',
        prompt: '«Студе́нты _____ ру́сский язы́к ка́ждый де́нь.»',
        options: ['изуча́ю', 'изуча́ет', 'изуча́ют', 'изуча́ете'],
        correctAnswer: 'изуча́ют',
        explanation: '3rd person plural (они) Conjugation I uses -ют: изуча́ют.',
      },
      {
        id: 'qa1-3',
        type: 'case-ending',
        prompt: '«Я учу́сь в Петербу́рге, а моя́ семья́ живёт в _____ .» (Де́ли — indeclinable / Индия)',
        options: ['И́ндия', 'И́ндии', 'И́ндию'],
        correctAnswer: 'И́ндии',
        explanation: 'Nouns ending in -ия take -ии in the Prepositional case: в И́ндии, в Росси́и.',
      },
      {
        id: 'qa1-4',
        type: 'case-ending',
        prompt: '«У́тром я люблю́ чита́ть интере́сную _____ .» (кни́га)',
        options: ['кни́га', 'кни́ги', 'кни́гу', 'кни́ге'],
        correctAnswer: 'кни́гу',
        explanation: 'Direct object after чита́ть takes Accusative feminine -у: кни́гу.',
      },
      {
        id: 'qa1-5',
        type: 'multiple-choice',
        prompt: 'How do you politely offer "Coffee with milk, please"?',
        options: [
          'Ко́фе с молоко́м, пожа́луйста.',
          'Ко́фе в молоко́, спаси́бо.',
          'Ко́фе без молоко́.',
        ],
        correctAnswer: 'Ко́фе с молоко́м, пожа́луйста.',
        explanation: 'With milk uses с + Instrumental (с молоко́м), and пожа́луйста means please.',
      },
      {
        id: 'qa1-6',
        type: 'multiple-choice',
        prompt: '«Ско́лько э́то сто́ит? — Два́дцать рубле́й.» Which number word means 20?',
        options: ['двена́дцать', 'два́дцать', 'две́сти'],
        correctAnswer: 'два́дцать',
        explanation: 'Два́дцать = 20; двена́дцать = 12; две́сти = 200.',
      },
    ],
    isPublished: true,
  },
  {
    id: 'quiz-a2-mastery',
    title: 'Level 2 (A2) Mastery Exam (ТБУ Benchmark)',
    titleRu: 'Экзамен уровня A2 (Базовый)',
    kind: 'level',
    levelId: 'a2',
    description:
      'Assesses all 6 singular/plural cases, Genitive plural endings, Dative feelings, Instrumental companions, Verbal Aspect, and Unprefixed Motion.',
    passingScorePct: 70,
    questions: [
      {
        id: 'qa2-1',
        type: 'case-ending',
        prompt: '«В на́шем го́роде мно́го краси́вых _____ .» (па́рк — Genitive Plural)',
        options: ['па́рки', 'па́рков', 'па́рках', 'па́ркам'],
        correctAnswer: 'па́рков',
        explanation: 'Мно́го governs Genitive Plural; hard masculine nouns take -ов: па́рков.',
      },
      {
        id: 'qa2-2',
        type: 'case-ending',
        prompt: '«В де́тстве А́нна хоте́ла ста́ть _____ .» (вра́ч — Instrumental)',
        options: ['врача́', 'врачу́', 'врачо́м'],
        correctAnswer: 'врачо́м',
        explanation: 'Professions after ста́ть / быть (past/future) take Instrumental: врачо́м.',
      },
      {
        id: 'qa2-3',
        type: 'multiple-choice',
        prompt: '«Вчера́ мы весь де́нь _____ по це́нтру Санкт-Петербу́рга.» (wandered/walked around on foot)',
        options: ['ходи́ли', 'шли́', 'прие́хали'],
        correctAnswer: 'ходи́ли',
        explanation: 'Non-directed wandering/round trip on foot uses multidirectional ходи́ли.',
      },
      {
        id: 'qa2-4',
        type: 'multiple-choice',
        prompt: 'Choose the right Perfective Future sentence for "Tomorrow I will definitely buy this ticket":',
        options: [
          'За́втра я обяза́тельно куплю́ э́тот биле́т.',
          'За́втра я бу́ду куплю́ э́тот биле́т.',
          'За́втра я покупа́л э́тот биле́т.',
        ],
        correctAnswer: 'За́втра я обяза́тельно куплю́ э́тот биле́т.',
        explanation: 'Perfective future is conjugated directly (куплю́) without бу́ду!',
      },
      {
        id: 'qa2-5',
        type: 'multiple-choice',
        prompt: '«_____ о́чень интере́сна ру́сская литерату́ра.» (To him)',
        options: ['Его́', 'Ему́', 'И́м', 'О нём'],
        correctAnswer: 'Ему́',
        explanation: 'Dative masculine singular personal pronoun = ему́.',
      },
    ],
    isPublished: true,
  },
  {
    id: 'quiz-b1-mastery',
    title: 'Level 3 (B1) Mastery Exam (ТРКИ-1 Benchmark)',
    titleRu: 'Экзамен уровня B1 (Первый сертификационный)',
    kind: 'level',
    levelId: 'b1',
    description:
      'Assesses prefixed motion verbs, participles, verbal adverbs (деепричастия), который clauses, and unreal conditions (если бы).',
    passingScorePct: 70,
    questions: [
      {
        id: 'qb1-1',
        type: 'multiple-choice',
        prompt: '«Студе́нтка, _____ статью́, выступа́ла на конфере́нции.» (who wrote — active past)',
        options: ['написа́вшая', 'напи́санная', 'написа́в'],
        correctAnswer: 'написа́вшая',
        explanation: 'Active past participle agreeing with feminine студе́нтка: написа́вшая.',
      },
      {
        id: 'qb1-2',
        type: 'multiple-choice',
        prompt: '«Когда́ я _____ из зда́ния, пошёл си́льный до́ждь.» (stepped out of)',
        options: ['вы́шел', 'вошёл', 'перешёл'],
        correctAnswer: 'вы́шел',
        explanation: 'Prefix вы- + из means exiting from inside an enclosed space: вы́шел из зда́ния.',
      },
      {
        id: 'qb1-3',
        type: 'multiple-choice',
        prompt: '«Э́то университе́т, в _____ я учи́лся пять ле́т.»',
        options: ['кото́рый', 'кото́ром', 'кото́рого'],
        correctAnswer: 'кото́ром',
        explanation: 'Static location takes в + Prepositional: в кото́ром.',
      },
      {
        id: 'qb1-4',
        type: 'multiple-choice',
        prompt: '«Е́сли _____ у меня́ бы́ло больше вре́мени, я бы вы́учил ещё оди́н язы́к.»',
        options: ['бы', 'что́бы', 'ли'],
        correctAnswer: 'бы',
        explanation: 'Unreal conditional clauses pair е́сли бы + past tense verb in both halves.',
      },
      {
        id: 'qb1-5',
        type: 'multiple-choice',
        prompt: 'Which negative imperative forbids eating something as bad advice in general («Don’t open that door!»):',
        options: ['Не открыва́й э́ту две́рь!', 'Не откро́й э́ту две́рь!'],
        correctAnswer: 'Не открыва́й э́ту две́рь!',
        explanation: 'General prohibitions or direct commands not to perform an action use Imperfective (Не открыва́й), while Не + Perfective warns against an accidental slip (Не забудь!).',
      },
    ],
    isPublished: true,
  },
  {
    id: 'quiz-b2-mastery',
    title: 'Level 4 (B2) Mastery Exam (ТРКИ-2 Benchmark)',
    titleRu: 'Экзамен уровня B2 (Второй сертификационный)',
    kind: 'level',
    levelId: 'b2',
    description:
      'Assesses functional stylistic precision, phraseology, complex verbal government, modality, and formal essay syntax.',
    passingScorePct: 70,
    questions: [
      {
        id: 'qb2-1',
        type: 'multiple-choice',
        prompt: 'Which expression best introduces a formal academic summary?',
        options: [
          'Короче говоря, все молодцы.',
          'Подводя́ ито́ги иссле́дования, сле́дует отме́тить...',
          'В о́бщем, так получилось.',
        ],
        correctAnswer: 'Подводя́ ито́ги иссле́дования, сле́дует отме́тить...',
        explanation: '«Подводя́ ито́ги иссле́дования, сле́дует отме́тить...» exemplifies high academic B2 prose.',
      },
      {
        id: 'qb2-2',
        type: 'multiple-choice',
        prompt: 'Identify the meaning of the idiom «найти́ о́бщий язы́к»:',
        options: [
          'To translate a dictionary verbatim',
          'To reach mutual understanding and rapport',
          'To lose one’s voice',
        ],
        correctAnswer: 'To reach mutual understanding and rapport',
        explanation: 'Найти́ о́бщий язы́к с ке́м-либо means to find common ground and connect easily.',
      },
      {
        id: 'qb2-3',
        type: 'multiple-choice',
        prompt: 'Choose the correct government: «Учёный уделя́ет большо́е внима́ние _____ (исто́рия И́ндии).»',
        options: ['исто́рии И́ндии', 'исто́рию И́ндии', 'об исто́рии И́ндии'],
        correctAnswer: 'исто́рии И́ндии',
        explanation: 'Уделя́ть внима́ние (to devote attention to) always governs the Dative case: исто́рии.',
      },
      {
        id: 'qb2-4',
        type: 'multiple-choice',
        prompt: 'Select the accurate sentence contrasting positive vs negative cause:',
        options: [
          'Всле́дствие густо́го тума́на вы́лет отложи́ли.',
          'Благодаря́ густо́му тума́ну вы́лет отложи́ли.',
          'Из-за упорного труда он блестяще выступил.',
        ],
        correctAnswer: 'Всле́дствие густо́го тума́на вы́лет отложи́ли.',
        explanation: 'Всле́дствие + Genitive suits formal neutral/negative cause-effect ("owing to dense fog").',
      },
    ],
    isPublished: true,
  },
];
