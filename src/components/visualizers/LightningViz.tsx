import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { buildRail, railOffset } from './rail'
import styles from './LightningViz.module.css'

/**
 * Электрычныя разрады вакол вокладкі — an optional cover visualizer
 * (registry key `lightning`).
 *
 * Every bass onset (beat) fires a volley of strikes: jagged bolts that shoot
 * OUTWARD from the frame's edge, flash, then slowly fade (sometimes with a
 * dimmer re-strike, like real lightning). Bolt geometry is frozen at spawn —
 * only a small, decaying tremor animates it — so a strike reads as a strike,
 * not as something crawling around the cover. Between beats there is almost
 * nothing: the rhythm IS the visual.
 *
 * Bolt roots sit on an invisible "rail" — a rounded square just OUTSIDE the
 * framed art — and every bolt grows outward from it, so a discharge can never
 * cross onto the frame.
 *
 * Performance: a fixed pool of SLOTS <g> elements is rendered once; every
 * frame only rewrites their `d`/opacity via refs (no React re-render, no DOM
 * churn). One rAF loop; allocations happen only at spawn (a few per second).
 */

/* The rail runs clearly outside the frame (half-extent 30.5 vs ≈27.8); its
 * corner radius keeps the arcs clear of the frame's corners on the diagonals. */
const RAIL = buildRail(30.5, 5)

const SLOTS = 10 // hard cap on simultaneous bolts

interface Bolt {
  born: number
  life: number
  n: number // vertex count (main channel + forks)
  px: Float32Array // frozen vertex positions, jittered slightly per frame
  py: Float32Array
  mv: Uint8Array // 1 → this vertex starts a new subpath (fork root)
  restrike: number // life-fraction of the dimmer second flash, or 0
}

/** Flash envelope: near-instant strike-in, long eased fade-out. */
function flash(u: number): number {
  if (u <= 0 || u >= 1) return 0
  return u < 0.06 ? u / 0.06 : (1 - (u - 0.06) / 0.94) ** 2.2
}

