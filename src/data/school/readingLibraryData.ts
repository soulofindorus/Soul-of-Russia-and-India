import { ReadingMaterial } from '../../types/school';

export const READING_LIBRARY_ITEMS: ReadingMaterial[] = [
  // A1 Readings
  {
    id: 'read-a1-letter',
    levelId: 'a1',
    title: 'First Postcard from Moscow',
    titleRu: 'Пе́рвая откры́тка из Москвы́',
    author: 'School Original Curriculum Text',
    source: 'Soul of Russia and India A1 Reader',
    licenseNote: 'Original educational text',
    genre: 'Personal Postcard',
    estimatedMinutes: 4,
    textRu: [
      'Приве́т, ма́ма и па́па! Сейча́с я в Москве́. Э́то о́чень краси́вый и большо́й го́род.',
      'Мо́й университе́т и общежи́тие нахо́дятся недалеко́ от па́рка. У́тром я пью́ ча́й, пото́м е́ду на метро́ на уро́ки.',
      'Преподава́теля зову́т Еле́на Серге́евна. Мои́ но́вые друзья́ о́чень до́брые. Я уже́ чита́ю и немного говорю́ по-ру́сски!',
    ],
    textEn: [
      'Hi Mom and Dad! Right now I am in Moscow. It is a very beautiful and big city.',
      'My university and hostel are located not far from a park. In the morning I drink tea, then I take the metro to class.',
      'Our teacher’s name is Elena Sergeyevna. My new friends are very kind. I already read and speak a little Russian!',
    ],
    textHi: [
      'नमस्ते माँ और पिताजी! अभी मैं मॉस्को में हूँ। यह बहुत सुंदर और बड़ा शहर है।',
      'मेरा विश्वविद्यालय और हॉस्टल एक पार्क के पास स्थित हैं। सुबह मैं चाय पीता हूँ, फिर मेट्रो से कक्षाओं में जाता हूँ।',
      'हमारी शिक्षिका का नाम येलेना सर्गेयेवना है। मेरे नए दोस्त बहुत दयालु हैं। मैं पहले से थोड़ा रूसी पढ़ और बोल लेता हूँ!',
    ],
    vocabulary: [
      { word: 'открытка', stressed: 'откры́тка', english: 'postcard', hindi: 'पोस्टकार्ड' },
      { word: 'недалеко от', stressed: 'недалеко́ от', english: 'not far from (+ Gen.)', hindi: 'के पास' },
      { word: 'добрый', stressed: 'до́брый', english: 'kind', hindi: 'दयालु / नेक' },
    ],
    expressions: [
      { russian: 'недалеко́ от па́рка', english: 'not far from the park', usage: 'Takes Genitive after от' },
      { russian: 'е́ду на метро́', english: 'I go by metro', usage: 'Transport uses на + Prepositional' },
    ],
    grammarNotes: [
      'Notice Elena Sergeyevna: Russians address teachers by First Name + Patronymic.',
      'Notice в Москве́ (Prepositional) and пью́ / е́ду (1st person singular present).',
    ],
    comprehensionQuestions: [
      {
        id: 'rq-a1-1',
        type: 'multiple-choice',
        prompt: 'How does the student travel to classes each morning?',
        options: ['By bus', 'By metro', 'By taxi', 'By train'],
        correctAnswer: 'By metro',
        explanation: 'The text states «еду на метро на уроки».',
      },
    ],
  },
  {
    id: 'read-a1-market',
    levelId: 'a1',
    title: 'Saturday Market & Tea Time',
    titleRu: 'Суббо́тний ры́нок и ча́й',
    author: 'School Original Curriculum Text',
    source: 'Soul of Russia and India A1 Reader',
    licenseNote: 'Original educational text',
    genre: 'Everyday Vignette',
    estimatedMinutes: 4,
    textRu: [
      'Сего́дня суббо́та. Мы с подру́гой идём в магази́н покупа́ть фру́кты и хле́б.',
      'Мы покупа́ем кра́сные я́блоки, ба́наны, сы́р и чёрный ча́й. Всё сто́ит три́ста рубле́й.',
      'Ве́чером мы слу́шаем ру́сские пе́сни и пьём горя́чий ча́й с лимо́ном.',
    ],
    textEn: [
      'Today is Saturday. My friend and I are going to the shop to buy fruit and bread.',
      'We buy red apples, bananas, cheese, and black tea. Everything costs 300 rubles.',
      'In the evening we listen to Russian songs and drink hot tea with lemon.',
    ],
    textHi: [
      'आज शनिवार है। मैं और मेरी सहेली फल और ब्रेड खरीदने दुकान जा रहे हैं।',
      'हम लाल सेब, केले, चीज़ और काली चाय खरीदते हैं। सब कुछ 300 रूबल का है।',
      'शाम को हम रूसी गीत सुनते हैं और नींबू वाली गरम चाय पीते हैं।',
    ],
    vocabulary: [
      { word: 'покупать', stressed: 'покупа́ть', english: 'to buy', hindi: 'खरीदना' },
      { word: 'фрукты', stressed: 'фру́кты', english: 'fruit (plural)', hindi: 'फल' },
      { word: 'песня', stressed: 'пе́сня', english: 'song', hindi: 'गीत' },
    ],
    expressions: [{ russian: 'мы с подругой', english: 'my friend and I (lit. we with friend)', usage: 'Idiomatic way Russians say "X and I"' }],
    grammarNotes: ['Russian prefers «Мы с подругой» over «Я и моя подруга».'],
    comprehensionQuestions: [
      {
        id: 'rq-a1-2',
        type: 'multiple-choice',
        prompt: 'What is the total cost of their groceries?',
        options: ['100 rubles', '200 rubles', '300 rubles', '500 rubles'],
        correctAnswer: '300 rubles',
        explanation: '«Всё стоит триста рублей» = 300 rubles.',
      },
    ],
  },

  // A2 Readings
  {
    id: 'read-a2-tolstoy-ant',
    levelId: 'a2',
    title: 'The Lion and the Mouse (Adapted Fable)',
    titleRu: 'Лев и мышь (по басне Л. Н. Толстого)',
    author: 'Lev Tolstoy (Public Domain, 1872 New ABC Book)',
    source: 'Л. Н. Толстой «Новая азбука» (Public Domain)',
    licenseNote: 'Public domain (published 1872)',
    genre: 'Classical Children’s Fable',
    estimatedMinutes: 5,
    textRu: [
      'Лев спа́л. Мы́шь пробежа́ла ему́ по те́лу. Он просну́лся и пойма́л её.',
      'Мы́шь ста́ла проси́ть, что́бы он отпусти́л её; она́ сказа́ла: «Е́сли ты меня́ отпу́стишь, и я тебе́ добро́ сде́лаю». Лев засмея́лся, что мы́шь обеща́ет ему́ сде́лать добро́, и пусти́л её.',
      'Пото́м охо́тники пойма́ли льва и привяза́ли верёвкой к де́реву. Мы́шь услы́шала рёв льва, прибежа́ла, перегры́зла верёвку и сказа́ла: «По́мнишь, ты смея́лся, не ду́мал, что и я могу́ тебе́ добро́ сде́лать; а тепе́рь ви́дишь — быва́ет и от мы́ши добро́».',
    ],
    textEn: [
      'A lion was sleeping. A mouse ran across his body. He woke up and caught her.',
      'The mouse began to beg him to let her go; she said: "If you let me go, I will do you a good turn too." The lion laughed that a mouse promised to do him good, and released her.',
      'Later, hunters caught the lion and tied him with a rope to a tree. The mouse heard the lion’s roar, ran up, gnawed through the rope, and said: "Remember how you laughed, thinking I could never do you good; now you see—good can come even from a mouse."',
    ],
    textHi: [
      'एक शेर सो रहा था। एक चूहा उसके शरीर पर से दौड़ गया। शेर जाग गया और उसने उसे पकड़ लिया।',
      'चूहा विनती करने लगा कि वह उसे छोड़ दे; उसने कहा: "यदि तुम मुझे छोड़ दोगे, तो मैं भी तुम्हारा भला करूँगा।" शेर हँस पड़ा कि एक चूहा भला करने का वादा कर रहा है, और उसने उसे छोड़ दिया।',
      'बाद में शिकारियों ने शेर को पकड़ लिया और रस्सी से पेड़ से बाँध दिया। चूहे ने शेर की दहाड़ सुनी, दौड़कर आया, रस्सी कुतर दी और कहा: "याद है तुम हँसते थे? अब देखो — छोटे से भी भलाई हो सकती है।"',
    ],
    vocabulary: [
      { word: 'отпустить', stressed: 'отпусти́ть', english: 'to let go / release', hindi: 'छोड़ देना' },
      { word: 'охотник', stressed: 'охо́тник', english: 'hunter', hindi: 'शिकारी' },
      { word: 'верёвка', stressed: 'верёвка', english: 'rope', hindi: 'रस्सी' },
    ],
    expressions: [{ russian: 'сде́лать добро́', english: 'to do a good deed', usage: 'Uses Dative for recipient (тебе́ добро́)' }],
    grammarNotes: ['Observe Perfective past sequence: услы́шала -> прибежа́ла -> перегры́зла -> сказа́ла.'],
    comprehensionQuestions: [
      {
        id: 'rq-a2-1',
        type: 'multiple-choice',
        prompt: 'Why did the lion laugh at the mouse?',
        options: [
          'He did not believe a tiny mouse could ever help a lion',
          'He liked jokes',
          'Hunters were nearby',
          'He was not sleepy',
        ],
        correctAnswer: 'He did not believe a tiny mouse could ever help a lion',
        explanation: '«Лев засмеялся, что мышь обещает ему сделать добро».',
      },
    ],
  },
  {
    id: 'read-a2-train',
    levelId: 'a2',
    title: 'Overnight Train to Saint Petersburg',
    titleRu: 'Ночно́й по́езд в Санкт-Петербу́рг',
    author: 'School Original Curriculum Text',
    source: 'Soul of Russia and India A2 Reader',
    licenseNote: 'Original educational text',
    genre: 'Travel Story',
    estimatedMinutes: 5,
    textRu: [
      'В пя́тницу ве́чером мы по́ехали с Ленингра́дского вокза́ла в Санкт-Петербу́рг. По́езд отправля́лся в два́дцать три часа́.',
      'В купе́ на́ш со́сед принёс стака́ны в металли́ческих подстака́нниках с горя́чим ча́ем. Мы долго разгова́ривали о кни́гах и культу́ре.',
      'У́тром по́езд при́был в Петербу́рг. На Моско́вском вокза́ле нас встре́тили друзья́ с буке́том цвето́в.',
    ],
    textEn: [
      'On Friday evening we left Leningradsky Station for Saint Petersburg. The train departed at 23:00.',
      'In our compartment, our neighbor brought glasses in metal holders filled with hot tea. We talked for a long time about books and culture.',
      'In the morning the train arrived in Petersburg. At Moskovsky Station, friends met us with a bouquet of flowers.',
    ],
    textHi: [
      'शुक्रवार शाम हम लेनिनग्रादस्की स्टेशन से सेंट पीटर्सबर्ग के लिए रवाना हुए। ट्रेन रात 11 बजे छूटी।',
      'कुपे में हमारे सहयात्री धातु के होल्डर (подстаканник) में गरम चाय के गिलास लाए। हमने किताबों और संस्कृति पर लंबी बातें कीं।',
      'सुबह ट्रेन पीटर्सबर्ग पहुँची। मॉस्कोवस्की स्टेशन पर दोस्तों ने फूलों के गुलदस्ते के साथ हमारा स्वागत किया।',
    ],
    vocabulary: [
      { word: 'подстаканник', stressed: 'подстака́нник', english: 'iconic Russian metal tea-glass holder', hindi: 'चाय के गिलास का धातु होल्डर' },
      { word: 'купе', stressed: 'купе́', english: '4-berth train compartment (indecl.)', hindi: 'रेल का डिब्बा / कुपे' },
    ],
    expressions: [{ russian: 'встре́тить на вокза́ле', english: 'to meet someone at the station', usage: 'Accusative + на + Prepositional' }],
    grammarNotes: ['Notice Leningradsky Station in Moscow leads to Petersburg, while Moskovsky Station in Petersburg receives trains from Moscow!'],
    comprehensionQuestions: [
      {
        id: 'rq-a2-2',
        type: 'multiple-choice',
        prompt: 'How did the travelers enjoy tea on the overnight train?',
        options: ['In plastic cups', 'In glasses held in traditional metal подстаканники', 'At a station kiosk only', 'They drank juice'],
        correctAnswer: 'In glasses held in traditional metal подстаканники',
        explanation: 'Подстака́нники remain an iconic symbol of Russian railways.',
      },
    ],
  },

  // B1 Readings
  {
    id: 'read-b1-nikitin',
    levelId: 'b1',
    title: 'Afanasy Nikitin’s Journey Across Three Seas',
    titleRu: 'Хожде́ние за три́ мо́ря Афана́сия Ники́тина',
    author: 'School Cultural Essay',
    source: 'Soul of Russia and India B1 Historical Reader',
    licenseNote: 'Original historical summary based on public-domain 15th-c. chronicles',
    genre: 'Historical Essay',
    estimatedMinutes: 6,
    textRu: [
      'В XV ве́ке тверско́й купе́ц Афана́сий Ники́тин соверши́л бесприме́рное путеше́ствие из Дре́вней Руси́ в И́ндию, оста́вив знамени́тые путевы́е запи́ски «Хожде́ние за три́ мо́ря».',
      'Оказа́вшись на инди́йской земле́ на це́лых три го́да ра́ньше Ва́ско да Га́мы, Ники́тин с уваже́нием описывал го́рода, я́рмарки, обы́чаи и по́вседневную жи́знь люде́й.',
      'Он не просто наблю́дал за но́вой страно́й, но и пыта́лся поня́ть её ду́шу, сохрани́в при э́том глубо́кую тоску́ по родно́му до́му на бе́регах Во́лги.',
    ],
    textEn: [
      'In the 15th century, Tver merchant Afanasy Nikitin accomplished an unprecedented journey from Old Rus to India, leaving behind his famous travelogue "A Journey Beyond Three Seas."',
      'Arriving on Indian soil three full decades before Vasco da Gama, Nikitin respectfully described cities, markets, customs, and daily life.',
      'He did not merely observe the new country, but sought to understand its soul while keeping deep longing for his native homeland along the Volga.',
    ],
    textHi: [
      '15वीं शताब्दी में त्वेर के व्यापारी अफ़नासी निकितिन ने प्राचीन रूस से भारत की अभूतपूर्व यात्रा की और अपनी प्रसिद्ध यात्रा-डायरी "तीन समुद्रों के पार की यात्रा" लिखी।',
      'वास्को दा गामा से पूरे तीन दशक पहले भारत पहुँचकर निकितिन ने यहाँ के शहरों, बाज़ारों, रीति-रिवाजों और दैनिक जीवन का सम्मानपूर्वक वर्णन किया।',
      'उन्होंने केवल नए देश को देखा ही नहीं, बल्कि वोल्गा के तट पर स्थित अपनी मातृभूमि की गहरी याद संजोए रखते हुए भारत की आत्मा को समझने का प्रयास किया।',
    ],
    vocabulary: [
      { word: 'путевые записки', stressed: 'путевы́е запи́ски', english: 'travelogue / travel notes', hindi: 'यात्रा वृत्तांत' },
      { word: 'обычай', stressed: 'обы́чай', english: 'custom / tradition', hindi: 'रीति-रिवाज' },
      { word: 'тоска по', stressed: 'тоска́ по (+ Dat.)', english: 'longing / homesickness for', hindi: 'गहरी याद / विरह' },
    ],
    expressions: [{ russian: 'соверши́ть путеше́ствие', english: 'to undertake/accomplish a journey', usage: 'Elevated B1 collocation' }],
    grammarNotes: ['Notice the Perfective verbal adverb «Оказавшись» and Imperfective «сохранив» illustrating B1 participial clauses!'],
    comprehensionQuestions: [
      {
        id: 'rq-b1-1',
        type: 'multiple-choice',
        prompt: 'What is noteworthy about Afanasy Nikitin’s arrival in India compared with European maritime expeditions?',
        options: [
          'He arrived roughly thirty years earlier than Vasco da Gama',
          'He traveled in the 19th century',
          'He never wrote anything down',
          'He only visited Moscow',
        ],
        correctAnswer: 'He arrived roughly thirty years earlier than Vasco da Gama',
        explanation: 'Nikitin reached India in 1469, decades prior to 1498.',
      },
    ],
  },
  {
    id: 'read-b1-campus',
    levelId: 'b1',
    title: 'Choosing a Research Topic at University',
    titleRu: 'Вы́бор нау́чной те́мы в университе́те',
    author: 'School Original B1 Text',
    source: 'Soul of Russia and India B1 Academic Reader',
    licenseNote: 'Original educational text',
    genre: 'Academic Narrative',
    estimatedMinutes: 5,
    textRu: [
      'Когда́ А́рья поступи́ла на магистрату́ру в Санкт-Петербу́рге, пе́рвым серьёзным ша́гом стал вы́бор те́мы дипломно́й рабо́ты.',
      'Посове́товавшись с нау́чным руководи́телем, она́ реши́ла изуча́ть перепи́ску Льва Толсто́го с инди́йскими мысли́телями. Тепе́рь ка́ждую неде́лю она́ рабо́тает в чита́льном за́ле и де́лает вы́писки из первоисто́чников.',
    ],
    textEn: [
      'When Arya entered her master’s program in Saint Petersburg, her first serious step was choosing a thesis topic.',
      'Having consulted with her academic advisor, she decided to study Leo Tolstoy’s correspondence with Indian thinkers. Now every week she works in the reading hall and takes notes from primary sources.',
    ],
    textHi: [
      'जब आर्या ने सेंट पीटर्सबर्ग में मास्टर्स डिग्री में प्रवेश लिया, तो पहला महत्वपूर्ण कदम थीसिस का विषय चुनना था।',
      'अपने शोध-निर्देशक से परामर्श करने के बाद, उसने भारतीय विचारकों के साथ लियो टॉलस्टॉय के पत्राचार का अध्ययन करने का निर्णय लिया। अब वह हर सप्ताह वाचनालय में प्राथमिक स्रोतों से नोट्स बनाती है।',
    ],
    vocabulary: [
      { word: 'магистратура', stressed: 'магистрату́ра', english: 'Master’s degree program', hindi: 'स्नातकोत्तर (मास्टर्स)' },
      { word: 'первоисточник', stressed: 'первоисто́чник', english: 'primary source', hindi: 'प्राथमिक स्रोत' },
    ],
    expressions: [{ russian: 'нау́чный руководи́тель', english: 'academic/thesis advisor', usage: 'Standard university term' }],
    grammarNotes: ['Notice Perfective reflexive verbal adverb «Посоветовавшись с + Instrumental».'],
    comprehensionQuestions: [
      {
        id: 'rq-b1-2',
        type: 'multiple-choice',
        prompt: 'What topic did Arya select after meeting her advisor?',
        options: [
          'Urban architecture',
          'Tolstoy’s correspondence with Indian thinkers',
          'Physics formulas',
          'Sports journalism',
        ],
        correctAnswer: 'Tolstoy’s correspondence with Indian thinkers',
        explanation: '«решила изучать переписку Льва Толстого с индийскими мыслителями».',
      },
    ],
  },

  // B2 Readings
  {
    id: 'read-b2-chekhov',
    levelId: 'b2',
    title: 'Pushkin: "I Loved You..." (Я вас любил...)',
    titleRu: 'А. С. Пу́шкин — «Я ва́с люби́л...» (1829)',
    author: 'Alexander Sergeyevich Pushkin',
    source: 'Public Domain Classical Poetry (1829)',
    licenseNote: 'Public domain (published 1829)',
    genre: 'Classical Lyric Poetry',
    estimatedMinutes: 5,
    textRu: [
      'Я ва́с люби́л: любо́вь ещё, быть мо́жет, / В душе́ мое́й уга́сла не совсе́м; / Но пу́сть она́ ва́с бо́льше не трево́жит; / Я не хочу́ печа́лить ва́с ниче́м.',
      'Я ва́с люби́л безмо́лвно, безнаде́жно, / То ро́бостью, то ре́вностью томи́м; / Я ва́с люби́л так и́скренно, так не́жно, / Как да́й вам бо́г люби́мой быть други́м.',
    ],
    textEn: [
      'I loved you: love, perhaps, / Has not yet died out completely in my soul; / Yet let it trouble you no more; / I do not wish to sadden you in any way.',
      'I loved you silently, hopelessly, / Now by shyness, now by jealousy tormented; / I loved you so sincerely, so tenderly, / As God grant you may be loved by another.',
    ],
    textHi: [
      'मैंने आपसे प्रेम किया: संभवतः वह प्रेम / मेरी आत्मा में अभी पूरी तरह बुझा नहीं है; / किंतु अब वह आपको और व्याकुल न करे; / मैं किसी भी बात से आपको दुखी नहीं करना चाहता।',
      'मैंने आपसे मौन, निराश होकर प्रेम किया, / कभी संकोच तो कभी ईर्ष्या से व्यथित; / मैंने आपसे इतने सच्चे, इतने कोमल भाव से प्रेम किया, / ईश्वर करे कोई और भी आपसे वैसा ही प्रेम करे।',
    ],
    vocabulary: [
      { word: 'угаснуть', stressed: 'уга́снуть', english: 'to fade / die out (like an ember)', hindi: 'बुझ जाना' },
      { word: 'безмолвно', stressed: 'безмо́лвно', english: 'silently / wordlessly', hindi: 'मौन रहकर' },
      { word: 'искренно', stressed: 'и́скренно', english: 'sincerely', hindi: 'सच्चे दिल से' },
    ],
    expressions: [{ russian: 'быть мо́жет', english: 'perhaps (poetic variant of может быть)', usage: 'Poetic parenthesis' }],
    grammarNotes: [
      'Notice the past passive participle «томим» (short form of томи́мый: tormented) governing Instrumental «робостью, ревностью».',
      'Final line uses Instrumental passive: «любимой быть другим» (to be loved by another).',
    ],
    comprehensionQuestions: [
      {
        id: 'rq-b2-1',
        type: 'multiple-choice',
        prompt: 'What emotional nobility defines the final line of Pushkin’s poem?',
        options: [
          'Selfless devotion—wishing the beloved to be loved just as sincerely by someone else',
          'Anger at a rival',
          'Complaint about winter',
          'Request to return letters',
        ],
        correctAnswer: 'Selfless devotion—wishing the beloved to be loved just as sincerely by someone else',
        explanation: '«Как дай вам бог любимой быть другим» expresses extraordinary generosity of spirit.',
      },
    ],
  },

  // C1 & C2 Advanced Authentic Readings
  {
    id: 'read-c1-gandhi-tolstoy',
    levelId: 'c1',
    title: 'Tolstoy, Non-Violence & Philosophical Dialogue with India',
    titleRu: 'Филосо́фский диало́г Льва Толсто́го и Маха́тмы Га́нди',
    author: 'School C1 Cultural Essay',
    source: 'Soul of Russia and India C1 Archive Reader',
    licenseNote: 'Original scholarly essay referencing historical 1909–1910 public-domain letters',
    genre: 'Philosophical / Historical Prose',
    estimatedMinutes: 7,
    textRu: [
      'Перепи́ска Льва Никола́евича Толсто́го и Моханда́са Карамча́нда Га́нди в 1909–1910 года́х остаётся одни́м из наибо́лее значи́тельных интелле́ктуальных диало́гов но́вого вре́мени.',
      'В своём знамени́том «Письме́ к инду́су» и последу́ющих откли́ках Толсто́й обраща́л внима́ние на то, что проти́вление злу без на́силия тре́бует несравни́мо бо́льше вну́тренней сто́йкости, не́жели силово́е столкнове́ние.',
      'Для Га́нди, создава́вшего в те го́ды «Ферму Толсто́го» в Ю́жной А́фрике, мысль ру́сского писа́теля послужи́ла не внешним авторите́том, а глубо́ким подтвержде́нием со́бственных эти́ческих иска́ний сатьягра́хи.',
    ],
    textEn: [
      'The correspondence between Lev Nikolayevich Tolstoy and Mohandas Karamchand Gandhi in 1909–1910 remains one of the most significant intellectual dialogues of modern times.',
      'In his renowned "Letter to a Hindu" and subsequent responses, Tolstoy emphasized that non-violent resistance demands incomparably greater inner fortitude than armed confrontation.',
      'For Gandhi, who was establishing Tolstoy Farm in South Africa during those years, the Russian thinker’s words served not as an external authority, but as deep resonance for his own ethical quest of Satyagraha.',
    ],
    textHi: [
      '1909–1910 में लियो निकोलायेविच टॉलस्टॉय और मोहनदास करमचंद गांधी के बीच पत्राचार आधुनिक युग के सबसे महत्वपूर्ण बौद्धिक संवादों में से एक है।',
      'अपने प्रसिद्ध "एक हिंदू के नाम पत्र" और बाद के उत्तरों में टॉलस्टॉय ने इस बात पर बल दिया कि अहिंसक प्रतिरोध में सशस्त्र टकराव की तुलना में कहीं अधिक आंतरिक दृढ़ता की आवश्यकता होती है।',
      'गांधी के लिए, जो उन वर्षों में दक्षिण अफ्रीका में "टॉलस्टॉय फार्म" की स्थापना कर रहे थे, रूसी विचारक के शब्द बाहरी आदेश नहीं बल्कि सत्याग्रह के उनके अपने नैतिक अन्वेषण की गहरी प्रतिध्वनि थे।',
    ],
    vocabulary: [
      { word: 'стойкость', stressed: 'сто́йкость', english: 'fortitude / steadfastness', hindi: 'दृढ़ता' },
      { word: 'искания', stressed: 'иска́ния', english: 'intellectual/spiritual quests', hindi: 'अन्वेषण / खोज' },
    ],
    expressions: [{ russian: 'служи́ть подтвержде́нием', english: 'to serve as confirmation of (+ Gen.)', usage: 'C1 philosophical register' }],
    grammarNotes: ['Notice the instrumental predicative after послужить: «послужила не внешним авторитетом, а подтверждением».'],
    comprehensionQuestions: [
      {
        id: 'rq-c1-1',
        type: 'multiple-choice',
        prompt: 'According to the essay, how did Tolstoy’s ideas function in Gandhi’s practice?',
        options: [
          'As a deep ethical resonance affirming Gandhi’s own philosophy of Satyagraha',
          'Merely as a grammar manual',
          'Through political treaties',
          'As a military strategy',
        ],
        correctAnswer: 'As a deep ethical resonance affirming Gandhi’s own philosophy of Satyagraha',
        explanation: 'The text states Tolstoy’s ideas served as deep confirmation of his ethical search of Satyagraha.',
      },
    ],
  },
  {
    id: 'read-c2-turgenev',
    levelId: 'c2',
    title: 'Ivan Turgenev: "The Russian Language" (Русский язык)',
    titleRu: 'И. С. Турге́нев — «Ру́сский язы́к» (Стихотворение в прозе, 1882)',
    author: 'Ivan Sergeyevich Turgenev',
    source: 'Стихотворения в прозе (Public Domain, 1882)',
    licenseNote: 'Public domain (published 1882)',
    genre: 'Prose Poem (C2 Classic)',
    estimatedMinutes: 5,
    textRu: [
      'Во дни́ сомне́ний, во дни́ тя́гостных разду́мий о судьба́х мое́й ро́дины, — ты оди́н мне подде́ржка и опо́ра, о вели́кий, могу́чий, правди́вый и свобо́дный ру́сский язы́к!',
      'Не бу́дь тебя́ — ка́к не впасть в отча́яние при ви́де всего́, что соверша́ется до́ма? Но нельзя́ ве́рить, что́бы тако́й язы́к не́ был дан вели́кому наро́ду!',
    ],
    textEn: [
      'In days of doubt, in days of painful reflection on the fate of my homeland — you alone are my support and mainstay, O great, mighty, truthful, and free Russian language!',
      'Were it not for you — how could one not fall into despair at the sight of all that transpires at home? Yet one cannot believe that such a language was not given to a great people!',
    ],
    textHi: [
      'संदेह के दिनों में, अपनी मातृभूमि के भाग्य पर पीड़ादायक चिंतन के दिनों में — हे महान, शक्तिशाली, सत्यनिष्ठ और स्वतंत्र रूसी भाषा, केवल तुम्ही मेरा सहारा और आधार हो!',
      'यदि तुम न होतीं — तो घर में जो कुछ घटित हो रहा है उसे देखकर निराशा में कैसे न डूबा जाए? परंतु यह विश्वास करना असंभव है कि ऐसी भाषा किसी महान जन को न दी गई हो!',
    ],
    vocabulary: [
      { word: 'тягостный', stressed: 'тя́гостный', english: 'grievous / heavy / painful', hindi: 'पीड़ादायक / भारी' },
      { word: 'опора', stressed: 'опо́ра', english: 'mainstay / pillar of support', hindi: 'आधार / संबल' },
    ],
    expressions: [{ russian: 'не будь тебя', english: 'were it not for you (archaic/literary conditional imperative)', usage: 'Classic C2 rhetorical structure' }],
    grammarNotes: [
      '«Во дни» (with extra vowel о in archaic elevated style) replaces simple «в дни».',
      'Notice «не будь тебя» = conditional imperative equivalent to «если бы не было тебя».',
    ],
    comprehensionQuestions: [
      {
        id: 'rq-c2-1',
        type: 'multiple-choice',
        prompt: 'What grammatical structure is «Не будь тебя» in Turgenev’s famous prose poem?',
        options: [
          'A literary conditional expressed through a negated imperative',
          'A standard future tense',
          'A plural noun',
          'A present continuous form',
        ],
        correctAnswer: 'A literary conditional expressed through a negated imperative',
        explanation: 'Negated imperative + Genitive acts as an elevated unreal condition ("If you did not exist / Were it not for you").',
      },
    ],
  },
];
