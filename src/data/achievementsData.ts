export interface FeaturedAchievement {
  videoUrl: string;
  badgeEn: string;
  badgeRu: string;
  badgeHi: string;
  titleEn: string;
  titleRu: string;
  titleHi: string;
  captionEn: string;
  captionRu: string;
  captionHi: string;
  date: string;
}

export type AchievementItemType = 'certificate' | 'photo' | 'video';

export interface AchievementItem {
  id: string;
  type: AchievementItemType;
  titleEn: string;
  titleRu: string;
  titleHi: string;
  captionEn: string;
  captionRu: string;
  captionHi: string;
  issuer?: string;
  date: string;
  mediaUrl: string;
  thumbnailUrl?: string;
}

export const DEFAULT_FEATURED_ACHIEVEMENT: FeaturedAchievement = {
  videoUrl: 'https://youtu.be/Dt3C7TK_fac?si=CEJ6x0kTzMcGA0Tu',
  badgeEn: 'Second Prize · Eurasian Awards',
  badgeRu: 'Вторая премия · Евразийская премия',
  badgeHi: 'द्वितीय पुरस्कार · यूरेशियन अवार्ड्स',
  titleEn: 'Second Prize Winner — Eurasian Awards',
  titleRu: 'Лауреат II премии — Евразийская премия (Eurasian Awards)',
  titleHi: 'द्वितीय पुरस्कार विजेता — यूरेशियन अवार्ड्स',
  captionEn:
    'Honored to receive the Second Prize at the prestigious Eurasian Awards, recognizing contributions to youth cultural diplomacy, comparative heritage studies, and Russia–India friendship.',
  captionRu:
    'Почётная вторая премия на престижной Евразийской премии за вклад в молодёжную культурную дипломатию, изучение общего наследия и укрепление российско-индийской дружбы.',
  captionHi:
    'प्रतिष्ठित यूरेशियन अवार्ड्स में युवा सांस्कृतिक कूटनीति, साझा विरासत अध्ययन और भारत-रूस मैत्री को सुदृढ़ करने में योगदान के लिए द्वितीय पुरस्कार प्राप्त करने का गौरव।',
  date: '2025',
};

export const DEFAULT_ACHIEVEMENT_ITEMS: AchievementItem[] = [
  {
    id: 'ach-cert-1',
    type: 'certificate',
    titleEn: 'Eurasian Awards — Second Prize Certificate',
    titleRu: 'Диплом II степени — Евразийская премия',
    titleHi: 'यूरेशियन अवार्ड्स — द्वितीय पुरस्कार प्रमाणपत्र',
    captionEn:
      'Official certificate awarded for securing Second Prize in international youth cultural diplomacy and intercultural research.',
    captionRu:
      'Официальный диплом лауреата II премии за достижения в сфере международной молодёжной культурной дипломатии.',
    captionHi:
      'अंतरराष्ट्रीय युवा सांस्कृतिक कूटनीति एवं अंतर-सांस्कृतिक शोध में द्वितीय पुरस्कार प्राप्त करने का आधिकारिक प्रमाणपत्र।',
    issuer: 'Eurasian Awards Committee',
    date: '2025',
    mediaUrl: '/cultural_images/novgorod_kremlin.jpg',
  },
  {
    id: 'ach-photo-1',
    type: 'photo',
    titleEn: 'Russia–India Cultural Dialogue Presentation',
    titleRu: 'Презентация российско-индийского культурного диалога',
    titleHi: 'भारत-रूस सांस्कृतिक संवाद प्रस्तुति',
    captionEn:
      'Representing bilateral heritage initiatives, comparative linguistics, and student collaboration between India and Russia.',
    captionRu:
      'Представление двусторонних проектов в области культурного наследия, языкознания и студенческого сотрудничества России и Индии.',
    captionHi:
      'भारत और रूस के बीच द्विपक्षीय विरासत पहल, तुलनात्मक भाषा विज्ञान और छात्र सहयोग का प्रतिनिधित्व।',
    issuer: 'International Youth Forum',
    date: '2025',
    mediaUrl: '/cultural_images/russian_hospitality.jpg',
  },
  {
    id: 'ach-video-1',
    type: 'video',
    titleEn: 'Eurasian Awards — Award Ceremony & Highlight Reel',
    titleRu: 'Церемония награждения Евразийской премии',
    titleHi: 'यूरेशियन अवार्ड्स — सम्मान समारोह वीडियो',
    captionEn:
      'Recorded moment from the Eurasian Awards ceremony celebrating Second Prize recognition.',
    captionRu:
      'Памятные кадры церемонии вручения Второй премии на Евразийской премии.',
    captionHi:
      'यूरेशियन अवार्ड्स सम्मान समारोह में द्वितीय पुरस्कार प्राप्त करने के अविस्मरणीय क्षण।',
    issuer: 'Eurasian Awards',
    date: '2025',
    mediaUrl: 'https://youtu.be/Dt3C7TK_fac?si=CEJ6x0kTzMcGA0Tu',
    thumbnailUrl: '/cultural_images/smolensk_fortress.jpg',
  },
];
