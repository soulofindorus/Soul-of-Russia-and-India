import { Language } from '../types';

export interface RouteInfo {
  section: string;
  videoId?: string;
  regionId?: string;
  lang?: Language;
}

// Subdomain keywords mapped to canonical section keys
export const SUBDOMAIN_SECTION_MAP: Record<string, string> = {
  // Home
  home: 'home',
  portal: 'home',
  main: 'home',
  www: 'home',

  // Heritage & Soul Stories
  heritage: 'heritage',
  culture: 'heritage',
  stories: 'heritage',
  soul: 'heritage',
  'soul-stories': 'heritage',
  videos: 'heritage',
  documentaries: 'heritage',

  // Archaeology
  archaeology: 'archaeology',
  archeology: 'archaeology',
  excavations: 'archaeology',
  ancient: 'archaeology',
  dossiers: 'archaeology',

  // Victory / Память победы
  victory: 'victory',
  pobeda: 'victory',
  'pamyat-pobedy': 'victory',
  heroes: 'victory',
  war: 'victory',
  historywar: 'victory',

  // Articles & Blogs
  articles: 'articles',
  article: 'articles',
  blog: 'articles',
  blogs: 'articles',
  research: 'articles',
  essays: 'articles',
  news: 'articles',

  // Language
  language: 'language',
  learn: 'language',
  russian: 'language',
  hindi: 'language',
  linguistics: 'language',
  grammar: 'language',

  // Opportunities & Trade
  opportunities: 'opportunities',
  opportunity: 'opportunities',
  trade: 'opportunities',
  commerce: 'opportunities',
  business: 'opportunities',
  invest: 'opportunities',
  fellowships: 'opportunities',

  // Connections
  connections: 'connections',
  relations: 'connections',
  ties: 'connections',
  diplomacy: 'connections',
  history: 'connections',

  // Literature
  literature: 'literature',
  books: 'literature',
  authors: 'literature',
  writers: 'literature',
  library: 'literature',

  // Games & Trivia
  games: 'games',
  game: 'games',
  trivia: 'games',
  quiz: 'games',
  activities: 'games',

  // About
  about: 'about',
  mission: 'about',
  team: 'about',
  contact: 'about',
};

// All registered sections with canonical names and metadata
export interface SectionMeta {
  id: string;
  titleEn: string;
  titleRu: string;
  titleHi: string;
  primarySubdomain: string;
  alternativeSubdomains: string[];
  canonicalPath: string;
  descriptionEn: string;
  category: string;
}

