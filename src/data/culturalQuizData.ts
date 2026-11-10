import { Language } from '../types';

export type QuizDomain = 'history' | 'language' | 'geography';

export interface CulturalQuizQuestion {
  id: string;
  domain: QuizDomain;
  country: 'Russia' | 'India' | 'Shared';
  points: number;
  question: Record<Language, string>;
  options: Record<Language, string[]>;
  correctIndex: number;
  explanation: Record<Language, string>;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  affiliation: 'India' | 'Russia' | 'International';
  domain: QuizDomain | 'all';
  score: number;
  accuracy: number;
  streak: number;
  date: string;
  isUser?: boolean;
}

export const culturalQuizQuestions: CulturalQuizQuestion[] = [
  // ================= HISTORY (6) =================
  {
    id: 'cq-hist-1',
    domain: 'history',
    country: 'Shared',
    points: 20,
    question: {
      en: 'Which 15th-century Russian merchant traveled to India (1466–1472) and wrote "A Journey Beyond the Three Seas"?',
      ru: 'Какой русский купец XV века совершил путешествие в Индию (1466–1472) и написал «Хожение за три моря»?',
      hi: '15वीं शताब्दी के किस रूसी व्यापारी ने भारत की यात्रा (1466–1472) की और "तीन समुद्रों के पार की यात्रा" लिखी?',
    },
    options: {
      en: ['Afanasy Nikitin', 'Yermak Timofeyevich', 'Semyon Dezhnev', 'Vitus Bering'],
      ru: ['Афанасий Никитин', 'Ермак Тимофеевич', 'Семён Дежнёв', 'Витус Беринг'],
      hi: ['अफनासी निकितिन', 'येरमाक टिमोफेयेविच', 'सेम्योन देझनेव', 'विटस बेरिंग'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Afanasy Nikitin of Tver reached India in 1469—nearly 30 years before Vasco da Gama—documenting the Bahmani Sultanate, trade, and Indian customs.',
      ru: 'Тверской купец Афанасий Никитин достиг Индии в 1469 году — почти за 30 лет до Васко да Гамы — и подробно описал быт, культуру и торговлю.',
      hi: 'त्वर के व्यापारी अफनासी निकितिन 1469 में वास्को डी गामा से लगभग 30 वर्ष पहले भारत पहुँचे और भारतीय संस्कृति व व्यापार का वर्णन किया।',
    },
  },
  {
    id: 'cq-hist-2',
    domain: 'history',
    country: 'India',
    points: 20,
    question: {
      en: 'Which ancient Indian university, founded in the 5th century CE in Bihar, attracted scholars from across Asia?',
      ru: 'Какой древнеиндийский университет, основанный в V веке н.э. в Бихаре, привлекал учёных со всей Азии?',
      hi: '5वीं शताब्दी ईस्वी में बिहार में स्थापित किस प्राचीन भारतीय विश्वविद्यालय ने पूरे एशिया से विद्वानों को आकर्षित किया?',
    },
    options: {
      en: ['Nalanda Mahavihara', 'Takshashila', 'Vikramashila', 'Vallabhi'],
      ru: ['Наланда Махавихара', 'Такшашила', 'Викрамашила', 'Валлабхи'],
      hi: ['नालंदा महाविहार', 'तक्षशिला', 'विक्रमशिला', 'वल्लभी'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Nalanda Mahavihara was one of the world’s earliest residential universities, housing thousands of students and a vast nine-story library.',
      ru: 'Наланда была одним из первых в мире университетов-общежитий, где обучались тысячи студентов и хранилась грандиозная библиотека.',
      hi: 'नालंदा महाविहार विश्व के सबसे प्राचीन आवासीय विश्वविद्यालयों में से एक था, जहाँ हजारों छात्र और एक विशाल पुस्तकालय था।',
    },
  },
  {
    id: 'cq-hist-3',
    domain: 'history',
    country: 'Russia',
    points: 20,
    question: {
      en: 'In what year did Tsar Peter the Great found the city of Saint Petersburg as Russia’s "window to Europe"?',
      ru: 'В каком году Пётр Первый основал Санкт-Петербург как «окно в Европу»?',
      hi: 'ज़ार पीटर महान ने किस वर्ष सेंट पीटर्सबर्ग शहर की स्थापना की थी?',
    },
    options: {
      en: ['1703', '1613', '1762', '1812'],
      ru: ['1703', '1613', '1762', '1812'],
      hi: ['1703', '1613', '1762', '1812'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Saint Petersburg was founded on May 27, 1703, on the Neva River delta and served as the imperial capital of Russia for over two centuries.',
      ru: 'Санкт-Петербург был основан 27 мая 1703 года в дельте Невы и более двух столетий оставался столицей Российской империи.',
      hi: 'सेंट पीटर्सबर्ग की स्थापना 27 मई 1703 को नेवा नदी के डेल्टा पर हुई थी और यह दो शताब्दियों से अधिक समय तक रूसी साम्राज्य की राजधानी रहा।',
    },
  },
  {
    id: 'cq-hist-4',
    domain: 'history',
    country: 'Shared',
    points: 20,
    question: {
      en: 'Which landmark bilateral agreement between India and the Soviet Union was signed in August 1971?',
      ru: 'Какой исторический двусторонний договор между Индией и СССР был подписан в августе 1971 года?',
      hi: 'अगस्त 1971 में भारत और सोवियत संघ के बीच कौन सा ऐतिहासिक द्विपक्षीय समझौता हुआ था?',
    },
    options: {
      en: [
        'Treaty of Peace, Friendship and Cooperation',
        'Tashkent Declaration',
        'Delhi Space Accord',
        'Panchsheel Cultural Pact',
      ],
      ru: [
        'Договор о мире, дружбе и сотрудничестве',
        'Ташкентская декларация',
        'Делийское космическое соглашение',
        'Культурный пакт Панчашила',
      ],
      hi: [
        'शांति, मित्रता और सहयोग की संधि',
        'ताशकंद घोषणा',
        'दिल्ली अंतरिक्ष समझौता',
        'पंचशील सांस्कृतिक समझौता',
      ],
    },
    correctIndex: 0,
    explanation: {
      en: 'Signed on August 9, 1971, the Indo-Soviet Treaty of Peace, Friendship and Cooperation became a cornerstone of strategic and cultural partnership.',
      ru: 'Подписанный 9 августа 1971 года Договор о мире, дружбе и сотрудничестве стал фундаментом стратегического партнёрства Индии и СССР.',
      hi: '9 अगस्त 1971 को हस्ताक्षरित शांति, मित्रता और सहयोग की संधि भारत-सोवियत रणनीतिक और सांस्कृतिक साझेदारी की आधारशिला बनी।',
    },
  },
  {
    id: 'cq-hist-5',
    domain: 'history',
    country: 'Russia',
    points: 20,
    question: {
      en: 'Which decisive 1942–1943 battle on the Volga River marked the major turning point of World War II?',
      ru: 'Какое решающее сражение 1942–1943 годов на Волге стало коренным переломом во Второй мировой войне?',
      hi: 'वोल्गा नदी पर 1942–1943 की किस निर्णायक लड़ाई ने द्वितीय विश्व युद्ध का रुख बदल दिया?',
    },
    options: {
      en: ['Battle of Stalingrad', 'Battle of Borodino', 'Battle of Poltava', 'Battle of Kulikovo'],
      ru: ['Сталинградская битва', 'Бородинское сражение', 'Полтавская битва', 'Куликовская битва'],
      hi: ['स्टालिनग्राद की लड़ाई', 'बोरोदिनो की लड़ाई', 'पोल्टावा की लड़ाई', 'कुलिकोवो की लड़ाई'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The 200-day Battle of Stalingrad halted the Axis advance and became a global symbol of endurance and courage.',
      ru: '200-дневная Сталинградская битва остановила наступление противника и стала мировым символом стойкости.',
      hi: '200 दिनों तक चली स्टालिनग्राद की लड़ाई ने आक्रमण को रोक दिया और यह अदम्य साहस का वैश्विक प्रतीक बन गई।',
    },
  },
  {
    id: 'cq-hist-6',
    domain: 'history',
    country: 'India',
    points: 20,
    question: {
      en: 'Which Mauryan Emperor erected rock and pillar edicts promoting Dharma and non-violence across the Indian subcontinent?',
      ru: 'Какой император династии Маурьев воздвиг наскальные эдикты, провозглашавшие Дхарму и ненасилие?',
      hi: 'किस मौर्य सम्राट ने पूरे भारतीय उपमहाद्वीप में धर्म और अहिंसा का संदेश देने वाले शिलालेख और स्तंभ बनवाए?',
    },
    options: {
      en: ['Emperor Ashoka', 'Chandragupta II', 'Harshavardhana', 'Rajaraja Chola'],
      ru: ['Император Ашока', 'Чандрагупта II', 'Харшавардана', 'Раджараджа Чола'],
      hi: ['सम्राट अशोक', 'चंद्रगुप्त द्वितीय', 'हर्षवर्धन', 'राजराजा चोल'],
    },
    correctIndex: 0,
    explanation: {
      en: 'After the Kalinga War in the 3rd century BCE, Ashoka embraced Buddhism and inscribed moral edicts across his empire, inspiring India’s national emblem.',
      ru: 'После войны в Калинге в III веке до н.э. Ашока принял буддизм и увековечил эдикты о сострадании, а львиная капитель из Сарнатха стала гербом Индии.',
      hi: 'कलिंग युद्ध के बाद सम्राट अशोक ने बौद्ध धर्म अपनाया और नैतिक शिलालेख खुदवाए; सारनाथ का अशोक स्तंभ आज भारत का राष्ट्रीय प्रतीक है।',
    },
  },

  // ================= LANGUAGE (6) =================
  {
    id: 'cq-lang-1',
    domain: 'language',
    country: 'Shared',
    points: 20,
    question: {
      en: 'Which pair of words demonstrates the shared Indo-European linguistic root between Russian and Sanskrit/Hindi?',
      ru: 'Какая пара слов иллюстрирует общее индоевропейское родство русского языка и санскрита/хинди?',
      hi: 'निम्नलिखित में से कौन सा शब्द-युग्म रूसी और संस्कृत/हिंदी के साझा भारोपीय (इंडो-यूरोपीय) मूल को दर्शाता है?',
    },
    options: {
      en: [
        'Брат (Brat) — भ्राता (Bhrata) [Brother]',
        'Дом (Dom) — आकाश (Akash) [Sky]',
        'Река (Reka) — अग्नि (Agni) [Fire]',
        'Снег (Sneg) — सूर्य (Surya) [Sun]',
      ],
      ru: [
        'Брат (Brat) — भ्राता (Bhrata) [Брат]',
        'Дом (Dom) — आकाश (Akash) [Небо]',
        'Река (Reka) — अग्नि (Agni) [Огонь]',
        'Снег (Sneg) — सूर्य (Surya) [Солнце]',
      ],
      hi: [
        'Брат (ब्रात) — भ्राता [भाई]',
        'Дом (दोम) — आकाश [आसमान]',
        'Река (रेका) — अग्नि [आग]',
        'Снег (स्नेग) — सूर्य [सूरज]',
      ],
    },
    correctIndex: 0,
    explanation: {
      en: 'Both Russian "Брат" (Brat) and Sanskrit "भ्रातृ / भ्राता" (Bhrata) descend from the Proto-Indo-European root *bʰréh₂tēr, meaning brother.',
      ru: 'Русское слово «брат» и санскритское «бхрата» восходят к общему праиндоевропейскому корню *bʰréh₂tēr.',
      hi: 'रूसी शब्द "ब्रात" और संस्कृत शब्द "भ्राता" दोनों प्रोटो-इंडो-यूरोपीय मूल *bʰréh₂tēr से निकले हैं, जिसका अर्थ भाई है।',
    },
  },
  {
    id: 'cq-lang-2',
    domain: 'language',
    country: 'Russia',
    points: 20,
    question: {
      en: 'How many grammatical cases (падежи) are used in standard modern Russian?',
      ru: 'Сколько падежей насчитывается в современном русском литературном языке?',
      hi: 'आधुनिक मानक रूसी भाषा में कितने व्याकरणिक कारक (Cases) होते हैं?',
    },
    options: {
      en: ['6 cases', '4 cases', '8 cases', '2 cases'],
      ru: ['6 падежей', '4 падежа', '8 падежей', '2 падежа'],
      hi: ['6 कारक', '4 कारक', '8 कारक', '2 कारक'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Russian has 6 core grammatical cases: Nominative, Genitive, Dative, Accusative, Instrumental, and Prepositional.',
      ru: 'В русском языке 6 основных падежей: именительный, родительный, дательный, винительный, творительный и предложный.',
      hi: 'रूसी भाषा में 6 मुख्य कारक होते हैं: कर्ता, संबंध, संप्रदान, कर्म, करण और अधिकरण।',
    },
  },
  {
    id: 'cq-lang-3',
    domain: 'language',
    country: 'India',
    points: 20,
    question: {
      en: 'What is the name of the abugida script used to write Hindi, Sanskrit, and Marathi?',
      ru: 'Как называется слоговая письменность (абугида), используемая для записи хинди, санскрита и маратхи?',
      hi: 'हिंदी, संस्कृत और मराठी लिखने के लिए प्रयुक्त लिपि का नाम क्या है?',
    },
    options: {
      en: ['Devanagari', 'Brahmi-Cyrillic', 'Gurmukhi', 'Grantha'],
      ru: ['Деванагари', 'Брахми-кириллица', 'Гурмукхи', 'Грантха'],
      hi: ['देवनागरी', 'ब्राह्मी-सिरिलिक', 'गुरुमुखी', 'ग्रंथ'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Devanagari ("script of the divine city") is written from left to right and is recognized by its distinctive horizontal top line (shirorekha).',
      ru: 'Деванагари («письмо божественного города») пишется слева направо и отличается характерной верхней горизонтальной чертой — широрекхой.',
      hi: 'देवनागरी बाएँ से दाएँ लिखी जाती है और इसकी पहचान इसके अक्षरों के ऊपर लगी क्षैतिज रेखा (शिरोरेखा) से होती है।',
    },
  },
  {
    id: 'cq-lang-4',
    domain: 'language',
    country: 'Russia',
    points: 20,
    question: {
      en: 'Which 9th-century brothers created the Glagolitic script, the predecessor of the Cyrillic alphabet used in Russia?',
      ru: 'Какие братья-просветители IX века создали славянскую азбуку, лёгшую в основу кириллицы?',
      hi: '9वीं शताब्दी के किन भाइयों ने स्लाविक लिपि बनाई, जो रूसी सिरिलिक वर्णमाला की पूर्वज थी?',
    },
    options: {
      en: ['Cyril and Methodius', 'Boris and Gleb', 'Pushkin and Lomonosov', 'Minin and Pozharsky'],
      ru: ['Кирилл и Мефодий', 'Борис и Глеб', 'Пушкин и Ломоносов', 'Минин и Пожарский'],
      hi: ['सिरिल और मेथोडियस', 'बोरिस और ग्लीब', 'पुश्किन और लोमोनोसोव', 'मिनिन और पोज़ार्स्की'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Saints Cyril and Methodius devised the Slavic alphabet in the 9th century, and May 24 is celebrated in Russia as the Day of Slavic Literature and Culture.',
      ru: 'Святые Кирилл и Мефодий создали славянскую письменность в IX веке; 24 мая в России отмечается День славянской письменности и культуры.',
      hi: 'संत सिरिल और मेथोडियस ने 9वीं शताब्दी में स्लाविक वर्णमाला का निर्माण किया; 24 मई को रूस में स्लाविक साहित्य और संस्कृति दिवस मनाया जाता है।',
    },
  },
  {
    id: 'cq-lang-5',
    domain: 'language',
    country: 'Shared',
    points: 20,
    question: {
      en: 'The Russian word "Огонь" (Ogon) shares its ancient Indo-European origin with which Sanskrit/Hindi word?',
      ru: 'Русское слово «Огонь» имеет общее индоевропейское происхождение с каким словом санскрита/хинди?',
      hi: 'रूसी शब्द "Огонь" (ओगोन) का प्राचीन भारोपीय मूल किस संस्कृत/हिंदी शब्द से जुड़ा है?',
    },
    options: {
      en: ['अग्नि (Agni — Fire)', 'जल (Jal — Water)', 'वायु (Vayu — Wind)', 'पृथ्वी (Prithvi — Earth)'],
      ru: ['अग्नि (Агни — Огонь)', 'जल (Джал — Вода)', 'वायु (Ваю — Ветер)', 'पृथ्वी (Притхви — Земля)'],
      hi: ['अग्नि (आग)', 'जल (पानी)', 'वायु (हवा)', 'पृथ्वी (धरती)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Russian "Огонь" (Ogon), Sanskrit "Agni", and Latin "Ignis" all trace back to the Proto-Indo-European root *h₁n̥gʷnis.',
      ru: 'Русское «огонь», санскритское «агни» и латинское «ignis» происходят от единого индоевропейского корня.',
      hi: 'रूसी "ओगोन", संस्कृत "अग्नि" और लैटिन "इग्निस" सभी एक ही प्रोटो-इंडो-यूरोपीय मूल से विकसित हुए हैं।',
    },
  },
  {
    id: 'cq-lang-6',
    domain: 'language',
    country: 'India',
    points: 20,
    question: {
      en: 'Who authored the "Ashtadhyayi", the foundational ancient treatise on Sanskrit grammar?',
      ru: 'Кто является автором «Аштадхьяи» — фундаментального древнеиндийского трактата по грамматике санскрита?',
      hi: 'संस्कृत व्याकरण के आधारभूत प्राचीन ग्रंथ "अष्टाध्यायी" के रचयिता कौन हैं?',
    },
    options: {
      en: ['Panini', 'Kalidasa', 'Valmiki', 'Chanakya'],
      ru: ['Панини', 'Калидаса', 'Вальмики', 'Чанакья'],
      hi: ['पाणिनि', 'कालिदास', 'वाल्मीकि', 'चाणक्य'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Composed around the 5th–4th century BCE, Panini’s Ashtadhyayi contains nearly 4,000 formal rules that modern linguists and computer scientists still admire.',
      ru: 'Труд Панини «Аштадхьяи» содержит около 4000 строгих формальных правил, которые высоко ценятся современными лингвистами и программистами.',
      hi: 'पाणिनि की अष्टाध्यायी में लगभग 4,000 सूत्र हैं, जिनकी वैज्ञानिक संरचना की प्रशंसा आधुनिक भाषाविद् और कंप्यूटर वैज्ञानिक भी करते हैं।',
    },
  },

  // ================= GEOGRAPHY (6) =================
  {
    id: 'cq-geo-1',
    domain: 'geography',
    country: 'Russia',
    points: 20,
    question: {
      en: 'Which Siberian lake holds roughly 20% of the world’s unfrozen surface freshwater and is the deepest lake on Earth?',
      ru: 'Какое сибирское озеро содержит около 20% мировых запасов пресной поверхностной воды и является самым глубоким на Земле?',
      hi: 'साइबेरिया की कौन सी झील पृथ्वी की सबसे गहरी झील है और दुनिया के लगभग 20% ताजे पानी का भंडार रखती है?',
    },
    options: {
      en: ['Lake Baikal', 'Lake Ladoga', 'Lake Onega', 'Lake Teletskoye'],
      ru: ['Озеро Байкал', 'Ладожское озеро', 'Онежское озеро', 'Телецкое озеро'],
      hi: ['बैकाल झील', 'लाडोगा झील', 'ओनेगा झील', 'तेलेत्सकोये झील'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lake Baikal in Irkutsk Oblast and Buryatia plunges to 1,642 meters and is a UNESCO World Heritage Site.',
      ru: 'Озеро Байкал достигает глубины 1642 метра и входит в список Всемирного наследия ЮНЕСКО.',
      hi: 'बैकाल झील 1,642 मीटर गहरी है और यह यूनेस्को की विश्व धरोहर स्थल है।',
    },
  },
  {
    id: 'cq-geo-2',
    domain: 'geography',
    country: 'India',
    points: 20,
    question: {
      en: 'Where do the Arabian Sea, the Bay of Bengal, and the Indian Ocean converge at the southernmost tip of mainland India?',
      ru: 'Где на самой южной точке материковой Индии сливаются Аравийское море, Бенгальский залив и Индийский океан?',
      hi: 'मुख्य भूमि भारत के सबसे दक्षिणी सिरे पर अरब सागर, बंगाल की खाड़ी और हिंद महासागर का संगम कहाँ होता है?',
    },
    options: {
      en: ['Kanyakumari', 'Rameswaram', 'Kochi', 'Puducherry'],
      ru: ['Каньякумари', 'Рамешварам', 'Кочи', 'Пудучерри'],
      hi: ['कन्याकुमारी', 'रामेश्वरम', 'कोच्चि', 'पुडुचेरी'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Kanyakumari in Tamil Nadu is famous for its tri-sea confluence (Triveni Sangam) and the Vivekananda Rock Memorial.',
      ru: 'Каньякумари в штате Тамилнад знаменит слиянием трёх морей и мемориалом Свами Вивекананды.',
      hi: 'तमिलनाडु में स्थित कन्याकुमारी तीन समुद्रों के संगम (त्रिवेणी संगम) और विवेकानंद रॉक मेमोरियल के लिए प्रसिद्ध है।',
    },
  },
  {
    id: 'cq-geo-3',
    domain: 'geography',
    country: 'Russia',
    points: 20,
    question: {
      en: 'Which mountain range forms the traditional physiographic boundary between European Russia and Siberia (Asia)?',
      ru: 'Какой горный хребет служит традиционной географической границей между Европой и Азией на территории России?',
      hi: 'कौन सी पर्वत श्रृंखला यूरोपीय रूस और साइबेरिया (एशिया) के बीच पारंपरिक भौगोलिक सीमा बनाती है?',
    },
    options: {
      en: ['Ural Mountains', 'Caucasus Mountains', 'Altai Mountains', 'Sikhote-Alin'],
      ru: ['Уральские горы', 'Кавказские горы', 'Алтайские горы', 'Сихотэ-Алинь'],
      hi: ['यूराल पर्वत', 'काकेशस पर्वत', 'अल्ताई पर्वत', 'सिखोते-अलिन'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Stretching roughly 2,500 km from the Arctic coast to the Kazakh steppe, the Urals mark the divide between Europe and Asia.',
      ru: 'Уральские горы протянулись почти на 2500 км с севера на юг, разделяя Европу и Азию.',
      hi: 'लगभग 2,500 किमी तक फैले यूराल पर्वत यूरोप और एशिया महाद्वीपों को अलग करते हैं।',
    },
  },
  {
    id: 'cq-geo-4',
    domain: 'geography',
    country: 'India',
    points: 20,
    question: {
      en: 'Which river island in Assam is recognized as one of the world’s largest inhabited river islands?',
      ru: 'Какой речной остров в индийском штате Ассам считается одним из крупнейших обитаемых речных островов мира?',
      hi: 'असम में स्थित कौन सा नदी द्वीप दुनिया के सबसे बड़े बसे हुए नदी द्वीपों में से एक माना जाता है?',
    },
    options: {
      en: ['Majuli', 'Elephanta', 'Diu', 'Havelock'],
      ru: ['Маджули', 'Элефанта', 'Диу', 'Хэвлок'],
      hi: ['माजुली', 'एलीफेंटा', 'दीव', 'हैवलॉक'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Nestled in the Brahmaputra River, Majuli is the cultural capital of Assamese Neo-Vaishnavite monasteries (Satras).',
      ru: 'Расположенный на реке Брахмапутра остров Маджули является центром ассамской духовной и ремесленной культуры.',
      hi: 'ब्रह्मपुत्र नदी में स्थित माजुली असम की नव-वैष्णव संस्कृति और सत्र परंपराओं का प्रमुख केंद्र है।',
    },
  },
  {
    id: 'cq-geo-5',
    domain: 'geography',
    country: 'Russia',
    points: 20,
    question: {
      en: 'Which Russian Far East peninsula is renowned for its active volcanoes, geysers, and Pacific Ring of Fire landscapes?',
      ru: 'Какой полуостров Дальнего Востока России знаменит своими действующими вулканами и Долиной гейзеров?',
      hi: 'रूसी सुदूर पूर्व का कौन सा प्रायद्वीप अपने सक्रिय ज्वालामुखियों और गीज़र घाटी के लिए प्रसिद्ध है?',
    },
    options: {
      en: ['Kamchatka Peninsula', 'Kola Peninsula', 'Yamal Peninsula', 'Taimyr Peninsula'],
      ru: ['Полуостров Камчатка', 'Кольский полуостров', 'Полуостров Ямал', 'Полуостров Таймыр'],
      hi: ['कमचटका प्रायद्वीप', 'कोला प्रायद्वीप', 'यमल प्रायद्वीप', 'तैमिर प्रायद्वीप'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Volcanoes of Kamchatka form a UNESCO World Heritage Site featuring Klyuchevskaya Sopka, the highest active volcano in Eurasia.',
      ru: 'Вулканы Камчатки включены в список ЮНЕСКО, включая Ключевскую Сопку — самый высокий действующий вулкан Евразии.',
      hi: 'कमचटका के ज्वालामुखी यूनेस्को विश्व धरोहर स्थल हैं, जहाँ यूरेशिया का सबसे ऊँचा सक्रिय ज्वालामुखी क्ल्युचेव्स्काया सोपका स्थित है।',
    },
  },
  {
    id: 'cq-geo-6',
    domain: 'geography',
    country: 'India',
    points: 20,
    question: {
      en: 'Formed by the Ganga and Brahmaputra rivers, what is the largest mangrove forest and delta ecosystem in the world?',
      ru: 'Как называется крупнейший в мире мангровый лес и дельта, образованная реками Ганг и Брахмапутра?',
      hi: 'गंगा और ब्रह्मपुत्र नदियों द्वारा निर्मित दुनिया का सबसे बड़ा मैंग्रोव वन और डेल्टा पारिस्थितिकी तंत्र कौन सा है?',
    },
    options: {
      en: ['Sundarbans', 'Rann of Kutch', 'Nilgiri Biosphere', 'Chilika Lagoon'],
      ru: ['Сундарбан', 'Качский Ранн', 'Нилгири', 'Лагуна Чилика'],
      hi: ['सुंदरबन', 'कच्छ का रण', 'नीलगिरि', 'चिल्का झील'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Sundarbans in West Bengal (and Bangladesh) is a UNESCO World Heritage Site and the iconic habitat of the Royal Bengal Tiger.',
      ru: 'Сундарбан в Западной Бенгалии — объект Всемирного наследия ЮНЕСКО и родина бенгальского тигра.',
      hi: 'पश्चिम बंगाल में स्थित सुंदरबन यूनेस्को विश्व धरोहर स्थल है और रॉयल बंगाल टाइगर का प्रमुख आवास है।',
    },
  },
];

export const initialLeaderboardEntries: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    playerName: 'Ananya Sharma',
    affiliation: 'India',
    domain: 'all',
    score: 215,
    accuracy: 90,
    streak: 7,
    date: '2026-11-08',
  },
  {
    id: 'lb-2',
    playerName: 'Dmitry Volkov',
    affiliation: 'Russia',
    domain: 'history',
    score: 145,
    accuracy: 100,
    streak: 6,
    date: '2026-11-09',
  },
  {
    id: 'lb-3',
    playerName: 'Vikramaditya Rao',
    affiliation: 'India',
    domain: 'geography',
    score: 135,
    accuracy: 100,
    streak: 6,
    date: '2026-11-07',
  },
  {
    id: 'lb-4',
    playerName: 'Elena Petrova',
    affiliation: 'Russia',
    domain: 'language',
    score: 120,
    accuracy: 83,
    streak: 4,
    date: '2026-11-06',
  },
  {
    id: 'lb-5',
    playerName: 'Aarav & Mikhail',
    affiliation: 'International',
    domain: 'all',
    score: 110,
    accuracy: 70,
    streak: 3,
    date: '2026-11-05',
  },
];
