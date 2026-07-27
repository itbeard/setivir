import { promises as fs, existsSync } from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { parseSongMarkdown, type ParsedSong } from '../src/lib/songMarkdown'

/**
 * SEO / GEO build plugin.
 *
 * Сайт — SPA: краўлеры бяз JS (сацыяльныя скрэйперы, GPTBot, ClaudeBot,
 * PerplexityBot…) ня бачаць кантэнту. Гэты плагін пры зборцы кампэнсуе гэта
 * статыкай:
 *
 *  1. `s/<slug>/index.html` на кожную песьню — поўны тэкст (апісаньне, тэкст
 *     песьні, факты) + og-тэгі + JSON-LD MusicRecording. Жывы наведвальнік
 *     адразу пераадрасоўваецца на `/#song-<slug>`; краўлер чытае старонку.
 *  2. JSON-LD (WebSite + MusicGroup з поўным сьпісам трэкаў) і <noscript>
 *     зьмест, што ўпырскваюцца ў галоўны index.html.
 *  3. `sitemap.xml` — галоўная + усе старонкі песень.
 *  4. `llms.txt` — «prompt-friendly» апісаньне праекту для ІІ-рухавікоў.
 *
 * Social scrapers need ABSOLUTE URLs — change the host if you deploy elsewhere.
 */
const ORIGIN = 'https://setivir.art'

const AUTHOR = {
  name: 'Aliaksei Kartynnik',
  nameBe: 'Аляксей Картыннік',
  url: 'https://itbeard.com',
}

const FALLBACK_DESCRIPTION =
  'Setivir — экспэрымэнтальны музычны праект, у якім песьні ствараюцца з дапамогай штучнага інтэлекту дзеля прасоўваньня беларускай культуры.'

const SITE_SUMMARY_BE =
  'Setivir («Музыка Тутэйшых») — экспэрымэнтальны музычны праект Аляксея Картынніка: беларуская паэтычная клясыка, фальклёр і аўтарскія тэксты, агучаныя ў суаўтарстве са штучным інтэлектам.'
const SITE_SUMMARY_EN =
  'Setivir ("Songs of the Tutejšyja") is an experimental AI-music project by Aliaksei Kartynnik: Belarusian classic poetry, folk songs and original lyrics set to music co-created with artificial intelligence.'

interface SongEntry {
  id: number
  slug: string
  parsed: ParsedSong
  /** Full-size cover extension under public/thumbnails/, if present. */
  coverExt?: string
  /** Audio filename under public/songs/, if present. */
  audioFile?: string
  /** ISO date (YYYY-MM-DD) parsed from the DD/MM/YYYY field, if valid. */
  isoDate?: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** True when a text field is still an unfilled "[…]" placeholder. */
function isPlaceholder(text: string): boolean {
  return /^\s*\[.*\]\s*$/.test(text)
}

function parseIsoDate(d: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d.trim())
  return m ? `${m[3]}-${m[2]}-${m[1]}` : undefined
}

