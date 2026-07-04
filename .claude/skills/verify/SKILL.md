---
name: verify
description: Build, run and drive the Setivir landing page to verify changes end-to-end (headless Chrome + playwright-core against vite preview).
---

# Verify: Setivir landing

React 18 + Vite static site, no backend. Surface = the browser.

## Build & serve

```bash
npm run build                       # tsc --noEmit && vite build (also links assets)
npm run preview -- --port 4173 --strictPort   # serves dist/ (run in background)
```

`npm run dev` works too, but preview-on-dist is what ships.

## Drive (no playwright in repo — use scratchpad)

There is no test/browser tooling in the project. Install `playwright-core`
(no browser download) in a scratch dir and drive the system Chrome:

```js
import { chromium } from 'playwright-core'
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
})
```

Useful handles:

- Song sections: `section[data-kind="song"]`; play button: `[class*="playDock"] button`
  (CSS-module class names are hashed — match with `[class*="..."]`).
- Clicking play is a real user gesture → the AudioContext/analyser starts and
  beat-reactive visuals (`[class*="aura"][class*="playing"]`) go live, even
  headless with `--mute-audio`.
- Cover visualizers overflow `.coverWrap` — screenshot with a padded
  `page.screenshot({ clip })`, not an element screenshot (it clips overflow).
- Canvas visualizers: read activity via `getImageData` (count alpha>threshold
  pixels, sampled stride) — correlate with `--level` to prove beat sync.
  Gotcha: a `<canvas>` is a replaced element — `inset` alone won't stretch it;
  it needs explicit CSS width/height or it silently stays 300×150.
- Bolt/viz activity is transient — `page.waitForFunction` on per-`<g>`
  `style.opacity` before screenshotting.
- Themes: `newPage({ colorScheme: 'dark' })`; motion: `reducedMotion: 'reduce'`
  (visualizers must render nothing animated under it).

## Worth driving

- Play/pause on a song screen → aura appears/fades, paths cleared on pause.
- Track switch (click play on another section) → aura moves, no JS errors.
- Geometry guard for cover visualizers: sample all `path` `d` vertices and
  assert none land inside `[class*="frame"]`'s bounding box (viewBox 100×100
  maps to the svg rect; frame ≈ 22.2…77.8).
