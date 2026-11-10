export type Language = 'en' | 'ru' | 'hi';

export type Country = 'Russia' | 'India' | 'Both';

export type VideoCategory =
  | 'Archaeology'
  | 'Architecture'
  | 'Traditions'
  | 'Festivals'
  | 'History'
  | 'Nature'
  | 'People'
  | 'Science'
  | 'Cities'
  | 'Cultural Connections';

export interface Region {
  id: string;
  country: 'Russia' | 'India';
  regionType?: string; // e.g., 'Republic' | 'Oblast' | 'Krai' | 'Federal City' | 'Autonomous Okrug' | 'Autonomous Oblast' | 'State' | 'Union Territory'
  federalDistrictOrZone?: string; // e.g., 'Central', 'Volga', 'North', 'South', etc.
  capital?: string;
  capitalRu?: string;
  capitalHi?: string;
  name: string;
  nameRu: string;
  nameHi: string;
  subtitle?: string;
  subtitleRu?: string;
  subtitleHi?: string;
  mapX: number; // Percentage for SVG map pin/area
  mapY: number; // Percentage for SVG map pin/area
  lat?: number;
  lng?: number;
  shortDescription: string;
  shortDescriptionRu?: string;
  shortDescriptionHi?: string;
  heritageInfo: string;
  heritageInfoRu?: string;
  heritageInfoHi?: string;
  archaeologicalInfo?: string;
  archaeologicalInfoRu?: string;
  archaeologicalInfoHi?: string;
  historicalPlaces: string[];
  historicalPlacesRu?: string[];
  historicalPlacesHi?: string[];
  specificFeatures?: string[];
  specificFeaturesRu?: string[];
  specificFeaturesHi?: string[];
  funFacts?: string[];
  funFactsRu?: string[];
  funFactsHi?: string[];
  traditions: string[];
  traditionsRu?: string[];
  traditionsHi?: string[];
  unescoSites?: string[];
  image: string;
  galleryImages?: string[];
  videoUrl?: string;
  videoTitle?: string;
  climateOrGeo?: string;
  climateOrGeoRu?: string;
  climateOrGeoHi?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  titleRu: string;
  titleHi: string;
  country: Country;
  region: string;
  shortDescription: string;
  category: VideoCategory;
  date: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  featured?: boolean;
}

export interface SoulStoryEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  titleRu: string;
  titleHi: string;
  location: string;
  country: Country;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  keyThemes: string[];
}

export interface GrammarExercise {
  id: string;
  question: string;
  questionRu?: string;
  context?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  explanationRu?: string;
  explanationHi?: string;
  type: 'multiple-choice' | 'fill-blank' | 'emoji-grammar';
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleRu: string;
  titleHi: string;
  category:
    | 'Cases'
    | 'Verbs'
    | 'Adjectives'
    | 'Gender'
    | 'Aspect'
    | 'Prepositions'
    | 'Pronouns'
    | 'Adverbs'
    | 'Sentence structure';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  rules: { title: string; explanation: string; examples: string[] }[];
  exercises: GrammarExercise[];
}

export interface AuthorMajorWork {
  title: string;
  titleHi?: string;
  year: string;
  description: string;
  descriptionHi?: string;
}

export interface Author {
  id: string;
  name: string;
  nameRu: string;
  nameHi: string;
  era: 'Classical Literature' | 'Soviet Literature' | 'Contemporary Literature' | 'Poetry';
  years: string;
  portrait: string;
  biography: string;
  majorWorks: AuthorMajorWork[];
  importantThemes: string[];
  selectedQuotations: { quote: string; quoteRu?: string; source: string }[];
  educationalActivities: string[];
}

export type OpportunityCategory =
  | 'Fellowship'
  | 'Competition'
  | 'Scholarship'
  | 'Youth Programme'
  | 'Conference'
  | 'Cultural Event'
  | 'Language Programme'
  | 'Russian Language'
  | 'Academic Programme'
  | 'Volunteer'
  | 'Volunteer Opportunity'
  | 'Internship';

export interface Opportunity {
  id: string;
  title: string;
  titleRu?: string;
  category: OpportunityCategory;
  country: 'Russia' | 'India' | 'International';
  deadline: string;
  daysRemaining?: number;
  eligibility: string;
  format: 'Online' | 'Offline' | 'Hybrid';
  funding: 'Fully funded' | 'Partially funded' | 'Self-funded' | 'Free entry / Cash prizes';
  shortDescription: string;
  officialLink: string;
  targetAudience: ('Students' | 'Teachers' | 'Youth' | 'Researchers')[];
  statusBadge: 'Deadline Soon' | 'Open' | 'Fellowship' | 'Competition' | 'Conference';
}

