import { useEffect, useRef, useState } from 'react'

/**
 * Copy a deep link to a song (the same #song-<slug> hash App.tsx honors).
 * `copied` stays true for a couple of seconds after each copy — drive the
 * "link copied" notice with it.
 */
export function useCopyTrackLink(slug: string) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    const { origin, pathname, search } = window.location
    const url = `${origin}${pathname}${search}#song-${slug}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return { copied, copy }
}
