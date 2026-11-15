import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  ArrowRight,
  Layers,
  Target,
  Zap,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playErrorTone } from '../utils/quizAudio';
import { loadPersistentItem, savePersistentItem, readSyncCache } from '../utils/persistentStore';

export type VocabCategory = 'cognates' | 'greetings' | 'culture' | 'travel';
export type ScriptFocus = 'both' | 'russian' | 'hindi';
export type QuizPlayMode = 'matching' | 'blitz';

export interface VocabItem {
  id: string;
  category: VocabCategory;
  russian: string;
  russianTranslit: string;
  hindi: string;
  hindiTranslit: string;
  english: string;
  noteEn: string;
  noteRu: string;
  noteHi: string;
}

const VOCAB_BANK: VocabItem[] = [
  // Shared Indo-European Cognates
  {
    id: 'v-brother',
    category: 'cognates',
    russian: 'Брат',
    russianTranslit: 'Brat',
    hindi: 'भ्राता / भाई',
    hindiTranslit: 'Bhrata / Bhai',
    english: 'Brother',
    noteEn: 'Both stem from Proto-Indo-European *bhréh₂tēr.',
    noteRu: 'Общий индоевропейский корень санскрита и русского языка.',
    noteHi: 'दोनों शब्द प्राचीन भारत-यूरोपीय मूल *bhréh₂tēr से निकले हैं।',
  },
  {
    id: 'v-mother',
    category: 'cognates',
    russian: 'Мать',
    russianTranslit: 'Mat',
    hindi: 'माता / माँ',
    hindiTranslit: 'Mata / Maa',
    english: 'Mother',
    noteEn: 'Direct cognate shared across Slavic and Indo-Aryan branches.',
    noteRu: 'Прямое родство корней «Мать» и «Мата».',
    noteHi: 'रूसी "Мать" और हिंदी/संस्कृत "माता" एक ही प्राचीन जड़ से हैं।',
  },
  {
    id: 'v-fire',
    category: 'cognates',
    russian: 'Огонь',
    russianTranslit: 'Ogon',
    hindi: 'अग्नि',
    hindiTranslit: 'Agni',
    english: 'Fire',
    noteEn: 'Ogon and Agni share the ancient sacred root for fire.',
    noteRu: 'Слова «Огонь» и «Агни» восходят к одному пракорню.',
    noteHi: '"Огонь" (ओगोन) और "अग्नि" प्राचीन अग्नि मूल के सगे शब्द हैं।',
  },
  {
    id: 'v-door',
    category: 'cognates',
    russian: 'Дверь',
    russianTranslit: 'Dver',
    hindi: 'द्वार',
    hindiTranslit: 'Dwar',
    english: 'Door',
    noteEn: 'Notice how Russian Dver closely echoes Hindi Dwar.',
    noteRu: 'Русское «Дверь» и хинди «Двар» имеют общий корень.',
    noteHi: 'रूसी "Дверь" (दवेर) और हिंदी "द्वार" की ध्वनि व अर्थ समान हैं।',
  },
  {
    id: 'v-two',
    category: 'cognates',
    russian: 'Два',
    russianTranslit: 'Dva',
    hindi: 'दो / द्वि',
    hindiTranslit: 'Do / Dvi',
    english: 'Two',
    noteEn: 'Numbers 1–10 preserve clear phonetic links between Russian and Sanskrit.',
    noteRu: 'Числительные сохраняют древнее фонетическое сходство.',
    noteHi: 'रूसी "Два" और संस्कृत "द्वि" / हिंदी "दो" साझा गिनती के उदाहरण हैं।',
  },
  {
    id: 'v-knowledge',
    category: 'cognates',
    russian: 'Знание',
    russianTranslit: 'Znaniye',
    hindi: 'ज्ञान',
    hindiTranslit: 'Jnana / Gyan',
    english: 'Knowledge',
    noteEn: 'Znaniye and Jnana both trace back to the root *ǵneh₃- (to know).',
    noteRu: '«Знание» и «Джняна» происходят от единого корня «знать».',
    noteHi: '"Знание" और "ज्ञान" दोनों का मूल अर्थ जानना (*ǵneh₃-) है।',
  },
  {
    id: 'v-life',
    category: 'cognates',
    russian: 'Жизнь',
    russianTranslit: 'Zhizn',
    hindi: 'जीवन',
    hindiTranslit: 'Jeevan',
    english: 'Life',
    noteEn: 'Russian Zhizn and Hindi Jeevan both mean living vitality.',
    noteRu: '«Жизнь» и «Дживан» связаны древним корнем бытия.',
    noteHi: '"Жизнь" और "जीवन" दोनों जीवंतता के प्राचीन मूल से जुड़े हैं।',
  },
  {
    id: 'v-night',
    category: 'cognates',
    russian: 'Ночь',
    russianTranslit: 'Noch',
    hindi: 'निशा / नक्तम्',
    hindiTranslit: 'Nisha / Naktam',
    english: 'Night',
    noteEn: 'Closely related to Sanskrit Naktam and Hindi Nisha.',
    noteRu: 'Близко к санскритскому «Нактам» и хинди «Ниша».',
    noteHi: 'रूसी "Ночь" संस्कृत "नक्तम्" और हिंदी "निशा" से जुड़ा है।',
  },

  // Greetings & Everyday Politeness
  {
    id: 'v-hello',
    category: 'greetings',
    russian: 'Здравствуйте',
    russianTranslit: 'Zdravstvuyte',
    hindi: 'नमस्ते',
    hindiTranslit: 'Namaste',
    english: 'Hello',
    noteEn: 'Zdravstvuyte literally wishes good health; Namaste bows to the inner light.',
    noteRu: '«Здравствуйте» — пожелание здравия; «Намасте» — почтение.',
    noteHi: '"Здравствуйте" का अर्थ उत्तम स्वास्थ्य की कामना है, और "नमस्ते" आदर का प्रतीक।',
  },
  {
    id: 'v-thanks',
    category: 'greetings',
    russian: 'Спасибо',
    russianTranslit: 'Spasibo',
    hindi: 'धन्यवाद',
    hindiTranslit: 'Dhanyavaad',
    english: 'Thank you',
    noteEn: 'Warm expressions of gratitude used daily across both cultures.',
    noteRu: 'Слова искренней благодарности в обеих культурах.',
    noteHi: 'दोनों संस्कृतियों में आभार प्रकट करने के प्रमुख शब्द।',
  },
  {
    id: 'v-please',
    category: 'greetings',
    russian: 'Пожалуйста',
    russianTranslit: 'Pozhaluysta',
    english: 'Please / Welcome',
    hindi: 'कृपया',
    hindiTranslit: 'Kripaya',
    noteEn: 'Used politely when making requests or welcoming someone.',
    noteRu: 'Вежливая просьба и ответ на благодарность.',
    noteHi: 'विनम्र अनुरोध करने के लिए उपयोग किया जाने वाला शब्द।',
  },
  {
    id: 'v-friend',
    category: 'greetings',
    russian: 'Друг',
    russianTranslit: 'Drug',
    hindi: 'मित्र / दोस्त',
    hindiTranslit: 'Mitra / Dost',
    english: 'Friend',
    noteEn: 'Friendship (Дружба / मैत्री) is a cornerstone of India–Russia ties.',
    noteRu: 'Дружба — основа культурного моста России и Индии.',
    noteHi: 'मित्रता (Дружба / मैत्री) भारत-रूस संबंधों की आधारशिला है।',
  },
  {
    id: 'v-goodbye',
    category: 'greetings',
    russian: 'До свидания',
    russianTranslit: 'Do svidaniya',
    hindi: 'अलविदा / फिर मिलेंगे',
    hindiTranslit: 'Phir Milenge',
    english: 'Goodbye',
    noteEn: 'Both phrases literally mean "until we meet again".',
    noteRu: 'Буквально означает «до новой встречи».',
    noteHi: 'दोनों वाक्यांशों का शाब्दिक अर्थ "फिर मिलने तक" है।',
  },
  {
    id: 'v-love',
    category: 'greetings',
    russian: 'Любовь',
    russianTranslit: 'Lyubov',
    hindi: 'प्रेम / प्यार',
    hindiTranslit: 'Prem / Pyaar',
    english: 'Love',
    noteEn: 'Shared phonetic cousin with Sanskrit Lubhyati (desire/affection).',
    noteRu: 'Перекликается с санскритским корнем «Лубхьяти».',
    noteHi: 'संस्कृत धातु "लुभ्" और रूसी "Любовь" में प्राचीन संबंध है।',
  },

  // Culture, Nature & Philosophy
  {
    id: 'v-sun',
    category: 'culture',
    russian: 'Солнце',
    russianTranslit: 'Solntse',
    hindi: 'सूर्य / सूरज',
    hindiTranslit: 'Surya / Suraj',
    english: 'Sun',
    noteEn: 'Central solar symbol in both Maslenitsa and Makar Sankranti.',
    noteRu: 'Символ тепла на праздниках Масленица и Макар Санкранти.',
    noteHi: 'माслеनित्सा और मकर संक्रांति दोनों में सूर्य का विशेष महत्व है।',
  },
  {
    id: 'v-water',
    category: 'culture',
    russian: 'Вода',
    russianTranslit: 'Voda',
    hindi: 'जल / पानी',
    hindiTranslit: 'Jal / Pani',
    english: 'Water',
    noteEn: 'Russian Voda shares a distant root with Sanskrit Udaka (water).',
    noteRu: 'Слово «Вода» родственно санскритскому «Удака».',
    noteHi: 'रूसी "Вода" संस्कृत शब्द "उदक" (जल) से संबंधित है।',
  },
  {
    id: 'v-peace',
    category: 'culture',
    russian: 'Мир',
    russianTranslit: 'Mir',
    hindi: 'शांति / विश्व',
    hindiTranslit: 'Shanti / Vishwa',
    english: 'Peace / World',
    noteEn: 'In Russian, Mir uniquely carries both meanings: peace and the world.',
    noteRu: 'В русском языке слово «Мир» означает и покой, и вселенную.',
    noteHi: 'रूसी में "Мир" का अर्थ शांति और संसार दोनों होता है।',
  },
  {
    id: 'v-heart',
    category: 'culture',
    russian: 'Сердце',
    russianTranslit: 'Serdtse',
    hindi: 'हृदय / दिल',
    hindiTranslit: 'Hridaya / Dil',
    english: 'Heart',
    noteEn: 'Serdtse and Hridaya descend from the same Indo-European word for heart.',
    noteRu: '«Сердце» и санскритское «Хридая» — древние когнаты.',
    noteHi: 'रूसी "Сердце" और संस्कृत "हृदय" एक ही प्राचीन शब्द के रूप हैं।',
  },
  {
    id: 'v-book',
    category: 'culture',
    russian: 'Книга',
    russianTranslit: 'Kniga',
    hindi: 'पुस्तक / किताब',
    hindiTranslit: 'Pustak',
    english: 'Book',
    noteEn: 'From Tolstoy to Tagore, books carried ideas between Moscow and Kolkata.',
    noteRu: 'Книги Толстого и Тагора сблизили народы двух стран.',
    noteHi: 'टॉलस्टॉय और टैगोर की पुस्तकों ने दोनों देशों को जोड़ा।',
  },
  {
    id: 'v-music',
    category: 'culture',
    russian: 'Музыка',
    russianTranslit: 'Muzyka',
    hindi: 'संगीत',
    hindiTranslit: 'Sangeet',
    english: 'Music',
    noteEn: 'Classical balalaika and sitar ragas celebrate modal harmony.',
    noteRu: 'Классические мелодии ситара и балалайки.',
    noteHi: 'सितार और बलालाइका दोनों शास्त्रीय संगीत की समृद्ध परंपराएँ हैं।',
  },

  // Travel & Cities
  {
    id: 'v-city',
    category: 'travel',
    russian: 'Город',
    russianTranslit: 'Gorod',
    hindi: 'शहर / नगर',
    hindiTranslit: 'Shahar / Nagar',
    english: 'City',
    noteEn: 'Compare Russian -gorod (Novgorod) and Indian -nagar / -garh.',
    noteRu: 'Сравните «Новгород» и индийские названия на «-нагар».',
    noteHi: 'जैसे रूस में "नोवगोरोद", वैसे भारत में "नगर" या "गढ़" जुड़ता है।',
  },
  {
    id: 'v-home',
    category: 'travel',
    russian: 'Дом',
    russianTranslit: 'Dom',
    hindi: 'घर / धाम',
    hindiTranslit: 'Ghar / Dhaam',
    english: 'Home',
    noteEn: 'Russian Dom is a cognate of Sanskrit Dama / Dhaam (abode).',
    noteRu: '«Дом» и санскритское «Дама / Дхам» имеют общий корень.',
    noteHi: 'रूसी "Дом" और संस्कृत "दम / धाम" (निवास) सगे शब्द हैं।',
  },
  {
    id: 'v-train',
    category: 'travel',
    russian: 'Поезд',
    russianTranslit: 'Poyezd',
    hindi: 'रेलगाड़ी',
    hindiTranslit: 'Relgadi',
    english: 'Train',
    noteEn: 'Both countries rely on vast iconic railway networks.',
    noteRu: 'Транссиб и индийские железные дороги — гордость обеих стран.',
    noteHi: 'रूस और भारत दोनों अपने विशाल रेल नेटवर्क के लिए प्रसिद्ध हैं।',
  },
  {
    id: 'v-festival',
    category: 'travel',
    russian: 'Праздник',
    russianTranslit: 'Prazdnik',
    hindi: 'त्योहार / उत्सव',
    hindiTranslit: 'Tyohar / Utsav',
    english: 'Festival',
    noteEn: 'Shared joy of seasonal celebrations like Maslenitsa and Holi.',
    noteRu: 'Радость народных праздников, таких как Масленица и Холи.',
    noteHi: 'माслеनित्सा और होली जैसे उत्सव साझा सांस्कृतिक आनंद के प्रतीक हैं।',
  },
];

