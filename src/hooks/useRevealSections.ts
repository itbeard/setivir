import { useEffect, useState } from 'react'

/**
 * Cascading entrance: adds `.is-in` to every `[data-section]` as it first
 * scrolls into view (the CSS lives in global.css, keyed on main[data-anim]).
 *
 * Returns whether the animation is active, so the caller can gate the hidden
 * initial state — content must never start invisible unless this hook is
 * actually going to reveal it.
 *
 * Safety net (critical): in throttled webviews / backgrounded tabs the
 * IntersectionObserver may never tick and the page would stay blank, so a
 * fallback timer force-reveals every section if no callback has fired.
 */
export function useRevealSections(enabled: boolean): boolean {
  const [active] = useState(
    () =>
      enabled &&
      typeof IntersectionObserver !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!active) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('is-in')
        })
      },
      { threshold: 0.16 },
    )
    sections.forEach((el) => io.observe(el))

    const fallback = window.setTimeout(() => {
      if (!sections.some((el) => el.classList.contains('is-in'))) {
        sections.forEach((el) => el.classList.add('is-in'))
      }
    }, 1800)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [active])

  return active
}
