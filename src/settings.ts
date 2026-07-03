/**
 * Дэкаратыўны «арт-пласт» / decorative art-layer switches. Every feature is
 * opt-in and purely visual — flip any of these to `false` to turn it off
 * without touching the components.
 */
export const settings = {
  /** Every 2nd song sits on --paper-2 for gallery rhythm. */
  altSongBg: true,
  /** Giant folio numeral in the left desktop margin (≥1240px). */
  marginNumeral: true,
  /** First lyric line as a faint vertical mural in the right margin (≥1240px). */
  lyricsMural: true,
  /** Cascading entrance of section content on first reveal. */
  entranceAnim: true,
  /** Fixed fractal-noise overlay for print character. */
  paperGrain: true,
  /** Ornament dividers straddling the seam between sections, with parallax. */
  ornamentDividers: true,
} as const