const VOCAB_PROGRESS_KEY = 'sri_vocab_quiz_progress_v1';

interface VocabProgressState {
  totalScore: number;
  bestRoundScore: number;
  roundsCompleted: number;
  totalAttempts: number;
  totalCorrect: number;
  masteredWordIds: string[];
}

const DEFAULT_PROGRESS: VocabProgressState = {
  totalScore: 0,
  bestRoundScore: 0,
  roundsCompleted: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  masteredWordIds: [],
};

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface VocabularyQuizProps {
  currentLang: Language;
}

const PAIR_BATCH_SIZE = 5;

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({ currentLang }) => {
  const [category, setCategory] = useState<VocabCategory | 'all'>('all');
  const [scriptFocus, setScriptFocus] = useState<ScriptFocus>('both');
  const [playMode, setPlayMode] = useState<QuizPlayMode>('matching');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sri_quiz_sound_enabled');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [progress, setProgress] = useState<VocabProgressState>(() => {
    const cached = readSyncCache<VocabProgressState>(VOCAB_PROGRESS_KEY);
    return cached && typeof cached.totalScore === 'number'
      ? { ...DEFAULT_PROGRESS, ...cached, masteredWordIds: cached.masteredWordIds || [] }
      : DEFAULT_PROGRESS;
  });

  useEffect(() => {
    loadPersistentItem<VocabProgressState>(VOCAB_PROGRESS_KEY).then((saved) => {
      if (saved && typeof saved.totalScore === 'number') {
        setProgress({
          ...DEFAULT_PROGRESS,
          ...saved,
          masteredWordIds: Array.isArray(saved.masteredWordIds) ? saved.masteredWordIds : [],
        });
      }
    });
  }, []);

  const persistProgress = (updater: (prev: VocabProgressState) => VocabProgressState) => {
    setProgress((prev) => {
      const next = updater(prev);
      void savePersistentItem(VOCAB_PROGRESS_KEY, next, { skipDriveSync: true });
      return next;
    });
  };

  // Filtered pool
  const activePool = useMemo(() => {
    if (category === 'all') return VOCAB_BANK;
    return VOCAB_BANK.filter((w) => w.category === category);
  }, [category]);

  // --- PAIR MATCHING STATE ---
  const [roundNumber, setRoundNumber] = useState(1);
  const [leftBatch, setLeftBatch] = useState<VocabItem[]>([]);
  const [rightBatch, setRightBatch] = useState<VocabItem[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ leftId: string; rightId: string } | null>(null);
  const [lastMatchedItem, setLastMatchedItem] = useState<VocabItem | null>(null);

  // --- BLITZ QUIZ STATE ---
  const [blitzQueue, setBlitzQueue] = useState<VocabItem[]>([]);
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzOptions, setBlitzOptions] = useState<VocabItem[]>([]);
  const [blitzChosenId, setBlitzChosenId] = useState<string | null>(null);

  // Session score & streak
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);

  const startMatchingRound = (pool: VocabItem[], nextRound = 1) => {
    const batch = shuffleArray(pool).slice(0, Math.min(PAIR_BATCH_SIZE, pool.length));
    setLeftBatch(batch);
    setRightBatch(shuffleArray(batch));
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setMatchedIds([]);
    setWrongPair(null);
    setLastMatchedItem(null);
    setRoundComplete(false);
    setRoundNumber(nextRound);
  };

  const buildBlitzOptions = (target: VocabItem, pool: VocabItem[]) => {
    const distractors = shuffleArray(VOCAB_BANK.filter((w) => w.id !== target.id)).slice(0, 3);
    const fallbackPool = pool.length >= 4 ? distractors : distractors;
    return shuffleArray([target, ...fallbackPool]);
  };

  const startBlitzSession = (pool: VocabItem[]) => {
    const queue = shuffleArray(pool).slice(0, Math.min(8, pool.length));
    setBlitzQueue(queue);
    setBlitzIdx(0);
    setBlitzChosenId(null);
    setRoundComplete(false);
    setLastMatchedItem(null);
    if (queue.length > 0) {
      setBlitzOptions(buildBlitzOptions(queue[0], pool));
    }
  };

  useEffect(() => {
    startMatchingRound(activePool, 1);
    startBlitzSession(activePool);
  }, [activePool]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sri_quiz_sound_enabled', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const evaluateMatchAttempt = (leftId: string, rightId: string) => {
    if (matchedIds.includes(leftId) || matchedIds.includes(rightId)) return;
    setSessionAttempts((a) => a + 1);

    if (leftId === rightId) {
      const matchedItem = leftBatch.find((i) => i.id === leftId) || null;
      const newStreak = sessionStreak + 1;
      const earned = 20 + Math.min((newStreak - 1) * 5, 25);
      const nextMatched = [...matchedIds, leftId];

      setMatchedIds(nextMatched);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      setWrongPair(null);
      setLastMatchedItem(matchedItem);
      setSessionStreak(newStreak);
      setSessionCorrect((c) => c + 1);
      setSessionScore((s) => s + earned);

      if (soundEnabled) playSuccessChime();

      const completedNow = nextMatched.length === leftBatch.length;
      if (completedNow) {
        setRoundComplete(true);
        try {
          confetti({ particleCount: 50, spread: 65, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }

      persistProgress((prev) => {
        const masteredSet = new Set(prev.masteredWordIds);
        masteredSet.add(leftId);
        const updatedSessionScore = sessionScore + earned;
        return {
          totalScore: prev.totalScore + earned,
          bestRoundScore: Math.max(prev.bestRoundScore, updatedSessionScore),
          roundsCompleted: prev.roundsCompleted + (completedNow ? 1 : 0),
          totalAttempts: prev.totalAttempts + 1,
          totalCorrect: prev.totalCorrect + 1,
          masteredWordIds: Array.from(masteredSet),
        };
      });
    } else {
      if (soundEnabled) playErrorTone();
      setSessionStreak(0);
      setWrongPair({ leftId, rightId });
      setSelectedLeftId(null);
      setSelectedRightId(null);
      persistProgress((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
      }));
      setTimeout(() => {
        setWrongPair(null);
      }, 650);
    }
  };

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id) || wrongPair) return;
    if (selectedRightId) {
      evaluateMatchAttempt(id, selectedRightId);
    } else {
      setSelectedLeftId((prev) => (prev === id ? null : id));
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.includes(id) || wrongPair) return;
    if (selectedLeftId) {
      evaluateMatchAttempt(selectedLeftId, id);
    } else {
      setSelectedRightId((prev) => (prev === id ? null : id));
    }
  };

  const handleBlitzSelect = (optionId: string) => {
    if (blitzChosenId) return;
    const currentWord = blitzQueue[blitzIdx];
    if (!currentWord) return;

    setBlitzChosenId(optionId);
    setSessionAttempts((a) => a + 1);
    const isCorrect = optionId === currentWord.id;

    if (isCorrect) {
      const newStreak = sessionStreak + 1;
      const earned = 20 + Math.min((newStreak - 1) * 5, 25);
      setSessionStreak(newStreak);
      setSessionCorrect((c) => c + 1);
      setSessionScore((s) => s + earned);
      setLastMatchedItem(currentWord);
      if (soundEnabled) playSuccessChime();

      const isFinalQuestion = blitzIdx + 1 >= blitzQueue.length;
      if (isFinalQuestion) {
        try {
          confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }

      persistProgress((prev) => {
        const masteredSet = new Set(prev.masteredWordIds);
        masteredSet.add(currentWord.id);
        return {
          totalScore: prev.totalScore + earned,
          bestRoundScore: Math.max(prev.bestRoundScore, sessionScore + earned),
          roundsCompleted: prev.roundsCompleted + (isFinalQuestion ? 1 : 0),
          totalAttempts: prev.totalAttempts + 1,
          totalCorrect: prev.totalCorrect + 1,
          masteredWordIds: Array.from(masteredSet),
        };
      });
    } else {
      if (soundEnabled) playErrorTone();
      setSessionStreak(0);
      persistProgress((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
      }));
    }
  };

  const handleNextBlitz = () => {
    if (blitzIdx + 1 >= blitzQueue.length) {
      setRoundComplete(true);
      return;
    }
    const nextIdx = blitzIdx + 1;
    setBlitzIdx(nextIdx);
    setBlitzChosenId(null);
    setLastMatchedItem(null);
    setBlitzOptions(buildBlitzOptions(blitzQueue[nextIdx], activePool));
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setSessionScore(0);
    setSessionStreak(0);
    setSessionCorrect(0);
    setSessionAttempts(0);
    void savePersistentItem(VOCAB_PROGRESS_KEY, DEFAULT_PROGRESS, { skipDriveSync: true });
    startMatchingRound(activePool, 1);
    startBlitzSession(activePool);
  };

  const masteredCount = progress.masteredWordIds.length;
  const masteryPct = Math.round((masteredCount / VOCAB_BANK.length) * 100);
  const overallAccuracy =
    progress.totalAttempts > 0
      ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100)
      : 100;

  const labels = {
    en: {
      title: 'Russian & Hindi Vocabulary Match',
      subtitle:
        'Connect Russian and Hindi words with their English meanings to earn points, build streaks, and master shared cultural vocabulary.',
      pairMode: 'Pair Matching',
      blitzMode: 'Quick Quiz Blitz',
      focusBoth: '🇷🇺 + 🇮🇳 Both',
      focusRu: '🇷🇺 Russian Only',
      focusHi: '🇮🇳 Hindi Only',
      allTopics: 'All Topics',
      cognates: 'Shared Roots',
      greetings: 'Greetings',
      culture: 'Culture & Nature',
      travel: 'Travel & Cities',
      score: 'Session Score',
      allTime: 'Total Score',
      streak: 'Streak',
      mastery: 'Words Mastered',
      accuracy: 'Accuracy',
      matchLeftTitle: 'Russian / Hindi Words',
      matchRightTitle: 'English Counterparts',
      nextRound: 'Next 5-Word Round',
      playAgain: 'Play New Round',
      roundCleared: 'Round Complete! All 5 Pairs Matched',
      blitzComplete: 'Quick Blitz Complete!',
      nextWord: 'Next Word',
      finishBlitz: 'Finish Round',
      resetStats: 'Reset Progress',
      tapHint: 'Select one card from each column to match the pair.',
    },
    ru: {
      title: 'Словарная викторина: Русский, Хинди и Английский',
      subtitle:
        'Сопоставляйте русские и хинди слова с английским переводом, набирайте очки и отслеживайте прогресс.',
      pairMode: 'Поиск пар',
      blitzMode: 'Блиц-тест',
      focusBoth: '🇷🇺 + 🇮🇳 Оба языка',
      focusRu: '🇷🇺 Только русский',
      focusHi: '🇮🇳 Только хинди',
      allTopics: 'Все темы',
      cognates: 'Общие корни',
      greetings: 'Приветствия',
      culture: 'Культура и природа',
      travel: 'Путешествия',
      score: 'Очки сессии',
      allTime: 'Всего очков',
      streak: 'Серия',
      mastery: 'Изучено слов',
      accuracy: 'Точность',
      matchLeftTitle: 'Русский / Хинди',
      matchRightTitle: 'Английский перевод',
      nextRound: 'Следующие 5 слов',
      playAgain: 'Новый раунд',
      roundCleared: 'Раунд пройден! Все 5 пар найдены',
      blitzComplete: 'Блиц завершён!',
      nextWord: 'Следующее слово',
      finishBlitz: 'Завершить',
      resetStats: 'Сбросить прогресс',
      tapHint: 'Выберите слово слева и его перевод справа.',
    },
    hi: {
      title: 'रूसी और हिंदी शब्दावली मिलान खेल',
      subtitle:
        'रूसी और हिंदी शब्दों को उनके अंग्रेज़ी अर्थों से मिलाएं, अंक अर्जित करें और अपनी प्रगति ट्रैक करें।',
      pairMode: 'जोड़ी मिलान',
      blitzMode: 'त्वरित प्रश्नोत्तरी',
      focusBoth: '🇷🇺 + 🇮🇳 दोनों भाषाएँ',
      focusRu: '🇷🇺 केवल रूसी',
      focusHi: '🇮🇳 केवल हिंदी',
      allTopics: 'सभी विषय',
      cognates: 'साझा मूल शब्द',
      greetings: 'अभिवादन',
      culture: 'संस्कृति व प्रकृति',
      travel: 'यात्रा व शहर',
      score: 'सत्र स्कोर',
      allTime: 'कुल स्कोर',
      streak: 'लगातार सही',
      mastery: 'सीखे गए शब्द',
      accuracy: 'सटीकता',
      matchLeftTitle: 'रूसी / हिंदी शब्द',
      matchRightTitle: 'अंग्रेज़ी अर्थ',
      nextRound: 'अगले 5 शब्द',
      playAgain: 'नया राунд खेलें',
      roundCleared: 'राउंड पूरा! सभी 5 जोड़ियाँ मिल गईं',
      blitzComplete: 'त्वरित प्रश्नोत्तरी पूर्ण!',
      nextWord: 'अगला शब्द',
      finishBlitz: 'परिणाम देखें',
      resetStats: 'प्रगति रीसेट करें',
      tapHint: 'सही जोड़ी बनाने के लिए दोनों ओर से एक-एक कार्ड चुनें।',
    },
  }[currentLang];

  const getNote = (item: VocabItem) =>
    currentLang === 'ru' ? item.noteRu : currentLang === 'hi' ? item.noteHi : item.noteEn;

  const currentBlitzWord = blitzQueue[blitzIdx];

  return (
    <div className="w-full space-y-6">
      {/* Header & Progress Overview Card */}
      <div className="rounded-3xl border border-amber-500/25 bg-[#0c1424] p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Trilingual Arena</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-3xl font-extrabold text-white">
              {labels.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-serif-culture max-w-2xl">
              {labels.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-white cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-amber-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetProgress}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-red-400/50 hover:text-red-300 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{labels.resetStats}</span>
            </button>
          </div>
        </div>

        {/* Metrics & Mastery Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>{labels.score}</span>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-300">
              {sessionScore}
            </div>
            <div className="text-[10px] text-slate-500">
              {labels.allTime}: {progress.totalScore}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>{labels.streak}</span>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-extrabold text-orange-300">
              {sessionStreak}×
            </div>
            <div className="text-[10px] text-slate-500">
              Bonus +{Math.min(sessionStreak * 5, 25)} pts
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <span>{labels.accuracy}</span>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-300">
              {sessionAttempts > 0
                ? `${Math.round((sessionCorrect / sessionAttempts) * 100)}%`
                : `${overallAccuracy}%`}
            </div>
            <div className="text-[10px] text-slate-500">
              Lifetime: {overallAccuracy}% ({progress.totalCorrect}/{progress.totalAttempts})
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <BookOpen className="h-3.5 w-3.5 text-blue-400" />
              <span>{labels.mastery}</span>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-extrabold text-blue-300">
              {masteredCount} / {VOCAB_BANK.length}
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls Bar: Mode, Script Focus, Topic Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Play Mode */}
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950/80 p-1 self-start">
            <button
              type="button"
              onClick={() => {
                setPlayMode('matching');
                startMatchingRound(activePool, roundNumber);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                playMode === 'matching'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{labels.pairMode}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPlayMode('blitz');
                startBlitzSession(activePool);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                playMode === 'blitz'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{labels.blitzMode}</span>
            </button>
          </div>

          {/* Script Focus */}
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950/80 p-1 self-start">
            {(
              [
                { id: 'both', label: labels.focusBoth },
                { id: 'russian', label: labels.focusRu },
                { id: 'hindi', label: labels.focusHi },
              ] as { id: ScriptFocus; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setScriptFocus(opt.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  scriptFocus === opt.id
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: labels.allTopics },
              { id: 'cognates', label: labels.cognates },
              { id: 'greetings', label: labels.greetings },
              { id: 'culture', label: labels.culture },
              { id: 'travel', label: labels.travel },
            ] as { id: VocabCategory | 'all'; label: string }[]
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                category === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ARENA WORKSPACE */}
      {playMode === 'matching' ? (
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-5 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Round #{roundNumber} · {matchedIds.length}/{leftBatch.length} Matched
              </span>
              <p className="text-xs text-slate-400 mt-0.5">{labels.tapHint}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {leftBatch.map((item) => (
                <span
                  key={item.id}
                  className={`h-2.5 w-6 rounded-full transition-colors ${
                    matchedIds.includes(item.id) ? 'bg-emerald-400' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Russian & Hindi Cards */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {labels.matchLeftTitle}
              </div>
              {leftBatch.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedLeftId === item.id;
                const isWrong = wrongPair?.leftId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectLeft(item.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      isMatched
                        ? 'border-emerald-500/40 bg-emerald-950/25 opacity-65 cursor-default'
                        : isWrong
                        ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/40'
                        : isSelected
                        ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400 shadow-lg'
                        : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        {scriptFocus !== 'hindi' && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-[11px] font-bold text-blue-400">🇷🇺</span>
                            <span className="text-base sm:text-lg font-bold text-white">
                              {item.russian}
                            </span>
                            <span className="text-xs text-slate-400">({item.russianTranslit})</span>
                          </div>
                        )}
                        {scriptFocus !== 'russian' && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-[11px] font-bold text-orange-400">🇮🇳</span>
                            <span className="font-devanagari text-base sm:text-lg font-bold text-amber-200">
                              {item.hindi}
                            </span>
                            <span className="text-xs text-slate-400">({item.hindiTranslit})</span>
                          </div>
                        )}
                      </div>
                      {isMatched && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: English Counterparts */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {labels.matchRightTitle}
              </div>
              {rightBatch.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedRightId === item.id;
                const isWrong = wrongPair?.rightId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectRight(item.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all flex items-center justify-between gap-3 min-h-[76px] cursor-pointer ${
                      isMatched
                        ? 'border-emerald-500/40 bg-emerald-950/25 opacity-65 cursor-default'
                        : isWrong
                        ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/40'
                        : isSelected
                        ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400 shadow-lg'
                        : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-cinzel text-base sm:text-lg font-bold text-slate-100">
                        {item.english}
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize">{item.category}</div>
                    </div>
                    {isMatched && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Linguistic Insight Banner after match */}
          {lastMatchedItem && !roundComplete && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">
                  {lastMatchedItem.russian} / {lastMatchedItem.hindi} = {lastMatchedItem.english}:
                </span>{' '}
                {getNote(lastMatchedItem)}
              </div>
            </div>
          )}

          {/* Round Complete Banner */}
          {roundComplete && (
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-blue-500/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-300 font-bold text-sm">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span>{labels.roundCleared}</span>
                </div>
                {lastMatchedItem && (
                  <p className="text-xs text-slate-300">{getNote(lastMatchedItem)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => startMatchingRound(activePool, roundNumber + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg cursor-pointer shrink-0"
              >
                <span>{labels.nextRound}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* BLITZ MULTIPLE-CHOICE MODE */
        <div className="rounded-3xl border border-amber-500/20 bg-[#0c1424] p-5 sm:p-8 shadow-2xl space-y-6">
          {roundComplete || !currentBlitzWord ? (
            <div className="text-center py-8 space-y-4">
              <Trophy className="h-12 w-12 text-amber-400 mx-auto" />
              <h3 className="font-cinzel text-2xl font-bold text-white">
                {labels.blitzComplete}
              </h3>
              <p className="text-sm text-slate-300">
                {labels.score}: <span className="font-bold text-amber-300">{sessionScore}</span> ·{' '}
                {labels.mastery}:{' '}
                <span className="font-bold text-emerald-300">
                  {masteredCount}/{VOCAB_BANK.length}
                </span>
              </p>
              <button
                type="button"
                onClick={() => startBlitzSession(activePool)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{labels.playAgain}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-amber-400">
                  Word {blitzIdx + 1} of {blitzQueue.length}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300 capitalize">
                  {currentBlitzWord.category}
                </span>
              </div>

              {/* Word Prompt Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center space-y-2">
                {scriptFocus !== 'hindi' && (
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    <span className="text-sm align-middle mr-2">🇷🇺</span>
                    {currentBlitzWord.russian}{' '}
                    <span className="text-sm font-normal text-slate-400">
                      ({currentBlitzWord.russianTranslit})
                    </span>
                  </div>
                )}
                {scriptFocus !== 'russian' && (
                  <div className="font-devanagari text-2xl sm:text-3xl font-bold text-amber-300">
                    <span className="text-sm font-sans align-middle mr-2">🇮🇳</span>
                    {currentBlitzWord.hindi}{' '}
                    <span className="text-sm font-sans font-normal text-slate-400">
                      ({currentBlitzWord.hindiTranslit})
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Shuffled English Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blitzOptions.map((opt) => {
                  const isCorrectOpt = opt.id === currentBlitzWord.id;
                  const isChosen = blitzChosenId === opt.id;
                  let style =
                    'border-slate-700 bg-slate-900/80 text-slate-100 hover:border-amber-400';

                  if (blitzChosenId) {
                    if (isCorrectOpt) {
                      style = 'border-emerald-500 bg-emerald-700/90 text-white font-bold';
                    } else if (isChosen) {
                      style = 'border-red-500 bg-red-800/80 text-white line-through';
                    } else {
                      style = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(blitzChosenId)}
                      onClick={() => handleBlitzSelect(opt.id)}
                      className={`rounded-xl border px-4 py-3.5 text-left transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span className="font-cinzel text-base font-bold">{opt.english}</span>
                      {blitzChosenId && isCorrectOpt && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
                      )}
                      {blitzChosenId && isChosen && !isCorrectOpt && (
                        <XCircle className="h-5 w-5 text-red-200 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {blitzChosenId && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-black/40 p-4">
                  <p className="text-xs text-slate-300">{getNote(currentBlitzWord)}</p>
                  <button
                    type="button"
                    onClick={handleNextBlitz}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-extrabold text-slate-950 shrink-0 cursor-pointer self-end sm:self-center"
                  >
                    <span>
                      {blitzIdx + 1 >= blitzQueue.length ? labels.finishBlitz : labels.nextWord}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
