# Setivir

A creative landing page for **Setivir** — an experimental AI-music project promoting
Belarusian culture. The site is a one-screen-per-song scroll experience: an intro, then
every song (oldest first) on its own full screen with its cover, story, description, the
AI model used, the lyrics author, notes on the lyrics, generation prompts (under a cut),
the creation date, and a player — followed by an outro. A persistent mini-player keeps
the music going while you read, auto-advancing through the playlist.

- **Bilingual** — Belarusian (тарашкевіца / classical orthography) and English, auto-detected
  from the browser with a manual toggle (remembered between visits).
- **Minimalist gallery** aesthetic — warm paper, framed covers, an elegant serif, a single
  restrained Belarusian-red accent and a subtle вышыванка ornament.
- **Audio-reactive cover visualizers** — ember sparks by default, with per-song alternatives
  (bars, Orion constellation, lightning) driven by a shared spectral-flux beat tracker.
- **Track order toggle** — chronological or newest-first, switched in the outro section and
  remembered in `localStorage`.
- **Responsive** — desktop and mobile.
- Built with **React + TypeScript + Vite**.

## Quick start

```bash
npm install      # already done once
npm run dev      # local dev server (http://localhost:5173)
npm run build    # type-check + production build → dist/
npm run preview  # serve the built site locally
```

## Where the media lives

- Audio: [`songs/`](songs/) — `*.mp3`
- Covers: [`thumbnails/`](thumbnails/) — `<id>.jpg|png` originals, plus generated
  lightweight copies in `thumbnails/small/` (used in the feed; the originals are shown in
  the image lightbox). Regenerate the small copies with `npm run thumbs` after adding a cover.

Vite only serves/copies what lives under `public/`, so these folders are **linked into
`public/`** automatically before every `dev` and `build` (by `scripts/link-assets.mjs`, run
via the `predev` / `prebuild` npm hooks). No manual step and no duplication.

> Note: there is a stale, *different* recording `songs/14. Dvaccaty.mp3` (the site uses the
> newer `14. Setivir - Dvaccaty.mp3`). It's currently shipped in the build as ~5.5 MB of dead
> weight — move it out of `songs/` or delete it when you've decided which take to keep.

## Editing songs

The text content of every song lives in its own Markdown file under
**[`src/data/songs/`](src/data/songs/)**, named `NN-slug.md` (NN = track number). Fields are
marked by `# Heading` sections, languages by `## be` / `## en` subheadings:

```md
# Назва / Title          # Дата / Date            # Мадэль / Model
# Аўтар тэксту / Lyrics author
# Апісаньне / Description
# Тэкст песьні / Lyrics
# Заўвагі да тэксту / Notes on the lyrics
# Промпт стылю / Style prompt
# Промпт тэксту / Lyrics prompt
```

The prose fields support Markdown: **bold**, *italic*, links, lists, quotes, images (opened
in a zoomable lightbox), embedded YouTube videos, and `::: cut Title … :::` collapsible
sections (see [`src/lib/markdown.tsx`](src/lib/markdown.tsx)).

**[`src/data/songs.ts`](src/data/songs.ts)** keeps only the technical plumbing — the `ASSETS`
map with each song's cover extension, audio filename, and optional `viz` visualizer key
(from [`src/components/visualizers/registry.ts`](src/components/visualizers/registry.ts)).

To add a song:

1. Create `src/data/songs/NN-slug.md` (copy the structure of an existing file).
2. Add a line to `ASSETS` in `src/data/songs.ts` with the cover extension and mp3 name.
3. Drop the audio into `songs/`, the cover into `thumbnails/NN.jpg|png`, and run
   `npm run thumbs`.

## Customizing

- **Intro / outro text** — [`src/data/site.md`](src/data/site.md), same field-under-heading
  format as the song files.
- **Colors / fonts / spacing** — design tokens in [`src/styles/theme.css`](src/styles/theme.css)
  (including a dark-mode block).
- **UI strings** — [`src/i18n/translations.ts`](src/i18n/translations.ts).

## Deploying

The site is fully static (`dist/`) — host it anywhere (Netlify, Cloudflare Pages, GitHub
Pages, …).

- **GitHub Pages** under `https://itbeard.github.io/setivir/`: a ready CI workflow at
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on every
  push to `main` — just enable *Settings → Pages → Source: GitHub Actions*. It builds with
  `npm run build:pages` (sets the `/setivir/` base path) on Linux, which also catches asset
  path bugs that macOS hides. To build the Pages bundle locally: `npm run build:pages`.
- **Custom domain / root host**: plain `npm run build` (base `/`) is correct.
- **Social previews**: `og:image` / `og:url` in [`index.html`](index.html) point at the
  GitHub Pages URL — change the host if you deploy elsewhere (scrapers need absolute URLs).

## SEO / GEO

The site is a SPA, so crawlers that don't run JS (social scrapers, GPTBot, ClaudeBot,
PerplexityBot…) can't see the React-rendered content. The build compensates with static
output, generated by [`scripts/seo-pages.ts`](scripts/seo-pages.ts) from the song Markdown:

- **`s/<slug>/index.html`** — a static page per song with the full description, lyrics,
  facts (date, model, lyrics author), Open Graph tags and `MusicRecording` JSON-LD.
  Human visitors are instantly redirected to `/#song-<slug>`; crawlers read the content.
- **JSON-LD + `<noscript>`** injected into the main `index.html`: `WebSite` +
  `MusicGroup` schema with the complete track list, and a plain-HTML fallback.
- **`sitemap.xml`** — the main page plus every song page, with `lastmod` from song dates.
- **`llms.txt`** — a prompt-friendly map of the project for generative engines.
- **[`public/robots.txt`](public/robots.txt)** explicitly allows the AI crawlers and
  points at the sitemap. The hard-coded origin (`https://setivir.art`) lives at the top
  of `scripts/seo-pages.ts` — change it if you deploy elsewhere.

Google Analytics (gtag) is wired in [`index.html`](index.html).

---

🤖 Project scaffolded with [Claude Code](https://claude.com/claude-code)
