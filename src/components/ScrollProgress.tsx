import { useEffect, useRef } from 'react'
import styles from './ScrollProgress.module.css'

/** Hairline red progress bar at the very top of the viewport (rAF-throttled). */
export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = fillRef.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
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
    <div className={styles.track} aria-hidden="true">
      <div ref={fillRef} className={styles.fill} />
    </div>
  )
}