export const REGISTERED_SECTIONS: SectionMeta[] = [
  {
    id: 'home',
    titleEn: 'Home Portal',
    titleRu: 'Главный портал',
    titleHi: 'मुख्य पोर्टल',
    primarySubdomain: 'home',
    alternativeSubdomains: ['portal', 'main'],
    canonicalPath: '/',
    descriptionEn: 'The grand gateway to Russian-Indian cultural, historical and bilateral discovery.',
    category: 'Portal',
  },
  {
    id: 'heritage',
    titleEn: 'Cultural Heritage & Soul Stories',
    titleRu: 'Культурное наследие и Истории души',
    titleHi: 'सांस्कृतिक विरासत और आत्मा की कहानियाँ',
    primarySubdomain: 'heritage',
    alternativeSubdomains: ['culture', 'stories', 'videos'],
    canonicalPath: '/heritage',
    descriptionEn: 'Interactive maps, regional dossiers, and the Soul Stories documentary film series.',
    category: 'Heritage',
  },
  {
    id: 'archaeology',
    titleEn: 'Archaeology & Prehistoric Excavations',
    titleRu: 'Археология и древние раскопки',
    titleHi: 'पुरातत्व और प्राचीन उत्खनन',
    primarySubdomain: 'archaeology',
    alternativeSubdomains: ['excavations', 'ancient'],
    canonicalPath: '/archaeology',
    descriptionEn: 'Bronze age citadels, Harappan metropolises, Scythian kurgans and submerged Greek colonies.',
    category: 'History',
  },
  {
    id: 'victory',
    titleEn: 'Memory of Victory (Память победы)',
    titleRu: 'Память победы: Войны и герои',
    titleHi: 'विजय की स्मृति: युद्ध और वीर नायक',
    primarySubdomain: 'victory',
    alternativeSubdomains: ['pobeda', 'heroes', 'pamyat-pobedy'],
    canonicalPath: '/victory',
    descriptionEn: 'Heroic war sagas, peasant uprisings, Napoleonic battles, World Wars & sacred remembrance.',
    category: 'Valor',
  },
  {
    id: 'articles',
    titleEn: 'Scholarly Articles & Blogs',
    titleRu: 'Статьи, исследования и блоги',
    titleHi: 'विद्वत्तापूर्ण लेख और शोध ब्लॉग',
    primarySubdomain: 'articles',
    alternativeSubdomains: ['blog', 'research', 'essays'],
    canonicalPath: '/articles',
    descriptionEn: 'In-depth essays, historical analyses, media-rich articles with full admin editing.',
    category: 'Publications',
  },
  {
    id: 'language',
    titleEn: 'Bilingual Language Portal',
    titleRu: 'Языковой портал (Русский и Хинди)',
    titleHi: 'द्विभाषी भाषा पोर्टल (रूसी और हिंदी)',
    primarySubdomain: 'language',
    alternativeSubdomains: ['learn', 'russian', 'hindi'],
    canonicalPath: '/language',
    descriptionEn: 'Interactive grammar lessons, interactive phrasebooks, and linguistic comparison.',
    category: 'Education',
  },
  {
    id: 'opportunities',
    titleEn: 'Bilateral Opportunities & Trade',
    titleRu: 'Двусторонние возможности и торговля',
    titleHi: 'द्विपक्षीय अवसर और व्यापार',
    primarySubdomain: 'trade',
    alternativeSubdomains: ['opportunities', 'commerce', 'business'],
    canonicalPath: '/opportunities',
    descriptionEn: 'Scholarships, youth summits, INSTC logistics, industrial partnerships & trade listings.',
    category: 'Bilateral',
  },
  {
    id: 'connections',
    titleEn: 'Russia × India Historical Connections',
    titleRu: 'Исторические связи России и Индии',
    titleHi: 'भारत-रूस ऐतिहासिक संबंध',
    primarySubdomain: 'connections',
    alternativeSubdomains: ['history', 'ties', 'diplomacy'],
    canonicalPath: '/connections',
    descriptionEn: 'From Afanasy Nikitin to Roerich, diplomatic treaties, space missions and maritime routes.',
    category: 'History',
  },
  {
    id: 'literature',
    titleEn: 'Literature & Great Authors',
    titleRu: 'Литература и великие авторы',
    titleHi: 'साहित्य और महान लेखक',
    primarySubdomain: 'literature',
    alternativeSubdomains: ['books', 'authors', 'library'],
    canonicalPath: '/literature',
    descriptionEn: 'Tolstoy, Tagore, Pushkin, Premchand, Dostoevsky, and immortal philosophical dialogues.',
    category: 'Culture',
  },
  {
    id: 'games',
    titleEn: 'Cultural Trivia & Games',
    titleRu: 'Культурные викторины и игры',
    titleHi: 'सांस्कृतिक प्रश्नोत्तरी और खेल',
    primarySubdomain: 'games',
    alternativeSubdomains: ['quiz', 'trivia'],
    canonicalPath: '/games',
    descriptionEn: 'Interactive trivia challenges, civilization flashcards and cross-cultural quizzes.',
    category: 'Activities',
  },
  {
    id: 'about',
    titleEn: 'About & Diplomatic Vision',
    titleRu: 'О проекте и руководство',
    titleHi: 'परियोजना और नेतृत्व के बारे में',
    primarySubdomain: 'about',
    alternativeSubdomains: ['mission', 'team'],
    canonicalPath: '/about',
    descriptionEn: 'Project leadership, international outreach, and mission objectives.',
    category: 'About',
  },
];

/**
 * Extracts the subdomain from the current hostname, if any.
 * Excludes standard local and cloud development hosts unless explicitly specified.
 */
export function extractSubdomain(hostname: string): string | null {
  if (!hostname) return null;
  const cleanHost = hostname.toLowerCase().trim();

  // Ignore raw IPs and localhost
  if (
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(cleanHost)
  ) {
    return null;
  }

  // Google Cloud Run hostnames look like: ais-dev-abc-123.asia-southeast1.run.app
  // On run.app hosts, custom DNS subdomains are not mapped directly without a custom domain.
  // We handle them gracefully.
  const parts = cleanHost.split('.');
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub !== 'www' && !sub.startsWith('ais-dev-') && !sub.startsWith('ais-pre-')) {
      return sub;
    }
  }

  return null;
}

/**
 * Parses the current browser URL (hostname subdomain, search params, hash, pathname)
 * and returns the targeted section, videoId, regionId, and language.
 */
