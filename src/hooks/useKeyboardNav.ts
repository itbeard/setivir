import { useEffect } from 'react'
import { getSections, goNext, goPrev, scrollToIndex } from '../lib/nav'

/**
 * Global keyboard navigation between sections:
 *   Space / ↓ / PageDown → next     ↑ / PageUp → previous
 *   Home → first          End → last
 *
 * Keys are ignored while the user is interacting with form controls, links,
 * buttons (so Space still activates them) or an open <summary>.
 */
export function useKeyboardNav(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return

      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      ) {
        return
      }
      // Let Space activate focused buttons/links/disclosures.
      if (e.key === ' ' && (tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY')) {
        return
      }

      switch (e.key) {
        case ' ':
        case 'PageDown':
        case 'ArrowDown':
          e.preventDefault()
          goNext()
          break
        case 'PageUp':
        case 'ArrowUp':
          e.preventDefault()
          goPrev()
          break
        case 'Home':
          e.preventDefault()
          scrollToIndex(0)
          break
        case 'End':
          e.preventDefault()
          scrollToIndex(getSections().length - 1)
          break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
