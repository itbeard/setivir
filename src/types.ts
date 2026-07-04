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
  /**
   * Path to the downsized cover (thumbnails/small/, ~800px) used in the page
   * flow and the mini-player. Keeps first paint light so a click on play isn't
   * stuck behind megabytes of artwork.
   */
  cover: string
  /** Path to the full-resolution cover, used by the lightbox. */
  coverFull: string
  /**
   * Release date as `DD/MM/YYYY` (or `MM/YYYY`). Rendered as a short
   * `Травень’25` stamp in the meta card and as a full spelled-out date in the
   * cover lightbox; unparseable values are shown as-is.
   */
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
  /**
   * Cover visualizer for this song while it plays — a key of VISUALIZERS in
   * components/visualizers/registry.ts. Omit for the default (lightning).
   */
  visualizer?: string
  /** The style prompt used for generation (shown under a cut). */
  stylePrompt: string
  /** The lyrics prompt used for generation (shown under a cut). */
  lyricsPrompt: string
}
