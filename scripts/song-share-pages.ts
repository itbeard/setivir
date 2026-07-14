import { promises as fs, existsSync } from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { parseSongMarkdown } from '../src/lib/songMarkdown'

/**
 * Сацыяльныя краўлеры (Telegram, Facebook, Twitter…) не выконваюць JS і не
 * бачаць #hash — таму прэўю для хэш-спасылак `#song-<slug>` зрабіць нельга.
 * Гэты плагін пры зборцы генеруе статычную старонку `s/<slug>/index.html` на
 * кожную песьню: краўлер чытае зь яе og-тэгі (назва, апісаньне, вокладка),
 * а жывы наведвальнік адразу пераадрасоўваецца на `/#song-<slug>`.
 * useCopyTrackLink капіюе менавіта гэтыя спасылкі.
 *
 * Social scrapers need ABSOLUTE URLs — change the host if you deploy elsewhere.
 */
const ORIGIN = 'https://setivir.art'

const FALLBACK_DESCRIPTION =
  'Setivir — экспэрымэнтальны музычны праект, у якім песьні ствараюцца з дапамогай штучнага інтэлекту дзеля прасоўваньня беларускай культуры.'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Першы абзац markdown-апісаньня як адзін плэйн-тэкставы радок для og:description. */
function plainFirstParagraph(md: string, max = 200): string {
  const first = md.split(/\n\s*\n/)[0] ?? ''
  const text = first
    .replace(/^>\s?/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function pageHtml(opts: {
  base: string
  slug: string
  title: string
  description: string
  image: string
}): string {
  const { base, slug } = opts
  const title = escapeHtml(opts.title)
  const description = escapeHtml(opts.description)
  const target = `${base}#song-${slug}`
  return `<!doctype html>
<html lang="be">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="${base}favicon.png" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="${ORIGIN}${base}" />

  <meta property="og:type" content="music.song" />
  <meta property="og:site_name" content="Setivir" />
  <meta property="og:url" content="${ORIGIN}${base}s/${slug}/" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${escapeHtml(opts.image)}" />
  <meta name="twitter:card" content="summary_large_image" />

  <script>location.replace(${JSON.stringify(target)})</script>
</head>

<body>
  <p><a href="${target}">${title}</a></p>
</body>

</html>
`
}

export function songSharePages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'song-share-pages',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    async closeBundle() {
      const songsDir = path.resolve(config.root, 'src/data/songs')
      const outDir = path.resolve(config.root, config.build.outDir)
      const names = (await fs.readdir(songsDir)).filter((n) => n.endsWith('.md'))

      let count = 0
      for (const name of names) {
        const m = /^(\d+)-(.+)\.md$/.exec(name)
        if (!m) continue
        const id = Number(m[1])
        const slug = m[2]
        const parsed = parseSongMarkdown(
          await fs.readFile(path.join(songsDir, name), 'utf8'),
        )

        // Поўнапамерная вокладка ляжыць у public/thumbnails/<id>.{jpg,png}.
        const ext = ['jpg', 'png'].find((e) =>
          existsSync(path.join(config.publicDir, 'thumbnails', `${id}.${e}`)),
        )
        if (!ext) {
          this.warn(`[song-share-pages] no cover for "${slug}" (id ${id}), skipping`)
          continue
        }

        const be = parsed.title.be.trim()
        const en = parsed.title.en.trim()
        const title = `${be}${en && en !== be ? ` / ${en}` : ''} — Setivir`
        const description =
          plainFirstParagraph(parsed.description.be) || FALLBACK_DESCRIPTION

        const html = pageHtml({
          base: config.base,
          slug,
          title,
          description,
          image: `${ORIGIN}${config.base}thumbnails/${id}.${ext}`,
        })
        const dir = path.join(outDir, 's', slug)
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(path.join(dir, 'index.html'), html)
        count++
      }
      config.logger.info(`[song-share-pages] generated ${count} share pages`)
    },
  }
}