/** Strip inline markdown to plain text: images → alt, links → text, no *_`. */
function stripInline(md: string): string {
  return md
    .replace(/^>\s?/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

/** Markdown → plain-text paragraphs (::: cut markers dropped, blocks kept). */
function mdParagraphs(md: string): string[] {
  const withoutCutMarkers = md
    .split(/\r?\n/)
    .filter((line) => !/^:::\s*/.test(line))
    .join('\n')
  return withoutCutMarkers
    .split(/\n\s*\n/)
    .map((p) => stripInline(p.replace(/\n/g, ' ')))
    .filter((p) => p.length > 0)
}

/** Першы абзац markdown-тэксту як адзін плэйн-тэкставы радок. */
function plainFirstParagraph(md: string, max = 200): string {
  const text = mdParagraphs(md)[0] ?? ''
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Lyrics (plain text with stanzas) → HTML paragraphs with line breaks. */
function lyricsHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((stanza) => `<p>${escapeHtml(stanza).replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

async function loadSongs(root: string, publicDir: string): Promise<SongEntry[]> {
  const songsDir = path.resolve(root, 'src/data/songs')
  const names = (await fs.readdir(songsDir)).filter((n) => n.endsWith('.md'))

  const audioDir = path.join(publicDir, 'songs')
  const audioFiles = existsSync(audioDir) ? await fs.readdir(audioDir) : []

  const entries: SongEntry[] = []
  for (const name of names) {
    const m = /^(\d+)-(.+)\.md$/.exec(name)
    if (!m) continue
    const id = Number(m[1])
    const slug = m[2]
    const parsed = parseSongMarkdown(await fs.readFile(path.join(songsDir, name), 'utf8'))

    const coverExt = ['jpg', 'png'].find((e) =>
      existsSync(path.join(publicDir, 'thumbnails', `${id}.${e}`)),
    )
    // Prefer the canonical "NN. Setivir - …" file over stray "NN. …" takes.
    const candidates = audioFiles.filter((f) => f.startsWith(`${id}. `))
    const audioFile =
      candidates.find((f) => f.includes('Setivir')) ?? candidates[0]

    entries.push({ id, slug, parsed, coverExt, audioFile, isoDate: parseIsoDate(parsed.date) })
  }
  return entries.sort((a, b) => a.id - b.id)
}

/** Bilingual display title: "Назва / Title" (en part only when it differs). */
function displayTitle(e: SongEntry): string {
  const be = e.parsed.title.be.trim()
  const en = e.parsed.title.en.trim()
  return `${be}${en && en !== be ? ` / ${en}` : ''}`
}

function songUrl(base: string, e: SongEntry): string {
  return `${ORIGIN}${base}s/${e.slug}/`
}

function coverUrl(base: string, e: SongEntry): string | undefined {
  return e.coverExt ? `${ORIGIN}${base}thumbnails/${e.id}.${e.coverExt}` : undefined
}

function audioUrl(base: string, e: SongEntry): string | undefined {
  return e.audioFile ? `${ORIGIN}${base}songs/${encodeURIComponent(e.audioFile)}` : undefined
}

function songRecordingJsonLd(base: string, e: SongEntry): object {
  const lyricist = e.parsed.lyricsAuthor.en.trim() || e.parsed.lyricsAuthor.be.trim()
  const rec: Record<string, unknown> = {
    '@type': 'MusicRecording',
    name: e.parsed.title.be.trim(),
    url: songUrl(base, e),
    inLanguage: 'be',
    byArtist: { '@type': 'MusicGroup', name: 'Setivir', url: `${ORIGIN}${base}` },
  }
  const en = e.parsed.title.en.trim()
  if (en && en !== rec.name) rec.alternateName = en
  if (e.isoDate) rec.datePublished = e.isoDate
  const img = coverUrl(base, e)
  if (img) rec.image = img
  const audio = audioUrl(base, e)
  if (audio) rec.audio = { '@type': 'AudioObject', contentUrl: audio, encodingFormat: 'audio/mpeg' }
  if (lyricist && !isPlaceholder(lyricist)) rec.lyricist = { '@type': 'Person', name: lyricist }
  const desc = plainFirstParagraph(e.parsed.description.en) || plainFirstParagraph(e.parsed.description.be)
  if (desc) rec.description = desc
  return rec
}

function sharePageHtml(base: string, e: SongEntry): string {
  const slug = e.slug
  const title = `${displayTitle(e)} — Setivir`
  const description = plainFirstParagraph(e.parsed.description.be) || FALLBACK_DESCRIPTION
  const target = `${base}#song-${slug}`
  const url = songUrl(base, e)
  const image = coverUrl(base, e)
  const audio = audioUrl(base, e)

  const facts: string[] = []
  if (e.parsed.date && !isPlaceholder(e.parsed.date))
    facts.push(`<li>Дата / Date: ${escapeHtml(e.parsed.date)}</li>`)
  if (e.parsed.model && !isPlaceholder(e.parsed.model))
    facts.push(`<li>Мадэль / Model: ${escapeHtml(e.parsed.model)}</li>`)
  const author = e.parsed.lyricsAuthor.be.trim()
  const authorEn = e.parsed.lyricsAuthor.en.trim()
  if (author && !isPlaceholder(author))
    facts.push(
      `<li>Аўтар тэксту / Lyrics author: ${escapeHtml(author)}${authorEn && authorEn !== author ? ` / ${escapeHtml(authorEn)}` : ''}</li>`,
    )

  const section = (heading: string, html: string): string =>
    html ? `  <section>\n    <h2>${heading}</h2>\n${html}\n  </section>` : ''
  const paras = (md: string): string =>
    mdParagraphs(md)
      .map((p) => `    <p>${escapeHtml(p)}</p>`)
      .join('\n')

  const sections = [
    section('Апісаньне', paras(e.parsed.description.be)),
    section('Description', paras(e.parsed.description.en)),
    section('Тэкст песьні', isPlaceholder(e.parsed.lyrics.be) ? '' : lyricsHtml(e.parsed.lyrics.be)),
    section(
      'Lyrics (English translation)',
      isPlaceholder(e.parsed.lyrics.en) || e.parsed.lyrics.en.trim() === e.parsed.lyrics.be.trim()
        ? ''
        : lyricsHtml(e.parsed.lyrics.en),
    ),
  ]
    .filter(Boolean)
    .join('\n')

  const jsonLd = JSON.stringify(
    { '@context': 'https://schema.org', ...songRecordingJsonLd(base, e) },
    null,
    0,
  )

  return `<!doctype html>
<html lang="be">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="${base}favicon.png" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="music.song" />
  <meta property="og:site_name" content="Setivir" />
  <meta property="og:locale" content="be_BY" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
${image ? `  <meta property="og:image" content="${escapeHtml(image)}" />\n` : ''}${audio ? `  <meta property="og:audio" content="${escapeHtml(audio)}" />\n` : ''}${e.isoDate ? `  <meta property="music:release_date" content="${e.isoDate}" />\n` : ''}  <meta property="music:musician" content="${ORIGIN}${base}" />
  <meta name="twitter:card" content="summary_large_image" />

  <script type="application/ld+json">${jsonLd}</script>
  <script>location.replace(${JSON.stringify(target)})</script>
</head>

<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p><a href="${target}">► Слухаць на setivir.art / Listen on setivir.art</a></p>
${facts.length ? `    <ul>\n      ${facts.join('\n      ')}\n    </ul>\n` : ''}${sections}
  </main>
</body>

</html>
`
}

/** JSON-LD graph for the main page: WebSite + Person + MusicGroup with tracks. */
function indexJsonLd(base: string, entries: SongEntry[]): string {
  const url = `${ORIGIN}${base}`
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: 'Setivir',
        alternateName: 'Setivir — Музыка Тутэйшых / Songs of the Tutejšyja',
        description: SITE_SUMMARY_EN,
        inLanguage: ['be', 'en'],
      },
      {
        '@type': 'Person',
        '@id': `${AUTHOR.url}/#person`,
        name: AUTHOR.name,
        alternateName: AUTHOR.nameBe,
        url: AUTHOR.url,
      },
      {
        '@type': 'MusicGroup',
        '@id': `${url}#artist`,
        name: 'Setivir',
        url,
        image: `${ORIGIN}${base}logo.jpg`,
        description: SITE_SUMMARY_EN,
        foundingDate: '2025',
        founder: { '@id': `${AUTHOR.url}/#person` },
        track: {
          '@type': 'ItemList',
          numberOfItems: entries.length,
          itemListElement: entries.map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: songRecordingJsonLd(base, e),
          })),
        },
      },
    ],
  }
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`
}

/** Static fallback content for crawlers and browsers without JS. */
function noscriptHtml(base: string, entries: SongEntry[]): string {
  const items = entries
    .map((e) => {
      const date = e.isoDate ? ` (${e.isoDate})` : ''
      return `        <li><a href="${base}s/${e.slug}/">${escapeHtml(displayTitle(e))}</a>${date}</li>`
    })
    .join('\n')
  return `<noscript>
      <main>
        <h1>Setivir — Музыка Тутэйшых / Songs of the Tutejšyja</h1>
        <p>${escapeHtml(SITE_SUMMARY_BE)}</p>
        <p>${escapeHtml(SITE_SUMMARY_EN)}</p>
        <h2>Песьні / Songs</h2>
        <ul>
