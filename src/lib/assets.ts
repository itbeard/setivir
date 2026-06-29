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
