import { useEffect, useRef } from 'react'
import { Ornament } from './Ornament'
import styles from './OrnamentDivider.module.css'

/**
 * Ornament centred on the seam between two sections, with a gentle horizontal
 * scroll parallax. Purely decorative (aria-hidden); the parallax stands down
 * under prefers-reduced-motion.
 */
export function OrnamentDivider() {
  const seamRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const seam = seamRef.current
      const inner = innerRef.current
      if (!seam || !inner) return
      const rect = seam.getBoundingClientRect()
      if (rect.top < -60 || rect.top > window.innerHeight + 60) return
      const drift = (rect.top - window.innerHeight / 2) * 0.06
      inner.style.transform = `translate(${drift.toFixed(1)}px, -7px)`
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

  return (
    <div ref={seamRef} className={styles.seam} aria-hidden="true">
      <div ref={innerRef} className={styles.inner}>
        <Ornament />
      </div>
    </div>
  )
}
