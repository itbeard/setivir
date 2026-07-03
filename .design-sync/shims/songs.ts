// Build-time stub for src/data/songs.ts, used ONLY by the design-sync bundle.
//
// The real module runs Vite's `import.meta.glob('./songs/*.md', { eager })` at
// module load to assemble the song list. esbuild (the converter's bundler)
// can't evaluate `import.meta.glob`, so loading the real module would throw at
// IIFE eval and break the whole window.Setivir bundle. The three components
// that reach this module (SongMeta, SongScreen, PromptDisclosure) only use the
// pure `isPlaceholder` helper, so this stub provides exactly that plus an empty
// `songs` array. Wired via cfg.tsconfig paths → "../data/songs".
export function isPlaceholder(text: string): boolean {
  return /^\s*\[.*\]\s*$/.test(text)
}

export const songs: unknown[] = []
