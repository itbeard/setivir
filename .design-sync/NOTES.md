# design-sync notes — Setivir

Repo-specific gotchas for future syncs. This is a **landing-page app**, not a
component library, so the sync uses a hand-authored barrel entry rather than a
shipped package entry.

## Build wiring (how this repo is made syncable)

- **No package entry / no shipped `.d.ts`.** `package.json` has no
  `main`/`module`/`exports`, and `dist/` is the bundled Vite *app*, not a
  library. So we bundle a hand-authored barrel: `.design-sync/ds-entry.tsx`
  (wired as `cfg.entry`). It re-exports the 12 components + the two context
  providers (`I18nProvider`, `PlayerProvider`) and imports the tokens/base CSS.
  It deliberately omits `main.tsx` (mounts the app — would run `ReactDOM.render`
  at bundle eval) and `App.tsx`.
- **Props are hand-written** in `cfg.dtsPropsFor` (there's no `.d.ts` to extract
  from). If a component's props change in `src/`, update `dtsPropsFor` to match.
  The `Song` shape is inlined in several of them.
- **`import.meta.glob` stub.** `src/data/songs.ts` calls Vite's
  `import.meta.glob(...)` at module top-level, which esbuild can't evaluate
  (would crash the whole IIFE). Three components import only `isPlaceholder`
  from it, so `cfg.tsconfig` (`.design-sync/tsconfig.esbuild.json`) aliases
  `"../data/songs"` → `.design-sync/shims/songs.ts` (a stub with just
  `isPlaceholder` + empty `songs`). If the components ever import more from
  `data/songs`, extend the stub.
- **tsconfig `//` gotcha.** The converter's tsconfig comment-stripper mangles a
  `"//"` JSON key (strips to end of line) and silently drops the paths plugin →
  the stub is ignored and the real `songs.ts` bundles (watch for the
  `import.meta.glob ... iife` esbuild warning). Keep
  `.design-sync/tsconfig.esbuild.json` free of `//`-containing keys/values.
- **JSX**: `cfg.tsconfig` sets `"jsx": "react-jsx"` so esbuild uses the
  automatic runtime (imports `react/jsx-runtime`, shimmed to `window.React`).
  Without it esbuild would emit classic `React.createElement` and break.
- **`site.md?raw` shim (added 2026-07-14).** `src/data/site.ts` now loads the
  Hero/Outro prose via Vite's `import raw from './site.md?raw'` — esbuild has
  no `?raw` loader, so `cfg.tsconfig` paths alias the exact specifier
  `"./site.md?raw"` → `.design-sync/shims/site-raw.ts`, a GENERATED module
  holding the file's text. **Regenerate it before every build**:
  `node .design-sync/gen-site-shim.mjs` — otherwise the Hero/Outro cards show
  stale prose. (The tsconfig-paths plugin matches import specifiers verbatim,
  including the `?raw` query, so the alias works despite being "relative".)
