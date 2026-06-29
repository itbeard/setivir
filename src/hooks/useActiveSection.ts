import { useEffect, useState } from 'react'
import { currentIndex } from '../lib/nav'

/**
 * Returns the index (among all `[data-section]` blocks) of the section
 * currently in view. Updates on scroll/resize, throttled with rAF.
 */
export function useActiveSection(): number {
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setActive(currentIndex())
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return active
}
