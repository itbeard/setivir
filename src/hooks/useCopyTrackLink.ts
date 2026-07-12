import { useCopyText } from './useCopyText'

/**
 * Copy a deep link to a song (the same #song-<slug> hash App.tsx honors).
 * `copied` stays true for a couple of seconds after each copy — drive the
 * "link copied" notice with it.
 */
export function useCopyTrackLink(slug: string) {
  const { copied, copy: copyText } = useCopyText()

  const copy = () => {
    const { origin, pathname, search } = window.location
    return copyText(`${origin}${pathname}${search}#song-${slug}`)
  }

  return { copied, copy }
}