- **Headless browser**: no ms-playwright cache on this machine anymore — the
  validate/capture scripts honor `DS_CHROMIUM_PATH`; point it at the system
  Chrome: `export DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.

## CSS / fonts

- Tokens = `src/styles/theme.css` (imported by the barrel → `_ds_bundle.css`).
- Base/reset/body/utilities = `.design-sync/base.css` (imported by the barrel).
  It is `src/styles/global.css` **minus** its leading `@import './theme.css'`
  (would dangle inside `_ds_bundle.css` and fail validation) and **minus** the
  `@font-face` block (esbuild has no `.ttf` loader). **Re-sync risk:** keep
  `base.css` in step with `global.css` if that file changes.
- Brand font `Dobrozrachniy` (`src/assets/font.ttf`) ships via
  `cfg.extraFonts: "src/styles/global.css"` → the converter's font pipeline
  copies the ttf to `fonts/` and emits `fonts/fonts.css`.

## Known render warns (triaged, benign)

- **[RENDER_THIN] SocialLinks** — "mounts have no text and paint nothing". False
  positive: the validator's paint check tests `tagName` against uppercase `SVG`,
  but inline SVG elements have lowercase `svg` tagName, so the (real, rendered)
  icons don't register as painting. The icons DO render — confirmed in the
  review sheet. Ignore this warn on SocialLinks.

- **[FONT_MISSING] Inter, JetBrains Mono, Cormorant Garamond, Iowan Old Style** —
  these are *fallback* families in the font stacks (`--font-body`,
  `--font-display`, `--font-mono`). The site itself does NOT bundle them; it
  relies on system/UA fallback (system-ui / serif / monospace). Previews render
  with those fallbacks and look correct. Accepted substitutes — only the brand
  face (Dobrozrachniy) is actually shipped. Revisit only if the user wants the
  webfonts bundled.

## Build-order gotcha

- After editing `cfg.overrides` / `cfg.titleMap` (or any config that changes a
  component's grade-key slice), run a full `package-build.mjs` BEFORE any scoped
  `preview-rebuild.mjs --components …` — otherwise `preview-rebuild` aborts with
  `[CONFIG_STALE]` (it won't re-stamp grade keys while a target's live override
  slice differs from the stamped `.ds-build-meta.json`). During the fan-out,
  finalize all `cfg.overrides` first, do the full build, THEN let scoped
  rebuilds/captures run.

## Preview-authoring tips (from the fan-out)

- Fixed-position components (`position: fixed` — MiniPlayer, TopBar, ProgressNav)
  need a **transformed sized container** in the preview to become their
  containing block: `<div style={{position:'relative', transform:'translateZ(0)',
  height:H, width:'100%'}}>`. Otherwise the bar collapses/clips.
- To seed player state (MiniPlayer "now playing"), call `toggle()` inside a
  `setTimeout(…, 0)` in a useEffect — an immediate call fires before the
  provider's own mount effect creates the shared `<audio>` element and no-ops.
- To force a native `<details>` open in a static card (PromptDisclosure), use a
  ref + useEffect that sets `.open = true` (the component has no `open` prop).
- For `opacity:0` / `z-index:-1` visual layers (CoverWave), keep the container
  background transparent so the layer paints on the page, and pass the prop that
  makes it visible (`playing`).
- ProgressNav is desktop-only: it's `display:none` below 1025px wide or ≤760px
  tall — its card needs `viewport ≥ 1025 × > 760` (set in cfg.overrides).

## Visualizers (replaced CoverWave, 2026-07-14)

- `CoverWave` was replaced in-source by a pluggable system: `CoverViz`
  (dispatcher, `{song, playing}`) + `EmbersViz` / `LightningViz` / `BarsViz` /
  `OrionViz` (each `{playing: boolean}`, registry in
  `src/components/visualizers/registry.ts`, default `embers`). All five are
  exported and synced (group `visualizers`).
- All need `PlayerProvider` (they call `usePlayer().getAnalyser()`), a sized
  `position:relative` TRANSPARENT container, and `playing={true}` — the `.aura`
  is `opacity:0` otherwise (OrionViz renders nothing at all when not playing).
- **Static (no-analyser) states**, which is what preview cards show:
  Bars → resting radial bars; Orion → one still night-sky frame;
  Embers/Lightning → only the soft red glow (sparks/strikes need live audio),
  so their two cards look near-identical at rest — expected, documented in the
  preview comments; the `.prompt.md`s describe the animated difference.

## Preview limitations

- **Cover images don't resolve in previews.** Components call
  `assetUrl(song.cover)` → `/thumbnails/N.jpg`, an app asset not shipped with
  the DS (and `assetUrl` prepends `/`, so a data-URI can't be substituted). The
  cover frame renders empty in MiniPlayer/SongScreen previews; the rest of the
  layout/typography is faithful.
- **MiniPlayer** renders `null` until a track is "playing" — its preview seeds a
  current track via a small on-mount harness that calls `usePlayer().toggle()`.

## Re-sync risks (what can silently go stale)

- **`base.css`** is a hand-maintained copy of `src/styles/global.css` (minus its
  `@import './theme.css'` and `@font-face`). If `global.css` changes (new resets,
  body styles, utility classes, or a font swap), regenerate `base.css` to match.
- **`cfg.dtsPropsFor`** props are hand-written with an inlined `Song` shape.
  If a component's props change in `src/components/`, or the `Song` type in
  `src/types.ts` changes, update the matching `dtsPropsFor` entry — nothing
  cross-checks these against the source.
- **`shims/songs.ts`** only re-exports `isPlaceholder` + an empty `songs`. If any
  bundled component starts importing something else from `../data/songs`, extend
  the stub or the bundle will fail at runtime.
- **`.design-sync/previews/_fixtures.ts`** inlines sample song content — cosmetic
  only, but refresh it if you want the cards to show newer data. The `Song` type
  now also has `coverFull`, `lyricsNotes`, `visualizer?` — if it grows again,
  update BOTH `_fixtures.ts` and the inlined Song shape in `cfg.dtsPropsFor`
  (5 entries share it: PlayButton, SongMeta, SongScreen, ProgressNav, TopBar,
  plus CoverViz).
- **`shims/site-raw.ts` is GENERATED** — run `node .design-sync/gen-site-shim.mjs`
  before every build or the Hero/Outro cards carry stale prose from an old
  `src/data/site.md`.
- **Fonts**: Inter / Cormorant Garamond / JetBrains Mono / Iowan Old Style are
  unshipped fallbacks (previews use system fonts). Only Dobrozrachniy is bundled.
  If the site ever bundles the webfonts, add them via `cfg.extraFonts` and drop
  the FONT_MISSING known-warn.
- **Toolchain assumptions**: the build relies on esbuild's default `local-css`
  loader for `*.module.css` (scoped class maps) and on the converter defining
  `import.meta.env` (so `assetUrl` works) but NOT `import.meta.glob` (hence the
  songs stub). A converter/esbuild upgrade could shift either.
- **Grades** are carried forward by the uploaded `_ds_sync.json`; a re-sync only
  re-verifies components whose sources changed.
