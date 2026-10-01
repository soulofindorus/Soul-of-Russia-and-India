import { Author } from '../types';
import pushkinImg from '../assets/images/regenerated_image_1790030071567.jpg';
import tolstoyImg from '../assets/images/regenerated_image_1790030323566.jpg';
import dostoevskyImg from '../assets/images/regenerated_image_1790030324215.jpg';
import chekhovImg from '../assets/images/regenerated_image_1790030325131.jpg';
import akhmatovaImg from '../assets/images/regenerated_image_1790030325958.jpg';
import solzhenitsynImg from '../assets/images/regenerated_image_1790030326692.jpg';
import shalamovImg from '../assets/images/regenerated_image_1790030328382.jpg';

export const authorsData: Author[] = [
  {
    id: 'pushkin',
    name: 'Alexander Pushkin',
    nameRu: 'Александр Пушкин',
    nameHi: 'अलेक्सांद्र पुश्किन',
    era: 'Classical Literature',
    years: '1799 – 1837',
    portrait: pushkinImg,
    biography: 'Revered as the father of modern Russian literature and Russia’s national poet. Pushkin transformed the Russian language, blending colloquial speech with classical verse, folklore, and profound psychological nuance.',
    majorWorks: [
      {
        title: 'Eugene Onegin (Евгений Онегин)',
        titleHi: 'यूजीन ओनेगिन (येवगेनी ओनेगिन)',
        year: '1833',
        description: 'Novel in verse examining love, disillusionment, duels, and 19th-century Russian society.',
        descriptionHi: 'प्रेम, निराशा, द्वंद्वयुद्ध और 19वीं सदी के रूसी समाज पर छंद-बद्ध कालजयी उपन्यास।',
      },
      {
        title: 'The Bronze Horseman (Медный всадник)',
        titleHi: 'कांस्य अश्वारोही (मेद्नी व्स्याद्निक)',
        year: '1833',
        description: 'Masterwork poem portraying Saint Petersburg and the tension between imperial power and human life.',
        descriptionHi: 'सेंट पीटर्सबर्ग की भव्यता और साम्राज्यिक शक्ति व आम इंसान के संघर्ष पर अमर कविता।',
      },
      {
        title: 'The Captain’s Daughter (Капитанская дочка)',
        titleHi: 'कप्तान की बेटी (कापितान्स्काया दोचका)',
        year: '1836',
        description: 'Historical novel set against the turbulent Pugachev Cossack rebellion.',
        descriptionHi: 'पुगाचेव विद्रोह की ऐतिहासिक पृष्ठभूमि पर आधारित अमर उपन्यास।',
      },
    ],
    importantThemes: [
      'Freedom & Human Destiny',
      'The Russian Soul & Folklore',
      'The Tragedy of Romantic Passion',
      'Saint Petersburg & Nature',
    ],
    selectedQuotations: [
      {
        quote: '“It is not beauty that endears, it’s love that makes us see beauty.”',
        quoteRu: '«Не то дорого, что красиво, а то красиво, что дорого сердцу.»',
        source: 'Letters and Aphorisms',
      },
      {
        quote: '“I loved you: and perhaps I love you still, the flame, maybe, is not yet extinguished in my heart...”',
        quoteRu: '«Я вас любил: любовь еще, быть может, в душе моей угасла не совсем...»',
        source: 'Poem "Я вас любил" (1829)',
      },
    ],
    educationalActivities: [
      'Recitation challenge: Practice Pushkin’s "Winter Morning" (Зимнее утро) aloud.',
      'Compare Pushkin’s folklore verse with Kalidasa’s Sanskrit poetry on monsoon nature.',
    ],
  },
  {
    id: 'tolstoy',
    name: 'Leo Tolstoy',
    nameRu: 'Лев Толстой',
    nameHi: 'लियो टॉल्स्टॉय',
    era: 'Classical Literature',
    years: '1828 – 1910',
    portrait: tolstoyImg,
    biography: 'Giant of world realism, moral philosopher, and social visionary from Yasnaya Polyana. His philosophical works on non-violent resistance had a profound and transformative impact on Mahatma Gandhi.',
    majorWorks: [
      {
        title: 'War and Peace (Война и мир)',
        titleHi: 'युद्ध और शांति (वोयना इ मीर)',
        year: '1869',
        description: 'Epic sweeping panorama of Napoleonic invasions, philosophical musings on history, and the spiritual journeys of Pierre, Prince Andrei, and Natasha Rostova.',
        descriptionHi: 'नेपोलियन के आक्रमण, रूसी समाज और दार्शनिक चिंतन का विश्वप्रसिद्ध महाकाव्य।',
      },
      {
        title: 'Anna Karenina (Анна Каренина)',
        titleHi: 'अन्ना कारेनिना',
        year: '1877',
        description: 'Profound study of love, family, fidelity, hypocrisy, and rural spiritual awakening through Levin.',
        descriptionHi: 'प्रेम, परिवार, निष्ठा, पाखंड और ग्रामीण आध्यात्मिक जागृति पर कालजयी उपन्यास।',
      },
      {
        title: 'The Kingdom of God Is Within You (Царство Божие внутри вас)',
        titleHi: 'ईश्वर का साम्राज्य तुम्हारे भीतर है',
        year: '1894',
        description: 'Foundational treatise on universal Christian and humanist pacifism, read fervently by young Gandhi.',
        descriptionHi: 'अहिंसा और सत्याग्रह का आधारभूत ग्रंथ जिसने महात्मा गांधी को गहरे रूप से प्रेरित किया।',
      },
    ],
    importantThemes: [
      'Spiritual Seeking & Moral Awakening',
      'Non-Violent Resistance (Ahimsa)',
      'The Flow of History and Ordinary Lives',
      'Correspondence with Mahatma Gandhi',
    ],
    selectedQuotations: [
      {
        quote: '“The two most powerful warriors are patience and time.”',
        quoteRu: '«Самые сильные воины — это терпение и время.»',
        source: 'War and Peace',
      },
      {
        quote: '“All happy families are alike; each unhappy family is unhappy in its own way.”',
        quoteRu: '«Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.»',
        source: 'Anna Karenina',
      },
    ],
    educationalActivities: [
      'Analyze the historical letter sent by Leo Tolstoy to Mahatma Gandhi in 1910 endorsing the Satyagraha movement in Transvaal.',
      'Reflect on Tolstoy’s concept of simplicity and self-sufficiency at Yasnaya Polyana.',
    ],
  },
  {
    id: 'dostoevsky',
    name: 'Fyodor Dostoevsky',
    nameRu: 'Фёдор Достоевский',
    nameHi: 'फ्योदोर दोस्तोवस्की',
    era: 'Classical Literature',
    years: '1821 – 1881',
    portrait: dostoevskyImg,
    biography: 'Psychological philosopher and novelist who probed the darkest corners and highest ecstasies of the human psyche, guilt, faith, and redemption.',
    majorWorks: [
      {
        title: 'Crime and Punishment (Преступление и наказание)',
        titleHi: 'अपराध और दंड (प्रेस्तुप्लेनिए इ नाकाजानिए)',
        year: '1866',
        description: 'Raskolnikov’s psychological torment and moral resurrection after committing murder in Saint Petersburg.',
        descriptionHi: 'रास्कोलनिकोव के मनोवैज्ञानिक अंतर्द्वंद्व और नैतिक उद्धार की विश्वप्रसिद्ध गाथा।',
      },
      {
        title: 'The Brothers Karamazov (Братья Карамазовы)',
        titleHi: 'द ब्रदर्स कारामाज़ोव (ब्रात्या कारामाज़ोवी)',
        year: '1880',
        description: 'Monuments of existential philosophy exploring faith, free will, patricide, and the Grand Inquisitor parable.',
        descriptionHi: 'ईश्वर, स्वतंत्र इच्छा, नैतिकता और मानवीय अस्तित्व पर आधारित महान दार्शनिक कृति।',
      },
      {
        title: 'The Idiot (Идиот)',
        titleHi: 'द इडियट (ईडियट)',
        year: '1869',
        description: 'The tragedy of Prince Myshkin, an innocent, compassionate Christ-like soul caught in corrupt society.',
        descriptionHi: 'पवित्र, निष्पाप प्रिंस मिश्किन और भ्रष्ट समाज के टकराव की करुण कहानी।',
      },
    ],
    importantThemes: [
      'The Paradoxes of the Human Soul',
      'Suffering as Purification',
      'Faith vs Rationalism',
      'Redemption & Compassion',
    ],
    selectedQuotations: [
      {
        quote: '“Beauty will save the world.”',
        quoteRu: '«Красота спасёт мир.»',
        source: 'The Idiot (Идиот)',
      },
      {
        quote: '“The secret of man’s being is not only to live but to have something to live for.”',
        quoteRu: '«Тайна бытия человеческого не в том, чтобы только жить, а в том, для чего жить.»',
        source: 'The Brothers Karamazov',
      },
    ],
    educationalActivities: [
      'Interactive philosophical debate: What did Dostoevsky mean by "Beauty will save the world"?',
      'Trace Raskolnikov’s walking route through the streets and Haymarket square of Saint Petersburg.',
    ],
  },
  {
    id: 'chekhov',
    name: 'Anton Chekhov',
    nameRu: 'Антон Чехов',
    nameHi: 'अंतोन चेखव',
    era: 'Classical Literature',
    years: '1860 – 1904',
    portrait: chekhovImg,
    biography: 'Physician, playwright, and supreme master of the short story. Chekhov revolutionized modern drama by showing that the deepest tragedies happen not in melodrama, but in quiet, everyday conversations.',
    majorWorks: [
      {
        title: 'The Cherry Orchard (Вишнёвый сад)',
        titleHi: 'चेरी का बगीचा (विश्न्योवी साद)',
        year: '1904',
        description: 'Elegiac play capturing the sunset of the Russian aristocracy and the inexorable march of social change.',
        descriptionHi: 'रूसी कुलीन वर्ग के पतन और नए युग के आगमन पर विचारोत्तेजक नाटक।',
      },
      {
        title: 'The Seagull (Чайка)',
        titleHi: 'द सीगल (चायका)',
        year: '1896',
        description: 'Landmark drama on art, dreams, and unrequited desires, celebrated at the Moscow Art Theatre.',
        descriptionHi: 'कला, प्रेम, मानव मन और अधूरी इच्छाओं पर कालजयी नाटक।',
      },
      {
        title: 'The Lady with the Dog (Дама с собачкой)',
        titleHi: 'कुत्ते वाली महिला (दामा स सोबाचकॉय)',
        year: '1899',
        description: 'Masterclass of subtle psychological short fiction set in Yalta.',
        descriptionHi: 'याल्टा में पनपे सूक्ष्म मानवीय प्रेम और मनोभावों की उत्कृष्ट कहानी।',
      },
    ],
    importantThemes: [
      'Human Frailty & Gentleness',
      'The Passage of Time',
      'Subtext & Unspoken Words',
      'Compassion without Preachiness',
    ],
    selectedQuotations: [
      {
        quote: '“Medicine is my lawful wife and literature is my mistress; when I get tired of one, I spend the night with the other.”',
        quoteRu: '«Медицина — моя законная жена, а литература — любовница.»',
        source: 'Letters to A.S. Suvorin',
      },
      {
        quote: '“In a human being everything should be beautiful: the face, the clothes, the soul, and the thoughts.”',
        quoteRu: '«В человеке должно быть всё прекрасно: и лицо, и одежда, и душа, и мысли.»',
        source: 'Uncle Vanya (Дядя Ваня)',
      },
    ],
    educationalActivities: [
      'Creative writing: Draft a 300-word micro-story practicing Chekhov’s rule of subtle subtext.',
      'Compare Chekhov’s quiet rural realism with Munshi Premchand’s Indian village stories.',
    ],
  },
  {
    id: 'akhmatova',
    name: 'Anna Akhmatova',
    nameRu: 'Анна Ахматова',
    nameHi: 'अन्ना अख्मातोवा',
    era: 'Poetry',
    years: '1889 – 1966',
    portrait: akhmatovaImg,
    biography: 'One of the most acclaimed poets of the Russian Silver Age, renowned for her Acclaimed dignity, restrained lyricism, and unyielding fortitude during periods of national suffering.',
    majorWorks: [
      {
        title: 'Requiem (Реквием)',
        titleHi: 'रेक्विएम (शोक-गीत चक्र)',
        year: '1935–1940',
        description: 'Monumental poetic cycle mourning the victims of the Great Purge, memorized by friends in secret.',
        descriptionHi: 'दमन और महा-शोधन के दौर में आम जनता की मूक वेदना और असीम धैर्य का अमर शोक-काव्य।',
      },
      {
        title: 'Poem Without a Hero (Поэма без героя)',
        titleHi: 'बिना नायक की कविता (पोएमा बेज़ गेरोया)',
        year: '1940–1962',
        description: 'Complex, mystical reflection on the lost culture of pre-revolutionary Saint Petersburg.',
        descriptionHi: 'क्रांति-पूर्व सेंट पीटर्सबर्ग की खोई हुई समृद्ध संस्कृति और इतिहास पर रहस्यमयी चिंतन।',
      },
      {
        title: 'Evening (Вечер)',
        titleHi: 'संध्या (वेचर)',
        year: '1912',
        description: 'Intimate early lyric collection that established her distinctive poetic voice.',
        descriptionHi: 'अन्ना अख्मातोवा का प्रथम ऐतिहासिक काव्य-संग्रह जिसने उनकी विशिष्ट काव्यात्मक आवाज़ स्थापित की।',
      },
    ],
    importantThemes: [
      'Courage & Moral Witness',
      'Memory as Sacred Duty',
      'Love, Longing, & Saint Petersburg Twilight',
    ],
    selectedQuotations: [
      {
        quote: '“No, and not under a foreign sky, nor under foreign wings protecting me: I was then with my people, where my people, unfortunately, were.”',
        quoteRu: '«Нет, и не под чуждым небосводом, и не под защитой чуждых крыл, — я была тогда с моим народом, там, где мой народ, к несчастью, был.»',
        source: 'Requiem (Реквием)',
      },
    ],
    educationalActivities: [
      'Explore the concept of "poetry committed to memory" as historical testimony.',
    ],
  },
  {
    id: 'solzhenitsyn',
    name: 'Alexander Solzhenitsyn',
    nameRu: 'Александр Солженицын',
    nameHi: 'अलेक्सांद्र सोल्झेनित्सिन',
    era: 'Soviet Literature',
    years: '1918 – 2008',
    portrait: solzhenitsynImg,
    biography: 'Nobel Prize laureate in Literature (1970) whose monumental writings revealed the historical reality of the Soviet penal camp system and the resilience of the human soul.',
    majorWorks: [
      {
        title: 'One Day in the Life of Ivan Denisovich (Один день Ивана Денисовича)',
        titleHi: 'इवान देनिसोविच के जीवन का एक दिन',
        year: '1962',
        description: 'Groundbreaking novella chronicling a single day of ordinary survival in a Siberian labor camp.',
        descriptionHi: 'साइबेरियाई श्रम शिविर में एक साधारण कैदी के आत्मसम्मान और जीवित रहने का ऐतिहासिक चित्रण।',
      },
      {
        title: 'The Gulag Archipelago (Архипелаг ГУЛАГ)',
        titleHi: 'गुलाग द्वीपसमूह (अर्खीपेलाग गुलाग)',
        year: '1973',
        description: 'Monumental three-volume investigation of the labor camp system, combining historical documentation with personal memoir.',
        descriptionHi: 'सोवियत श्रम शिविर प्रणाली और मानवीय आत्मा की अटूट जिजीविषा का महा-दस्तावेज़।',
      },
      {
        title: 'Cancer Ward (Раковый корпус)',
        titleHi: 'कैंसर वार्ड (राकोवी कोरपुस)',
        year: '1968',
        description: 'Profound allegorical novel exploring illness, mortality, courage, and moral integrity in Soviet Central Asia.',
        descriptionHi: 'मध्य एशिया की पृष्ठभूमि पर बीमारी, नश्वरता, साहस और नैतिक सत्य पर मार्मिक रूपक उपन्यास।',
      },
    ],
    importantThemes: [
      'Truth as the Highest Power',
      'Moral Incorruptibility',
      'Historical Memory',
    ],
    selectedQuotations: [
      {
        quote: '“One word of truth outweighs the entire world.”',
        quoteRu: '«Одно слово правды весь мир перетянет.»',
        source: 'Nobel Lecture (1970)',
      },
      {
        quote: '“The line dividing good and evil cuts through the heart of every human being.”',
        quoteRu: '«Линия, разделяющая добро и зло, пересекает сердце каждого человека.»',
        source: 'The Gulag Archipelago',
      },
    ],
    educationalActivities: [
      'Discuss Solzhenitsyn’s belief that literature carries historical memory across generations.',
    ],
  },
  {
    id: 'shalamov',
    name: 'Varlam Shalamov',
    nameRu: 'Варлам Шаламов',
    nameHi: 'वारलाम शालामोव',
    era: 'Soviet Literature',
    years: '1907 – 1982',
    portrait: shalamovImg,
    biography: 'Poet and writer who survived seventeen years in the gold-mining camps of Kolyma in the Far North. His prose is marked by austere, crystalline honesty and profound existential insight.',
    majorWorks: [
      {
        title: 'Kolyma Tales (Колымские рассказы)',
        titleHi: 'कोलिमा की कहानियाँ (कोलिम्स्कीए रास्स्काज़ी)',
        year: '1954–1973',
        description: 'Uncompromising collection of short stories depicting the Arctic frost, forced labor, and the limits of human endurance.',
        descriptionHi: 'सुदूर उत्तर के भीषण शीत, श्रम और मानवीय सहनशीलता की चरम सीमा पर आधारित कालजयी कहानियाँ।',
      },
      {
        title: 'Kolyma Notebooks (Колымские тетради)',
        titleHi: 'कोलिमा नोटबुक (कोलिम्स्कीए तेत्रादी)',
        year: '1949–1954',
        description: 'Cycles of intense lyric poetry composed in the sub-zero Taiga.',
        descriptionHi: 'शून्य से नीचे के तापमान में बर्फीले टैगा में रचित गहन काव्यात्मक छंद।',
      },
    ],
    importantThemes: [
      'The Arctic Winter & Survival',
      'Austere Realism of the North',
      'The Human Spirit in Extreme Conditions',
    ],
    selectedQuotations: [
      {
        quote: '“A human being is able to endure far more than they think they can.”',
        quoteRu: '«Человек может перенести гораздо больше, чем он думает.»',
        source: 'Kolyma Tales (Колымские рассказы)',
      },
    ],
    educationalActivities: [
      'Reflect on the power of concise, laconic storytelling when conveying extreme experiences.',
    ],
  },
];
