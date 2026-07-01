import type { Song } from '../types'
import { parseSongMarkdown } from '../lib/songMarkdown'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ПЕСЬНІ / SONGS
 * ─────────────────────────────────────────────────────────────────────────
 *  Тэкставы кантэнт кожнай песьні жыве ў асобным Markdown-файле ў ./songs/,
 *  адзін файл на песьню, з назвай `NN-slug.md` (NN = id = нумар трэку).
 *  Рэдагуйце гэтыя .md-файлы — палі пазначаюцца загалоўкамі, мовы — падзагалоўкамі
 *  `## be` / `## en`. Апісаньне падтрымлівае markdown: **тлусты**, *курсіў*,
 *  [спасылкі](https://…) і абзацы (пусты радок = новы абзац).
 *
 *  The editable text of every song lives in a separate Markdown file under
 *  ./songs/ (one per song, named `NN-slug.md`). Only the technical file plumbing
 *  — cover extension and audio filename — is kept here, keyed by slug.
 *
 *  Каб дадаць песьню / To add a song:
 *    1. Стварыце ./songs/NN-slug.md (скапіюйце структуру існага файла).
 *    2. Дадайце радок у ASSETS ніжэй з пашырэньнем вокладкі і назвай mp3.
 *  На старонцы трэкі паказваюцца ад навейшых да старэйшых (разварот у App.tsx).
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Тэхнічная плюмбага па-за markdown: пашырэньне вокладкі + назва аўдыёфайла. */
const ASSETS: Record<string, { ext: string; audio: string }> = {
  'rodny-flou': { ext: 'jpg', audio: "1. Setivir - Rodny Flou.mp3" },
  'muzhyk-belarus': { ext: 'png', audio: "2. Setivir - Muzjik-Belarus.mp3" },
  'laceli': { ext: 'jpg', audio: "3. Setivir - Laceli.mp3" },
  'rano-rano': { ext: 'jpg', audio: "4. Setivir - Rano-rano.mp3" },
  'bau-bai': { ext: 'jpg', audio: "5. Setivir - Bau-bai.mp3" },
  'kalykhanka': { ext: 'jpg', audio: "6. Setivir - Kalykhanka.mp3" },
  'kupala': { ext: 'jpg', audio: "7. Setivir - Kupala.mp3" },
  'to-to-to': { ext: 'jpg', audio: "8. Setivir - To-to-to.mp3" },
  'bitaya': { ext: 'jpg', audio: "9. Setivir - Bitaya.mp3" },
  'cichaja-noc': { ext: 'jpg', audio: "10. Setivir - Cichaja noс.mp3" },
  'khto-ya': { ext: 'jpg', audio: "11. Setivir - Khto ya.mp3" },
  'dzed-baradzed': { ext: 'jpg', audio: "12. Setivir - Dzed-baradzed.mp3" },
  'zviaz-piarscionka': { ext: 'jpg', audio: "13. Setivir - Zviaz piarscionka.mp3" },
  'dvaccaty': { ext: 'jpg', audio: "14. Setivir - Dvaccaty.mp3" },
  'a-chto-tam-idzie': { ext: 'jpg', audio: "15. Setivir - A chto tam idzie.mp3" },
  'veczar-toj': { ext: 'jpg', audio: "17. Setivir - Veczar Toj.mp3" },
  'belarusian-rave': { ext: 'jpg', audio: "16. Setivir - Belarusian rave.mp3" },
  'shto-kashtuje': { ext: 'jpg', audio: "18. Setivir - Što Kaštuje.mp3" },
  'mova-maci': { ext: 'png', audio: "20. Setivir - Mova-Maci.mp3" },
  'mova-nanova': { ext: 'png', audio: "19. Setivir - Mova Nanova.mp3" },
}

// Raw markdown of every song, loaded at build time (Vite import.meta.glob).
const files = import.meta.glob('./songs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function buildSongs(): Song[] {
  const list: Song[] = []
  for (const [path, raw] of Object.entries(files)) {
    const name = path.split('/').pop() ?? ''
    const m = /^(\d+)-(.+)\.md$/.exec(name)
    if (!m) {
      console.warn(`[songs] skipping unexpected file name: ${name}`)
      continue
    }
    const id = Number(m[1])
    const slug = m[2]
    const asset = ASSETS[slug]
    if (!asset) {
      console.warn(`[songs] no ASSETS entry for slug "${slug}" (${name})`)
      continue
    }
    const f = parseSongMarkdown(raw)
    list.push({
      id,
      slug,
      title: f.title,
      audio: `songs/${asset.audio}`,
      cover: `thumbnails/${id}.${asset.ext}`,
      date: f.date,
      model: f.model,
      lyricsAuthor: f.lyricsAuthor,
      description: f.description,
      lyrics: f.lyrics,
      stylePrompt: f.stylePrompt,
      lyricsPrompt: f.lyricsPrompt,
    })
  }
  return list.sort((a, b) => a.id - b.id)
}

export const songs: Song[] = buildSongs()

/** True when a text field is still an unfilled "[…]" placeholder. */
export function isPlaceholder(text: string): boolean {
  return /^\s*\[.*\]\s*$/.test(text)
}