export function detectInitialRoute(): RouteInfo {
  if (typeof window === 'undefined') {
    return { section: 'home' };
  }

  const { pathname, search, hash, hostname } = window.location;
  const searchParams = new URLSearchParams(search);

  let targetSection: string | null = null;
  let targetVideoId: string | undefined = undefined;
  let targetRegionId: string | undefined = undefined;
  let targetLang: Language | undefined = undefined;

  // 1. Language param: ?lang=ru or ?lang=hi or ?lang=en
  const langParam = searchParams.get('lang')?.toLowerCase();
  if (langParam === 'ru' || langParam === 'hi' || langParam === 'en') {
    targetLang = langParam as Language;
  }

  // 2. Direct Subdomain detection from hostname (e.g. archaeology.soulofrussiaandindia.org)
  const hostSubdomain = extractSubdomain(hostname);
  if (hostSubdomain && SUBDOMAIN_SECTION_MAP[hostSubdomain]) {
    targetSection = SUBDOMAIN_SECTION_MAP[hostSubdomain];
  }

  // 3. Subdomain simulation query parameter (e.g. ?subdomain=victory or ?sub=archaeology)
  const subParam = searchParams.get('subdomain') || searchParams.get('sub');
  if (subParam && SUBDOMAIN_SECTION_MAP[subParam.toLowerCase()]) {
    targetSection = SUBDOMAIN_SECTION_MAP[subParam.toLowerCase()];
  }

  // 4. Section parameter (e.g. ?section=victory)
  const sectionParam = searchParams.get('section')?.toLowerCase();
  if (sectionParam && SUBDOMAIN_SECTION_MAP[sectionParam]) {
    targetSection = SUBDOMAIN_SECTION_MAP[sectionParam];
  }

  // 5. Hash parameter (e.g. #victory, #archaeology, #video=soul-1, #region=altai)
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '').trim();
    if (cleanHash.startsWith('video=')) {
      targetVideoId = cleanHash.split('=')[1];
    } else if (cleanHash.startsWith('watch-')) {
      targetVideoId = cleanHash.replace('watch-', '');
    } else if (cleanHash.startsWith('region=')) {
      targetRegionId = cleanHash.split('=')[1];
    } else if (cleanHash.startsWith('reg-')) {
      targetRegionId = cleanHash.replace('reg-', '');
    } else {
      const hashKey = cleanHash.toLowerCase();
      if (SUBDOMAIN_SECTION_MAP[hashKey]) {
        targetSection = SUBDOMAIN_SECTION_MAP[hashKey];
      }
    }
  }

  // 6. Direct Pathname (e.g. /archaeology, /victory, /pamyat-pobedy, /articles)
  if (!targetSection && pathname && pathname !== '/') {
    const cleanPath = pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
    if (cleanPath && SUBDOMAIN_SECTION_MAP[cleanPath]) {
      targetSection = SUBDOMAIN_SECTION_MAP[cleanPath];
    }
  }

  // 7. Direct video and region search params (e.g. ?video=soul-1, ?region=altai)
  const videoParam = searchParams.get('video') || searchParams.get('v');
  if (videoParam) {
    targetVideoId = videoParam;
  }

  const regionParam = searchParams.get('region') || searchParams.get('r');
  if (regionParam) {
    targetRegionId = regionParam;
  }

  return {
    section: targetSection || 'home',
    videoId: targetVideoId,
    regionId: targetRegionId,
    lang: targetLang,
  };
}

/**
 * Synchronizes browser URL with current section and modal state using pushState/replaceState
 * so the user can easily copy their browser address bar at any moment.
 */
export function syncBrowserUrl(
  section: string,
  options?: {
    videoId?: string | null;
    regionId?: string | null;
    replace?: boolean;
  }
) {
  if (typeof window === 'undefined') return;

  const currentSearch = new URLSearchParams(window.location.search);

  // Preserve existing language if set in query
  const lang = currentSearch.get('lang');
  const newParams = new URLSearchParams();
  if (lang) newParams.set('lang', lang);

  // Set clean hash
  let newHash = '';
  if (options?.videoId) {
    newHash = `#video=${encodeURIComponent(options.videoId)}`;
  } else if (options?.regionId) {
    newHash = `#region=${encodeURIComponent(options.regionId)}`;
  } else if (section && section !== 'home') {
    newHash = `#${section}`;
  }

  const queryString = newParams.toString() ? `?${newParams.toString()}` : '';
  const newUrl = `${window.location.pathname}${queryString}${newHash}`;

  if (options?.replace) {
    window.history.replaceState({ section, videoId: options?.videoId, regionId: options?.regionId }, '', newUrl);
  } else {
    window.history.pushState({ section, videoId: options?.videoId, regionId: options?.regionId }, '', newUrl);
  }
}

/**
 * Generates all format direct links for any given section
 */
export function getDirectLinksForSection(sectionId: string, customDomain = 'soulofrussiaandindia.org') {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://soulofrussiaandindia.org';
  const meta = REGISTERED_SECTIONS.find((s) => s.id === sectionId) || REGISTERED_SECTIONS[0];
  const primarySub = meta.primarySubdomain;

  return {
    // 1. Universally compatible Hash Link (works on ANY server/proxy/static host)
    hashUrl: `${origin}/#${sectionId}`,

    // 2. Direct Path URL
    pathUrl: `${origin}/${sectionId}`,

    // 3. Subdomain query simulation (instant test on Cloud Run / any environment)
    simulatedSubdomainUrl: `${origin}/?subdomain=${primarySub}`,

    // 4. True Custom Domain Subdomain URL (DNS CNAME setup)
    customDnsSubdomainUrl: `https://${primarySub}.${customDomain}`,

    // 5. Query Parameter link
    queryUrl: `${origin}/?section=${sectionId}`,

    meta,
  };
}

/**
 * Safe clipboard copy with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API error, attempting fallback...', err);
  }

  // Fallback via textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}
