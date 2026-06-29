# Setivir

A creative landing page for **Setivir** — an experimental AI-music project promoting
Belarusian culture. The site is a one-screen-per-song scroll experience: an intro, then
every song (oldest first) on its own full screen with its cover, story, description, the
AI model used, the lyrics author, generation prompts (under a cut), the creation date, and
a player. A persistent mini-player keeps the music going while you read.

- **Bilingual** — Belarusian (тарашкевіца / classical orthography) and English, auto-detected
  from the browser with a manual toggle (remembered between visits).
- **Minimalist gallery** aesthetic — warm paper, framed covers, an elegant serif, a single
  restrained Belarusian-red accent and a subtle вышыванка ornament.
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
- Covers: [`thumbnails/`](thumbnails/) — `1.jpg … 20.png`

Vite only serves/copies what lives under `public/`, so these two folders are **linked into
`public/`** automatically before every `dev` and `build` (by `scripts/link-assets.mjs`, run
via the `predev` / `prebuild` npm hooks). No manual step and no duplication — just drop new
files into `songs/` / `thumbnails/`, name the cover `<id>.jpg|png`, and add the entry in
`src/data/songs.ts`.

> Note: there is a stale, *different* recording `songs/14. Dvaccaty.mp3` (the site uses the
> newer `14. Setivir - Dvaccaty.mp3`). It's currently shipped in the build as ~5.5 MB of dead
> weight — move it out of `songs/` or delete it when you've decided which take to keep.

## Editing songs

All song content lives in **[`src/data/songs.ts`](src/data/songs.ts)**. Each entry has its
title pre-filled; everything else starts as a clearly-marked `[…]` placeholder (shown muted
on the site) for you to fill. Add fields via the `overrides` object:

```ts
song(7, 'kupala', 'Купала', 'Kupala', 'jpg', '7. Setivir - Kupala.mp3', {
  date: 'Сакавік 2025 / March 2025',
  model: 'Suno v4',
  lyricsAuthor: { be: 'Янка Купала', en: 'Yanka Kupala' },
  description: { be: '…', en: '…' },   // from Instagram
  history:     { be: '…', en: '…' },   // the story behind the song
  stylePrompt:  'ethnic belarusian folk, female vocal, …',
  lyricsPrompt: '…',
}),
```

The array order is the page order (1 = oldest, shown first). A couple of titles are marked
with `⚠` in the file — please verify the Cyrillic spelling/translation.

## Customizing

- **Colors / fonts / spacing** — design tokens in [`src/styles/theme.css`](src/styles/theme.css)
  (including a dark-mode block).
- **UI strings** — [`src/i18n/translations.ts`](src/i18n/translations.ts).
- **Project intro text** — the `hero.*` keys in the same file.

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

---

🤖 Project scaffolded with [Claude Code](https://claude.com/claude-code)
