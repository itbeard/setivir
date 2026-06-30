export type Lang = 'be' | 'en'

/** A piece of text available in both site languages. */
export interface Localized {
  be: string
  en: string
}

export interface Song {
  /** Track number, also the order on the page (1 = oldest, shown first). */
  id: number
  /** URL-safe identifier, used for anchors (#song-<slug>). */
  slug: string
  /** Song title. `be` = Cyrillic (тарашкевіца), `en` = romanized/English. */
  title: Localized
  /** Path to the mp3, relative to the site root (see lib/assets.ts). */
  audio: string
  /** Path to the cover image, relative to the site root. */
  cover: string
  /** Free-form creation date, e.g. "2025" or "Сакавік 2025 / March 2025". */
  date: string
  /** AI model used to generate the track, e.g. "Suno v4". */
  model: string
  /** Author of the lyrics (poet / folk / the artist). */
  lyricsAuthor: Localized
  /**
   * Description of the song: what it is plus the story behind it. Blank lines
   * separate paragraphs (rendered justified, like the hero intro).
   */
  description: Localized
  /**
   * The song lyrics, shown under a cut. `be` is the original; `en` is a
   * translation that conveys the approximate meaning of the original.
   */
  lyrics: Localized
  /** The style prompt used for generation (shown under a cut). */
  stylePrompt: string
  /** The lyrics prompt used for generation (shown under a cut). */
  lyricsPrompt: string
}
