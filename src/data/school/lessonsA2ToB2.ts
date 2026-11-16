import { SchoolLesson } from '../../types/school';

export const LESSONS_A2_TO_B2: SchoolLesson[] = [
  // =========================================================================
  // LEVEL 2 (A2 — ELEMENTARY) — 3 COMPLETE LESSONS
  // =========================================================================
  {
    id: 'lesson-a2-1',
    levelId: 'a2',
    moduleId: 'mod-a2-2',
    order: 1,
    title: 'Lesson 2.1: Genitive & Dative Cases in Everyday Communication',
    titleRu: 'Урок 2.1: Родительный и Дательный падежи в живой речи',
    estimatedMinutes: 45,
    status: 'published',
    objectives: [
      'Use Genitive for absence (У меня́ не́т...), possession, origin (из), and quantities.',
      'Master Genitive Plural patterns (-ов, -ев, -ей, zero-ending feminine/neuter).',
      'Use Dative for recipients (дать другу), age (Мне 20 лет), and feelings/needs (Мне нра́вится, Мне ну́жно).',
    ],
    introduction:
      'Genitive (Роди́тельный) and Dative (Да́тельный) turn basic A1 sentences into natural Russian. Genitive lets you say what you lack, who owns something, where you came from, and how much of something exists. Dative lets you express age, likes, physical states, and giving.',
    vocabulary: [
      {
        id: 'voc-a2-vremya',
        word: 'время',
        stressed: 'вре́мя',
        translit: 'vremya',
        partOfSpeech: 'noun (neut. irreg.)',
        pronunciation: '[ˈvrʲemʲə]',
        english: 'time (Gen: вре́мени)',
        hindi: 'समय',
        exampleRu: 'У меня́ сего́дня не́т вре́мени.',
        exampleEn: 'I have no time today.',
        topic: 'Core Nouns',
        levelId: 'a2',
      },
      {
        id: 'voc-a2-nuzhno',
        word: 'нужно',
        stressed: 'ну́жно',
        translit: 'nuzhno',
        partOfSpeech: 'predicative (+ Dat.)',
        pronunciation: '[ˈnuʐnə]',
        english: 'need to / it is necessary',
        hindi: 'आवश्यक है / ज़रूरत है',
        exampleRu: 'Мне́ ну́жно купи́ть биле́т.',
        exampleEn: 'I need to buy a ticket.',
        topic: 'Modality',
        levelId: 'a2',
      },
      {
        id: 'voc-a2-sovety',
        word: 'помогать',
        stressed: 'помога́ть',
        translit: 'pomogat',
        partOfSpeech: 'verb (+ Dat.)',
        pronunciation: '[pəmɐˈɡatʲ]',
        english: 'to help',
        hindi: 'मदद करना',
        exampleRu: 'Преподава́тель помога́ет студе́нтам.',
        exampleEn: 'The teacher helps the students.',
        topic: 'University',
        levelId: 'a2',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Genitive Case: Singular & Crucial Genitive Plural Rules',
        body: [
          'Singular Genitive: Masculine/Neuter take -а/-я (бра́т -> не́т бра́та, окно́ -> у окна́); Feminine takes -ы/-и (кни́га -> не́т кни́ги, Росси́я -> из Росси́и).',
          'Plural Genitive: Hard masculine takes -ов (студе́нты -> студе́нтов); -й takes -ев (музе́й -> музе́ев); -ь and -ж/-ш/-ч/-щ take -ей (слова́рь -> словаре́й, врач -> враче́й). Feminine -а and Neuter -о lose their ending completely—a "zero ending"! (кни́га -> мно́го кни́г, окно́ -> о́кон, студе́нтка -> студе́нток).',
        ],
        indianLearnerTip:
          'Dative experiencer subjects ("Мне́ хо́лодно", "Мне́ интерéсно", "А́нне 21 го́д") align very closely with Hindi Dative experiencer constructions ("मुझे ठंड लग रही है", "मुझे यह पसंद है")!',
      },
      {
        heading: '2. Dative Case: Experiencers, Recipients & Age',
        body: [
          'Pronouns: мне́ (to me), тебе́ (to you), ему́ (to him), е́й (to her), на́м (to us), ва́м (to you), и́м (to them).',
          'Noun Endings (Singular -> Plural): Masc./Neut. -> -у/-ю (дру́г -> дру́гу, окно́ -> к окну́); Fem. -а/-я -> -е (сестра́ -> сестре́, И́ндия -> к И́ндии -> wait: -ия takes -ии: Мари́и!); Fem. -ь -> -и. All Plurals -> -ам/-ям (студе́нтам, друзья́м).',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'Genitive & Dative Forms Comparison',
        headers: ['Word (Nom.)', 'Genitive Sg.', 'Genitive Pl.', 'Dative Sg. / Pl.'],
        rows: [
          ['студе́нт (masc.)', 'студе́нта', 'студе́нтов', 'студе́нту / студе́нтам'],
          ['дру́г (masc. irreg.)', 'дру́га', 'друзе́й', 'дру́гу / друзья́м'],
          ['кни́га (fem.)', 'кни́ги', 'кни́г (zero!)', 'кни́ге / кни́гам'],
          ['сло́во (neut.)', 'сло́ва', 'сло́в (zero!)', 'сло́ву / слова́м'],
          ['И́ндия (-ия)', 'И́ндии', '—', 'И́ндии'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'У меня нет времени, мне нужно идти на лекцию.',
        stressed: 'У меня́ не́т вре́мени, мне́ ну́жно идти́ на ле́кцию.',
        translit: 'U menya net vremeni, mne nuzhno idti na lektsiyu.',
        english: 'I have no time; I need to go to a lecture.',
        hindi: 'मेरे पास समय नहीं है, मुझे लेक्चर के लिए जाना है।',
      },
      {
        russian: 'В нашей группе много студентов из Индии.',
        stressed: 'В на́шей гру́ппе мно́го студе́нтов из И́ндии.',
        translit: 'V nashey gruppe mnogo studentov iz Indii.',
        english: 'There are many students from India in our group.',
        hindi: 'हमारे समूह में भारत से कई छात्र हैं।',
      },
    ],
    dialogue: {
      title: 'Helping a Friend Prepare for Exams',
      setting: 'University Dormitory Lounge',
      lines: [
        {
          speaker: 'Мира',
          russian: 'Сергей, у тебя есть учебник по истории?',
          stressed: 'Серге́й, у тебя́ е́сть уче́бник по исто́рии?',
          translit: 'Sergey, u tebya yest uchebnik po istorii?',
          english: 'Sergey, do you have the history textbook?',
          hindi: 'सर्गेय, क्या तुम्हारे पास इतिहास की पाठ्यपुस्तक है?',
        },
        {
          speaker: 'Сергей',
          russian: 'Сейчас у меня его нет, я дал его другу. Но завтра могу дать тебе!',
          stressed: 'Сейча́с у меня́ его́ не́т, я да́л его́ дру́гу. Но за́втра могу́ да́ть тебе́!',
          translit: 'Seychas u menya yego net, ya dal yego drugu. No zavtra mogu dat tebe!',
          english: 'Right now I don’t have it; I gave it to a friend. But tomorrow I can give it to you!',
          hindi: 'अभी मेरे पास वह नहीं है, मैंने दोस्त को दी है। लेकिन कल मैं तुम्हें दे सकता हूँ!',
        },
      ],
    },
    readingPassage: {
      title: 'Letters Between Friends',
      russian: [
        'Ка́ждую суббо́ту Раху́л пи́шет роди́телям в Де́ли. Он расска́зывает ма́ме и па́пе о жи́зни в Каза́ни.',
        'Ему́ о́чень нра́вится его́ факульте́т, но зимо́й без тёплой ша́пки на у́лице дово́льно хо́лодно!',
      ],
      english: [
        'Every Saturday Rahul writes to his parents in Delhi. He tells his mom and dad about life in Kazan.',
        'He really likes his faculty, though in winter it is quite cold outside without a warm hat!',
      ],
      hindi: [
        'हर शनिवार को राहुल दिल्ली में अपने माता-पिता को लिखता है। वह माँ और पिताजी को कज़ान के जीवन के बारे में बताता है।',
        'उसे अपना संकाय बहुत पसंद है, लेकिन सर्दियों में गरम टोपी के बिना बाहर काफी ठंड लगती है!',
      ],
    },
    listeningExercise: {
      instruction: 'Listen and notice the Genitive Plural zero ending:',
      spokenTextRu: 'В библиотеке много интересных книг и журналов.',
      transcriptEn: 'In the library there are many interesting books and magazines.',
      question: 'Why does "книг" have no -ов/-ев ending after много?',
      options: [
        'Feminine nouns ending in -а drop their ending in Genitive Plural (zero ending)',
        'Because книга is neuter',
        'Because of the verb быть',
        'It is an exception like кофе',
      ],
      correctAnswer: 'Feminine nouns ending in -а drop their ending in Genitive Plural (zero ending)',
      explanation: 'мно́го + Genitive Plural -> кни́га loses -а to become кни́г; журна́л takes -ов.',
    },
    speakingPractice: {
      scenario: 'State 2 things you do not have (У меня́ не́т...) and 2 things you need to do (Мне́ ну́жно...).',
      prompts: [
        { promptEn: 'Say: I do not have a ticket yet; I need to call my friend.', modelRu: 'У меня ещё нет билета, мне нужно позвонить другу.', translit: 'U menya yeshchyo net bileta, mne nuzhno pozvonit drugu.', tip: 'Remember звони́ть takes Dative (дру́гу), not Accusative!' },
      ],
    },
    writingExercise: {
      prompt: 'Put the words into Genitive or Dative: В университете много (студент — pl.). Я пишу письмо (сестра). У нас нет (время).',
      guidance: 'Check студе́нтов, сестре́, вре́мени.',
      sampleAnswerRu: 'В университете много студентов. Я пишу письмо сестре. У нас нет времени.',
      sampleAnswerEn: 'Completed Genitive/Dative sentences.',
    },
    culturalNote:
      'In Russian phone calls and messages, you call TO someone using Dative («позвони́ть дру́гу / ма́ме»), NEVER Accusative—one of the biggest A2 fluency upgrades!',
    indiaRussiaEquivalent: {
      title: 'Dative Experiencers (Мне холодно / мне нравится)',
      similarity: 'Russian and Hindi both prefer Dative subjects for feelings, likes, age, and weather sensation (Мне 20 лет; मुझे 20 साल... / मुझे ठंड लगती है).',
      difference: 'Hindi uses the same postposition को (मुझे), whereas Russian alters pronouns sharply (я -> мне́, он -> ему́) and nouns (-у/-е).',
      pedagogicalTakeaway: 'Never translate "I like / I am cold" with Nominative Я! Reach straight for Мне́.',
    },
    exercises: [
      {
        id: 'ex-a21-1',
        type: 'case-ending',
        prompt: 'Complete with Genitive: В нашем городе нет (метро / вокзал / парк -> use "аэропо́рт"): В го́роде не́т ____.',
        correctAnswer: 'аэропорта',
        acceptedAnswers: ['аэропорта', 'аэропо́рта'],
        explanation: 'Не́т triggers Genitive: аэропо́рт -> аэропо́рта.',
      },
      {
        id: 'ex-a21-2',
        type: 'multiple-choice',
        prompt: 'Complete with the right pronoun: «____ о́чень интере́сно изуча́ть ру́сскую исто́рию.» (She finds it very interesting...)',
        options: ['Она', 'Её', 'Ей', 'О ней'],
        correctAnswer: 'Ей',
        explanation: 'Impersonal evaluation with интере́сно uses Dative: ей.',
      },
    ],
    summary: [
      'Genitive marks absence (нет), origin (из), possession, and quantities (мно́го + Gen. Pl.).',
      'Dative marks recipients, звонить/помогать objects, age, and Мне́ нравится / ну́жно.',
    ],
    homework: ['Write 5 sentences using У меня́ не́т + Genitive and 5 using Мне́ нра́вится / Мне́ ну́жно + Dative.'],
  },

  {
    id: 'lesson-a2-2',
    levelId: 'a2',
    moduleId: 'mod-a2-4',
    order: 2,
    title: 'Lesson 2.2: Instrumental Case & Complete Six-Case Integration',
    titleRu: 'Урок 2.2: Творительный падеж и система шести падежей',
    estimatedMinutes: 45,
    status: 'published',
    objectives: [
      'Use Instrumental (Твори́тельный) for companions (с дру́гом), professions/goals (рабо́тать / стать врачо́м), tools (писать ру́чкой), and location (ря́дом с, пе́ред).',
      'Review and contrast all 6 cases side by side in connected storytelling.',
    ],
    introduction:
      'Instrumental is the sixth and final Russian case—and one of the most expressive! It describes with whom you go (с бра́том), what instrument you use (карандашо́м), what season or time something happens (зимо́й, у́тром), and who you plan to become (стать инжене́ром).',
    vocabulary: [
      {
        id: 'voc-a2-vrach',
        word: 'врач',
        stressed: 'вра́ч',
        translit: 'vrach',
        partOfSpeech: 'noun (masc.)',
        pronunciation: '[vrat͡ɕ]',
        english: 'doctor / physician (Instr: врачо́м)',
        hindi: 'डॉक्टर / चिकित्सक',
        exampleRu: 'Моя́ сестра́ хо́чет стать врачо́м.',
        exampleEn: 'My sister wants to become a doctor.',
        topic: 'Professions',
        levelId: 'a2',
      },
      {
        id: 'voc-a2-ryadom',
        word: 'рядом с',
        stressed: 'ря́дом с (+ Instr.)',
        translit: 'ryadom s',
        partOfSpeech: 'preposition',
        pronunciation: '[ˈrʲadəm s]',
        english: 'next to / beside',
        hindi: 'के पास / बगल में',
        exampleRu: 'Общежи́тие нахо́дится ря́дом с па́рком.',
        exampleEn: 'The hostel is located next to the park.',
        topic: 'Space',
        levelId: 'a2',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Instrumental Endings & Top 5 Functions',
        body: [
          'Singular Endings: Masc./Neut. -> -ом/-ем (дру́гом, мо́рем; after ж/ш/ч/щ/ц unstressed -ем, stressed -ом: врачо́м, му́жем); Fem. -> -ой/-ей (сестро́й, И́ндией); Fem. -ь -> -ью (но́чью). Plural -> -ами/-ями (друзья́ми, кни́гами).',
          'Functions: (1) With/together: ко́фе с молоко́м, гуля́ть с дру́гом; (2) Becoming/being after быть (past/future), стать, рабо́тать: он был студе́нтом, бу́дет учи́телем; (3) Tool: писа́ть ру́чкой; (4) Prepositions ря́дом с, над, под, пе́ред, за, ме́жду; (5) Verbs интересова́ться (быть увлечённым), занима́ться.',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'All Six Russian Cases — Quick Synthesis (Singular)',
        headers: ['Case', 'Core Question', 'Masc. (бра́т)', 'Fem. (кни́га / сестра́)', 'Neut. (сло́во)'],
        rows: [
          ['1. Nominative', 'Кто? Что?', 'бра́т', 'кни́га / сестра́', 'сло́во'],
          ['2. Genitive', 'Кого́? Чего́?', 'бра́та', 'кни́ги / сестры́', 'сло́ва'],
          ['3. Dative', 'Кому́? Чему́?', 'бра́ту', 'кни́ге / сестре́', 'сло́ву'],
          ['4. Accusative', 'Кого́? Что?', 'бра́та (anim.)', 'кни́гу / сестру́', 'сло́во'],
          ['5. Instrumental', 'Ке́м? Че́м?', 'бра́том', 'кни́гой / сестро́й', 'сло́вом'],
          ['6. Prepositional', 'О ко́м? Где́?', 'о бра́те', 'в кни́ге / о сестре́', 'в сло́ве'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Я интересуюсь русской культурой и историей.',
        stressed: 'Я интересу́юсь ру́сской культу́рой и исто́рией.',
        translit: 'Ya interesuyus russkoy kulturoy i istoriyey.',
        english: 'I am interested in Russian culture and history.',
        hindi: 'मेरी रूसी संस्कृति और इतिहास में रुचि है।',
      },
      {
        russian: 'Утром я пью чай с лимоном, а вечером гуляю с друзьями.',
        stressed: 'У́тром я пью́ ча́й с лимо́ном, а ве́чером гуля́ю с друзья́ми.',
        translit: 'Utrom ya pyu chay s limonom, a vecherom gulyayu s druzyami.',
        english: 'In the morning I drink tea with lemon, and in the evening I walk with friends.',
        hindi: 'सुबह मैं नींबू वाली चाय पीता हूँ और शाम को दोस्तों के साथ टहलता हूँ।',
      },
    ],
    dialogue: {
      title: 'Career Goals & Campus Plans',
      setting: 'University Courtyard',
      lines: [
        {
          speaker: 'Лена',
          russian: 'Никита, кем ты хочешь стать после университета?',
          stressed: 'Ники́та, ке́м ты хо́чешь ста́ть по́сле университе́та?',
          translit: 'Nikita, kem ty khochesh stat posle universiteta?',
          english: 'Nikita, what do you want to become after university?',
          hindi: 'निकिता, विश्वविद्यालय के बाद तुम क्या बनना चाहते हो?',
        },
        {
          speaker: 'Никита',
          russian: 'Я хочу работать переводчиком или преподавателем. А ты?',
          stressed: 'Я хочу́ рабо́тать перево́дчиком и́ли преподава́телем. А ты́?',
          translit: 'Ya khochu rabotat perevodchikom ili prepodavatelem. A ty?',
          english: 'I want to work as a translator or teacher. And you?',
          hindi: 'मैं अनुवादक या शिक्षक के रूप में काम करना चाहता हूँ। और तुम?',
        },
        {
          speaker: 'Лена',
          russian: 'А я занимаюсь медициной — мечтаю стать детским врачом!',
          stressed: 'А я занима́юсь медици́ной — мечта́ю ста́ть де́тским врачо́м!',
          translit: 'A ya zanimayus meditsinoy — mechtayu stat detskim vrachom!',
          english: 'And I study medicine — I dream of becoming a pediatrician!',
          hindi: 'और मैं चिकित्सा का अध्ययन कर रही हूँ — बाल रोग विशेषज्ञ बनने का सपना है!',
        },
      ],
    },
    readingPassage: {
      title: 'All Six Cases Working Together',
      russian: [
        'Ле́том Ра́ви с бра́том пое́хал в Санкт-Петербу́рг. Их гости́ница находи́лась ря́дом с Нево́й.',
        'Ка́ждый де́нь они́ любова́лись краси́вой архитекту́рой, чита́ли путеводи́тели и обща́лись с но́выми друзья́ми.',
      ],
      english: [
        'In summer Ravi went to Saint Petersburg with his brother. Their hotel was located right beside the Neva.',
        'Every day they admired the beautiful architecture, read guidebooks, and chatted with new friends.',
      ],
      hindi: [
        'गर्मियों में रवि अपने भाई के साथ सेंट पीटर्सबर्ग गया। उनका होटल नेवा नदी के पास स्थित था।',
        'हर दिन वे सुंदर वास्तुकला की सराहना करते, गाइडबुक पढ़ते और नए दोस्तों के साथ बातचीत करते थे।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen and notice the Instrumental case after "с" (with):',
      spokenTextRu: 'Я иду в театр с сестрой и с лучшим другом.',
      transcriptEn: 'I am going to the theatre with my sister and my best friend.',
      question: 'Which Instrumental feminine ending appears on "сестра́"?',
      options: ['-е', '-у', '-ой', '-ом'],
      correctAnswer: '-ой',
      explanation: 'Feminine nouns ending in -а take -ой in Instrumental (сестро́й).',
    },
    speakingPractice: {
      scenario: 'Tell a partner what you are interested in (интересу́юсь) and what profession you hope to work in.',
      prompts: [
        { promptEn: 'Say: I am interested in literature and I want to work as an engineer / teacher.', modelRu: 'Я интересуюсь литературой и хочу работать инженером.', translit: 'Ya interesuyus literaturoy i khochu rabotat inzhenerom.', tip: 'Do not say работать инженер—use Instrumental инженером!' },
      ],
    },
    writingExercise: {
      prompt: 'Put the words into Instrumental: Я пью чай с (сахар и лимон). Мой отец работает (инженер). Рядом с (библиотека) есть парк.',
      guidance: 'Check endings: са́харом, лимо́ном, инжене́ром, библиоте́кой.',
      sampleAnswerRu: 'Я пью чай с сахаром и лимоном. Мой отец работает инженером. Рядом с библиотекой есть парк.',
      sampleAnswerEn: 'Completed Instrumental practice.',
    },
    culturalNote:
      'Russians never say «Я хочу быть доктор» in modern speech—after стать, рабо́тать, and past/future быть, always switch the profession noun into Instrumental: «Я хочу́ ста́ть до́ктором / врачо́м»!',
    indiaRussiaEquivalent: {
      title: 'Instrument & Companion (Instrumental vs. Hindi से / के साथ)',
      similarity: 'Just like Hindi uses "कलम से" (tool) and "दोस्त के साथ" (companion), Russian Instrumental cleanly separates tools (ру́чкой—no preposition!) from companions (с дру́гом—with preposition с).',
      difference: 'Russian requires Instrumental even for professions after быть (past/future) and стать.',
      pedagogicalTakeaway: 'When mentioning a tool like a pen or spoon, omit "с" (пишу́ ру́чкой). Keep "с" for companions and food ingredients (с дру́гом, с лимо́ном)!',
    },
    exercises: [
      {
        id: 'ex-a22-1',
        type: 'error-correction',
        prompt: 'Fix the case mistake: "Моя сестра хочет работать программист."',
        correctAnswer: 'Моя сестра хочет работать программистом.',
        acceptedAnswers: ['Моя сестра хочет работать программистом.', 'Моя сестра хочет работать программистом'],
        explanation: 'After рабо́тать / ста́ть / быть (future/past), professions require Instrumental (-ом).',
      },
      {
        id: 'ex-a22-2',
        type: 'multiple-choice',
        prompt: 'How do you say "I write with a pen" (no companion, just an instrument)?',
        options: ['Я пишу с ручкой.', 'Я пишу ручкой.', 'Я пишу ручку.', 'Я пишу в ручке.'],
        correctAnswer: 'Я пишу ручкой.',
        explanation: 'Tools/means use Instrumental WITHOUT the preposition с.',
      },
    ],
    summary: [
      'Instrumental endings: -ом/-ем (masc/neut), -ой/-ей/-ью (fem), -ами/-ями (plural).',
      'Now you know all 6 Russian cases: Nominative, Genitive, Dative, Accusative, Instrumental, Prepositional.',
    ],
    homework: ['Build a personal 6-case declension table for the words студе́нт, шко́ла, и го́род.'],
  },

  {
    id: 'lesson-a2-3',
    levelId: 'a2',
    moduleId: 'mod-a2-7',
    order: 3,
    title: 'Lesson 2.3: Verbal Aspect (НСВ / СВ) & Unprefixed Verbs of Motion',
    titleRu: 'Урок 2.3: Виды глагола и глаголы движения (идти/ходить, ехать/ездить)',
    estimatedMinutes: 50,
    status: 'published',
    objectives: [
      'Choose Imperfective (НСВ) vs. Perfective (СВ) correctly based on process, repetition, or completed result.',
      'Explain why Perfective verbs have NO present tense (their conjugated form means future!).',
      'Distinguish unidirectional vs. multidirectional motion verbs: идти́/ходи́ть (on foot) and е́хать/е́здить (by transport).',
    ],
    introduction:
      'Russian verbs come in pairs! Learning verbal aspect (вид глаго́ла) and the difference between walking in one direction right now (идти́) vs. walking repeatedly or making a round trip (ходи́ть) is the defining milestone of A2 Russian.',
    vocabulary: [
      {
        id: 'voc-a2-sdelat',
        word: 'делать / сделать',
        stressed: 'де́лать (НСВ) / сде́лать (СВ)',
        translit: 'delat / sdelat',
        partOfSpeech: 'verb aspect pair',
        pronunciation: '[ˈdʲeɫətʲ] / [ˈzdʲeɫətʲ]',
        english: 'to do / make (process vs finished)',
        hindi: 'करना (प्रक्रिया बनाम पूर्ण कार्य)',
        exampleRu: 'Вчера́ я весь ве́чер де́лал зада́ние и наконе́ц сде́лал его́!',
        exampleEn: 'Yesterday I spent all evening doing the assignment and finally finished it!',
        topic: 'Aspect',
        levelId: 'a2',
      },
      {
        id: 'voc-a2-idti-khodit',
        word: 'идти / ходить',
        stressed: 'идти́ / ходи́ть',
        translit: 'idti / khodit',
        partOfSpeech: 'verbs of motion (on foot)',
        pronunciation: '[ɪˈtʲi] / [xɐˈdʲitʲ]',
        english: 'to go on foot (one direction vs habitual/round-trip)',
        hindi: 'पैदल जाना (एक दिशा बनाम आना-जाना / नियमित)',
        exampleRu: 'Сейча́с я иду́ в библиоте́ку. Ка́ждый де́нь я хожу́ в библиоте́ку.',
        exampleEn: 'Right now I am walking to the library. Every day I go to the library.',
        topic: 'Motion',
        levelId: 'a2',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Imperfective (НСВ) vs. Perfective (СВ)',
        body: [
          'Use IMPERFECTIVE (НСВ: писа́ть, чита́ть, де́лать) for: (a) actions happening right now; (b) repeated/habitual actions (ка́ждый де́нь, ча́сто, обы́чно); (c) duration (весь де́нь, два часа́).',
          'Use PERFECTIVE (СВ: написа́ть, прочита́ть, сде́лать) for: (a) a single completed result (уже́, наконе́ц, вчера́); (b) a sequence of completed steps. CRITICAL: Conjugating a Perfective verb creates a SINGLE SIMPLE FUTURE (Я напишу́ = I will write & finish it; Я прочита́ю = I will read it through)!',
        ],
      },
      {
        heading: '2. Motion On Foot vs. By Transport',
        body: [
          'On foot: идти́ (1 direction right now / scheduled once: Куда́ ты идёшь? — Я иду́ в кино́) vs ходи́ть (habitually / back and forth / visited and returned: Вчера́ я ходи́л в музе́й = I went and came back!).',
          'By vehicle/transport: е́хать (in progress in one direction: Мы е́дем на по́езде в Каза́нь) vs е́здить (repeated trips / round trips: Ка́ждое ле́то мы е́здим в Де́ли).',
        ],
        indianLearnerTip:
          'This connects usefully to Hindi compound verbs! When Hindi says "मैंने पत्र लिखा / लिख लिया" (completed result), that matches Perfective написа́л; whereas "मैं पत्र लिख रहा था / लिखता था" matches Imperfective писа́л!',
      },
    ],
    grammarTables: [
      {
        title: 'Motion Verbs Quick Choice Grid',
        headers: ['Scenario', 'On Foot', 'By Transport', 'Example'],
        rows: [
          ['Going right now (1 direction)', 'идти́ (иду́, идёшь...)', 'е́хать (е́ду, е́дешь...)', 'Сейча́с я е́ду в аэропо́рт.'],
          ['Habitual / Repeated / Round trip', 'ходи́ть (хожу́, хо́дишь)', 'е́здить (е́зжу, е́здишь)', 'Я ка́ждый го́д е́зжу в И́ндию.'],
          ['Past round trip ("went & came back")', 'ходи́л / ходи́ла', 'е́здил / е́здила', 'Вчера́ мы ходи́ли на конце́рт.'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Вчера я два часа писал эссе и наконец написал его.',
        stressed: 'Вчера́ я два́ часа́ писа́л эссе́ и наконе́ц написа́л его́.',
        translit: 'Vchera ya dva chasa pisal esse i nakonets napisal yego.',
        english: 'Yesterday I wrote the essay for two hours and finally finished writing it.',
        hindi: 'कल मैंने दो घंटे निबंध लिखा और अंततः पूरा लिख लिया।',
      },
      {
        russian: 'Куда вы едете сейчас? — Мы едем в центр на метро.',
        stressed: 'Куда́ вы е́дете сейча́с? — Мы е́дем в це́нтр на метро́.',
        translit: 'Kuda vy yedete seychas? — My yedem v tsentr na metro.',
        english: 'Where are you heading now? — We are riding to the center on the metro.',
        hindi: 'आप अभी कहाँ जा रहे हैं? — हम मेट्रो से केंद्र जा रहे हैं।',
      },
    ],
    dialogue: {
      title: 'Weekend Museum Trip',
      setting: 'Campus Cafeteria',
      lines: [
        {
          speaker: 'Ира',
          russian: 'Привет, Амит! Куда ты идёшь так быстро?',
          stressed: 'Приве́т, А́мит! Куда́ ты идёшь та́к бы́стро?',
          translit: 'Privet, Amit! Kuda ty idyosh tak bystro?',
          english: 'Hi Amit! Where are you walking so fast?',
          hindi: 'नमस्ते अमित! तुम इतनी तेज़ी से कहाँ जा रहे हो?',
        },
        {
          speaker: 'Амит',
          russian: 'Я иду на лекцию по литературе. А ты уже прочитала рассказ Чехова?',
          stressed: 'Я иду́ на ле́кцию по литерату́ре. А ты́ уже́ прочита́ла расска́з Че́хова?',
          translit: 'Ya idu na lektsiyu po literature. A ty uzhe prochitala rasskaz Chekhova?',
          english: 'I am walking to the literature lecture. Have you already read the Chekhov story?',
          hindi: 'मैं साहित्य के लेक्चर में जा रहा हूँ। क्या तुमने चेखव की कहानी पढ़ ली?',
        },
        {
          speaker: 'Ира',
          russian: 'Да, прочитала вчера! А потом мы с подругой ходили в Третьяковскую галерею.',
          stressed: 'Да́, прочита́ла вчера́! А пото́м мы с подру́гой ходи́ли в Третьяко́вскую галере́ю.',
          translit: 'Da, prochitala vchera! A potom my s podrugoy khodili v Tretyakovskuyu galereyu.',
          english: 'Yes, I finished reading it yesterday! And afterwards my friend and I went to the Tretyakov Gallery.',
          hindi: 'हाँ, कल पढ़ ली! और उसके बाद मैं अपनी सहेली के साथ त्रेत्याकोव गैलरी गई थी।',
        },
      ],
    },
    readingPassage: {
      title: 'From Moscow to Suzdal',
      russian: [
        'Студе́нты давно́ хоте́ли посмотре́ть дре́вний го́род Су́здаль. В суббо́ту у́тром они́ по́ехали на авто́бусе и при́были к обе́ду.',
        'Там они́ весь де́нь гуля́ли пешко́м, фотографи́ровали белока́менные хра́мы и купи́ли сувени́ры.',
      ],
      english: [
        'For a long time the students had wanted to see the ancient town of Suzdal. On Saturday morning they set off by bus and arrived by lunchtime.',
        'There they walked on foot all day, photographed white-stone churches, and bought souvenirs.',
      ],
      hindi: [
        'छात्र लंबे समय से प्राचीन शहर सुज़्दाल देखना चाहते थे। शनिवार सुबह वे बस से गए और दोपहर तक पहुँच गए।',
        'वहाँ वे पूरे दिन पैदल घूमे, सफ़ेद पत्थर के मंदिरों की तस्वीरें लीं और यादगार वस्तुएँ खरीदीं।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen carefully to the time marker and choose the matching aspect meaning:',
      spokenTextRu: 'Я каждый день читаю новости, а сегодня я прочитал длинную статью.',
      transcriptEn: 'Every day I read the news, and today I read a long article (to the end).',
      question: 'Why did the speaker switch from чита́ю (НСВ) to прочита́л (СВ)?',
      options: [
        'Habitual daily action vs. single completed article',
        'Plural vs. singular subject',
        'On foot vs. by vehicle',
        'Formal vs. informal',
      ],
      correctAnswer: 'Habitual daily action vs. single completed article',
      explanation: 'Ка́ждый де́нь demands Imperfective; finishing one whole article demands Perfective.',
    },
    speakingPractice: {
      scenario: 'Contrast something you usually do vs something you completed yesterday.',
      prompts: [
        { promptEn: 'Say: Every evening I walk in the park, and yesterday I went to a museum and read a story.', modelRu: 'Каждый вечер я хожу в парк, а вчера я ходил в музей и прочитал рассказ.', translit: 'Kazhdyy vecher ya khozhu v park...', tip: 'Notice ходить -> хожу (d/zh consonant alternation).' },
      ],
    },
    writingExercise: {
      prompt: 'Choose the right verb: 1) Сейчас я (иду / хожу) в университет. 2) Каждое лето она (едет / ездит) в Индию. 3) Завтра я обязательно (буду писать / напишу) письмо до конца.',
      guidance: 'Check 1) single direction now -> иду; 2) repeated -> ездит; 3) completion marker "до конца" -> напишу.',
      sampleAnswerRu: '1) иду  2) ездит  3) напишу',
      sampleAnswerEn: 'Completed motion & aspect selection.',
    },
    culturalNote:
      'Russians differentiate sharply between going somewhere on foot (идти́/ходи́ть—even within a city neighbourhood or inside a building) and going by any wheeled vehicle or traveling to another city (е́хать/е́здить). Never say «Я иду́ в Москву́» from Delhi!',
    indiaRussiaEquivalent: {
      title: 'Hindi Compound Aspect Verbs vs. Russian Verbal Aspect',
      similarity: 'Hindi pairs simple/habitual verbs ("लिखता था") with vector-verb completions ("लिख लिया / लिख दिया") very similarly to Russian НСВ ("писа́л") vs СВ ("написа́л").',
      difference: 'Hindi changes direction/completion via helper verbs (जाना/लेना/देना), whereas Russian uses prefixes (на-, с-, про-) or stem pairs (брать/взять) and merges SV present tense directly into Future.',
      pedagogicalTakeaway: 'When unsure whether to use НСВ or СВ in the past, ask yourself: Am I focusing on the process/habit (НСВ) or the finished result (СВ)?',
    },
    exercises: [
      {
        id: 'ex-a23-1',
        type: 'multiple-choice',
        prompt: 'You see your classmate carrying a backpack toward the train station right now. You ask: «Куда́ ты ____?»',
        options: ['ходишь', 'идёшь', 'ездишь', 'ходил'],
        correctAnswer: 'идёшь',
        explanation: 'Single direction in progress right now on foot = идти́ -> ты идёшь.',
      },
      {
        id: 'ex-a23-2',
        type: 'multiple-choice',
        prompt: 'Which sentence means "Yesterday I visited the theatre (and came back)"?',
        options: ['Вчера я иду в театр.', 'Вчера я ходил в театр.', 'Вчера я еду в театр.', 'Вчера я напишу в театр.'],
        correctAnswer: 'Вчера я ходил в театр.',
        explanation: 'A completed round trip in the past uses multidirectional ходи́л / е́здил.',
      },
    ],
    summary: [
      'НСВ = ongoing, repeated, duration; СВ = single completed result or sequence.',
      'Идти́/Е́хать = one direction in progress; Ходи́ть/Е́здить = habitual or round trips.',
    ],
    homework: ['Keep a two-column journal for 3 days: one column of НСВ habits and one of СВ achievements.'],
  },

  // =========================================================================
  // LEVEL 3 (B1 — INTERMEDIATE) — 3 COMPLETE LESSONS
  // =========================================================================
  {
    id: 'lesson-b1-1',
    levelId: 'b1',
    moduleId: 'mod-b1-2',
    order: 1,
    title: 'Lesson 3.1: Prefixed Verbs of Motion (При-, У-, В-, Вы-, Пере-)',
    titleRu: 'Урок 3.1: Глаголы движения с пространственными приставками',
    estimatedMinutes: 50,
    status: 'published',
    objectives: [
      'Form aspectual motion pairs by attaching prefixes to -ходить/-йти and -езжать/-ехать.',
      'Control paired prepositions accurately: входи́ть в vs выходи́ть из; приходи́ть в vs уходи́ть с/из.',
      'Use приезжа́ть/прие́хать, уезжа́ть/уе́хать, переходи́ть, and доходи́ть in complex B1 narration.',
    ],
    introduction:
      'Adding prefixes to unprefixed verbs of motion turns them into normal Imperfective / Perfective aspect pairs! For example, "идти́/ходи́ть" stops meaning one-way vs round-trip and instead creates precise spatial meanings like arrive (прийти́), depart (уйти́), enter (войти́), and cross (перейти́).',
    vocabulary: [
      {
        id: 'voc-b1-priekhat',
        word: 'приезжать / приехать',
        stressed: 'приезжа́ть (НСВ) / прие́хать (СВ)',
        translit: 'priyezzhat / priyekhat',
        partOfSpeech: 'prefixed motion pair (transport)',
        pronunciation: '[prʲɪɪˈʑːatʲ] / [prʲɪˈjexətʲ]',
        english: 'to arrive (by transport)',
        hindi: 'पहुँचना / आना (वाहन द्वारा)',
        exampleRu: 'Он прие́хал в Москву́ из Мумба́и в сентябре́.',
        exampleEn: 'He arrived in Moscow from Mumbai in September.',
        topic: 'Prefixed Motion',
        levelId: 'b1',
      },
      {
        id: 'voc-b1-voyti',
        word: 'входить / войти',
        stressed: 'входи́ть (НСВ) / войти́ (СВ)',
        translit: 'vkhodit / voyti',
        partOfSpeech: 'prefixed motion pair (on foot)',
        pronunciation: '[fxɐˈdʲitʲ] / [vɐjˈtʲi]',
        english: 'to enter (into + Acc.)',
        hindi: 'अंदर प्रवेश करना',
        exampleRu: 'Когда́ преподава́тель вошёл в аудито́рию, все вста́ли.',
        exampleEn: 'When the professor entered the lecture hall, everyone stood up.',
        topic: 'Prefixed Motion',
        levelId: 'b1',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. How Prefixes Lock Aspect',
        body: [
          'Prefix + идти́ (-йти) ALWAYS makes a PERFECTIVE verb (прийти́, уйти́, войти́, вы́йти, перейти́).',
          'Prefix + ходи́ть ALWAYS makes an IMPERFECTIVE verb (приходи́ть, уходи́ть, входи́ть, выходи́ть, переходи́ть).',
          'Transport equivalent: Prefix + е́хать = PERFECTIVE (прие́хать, уе́хать); Prefix + -езжа́ть (never *ездить with spatial prefixes!) = IMPERFECTIVE (приезжа́ть, уезжа́ть, переезжа́ть).',
        ],
        indianLearnerTip:
          'Never attach spatial prefixes to е́здить for standard B1 motion—use -езжа́ть! Say «Он обы́чно приезжа́ет в 9», NOT *приездит.',
      },
      {
        heading: '2. Matching Prepositions & Cases',
        body: [
          'In / Arrival: в/на + Accusative (войти́ в ко́мнату, прие́хать в И́ндию, прийти́ к дру́гу [Dat.]).',
          'Out / Departure: из/с + Genitive, от + Genitive person (вы́йти из метро́, уе́хать из го́рода, уйти́ от врача́).',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'Essential B1 Prefixed Motion Matrix',
        headers: ['Prefix Meaning', 'Imperfective (НСВ)', 'Perfective (СВ)', 'Required Preposition'],
        rows: [
          ['Arrival (here / to)', 'приходи́ть / приезжа́ть', 'прийти́ / прие́хать', 'в/на + Acc.; к + Dat.'],
          ['Departure (away from)', 'уходи́ть / уезжа́ть', 'уйти́ / уе́хать', 'из/с/от + Gen.'],
          ['Entry (into)', 'входи́ть / въезжа́ть', 'войти́ / въе́хать', 'в/на + Acc.'],
          ['Exit (out of)', 'выходи́ть / выезжа́ть', 'вы́йти / вы́ехать', 'из/с + Gen.'],
          ['Across / Moving house', 'переходи́ть / переезжа́ть', 'перейти́ / перее́хать', '(че́рез) + Acc.'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Мы вышли из метро и перешли через широкую улицу.',
        stressed: 'Мы вы́шли из метро́ и перешли́ че́рез широ́кую у́лицу.',
        translit: 'My vyshli iz metro i pereshli cherez shirokuyu ulitsu.',
        english: 'We exited the metro and crossed the wide street.',
        hindi: 'हम मेट्रो से बाहर निकले और चौड़ी सड़क पार की।',
      },
      {
        russian: 'Поезд уходит ровно в восемь, поэтому приходите заранее.',
        stressed: 'По́езд ухо́дит ро́вно в во́семь, поэ́тому приходи́те зара́нее.',
        translit: 'Poyezd ukhodit rovno v vosem, poetomu prikhodite zaraneye.',
        english: 'The train departs promptly at eight, so arrive in advance.',
        hindi: 'ट्रेन ठीक आठ बजे रवाना होती है, इसलिए समय से पहले आ जाएँ।',
      },
    ],
    dialogue: {
      title: 'Meeting at Pulkovo Airport',
      setting: 'Saint Petersburg Arrival Hall',
      lines: [
        {
          speaker: 'Даша',
          russian: 'Алло, Девика! Вы уже приехали в город?',
          stressed: 'Алло́, Де́вика! Вы́ уже́ прие́хали в го́род?',
          translit: 'Allo, Devika! Vy uzhe priyekhali v gorod?',
          english: 'Hello, Devika! Have you already arrived in the city?',
          hindi: 'हैलो, देविका! क्या आप शहर पहुँच चुकी हैं?',
        },
        {
          speaker: 'Девика',
          russian: 'Только что вышли из терминала! Сейчас подойдём к остановке автобуса.',
          stressed: 'То́лько что вы́шли из термина́ла! Сейча́с подойдём к остано́вке авто́буса.',
          translit: 'Tolko shto vyshli iz terminala! Seychas podoydyom k ostanovke avtobusa.',
          english: 'We just exited the terminal! We will walk up to the bus stop now.',
          hindi: 'अभी-अभी टर्मिनल से बाहर आए हैं! अब हम बस स्टॉप के पास पहुँच रहे हैं।',
        },
      ],
    },
    readingPassage: {
      title: 'Navigating Moscow Campus Life',
      russian: [
        'Ка́ждый де́нь Анто́н выхо́дит из до́ма в полови́не восьмо́го, дохо́дит до ста́нции метро́ и приезжа́ет на факульте́т за де́сять мину́т до нача́ла па́ры.',
        'На про́шлой неде́ле он перее́хал в но́вое общежи́тие побли́же к библиоте́ке, и тепе́рь дорога́ занима́ет всего́ пятна́дцать мину́т.',
      ],
      english: [
        'Every day Anton leaves home at 7:30, walks as far as the metro station, and arrives at the faculty ten minutes before the class begins.',
        'Last week he moved into a new hostel closer to the library, and now the commute takes only fifteen minutes.',
      ],
      hindi: [
        'हर दिन अंतोन साढ़े सात बजे घर से निकलता है, मेट्रो स्टेशन तक पैदल जाता है और कक्षा शुरू होने से दस मिनट पहले संकाय पहुँच जाता है।',
        'पिछले हफ्ते वह पुस्तकालय के पास एक नए हॉस्टल में शिफ्ट हो गया, और अब रास्ते में केवल पंद्रह मिनट लगते हैं।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen carefully to the prefix contrast:',
      spokenTextRu: 'Поезд прибыл вовремя, и все пассажиры вышли на платформу.',
      transcriptEn: 'The train arrived on time, and all passengers stepped out onto the platform.',
      question: 'Which directional verb indicates stepping OUT of an enclosed space?',
      options: ['вошли', 'вышли', 'перешли', 'дошли'],
      correctAnswer: 'вышли',
      explanation: 'вы- marks outward movement (вы́йти -> past plural вы́шли).',
    },
    speakingPractice: {
      scenario: 'Describe your journey from your hostel to a museum using at least 3 prefixed motion verbs.',
      prompts: [
        { promptEn: 'Use вы́йти из, перейти́ че́рез, дойти́ до, прие́хать в.', modelRu: 'Я вышел из общежития, перешёл через площадь и приехал на метро к музею.', translit: 'Ya vyshel iz obshchezhitiya...', tip: 'Keep stress on ВЫ- for all Perfective forms with вы-!' },
      ],
    },
    writingExercise: {
      prompt: 'Fill in the correct prefix (при-, у-, вы-, пере-): 1) В 9 часов студенты ____шли из общежития. 2) Мы ____ехали в Россию изучать медицину. 3) Завтра брат ____едет в другой город.',
      guidance: '1) вышли (or ушли); 2) приехали; 3) переедет (or уедет).',
      sampleAnswerRu: '1) вышли  2) приехали  3) уедет / переедет',
      sampleAnswerEn: 'Completed spatial prefix exercise.',
    },
    culturalNote:
      'In Russian universities, double lecture blocks (90 minutes) are universally called «па́ра» (literally a pair of academic hours)—so students say «После пе́рвой па́ры»!',
    indiaRussiaEquivalent: {
      title: 'Spatial Direction via Verbal Prefixes vs. Separate Verbs',
      similarity: 'Both languages convey clear entry, exit, arrival, and crossing.',
      difference: 'Hindi relies on distinct root verbs + vectors (अंदर आना, बाहर निकलना, पार करना), whereas Russian preserves one core motion root (-йти / -ехать) and modifies the exact trajectory with a prefix.',
      pedagogicalTakeaway: 'Learn the 6 key prefixes (при-, у-, в-, вы-, пере-, под-/от-) once and you unlock dozens of Russian verbs effortlessly!',
    },
    exercises: [
      {
        id: 'ex-b11-1',
        type: 'multiple-choice',
        prompt: 'Which Imperfective pair correctly matches "прие́хать"?',
        options: ['приездить', 'приезжать', 'приходить', 'уезжать'],
        correctAnswer: 'приезжать',
        explanation: 'All spatial prefixed transport Imperfectives use -езжа́ть.',
      },
      {
        id: 'ex-b11-2',
        type: 'case-ending',
        prompt: 'Complete the preposition pair: Мы вы́шли ____ аудито́рии и вошли́ ____ библиоте́ку.',
        options: ['в / из', 'из / в', 'от / к', 'с / на'],
        correctAnswer: 'из / в',
        explanation: 'Exit takes из + Genitive; entry takes в + Accusative.',
      },
    ],
    summary: [
      'Prefixed motion verbs form standard Imperfective/Perfective pairs (-ходить/-йти, -езжать/-ехать).',
      'ВЫ- is ALWAYS stressed in Perfective forms (вы́шел, вы́йти).',
    ],
    homework: ['Write an 8-sentence itinerary of a train trip between two cities using прие́хать, вы́йти, перейти́, дойти́, and уе́хать.'],
  },

  {
    id: 'lesson-b1-2',
    levelId: 'b1',
    moduleId: 'mod-b1-4',
    order: 2,
    title: 'Lesson 3.2: Aspect in Negation, Infinitives & Imperatives',
    titleRu: 'Урок 3.2: Виды глагола в инфинитиве, отрицании и императиве',
    estimatedMinutes: 45,
    status: 'published',
    objectives: [
      'Avoid the top B1 error: never use Perfective after начина́ть, продолжа́ть, зака́нчивать, люби́ть, не на́до!',
      'Distinguish polite invitations (Входи́те!) from urgent warnings (Не упади́! Не забудь!) in imperatives.',
      'Control negation nuance: не де́лал (never even started) vs не сде́лал (tried / expected, failed to complete).',
    ],
    introduction:
      'At A2 you learned basic НСВ vs СВ in past and future. At B1 (ТРКИ-1), examiners test subtle aspect rules inside imperatives ("Don’t forget!" vs "Don’t worry!"), negative statements, and modal/phase verbs.',
    vocabulary: [
      {
        id: 'voc-b1-zabyvat',
        word: 'забывать / забыть',
        stressed: 'забыва́ть (НСВ) / забы́ть (СВ)',
        translit: 'zabyvat / zabyt',
        partOfSpeech: 'verb pair',
        pronunciation: '[zəbɨˈvatʲ] / [zɐˈbɨtʲ]',
        english: 'to forget',
        hindi: 'भूल जाना',
        exampleRu: 'Пожа́луйста, не забудь па́спорт!',
        exampleEn: 'Please do not forget your passport!',
        topic: 'Communication',
        levelId: 'b1',
      },
      {
        id: 'voc-b1-nachinat',
        word: 'начинать / начать',
        stressed: 'начина́ть (НСВ) / нача́ть (СВ)',
        translit: 'nachinat / nachat',
        partOfSpeech: 'phase verb (+ НСВ infinitive)',
        pronunciation: '[nətɕɪˈnatʲ] / [nɐˈtɕætʲ]',
        english: 'to begin',
        hindi: 'शुरू करना',
        exampleRu: 'Я на́чал чита́ть (НСВ!) ру́сский рома́н.',
        exampleEn: 'I began reading a Russian novel.',
        topic: 'Academic',
        levelId: 'b1',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Phase Verbs & "Не на́до / Не́льзя" + Imperfective ONLY',
        body: [
          'Phase verbs (начина́ть/нача́ть "start", продолжа́ть "continue", зака́нчивать/зако́нчить "finish", уста́ть "get tired of", учи́ться "learn to") ALWAYS require an IMPERFECTIVE (НСВ) infinitive—even when the phase verb itself is Perfective! Say «Он на́чал чита́ть», NEVER *на́чал прочита́ть.',
          'Similarly, «не на́до» (no need), «не́льзя» (not allowed / you shouldn’t), «хватит» (enough), and «переста́ть» (stop) take Imperfective: «Не на́до покупа́ть», «Не́льзя открыва́ть окно́». (Exception: не́льзя + СВ means physical impossibility: Здесь не́льзя перейти́ реку = impossible to cross here.)',
        ],
      },
      {
        heading: '2. Imperatives: Positive vs. Negative',
        body: [
          'Friendly / hospitable invitations (open door, tea, sitting down) take IMPERFECTIVE: Сади́тесь! Проходи́те! Бери́те, пожа́луйста!',
          'Negative advice or prohibition normally takes IMPERFECTIVE (Не спеши́те! Не волну́йтесь!). However, urgent warnings against an accidental mistake take НЕ + PERFECTIVE: Не забудь! (Don’t forget!), Не опозда́й! (Don’t be late!), Не урони́! (Don’t drop it!).',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'B1 Imperative & Negation Aspect Decision Table',
        headers: ['Context', 'Required Aspect', 'Authentic Example', 'Meaning Nuance'],
        rows: [
          ['After начать / продолжить / закончить', 'Always НСВ Infinitive', 'Мы зако́нчили переводи́ть текст.', 'Process phase ended'],
          ['Polite hospitality / invitations', 'НСВ Imperative', 'Входи́те, пожа́луйста! Угоща́йтесь!', 'Warm welcome'],
          ['Specific action request', 'СВ Imperative', 'Помоги́те мне, пожа́луйста! Закро́йте дверь.', 'Do this once cleanly'],
          ['Warning against accidental slip', 'Не + СВ Imperative', 'Смотри́, не потеря́й ключи́!', 'Careful not to lose accidentally'],
          ['General negative advice', 'Не + НСВ Imperative', 'Не говори́ та́к гро́мко.', 'Stop/avoid doing so'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Не волнуйтесь, мы уже закончили обсуждать проект.',
        stressed: 'Не волну́йтесь, мы́ уже́ зако́нчили обсужда́ть прое́кт.',
        translit: 'Ne volnuytes, my uzhe zakonchili obsuzhdat proyekt.',
        english: 'Don’t worry, we have already finished discussing the project.',
        hindi: 'चिंता मत कीजिए, हमने परियोजना पर चर्चा पूरी कर ली है।',
      },
      {
        russian: 'Пожалуйста, не забудьте принести словарь завтра!',
        stressed: 'Пожа́луйста, не забудьте принести́ слова́рь за́втра!',
        translit: 'Pozhaluysta, ne zabudte prinesti slovar zavtra!',
        english: 'Please don’t forget to bring the dictionary tomorrow!',
        hindi: 'कृपया कल शब्दकोश लाना मत भूलिएगा!',
      },
    ],
    dialogue: {
      title: 'Before the Seminar Presentation',
      setting: 'Department Corridor',
      lines: [
        {
          speaker: 'Преподаватель',
          russian: 'Входите, пожалуйста, садитесь! Вы уже начали готовить доклад?',
          stressed: 'Входи́те, пожа́луйста, сади́тесь! Вы́ уже́ на́чали гото́вить докла́д?',
          translit: 'Vkhodite, pozhaluysta, sadites! Vy uzhe nachali gotovit doklad?',
          english: 'Come in, please, have a seat! Have you already started preparing the presentation?',
          hindi: 'कृपया अंदर आइए, बैठिए! क्या आपने प्रस्तुति तैयार करना शुरू कर दिया है?',
        },
        {
          speaker: 'Сумитра',
          russian: 'Да, я почти закончила переводить цитаты. И обещаю — не опоздаю на выступление!',
          stressed: 'Да́, я почти́ зако́нчила переводи́ть цита́ты. И обеща́ю — не опозда́ю на выступле́ние!',
          translit: 'Da, ya pochti zakonchila perevodit tsitaty...',
          english: 'Yes, I almost finished translating the quotes. And I promise I won’t be late for the talk!',
          hindi: 'जी हाँ, मैंने उद्धरणों का अनुवाद लगभग पूरा कर लिया है। और वादा करती हूँ कि प्रस्तुति के लिए देर नहीं करूँगी!',
        },
      ],
    },
    readingPassage: {
      title: 'Hospitality Rules for Guests',
      russian: [
        'В Росси́и, когда́ го́сти прихо́дят в до́м, хозя́ева традицио́нно говоря́т: «Проходи́те, раздева́йтесь, сади́тесь к столу́!» Зде́сь испо́льзуется несоверше́нный вид, потому́ что э́то тёплое приглаше́ние.',
        'А проща́ясь, хозя́ева добавля́ют с улы́бкой: «Не забудьте позвони́ть, когда́ дое́дете!» — предупрежде́ние о возможно́й слу́чайности требует соверше́нного ви́да.',
      ],
      english: [
        'In Russia, when guests arrive at a home, hosts traditionally say: "Come on in, take off your coats, sit at the table!" Imperfective aspect is used here because it expresses a warm invitation.',
        'When saying goodbye, hosts smile and add: "Don’t forget to call when you get home!"—a gentle warning against an accidental lapse calls for Perfective.',
      ],
      hindi: [
        'रूस में जब मेहमान घर आते हैं, तो मेज़बान पारंपरिक रूप से कहते हैं: "अंदर आइए, कोट उतारिए, मेज़ पर बैठिए!" यहाँ अपूर्ण पक्ष (НСВ) का प्रयोग आत्मीय आमंत्रण को दर्शाता है।',
        'विदा लेते समय वे मुस्कुराकर जोड़ते हैं: "पहुँचकर फ़ोन करना मत भूलना!"—किसी अनजाने चूक के प्रति सावधानी के लिए पूर्ण पक्ष (СВ) का उपयोग होता है।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen to the phase verb sentence:',
      spokenTextRu: 'Они начали изучать русскую поэзию в прошлом семестре.',
      transcriptEn: 'They began studying Russian poetry last semester.',
      question: 'Why must "изуча́ть" remain Imperfective after "на́чали" (Perfective)?',
      options: [
        'Phase verbs (начина́ть/продолжа́ть/зака́нчивать) can only govern Imperfective infinitives',
        'Poetry is feminine',
        'It happened in the past',
        'Because of the preposition в',
      ],
      correctAnswer: 'Phase verbs (начина́ть/продолжа́ть/зака́нчивать) can only govern Imperfective infinitives',
      explanation: 'You can only begin, continue, or stop a PROCESS (НСВ), never a point-event.',
    },
    speakingPractice: {
      scenario: 'Welcome a classmate warmly and remind them politely not to forget their umbrella.',
      prompts: [
        { promptEn: 'Combine НСВ invitation + Не + СВ warning.', modelRu: 'Заходите, пожалуйста! Только не забудьте свой зонт.', translit: 'Zakhodite, pozhaluysta! Tolko ne zabudte svoy zont.', tip: 'Keep Не забудьте crisp with soft т.' },
      ],
    },
    writingExercise: {
      prompt: 'Fix the two aspect mistakes: 1) Он закончил написать доклад. 2) Не забывайте ваш паспорт сегодня вечером (single urgent reminder)!',
      guidance: 'Check писать (НСВ after закончить) and не забудьте (urgent warning).',
      sampleAnswerRu: '1) Он закончил писать доклад.  2) Не забудьте ваш паспорт сегодня вечером!',
      sampleAnswerEn: 'Corrected B1 aspect usage.',
    },
    culturalNote:
      'Saying «Не волну́йся!» (НСВ) comforts someone calmly, while telling a nervous friend «Успоко́йся!» (СВ) can sound abrupt or commanding—choosing the right aspect literally makes your Russian sound kinder!',
    indiaRussiaEquivalent: {
      title: 'Polite Commands & Prohibitions',
      similarity: 'Both languages soften imperatives by framing hospitality differently from urgent warnings.',
      difference: 'Hindi switches pronouns/suffixes ("आइए" vs "मत भूलना"), while Russian keeps the pronoun fixed and shifts the internal verb aspect (входи́те vs не забудьте).',
      pedagogicalTakeaway: 'Memorize «начина́ть / продолжа́ть / зака́нчивать + НСВ» as an ironclad B1 reflex.',
    },
    exercises: [
      {
        id: 'ex-b12-1',
        type: 'multiple-choice',
        prompt: 'Choose the correct sentence after "начать":',
        options: ['Он начал прочитать статью.', 'Он начал читать статью.', 'Он начал прочитал статью.', 'Он начнёт прочитает статью.'],
        correctAnswer: 'Он начал читать статью.',
        explanation: 'Phase verbs exclusively take Imperfective (НСВ) infinitives.',
      },
      {
        id: 'ex-b12-2',
        type: 'multiple-choice',
        prompt: 'You warn a friend heading to the airport: "Watch out, don’t miss your flight / don’t be late!"',
        options: ['Не опаздывай!', 'Не опоздай!', 'Не надо опоздать!', 'Продолжай не опаздывать!'],
        correctAnswer: 'Не опоздай!',
        explanation: 'Warnings against accidental single events take Не + СВ imperative (Не опозда́й!).',
      },
    ],
    summary: [
      'Нача́ть / продолжа́ть / зако́нчить / не на́до always govern НСВ infinitives.',
      'Polite invitations use НСВ imperatives; accidental-lapse warnings use Не + СВ imperatives.',
    ],
    homework: ['Write 4 sentences using начина́ть/зака́нчивать + НСВ and 3 realistic reminders with Не забудьте / Не потеряйте.'],
  },

  {
    id: 'lesson-b1-3',
    levelId: 'b1',
    moduleId: 'mod-b1-6',
    order: 3,
    title: 'Lesson 3.3: Participles (Причастия) & Verbal Adverbs (Деепричастия)',
    titleRu: 'Урок 3.3: Причастия и деепричастия в книжной и академической речи',
    estimatedMinutes: 50,
    status: 'published',
    objectives: [
      'Recognize and transform relative "который" clauses into active (-ущ-/-ющ-, -ащ-/-ящ-, -вш-) and passive (-нн-/-т-) participles.',
      'Use Imperfective (-а/-я) and Perfective (-в/-вши) adverbial participles (деепричастия) accurately.',
      'Avoid the "dangling subject" trap common when translating English "-ing" clauses.',
    ],
    introduction:
      'Open any Russian newspaper, biography, or university textbook at B1 level and half the sentences rely on participles (прича́стия — verbal adjectives) and verbal adverbs (дееприча́стия — "while doing / having done"). Mastering them bridges everyday speech and authentic Russian reading.',
    vocabulary: [
      {
        id: 'voc-b1-chitayushchiy',
        word: 'читающий',
        stressed: 'чита́ющий',
        translit: 'chitayushchiy',
        partOfSpeech: 'present active participle',
        pronunciation: '[tɕɪˈtajʊɕːɪj]',
        english: '(who is) reading',
        hindi: 'पढ़ता हुआ / पढ़ने वाला',
        exampleRu: 'Студе́нт, чита́ющий ле́кцию, из Де́ли.',
        exampleEn: 'The student giving/reading the talk is from Delhi.',
        topic: 'Academic Grammar',
        levelId: 'b1',
      },
      {
        id: 'voc-b1-prochitav',
        word: 'прочитав',
        stressed: 'прочита́в',
        translit: 'prochitav',
        partOfSpeech: 'perfective verbal adverb',
        pronunciation: '[prətɕɪˈtaf]',
        english: 'having read / after reading',
        hindi: 'पढ़कर',
        exampleRu: 'Прочита́в письмо́, она́ улыбну́лась.',
        exampleEn: 'Having read the letter, she smiled.',
        topic: 'Syntax',
        levelId: 'b1',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Participles (Прича́стия) = "Кото́рый" Condensed into an Adjective',
        body: [
          'Active Present (-ущ-/-ющ- from Conj. I; -ащ-/-ящ- from Conj. II): студе́нт, кото́рый изуча́ет хи́мию = студе́нт, изуча́ющий хи́мию (the student studying chemistry).',
          'Active Past (-вш- / -ш-): писа́тель, кото́рый написа́л рома́н = писа́тель, написа́вший рома́н.',
          'Passive Past (-нн- / -енн- / -т-): кни́га, кото́рую написа́л Толсто́й = кни́га, напи́санная Толсты́м; short passive: Рома́н напи́сан Толсты́м.',
        ],
      },
      {
        heading: '2. Verbal Adverbs (Дееприча́стия) & The Same-Subject Rule',
        body: [
          'Imperfective Деепричастие (-а/-я from present stem): читая (while reading), говоря́ (while speaking) -> «Читая те́кст, я выпи́сывал но́вые слова́.»',
          'Perfective Деепричастие (-в/-вши/-ши from past stem): прочита́в (having read / after reading), прие́хав (having arrived) -> «Прие́хав в Москву́, они́ сра́зу пошли́ на Кра́сную пло́щадь.»',
          'GOLDEN RULE: Both the деепричастие action AND the main verb MUST share the EXACT SAME grammatical subject (in Nominative)! Never write «*Приехав домой, мне стало тепло» (subject mismatch: приехал = Я, стало тепло has no Nominative subject!).',
        ],
        indianLearnerTip:
          'Hindi has an almost exact structural twin for Perfective деепричастие: the "-कर" conjunctive participle ("पढ़कर = прочитав", "पहुँचकर = приехав"), and for Imperfective деепричастие the "-ते हुए" participle ("पढ़ते हुए = читая")! And just like careful Hindi prose, Russian forbids dangling subjects!',
      },
    ],
    grammarTables: [
      {
        title: 'Participle & Verbal Adverb Identification Guide',
        headers: ['Form', 'Markers', 'Replaces...', 'Example'],
        rows: [
          ['Present Active Participle', '-ущ-/-ющ-, -ащ-/-ящ- + adj.', 'который + present verb', 'говоря́щий, живу́щий'],
          ['Past Active Participle', '-вш- / -ш- + adj.', 'который + past verb', 'прие́хавший, написа́вший'],
          ['Past Passive Participle', '-нн- / -енн- / -т- + adj.', 'которого/ую кто-то сделал', 'напи́санный, откры́тый'],
          ['Imperfective Verbal Adverb', '-а / -я (no endings change!)', 'когда́ / пока́ + НСВ (same subject)', 'слу́шая, изуча́я'],
          ['Perfective Verbal Adverb', '-в / -вши / -вшись', 'по́сле того́ как + СВ (same subject)', 'узна́в, верну́вшись'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Книга, переведённая на хинди, вызвала большой интерес читателей.',
        stressed: 'Кни́га, переведённая на хи́нди, вы́звала большо́й интере́с чита́телей.',
        translit: 'Kniga, perevedyonnaya na khindi, vyzvala bolshoy interes chitateley.',
        english: 'The book translated into Hindi aroused great interest among readers.',
        hindi: 'हिंदी में अनूदित इस पुस्तक ने पाठकों में गहरी रुचि जगाई।',
      },
      {
        russian: 'Окончив университет, Арун вернулся в Индию преподавателем.',
        stressed: 'Око́нчив университе́т, Ару́н верну́лся в И́ндию преподава́телем.',
        translit: 'Okonchiv universitet, Arun vernulsya v Indiyu prepodavatelem.',
        english: 'Having graduated from university, Arun returned to India as a teacher.',
        hindi: 'विश्वविद्यालय पूरा करने के बाद, अरुण एक शिक्षक के रूप में भारत लौट आए।',
      },
    ],
    dialogue: {
      title: 'Editing an Academic Essay',
      setting: 'University Writing Center',
      lines: [
        {
          speaker: 'Сарика',
          russian: 'Прочитав ваше эссе, я заметила одну стилистическую ошибку с деепричастием.',
          stressed: 'Прочита́в ва́ше эссе́, я заме́тила одну́ стилисти́ческую оши́бку с дееприча́стием.',
          translit: 'Prochitav vashe esse, ya zametila odnu stilisticheskuyu oshibku s deeprichastiyem.',
          english: 'Having read your essay, I noticed one stylistic mistake with a verbal adverb.',
          hindi: 'आपका निबंध पढ़ने के बाद, मैंने क्रिया-विशेषण (деепричастие) की एक शैलीगत त्रुटि देखी।',
        },
        {
          speaker: 'Студент',
          russian: 'Да, я написал «Войдя в зал, мне стало интересно» — подлежащие не совпадают!',
          stressed: 'Да́, я написа́л «Войдя́ в за́л, мне́ ста́ло интере́сно» — подлежа́щие не совпада́ют!',
          translit: 'Da, ya napisal "Voydya v zal, mne stalo interesno" — podlezhashchiye ne sovpadayut!',
          english: 'Yes, I wrote "Entering the hall, it became interesting to me" — the subjects don’t match!',
          hindi: 'हाँ, मैंने लिखा था "हॉल में प्रवेश करते हुए, मुझे दिलचस्प लगा" — यहाँ कर्ता मेल नहीं खाते!',
        },
      ],
    },
    readingPassage: {
      title: 'Cultural Bridges in Print',
      russian: [
        'Писа́тель, созда́вший оди́н из са́мых глубо́ких диало́гов с И́ндией в XIX–XX веках, — э́то Ле́в Толсто́й.',
        'Изуча́я фило́софию ненаси́лия и перепи́сываясь с Маха́тмой Га́нди, Толсто́й сформули́ровал иде́и, до сих по́р вдохновля́ющие чита́телей по всему́ ми́ру.',
      ],
      english: [
        'A writer who created one of the deepest dialogues with India in the 19th–20th centuries is Leo Tolstoy.',
        'Studying the philosophy of non-violence and corresponding with Mahatma Gandhi, Tolstoy formulated ideas that still inspire readers across the world.',
      ],
      hindi: [
        '19वीं–20वीं सदी में भारत के साथ सबसे गहरा संवाद रचने वाले लेखकों में से एक लियो टॉलस्टॉय हैं।',
        'अहिंसा के दर्शन का अध्ययन करते हुए और महात्मा गांधी से पत्राचार करते हुए टॉलस्टॉय ने ऐसे विचार व्यक्त किए जो आज भी विश्व भर के पाठकों को प्रेरित करते हैं।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen and notice how Chekhov’s classic rule applies:',
      spokenTextRu: 'Подъезжая к сией станцыи и глядя на природу в окно, у меня слетела шляпа.',
      transcriptEn: '(Chekhov’s famous humorous example!) "Approaching the station and looking out the window, my hat flew off."',
      question: 'Why did Chekhov invent that line in his satirical story «Жалобная книга»?',
      options: [
        'To parody a grammatical error: the hat didn’t approach the station, the passenger did!',
        'To teach the Dative case',
        'To illustrate regular spelling',
        'To show the future tense',
      ],
      correctAnswer: 'To parody a grammatical error: the hat didn’t approach the station, the passenger did!',
      explanation: 'Classic comic example proving why деепричастия require the Nominative subject («я», not «у меня... шляпа») to perform both actions.',
    },
    speakingPractice: {
      scenario: 'Combine two actions you did today into one crisp sentence using a Perfective деепричастие.',
      prompts: [
        { promptEn: 'Say: Having drunk tea, I opened my textbook.', modelRu: 'Выпив чай, я открыл учебник.', translit: 'Vypiv chay, ya otkryl uchebnik.', tip: 'Check: Я drank the tea, and Я opened the book—same subject!' },
      ],
    },
    writingExercise: {
      prompt: 'Convert into a participle phrase: "Город, который основал Пётр Первый" -> "Город, ____ Петром Первым".',
      guidance: 'Use passive past participle of основа́ть (-нн- agreeing with masc. го́род).',
      sampleAnswerRu: 'Город, основанный Петром Первым',
      sampleAnswerEn: 'The city founded by Peter the Great',
    },
    culturalNote:
      'Chekhov’s «Подъезжа́я к сие́й ста́нцыи, у меня́ слете́ла шля́па» is memorized by virtually every Russian high-schooler as a humorous reminder never to mismatch a verbal adverb subject!',
    indiaRussiaEquivalent: {
      title: 'Participles & Verbal Adverbs vs. Hindi -ता हुआ and -कर',
      similarity: 'Hindi чита́я = पढ़ते हुए, прочита́в = पढ़कर, and напи́санный = लिखा हुआ match conceptually far closer than English!',
      difference: 'Russian verbal adverbs are completely invariant (never change for gender/plural), whereas Russian participles (чита́ющий) decline across all 6 cases and 3 genders like full adjectives.',
      pedagogicalTakeaway: 'Whenever you read an academic sentence in Russian, underline every -вш-/-ущ-/-нн- word to isolate the relative clause instantly.',
    },
    exercises: [
      {
        id: 'ex-b13-1',
        type: 'multiple-choice',
        prompt: 'Which sentence is grammatically VALID with a деепричастие?',
        options: [
          'Вернувшись домой, мне захотелось спать.',
          'Вернувшись домой, я сразу лёг спать.',
          'Читая книгу, лампа погасла.',
          'Приехав в город, дождь начался.',
        ],
        correctAnswer: 'Вернувшись домой, я сразу лёг спать.',
        explanation: 'Only here does the Nominative subject (я) perform both верну́лся and лёг.',
      },
      {
        id: 'ex-b13-2',
        type: 'multiple-choice',
        prompt: 'Identify the Present Active Participle: "студенты, которые учатся в Москве"',
        options: ['учащиеся в Москве', 'учившие в Москве', 'учёные в Москве', 'выученные в Москве'],
        correctAnswer: 'учащиеся в Москве',
        explanation: 'учи́ться (Conj. II) takes -ащ- + plural -ие + reflexive -ся -> уча́щиеся.',
      },
    ],
    summary: [
      'Participles (-ущ-/-ащ-/-вш-/-нн-) replace который clauses and decline like adjectives.',
      'Verbal adverbs (-а/-я, -в/-вши) never decline and MUST share the Nominative subject.',
    ],
    homework: ['Take 3 sentences from a Russian news paragraph and rewrite each participle back into a который clause.'],
  },

  // =========================================================================
  // LEVEL 4 (B2 — UPPER INTERMEDIATE) — 3 COMPLETE LESSONS
  // =========================================================================
  {
    id: 'lesson-b2-1',
    levelId: 'b2',
    moduleId: 'mod-b2-1',
    order: 1,
    title: 'Lesson 4.1: Nuanced Aspect (Annulled Result) & Scientific/Academic Style',
    titleRu: 'Урок 4.1: Тонкости вида глагола и научный стиль речи',
    estimatedMinutes: 55,
    status: 'published',
    objectives: [
      'Master B2 aspectual competition: general factual statement (общефакти́ческое значе́ние) vs. annulled result (аннули́рованный результа́т).',
      'Identify hallmark syntax of Нау́чный сти́ль (Scientific/Academic Russian): verbal nouns, passive -ся, impersonal constructions.',
      'Distinguish subtle infinitive negation nuances (не успе́л сделать vs не до́лжен де́лать).',
    ],
    introduction:
      'Why does a Russian ask «Кто открыва́л окно́?» (Imperfective!) when the window is NOW closed again? Because the result was annulled! Welcome to B2 discourse precision—essential for university theses, research, and nuanced everyday conversation.',
    vocabulary: [
      {
        id: 'voc-b2-issledovanie',
        word: 'исследование',
        stressed: 'иссле́дование',
        translit: 'issledovaniye',
        partOfSpeech: 'verbal noun (neut.)',
        pronunciation: '[ɪˈslʲedəvənʲɪjə]',
        english: 'research / investigation',
        hindi: 'अनुसंधान / शोध',
        exampleRu: 'В да́нном иссле́довании рассматри́вается фоноло́гия.',
        exampleEn: 'In the present study, phonology is examined.',
        topic: 'Academic Style',
        levelId: 'b2',
      },
      {
        id: 'voc-b2-sledovatelno',
        word: 'следовательно',
        stressed: 'сле́довательно',
        translit: 'sledovatelno',
        partOfSpeech: 'discourse connector',
        pronunciation: '[ˈslʲedəvətʲɪlʲnə]',
        english: 'consequently / therefore',
        hindi: 'अतः / परिणामस्वरूप',
        exampleRu: 'Гипо́теза подтверди́лась; сле́довательно, вы́вод верен.',
        exampleEn: 'The hypothesis was confirmed; consequently, the conclusion is sound.',
        topic: 'Academic Style',
        levelId: 'b2',
      },
    ],
    grammarExplanation: [
      {
        heading: '1. Three High-Level Uses of Imperfective (НСВ) for Single Past Events',
        body: [
          '(a) General Factual (Общефакти́ческое): Did an event happen at all? («Вы читали Достое́вского?» — Not a single specific assignment, just general life experience.)',
          '(b) Annulled / Reversed Result (Аннули́рованный результа́т): You did it, AND THEN undid it! «Ой, холодно! Кто открыва́л (НСВ) окно́?» (Window was opened and closed again) vs «Кто откры́л (СВ) окно́?» (Window is still open right now!). «Он приходи́л» (visited & left) vs «Он пришёл» (still here!).',
        ],
      },
      {
        heading: '2. Architecture of Academic Russian (Нау́чный сти́ль)',
        body: [
          'Academic Russian avoids personal "Я" and relies on: (1) Passive/Reflexive-passive: «Анализи́руется про́блема...» (The problem is analyzed); (2) Plural-author humility: «Как мы отмеча́ли ра́нее...»; (3) Nominalization (replacing verbs with nouns in Genitive chains): «изуче́ние структу́ры предложе́ния».',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'Annulled Result Contrast (B2 Crucial)',
        headers: ['Utterance', 'Implied State RIGHT NOW', 'Why?'],
        rows: [
          ['Кто откры́л окно́? (СВ)', 'The window is STILL OPEN.', 'Result persists into the present.'],
          ['Кто открыва́л окно́? (НСВ)', 'The window is CLOSED again, yet room is cold.', 'Two-way / reversed result.'],
          ['Ко мне приходи́л де́кан. (НСВ)', 'The dean came and already left.', 'Round trip / reversed presence.'],
          ['Пришёл де́кан! (СВ)', 'The dean is here right now.', 'Result still holds.'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Извините, к вам заходил ваш научный руководитель, но уже ушёл.',
        stressed: 'Извини́те, к ва́м заходи́л ва́ш нау́чный руководи́тель, но уже́ ушёл.',
        translit: 'Izvinite, k vam zakhodil vash nauchnyy rukovoditel, no uzhe ushyol.',
        english: 'Excuse me, your thesis advisor dropped by, though they have already left.',
        hindi: 'माफ़ कीजिए, आपके शोध-निर्देशक आपसे मिलने आए थे, पर अभी जा चुके हैं।',
      },
      {
        russian: 'В статье рассматриваются ключевые аспекты межкультурного диалога.',
        stressed: 'В статье́ рассма́триваются ключевы́е аспе́кты межкульту́рного диало́га.',
        translit: 'V statye rassmatrivayutsya klyuchevyye aspekty mezhkulturnogo dialoga.',
        english: 'The article examines key aspects of intercultural dialogue.',
        hindi: 'इस लेख में अंतर-सांस्कृतिक संवाद के प्रमुख पहलुओं का विश्लेषण किया गया है।',
      },
    ],
    dialogue: {
      title: 'Thesis Consultation in the Department',
      setting: 'Faculty Office',
      lines: [
        {
          speaker: 'Профессор',
          russian: 'Вы уже просматривали новую статью по сравнительной лексикологии?',
          stressed: 'Вы́ уже́ просма́тривали но́вую статью́ по сравни́тельной лексиколо́гии?',
          translit: 'Vy uzhe prosmatrivali novuyu statyu...',
          english: 'Have you looked through the new article on comparative lexicology yet?',
          hindi: 'क्या आपने तुलनात्मक शब्दकोश-विज्ञान पर नया शोध-पत्र देखा है?',
        },
        {
          speaker: 'Аспирант',
          russian: 'Да, читал вчера в архиве! В работе убедительно доказывается взаимосвязь культур.',
          stressed: 'Да́, чита́л вчера́ в архи́ве! В рабо́те убеди́тельно дока́зывается взаимосвя́зь культу́р.',
          translit: 'Da, chital vchera v arkhive!',
          english: 'Yes, I read it yesterday in the archive! The paper persuasively demonstrates the interconnection of cultures.',
          hindi: 'जी हाँ, कल संग्रहालय/आर्काइव में पढ़ा! इस शोध में संस्कृतियों के अंतर्संबंध को प्रभावशाली ढंग से सिद्ध किया गया है।',
        },
      ],
    },
    readingPassage: {
      title: 'Excerpt in Academic Style',
      russian: [
        'В совреме́нной лингводида́ктике осо́бое внима́ние уделя́ется сопостави́тельному анали́зу фонети́ческих систе́м.',
        'На основа́нии проведённого исследова́ния мо́жно прийти́ к вы́воду о том, что системати́ческое обуче́ние интонацио́нным констру́кциям суще́ственно снижа́ет интерфере́нцию.',
      ],
      english: [
        'In contemporary language pedagogy, special attention is devoted to comparative analysis of phonetic systems.',
        'Based on the study conducted, one may arrive at the conclusion that systematic instruction in intonation constructions substantially reduces interference.',
      ],
      hindi: [
        'आधुनिक भाषा-शिक्षण शास्त्र में ध्वन्यात्मक प्रणालियों के तुलनात्मक विश्लेषण पर विशेष ध्यान दिया जाता है।',
        'किए गए अध्ययन के आधार पर यह निष्कर्ष निकाला जा सकता है कि स्वर-लहर (इंटोनेशन) संरचनाओं का व्यवस्थित प्रशिक्षण मातृभाषा के हस्तक्षेप को काफी कम करता है।',
      ],
    },
    listeningExercise: {
      instruction: 'Identify what the room looks like right now from the speaker’s choice of aspect:',
      spokenTextRu: 'К нам кто-то заходил, пока нас не было — на столе лежит записка.',
      transcriptEn: 'Someone stopped by while we were out — there is a note lying on the table.',
      question: 'Is the visitor still inside the room?',
      options: ['Yes, waiting inside', 'No, they came and already left (annulled presence = НСВ заходил)', 'Unclear', 'Tomorrow'],
      correctAnswer: 'No, they came and already left (annulled presence = НСВ заходил)',
      explanation: 'заходи́л (НСВ) indicates an arrival whose physical presence is no longer ongoing.',
    },
    speakingPractice: {
      scenario: 'Rephrase an informal statement into academic style without "я".',
      prompts: [
        { promptEn: 'Convert "Я исследовал проблему в этой главе" into passive academic Russian.', modelRu: 'В данной главе исследуется проблема...', translit: 'V dannoy glave issleduyetsya problema...', tip: 'Keep reflexive -ся on 3rd-person singular/plural.' },
      ],
    },
    writingExercise: {
      prompt: 'Write 3 academic sentences introducing a hypothetical research topic using: «В работе рассматривается...», «Следовательно...», «Можно прийти к выводу, что...».',
      guidance: 'Maintain objective academic register throughout.',
      sampleAnswerRu: 'В данной работе рассматривается влияние интонации на понимание речи. Данные показывают устойчивый прогресс; следовательно, методика эффективна. Можно прийти к выводу, что регулярное аудирование необходимо.',
      sampleAnswerEn: 'Academic prose sample.',
    },
    culturalNote:
      'In Russian academic papers (рефера́т, курсова́я, дипло́м), writing «я считаю» repeatedly feels overly subjective; scholarly convention prefers «Автор полага́ет...», «По на́шему мне́нию...», or «Представля́ется, что...».',
    indiaRussiaEquivalent: {
      title: 'Formal Academic Impersonality in English, Hindi & Russian',
      similarity: 'Formal Hindi scholarship similarly favors passive/impersonal frames ("इस शोध में ... का विश्लेषण किया गया है").',
      difference: 'Russian relies heavily on Genitive noun chains stacked cleanly in sequence (изучение + проблемы + развития + науки).',
      pedagogicalTakeaway: 'When reading Russian academic prose, look first for the conjugated reflexive verb (-ется/-ются), then unwind the Genitive chain.',
    },
    exercises: [
      {
        id: 'ex-b21-1',
        type: 'multiple-choice',
        prompt: 'You enter a chilly classroom whose windows are currently CLOSED. Which question fits naturally?',
        options: ['Кто открыл окно?', 'Кто открывал окно?', 'Кто откроет окно?', 'Кто открывал бы окно?'],
        correctAnswer: 'Кто открывал окно?',
        explanation: 'Annulled result: the window was opened earlier and closed again before you entered.',
      },
      {
        id: 'ex-b21-2',
        type: 'multiple-choice',
        prompt: 'Which opening phrase belongs strictly to Academic/Scientific style?',
        options: ['Короче говоря, мы тут подумали...', 'В настоящей работе анализируется...', 'Слушай, давай разберёмся!', 'Ну вот такие дела!'],
        correctAnswer: 'В настоящей работе анализируется...',
        explanation: 'Настоя́щая рабо́та + passive -ся exemplifies scientific register.',
      },
    ],
    summary: [
      'НСВ expresses annulled results (открыва́л, приходи́л) and general factual inquiries.',
      'Academic Russian favors passive -ся, nominalizations, and discourse connectors (сле́довательно, таким образом).',
    ],
    homework: ['Convert 4 informal observations about your study field into formal Научный стиль sentences.'],
  },

  {
    id: 'lesson-b2-2',
    levelId: 'b2',
    moduleId: 'mod-b2-3',
    order: 2,
    title: 'Lesson 4.2: Journalistic Style (Публицистика) & Everyday Idioms',
    titleRu: 'Урок 4.2: Язык СМИ (публицистический стиль) и фразеологизмы',
    estimatedMinutes: 50,
    status: 'published',
    objectives: [
      'Recognize journalistic discourse markers, rhetorical contrasts, and headlines without verbs.',
      'Understand and use 8 high-frequency Russian idioms (фразеологи́змы) naturally without awkward literal translation.',
    ],
    introduction:
      'Media and public commentary in Russian blend clarity with expressive imagery: headlines drop verbs for punch, essays pivot on «тем не ме́нее» and «несмо́тря на», and speakers weave vivid idioms into everyday arguments.',
    vocabulary: [
      {
        id: 'voc-b2-tem-ne-menee',
        word: 'тем не менее',
        stressed: 'те́м не ме́нее',
        translit: 'tem ne meneye',
        partOfSpeech: 'discourse link',
        pronunciation: '[tʲem nʲɪ ˈmʲenʲɪjɪ]',
        english: 'nevertheless / nonetheless',
        hindi: 'फिर भी / इसके बावजूद',
        exampleRu: 'Задача сложна́; те́м не ме́нее решение возможно.',
        exampleEn: 'The task is complex; nevertheless, a solution is possible.',
        topic: 'Discourse',
        levelId: 'b2',
      },
      {
        id: 'voc-b2-na-samom-dele',
        word: 'на самом деле',
        stressed: 'на са́мом де́ле',
        translit: 'na samom dele',
        partOfSpeech: 'parenthetical',
        pronunciation: '[nɐ ˈsaməm ˈdʲelʲɪ]',
        english: 'actually / in reality',
        hindi: 'वास्तव में / असल में',
        exampleRu: 'На са́мом де́ле всё гора́здо про́ще.',
        exampleEn: 'In reality, everything is much simpler.',
        topic: 'Discourse',
        levelId: 'b2',
      },
    ],
    grammarExplanation: [
      {
        heading: 'Common Phraseological Idioms (Фразеологи́змы)',
        body: [
          '1. Брать себя́ в ру́ки — to pull oneself together.',
          '2. Находи́ть о́бщий язы́к — to find common ground / click with someone.',
          '3. Не пу́ха ни пера́! (Response: К чёрту!) — traditional good-luck wish before an exam (literally "neither down nor feather!").',
          '4. Держи́те в ку́рсе — keep me posted / updated.',
          '5. Име́ть в виду́ — to keep in mind / mean.',
          '6. Лома́ть го́лову (над + Instr.) — to rack one’s brains over something.',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'Key Publicistic & Opinion Connectors',
        headers: ['Russian Connector', 'Register', 'Function'],
        rows: [
          ['С одно́й стороны́..., с друго́й стороны́...', 'Essay / Debate', 'On one hand..., on the other hand...'],
          ['Безусло́вно / Несомне́нно', 'Commentary', 'Undoubtedly'],
          ['В то́ же вре́мя / Однако', 'Media / Formal', 'At the same time / However'],
          ['Ре́чь идёт о (+ Prep.)', 'Press / Lectures', 'It concerns / We are talking about...'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Речь идёт о долгосрочном образовательном обмене между университетами.',
        stressed: 'Ре́чь идёт о долгосро́чном образова́тельном обме́не ме́жду университе́тами.',
        translit: 'Rech idyot o dolgosrochnom obrazovatelnom obmene mezhdu universitetami.',
        english: 'We are talking about long-term educational exchange between universities.',
        hindi: 'बात विश्वविद्यालयों के बीच दीर्घकालिक शैक्षिक आदान-प्रदान की हो रही है।',
      },
      {
        russian: 'Несмотря на языковой барьер, мы быстро нашли общий язык.',
        stressed: 'Несмотря́ на языково́й барье́р, мы бы́стро нашли́ о́бщий язы́к.',
        translit: 'Nesmotrya na yazykovoy baryer, my bystro nashli obshchiy yazyk.',
        english: 'Despite the language barrier, we quickly found common ground.',
        hindi: 'भाषा की बाधा के बावजूद, हमने जल्दी ही आपसी तालमेल बैठा लिया।',
      },
    ],
    dialogue: {
      title: 'Discussing Cultural Media Coverage',
      setting: 'University Radio Studio',
      lines: [
        {
          speaker: 'Кирилл',
          russian: 'Ты видел вчерашнюю статью? Заголовок звучал довольно драматично.',
          stressed: 'Ты ви́дел вчера́шнюю статью́? Заголо́вок звуча́л дово́льно драмати́чно.',
          translit: 'Ty videl vcherashnyuyu statyu?',
          english: 'Did you see yesterday’s article? The headline sounded quite dramatic.',
          hindi: 'क्या तुमने कल का लेख देखा? शीर्षक काफी नाटकीय लग रहा था।',
        },
        {
          speaker: 'Анушка',
          russian: 'Да, но на самом деле речь идёт о простом расширении стипендиальной программы. Главное — держать студентов в курсе!',
          stressed: 'Да́, но на са́мом де́ле ре́чь идёт о просто́м расшире́нии стипендиа́льной програ́ммы.',
          translit: 'Da, no na samom dele rech idyot o prostom rasshirenii...',
          english: 'Yes, but in reality it’s simply about expanding the scholarship program. The main thing is to keep students informed!',
          hindi: 'हाँ, लेकिन वास्तव में बात केवल छात्रवृत्ति कार्यक्रम के विस्तार की है। मुख्य बात छात्रों को जानकारी देते रहना है!',
        },
      ],
    },
    readingPassage: {
      title: 'Bridging Two Traditions in Contemporary Media',
      russian: [
        'В пу́бликациях о культу́ре Росси́и и И́ндии не́редко подчеркивается истори́ческая прее́мственность от Афана́сия Ники́тина до совреме́нных молоде́жных фо́румов.',
        'Те́м не ме́нее, ка́к отмеча́ют реда́кторы, бу́дущее диало́га зави́сит не сто́лько от ло́зунгов, ско́лько от ли́чных контактов и взаимопонима́ния.',
      ],
      english: [
        'Publications about the culture of Russia and India frequently emphasize historical continuity from Afanasy Nikitin to modern youth forums.',
        'Nevertheless, as editors point out, the future of dialogue depends less on slogans than on personal contact and mutual understanding.',
      ],
      hindi: [
        'रूस और भारत की संस्कृति पर प्रकाशनों में अफ़नासी निकितिन से लेकर आधुनिक युवा मंचों तक की ऐतिहासिक निरंतरता को अक्सर रेखांकित किया जाता है।',
        'फिर भी, जैसा कि संपादक बताते हैं, संवाद का भविष्य नारों पर नहीं बल्कि व्यक्तिगत संपर्कों और आपसी समझ पर निर्भर करता है।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen to the classic pre-exam Russian wish:',
      spokenTextRu: 'Завтра экзамен! Ни пуха ни пера! — К чёрту!',
      transcriptEn: 'Exam tomorrow! Break a leg! — To the devil!',
      question: 'Why do Russians NEVER say "Спасибо!" after «Ни пу́ха ни пера́!»?',
      options: [
        'Traditional superstition holds thanking directly spoils good luck; replying «К чёрту!» completes the charm',
        'Спасибо is only for shops',
        'It is rude to speak after exams',
        'It only applies to sports',
      ],
      correctAnswer: 'Traditional superstition holds thanking directly spoils good luck; replying «К чёрту!» completes the charm',
      explanation: 'Just like actors say "break a leg", Russians respond playfully with «К чёрту!»',
    },
    speakingPractice: {
      scenario: 'Summarize two sides of an educational topic using «С одно́й стороны́..., с друго́й стороны́..., те́м не ме́нее...».',
      prompts: [
        { promptEn: 'Deliver a 3-sentence balanced comment on learning languages online.', modelRu: 'С одной стороны, онлайн-занятия экономят время. С другой стороны, живое общение незаменимо. Тем не менее их сочетание даёт отличный результат.', translit: 'S odnoy storony...', tip: 'Pause slightly on commas after parenthetical words.' },
      ],
    },
    writingExercise: {
      prompt: 'Use any 3 B2 idioms or connectors (найти общий язык, иметь в виду, тем не менее, речь идёт о) in a short editorial paragraph.',
      guidance: 'Check comma placement around parenthetical links like тем не менее and на самом деле.',
      sampleAnswerRu: 'В статье речь идёт об изучении иностранных языков. На первый взгляд грамматика трудна, тем не менее регулярная практика помогает быстро найти общий язык с носителями. Важно также иметь в виду культурный контекст.',
      sampleAnswerEn: 'Short journalistic commentary paragraph.',
    },
    culturalNote:
      'In both Russia and India, proverb and idiom fluency signals deep cultural literacy—using «найти́ о́бщий язы́к» naturally warms up any conversation!',
    indiaRussiaEquivalent: {
      title: 'Idiomatic Logic vs. Literal Translation',
      similarity: 'Both Hindi ("मन लगाना", "लोहा मानना", "दाँतों तले उँगली दबाना") and Russian rely on rich bodily/nature metaphors.',
      difference: 'Never translate idioms word-for-word between English, Hindi, and Russian (e.g., "break a leg" in Russian is "ни пу́ха ни пера́").',
      pedagogicalTakeaway: 'Collect idioms together with their exact social response and comma rules.',
    },
    exercises: [
      {
        id: 'ex-b22-1',
        type: 'multiple-choice',
        prompt: 'What does «лома́ть го́лову над зада́чей» mean?',
        options: ['To bump one’s head', 'To struggle intensely / rack one’s brains over a problem', 'To finish quickly', 'To sleep late'],
        correctAnswer: 'To struggle intensely / rack one’s brains over a problem',
        explanation: 'Idiomatic expression for thinking deeply about something puzzling.',
      },
      {
        id: 'ex-b22-2',
        type: 'multiple-choice',
        prompt: 'Complete the idiom: «На экза́мене? Ни ____ ни пера́!»',
        options: ['снега', 'пуха', 'дождя', 'ветра'],
        correctAnswer: 'пуха',
        explanation: 'Fixed expression: Ни пу́ха ни пера́!',
      },
    ],
    summary: [
      'Publicistic Russian blends vivid idioms with structured discourse links (тем не менее, речь идёт о).',
      'Always reply «К чёрту!» (never «Спасибо!») to «Ни пу́ха ни пера́!»',
    ],
    homework: ['Read one short authentic Russian news article in the Reading Library and highlight 4 discourse connectors.'],
  },

  {
    id: 'lesson-b2-3',
    levelId: 'b2',
    moduleId: 'mod-b2-7',
    order: 3,
    title: 'Lesson 4.3: Literary Discourse, Syntax Focus & Persuasive Argumentation',
    titleRu: 'Урок 4.3: Художественный дискурс, порядок слов и убедительная аргументация',
    estimatedMinutes: 55,
    status: 'published',
    objectives: [
      'Analyze how Russian word order shifts New Information (Rheme / Ре́ма) to the end of the clause for emphasis.',
      'Read Pushkin’s concise syntax and Chekhov’s atmospheric prose for literary devices and tone.',
      'Structure a B2 persuasive essay with thesis, concession, evidence, and synthesized conclusion.',
    ],
    introduction:
      'People often say "Russian word order is completely free." At B2 you discover the truth: word order is NOT random—it carries information focus! Known context (Theme) sits at the beginning; new or emphatic news (Rheme) lands at the end.',
    vocabulary: [
      {
        id: 'voc-b2-podcherkivat',
        word: 'подчёркивать / подчеркнуть',
        stressed: 'подчёркивать / подчеркнуть',
        translit: 'podchyorkivat / podcherknut',
        partOfSpeech: 'verb pair',
        pronunciation: '[pɐtˈtɕorkʲɪvətʲ]',
        english: 'to emphasize / underline',
        hindi: 'रेखांकित करना / ज़ोर देना',
        exampleRu: 'Автор подчёркивает значение личной ответственности.',
        exampleEn: 'The author emphasizes the significance of personal responsibility.',
        topic: 'Literary Criticism',
        levelId: 'b2',
      },
      {
        id: 'voc-b2-nesmotrya',
        word: 'несмотря на то что',
        stressed: 'несмотря́ на то́ что',
        translit: 'nesmotrya na to chto',
        partOfSpeech: 'concessive conjunction',
        pronunciation: '[nʲɪsmɐˈtrʲa nɐ ˈto ʂtə]',
        english: 'despite the fact that / although',
        hindi: 'इस तथ्य के बावजूद कि',
        exampleRu: 'Несмотря́ на то что про́за Пу́шкина лакони́чна, она́ порази́тельно ёмка.',
        exampleEn: 'Although Pushkin’s prose is laconic, it is strikingly rich in meaning.',
        topic: 'Argumentation',
        levelId: 'b2',
      },
    ],
    grammarExplanation: [
      {
        heading: 'Theme (Те́ма) vs. Rheme (Ре́ма) — Why End-Position Matters',
        body: [
          'Compare: «Ле́в Толсто́й (Theme) написа́л «Войну́ и ми́р» (Rheme).» Answers: What did Tolstoy write?',
          'Compare: ««Войну́ и ми́р» (Theme) написа́л Ле́в Толсто́й (Rheme).» Answers: WHO wrote War and Peace?',
          'In English you must say "It was Tolstoy who wrote War and Peace"; Russian accomplishes the exact same spotlight simply by sliding the key answer to the end of the sentence!',
        ],
      },
    ],
    grammarTables: [
      {
        title: 'B2 Argumentative Essay Blueprint',
        headers: ['Stage', 'Key Russian Templates'],
        rows: [
          ['Thesis Introduction', 'Пробле́ма ... явля́ется одно́й из наибо́лее актуальных. Представля́ется, что...'],
          ['Evidence / Example', 'Свиде́тельством этому слу́жит... В подтвержде́ние данно́й мысли приведём при́мер...'],
          ['Concession & Counter', 'Допусти́м, кто-то возрази́т, что... Тем не ме́нее нельзя́ не призна́ть...'],
          ['Conclusion', 'Подводя́ ито́г, следует подчеркнуть, что...'],
        ],
      },
    ],
    exampleSentences: [
      {
        russian: 'Именно в этом стихотворении отразилась душа эпохи.',
        stressed: 'И́менно в э́том стихотворе́нии отрази́лась душа́ эпо́хи.',
        translit: 'Imenno v etom stikhotvorenii otrazilas dusha epokhi.',
        english: 'It is precisely in this poem that the soul of the era was reflected.',
        hindi: 'ठीक इसी कविता में उस युग की आत्मा प्रतिबिंबित हुई है।',
      },
    ],
    dialogue: {
      title: 'Literary Seminar Debate',
      setting: 'Philology Seminar',
      lines: [
        {
          speaker: 'Преподаватель',
          russian: 'Обратите внимание на концовку предложения у Бунина: почему глагол стоит в начале?',
          stressed: 'Обрати́те внима́ние на концо́вку предложе́ния у Бу́нина: почему́ глаго́л стои́т в нача́ле?',
          translit: 'Obratite vnimaniye na kontsovku predlozheniya u Bunina...',
          english: 'Pay attention to the end of Bunin’s sentence: why does the verb stand at the beginning?',
          hindi: 'बुनिन के वाक्य के अंत पर ध्यान दें: क्रिया शुरुआत में क्यों रखी गई है?',
        },
        {
          speaker: 'Студент',
          russian: 'Чтобы вынести подлежащее в позицию ремы — акцентировать именно человека, о котором идёт речь!',
          stressed: 'Что́бы вы́нести подлежа́щее в пози́цию ре́мы — акценти́ровать и́менно челове́ка, о кото́ром идёт ре́чь!',
          translit: 'Chtoby vynesti podlezhashcheye v pozitsiyu remy...',
          english: 'To move the subject into the Rheme focus slot—spotlighting specifically the person being discussed!',
          hindi: 'ताकि कर्ता को मुख्य आकर्षण (रेमा) के स्थान पर लाकर उसी व्यक्ति पर बल दिया जा सके!',
        },
      ],
    },
    readingPassage: {
      title: 'Note on Pushkin’s Prose Precision',
      russian: [
        'Ещё Бели́нский отмеча́л, что про́за Алекса́ндра Пу́шкина отлича́ется ре́дкой я́сностью и отсу́тствием изли́шних украше́ний.',
        'Ка́ждое сло́во несёт то́чный смысл, а сдержанный то́н заставля́ет чита́теля внима́тельнее вслу́шиваться в подте́кст.',
      ],
      english: [
        'Belinsky already noted that Alexander Pushkin’s prose is distinguished by rare clarity and an absence of superfluous ornament.',
        'Every word carries exact meaning, and its restrained tone leads the reader to listen more attentively to the subtext.',
      ],
      hindi: [
        'बेलिंस्की ने पहले ही कहा था कि अलेक्जेंडर पुश्किन का गद्य अपनी दुर्लभ स्पष्टता और अनावश्यक अलंकरण की अनुपस्थिति के लिए जाना जाता है।',
        'हर शब्द सटीक अर्थ वहन करता है, और संयत स्वर पाठक को अंतर्निहित भावों को अधिक ध्यान से सुनने के लिए प्रेरित करता है।',
      ],
    },
    listeningExercise: {
      instruction: 'Listen to the word order focus:',
      spokenTextRu: 'Это стихотворение перевела известная индийская поэтесса.',
      transcriptEn: 'This poem was translated by a well-known Indian poetess.',
      question: 'Which piece of information is the NEW Rheme highlight here?',
      options: ['Which poem it is', 'Who translated the poem (известная индийская поэтесса)', 'The year it was printed', 'The language'],
      correctAnswer: 'Who translated the poem (известная индийская поэтесса)',
      explanation: 'Placing the translator at the very end spotlights who performed the action.',
    },
    speakingPractice: {
      scenario: 'Deliver a concise B2 seminar conclusion summarizing why learning Russian literature enriches cross-cultural understanding.',
      prompts: [
        { promptEn: 'Use «Подводя́ ито́г...» and «и́менно...».', modelRu: 'Подводя итог, хотелось бы подчеркнуть, что именно диалог культур делает перевод по-настоящему живым.', translit: 'Podvodya itog...', tip: 'Maintain steady, measured academic pacing.' },
      ],
    },
    writingExercise: {
      prompt: 'Write a structured 100-word B2 response to: «Заче́м изуча́ть иностра́нный язы́к в эпо́ху автомати́ческого перево́да?» (Why study a foreign language in an era of machine translation?)',
      guidance: 'Use thesis, concession (Несмотря на то что...), argument, and conclusion (Подводя итог...).',
      sampleAnswerRu: 'Несмотря на то что современные переводчики быстро справляются с бытовыми фразами, знание иностранного языка по-прежнему незаменимо. Во-первых, автоматический перевод не передаёт тонких культурных оттенков и подтекста. Во-вторых, живое общение строится на доверии, когда собеседники понимают друг друга напрямую. Подводя итог, следует подчеркнуть, что изучение языка остаётся ключом к глубокому уважению другой культуры.',
      sampleAnswerEn: 'Balanced B2 argumentative response.',
    },
    culturalNote:
      'Russian literary culture deeply reveres the written word: quoting Pushkin, Chekhov, or Tolstoy accurately is not pretentious—it is part of everyday educated dialogue across generations.',
    indiaRussiaEquivalent: {
      title: 'Word-Order Emphasis vs. Hindi Contrastive Focus',
      similarity: 'Both Russian and Hindi allow SOV/SVO scrambling to highlight new information without passive voice.',
      difference: 'Hindi commonly places the focused item immediately BEFORE the verb ("यह किताब प्रेमचंद ने लिखी"), whereas Russian normally moves the newly emphasized Rheme to the END of the clause.',
      pedagogicalTakeaway: 'When reading Russian literature, pause on the final 2–3 words of each sentence—that is where the author placed the emotional or logical punch!',
    },
    exercises: [
      {
        id: 'ex-b23-1',
        type: 'multiple-choice',
        prompt: 'Which word order cleanly answers: "WHO founded Moscow State University?"',
        options: [
          'Московский университет основал в 1755 году.',
          'Московский университет основал Михаил Ломоносов.',
          'Михаил Ломоносов основал в 1755 году.',
          'Основал в Москве университет.',
        ],
        correctAnswer: 'Московский университет основал Михаил Ломоносов.',
        explanation: 'Moving Михаил Ломоносов to the end (Rheme slot) highlights the answer to "WHO?".',
      },
    ],
    summary: [
      'Russian word order encodes Theme (known, start) -> Rheme (new focus, end).',
      'B2 argumentative prose links concessions, evidence, and synthesis smoothly.',
    ],
    homework: ['Choose a C1 or C2 classic excerpt in the Reading Library and analyze two examples of expressive word order.'],
  },
];
