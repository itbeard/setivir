# Setivir — how to build with these components

Setivir is a bilingual (Belarusian тарашкевіца / English) music-gallery landing
page. These components are its real page sections and media controls — a Hero, a
per-song `SongScreen`, a `TopBar`, a side `ProgressNav`, a bottom `MiniPlayer`,
plus smaller parts (`PlayButton`, `SongMeta`, `PromptDisclosure`, `CoverWave`,
`SocialLinks`, `Ornament`, `Outro`). Compose them; don't rebuild them.

## Wrapping is required

Every component reads language/translations and/or audio-player state from React
context. Wrap your tree in **both** providers or components throw
(`useI18n must be used within <I18nProvider>` / `usePlayer must be used within
<PlayerProvider>`):

```jsx
const { I18nProvider, PlayerProvider, Hero, SongScreen } = window.Setivir;
ReactDOM.createRoot(el).render(
  <I18nProvider>{/* be/en, auto-detected; drives TopBar's language toggle */}
    <PlayerProvider>{/* owns one shared <audio>; PlayButton/MiniPlayer/CoverWave use it */}
      <Hero />
      <SongScreen song={song} total={20} />
    </PlayerProvider>
  </I18nProvider>
);
```

`usePlayer()` and `useI18n()` are also on `window.Setivir` if your own glue needs
the current track or language. Bilingual text props take `{ be, en }`; a `Song`
object's shape is in `SongScreen.d.ts` / `SongMeta.d.ts`.

## Styling idiom: CSS custom-property tokens

There are **no utility classes and no style props**. The design language lives in
**CSS custom properties** (design tokens) declared at `:root`, and each component
ships its own scoped CSS. Style *your* layout glue with the same `var(--…)`
tokens so it stays on-brand (every colour token also has a dark-mode value via
`@media (prefers-color-scheme: dark)`):

- **Colour** — `--paper`, `--paper-2`, `--card` (surfaces); `--ink`, `--ink-soft`,
  `--ink-faint` (text); `--line`, `--line-strong` (borders); `--red`,
  `--red-deep`, `--red-tint` (the single Belarusian-red accent).
- **Type** — `--font-brand` (the Dobrozrachniy display face — wordmark/titles),
  `--font-display`, `--font-body`, `--font-mono`; fluid sizes `--fs-hero`,
  `--fs-title`, `--fs-lead`, `--fs-body`, `--fs-meta`.
- **Layout** — `--maxw` (740px content width), `--pad-x`, `--pad-y`, `--gap`,
  `--radius`, `--topbar-h`; shadows `--shadow-cover`, `--shadow-bar`,
  `--shadow-btn`.

Two global classes ship too: `.section` (a full-viewport, scroll-snap section —
what `Hero`/`SongScreen`/`Outro` use) and `.is-placeholder` (dims unfilled `[…]`
text).

## Where the truth lives

- **`styles.css`** — the one stylesheet to link; it `@import`s `_ds_bundle.css`,
  which carries the tokens and every component's styles. Read it before styling.
- **`components/general/<Name>/<Name>.d.ts`** — the prop contract, and
  **`<Name>.prompt.md`** — usage notes, for each component.

## Idiomatic example

Real components for the parts, tokens for your own layout glue:

```jsx
const { TopBar, PlayButton, Ornament } = window.Setivir;
<section style={{
  background: 'var(--paper)', color: 'var(--ink)',
  fontFamily: 'var(--font-body)', padding: 'var(--pad-y) var(--pad-x)',
  maxWidth: 'var(--maxw)', margin: '0 auto',
}}>
  <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: 'var(--fs-title)', color: 'var(--ink)' }}>
    Родны Флоў
  </h2>
  <Ornament />
  <PlayButton song={song} large />
</section>
```
