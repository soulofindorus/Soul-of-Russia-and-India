export interface WordPair {
  id: string;
  russian: string;
  pronunciation: string;
  hindi: string;
  english: string;
  category: string;
}

export const wordMatchPairs: WordPair[] = [
  { id: 'w1', russian: 'Душа', pronunciation: 'Dusha', hindi: 'आत्मा (Aatma)', english: 'Soul', category: 'Spirit' },
  { id: 'w2', russian: 'Дружба', pronunciation: 'Druzhba', hindi: 'दोस्ती / मित्रता (Dosti)', english: 'Friendship', category: 'Relations' },
  { id: 'w3', russian: 'Мир', pronunciation: 'Mir', hindi: 'शांति / विश्व (Shanti / Vishwa)', english: 'Peace / World', category: 'Values' },
  { id: 'w4', russian: 'Огонь', pronunciation: 'Ogon', hindi: 'अग्नि / आग (Agni)', english: 'Fire', category: 'Elements' },
  { id: 'w5', russian: 'Солнце', pronunciation: 'Solntse', hindi: 'सूर्य (Surya)', english: 'Sun', category: 'Nature' },
  { id: 'w6', russian: 'Вода', pronunciation: 'Voda', hindi: 'जल / पानी (Jal)', english: 'Water', category: 'Elements' },
  { id: 'w7', russian: 'Книга', pronunciation: 'Kniga', hindi: 'पुस्तक / किताब (Kitab)', english: 'Book', category: 'Education' },
  { id: 'w8', russian: 'Чай', pronunciation: 'Chay', hindi: 'चाय (Chai)', english: 'Tea', category: 'Tradition' },
  { id: 'w9', russian: 'Брат', pronunciation: 'Brat', hindi: 'भाई / भ्राता (Bhai)', english: 'Brother', category: 'Family' },
  { id: 'w10', russian: 'Сердце', pronunciation: 'Serdtse', hindi: 'हृदय / दिल (Hriday)', english: 'Heart', category: 'Spirit' },
];

export interface EmojiGrammarItem {
  id: string;
  prompt: string;
  emoji: string;
  options: string[];
  correct: string;
  meaning: string;
  explanation: string;
}

export const emojiGrammarItems: EmojiGrammarItem[] = [
  {
    id: 'eg-1',
    prompt: 'Мне ______.',
    emoji: '😢',
    options: ['грустно', 'грустный', 'грустная', 'грустные'],
    correct: 'грустно',
    meaning: 'I feel sad / To me it is sad.',
    explanation: 'In impersonal state constructions with the Dative pronoun (Мне), the emotional feeling is expressed with the neuter adverb ending in -о (грустно).',
  },
  {
    id: 'eg-2',
    prompt: 'Мне ______!',
    emoji: '🎉',
    options: ['весело', 'весёлый', 'весёлая', 'весельчак'],
    correct: 'весело',
    meaning: 'I am having joyful fun!',
    explanation: 'State of enjoyment uses the adverb "весело", regardless of whether the speaker is male or female.',
  },
  {
    id: 'eg-3',
    prompt: 'Ему на улице ______.',
    emoji: '🥶',
    options: ['холодно', 'холодный', 'холодная', 'холодильник'],
    correct: 'холодно',
    meaning: 'He feels cold outside.',
    explanation: 'Sensory feelings (cold) in Russian use "холодно" with Dative pronouns (ему, ей, мне).',
  },
  {
    id: 'eg-4',
    prompt: 'Нам на лекции было ______.',
    emoji: '😴',
    options: ['скучно', 'скучный', 'скучная', 'скучать'],
    correct: 'скучно',
    meaning: 'We were bored at the lecture.',
    explanation: 'Boredom is expressed with the past tense copula "было" + adverb "скучно".',
  },
  {
    id: 'eg-5',
    prompt: 'В чайхане очень ______.',
    emoji: '☕',
    options: ['уютно', 'уютный', 'уютная', 'уют'],
    correct: 'уютно',
    meaning: 'It is very cozy in the teahouse.',
    explanation: 'Environmental ambiance takes the predicative adverb ending in -о (уютно).',
  },
];

export interface CultureObjectItem {
  id: string;
  name: string;
  origin: 'Russia' | 'India';
  image: string;
  description: string;
  funFact: string;
}