${items}
        </ul>
        <p><a href="${AUTHOR.url}">${escapeHtml(AUTHOR.nameBe)} / ${escapeHtml(AUTHOR.name)}</a></p>
      </main>
    </noscript>`
}

function sitemapXml(base: string, entries: SongEntry[]): string {
  const lastmod = entries.map((e) => e.isoDate).filter(Boolean).sort().pop()
  const urls = [
    `  <url>\n    <loc>${ORIGIN}${base}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <priority>1.0</priority>\n  </url>`,
    ...entries.map(
      (e) =>
        `  <url>\n    <loc>${songUrl(base, e)}</loc>\n${e.isoDate ? `    <lastmod>${e.isoDate}</lastmod>\n` : ''}    <priority>0.7</priority>\n  </url>`,
    ),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

/** llms.txt — a prompt-friendly map of the site for generative engines. */
function llmsTxt(base: string, entries: SongEntry[]): string {
  const url = `${ORIGIN}${base}`
  const dates = entries.map((e) => e.isoDate).filter((d): d is string => Boolean(d)).sort()
  const first = dates[0]
  const last = dates[dates.length - 1]

  const songLines = entries.map((e) => {
    const bits = [
      e.isoDate ? `released ${e.isoDate}` : '',
      e.parsed.model && !isPlaceholder(e.parsed.model) ? `model ${e.parsed.model}` : '',
    ].filter(Boolean)
    const desc =
      plainFirstParagraph(e.parsed.description.en, 160) ||
      plainFirstParagraph(e.parsed.description.be, 160)
    return `- [${displayTitle(e)}](${songUrl(base, e)})${bits.length ? `: ${bits.join(', ')}` : ''}${desc ? ` — ${desc}` : ''}`
  })

  return `# Setivir

