import type { Song } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ПЕСЬНІ / SONGS
 * ─────────────────────────────────────────────────────────────────────────
 *  Парадак у масіве = парадак на старонцы (1 — самая старая, зьверху).
 *  The array order is the page order (1 = oldest, shown first).
 *
 *  Як запоўніць карткі / How to fill a card — дадайце поля ў `overrides`:
 *
 *      song(7, 'kupala', 'Купала', 'Kupala', 'jpg', '7. Setivir - Kupala.mp3', {
 *        date: 'Сакавік 2025 / March 2025',
 *        model: 'Suno v4',
 *        lyricsAuthor: { be: 'Янка Купала', en: 'Yanka Kupala' },
 *        description: { be: '…', en: '…' },
 *        history:     { be: '…', en: '…' },
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
    history: {
      be: '[Гісторыя зьяўленьня — дадаць]',
      en: '[The story behind the song — add]',
    },
    stylePrompt: '[промпт стылю / style prompt]',
    lyricsPrompt: '[промпт тэксту / lyrics prompt]',
    ...overrides,
  }
}

export const songs: Song[] = [
  song(1, 'rodny-flou', 'Родны Флоў', 'Rodny Fłoŭ', 'jpg', '1. Setivir - Rodny Flou.mp3', {
    date: '08/17/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Аляксей Карытннік', en: 'Aliaksiej Karytnnik' },
    description: {
      be: 'Гэты трэк — ода-заклік да беларускай ідэнтычнасьці, што спалучае хвацкі рэп-флоў з адсылкамі да паэтаў, сьвятых і паўстанцаў, каб прасачыць жывую повязь ад фальклору да сучаснасьці.',
      en: 'This track is a rallying ode to Belarusian identity, fusing a hard-hitting rap flow with references to poets, saints, and rebels to trace a living lineage from folklore to the present.',
    },
    history: {
      be: 'Першапачаткова трэк павінен быў стаць дыялогам паміж беларускамоўным і расейскамоўным беларусамі, але ідэя трансфармавалася ў выніковы трэк.',
      en: 'Initially the track was meant to be a dialogue between a Belarusian-speaking and a Russian-speaking Belarusian, but the idea transformed into the final track.',
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
  song(14, 'dvaccaty', 'Дваццаты', 'Dvaccaty', 'jpg', '14. Setivir - Dvaccaty.mp3'),
  song(15, 'a-chto-tam-idzie', 'А хто там ідзе', 'A chto tam idzie', 'jpg', '15. Setivir - A chto tam idzie.mp3'),
  song(16, 'belarusian-rave', 'Беларускі рэйв', 'Belarusian Rave', 'jpg', '16. Setivir - Belarusian rave.mp3'),
  song(17, 'veczar-toj', 'Вечар той', 'Veczar Toj', 'jpg', '17. Setivir - Veczar Toj.mp3'),
  song(18, 'shto-kashtuje', 'Што каштуе', 'Što Kaštuje', 'jpg', '18. Setivir - Što Kaštuje.mp3'),
  song(19, 'mova-nanova', 'Мова Нанова', 'Mova Nanova', 'png', '19. Setivir - Mova Nanova.mp3'),
  song(20, 'mova-maci', 'Мова-Маці', 'Mova-Maci', 'png', '20. Setivir - Mova-Maci.mp3'),
]

/** True when a text field is still an unfilled "[…]" placeholder. */
export function isPlaceholder(text: string): boolean {
  return /^\s*\[.*\]\s*$/.test(text)
}
