// Shared realistic sample data for the design-sync preview cards.
// Content is drawn from the repo's real song files (тарашкевіца), trimmed to
// representative excerpts so cards stay readable. Imported by the preview
// .tsx files; not a component itself (name doesn't start uppercase / .ts).
import type { Song } from '../../src/types'

// Note: cover images don't load in preview cards (the app serves them at
// /thumbnails/*; the DS bundle doesn't ship them). The cover frame renders
// empty — see NOTES.md.
function mk(
  id: number,
  slug: string,
  title: { be: string; en: string },
  extra: Partial<Song> = {},
): Song {
  return {
    id,
    slug,
    title,
    audio: `songs/${id}. Setivir - ${title.en}.mp3`,
    cover: `thumbnails/${id}.jpg`,
    date: '17/08/2025',
    model: 'Suno v4.5+',
    lyricsAuthor: { be: 'Аляксей Картыннік', en: 'Aliaksei Kartynnik' },
    description: {
      be: 'Кампазыцыя, якая спалучае беларускую паэтычную спадчыну з мовай сучаснага гуку.',
      en: 'A composition fusing Belarusian poetic heritage with the language of contemporary sound.',
    },
    lyrics: { be: '[Прыпеў]\n…', en: '[Chorus]\n…' },
    stylePrompt: 'A Belarusian track with folk-inspired melodies and modern production.',
    lyricsPrompt: '[Куплет 1]\n…',
    ...extra,
  }
}

/** The flagship track — full, rich content for the detailed cards. */
export const RODNY: Song = mk(
  1,
  'rodny-flou',
  { be: 'Родны Флоў', en: 'Rodny Fłoŭ' },
  {
    description: {
      be: 'Гэты трэк — ода-заклік да беларускай ідэнтычнасьці, што спалучае хвацкі рэп-флоў з адсылкамі да паэтаў, сьвятых і паўстанцаў, каб прасачыць жывую повязь ад фальклору да сучаснасьці.\n\nПершапачаткова трэк павінен быў стаць дыялогам паміж беларускамоўным і расейскамоўным беларусамі, але ідэя трансфармавалася ў выніковы трэк.',
      en: 'This track is a rallying ode to Belarusian identity, fusing a hard-hitting rap flow with references to poets, saints, and rebels to trace a living lineage from folklore to the present.\n\nInitially the track was meant to be a dialogue between a Belarusian-speaking and a Russian-speaking Belarusian, but the idea transformed into the final track.',
    },
    lyrics: {
      be: 'Гэй, паслухай, гэта твой родны флоў,\nЦі не забыўся ты яго, ад прадзедаў спакон вякоў.\nЧуеш нашу мову? То ж надта стылёва.\nДы гэта скарб, які не страцім ні пры якіх умовах.\n\n[Куплет]\nЗа гонар, за праўду, за кут, што нам так мілы,\nЗабыць які даўно не маем мы ніякай сілы.\nКупала ды Колас даўно цякуць у нашых венах,\nТаму не знікне наш дух галактычных памераў.',
      en: 'Hey, listen — this is your native flow,\nHaven’t you forgotten it, from forefathers since time immemorial?\nDo you hear our language? That’s truly stylish.\nAnd it’s a treasure we won’t lose under any circumstances.\n\n[Verse]\nFor honor, for truth, for the nook that is so dear to us,\nWhich we’ve long had no power to forget.\nKupala and Kolas have long flowed in our veins,\nSo our spirit of galactic size will not vanish.',
    },
    stylePrompt:
      'A Belarusian rap track features rapid-fire verses over dark, moody synths and punchy 808s, grounded by folk-inspired melodies sampled from traditional Belarusian instruments. The chorus layers melodic hooks and vocal harmonies, while bridging sections use sparse beats and atmospheric pads.',
    lyricsPrompt:
      '[Куплет 1]\nГэй, паслухай, гэта твой родны флоў,\nЦі не забыўся ты яго, ад прАдзедаў спакон вяк-о-оў.\nЧуеш нашу мову? Тож надта стылёва,\nДы гэта скарб, які не страцім ні пры якІх умовах.',
  },
)

/** A handful of tracks for list/nav components (newest-first, like the site). */
export const SONGS: Song[] = [
  mk(20, 'mova-maci', { be: 'Мова-Маці', en: 'Mova-Maci' }),
  mk(19, 'mova-nanova', { be: 'Мова Нанова', en: 'Mova Nanova' }),
  mk(16, 'belarusian-rave', { be: 'Беларускі Рэйв', en: 'Belarusian Rave' }),
  mk(7, 'kupala', { be: 'Купала', en: 'Kupala' }),
  mk(6, 'kalykhanka', { be: 'Калыханка', en: 'Kalykhanka' }),
  RODNY,
]