> ${SITE_SUMMARY_EN} Па-беларуску: ${SITE_SUMMARY_BE}

Key facts:

- Author and producer: ${AUTHOR.name} (${AUTHOR.nameBe}), ${AUTHOR.url}
- ${entries.length} tracks released${first ? ` between ${first} and ${last}` : ''}; new songs are added over time
- Lyrics: Belarusian classic poetry (Yanka Kupala, Yakub Kolas, Uladzimir Karatkievich and others), folk songs, and original texts by the author; borrowed texts are only lightly adapted, never rewritten
- Melody and vocals are generated with AI (Suno); the author curates generations, fixes flaws and acts as producer
- The site is bilingual: Belarusian (taraškievica, classical orthography) and English
- Every song page has the full story, lyrics, translation notes and the AI generation prompts
- All music is free to listen on the site

## Songs

${songLines.join('\n')}

## Links

- [Setivir — main page](${url})
- [Author's site](${AUTHOR.url})
`
}

export function seoPages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },

    // Inject JSON-LD + <noscript> fallback into the main index.html.
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        const entries = await loadSongs(config.root, config.publicDir)
        return html
          .replace('</head>', `  ${indexJsonLd(config.base, entries)}\n</head>`)
          .replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscriptHtml(config.base, entries)}`)
      },
    },

    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const entries = await loadSongs(config.root, config.publicDir)

      let count = 0
      for (const e of entries) {
        if (!e.coverExt) {
          this.warn(`[seo-pages] no cover for "${e.slug}" (id ${e.id}), skipping share page`)
          continue
        }
        const dir = path.join(outDir, 's', e.slug)
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(path.join(dir, 'index.html'), sharePageHtml(config.base, e))
        count++
      }

      await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemapXml(config.base, entries))
      await fs.writeFile(path.join(outDir, 'llms.txt'), llmsTxt(config.base, entries))
      config.logger.info(
        `[seo-pages] generated ${count} song pages, sitemap.xml and llms.txt`,
      )
    },
  }
}
