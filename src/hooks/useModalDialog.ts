import { useEffect, useRef, type RefObject } from 'react'

/**
 * Shared plumbing for modal dialogs (the song bottom sheet, the cover
 * lightbox). While the host component is mounted it:
 *   - locks body scroll (restoring the previous value on close),
 *   - moves focus into the dialog and returns it to the opener afterwards,
 *   - traps Tab / Shift+Tab inside the dialog,
 *   - calls `onClose` on Escape.
 *
 * Global handlers (keyboard section nav) can ask `isDialogOpen()` to stand
 * down while any dialog is up.
 */

const openDialogs = new Set<symbol>()

export function isDialogOpen(): boolean {
  return openDialogs.size > 0
}

function focusables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(
    root.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement)
}

export function useModalDialog(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  // Keep the latest close callback without re-running the effect.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const id = Symbol('dialog')
    openDialogs.add(id)

    const lastFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Focus the first control once the dialog has painted.
    const raf = requestAnimationFrame(() => {
      focusables(ref.current)[0]?.focus()
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const f = focusables(ref.current)
      if (f.length === 0) return
      const first = f[0]
      const last = f[f.length - 1]
      if (!ref.current?.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey, true)
      document.documentElement.style.overflow = prevOverflow
      openDialogs.delete(id)
      lastFocus?.focus?.()
    }
  }, [ref])
}
