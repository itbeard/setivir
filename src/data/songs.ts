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
  song(3, 'laceli', 'Ляцелі', 'Lacieli', 'jpg', '3. Setivir - Laceli.mp3', {
    date: '11/09/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `Гэтая вэрсія была запісаная ў мястэчку Ракаў (Беларусь) і абапіраецца на славянскую фальклорную вобразнасьць: гусі з далёкага краю і «ціхі Дунай» як архетыпічная памежная рака, а не літаральнае месца дзеяньня. Цёмная хмара і дробны дожджык сымбалізуюць смутак і працяглыя наступствы разьвітаньня, а «маці, якая яшчэ не ведае» намякае на таемнае заляцаньне. «Як ластаўкі ў стрэсе» перагукваецца з фальклорным вобразам ластавак пад стрэхамі — блізкасьць, што пазьней разьвейваецца «як туман у лесе». Выкананая як інтымны дуэт з чаргаваньнем жаночага і мужчынскага вакалу, яна ператвараецца ў дыялог двух закаханых, чыя повязь згасла.`,
      en: `This version was recorded in the town of Rakau (Rakaŭ), Belarus, and draws on Slavic folk imagery: geese from a distant land and the “quiet Danube” as an archetypal border-river rather than a literal setting. The dark cloud and fine drizzle symbolize sorrow and the lingering aftermath of a breakup, while “mother not yet knowing” points to secret courtship. “Like swallows in stress” echoes the folk image of swallows under the eaves—intense closeness that later disperses “like mist in the forest.” Performed as an intimate duet with alternating female and male vocals, it becomes a dialogue between two lovers whose bond has faded.`,
    },
    lyrics: {
      be: `Ой, ляцелі гусі
З далёкага краю,
Ваду замуцілі
На ціхім Дунаю.

Бадай, тыя гусі
Так марна прапалі,
Як мы любіліся
Цяпер перасталі.

А мы любіліся
Як ластаўкі ў стрэссе,
Цяпер разышліся,
Як туман па лесе.

Як мы любіліся
Шчэй мамка ня знала,
Цяпер разышліся
Як цёмная хмара.

З той цёмнае хмары
Дробны дожджык будзе,
З нашага кахання
Нічога ня будзе.

Ой, ляцелі гусі
З далёкага краю,
Ваду замуцілі
На ціхім Дунаю.`,
      en: `Oh, the geese were flying
From a faraway land,
They muddied the water
On the quiet Danube.

Would that those geese
Had perished so vainly,
As we who loved
Have now stopped loving.

And we loved
Like swallows in stress,
Now we have parted,
Like mist through the forest.

How we loved
Before mother even knew,
Now we have parted
Like a dark cloud.

From that dark cloud
There will be fine drizzle,
From our love
There will be nothing.

Oh, the geese were flying
From a faraway land,
They muddied the water
On the quiet Danube.`,
    },
    stylePrompt:
      'This Russian hip-hop rap track opens with distant industrial noises and faint vinyl crackle, laying a stark, wintry atmosphere, The beat drops—a slow, heavy kick, crisp snare, and deep, resonant sub-bass drive the rhythm, Sparse, icy synths punctuate the minimalism, weaving between restrained, monotone rap verses, their delivery cold and detached, Occasional eerie samples and distorted textures reinforce the sense of grit and despair, The arrangement remains stripped-back throughout, letting the cinematic storytelling and bleak urban feel take center stage',
    lyricsPrompt: `[Verse]
Ой, лятелі гу-усі
З да-алёкага кра-аю,
Ваду замуті-ілі
На тіхім Дуна-аю.
Ваду замуті-ілі
На тіхім Дуна-аю.
[Break]
[Bass Drop]
[Verse]
Бадай, тыя гу-усі
Та-ак марна прапа-алі,
Як мы любілі-іся
Цяпер пераста-алі,
Як мы любілі-іся
Цяпер пераста-алі.

[Verse]
А мы любілі-іся
Я-ак ластаўкі ў стрэ-эссе,
Цяпер разышлі-іся,
Як тУман па ле-есе,
Цяпер разышлі-іся,
Як тУман па ле-есе.

[Verse]
Як мы любілі-іся
Шчэй мамка ня зна-ала,
Цяпер разышлі-іся
Як цёмная хма-ара,
Цяпер разышлі-іся
Як цёмная хма-ара.

[Bass Drop]

[Bridge]
Ой, лятелі гу-усі
З да-алёкага кра-аю,
Ваду замуті-ілі
На тіхім Дуна-аю.

[Verse]
З той цёмнае хма-ары
Дро-обны дожджык бу-удзе,
З нашАга каха-ання
Нічога ня бу-адзе.

[Outro]
Ой, лятелі гу-усі
З да-алёкага кра-аю,
Ваду замуті-ілі
На тіхім Дуна-аю.
Ваду замуті-ілі
На тіхім Дуна-аю.
[Fade to End]`,
  }),
  song(4, 'rano-rano', 'Рана-рана', 'Rano-rano', 'jpg', '4. Setivir - Rano-rano.mp3', {
    date: '01/09/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `Гэтая песьня паходзіць з беларускай народнай традыцыі «Ой, рана, рана» («Ой, рано-рано»). Яна распавядае пра маладога хлопца, надта беднага, каб ажаніцца зь дзяўчынай, якую кахае: у яго няма нічога, апрача вернага каня — сапраўднага таварыша і сымбалю свабоды. У роспачы ён заключае здзелку зь ведзьмай, мяняючы каня на золата, добры дом і прыгожую жонку. Але тое, што ён атрымлівае, ня можа загаіць страту: конь нёс ягоную душу, і безь яго ўсё багацьце здаецца пустым.
Песьня перагукваецца са старымі беларускімі традыцыямі, дзе зямля і гаспадарка вызначалі лёс чалавека, а конь быў сьвятым сябрам, зьвязаным з годнасьцю, каханьнем і самім жыцьцём.`,
      en: `This song comes from the Belarusian folk tradition “Oi, rana, rana” (“Oh, early, early”). It tells of a young man too poor to marry the girl he loves, owning nothing but his loyal horse — his true companion and symbol of freedom. In despair, he strikes a bargain with a witch, trading the horse for gold, a fine home, and a beautiful wife. Yet what he gains cannot heal the loss: the horse carried his soul, and without it all his riches feel hollow.
The song echoes old Belarusian traditions, where land and household defined one’s fate, while the horse stood as a sacred friend, tied to dignity, love, and life itself.`,
    },
    lyrics: {
      be: `Ой, рано-рано
Сонейка ўстало,
Сонейка ўстало краснае.
Сонейка ўстало
А ў маіх вачах
Ночка цёмненька
Светлым днём.

Ночка цёмненька,
Дзявачка мая
Замуж за мяне не ідзе.
Замуж не ідзе,
Таму што ў мяне
Ні кала няма, ні двара.

Нічога няма,
Акрамя каня,
Акрамя каня вернага.

Я сядлаў каня,
І праз цёмны лес
Да ведзьмы старой ехаў я,
Да ведзьмы старой...
Тая кажа мне:
"Злата дам табе за каня."

У мяне цяпер
Лепшы дом ў сяле,
Повен двор дабра,
Прыхожа жана.
Прыхожа жана,
А дабра няма.
Коню ж ты мой конь,
Я цябе прадаў...`,
      en: `Oh, early, early,
the sun has risen,
the red sun has risen.
The sun has risen —
but in my eyes
the dark night still lingers
in the light of day.

Dark night,
my dear girl
won’t marry me.
She won’t marry me,
because I have
neither a hut (simple peasant house)
nor a yard of my own.

I have nothing,
except for my horse,
except for my faithful horse.

I saddled the horse,
and through the dark forest
I rode to the old witch,
to the old witch…
And she said to me:
“I’ll give you gold
for your horse.”

Now I have
the finest house in the village,
a full yard of goods,
a beautiful wife.
A beautiful wife —
yet no true wealth.
My horse, oh my horse,
I betrayed you, sold you…`,
    },
    stylePrompt:
      'This Belarussian dubstep track opens with distant industrial noises and faint vinyl crackle, laying a stark, wintry atmosphere, The beat drops—a slow, heavy kick, crisp snare, and deep, resonant sub-bass drive the rhythm, Sparse, icy synths punctuate the minimalism, weaving between restrained, monotone rap verses, their delivery cold and detached, Occasional eerie samples and distorted textures reinforce the sense of grit and despair, The arrangement remains stripped-back throughout, letting the cinematic storytelling and bleak urban feel take center stage',
    lyricsPrompt: `[Short Instrumental Intro]
Ой, рано-рано
Ой, рано-рано

[Verse]
Ой, рано-рано
Сонейка ўстало,
Сонейка ўстало краснае.
Сонейка ўстало
А ў маіх вачах
Ночка цёмненька
Светлым днём.

[Verse]
Ночка цёмненька,
Дзявачка мая
Замуж за мяне не ідзе.
Замуж не ідзе,
Таму што ў мяне
Ні кала няма, ні двара.

[Bridge]
Нічога няма,
Акрамя каня,
Акрамя каня вернага.

[Break]

[Bass Drop]
Я сядлаў каня,
I праз цёмны лес
Да ведзьмы старой ехаў я,
Да ведзьмы старой...
Тая кажа мне:
"Злата дам табе за каня."

[Catchy Hook]
Ой, рано-рано
Ой, рано-рано
Ой, рано-рано
Сонейка ўстало краснае.

[Verse]
У мяне цяпер
Лепшы дом ў сяле,
Повен двор дабра,
Прыхожа жана.
Прыхожа жана,
А дабра няма.
Коню ж ты мой конь,
Я цябе прадаў...

[Catchy Hook]
Ой, рано-рано
Ой, рано-рано
Ой, рано-рано
Сонейка ўстало краснае.

[Outro]
Ой, рана, рана
Сонейка ўстало,
Сонейка ўстало краснае.
Сонейка ўстало
А ў маіх вачах
Ночка цёмненька
Светлы день.
[Fade to End]`,
  }),
  song(5, 'bau-bai', 'Баю-бай', 'Baju-baj', 'jpg', '5. Setivir - Bau-bai.mp3', {
    date: '07/09/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Генадзь Бураўкін', en: 'Henadz Buraukin' },
    description: {
      be: `«Баю-бай» заснаваная на традыцыйнай беларускай калыханцы Генадзя Бураўкіна. Для беларусаў гэтыя песьні — нешта большае за проста калыханкі на ноч: яны нясуць цеплыню дзяцінства, галасы маці і бабуль, ціхі рытм вясковага жыцьця. Яны — частка нашай культурнай памяці, што злучае нас зь зямлёй і з пакаленьнямі, якія былі да нас. Гэтая дабстэп-інтэрпрэтацыя ператварае пяшчотную калыханку ў нешта моцнае і сучаснае, але душа песьні — утульнасьць, клопат і адчуваньне прыналежнасьці — застаецца некранутай.`,
      en: `“Baju-baj” is based on a traditional Belarusian kalychanka (lullaby) by Henadz Buraukin. For Belarusians, these songs are more than bedtime tunes — they carry the warmth of childhood, the voice of mothers and grandmothers, and the quiet rhythm of village life. They are part of our cultural memory, connecting us to the land and to generations before us. This dubstep interpretation transforms the gentle lullaby into something powerful and modern, but the soul of the song — comfort, care, and belonging — remains untouched.`,
    },
    lyrics: {
      be: `Доўгі дзень,
Цёплы дзень
Адплывае за аблокі.
Сіні цень,
Сонны цень
Адпаўзае ў кут далёкі.
Збеглі зайкі ўсе ў лясы.
Змоўклі птушак галасы.
І буслы ў гняздо схавалі
Свае доўгія насы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

Пакрысе
На расе
Патухаюць зоркі-сплюшкі.
Гулі ўсе,
Казкі ўсе
Пахаваны пад падушкі.
Спяць і мышкі і стрыжы.
Спяць машыны ў гаражы
Ты таксама
Каля мамы
Ціха-ціхенька ляжы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

Спяць і мышкі і стрыжы.
Спяць машыны ў гаражы
Ты таксама
Каля мамы
Ціха-ціхенька ляжы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай. (2 разы)`,
      en: `A long day,
A warm day
Sails away behind the clouds.
A blue shade,
A sleepy shade
Crawls away into a distant corner.
All the bunnies ran into the woods,
All the bird songs have gone quiet,
And the storks have hidden
Their long beaks in the nest.

[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes.
Hush-a-bye, hush-a-bye,
Close your little eyes.

Bit by bit,
On the dew,
The sleepy stars go out.
All the cooings,
All the tales
Are tucked away beneath the pillows.
Mice are sleeping, swifts are sleeping,
Cars are resting in the garage.
You as well,
Close to mama,
Lie down quietly, so softly.

[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes.
Hush-a-bye, hush-a-bye,
Close your little eyes.

Mice are sleeping, swifts are sleeping,
Cars are resting in the garage.
You as well,
Close to mama,
Lie down quietly, so softly.

[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes. (x2)`,
    },
    stylePrompt: 'deep dubstep sub and minimal, sparse drums create a spacious pulse',
    lyricsPrompt: `[Intro]
Баю-бай, баю-бай,
Баю-бай, баю-бай.

[Verse]
Доўгі дзень,
Цёплы дзень
Адплывае за аблокі.
Сіні тень,
Сонны тень
Адпаўзае ў кут далёкі.
Збеглі зайкі ўсе ўлясы-ы.
Змоўклі птушак галасы.
Ій буслы-ы ўгняздо-о схава-алі
Свае доўгія насы.

[Bass Drop]

[Chorus]
Баю-бай, баю-бай,
Ваczaняты закрывай.
Баю-бай, баю-бай,
Ваczaняты закрывай.

[Verse]
Пакрысе
На расе
Патухаюць зоркі-сплюшкі.
Гулі ўсе,
Казкі ўсе
Пахаваны пад падушкі.
Спяць і мышкі і стрыжы-ы.
Спяць машыны ў гаражы
Ты такса-ама
Каля ма-амы
Тіха-тіхенька ляжы.

[Super Bass Drop]

[Bridge]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

[Verse]
Спяць і мышкі і стрыжы.
Спяць машыны ўхаражы-ы
Ты такса-ама
Каля ма-амы
Тіха-тіхенька ляжы.

[Outro]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.`,
  }),
  song(6, 'kalykhanka', 'Калыханка', 'Kałychanka', 'jpg', '6. Setivir - Kalykhanka.mp3', {
    date: '09/09/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Генадзь Бураўкін', en: 'Henadz Buraukin' },
    description: {
      be: `«Калыханка» заснаваная на традыцыйнай беларускай калыханцы. Для беларусаў гэтыя песьні — нешта большае за проста калыханкі на ноч: яны нясуць цеплыню дзяцінства, галасы маці і бабуль, ціхі рытм вясковага жыцьця. Яны — частка нашай культурнай памяці, што злучае нас зь зямлёй і з пакаленьнямі, якія былі да нас. У гэтым трэку таксама можна пачуць лёгкія ноты традыцыйнага сьпеву і харавога гучаньня, якія адгукаюцца фальклорным карэньнем калыханкі. Гэтая дабстэп-інтэрпрэтацыя ператварае пяшчотную калыханку ў нешта моцнае і сучаснае, але душа песьні — утульнасьць, клопат і адчуваньне прыналежнасьці — застаецца некранутай.`,
      en: `“Kałychanka” is based on a traditional Belarusian kalykhanka (lullaby). For Belarusians, these songs are more than bedtime tunes — they carry the warmth of childhood, the voice of mothers and grandmothers, and the quiet rhythm of village life. They are part of our cultural memory, connecting us to the land and to generations before us. In this track, you can also hear subtle notes of traditional vocals and choral singing, echoing the folk roots of the lullaby. This dubstep interpretation transforms the gentle lullaby into something powerful and modern, but the soul of the song — comfort, care, and belonging — remains untouched.`,
    },
    lyrics: {
      be: `Доўгі дзень,
Цёплы дзень
Адплывае за аблокі.
Сіні цень,
Сонны цень
Адпаўзае ў кут далёкі.
Збеглі зайкі ўсе ў лясы.
Змоўклі птушак галасы.
І буслы ў гняздо схавалі
Свае доўгія насы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

Пакрысе
На расе
Патухаюць зоркі-сплюшкі.
Гулі ўсе,
Казкі ўсе
Пахаваны пад падушкі.
Спяць і мышкі і стрыжы.
Спяць машыны ў гаражы
Ты таксама
Каля мамы
Ціха-ціхенька ляжы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

Спяць і мышкі і стрыжы.
Спяць машыны ў гаражы
Ты таксама
Каля мамы
Ціха-ціхенька ляжы.

[Прыпеў]
Баю-бай, баю-бай,
Вачаняты закрывай. (2 разы)`,
      en: `[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes.
Hush-a-bye, hush-a-bye,
Close your little eyes.

Bit by bit,
On the dew,
The sleepy stars go out.
All the cooings,
All the tales
Are tucked away beneath the pillows.
Mice are sleeping, swifts are sleeping,
Cars are resting in the garage.
You as well,
Close to mama,
Lie down quietly, so softly.

[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes.
Hush-a-bye, hush-a-bye,
Close your little eyes.

Mice are sleeping, swifts are sleeping,
Cars are resting in the garage.
You as well,
Close to mama,
Lie down quietly, so softly.

[Chorus]
Hush-a-bye, hush-a-bye,
Close your little eyes. (x2)`,
    },
    stylePrompt:
      'At 90 BPM halftime in C minor, deep dubstep sub and minimal, sparse drums create a spacious pulse, Ethereal strong opera-like Belarusian female vocal floats above wide reverb and airy pads, Cymbaly and zhaleika weave delicate folk motifs, Intimate cinematic mood, soft vinyl hiss, textures drift through',
    lyricsPrompt: `[Intro]
Баю-бай, баю-бай,
Баю-бай, баю-бай.

[Verse]
Доўгі дзень,
Цёплы дзень
Адплывае за аблокі.
Сіні тень,
Сонны тень
Адпаўзае ў кут далёкі.
Збеглі зайкі ўсе у лясы-ы.
Змоўклі птушак галасы.
І буслы-ы у гняздо-о схава-алі
Свае доўгія насы.

[Bass Drop]

[Chorus]
Баю-бай, баю-бай,
Вачааняты закрывай.
Баю-бай, баю-бай,
Вачааняты закрывай.

[Verse]
Пакрысе
На расе
Патухаюць зоркі-сплюшкі.
Гулі ўсе,
Казкі ўсе
Пахаваны пад падушкі.
Спяць і мышкі і стрыжы-ы.
Спяць машыны ў гаражы
Ты такса-ама
Каля мамы
Тіха-тіхенька ляжы.

[Super Bass Drop]

[Bridge]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.

[Verse]
Спяць і мышкі і стрыжы.
Спяць машыны ў гаражы
Ты таксама
Каля мамы
Тіха-тіхенька ляжы.

[Outro]
Баю-бай, баю-бай,
Вачаняты закрывай.
Баю-бай, баю-бай,
Вачаняты закрывай.`,
  }),
  song(7, 'kupala', 'Купала', 'Kupała', 'jpg', '7. Setivir - Kupala.mp3', {
    date: '29/09/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `На словы беларускае народнае песьні «У нас сягодня Купала».`,
      en: `Based on the Belarusian folk song «U nas siahodnia Kupała» («we have Kupala day today»).

Kupala Night (“Kupalle”) is an East Slavic midsummer celebration of bonfires, wreaths, and rites of purification and fertility; the lines “It wasn’t a maiden who laid the fire—God Himself set the fire” raise the flame from a folk act to a sacred gift, while the repeated appeal to Ilya (the Prophet Elijah—long syncretized with a pre-Christian thunder god) asks for rain, protection, and a blessing on the harvest. The song fuses pagan and Christian layers (“He was calling all the saints to Himself”) yet keeps an agrarian focus: staying awake through this “little night” to guard the rye and ward off the “serpent,” both literal field pests and a mythic destroyer of crops.`,
    },
    lyrics: {
      be: `[Куплет]
У нас сягодня Купала, то-то-то
Ня дзеўка агонь клала, то-то-то
Сам Бог агонь раскладаў, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля

[Прыпеў]
У нас сёння Купала, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля, то-то-то
У нас сёння Купала...

[Bass Drop]
У нас сёння Купала, то-то-то
Ты прыйдзі на купалля, то-то-то

[Куплет]
Не магу я, Купала, то-то-то
Гэту ночку мне ня спаць, то-то-то
Трэба жыта пільнаваць, то-то-то

[Bridge]
Каб зьмяя не ламала, то-то-то
Карэння не капала, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля

[Прыпеў]
У нас сёння Купала, то-то-то
Ты прыйдзі на купалля, то-то-то
У нас сёння Купала, то-то-то
Ты прыдзі да нас Ілля...

[Bass Drop]
У нас сёння Купала, то-то-то
Усіх сьвятых да сябе зваў, то-то-то`,
      en: `[Verse 1]
It’s Kupala tonight, to-to-to
It wasn’t a maiden who laid the fire, to-to-to
God Himself set the fire, to-to-to
He was calling all the saints to Himself, to-to-to

[Pre-Chorus]
Kupala called Elijah, to-to-to
Come to us, Ilya (Elijah), to-to-to
Come to the Kupala feast

[Chorus]
It’s Kupala tonight, to-to-to
Come to us, Ilya, to-to-to
Come to the Kupala feast, to-to-to
It’s Kupala tonight…

[Bass Drop]
It’s Kupala tonight, to-to-to
Come to the Kupala feast, to-to-to

[Verse 2]
I can’t, Kupala, to-to-to
I mustn’t sleep this little night, to-to-to
I have to keep watch over the rye, to-to-to

[Bridge]
So that the serpent won’t break it, to-to-to
Won’t dig up the roots, to-to-to

[Pre-Chorus]
Kupala called Elijah, to-to-to
Come to us, Ilya, to-to-to
Come to the Kupala feast

[Chorus]
It’s Kupala tonight, to-to-to
Come to the Kupala feast, to-to-to
It’s Kupala tonight, to-to-to
Come to us, Ilya…

[Bass Drop]
It’s Kupala tonight, to-to-to
He was calling all the saints to Himself, to-to-to`,
    },
    stylePrompt:
      'A dark, hard and deep dubstep foundation anchors the track with a powerful low and slow beat, Sparse, minimal drums punctuate the openness, creating an expansive rhythmic pulse, with powerful saws on bass drops, A traditional folk female choral singing with solo vocal parts floats above in melodic phrases, weaving folk inflections into the spacious mix',
    lyricsPrompt: `[Intro]

Сам бог агонь раскла-а-даў...
...раскладаў...
...усіх сьвятых да сябе зва-а-аў...

То-то-то... то... то-то-то...

[Verse 1]
У нас сягодня Купала, то-то-то
Ня дьзеўка агонь клала, то-то-то
Сам Бог агонь раскладаў, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдьзі да нас Ілля, то-то-то
Ты прыйдьзі на купалля

[Chorus]
У нас сёння Купала, то-то-то
Ты прыдьзі да нас Ілля, то-то-то
Ты прыйдьзі на купалля, то-то-то
У нас сёння Купала...

[Bass Drop]
У нас сёння Купала, то-то-то
Ты прыйдьзі на купалля, то-то-то

[Verse 2]
Не магу я, Купала, то-то-то
Гэту ноczку мне ня спать, то-то-то
Трэба жыта пільнавать, то-то-то

[Bridge]
Каб зьмяя не ламала, то-то-то
Карэння не капа-ала, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдьзі да нас Ілля, то-то-то
Ты прыйдьзі на купалля

[Chorus]
У нас сёння Купала, то-то-то
Ты прыйдьзі на купалля, то-то-то
У нас сёння Купала, то-то-то
Ты прыдьзі да нас Ілля...

[Bass Drop]
У нас сягодня Купала, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Outro]

Сам бог агонь раскла-а-даў...
...раскладаў...
...усіх сьвятых да сябе зва-а-аў...

То-то-то... то... то-то-то... то...`,
  }),
  song(8, 'to-to-to', 'То-то-то', 'To-to-to', 'jpg', '8. Setivir - To-to-to.mp3', {
    date: '29/09/2025',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `На словы беларускае народнае песьні «У нас сягодня Купала».`,
      en: `Based on the Belarusian folk song «U nas siahodnia Kupała» («we have Kupala day today»).

Kupala Night (“Kupalle”) is an East Slavic midsummer celebration of bonfires, wreaths, and rites of purification and fertility; the lines “It wasn’t a maiden who laid the fire—God Himself set the fire” raise the flame from a folk act to a sacred gift, while the repeated appeal to Ilya (the Prophet Elijah—long syncretized with a pre-Christian thunder god) asks for rain, protection, and a blessing on the harvest. The song fuses pagan and Christian layers (“He was calling all the saints to Himself”) yet keeps an agrarian focus: staying awake through this “little night” to guard the rye and ward off the “serpent,” both literal field pests and a mythic destroyer of crops. The recurring onomatopoeic “to-to-to” works as an incantatory refrain that drives the rhythm, and modern section labels like Pre-Chorus and Bass Drop signal an EDM/dubstep arrangement framing an old ritual text in a contemporary club form.`,
    },
    lyrics: {
      be: `[Куплет]
У нас сягодня Купала, то-то-то
Ня дзеўка агонь клала, то-то-то
Сам Бог агонь раскладаў, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля

[Прыпеў]
У нас сёння Купала, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля, то-то-то
У нас сёння Купала...

[Bass Drop]
У нас сёння Купала, то-то-то
Ты прыйдзі на купалля, то-то-то

[Куплет]
Не магу я, Купала, то-то-то
Гэту ночку мне ня спаць, то-то-то
Трэба жыта пільнаваць, то-то-то

[Bridge]
Каб зьмяя не ламала, то-то-то
Карэння не капала, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдзі да нас Ілля, то-то-то
Ты прыйдзі на купалля

[Прыпеў]
У нас сёння Купала, то-то-то
Ты прыйдзі на купалля, то-то-то
У нас сёння Купала, то-то-то
Ты прыдзі да нас Ілля...

[Bass Drop]
У нас сёння Купала, то-то-то
Усіх сьвятых да сябе зваў, то-то-то`,
      en: `[Verse 1]
It’s Kupala tonight, to-to-to
It wasn’t a maiden who laid the fire, to-to-to
God Himself set the fire, to-to-to
He was calling all the saints to Himself, to-to-to

[Pre-Chorus]
Kupala called Elijah, to-to-to
Come to us, Ilya (Elijah), to-to-to
Come to the Kupala feast

[Chorus]
It’s Kupala tonight, to-to-to
Come to us, Ilya, to-to-to
Come to the Kupala feast, to-to-to
It’s Kupala tonight…

[Bass Drop]
It’s Kupala tonight, to-to-to
Come to the Kupala feast, to-to-to

[Verse 2]
I can’t, Kupala, to-to-to
I mustn’t sleep this little night, to-to-to
I have to keep watch over the rye, to-to-to

[Bridge]
So that the serpent won’t break it, to-to-to
Won’t dig up the roots, to-to-to

[Pre-Chorus]
Kupala called Elijah, to-to-to
Come to us, Ilya, to-to-to
Come to the Kupala feast

[Chorus]
It’s Kupala tonight, to-to-to
Come to the Kupala feast, to-to-to
It’s Kupala tonight, to-to-to
Come to us, Ilya…

[Bass Drop]
It’s Kupala tonight, to-to-to
He was calling all the saints to Himself, to-to-to`,
    },
    stylePrompt:
      'A dark, hard and deep dubstep foundation anchors the track with a powerful low and slow beat, Sparse, minimal drums punctuate the openness, creating an expansive rhythmic pulse, with powerful saws on bass drops, A traditional folk female choral singing with solo vocal parts floats above in melodic phrases, weaving folk inflections into the spacious mix',
    lyricsPrompt: `[Intro]

Сам бог агонь раскла-а-даў...
...раскладаў...
...усіх сьвятых да сябе зва-а-аў...

То-то-то... то... то-то-то...

[Verse 1]
У нас сягодня Купала, то-то-то
Ня дьзеўка агонь клала, то-то-то
Сам Бог агонь раскладаў, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдьзі да нас Іля, то-то-то
Ты прыйдьзі на купаля

[Chorus]
У нас сёння Купала, то-то-то
Ты прыдьзі да нас Іля, то-то-то
Ты прыйдьзі на купаля, то-то-то
У нас сёння Купала...

[Bass Drop]
У нас сёння Купала, то-то-то
Ты прыйдьзі на купаля, то-то-то

[Verse 2]
Не магу я, Купала, то-то-то
Гэту ноczку мне ня спать, то-то-то
Трэба жыта пільнаваць, то-то-то

[Bridge]
Каб зьмяя не ламала, то-то-то
Карэння не капала, то-то-то

[Pre-Chorus]
Звала Купала Іллю, то-то-то
Ты прыдьзі да нас Ілля, то-то-то
Ты прыйдьзі на купалля

[Chorus]
У нас сёння Купала, то-то-то
Ты прыйдьзі на купалля, то-то-то
У нас сёння Купала, то-то-то
Ты прыдьзі да нас Ілля...

[Bass Drop]
У нас сёння Купала, то-то-то
Усіх сьвятых да сябе зваў, то-то-то

[Outro]

Сам бог агонь раскла-а-даў...
...раскладаў...
...усіх сьвятых да сябе зва-а-аў...

То-то-то... то... то-то-то... то...`,
  }),
  song(9, 'bitaya', 'Бітая', 'Bitaja darožańka', 'jpg', '9. Setivir - Bitaya.mp3', {
    date: '20/10/2025',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Фальклёрны твор', en: 'Traditional folk song' },
    description: {
      be: `На словы беларускае народнае песьні «Бітая дарожанька». Версыя народнага калектыву «Гасцінец», што з Ракава.`,
      en: `Based on the Belarusian folk song «Bitaja darožańka» («beaten road»). A version of the folk collective "Gastinets" from Rakov, Belarus.

The “beaten road” (Belarusian "бітая дарожанька") is a recurring symbol in Eastern European folk songs. It represents both physical travel and existential passage — the boundary between life and death, love and separation. This is an archetypal motif of liminality, common in Slavic oral tradition. The juxtaposition of war imagery (“warrior,” “army,” “saddles”) with intimacy (“maiden,” “love,” “parting”) creates a dual semantic domain — love and war intertwined, a hallmark of Belarusian heroic ballads (dumy). Turaw ("Тураў") is one of the oldest towns in Belarus (10th century), once a spiritual and political center of the early Ruthenian state. Mentioning Turaw roots the narrative in the collective memory — a technique of toponymic anchoring often used in folklore to evoke national identity.`,
    },
    lyrics: {
      be: `[Уступ]
Чорнаю зграяй уварваліся чужынцы ў нашыя землі.
Дзе ты, воін беларускі? Адгукніся на кліч!
Ідзі дарогаю слаўнаю, дарогаю змагарнаю!
Ідзі свой край бараніць...

[Куплет]
Бітая дарожанька папылілася,
Чаго ж ты, дзяўчынка, зажурылася?
Чаго ж ты, дзяўчынка, ой, зажурылася!
Відаць свайго мілага не праводзіла-а.
Відаць свайго мілага не праводзіла-а!
Праводзіла-а мілага аж да Турава.

[Прыпеў]
А ў Тураве горадзе, а ў Тураве горадзе
Прыпыніліся, прыпыніліся.
Залатыя сёдлачкі, залатыя сёдлачкі
Папыліліся, папыліліся.
Як уся тая армія, як уся тая армія
Дзіўлялася, дзіўлялася.
Як роўная парочка, як роўная парочка
Разлучалася, разлучалася.
Разлучалася, разлучалася.

[Куплет]
То не мужык з жонкаю, і не брат з сястрою —
Гэтак мы любіліся, дый кахаліся.
Гэтак мы любіліся, дый кахаліся,
Ой, як цяжанька разлучаліся...

[Прыпеў]
Бітая дарожанька, бітая дарожанька,
Бітая дарожанька, бітая дарожанька,
Бітая дарожанька, бітая дарожанька,
Бітая дарожанька, бітая дарожанька.`,
      en: `[Spoken Intro]
With a dark flock they stormed our lands,
Where are you, Belarusian warrior — answer the call!
Walk the path of glory, the path of struggle,
Go, defend your native soil!

[Verse I]
The beaten road lies under dust,
Why are you, young maiden, lost in sorrow?
Why are you, young maiden, oh so still?
Perhaps you never saw your love off —
Perhaps you never said goodbye,
You walked him halfway, down to Turaw town.

[Chorus]
In Turaw city, in Turaw town,
The riders slowed and gathered round.
Golden saddles, gleaming bright,
Were covered now with dust and light.
And the mighty army gazed,
Silent, heavy, and amazed.
As the loving pair apart,
Felt the breaking of the heart...
Felt the breaking of the heart...

[Verse II]
It was not a man with wife, nor brother with his sister —
That’s how we loved, how fiercely we cared.
That’s how we loved, how deeply we dared,
Oh, how heavy was the parting we shared...

[Chorus — reprise]
The beaten road, the beaten road,
The beaten road, the beaten road,
The beaten road, the beaten road,
The beaten road, the beaten road...`,
    },
    stylePrompt:
      'A dark, hard and deep dubstep foundation anchors the track with a powerful low and slow beat, Sparse, minimal drums punctuate the openness, creating an expansive rhythmic pulse, with powerful saws on bass drops',
    lyricsPrompt: `[Spoken Intro]
Czо-орнаю зграяй ўварва-аліся czужы-ынцы ў нашыя зе-емлі
Дзіе ты, воін беларускі! Адгукніся на кліcz!
Ідзі дарогаю слаўнаю, дарогаю змагарнаю!
Ідзі свой край бараніць...

[Verse]
Бі-ітая даро-ожанька па-апылілася,
Czаго-ж ты дзяўczы-ынаczка зажуры-ылася?
Czаго-ж ты дзяўczы-ынаczка, ой зажуры-ылася!
Відаць свайго мілага не праводзіла-а

Відаць свайго мілага неправодзіла-а!
праводзіла-а мілага аж да Турава
[BassDrop]

[Chorus]
А ў Тураве горадзе, А ў Тураве горадзе
Прыпыніліся, Прыпыніліся
Залатыя сёдлаczкі, Залатыя сёдлаczкі
Папыліліся, Папыліліся

Як ўся тая а-армія, Як ўся тая а-армія
Дзівава-алася, Дзівава-алася
Як роўная параczка, Як роўная параczка
Разлуczалася, Разлуczалася
[BassDrop]

[Verse]
То не му-ужык з жа-аною, і не бра-ат з сястро-ой
Гэ-этак мы любі-іліся, дый каха-аліся

Гэ-этак мы любі-іліся, дый каха-аліся
Ой як ця-яжанька, разлуczаліся
[BassDrop]

[Chorus]
Бітая дарожанька, Бітая дарожанька
Бітая дарожанька, Бітая дарожанька
Бітая дарожанька, Бітая дарожанька
Бітая дарожанька, Бітая дарожанька

[Outro]
(Ай-ай-ай-ай-ай-ай-ай-ай-ай-ай-ай-ай-яй)`,
  }),
  // ⚠ exact filename contains a Cyrillic "с" in "noс"
  song(10, 'cichaja-noc', 'Ціхая ноч', 'Cichaja noč', 'jpg', '10. Setivir - Cichaja noс.mp3', {
    date: '15/11/2025',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Наталля Арсеннева', en: 'Natallia Arsenneva' },
    description: {
      be: `Электронная адаптацыя песьні «Ціхая ноч...» (ням. «Stille Nacht...») у перакладзе Наталлі Арсенневай.`,
      en: `Electronic adaptation of the song “Silent Night…” (German “Stille Nacht…”) in the Belarusian translation by Natallia Arsenneva.

"Cichaja noč" is a Belarusian version of the classic Christmas carol “Silent Night”, centred on the peaceful night of Christ’s birth, the tenderness of Mary by the manger, the angels’ song to the shepherds, and a plea that sorrow and longing be driven away so people can rejoice. In the electronic adaptation, this Christmas motif is interwoven with subtle notes of religious Eastern chant laid over deep dubstep and shimmering electro textures.`,
    },
    lyrics: {
      be: `Ціхая ноч, святая ноч!
Спіць усё, сніць даўно.
Толькі Маці Святая ўсцяж
ціха ў яслях люляе Дзіця:

«Спі, Сыночак малы,
Люлі, Люлі, сьпі!»

А ўгары ўсё гарыць
Серабром зорных крыг.
Хор анёлаў пяе пастухом
Аб Дзіцяці, што будзе Хрыстом,

Светлай песняй хвалы
Славяць Збаўцу Зямлі.

Ціхая ноч, святая ноч,
У родны край завітай,
Людзям сум і тугу разгані,
Хай жа цешацца ў гэтыя дні,

Ў ціхую, святую ноч,
Ў ціхую, святую ноч!`,
      en: `Silent night, holy night!
All is asleep, long since in dreams.
Only the Holy Mother still
Softly rocks the Child in the manger:

“Sleep, my little Son,
Luli, luli, sleep!”

High above everything shines
With the silver of starry ice.
Choirs of angels sing to the shepherds
Of the Child who will be the Christ,

With a bright song of praise
They glorify the Savior of the Earth.

Silent night, holy night,
Come into our native land,
Drive away people’s sorrow and grief,
Let them rejoice in these days,

On this quiet, holy night,
On this quiet, holy night!`,
    },
    stylePrompt: 'deep dubstep sub and minimal, sparse drums create a spacious pulse',
    lyricsPrompt: `[Intro]
Тіхая ноcz, сьвятая ноcz!
Сьпіть усё, сьніть даўно.

[Verse 1]
Толькі Маті Сьвятая ўсьцяж
тіха ў ясьлях люляе Дьзіця:
«Сьпі, Сыноczак малы,
Люлі, Люлі, сьпі!»

[Pre-Chorus]
«Сьпі, Сыноczак малы,
Люлі, Люлі, сьпі!»

[Chorus]
Тіхая ноcz, сьвятая ноcz,
У родны край завітай,
Людьзям сум і тугу разгані,
Ў тіхую, сьвятую ноcz!

[BuildUp]
А ўгары ўсё гарыть,
Серабром зорных крых.

[BassDrop]
Хор анёлаў пяе пастухом,
Аб Дзіцяті, што будьзе Хрыстом,
Сьветлай песьняй хвалы
Славять Збаўцу Зя-амлі.

[Verse 2]
Тіхая ноcz, сьвятая ноcz!
Сьпіть усё, сьніть даўно.
Толькі Маті Сьвятая ўсцяж
тіха ў яслях люляе Дьзіця:

[Pre-Chorus 2]
«Сьпі, Сыноczак малы,
Люлі, Люлі, сьпі!»

[Chorus 2]
Тіхая ноcz, сьвятая ноcz,
У родны край завітай,
Хай жа тешацца ў хэтыя дні,
Ў тіхую, сьвятую ноcz!

[BassDrop 2]
Люлі, Люлі, сьпі!
Ў тіхую, сьвятую ноcz,
Ў тіхую, сьвятую ноcz!

[Verse 3]
А ўгары ўсё гарыть,
Серабром зорных крых.
Сьветлай песьняй хвалы
Славять Збаўцу Зямлі.

[Outro]
Тіхая ноcz, сьвятая ноcz!
Сьпіть усё, сьніть даўно.`,
  }),
  song(11, 'khto-ya', 'Хто я', 'Chto ja...', 'jpg', '11. Setivir - Khto ya.mp3', {
    date: '02/12/2025',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Артур Вольскі', en: 'Artur Volski' },
    description: {
      be: `«Хто я...» («Chto ja...») — далікатная беларуская касьмічная калыханка пра адвечнага апекуна чалавецтва, добрага «дзеда зораў», які сочыць за кожным чалавекам. Мяккі вакал, натхнёныя космасам мэлодыі і лёгкі налёт кіберпанк-атмасфэры зьліваюцца ў цёплы, узьнёслы трэк, які нібы нясе цябе праз сузор’і разам з найлепшым сябрам, задаючы самае простае і самае глыбокае пытаньне: хто я?`,
      en: `"Who I am..." ("Chto ja...") is a gentle Belarusian cosmic lullaby about a timeless guardian of humanity — a kind “grandfather of the stars” who watches over every person. Soft vocals, space-inspired melodies and a touch of cyberpunk atmosphere blend into a warm, uplifting track that feels like flying through constellations with your best friend, asking the simplest and deepest question: Who am I?`,
    },
    lyrics: {
      be: `Я хаджу па белым свеце
І гляджу, як вы жывеце.
Калі трэба — памагу,
Бо я ўсё рабіць магу.

З вамі побач буду ўсюды,
Трэба цуды — зробім цуды,
Трэба казка — раз, два, тры —
Вось і казка вам, сябры!

Хто я? Дзед-Барадзед,
Абышоў белы свет,
А цяпер у ціхі час
Завітаў да вас.

Я хаджу па белым свеце —
Ваш найлепшы сябар, дзеці.
І вядома нават мне,
Што вы бачыце ўва сне.

Хто я? Дзед-Барадзед,
Абышоў белы свет,
А цяпер у ціхі час
Завітаў да вас.

Я хаджу па белым свеце
І гляджу, як вы жывяце.
Калі трэба — памагу,
Бо я ўсё рабіць магу.

Хто я? Дзед-Барадзед,
Абышоў белы свет,

А цяпер у ціхі час
Завітаў да вас.`,
      en: `[Verse 1]
I walk around the wide world,
And I watch how you all live.
If you need it – I will help,
Because I can do anything.

[Chorus]
Who am I? I’m Grandpa Long-Beard,
I have walked around the wide world,
And now, in this quiet hour,
I have come to you.

[Verse 2]
I’ll be beside you everywhere,
Need miracles? — we’ll make miracles,
Need a fairy tale? — one, two, three —
Here’s a fairy tale for you, my friends!

[Verse 3]
I walk around the wide world —
I’m your best friend, children.
And I even know
What you see inside your dreams.

[Verse 4]
I walk around the wide world,
And I watch how you all live.
If you need it — I will help,
Because I can do anything.`,
    },
    stylePrompt:
      'A slow, mysterious deep-space track at the intersection of minimal and dubstep: very sparse half-time drums, distant, sludgy sub-bass rumbles like a black hole engine, and tiny, glitchy percussive clicks drifting in the background, Long, cold synth pads and blurry, detuned chords float in vast reverb, creating a sense of cosmic emptiness, sadness and quiet contemplation, Occasional distant, heavily processed vocal chops or radio-like signals appear and fade away, as if coming from nowhere, leaving long stretches of near-silence and subtle motion—a slow, electric soundtrack of the void between stars',
    lyricsPrompt: `[Verse 0]
Я хаджу па белым сьвете
I гляджу, як вы жывете.
Калi трэба памагу,
Бо я ўсё рабiць магу.

[Verse 1]
З вамі побаcz буду ўсюды,
Трэба цуды – зробім цуды,
[BassDrop]
Трэба казка – раз, два, тры –
Вось і казка вам, сябры!

[Chorus]
Хто я? Дьзьед-барадьзьед,
Абышоў белы сьвет,
А цяпер у тіхі czас
Завітаў да вас.

[Verse 2]
Я хаджу па белым сьвете –
Ваш найлепшы сябар, дьзьеці.
[BassDrop]
І вядома нават мне,
Што вы баczыте ўва сне.

[Chorus]
Хто я? Дьзьед-барадьзьед,
Абышоў белы сьвет,
А цяпер у тіхі czас
Завітаў да вас.

[Verse 3]
Я хаджу па белым сьвете
І гляджу, як вы жывете.
[BassDrop]
Калі трэба – памагу,
Бо я ўсё рабіць магу.

[Chorus]
Хто я? Дьзьед-барадьзьед,
Абышоў белы сьвет,
[BassDrop]

[Outro]
А цяпер у тіхі czас
Завітаў да вас.`,
  }),
  song(12, 'dzed-baradzed', 'Дзед-барадзед', 'Dzied-Baradzied', 'jpg', '12. Setivir - Dzed-baradzed.mp3', {
    date: '02/12/2025',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Артур Вольскі', en: 'Artur Volski' },
    description: {
      be: `«Дзед-Барадзед» — беларуская касьмічная прог-рокавая вандроўка ў духу Pink Floyd: павольная, атмасфэрная касьмічная адысэя пра адвечнага апекуна чалавецтва, добрага «дзеда з барадой», які са зораў сочыць за кожным дзіцём. Шматслойныя гітары, лунаючыя сынтэзатары і прасторныя барабаны ствараюць мэдытатыўны, кінэматаграфічны гукавы ландшафт, нібы ты плывеш праз галяктыкі разам са сваім найстарэйшым сябрам, а беларускі тэкст «Дзеда-Барадзеда» ціха задае адно і тое ж простае, вечнае пытаньне: хто мы ў гэтым бязьмежным сусьвеце?`,
      en: `"Dzied-Baradzied" is a Belarusian cosmic progressive rock journey in the spirit of Pink Floyd — a slow, atmospheric space odyssey about a timeless guardian of humanity, a kind "grandfather with a beard" who watches over every child from the stars. Layered guitars, floating synths and spacious drums build a meditative, cinematic soundscape that feels like drifting through galaxies with your oldest friend, while the Belarusian lyrics of Dzied-Baradzied ("Grandpa Long-Beard") quietly ask the same simple, eternal question: who are we in this vast universe?`,
    },
    lyrics: {
      be: `Я хаджу па белым свеце
І гляджу, як вы жывяце.
Калі трэба — памагу,
Бо я ўсё рабіць магу.

З вамі побач буду ўсюды,
Трэба цуды — зробім цуды,
Трэба казка — раз, два, тры —
Вось і казка вам, сябры!

Хто я? Дзед-Барадзед,
Абышоў белы свет,
А цяпер у ціхі час
Завітаў да вас.

Я хаджу па белым свеце —
Ваш найлепшы сябар, дзеці.
І вядома нават мне,
Што вы бачыце ўва сне.

Хто я? Дзед-Барадзед,
Абышоў белы свет,
А цяпер у ціхі час
Завітаў да вас.

Хто я? Дзед-Барадзед,
Абышоў белы свет,
А цяпер у ціхі час
Завітаў да вас.

Я хаджу па белым свеце
І гляджу, як вы жывяце.
Калі трэба — памагу,
Бо я ўсё рабіць магу.

Хто я? Дзед-Барадзед,
Абышоў белы свет...`,
      en: `[Verse 1]
I walk around the wide world,
And I watch how you all live.
If you need it – I will help,
Because I can do anything.

[Chorus]
Who am I? I’m Grandpa Long-Beard,
I have walked around the wide world,
And now, in this quiet hour,
I have come to you.

[Verse 2]
I’ll be beside you everywhere,
Need miracles? — we’ll make miracles,
Need a fairy tale? — one, two, three —
Here’s a fairy tale for you, my friends!

[Verse 3]
I walk around the wide world —
I’m your best friend, children.
And I even know
What you see inside your dreams.

[Verse 4]
I walk around the wide world,
And I watch how you all live.
If you need it — I will help,
Because I can do anything.`,
    },
    stylePrompt:
      'A spacious, psychedelic progressive rock track: slow to mid-tempo live drums, warm, rounded bass and smooth, echo-drenched electric guitars playing long, bending notes and melodic, emotional solos, Airy analog-style synth pads, cosmic sound effects and distant vocal harmonies create a dreamy, introspective atmosphere, with long builds, extended instrumental sections and smooth dynamic shifts that feel like a continuous journey rather than a simple verse-chorus song',
    lyricsPrompt: `[Verse 0]
Я хаджу па белым сьвете
I гляджу, як вы жывете.
Калi трэба памагу,
Бо я ўсё рабiць магу.

[Verse 1]
З вамі побаcz буду ўсюды,
Трэба цуды – зробім цуды,

[BassDrop]
Трэба казка – раз, два, тры –
Вось і казка вам, сябры!

[Chorus]
Хто я? Дьзьед-барадьзед,
Абышоў белы сьвет,
А тяпер у ціхі czас
Завітаў да вас.

[Verse 2]
Я хаджу па белым свете –
Ваш найлепшы сябар, дьзьеці.

[BassDrop]
І вядома нават мне,
Што вы баczыте ўва сне.

[Chorus]
Хто я? Дьзьед-барадьзед,
Абышоў белы сьвет,
А тяпер у ціхі czас
Завітаў да вас.

[Chorus]
Хто я? Дьзьед-барадьзед,
Абышоў белы сьвет,
А тяпер у ціхі czас
Завітаў да вас.

[Verse 3]
Я хаджу па белым сьвете
І гляджу, як вы жывете.

[BassDrop]
Калі трэба – памагу,
Бо я ўсё рабіць магу.

[Chorus]
Хто я? Дьзьед-барадьзед,
Абышоў белы сьвет,`,
  }),
  song(13, 'zviaz-piarscionka', 'Зьвяз пярсьцёнка', 'Źviaz Piarścionka', 'jpg', '13. Setivir - Zviaz piarscionka.mp3', {
    date: '11/01/2026',
    model: 'Suno v5',
    lyricsAuthor: { be: 'Аляксей Картыннік', en: 'Aliaksei Kartynnik' },
    description: {
      be: `Гэта ідэальны рэкап першай кнігі «Уладара Пярсьцёнкаў»: ад утульнага шынка ў Шыры і савета ў Рывендэле праз цемру Морыі і полымя Балрага да трагічнага распаду Брацтва. Калі вы збіраліся пераглядаць трылогію або проста сумуеце па Міжзем’і — гэты кліп абавязковы да прагляду.`,
      en: `This is the ideal recap of the first book of The Lord of the Rings: from a cozy inn in the Shire and the Council in Rivendell, through the darkness of Moria and the flame of the Balrog, to the tragic breaking of the Fellowship. If you were planning to re-watch the trilogy or just miss Middle-earth, this music video is a must-watch.`,
    },
    lyrics: {
      be: `Гісторыя стала лягендай, лягенда зтлела ў міф
Над утульнай торбай пад Стромай навіс мардараўскі гліф
У полымі дома у Більба, дзе спрадвеку піўся эль
На пярсцёнку праступіў з нябыту вогненны вензель
Гэта не проста золата — гэта кроў і згуба каралёў
Праклён Ісільдура патрабуе новых ахвярных галоў
Зьбірайся, пляменнік! Пакінь свой спакойны кут
Скончана "Проста Прыгода". Надыходзіць час пакут.

Адзіны Пярсьцёнак-гаспадар — пятля на шыі Сусьвету
Чорнае сонца ўзыходзіць паводле старажытнага запавету
Ён цягне душу ў прывідны сьвет, дзе няма ні ценю, ні дня
Толькі Вока... Бяссоннае Вока... і вечная валтузня
Адзіны Пярсцёнак...

На Аман Сул разбіты камень занатаваў наш боль
Моргульскі клінок уцёр у рану магільную соль
Атэлас выцягнуў яд, але не вылечыў жах
Цяпер кожны шолах — гэта Вораг, кожны цень — гэта крах
Мы зведалі нораў Карадрасу, люты спакон вякоў,
Але горш за мароз — цені здрады ў вачах сяброў.

Морыя... Казад Дум! Маўчанне памерлых гномаў!
Тут цемра старэйшая за рэха нябёсных громаў
Безыменны Жах паўстаў з праклятага дна,
Вогнішча Ўдуну! Біч Балрага! Пякельная жара!
Ты ня пройдзеш! Ты ня пройдзеш!
Цень і Агонь зліліся ў бездані рык!
І ў цемры навекі знік

Латлорыйн змыў бруд, але не смутак душы
Люстэрка Вяшчункі паказала пажар у цішы
І вось Вялікі Андуйн імчыць да парогаў Раўроса
Расколатае Брацтва... Хаос... Воля жорсткага лёса.
Расколаты Рог. Яго погук заціх у імгле,
Сын Дэнэтара паў. Чорны човен знік у вадзе.

Фрода адзін... Верны Сэм — неадступна ўслед...
Наперадзе Мордар — каменны, вар'яцкі сусьвет.
Пярсцёнак цяжэе... Ён сэрца сціскае, як крукам...
"Ash nazg durbatulûk..." — адзываецца рэхам і гукам.`,
      en: `History became legend, legend faded into myth. Over the cozy Bag End under the Hill, a Mordor glyph hung. In the fire of Bilbo's home, where ale had been drunk for ages, A fiery script emerged from oblivion upon the Ring. This is not just gold — this is the blood and doom of kings. Isildur's Bane demands new sacrificial heads. Pack your bags, nephew! Leave your quiet corner. The "Simple Adventure" is over. The time of suffering approaches.

The One Ring, the Master — a noose around the Universe's neck. The Black Sun rises according to an ancient covenant. It pulls the soul into the wraith-world, where there is neither shadow nor day. Only the Eye... The Lidless Eye... and eternal turmoil. The One Ring...

On Amon Sûl, a broken stone recorded our pain. A Morgul blade rubbed grave salt into the wound. Athelas drew out the poison, but did not cure the horror. Now every rustle is the Enemy, every shadow is ruin. We have known the temper of Caradhras, fierce since the beginning of ages, But worse than the frost are the shadows of betrayal in the eyes of friends.

Moria... Khazad-dûm! The silence of dead dwarves! Here the darkness is older than the echo of heavenly thunder. A Nameless Terror rose from the accursed depths, Flame of Udûn! The Balrog’s scourge! Hellish heat! You shall not pass! You shall not pass! Shadow and Flame merged into an abyssal roar! And vanished forever into the dark.

Lothlórien washed away the dirt, but not the sorrow of the soul. The Seeress's Mirror showed fire in the silence. And now the Great Anduin rushes to the falls of Rauros. The Broken Fellowship... Chaos... The will of a cruel fate. The Cloven Horn. Its sound died away in the mist, The Son of Denethor has fallen. The black boat disappeared into the water.

Frodo is alone... Faithful Sam follows relentlessly... Ahead lies Mordor — a stony, insane world. The Ring grows heavier... It squeezes the heart like a hook... "Ash nazg durbatulûk..." — echoes back in sound.`,
    },
    stylePrompt:
      'atmospheric 1970s progressive rock, space rock, psychedelic, slow hypnotic tempo, ethereal male vocals, analog synthesizers, liquid electric guitar with delay and reverb, deep bass, cinematic, dark ambient, concept album style, Belarusian lyrics',
    lyricsPrompt: `[Instrumental Intro] [Psychedelic synth intro simulating the flowing of time] [Soft acoustic guitar turning into dissonant chords] [Whispering voices in Black Speech]

[Verse 1] (Vocals: Melancholic, slightly theatrical, recitative style)
Гісторыя стала легендай, легенда зтлела ў міф
Над утульнай торбай пад Стромай навіс мардараўскі гліф
У полымі дома у Більба, дьзе спрадвеку піўся эль
На пярсьтёнку праступіў зь нябыту вогненны вензэль
Гэта не проста золата — гэта кроў і згуба каралёў
Праклён Ісільдура патрабуе новых ахвярных галоў
Зьбірайся, пляменнік! Пакінь свой спакойны кут
Скончана "Проста Прыгода". Надыходьзіть час пакут.

[Chorus] (Vocals: Soaring, dramatic harmonies, Gilmour-esque)
Адзьіны Пярсьтёнак-гаспадар — пятля на шыі Сусьвету
Czорнае сонца ўзыходзіть паводле старажытнаха запавету
Ён тягне душу ў прывідны сьвет,  дьзе няма ні теню, ні дня
Толькі Вока... Бясьсоннае Вока... і веczная валтузьня
Адзьіны Пярсьтёнак...

[Interlude] [Sound of Nazgul screech (high pitched guitar)] [Chaos, dissonance]

[Verse 2] (Vocals: Tense, faster pace)
На Аман Сул разьбіты камень занатаваў наш боль
Моргульскі клінок уцёр у рану магільную соль
Атэлас вытягхнуў яд, але не вылеczыў жах
Тяпер кожны шолах — гэта Ворах, кожны тень — гхэта крах.
Мы зьведалі нораў Карадрасу, люты спакон вякоў,
Але гхорш за мароз — тені здрады ў ваczах сяброў.

[Bridge] (Style: Doom Rock, heavy, slow) (Vocals: Low, growling)
Морыя... Казад Дум! Маўczанне памерлых гномаў!
Тут темра старэйшая за рэха нябёсных громаў
Безыменны Жах паўстаў з праклятага дна,
Вогнішczа Ўдуну! Біcz Балрага! Пякельная жара!
Ты ня пройдьзеш! Ты ня пройдьзеш! Тень і Агонь зьліліся ў бездані рык!
І ў темры навекі зьнік сівы піліхрым-czараўнік...

[Instrumental Solo] [Complex synthesizer solo shifting into weeping guitar] [Odd time signature: 7/8]

[Verse 3] (Vocals: Sad, resigned, exhausted)
Латлорыйн змыў бруд, але не смутак душы
Люстэрка Вяшczункі паказала пажар у тішы
І вось Вялікі Андуйн імczыть да парогаў Раўроса
Расколатае Брацтва... Хаос... Воля жорсткага лёса.
Расколаты Рогх. Яго погук затіх у імгле,
Сын Дэнэтара паў. Czорны czовен зьнік у вадьзе.

[Outro] (Vocals: Fading, psychedelic echo)
Фрода адзьзін... Верны Сэм — неадступна ўсьлед...
Наперадьзе Мордар — каменны, вар'яцкі сусьвет.
Пярсьтёнак тяжэе... Ён сэрца сьтіскае, як крукам...
"Ash nazg durbatulûk..." — адзываецца рэхам і гукам.
[Sound of water flowing mixed with mechanical hammering] [Fade to black] [End]`,
  }),
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
      be: `А хто там ідзе, а хто там ідзе
У агромністай такой грамадзе?
— Беларусы.

А што яны нясуць на худых плячах,
На руках ў крыві, на нагах у лапцях?
— Сваю крыўду.

А куды ж нясуць гэту крыўду ўсю,
А куды ж нясуць на паказ сваю?
— На свет цэлы.

А хто гэта іх, не адзін мільён,
Крыўду несць наўчыў, разбудзіў іх сон?
— Бяда, гора.

А чаго ж, чаго захацелась ім,
Пагарджаным век, ім, сляпым, глухім?
— Людзьмі звацца.`,
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