export interface CulturalConnection {
  id: string;
  title: string;
  titleRu: string;
  titleHi: string;
  slug: string;
  russianSide: {
    name: string;
    subtitle: string;
    image: string;
    description: string;
    culturalDetails: string[];
    videoUrl?: string;
  };
  indianSide: {
    name: string;
    subtitle: string;
    image: string;
    description: string;
    culturalDetails: string[];
    videoUrl?: string;
  };
  synthesis: {
    sharedPhilosophy: string;
    differences: string;
    historicalBridges: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'word-match' | 'emoji-grammar' | 'russian-or-indian' | 'guess-region' | 'literary-quiz' | 'culture-challenge';
  question: string;
  image?: string;
  emoji?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ArchaeologicalSite {
  id: string;
  name: string;
  nameRu: string;
  nameHi: string;
  country: 'Russia' | 'India';
  region: string;
  regionRu: string;
  regionHi: string;
  lat: number;
  lng: number;
  period: string;
  periodRu: string;
  periodHi: string;
  age: string;
  ageRu: string;
  ageHi: string;
  discovered: string;
  civilization: string;
  civilizationRu: string;
  civilizationHi: string;
  shortDescription: string;
  shortDescriptionRu: string;
  shortDescriptionHi: string;
  description: string;
  descriptionRu: string;
  descriptionHi: string;
  significance: string;
  significanceRu: string;
  significanceHi: string;
  keyArtifacts: {
    name: string;
    nameRu: string;
    nameHi: string;
    desc: string;
  }[];
  excavationHighlights: string[];
  excavationHighlightsRu: string[];
  excavationHighlightsHi: string[];
  imageUrl: string;
  galleryImages: string[];
  unescoStatus?: string;
  indoEurasianLink: string;
  indoEurasianLinkRu: string;
  indoEurasianLinkHi: string;
}

export type WarEpoch =
  | 'kievan-rus'
  | 'time-of-troubles'
  | 'peasant-uprisings'
  | 'napoleonic-1812'
  | 'crimean-war'
  | 'ww1'
  | 'civil-war'
  | 'ww2-great-patriotic'
  | 'modern-valour';

export interface HeroicStory {
  id: string;
  title: string;
  titleRu: string;
  titleHi?: string;
  epoch: WarEpoch;
  warName: string;
  warNameRu: string;
  warNameHi?: string;
  heroName: string;
  heroNameRu: string;
  heroNameHi?: string;
  roleOrRank?: string;
  roleOrRankRu?: string;
  dates: string;
  location: string;
  locationRu?: string;
  heroAction: string;
  heroActionRu: string;
  heroActionHi?: string;
  story: string;
  storyRu: string;
  storyHi?: string;
  quote?: string;
  quoteRu?: string;
  quoteHi?: string;
  quoteAuthor?: string;
  quoteAuthorRu?: string;
  quoteAuthorHi?: string;
  image?: string;
  videoUrl?: string;
  videoTitle?: string;
  badge?: string;
  outcomeOrLegacy?: string;
  outcomeOrLegacyRu?: string;
  solidarityNote?: string;
  solidarityNoteRu?: string;
}

export interface VictoryQuote {
  id: string;
  figureName: string;
  figureNameRu: string;
  figureNameHi: string;
  figureTitle: string;
  figureTitleRu: string;
  figureTitleHi: string;
  quote: string;
  quoteRu: string;
  quoteHi: string;
  warOrEpoch: string;
  warOrEpochRu: string;
  warOrEpochHi: string;
  epoch: WarEpoch;
  yearOrDate: string;
  portraitUrl: string;
  videoUrl?: string;
  videoTitle?: string;
  significance?: string;
  significanceRu?: string;
  significanceHi?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  titleRu?: string;
  titleHi?: string;
  heading?: string;
  headingRu?: string;
  category: string;
  categoryRu?: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  excerptRu?: string;
  excerptHi?: string;
  content: string;
  contentRu?: string;
  image: string;
  videoUrl?: string;
  tags: string[];
  isFeatured?: boolean;
}
