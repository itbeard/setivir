/**
 * Build a URL for a static asset living in /public (songs, thumbnails, …).
 *
 * Filenames contain spaces and other characters that must be percent-encoded
 * for use in `src` attributes, so we run the path through `encodeURI` (which
 * preserves "/"). `import.meta.env.BASE_URL` makes this work when the site is
 * deployed under a sub-path (e.g. GitHub Pages /setivir/).
 */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, '')
  const base = import.meta.env.BASE_URL // e.g. "/" or "/setivir/"
  return `${base}${encodeURI(clean)}`
}

/**
 * Suggested filename for the audio-download links ("Setivir — {title}.mp3").
 * The extension follows the real audio file, so swapping formats later keeps
 * downloads correct.
 */
export function downloadName(title: string, audioPath: string): string {
  const dot = audioPath.lastIndexOf('.')
  const ext = dot >= 0 ? audioPath.slice(dot) : ''
  return `Setivir — ${title}${ext}`
}
