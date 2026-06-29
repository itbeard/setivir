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
  song(1, 'rodny-flou', 'Родны Флоў', 'Rodny Flou', 'jpg', '1. Setivir - Rodny Flou.mp3'),
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
