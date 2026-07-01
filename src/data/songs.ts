import type { Song } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ПЕСЬНІ / SONGS
 * ─────────────────────────────────────────────────────────────────────────
 *  Масіў — у храналагічным парадку (1 = самая старая). На старонцы трэкі
 *  паказваюцца ад навейшых да старэйшых (разварот робіцца ў App.tsx).
 *  The array is chronological (1 = oldest); the page shows newest-first
 *  (reversed in App.tsx). Append new songs here with the next id.
 *
 *  Як запоўніць карткі / How to fill a card — дадайце поля ў `overrides`:
 *
 *      song(7, 'kupala', 'Купала', 'Kupala', 'jpg', '7. Setivir - Kupala.mp3', {
 *        date: 'Сакавік 2025 / March 2025',
 *        model: 'Suno v4',
 *        lyricsAuthor: { be: 'Янка Купала', en: 'Yanka Kupala' },
 *        // Blank lines split the description into justified paragraphs.
 *        description: { be: 'Апісаньне.\n\nГісторыя.', en: 'Description.\n\nStory.' },
 *        // `en` lyrics are a translation with the approximate meaning of the original.
 *        lyrics:      { be: '…', en: '…' },
 *        stylePrompt:  'ethnic belarusian folk, female vocal, …',
 *        lyricsPrompt: '…',
 *      }),
 *
 *  Палі ў квадратных дужках [...] паказваюцца як «трэба дадаць» і не зьяўляюцца
 *  рэальнымі данымі. Fields in [square brackets] render as "to-do" placeholders.
 * ─────────────────────────────────────────────────────────────────────────
 */

function song(
  id: number,
  slug: string,
  titleBe: string,
  titleEn: string,
  ext: 'jpg' | 'png',
  audioFile: string,
  overrides: Partial<Song> = {},
): Song {
  return {
    id,
    slug,
    title: { be: titleBe, en: titleEn },
    audio: `songs/${audioFile}`,
    cover: `thumbnails/${id}.${ext}`,
    date: '[дата]',
    model: 'Suno',
    lyricsAuthor: { be: '[аўтар тэксту]', en: '[lyrics author]' },
    description: {
      be: '[Апісаньне — дадаць з Instagram]',
      en: '[Description — add from Instagram]',
    },
    lyrics: {
      be: '[Тэкст песьні — дадаць]',
      en: '[Lyrics — add a meaning-approximate translation]',
    },
    stylePrompt: '[промпт стылю / style prompt]',
    lyricsPrompt: '[промпт тэксту / lyrics prompt]',
    ...overrides,
  }
}