export const cultureObjectItems: CultureObjectItem[] = [
  {
    id: 'co-1',
    name: 'Samovar (Самовар)',
    origin: 'Russia',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    description: 'A traditional heated metal container traditionally used to heat and boil water for tea ceremonies in Russia.',
    funFact: 'Tula is regarded as the historic capital of Russian samovar craft, where masters hammered elaborate brass and silver models.',
  },
  {
    id: 'co-2',
    name: 'Ashoka Chakra (अशोक चक्र)',
    origin: 'India',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80',
    description: 'The 24-spoke wheel of Dharma erected by Emperor Ashoka at Sarnath, featured on India’s national flag.',
    funFact: 'Each of the 24 spokes represents a timeless virtue, such as love, courage, patience, peace, and righteousness.',
  },
  {
    id: 'co-3',
    name: 'Kokoshnik (Кокошник)',
    origin: 'Russia',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    description: 'A traditional Russian headdress worn by women and girls, adorned with river pearls and silver threads.',
    funFact: 'The arched shape often mirrored the architectural onion dome or the crest of a swan.',
  },
  {
    id: 'co-4',
    name: 'Kathakali Mask & Makeup (कथकली)',
    origin: 'India',
    image: 'https://images.unsplash.com/photo-1609137144827-c104443916e7?auto=format&fit=crop&w=600&q=80',
    description: 'The elaborate green face makeup (Paccha) and headgear used in classical temple dance-theatre of Kerala.',
    funFact: 'It takes over four hours of meticulous natural pigment application before a performance begins.',
  },
  {
    id: 'co-5',
    name: 'Gzhel Ceramics (Гжель)',
    origin: 'Russia',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: 'Distinctive Russian folk ceramic style featuring vivid cobalt-blue hand-painted patterns on snow-white porcelain.',
    funFact: 'Produced since the 14th century in the Gzhel pottery villages southeast of Moscow.',
  },
  {
    id: 'co-6',
    name: 'Madhubani Painting (मधुबनी चित्रकला)',
    origin: 'India',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    description: 'Ancient folk art practiced by women in the Mithila region of Bihar, using twigs, matchsticks, and natural vegetable dyes.',
    funFact: 'Tradition holds that King Janaka commissioned artists to paint the town for the wedding of Sita and Rama.',
  },
];

export interface RegionGuessItem {
  id: string;
  image: string;
  question: string;
  options: string[];
  correct: string;
  clue: string;
  explanation: string;
}

export const regionGuessItems: RegionGuessItem[] = [
  {
    id: 'rg-1',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    question: 'Which golden fortress and desert realm is this?',
    options: ['Rajasthan (India)', 'Tatarstan (Russia)', 'Ladakh (India)', 'Smolensk (Russia)'],
    correct: 'Rajasthan (India)',
    clue: 'Look at the sandstone battlements overlooking the Thar Desert.',
    explanation: 'This is the majestic sandstone fortification in Rajasthan, India.',
  },
  {
    id: 'rg-2',
    image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80',
    question: 'Identify the region famed for Gnezdovo archaeological barrows and ancient brick fortress walls:',
    options: ['Smolensk Region (Russia)', 'Delhi (India)', 'Novgorod (Russia)', 'Odisha (India)'],
    correct: 'Smolensk Region (Russia)',
    clue: 'The hero city on the upper Dnieper River that protected western trade routes.',
    explanation: 'Smolensk and the nearby Gnezdovo reserve are celebrated archaeological jewels of Russia.',
  },
  {
    id: 'rg-3',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    question: 'High mountain monasteries perched on rocky crags beneath azure skies:',
    options: ['Ladakh (India)', 'Siberia / Baikal (Russia)', 'West Bengal (India)', 'Moscow (Russia)'],
    correct: 'Ladakh (India)',
    clue: 'Known as the "Land of High Passes" in the Himalayas.',
    explanation: 'Thiksey and Hemis monasteries in Ladakh, India.',
  },
  {
    id: 'rg-4',
    image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
    question: 'A crystal-clear ice expanse and sacred Shaman Rock in the heart of Eurasia:',
    options: ['Siberia & Lake Baikal (Russia)', 'Bihar (India)', 'Saint Petersburg (Russia)', 'Kerala (India)'],
    correct: 'Siberia & Lake Baikal (Russia)',
    clue: 'The oldest and deepest freshwater lake on the planet.',
    explanation: 'Lake Baikal in Siberia, Russia.',
  },
];

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const literaryQuizItems: QuizQuestionItem[] = [
  {
    id: 'lq-1',
    question: 'Which Russian literary titan had an inspirational correspondence on non-violence with Mahatma Gandhi in 1909–1910?',
    options: ['Leo Tolstoy', 'Alexander Pushkin', 'Fyodor Dostoevsky', 'Anton Chekhov'],
    correct: 'Leo Tolstoy',
    explanation: 'Tolstoy wrote to Gandhi in South Africa affirming that universal love and non-resistance (Ahimsa) are the greatest moral forces.',
  },
  {
    id: 'lq-2',
    question: 'Who is revered as the father of modern Russian literature, author of the verse novel "Eugene Onegin"?',
    options: ['Alexander Pushkin', 'Nikolai Gogol', 'Ivan Turgenev', 'Mikhail Lermontov'],
    correct: 'Alexander Pushkin',
    explanation: 'Alexander Pushkin (1799–1837) modernized the Russian literary language and shaped its national soul.',
  },
  {
    id: 'lq-3',
    question: 'In Dostoevsky’s "Crime and Punishment", in which historic city does Rodion Raskolnikov wander beside the canals?',
    options: ['Saint Petersburg', 'Moscow', 'Kazan', 'Novgorod'],
    correct: 'Saint Petersburg',
    explanation: 'Dostoevsky immortalized Saint Petersburg’s summer heat, narrow stairwells, and Haymarket square.',
  },
  {
    id: 'lq-4',
    question: 'Which Indian Nobel laureate visited Russia in 1930 and published his impressions in "Letters from Russia"?',
    options: ['Rabindranath Tagore', 'Premchand', 'Sarojini Naidu', 'Sri Aurobindo'],
    correct: 'Rabindranath Tagore',
    explanation: 'Rabindranath Tagore visited Moscow in September 1930, deeply praising rural education and artistic accessibility.',
  },
];