export function LightningViz({ playing }: CoverVizProps) {
  const { getAnalyser } = usePlayer()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    const groups = Array.from(svg.querySelectorAll('g'))
    const paths = groups.map((g) => Array.from(g.querySelectorAll('path')))
    const clear = () => {
      root.style.setProperty('--level', '0')
      for (let i = 0; i < groups.length; i++) {
        groups[i].style.opacity = '0'
        for (const p of paths[i]) p.setAttribute('d', '')
      }
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const analyser = playing ? getAnalyser() : null
    if (!playing || reduce || !analyser) {
      // Reduced motion / no Web Audio: only the soft beat-less glow remains.
      clear()
      return
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const bolts: (Bolt | null)[] = new Array(SLOTS).fill(null)
    let level = 0 // eased loudness → glow brightness
    let slowAvg = 0 // slow-moving loudness baseline for onset detection
    let acc = 0 // ambient spark accumulator (tiny — beats carry the show)
    let lastBurst = 0
    let lastT = 0
    let raf = 0

    /** One strike rooted at arc-length `s`, shooting outward from the frame. */
    const spawnOne = (now: number, s: number, energy: number) => {
      const slot = bolts.findIndex((b) => b === null)
      if (slot < 0) return // pool full — drop, never pile up work
      const o = railOffset(RAIL, s)
      const rx = RAIL.lut[o]
      const ry = RAIL.lut[o + 1]
      const env = RAIL.lut[o + 4]
      // Main channel direction: the outward normal, slightly tilted.
      const tilt = (Math.random() - 0.5) * 0.7
      const cos = Math.cos(tilt)
      const sin = Math.sin(tilt)
      const dx = RAIL.lut[o + 2] * cos - RAIL.lut[o + 3] * sin
      const dy = RAIL.lut[o + 2] * sin + RAIL.lut[o + 3] * cos
      const perpX = -dy
      const perpY = dx
      // Reach scales with beat strength, tapered near the top/bottom.
      const L = Math.max(1.4, Math.min(12, (4.5 + 9 * energy) * env * (0.7 + 0.6 * Math.random())))
      const k = Math.max(4, 4 + Math.round(L * 0.7))

      const cap = k + 2 * 5 // main channel + up to two 5-vertex forks
      const px = new Float32Array(cap)
      const py = new Float32Array(cap)
      const mv = new Uint8Array(cap)
      let n = 0
      // Jagged main channel: advance outward, lateral random walk sideways.
      let lat = 0
      for (let j = 0; j < k; j++) {
        const dist = L * (j / (k - 1)) ** 0.92
        if (j > 0 && j < k - 1) {
          lat += (Math.random() - 0.5) * (1.6 * (L / k))
          const cl = Math.min(2.5, dist * 0.6) // stay outward-pointing
          lat = Math.max(-cl, Math.min(cl, lat))
        }
        mv[n] = j === 0 ? 1 : 0
        px[n] = rx + dx * dist + perpX * lat
        py[n] = ry + dy * dist + perpY * lat
        n++
      }
      // Forks peeling off the middle of the channel, shorter and steeper.
      const forks = L > 5 ? 1 + (Math.random() < 0.4 ? 1 : 0) : 0
      for (let f = 0; f < forks; f++) {
        const jb = 1 + Math.floor((0.25 + 0.4 * Math.random()) * (k - 2))
        const rot = (Math.random() < 0.5 ? -1 : 1) * (0.45 + 0.45 * Math.random())
        const fc = Math.cos(rot)
        const fs = Math.sin(rot)
        const fdx = dx * fc - dy * fs
        const fdy = dx * fs + dy * fc
        const Lb = L * (0.3 + 0.3 * Math.random())
        const kb = 3 + Math.round(Lb * 0.5)
        for (let m = 0; m < kb && n < cap; m++) {
          const dist = Lb * (m / (kb - 1))
          mv[n] = m === 0 ? 1 : 0
          px[n] = px[jb] + fdx * dist + (m > 0 ? (Math.random() - 0.5) * 1.1 : 0)
          py[n] = py[jb] + fdy * dist + (m > 0 ? (Math.random() - 0.5) * 1.1 : 0)
          n++
        }
      }

      bolts[slot] = {
        born: now,
        life: 450 + Math.random() * 450, // slow, dying-out fade
        n,
        px,
        py,
        mv,
        restrike: Math.random() < 0.35 ? 0.25 + 0.35 * Math.random() : 0,
      }
    }

    /** A beat fires several strikes spread around the perimeter at once. */
    const volley = (now: number, count: number, energy: number) => {
      const base = Math.random()
      for (let i = 0; i < count; i++) {
        const s = (((base + i / count + (Math.random() - 0.5) * 0.12) % 1) + 1) % 1
        spawnOne(now, s * RAIL.perim, energy * (0.75 + 0.5 * Math.random()))
      }
    }

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = lastT ? Math.min(64, now - lastT) : 16
      lastT = now

      analyser.getByteFrequencyData(bins)
      let s = 0
      for (let i = 1; i < 12; i++) s += bins[i]
      const bass = Math.min(1, (s / 11 / 255) * 1.5)
      level += (bass - level) * (bass > level ? 0.5 : 0.1)
      root.style.setProperty('--level', level.toFixed(3))
      slowAvg += (bass - slowAvg) * 0.04

      // A bass jump over the running baseline is a beat → volley of strikes,
      // its size and reach scaled by how hard the beat hits.
      const flux = bass - slowAvg
      if (flux > 0.11 && now - lastBurst > 140) {
        lastBurst = now
        volley(now, 2 + Math.round(3 * Math.min(1, flux * 3.2)), bass)
      }
      // Rare tiny sparks so loud sustained passages aren't fully static.
      acc += dt * 0.0009 * level * level
      while (acc >= 1) {
        acc -= 1
        spawnOne(now, Math.random() * RAIL.perim, 0.15 + 0.25 * level)
      }

      for (let slot = 0; slot < SLOTS; slot++) {
        const b = bolts[slot]
        const g = groups[slot]
        if (!b) continue
        const t = (now - b.born) / b.life
        if (t >= 1) {
          bolts[slot] = null
          g.style.opacity = '0'
          continue
        }

        // Frozen strike with a small tremor that stills as the bolt dies.
        const jit = 0.12 + 0.4 * (1 - t)
        let d = ''
        for (let i = 0; i < b.n; i++) {
          const x = b.px[i] + (Math.random() - 0.5) * jit
          const y = b.py[i] + (Math.random() - 0.5) * jit
          d += `${b.mv[i] ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
        }
        for (const p of paths[slot]) p.setAttribute('d', d)

        // Flash → long fade; sometimes a dimmer re-strike partway through.
        let e = flash(t)
        if (b.restrike > 0 && t >= b.restrike) {
          e = Math.max(e, 0.65 * flash((t - b.restrike) / (1 - b.restrike)))
        }
        g.style.opacity = (e * (0.88 + 0.12 * Math.random())).toFixed(3)
      }
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      clear()
    }
  }, [playing, getAnalyser])

  return (
    <div ref={rootRef} className={cx(styles.aura, playing && styles.playing)} aria-hidden="true">
      <span className={styles.glow} />
      <svg ref={svgRef} className={styles.viz} viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: SLOTS }, (_, i) => (
          <g key={i} className={styles.bolt}>
            <path className={styles.halo} />
            <path className={styles.arc} />
            <path className={styles.core} />
          </g>
        ))}
      </svg>
    </div>
  )
}