export const songs: Song[] = [
  song(1, 'rodny-flou', 'Родны Флоў', 'Rodny Fłoŭ', 'jpg', '1. Setivir - Rodny Flou.mp3', {
    date: '17/08/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Аляксей Картыннік', en: 'Aliaksei Kartynnik' },
    description: {
      be: `Гэты трэк — ода-заклік да беларускай ідэнтычнасьці, што спалучае хвацкі рэп-флоў з адсылкамі да паэтаў, сьвятых і паўстанцаў, каб прасачыць жывую повязь ад фальклору да сучаснасьці.

Першапачаткова трэк павінен быў стаць дыялогам паміж беларускамоўным і расейскамоўным беларусамі, але ідэя трансфармавалася ў выніковы трэк.`,
      en: `This track is a rallying ode to Belarusian identity, fusing a hard-hitting rap flow with references to poets, saints, and rebels to trace a living lineage from folklore to the present.

Initially the track was meant to be a dialogue between a Belarusian-speaking and a Russian-speaking Belarusian, but the idea transformed into the final track.`,
    },
    lyrics: {
      be: `
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вякоў.
Чуеш нашу мову? То ж надта стылёва.
Ды гэта скарб, які не страцім ні пры якіх умовах.

[Куплет]
За гонар, за праўду, за кут, што нам так мілы,
Забыць які даўно не маем мы ніякай сілы.
Купала ды Колас даўно цякуць у нашых венах,
Таму не знікне наш дух галактычных памераў.

Паслухай, хлопча, разумею я боль твой,
Маўляў, не трэба табе лезці ў гэта цалкам з галавой.
Можаш пусціць каханне дымам, занядбаць мінулы шлях,
Але ж каб любіць Радзіму — трэба сеч у каранях.

Трэба ведаць, хто такія Караткевіч, Крапіва,
Радзівіл, Скарына, Вітаўт, Еўфрасіння Полацка,
Рагвалод ды Рагнеда, як Уладзімір з ёю спаў,
І чаму за сваю маці ўступіўся Ізяслаў.

[Прыпеў]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вякоў.
Чуеш нашу мову? То ж надта стылёва.
Ды гэта скарб, які не страцім ні пры якіх умовах.

[Куплет]
Ну, а зараз пагаворым пра сучаснае мастацтва,
Пра якое, пэўна, чуў ты, бо сядзеў на ім з юнацтва.
Паважаеш, верагодна, рэп-матывы Макса Каржа,
А ці ведаў, што пачаў ён з андэграўнду Лунінца?

Ён чытаў тады на мове, вельмі гэтым ганарыўся,
З бел-чырвона-белым сцягам выкшталцона весяліўся.
І калісьці не цураўся беларускасці ані,
Калі пачуе гэта — хай узгадае карані.

Ды цяпер, я спадзяюся, зразумеў ты мой дакор:
Хто такія беларусы і чаму пахне чабор,
Хто такія NRM, Башлыкевіч, Хадановіч,
Пра што пішуць у сваіх творах стары новы Марціновіч.

Дзе знаходзіцца той вырай, што няма больш ні ў кога.
Што за жоўценькі пясочак і куды вядзе дарога.
"Гвалт" і "Сьвінні" ад Чарнухі — гэта наша рэчаіснасць,
Добра свету Філіпенка распавёў пра нашу існасць.

[Прыпеў]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вякоў.
Чуеш нашу мову? То ж надта стылёва.
Ды гэта скарб, які не страцім ні пры якіх умовах.

[Куплет]
Да гісторыі шляхі нам наша мова адкрывае,
Дый магутнага дуба з малым карэннем не бывае.
Узгадай, як нашы продкі баранілі свой парог,
Праз пакуты здабылі белы сцяг перамог.

Як на сцягу апынулася чырвоная кроў,
І ён чаму дасіх палохае тутэйшых князёў.
Вось калі ты прачытаеш пра гэта словам родным,
Зразумееш, што такое звацца беларусам годным.`,
      en: `[Verse]
Hey, listen — this is your native flow,
Haven’t you forgotten it, from forefathers since time immemorial?
Do you hear our language? That’s truly stylish.
And it’s a treasure we won’t lose under any circumstances.

For honor, for truth, for the nook that is so dear to us,
Which we’ve long had no power to forget.
Kupala and Kolas have long flowed in our veins,
So our spirit of galactic size will not vanish.

Listen, boy, I understand your pain —
You say you shouldn’t dive into this headfirst.
You may let love go up in smoke, neglect the path behind,
But to love the Motherland — you must get down to the roots.

You must know who Karatkevich and Krapiva are,
Radziwill, Skaryna, Vytautas, Euphrosyne of Polotsk,
Rogvolod and Rogneda, how Vladimir lay with her,
And why Iziaslav stood up for his mother.

[Chorus]
Hey, listen — this is your native flow,
Haven’t you forgotten it, from forefathers since time immemorial?
Do you hear our language? That’s truly stylish.
And it’s a treasure we won’t lose under any circumstances.

[Verse]
And now let’s talk about contemporary art,
Which you surely know — you’ve been steeped in it since youth.
You probably respect Max Korzh’s rap motifs,
But did you know he started from the Luninets underground?

Back then he rapped in the language and was proud of it,
With the white-red-white flag he celebrated in style.
And once he didn’t shy away from Belarusian-ness at all —
If he hears this, let him remember the roots.

And now, I hope, you’ve understood my reproach:
Who Belarusians are and why thyme smells,
Who NRM, Bashlykevich, Khadanovich are,
What the old-new Martynovich writes about in his works.

Where that Vyraj is — the one no one else has;
What that yellow little sand is and where the road leads.
“Gvalt” (“Violence”) and “S’vinni” (“Pigs”) by Charnukha — that’s our reality;
Filipenko has told the world well about our very essence.

[Chorus]

[Bridge]
Our language opens the roads to history for us,
And a mighty oak cannot have small roots.
Recall how our ancestors defended their threshold,
Through suffering they gained the white flag of victories.

How red blood appeared upon the flag,
And why to this day it frightens the local princes.
Once you read of this in the native word,
You’ll grasp what it is to be called a worthy Belarusian.

[Chorus x 2]`,
    },
    stylePrompt:
      'A Belarusian rap track features rapid-fire verses over dark, moody synths and punchy 808s, grounded by folk-inspired melodies sampled from traditional Belarusian instruments, The chorus layers melodic hooks and vocal harmonies, while bridging sections use sparse beats and atmospheric pads',
    lyricsPrompt: `[Куплет 1]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прАдзедаў спакон вяк-о-оў.
Чуеш нашу мову? Тож надта стылёва,
Ды гэта скарб, які не страцім ні пры якІх умовах.

За гонар, за праўду, за кут што нам так мілы,
Забыць які даўно не маем мы ніякай сілы.
Купала ды Колас даўно цякуць у нашых венах,
Таму не знікне наш дух галактычных памЕраў.

Паслухай хлопча, разумею я боль твой,
Маўляў ня трэба табе лезці ў гэта цалкам з галавой.
Можаш пусціць каханне дымам, занядбаць мінулы шлях.
Але ж каб любІць радзІму трэба сеч у каранях,

Трэба ведаць хто такіе Караткевіч Крапіва
Радзівіл, Скарына, ВІтаўт, Еўфрасіня ПОлацка.
Рагвалода ды РагнЕду, як УладзІмір з ёю спаў
І чаму за сваю маці ўступіўся ІзяслАў

[Прыпеў]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вяк-о-оў.
Чуеш нашу мову? Тож надта стылёва,
Ды гэта скарб, які не страцім ні пры якіх умовах.

[Куплет 2]
Ну а зараз пагаворым пра сучаснае мастацтва,
Пра якое пэўна чуў ты бо сядзеў на ім з юнацтва
Паважаеш верагодна рэпматывы Макс КаржА,
А ці ведаў што пачаў ён з андэграўду ЛунінцА.

Ён чытаў тады на мове вельмі гэтым ганарыўся
З белчырвона белым сцягам выкшталцона весяліўся
І калісці не цураўся беларускасці анІІ
Калі пачУе гэта - хай узгадае каранІ.

Ды цяпер я спадяюся зразумЕў ты мой дакор.
Хто такія беларусы і чаму пахне чабор
Хто такія NRM, Башлыкевіч, Хадановіч,
Пра што пішуць ў сваіх творах стары новы Марціновіч.

Дзе знаходзіцца той вырай, што няма больш ні ў кога.
Што за жоўценькі пясочак і куды вядзе дарога.
Гвалт і Сьвінні ад Чарнухі гэта наша рэчаіснасць,
Добра сьвету Філіпенка распавёў пра нашу існасць

[Прыпеў]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вяк-о-оў.
Чуеш нашу мову? Тож надта стылёва,
Ды гэта скарб, які не страцім ні пры якіх умовах.

[Биф]
Да гісторыі шляхі нам наша мова адкрывае
Дый магУтнага дубА з малым карэннем не бывае
Узгадай як нашы продкі баранілі свой парог
Праз пакуты здабылі белы сцяг перамог

Як на сцягу тым апынУлася чырвОная кроў
І ён чаму дасіх палохае тутыэйшых Князёў
Вось калі ты прачытаеш пра ўсё гэта словам родным
Зразумеш што такое звацца  беларусам ходным.

[Фінал]
Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вяк-о-оў.
Чуеш нашу мову? Тож надта стылёва,
Ды гэта скарб, які не страцім ні пры якіх умовах.

Гэй, паслухай, гэта твой родны флоў,
Ці не забыўся ты яго, ад прадзедаў спакон вяк-о-оў.
Чуеш нашу мову? Тож надта стылёва,
Ды гэта скарб, які не страцім ні пры якіх умовах. `,
  }),
  song(2, 'muzhyk-belarus', 'Мужык-Беларус', 'Muzjik-Belarus', 'png', '2. Setivir - Muzjik-Belarus.mp3'),
  song(3, 'laceli', 'Ляцелі', 'Laceli', 'jpg', '3. Setivir - Laceli.mp3'),
  song(4, 'rano-rano', 'Рана-рана', 'Rano-rano', 'jpg', '4. Setivir - Rano-rano.mp3'),
  song(5, 'bau-bai', 'Баю-бай', 'Bau-bai', 'jpg', '5. Setivir - Bau-bai.mp3'),
  song(6, 'kalykhanka', 'Калыханка', 'Kalykhanka', 'jpg', '6. Setivir - Kalykhanka.mp3'),
  song(7, 'kupala', 'Купала', 'Kupala', 'jpg', '7. Setivir - Kupala.mp3'),
  song(8, 'to-to-to', 'То-то-то', 'To-to-to', 'jpg', '8. Setivir - To-to-to.mp3'),
  song(9, 'bitaya', 'Бітая', 'Bitaya', 'jpg', '9. Setivir - Bitaya.mp3'),
  // ⚠ exact filename contains a Cyrillic "с" in "noс"
  song(10, 'cichaja-noc', 'Ціхая ноч', 'Cichaja noč', 'jpg', '10. Setivir - Cichaja noс.mp3'),
  song(11, 'khto-ya', 'Хто я', 'Khto ya', 'jpg', '11. Setivir - Khto ya.mp3'),
  song(12, 'dzed-baradzed', 'Дзед-барадзед', 'Dzed-baradzed', 'jpg', '12. Setivir - Dzed-baradzed.mp3'),
  // ⚠ праверце пераклад назвы / verify title
  song(13, 'zviaz-piarscionka', 'Зьвяз пярсьцёнка', 'Zviaz piarscionka', 'jpg', '13. Setivir - Zviaz piarscionka.mp3'),
  // ⚠ ёсьць дублікат "14. Dvaccaty.mp3" — выкарыстоўваецца новы файл
  song(14, 'dvaccaty', 'Дваццаты', 'Dvaccaty', 'jpg', '14. Setivir - Dvaccaty.mp3', {
    date: '22/03/2026',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Наста Кудасава', en: 'Nasta Kudasava' },
    description: {
      be: `Песня «Дваццаты» — гэта сустрэча музыкі і шчымлівага слова выдатнай беларускай паэткі Насты Кудасавай. Яе вершы — гэта заўсёды глыбокае падарожжа ў свет пачуццяў, дзе кожны радок адгукаецца рэхам у душы. Наста — адзін з самых пранікнёных галасоў сучаснай беларускай літаратуры. Яе творчы шлях адзначаны знакавымі зборнікамі, якія сталі сапраўднымі падзеямі для чытачоў: «Лісце маіх рук» (2006), «Рыбы» (2013), «Маё невымаўля» (2016), «Вясна. Вуснам цесна» (2021), «Побач» (2022), «Я працягваю» (2023). Творы Насты перакладзеныя на ўкраінскую, англійскую, польскую, чэшскую і балгарскую мовы.`,
      en: `The song "Dvaccaty" (The Twentieth) is a soulful encounter between music and the poignant words of the outstanding Belarusian poet Nasta Kudasava. Her poetry is a profound journey into the world of emotions, where every line resonates like an echo in the soul. Nasta is one of the most penetrating voices in contemporary Belarusian literature. Her creative path is marked by landmark collections that have become significant events for readers: "Leaves of my hands" (2006), "Fishes" (2013), "My nievymaŭlja" (2016), "Spring. The mouth is tight" (2021), "Nearby", (2022), "I’m continuing", (2023). Nasta's works have been translated into Ukrainian, English, Polish, Czech, and Bulgarian, reaching hearts across borders.

Contextual Notes for International Readers:
- "Thirty-seven" (1937) and the Night of the Executed Poets: While 1937 was the peak of the Great Purge across the USSR, in Belarus, it holds a specific, agonizing meaning. On the night of October 29–30, 1937, the Soviet secret police (NKVD) executed more than 100 representatives of the Belarusian intellectual elite — poets, writers, scientists, and public figures — in a single night. This "Night of the Executed Poets" was an attempt to decapitate the Belarusian nation. By mentioning "37," the poem speaks of a historical trauma that was never fully healed or even publicly mourned for decades.

- Kurapaty: A wooded area on the outskirts of Minsk where the Soviet secret police (NKVD) executed and buried tens of thousands of people between 1937 and 1941. In modern Belarus, it is a symbol of suppressed memory and state terror. The "howling of Kurapaty" refers to the uneasy conscience of a society trying to ignore its bloody past.

- Twenty (2020): Refers to the year 2020 in Belarus, when peaceful protests against election fraud were met with unprecedented violence, mass arrests, and torture. The poem suggests that because the crimes of 1937 were never fully reckoned with, they "knocked again" in 2020.`,
    },
    lyrics: {
      be: `мы любілі замкнуцца дома,
каб не чуць выццё Курапатаў.
мы не верылі ў трыццаць сёмы –
і да нас пагрукаў дваццаты.
гэта вусціш сапрэлым лісцем
набіваецца ў торбы целаў.
я б хацела прачнуцца, выйсці,
выплыць, вылецець я б хацела…
мы не верылі ў трыццаць сёмы,
не глядзелі ў твар Курапатам,
мы, стаіўшыся, спалі дома –
і да нас пагрукаў дваццаты.`,
      en: `We loved to lock ourselves at home,
so as not to hear the howling of Kurapaty.
We didn't believe in thirty-seven —
and then twenty knocked at our door.

This horror, like rotted leaves,
is stuffed into the sacks of our bodies.
I would like to wake up, to step out,
to swim out, to fly away, I’d like to...

We didn't believe in thirty-seven,
never looked Kurapaty in the eye,
we lay low and slept at home —
and then twenty knocked at our door.`,
    },
    stylePrompt:
      'dark neo-folk, acoustic post-punk, mournful cello, raw intimate female vocal, minimalist, belarusian underground, somber, haunting whisper, growing despair, cold acoustic guitar',
    lyricsPrompt: `[Intro: Huge cinematic ambient, distant echoing ethno wailing, solitary acoustic guitar]
(Ммм... ааа...)
(Рэха ў пустэчы...)

[Verse 1: Deep ambient space, intimate vocal]
Мы любілі замкнуцца дома,
Каб не чуць выццё Курапатаў.
Мы не верылі ў трыццаць сёмы,
Мы не верылі ў трыццаць сёмы...

[Pre-Chorus: Epic orchestral build-up, sweeping strings, huge drums rising]
І да нас...
І да нас...
І да нас пагрукаў дваццаты!

[Chorus: Massive cinematic tension]
Гэта вусьціш сапрэлым лісьцем
Набіваецца ў торбы целаў.
Я б хацела прачнуцца, выйсьці...
Я б хацела...

[Drop: Massive cinematic dubstep drop, heavy dark bass meets epic orchestral brass and ethno shouts]
(Выплыць, вылецець!)
Я б хацела!
(Выплыць, вылецець я б хацела...)

[Verse 2: Dark ambient breakdown, echoing vocals, soft acoustic guitar only]
Мы ня верылі ў трыццаць сёмы,
Не глядзелі ў твар Курапатам.
Мы, стаіўшыся, спалі дома...
Мы стаіўшыся спалі.

[Pre-Chorus: Huge cinematic choir, epic drums building up to a climax]
І да нас...
І да нас...
І да нас пагрукаў дваццаты!

[Chorus]
Гэта вусьціш сапрэлым лісьцем
Набіваецца ў торбы целаў.
Я б хацела прачнуцца, выйсьці...
Выплыць, вылецець я б хацела!

[Drop: Ultimate epic drop, explosive dubstep bass with massive atmospheric choirs]
(Дваццаты!)
(Прачнуцца, выйсьці...)

[Outro: Epic fading ambient, lingering acoustic guitar, haunting echoes in deep space]
Мы любілі замкнуцца дома...
Але да нас пагрукаў дваццаты...
(выплыць... вылецець...)
[End]`,
  }),
  song(15, 'a-chto-tam-idzie', 'А хто там ідзе', 'A chto tam idzie?', 'jpg', '15. Setivir - A chto tam idzie.mp3', {
    date: '29/05/2026',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Янка Купала', en: 'Yanka Kupala' },
    description: {
      be: `Гэтая песня пераасэнсоўвае культавы верш Янкі Купалы «А хто там ідзе?» як жорсткую лічбавую атаку, дзе цяжар гістарычнай крыўды ўзмацняецца жорсткім басам і агрэсіўнымі электрарытмамі. Трэк даступны на ўсіх аўдыё-пляцоўках.`,
      en: `This song reinterprets Yanka Kupala’s iconic poem “A chto tam idzie” as a brutal digital attack, where the weight of historical grievance is amplified by distorted bass and aggressive electro rhythms. Track available on all streaming platforms.`,
    },
    lyrics: {
      be: `А хто там, а хто там у агромністай такой грамадзе?
— Беларусы.
— Беларусы.

А што яны нясуць на худых плячах,
На руках у крыві, на нагах у лапцях?
— Сваю крыўду.
— Сваю крыўду.

А куды ж нясуць гэту крыўду ўсю,
А куды ж нясуць на паказ сваю?
— На свет цэлы!
— На свет цэлы!

А хто гэта іх, не адзін мільён,
Крыўду несці навучыў, разбудзіў іх сон?!
— Бяда, гора.
Глухім?

— Людзьмі звацца!
— Людзьмі звацца!
— Людзьмі звацца!

Беларусы...
Сваю крыўду...`,
      en: `And who goes there, and who goes there,
In such a vast and massive throng?
— Belarusians.

And what do they carry on their thin shoulders,
In their bloodied hands, on their feet in bast shoes?
— Their grievance.

And where are they carrying all this grievance,
And where are they carrying it to show it to the world?
— To the whole world.

And who was it that taught them, millions of them,
To bear this grievance, who woke them from their sleep?
— Misery and sorrow.

And what is it, what is it they have come to desire,
They, despised for ages, they, the blind and the deaf?
— To be called human.`,
    },
    stylePrompt:
      'Hard Dark Old-school Dubstep, Electro Minimal fusion, 140 BPM, Gritty distorted sub-bass growls, sparse clinical percussion, glitchy minimal pulses, Heavy weighted basslines, mechanical atmosphere, raw industrial textures, deep sub-frequency, sharp metallic transients, aggressive but minimalist',
    lyricsPrompt: `[Genre: Dark Deep Dubstep, Heavy Sub-Bass, Slow Industrial Beats, Powerful Saw Bass, Atmospheric, 140 BPM, Deep Cinematic Vocals]

[Intro: Low-end vibration, sparse metallic clinks, distant wind]

[Verse 1]
А хто там , а хто там У агромністай такой грамадьзе?
— Беларусы.
— Беларусы.

[Verse 2]
А што яны нясуть на худых пляczах,
На руках ў крыві, на нагах у лаптях?
— Сваю крыўду.
— Сваю крыўду.

[Build-up: Rising distorted saw wave, rhythmic pulse intensifies]
А куды ж нясуть гэту крыўду ўсю,
А куды ж нясуть на паказ сваю?
— НА СЬВЕТ ЦЭЛЫ!
— НА СЬВЕТ ЦЭЛЫ!

[Drop: Massive Deep Bass, Heavy Saw Drop, Slow Crushing Rhythm]
а хто гэта іх, не адьзін міліён,
крыўду несьті навуczыў, разбудьзіў іх сон?!
— БЯДА!
хора

хлухім?

[Climax Drop: Brutal Hard Dubstep, Aggressive Saw Snarls, Maximum Impact]
— людьзьмі звацца!
— людьзьмі звацца!
— людьзьмі звацца!

[Outro: Fading industrial resonance, deep heartbeat pulse]
Беларусы...
Сваю крыўду...

[End]`,
  }),
  song(16, 'veczar-toj', 'Вечар той', 'Veczar Toj', 'jpg', '17. Setivir - Veczar Toj.mp3', {
    date: '29/05/2026',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `«Калі каліна не цьвіла» — арыгінал з такой назвай зьяўляецца беларускай народнай песьняй пра каханьне, разьвітаньне і памяць.

Viečar toj — гэта яе сучасная адаптацыя ў прасторы melodic dubstep / future garage: сумная і цяжкая электронная балада пра хлопца і дзяўчыну, пра вечар, які не адпускае, і сэрца, што «то млела, то балела».
У мястэчку Ракаў гэтую песьню традыцыйна сьпявалі ад імя хлопца — і менавіта гэты мужчынскі погляд на страчаную любоў стаў эмацыйным цэнтрам трэка.`,
      en: `“Kali kalina ne cvila” (“When the Guelder-Rose Did Not Bloom”) — the original bearing this title is a Belarusian folk song about love, parting, and memory.

“Viečar toj” is its modern adaptation in the space of melodic dubstep / future garage: a sad and heavy electronic ballad about a boy and a girl, about an evening that will not let go, and a heart that “now languished, now ached.”
In the town of Rakaŭ, this song was traditionally sung from the boy’s point of view — and it is precisely this male perspective on lost love that became the emotional heart of the track.`,
    },
    lyrics: {
      be: `Калі каліна не цвіце,
То не ламай каліну.
Калі ты ў арміі не быў,
То не кахай дзяўчыну.
Я памятаю вечар той, як ты была са мною,
На развітанне раз у раз махала хусцінаю.

Махала хусцінаю...
Махала хусцінаю...
Я памятаю вечар той!

Я памятаю вечар той, як ты была са мною,
На развітанне раз у раз махала хусцінаю!
Я памятаю вечар той, як ты была са мною,
На развітанне раз у раз махала хусціною!

Прыйшоў да мяне Васілёк
І сеў каля краваці:
«Бывай, дзяўчыначка, бывай,
Бо я іду ў салдаты».

Бо я іду...
Бо я іду ў салдаты!

Я памятаю вечар той, як ты была са мною,
На развітанне раз у раз махала хусціною!
Я памятаю вечар той, як ты была са мною,
На развітанне раз у раз махала хусціною!

Калі я ў армію ішоў,
То ты была дзяўчына.
Калі я з арміі прыйшоў —
Ты калыхала сына.
Я памятаю вечар той, калі сяло гарэла,
А маё сэрца па табе то млела, то балела.

То млела... то балела...
Сяло гарэла...`,
      en: `If the guelder-rose (kalina) does not bloom,
Then do not break the guelder-rose.
If you have not been in the army,
Then do not love a girl.
I remember that evening when you were with me,
In farewell, time after time, you waved your kerchief.

Waved your kerchief...
Waved your kerchief...
I remember that evening!

I remember that evening when you were with me,
In farewell, time after time, you waved your kerchief!
I remember that evening when you were with me,
In farewell, time after time, you waved your kerchief!

Vasilyok came to me
And sat down by the bed:
"Goodbye, dear girl, goodbye,
For I am going to be a soldier."

For I am going...
For I am going to be a soldier!

I remember that evening when you were with me,
In farewell, time after time, you waved your kerchief!
I remember that evening when you were with me,
In farewell, time after time, you waved your kerchief!

When I went to the army,
You were an unmarried girl.
When I returned from the army —
You were rocking a son.
I remember that evening when the village was burning,
And my heart for you now languished, now ached.

Now languished... now ached...
The village was burning...`,
    },
    stylePrompt:
      'Melodic Lyrical Dubstep, Future Garage influences, 140 BPM, deep powerful sub-bass, massive emotional drops, melancholic piano chords, poignant strings, sparse atmospheric percussion, haunting vocal chops, heavy but tragic basslines, cinematic sad atmosphere, warm analogue textures, deep sub-frequencies, melancholic but heavy and powerful, Sad Belarusian language vocals',
    lyricsPrompt: `[Intro: Dark Atmospheric, Glitchy Vocals, Slow Buildup]
(Vocal chop: Калі... калі... калі...)

[Verse 1]
Калі каліна не цьвіте
То не ламай каліну
Калі ты ў арміі ня быў
То не кахай дьзяўczыну
Я памятаю веczар той, як ты была са мною
На разьвітанне раз у раз махала хусьтіною

[Pre-Chorus: Rising Tension, Fast Drum Roll]
Махала хусьтіною...
Махала хусьтіною...
Я памятаю веczар той!

[Chorus]
Я памятаю веczар той, як ты была са мною
На разьвітанне раз у раз махала хусьтіною!
Я памятаю веczар той, як ты была са мною
На разьвітанне раз у раз махала хусьтіною!

[Drop: Heavy Dubstep, Aggressive Wobble Bass, Growls]
(Wub-wub-wub-wub! Bass drop!)

[Verse 2: Half-time beat]
Прыйшоў да мяне Васілёк
І сеў каля краваті
Бывай дьзяўczынаczка бывай
Бо я іду ў салдаты

[Bridge: Glitchy, Distorted Vocals]
Бо я іду...
Бо я іду ў салдаты!
(Bass growl)

[Chorus: High Energy]
Я памятаю веczар той, як ты была са мною
На раьзвітанне раз у раз махала хусьтіною!
Я памятаю веczар той, як ты была са мною
На разьвітанне раз у раз махала хусьтіною!

[Drop: Melodic Dubstep Drop, Emotional but Heavy]

[Verse 3: Dark and Sad]
Калі я ў армію ішоў
То ты была дьзяўczына
Калі я з арміі прыйшоў
Ты калыхала сына
Я памятаю веczар той, калі сяло харэла
А маё сэрца па табе , то млела, то балела

[Outro: Fade out, Glitch, Reverb]
То млела... то балела...
Сяло харэла...
(Static noise)
[End]`,
  }),
  song(17, 'belarusian-rave', 'Беларускі рэйв', 'Belarusian Rave', 'jpg', '16. Setivir - Belarusian rave.mp3', {
    date: '25/04/2026',
    model: 'Suno v5.5',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    lyrics: {
      be: `Бацька едзе па лучыну
А сын едзе па дзяўчыну
Бацька едзе з лучынаю
А сын едзе з дзяўчынаю

Пытаецца бацька ў сына
Што каштуе та дзяўчына

Што каштуе — трэба даць
Гаспадыня будзе ў хаце!

Людзі маюць што казаць
Я маю каго кахаць
Людзі маюць, што рабіць
А я маю і з кім жыць

Бацька едзе па лучыну...`,
      en: `Father rides for kindling wood,
And the son rides for a girl.
Father rides with the kindling,
And the son rides with the girl.

The father asks the son:
"What does that girl cost?"

Whatever she costs — we must give it,
A mistress of the house will be at home!

People have things to say,
But I have someone to love.
People have things to do,
And I have someone to live with.

Father rides for kindling wood...`,
    },
    stylePrompt:
      'dark techno, industrial minimal, 132 BPM, syncopated kick pattern, off-grid percussion, driving bassline, distorted sub-bass, metallic synth stabs, resonant acid line, raw male vocals, Belarusian chant cadence, call-and-response refrain, tape saturation, plate reverb, stereo delay, bleak winter mood, ritual defiance, minimal dubstep drops',
    lyricsPrompt: `[Verse 1]
Батька едьзе па луczыну
А сын едьзе па дьзяўчыну
Батька едьзе з лучыною
А сын едьзе з дьзяўчыною

[Pre-Chorus: Fast rhythmic percussion, rising electronic tension]
Пытаецца батька ў сына
Што каштуе та дзяўчына

[Drop: Heavy Dubstep Bass]
Што каштуе – трэба даті
Гаспадыня будзе ў хате!

[Verse 2: Hard electronic beat]
Людзі маюць што казаті
Я маю каго кахаті
Людзі маюць, што рабіті
А я маю і з кім жыті

[Outro: Bass fades out]
Батька едьзе па луczыну...
[End]`,
  }),
  song(18, 'shto-kashtuje', 'Што каштуе', 'Što Kaštuje', 'jpg', '18. Setivir - Što Kaštuje.mp3', {
    date: '25/04/2026',
    model: 'Suno v5.5',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    lyrics: {
      be: `Бацька едзе па лучыну
А сын едзе па дзяўчыну
Бацька едзе з лучынаю
А сын едзе з дзяўчынаю

Пытаецца бацька ў сына
Што каштуе та дзяўчына

Што каштуе — трэба даць
Гаспадыня будзе ў хаце!

Людзі маюць што казаць
Я маю каго кахаць
Людзі маюць, што рабіць
А я маю і з кім жыць

Бацька едзе па лучыну...`,
      en: `Father rides for kindling wood,
And the son rides for a girl.
Father rides with the kindling,
And the son rides with the girl.

The father asks the son:
"What does that girl cost?"

Whatever she costs — we must give it,
A mistress of the house will be at home!

People have things to say,
But I have someone to love.
People have things to do,
And I have someone to live with.

Father rides for kindling wood...`,
    },
    stylePrompt:
      'deep dubstep, folktronic, 132 BPM, whispered ritual vocals, slow cello solo, deep sub-bass, half-time kick, sparse tom hits, resonant bathroom reverb, ceramic slap delay, tape saturation, wide stereo synths, folk vocal sampling, minor key drones, bleak cinematic, ceremonial urgency',
    lyricsPrompt: `[Verse 1]
Батька едьзе па луczыну
А сын едьзе па дьзяўчыну
Батька едьзе з лучыною
А сын едьзе з дьзяўчыною

[Pre-Chorus: Fast rhythmic percussion, rising electronic tension]
Пытаецца батька ў сына
Што каштуе та дзяўчына
Што каштуе та дзяўчына!

[Drop: Heavy Dubstep Bass]
Што каштуе – трэба даті
Гаспадыня будзе ў хате!
Што каштуе – трэба даті
Гаспадыня будзе ў хате!

[Verse 2: Hard electronic beat]
Людзі маюць што казаті
Я маю каго кахаті
Людзі маюць, што рабіті
А я маю і з кім жыті

[Bridge: Half-time beat, heavy wobble bass, atmospheric]
Людзі маюць што казаці
Людзі маюць што казаці
Я маю каго кахаці!

[Chorus: Intense Dubstep Drop, Layered Vocals]
Што каштуе – трэба даті
Гаспадыня будзе ў хате!
Што каштуе – трэба даті
Гаспадыня будзе ў хате!
А я маю і з кім жыті!

[Outro: Bass fades out]
Батька едьзе...
Сын едьзе...
[End]`,
  }),
  song(19, 'mova-maci', 'Мова-Маці', 'Mova-Maci', 'png', '20. Setivir - Mova-Maci.mp3', {
    date: '04/06/2026',
    model: 'Suno v5.5',
    lyricsAuthor: { be: 'Рыгор Барадулін', en: 'Ryhor Baradulin' },
    description: {
      be: `«Мова-Маці» — музычная адаптацыя верша Рыгора Барадуліна, які паэт адмыслова напісаў да адкрыцьця курсаў беларускай мовы «Мова Нанова».

Шэпт. Арган. Хор. Саб-бас. Дабстэп-дроп. Драм-н-бэйсавая энэргія. Беларускае слова тут гучыць як рытуал у кібэркатэдры — сьвята, моцна і жывое. Гэта не пяшчотная настальгія, а вяртаньне з поўнай гучнасьцю. Немінуча. Гаюча. Нанова.`,
      en: `“Mova-Mači” is a musical adaptation of a poem by Ryhor Baradulin, which the poet wrote especially for the opening of the “Mova Nanova” Belarusian language courses.

A whisper. An organ. A choir. Sub-bass. A dubstep drop. Drum and bass energy. Here, the Belarusian word sounds like a ritual in a cyber-cathedral — sacred, powerful, and alive. This is not gentle nostalgia, but a return at full volume. Inevitable. Healing. Anew.`,
    },
    lyrics: {
      be: `Немінуча... Гаюча... Нанова...
Раскрываецца шчырае слова.
Мова маці — Крыніца святая —
Да вытокаў намеры вяртае.

Як высокія мроі, аблокі...
Думкі неба ратуюць ад спёкі...

Мы на гэтым свеце павінны!
Гадаваць мову роднай Айчыны!
Немінуча, Гаюча, Нанова —
Раскрываецца шчырае слова!

Мы на гэтым свеце павінны!
Гадаваць мову роднай Айчыны!
Немінуча, Гаюча, Нанова —
Раскрываецца шчырае слова!

Мова маці...
Крыніца святая... Нанова...`,
      en: `Inevitably... Healingly... Anew...
The sincere word opens up wide.
Mother’s tongue — a sacred spring —
Returns intentions back to the roots.

Like high dreams, the clouds...
Thoughts rescue the sky from the heat...

On this world, we are bound!
To cherish the tongue of our Motherland!
Inevitably, healingly, anew —
The sincere word opens up wide!

On this world, we are bound!
To cherish the tongue of our Motherland!
Inevitably, healingly, anew —
The sincere word opens up wide!

Mother’s tongue...
A sacred spring... Anew...`,
    },
    stylePrompt:
      'melodic techno, cyberpunk choir, gregorian unison, whisper chants, pipe organ, sub-bass braams, pulsing synth ostinato, orchestral brass hits, dubstep drop, glitch vocal chops, cathedral reverb, sidechain pumping, half-time drums, 72 BPM, epic scale, ritual defiance',
    lyricsPrompt: `[Intro]
(Massive Hans Zimmer pipe organ, deep cosmic sub-bass)
(Distant, dark electronic ticking and ambient pads)
(Faint, mysterious whispers)

[Verse 1]
[Whisper]
(Quiet, dark whispers close to the microphone)
Немінуczа... Гаюczа... Нанова...
Раскрываецца шчы-ырае слова.
[Choir]
(Soft, low gregorian chant, low strings and pulsing synth pad)
Мова маці — Крыні-іца сьвятая —
Да вытокаў намеры вярта-ае.

[Pre-Chorus]
(Melodic techno build-up, driving electronic rhythm rising, sweeping strings)
[Whisper]
Як высокія мроі, аблокі...
[Choir]
(Choral unison growing intense, heavy synthesizer riser)
Думкі неба ратують ад сьпёкі...
(Huge electronic build-up, music stops for a microsecond)

[Chorus]
[Choir]
(EPIC BEAT DROP! Heavy dubstep-techno hybrid bassline, hard kicking electronic beat)
(Full catholic choir in powerful, majestic unison, Ameno-style energy)
Мы на гэтым сьвете павінны!
Гадавать мову роднай Айczыны!
Немінуczа, Гаюczа, Нанова —
Раскрываецца шчы-ырае слова!

[Instrumental Break]
(Glitchy electronic vocal chops, heavy dubstep growls mixed with orchestral brass)
(Driving melodic techno synth arpeggio, massive energy)

[Chorus]
[Choir]
(Maximum electronic and orchestral intensity, epic choir hits, cosmic cyberpunk scale)
Мы на гэтым сьвете павінны!
Гадавать мову роднай Айczыны!
Немінуczа, Гаюczа, Нанова —
Раскрываецца шчы-ырае сло-ова!

[Outro]
(Beat stops abruptly, music cuts to a quiet, fading pipe organ and ambient)
[Whisper]
Мова маці...
[Choir]
(Very quiet, fading chant into deep space silence)
Крыні-іца сьвята-ая... Нанова...
[Fade out]
[End]`,
  }),
  song(20, 'mova-nanova', 'Мова Нанова', 'Mova Nanova', 'png', '19. Setivir - Mova Nanova.mp3', {
    date: '05/06/2026',
    model: 'Suno v5.5',
    lyricsAuthor: { be: 'Рыгор Барадулін', en: 'Ryhor Baradulin' },
    description: {
      be: `«Мова Нанова» — музычная адаптацыя верша Рыгора Барадуліна, які паэт адмыслова напісаў да адкрыцця курсаў беларускай мовы «Мова Нанова». З часам гэты верш стаў неафіцыйным гімнам курсаў — цёплым, шчырым і вельмі пазнавальным тэкстам пра вяртаньне да роднай мовы, да сябе і да сваіх вытокаў.

У гэтай вэрсіі верш пераасэнсаваны праз цёплую, інтымную і сучасную электронную эстэтыку: dark R&B, bedroom pop, slow industrial trip-hop і павольны trap-біт. Шэпт, глыбокі саб-бас, гіпнатычныя сынты і напружаная вакальная падача робяць тэкст больш цялесным, начным і эмацыйным — нібы мова не проста гучыць, а дыхае, лечыць і раскрываецца нанова.

Гэта спроба пачуць вядомыя радкі ў іншай прасторы: паміж малітвай, пяшчотай, целам і электронным пульсам.`,
      en: `“Mova Nanova” is a musical adaptation of a poem by Ryhor Baradulin, which the poet wrote specifically for the opening of the Belarusian language courses “Mova Nanova.” Over time, this poem became the unofficial anthem of the courses — a warm, sincere, and deeply recognizable text about returning to one’s native language, to oneself, and to one’s roots.

In this version, the poem is reimagined through a warm, intimate, and modern electronic aesthetic: dark R&B, bedroom pop, slow industrial trip-hop, and a slow trap beat. Whispered vocals, deep sub-bass, hypnotic synths, and an emotionally charged vocal delivery make the text feel more physical, nocturnal, and deeply emotional — as if the language does not simply sound, but breathes, heals, and opens itself anew.

This is an attempt to hear familiar lines in a different space: somewhere between prayer, tenderness, the body, and an electronic pulse.`,
    },
    lyrics: {
      be: `Немінуча... Гаюча... Нанова...

Раскрываецца шчырае слова.
Мова маці — Крыніца святая —
Да вытокаў намеры вяртае.

Як высокія мроі, аблокі...
Думкі неба ратуюць ад спёкі...

Мы на гэтым свеце павінны!
Гадаваць мову роднай Айчыны!
Немінуча, Гаюча, Нанова —
Раскрываецца шчырае слова!

Мы на гэтым свеце павінны!
Гадаваць мову роднай Айчыны!
Немінуча, Гаюча, Нанова —
Раскрываецца шчырае слова!

Мова маці... Крыніца святая...
Мова Нанова...`,
      en: `Inevitable... Healing... Anew...

The sincere word opens up wide.
Mother’s tongue — a sacred spring —
Returns intentions back to the roots.

Like high dreams, the clouds...
Thoughts rescue the sky from the heat...

On this world, we are bound!
To cherish the tongue of our Motherland!
Inevitably, healingly, anew —
The sincere word opens up wide!

On this world, we are bound!
To cherish the tongue of our Motherland!
Inevitably, healingly, anew —
The sincere word opens up wide!

Mother’s tongue... A sacred spring...
The Tongue Anew...`,
    },
    stylePrompt:
      'Dark R&B, bedroom pop, slow industrial trip-hop, 68 BPM, sexy bedroom vocals, breathy whispering male voice, deep heavy sub-bass pulses, slow sensual trap beat, dark electronic pop, late night vibe, hypnotic synths, intimate, smooth distorted bass, cosmic erotic atmosphere',
    lyricsPrompt: `[Intro]
(Slow, hypnotic electronic synth pulse, 68 BPM)
(Very close, breathy and slow whispering, deep sub-bass warming up)
Немінуczа... Гаюча... Нанова...

[Verse 1]
[Whisper]
(Intimate, low, spoken delivery, slow ticking electronic beat)
Раскрываецца шчы-ырае слова.
Мова маці — Крыні-іца сьвятая —
Да выто-окаў намеры вярта-ае.

[Pre-Chorus]
(Sensual tension rising, heavy low-pass filter bass, breathing sounds)
Як высокія мроі, аблокі...
Думкі неба ратують ад сьпёкі...
(Music slows down, a deep breath)

[Chorus]
(SLOW SEXY DROP! Massive, smooth distorted bassline, heavy cinematic trap beat)
(Passionate, soulful male vocals, dark R&B style with deep emotional tension)
Мы на гэтым сьвете павінны!
Гадавать мову роднай Айczыны!
Немінуczа, Гаюczа, Нанова —
Раскрываецца шчы-ырае слова!

[Instrumental Break]
(Hypnotic and slow electronic synth solo, deep pulsing sub-bass, bedroom atmosphere)

[Chorus]
(Maximum sensuality, heavy and slow driving rhythm, smooth and powerful)
Мы на гэтым сьвете павінны!
Гадавать мову роднай Айczыны!
Немінуczа, Гаюczа, Нанова —
Раскрываецца шчы-ырае сло-ова!

[Outro]
(Beat fades out, leaving only a slow, warm synth pad and intimate breathing)
[Whisper]
Мова маці... Крыні-іца сьвята-ая...
Мова Нанова...
[Sub-bass fade]
[End]`,
  }),
]

/** True when a text field is still an unfilled "[…]" placeholder. */
export function isPlaceholder(text: string): boolean {
  return /^\s*\[.*\]\s*$/.test(text)
}
