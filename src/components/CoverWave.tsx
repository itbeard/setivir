import { useEffect, useRef } from 'react'
import { usePlayer } from '../audio/PlayerContext'
import { cx } from '../lib/cx'
import styles from './CoverWave.module.css'

/**
 * A radial spectrum of bars (стоўбікі) around the cover. Bars sit on a circle
 * just outside the framed art and grow outward with the music — a circular
 * equaliser. The spectrum is mirrored across the vertical axis, so the left and
 * right halves are always symmetric. Bars are drawn as one stroked <path>
 * (round caps) rewritten each frame via a ref — no React re-render.
 *
 *  100×100 viewBox, centre (50,50); the svg is larger than the cover so the
 *  bars halo it. i=0 sits at the bottom, i=HALF at the top; bar i and bar N−i
 *  share a frequency bin → perfect left/right mirror.
 */
const TAU = Math.PI * 2
const N = 72 // number of bars
const HALF = N / 2
const BASE_R = 29 // inner radius (frame edge ≈ 28, so bar roots tuck behind it)
const START = Math.PI / 2 // i=0 at the bottom
const BIN_LO = 2 // lowest frequency bin
const BIN_HI = 80 // highest bin — spread log-wise so the WHOLE spectrum shows
const MIN_H = 1.6 // resting bar height
const SCALE = 15 // how far a full-loudness bar reaches out

/** Build the multi-bar path for the given per-bar heights. */
function barsPath(heights: ArrayLike<number>): string {
  let d = ''
  for (let i = 0; i < N; i++) {
    const a = START + (i / N) * TAU
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const x1 = 50 + BASE_R * cos
    const y1 = 50 + BASE_R * sin
    const r2 = BASE_R + heights[i]
    const x2 = 50 + r2 * cos
    const y2 = 50 + r2 * sin
    d += `M${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}`
  }
  return d
}

export function CoverWave({ playing }: { playing: boolean }) {
  const { getAnalyser } = usePlayer()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    if (!root || !path) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const analyser = playing ? getAnalyser() : null
    if (!playing || reduce || !analyser) {
      root.style.setProperty('--level', '0')
      path.setAttribute('d', barsPath(new Float32Array(N).fill(MIN_H)))
      return
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const heights = new Float32Array(N).fill(MIN_H) // eased per-bar heights
    let level = 0
    let raf = 0

    const step = () => {
      analyser.getByteFrequencyData(bins)

      // Overall beat level (low band) → glow + brightness + slight halo swell.
      let s = 0
      for (let i = 1; i < 12; i++) s += bins[i]
      const target = Math.min(1, (s / 11 / 255) * 1.6)
      level += (target - level) * (target > level ? 0.5 : 0.08)
      root.style.setProperty('--level', level.toFixed(3))

      for (let i = 0; i < N; i++) {
        // Mirror across the vertical axis: bar i and bar N−i map to the same bin.
        const fold = i <= HALF ? i : N - i
        const t = fold / HALF
        // Log spread bass→mids→treble so the whole spectrum gets bars, and lift
        // the higher (quieter) bands so they react as visibly as the bass.
        const binF = BIN_LO * Math.pow(BIN_HI / BIN_LO, t)
        const i0 = Math.floor(binF)
        const f = binF - i0
        const v = bins[i0] * (1 - f) + (bins[i0 + 1] ?? bins[i0]) * f
        const mag = Math.min(1, (v / 255) * (0.7 + 1.7 * t)) ** 1.15
        const tgt = MIN_H + mag * SCALE
        // Fast rise, slower fall — bars jump on a hit and ease back down.
        heights[i] += (tgt - heights[i]) * (tgt > heights[i] ? 0.55 : 0.16)
      }
      path.setAttribute('d', barsPath(heights))

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, getAnalyser])

  return (
    <div ref={rootRef} className={cx(styles.aura, playing && styles.playing)} aria-hidden="true">
      <span className={styles.glow} />
      <svg className={styles.viz} viewBox="0 0 100 100" aria-hidden="true">
        <path ref={pathRef} />
      </svg>
    </div>
  )
}
