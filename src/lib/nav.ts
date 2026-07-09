/**
 * Section navigation helpers. Every full-screen block (intro, each song, outro)
 * carries a `data-section` attribute; these utilities read them straight from
 * the DOM so navigation always reflects what is actually on the page.
 */

const SELECTOR = '[data-section]'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
}

/** Index of the section containing the probe line (34% down the viewport). */
export function currentIndex(): number {
  const sections = getSections()
  if (sections.length === 0) return 0
  const probe = window.innerHeight * 0.34
  // Last section whose top is at or above the probe — a tall section stays
  // active until the next one actually reaches the probe line.
  let best = 0
  sections.forEach((el, i) => {
    if (el.getBoundingClientRect().top <= probe) best = i
  })
  return best
}

export function scrollToIndex(i: number): void {
  const sections = getSections()
  const clamped = Math.max(0, Math.min(sections.length - 1, i))
  const target = sections[clamped]
  if (!target) return
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

export function scrollToId(id: string): void {
  const sections = getSections()
  const idx = sections.findIndex((el) => el.id === id)
  if (idx >= 0) scrollToIndex(idx)
}

export function goNext(): void {
  scrollToIndex(currentIndex() + 1)
}

export function goPrev(): void {
  scrollToIndex(currentIndex() - 1)
}

/**
 * Scroll to the section right after the one that contains `el`. Used by on-page
 * "next" buttons: anchoring to the button's own section (rather than the
 * scroll-probe `currentIndex`) means a tall section can't make us skip a track.
 */
export function goNextFrom(el: HTMLElement | null): void {
  const sections = getSections()
  const section = el?.closest<HTMLElement>(SELECTOR) ?? null
  const idx = section ? sections.indexOf(section) : currentIndex()
  scrollToIndex(idx + 1)
}
