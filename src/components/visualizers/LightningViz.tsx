import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { buildRail, railOffset } from './rail'
import { createBeatTracker } from './beat'
import styles from './LightningViz.module.css'

/**
 * Маланкі вакол вокладкі — a cinematic cover visualizer (registry key
 * `lightning`, assigned per-song via `viz` in data/songs.ts).
 *
 * Two layers of electricity:
 * - RUNNERS: charged arcs that run around the frame along an invisible rail,
 *   shimmering — the ever-present current. Their brightness and reach breathe
 *   with the music's level.
 * - STRIKES: on every kick a bolt propagates outward, drawn tip-first like a
 *   real lightning leader (stroke-dash reveal), flashes the aura, then dies
 *   away slowly — sometimes with a dimmer re-strike.
 *
 * All geometry is anchored to a rail OUTSIDE the framed art with strictly
 * outward displacement, so nothing ever crosses onto the frame. Fixed pools
 * of SVG groups rewritten via refs — no React re-render, no DOM churn; one
 * rAF loop.
 */

/* The rail runs clearly outside the frame (half-extent 30.5 vs ≈27.8); its
 * corner radius keeps the arcs clear of the frame's corners on the diagonals. */
const RAIL = buildRail(30.5, 5)

const RUNNERS = 3 // crawling arcs
const STRIKES = 6 // simultaneous kick bolts cap

interface Runner {
  born: number
  life: number
  s0: number // arc-length of the head (crawls via vel)
  span: number // signed arc-length covered
  vel: number // crawl speed, units/s
  k: number
  amp: number // outward reach at the crest
  shape: Float32Array // 0…1 arch profile per vertex
}

interface Strike {
  born: number
  life: number
  drawMs: number // leader propagation time
  n: number // vertex count (main channel + forks)
  px: Float32Array // frozen geometry, jittered slightly per frame
  py: Float32Array
  mv: Uint8Array // 1 → new subpath (fork root)
  dash: number // dash length covering the whole stroked path
  restrike: number // post-draw life-fraction of the second flash, or 0
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
      root.style.setProperty('--flash', '0')
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
    const beat = createBeatTracker()
    const runners: (Runner | null)[] = new Array(RUNNERS).fill(null)
    const runnerNextAt = Array.from({ length: RUNNERS }, (_, i) => performance.now() + i * 350)
    const strikes: (Strike | null)[] = new Array(STRIKES).fill(null)
    let flash = 0 // aura flash on kicks, decays exponentially
    let lastT = 0
    let raf = 0

    const spawnRunner = (now: number, slot: number, level: number) => {
      const span = (0.1 + 0.09 * Math.random()) * RAIL.perim
      const k = 9 + Math.floor(Math.random() * 6)
      const shape = new Float32Array(k)
      for (let j = 0; j < k; j++) {
        const t = j / (k - 1)
        shape[j] = Math.sin(Math.PI * t) ** 0.7 * (0.45 + 0.55 * Math.random())
      }
      runners[slot] = {
        born: now,
        life: 1300 + Math.random() * 1300,
        s0: Math.random() * RAIL.perim,
        span: Math.random() < 0.5 ? span : -span,
        vel: (Math.random() < 0.5 ? -1 : 1) * (25 + 35 * Math.random()),
        k,
        amp: (2.4 + 2 * Math.random()) * (0.7 + 0.6 * level),
        shape,
      }
    }

    /** One kick bolt: jagged channel outward from the rail, plus forks. */
    const spawnStrike = (now: number, strength: number) => {
      const slot = strikes.findIndex((b) => b === null)
      if (slot < 0) return // pool full — drop, never pile up work
      // Bias the root toward the left/right sides (one env re-roll).
      let s = Math.random() * RAIL.perim
      let o = railOffset(RAIL, s)
      if (Math.random() > RAIL.lut[o + 4]) {
        s = Math.random() * RAIL.perim
        o = railOffset(RAIL, s)
      }
      const env = RAIL.lut[o + 4]
      const rx = RAIL.lut[o]
      const ry = RAIL.lut[o + 1]
      const tilt = (Math.random() - 0.5) * 0.7
      const cos = Math.cos(tilt)
      const sin = Math.sin(tilt)
      const dx = RAIL.lut[o + 2] * cos - RAIL.lut[o + 3] * sin
      const dy = RAIL.lut[o + 2] * sin + RAIL.lut[o + 3] * cos
      const perpX = -dy
      const perpY = dx
      const L = Math.max(2.2, Math.min(13, (6 + 9 * strength) * env * (0.75 + 0.5 * Math.random())))
      const k = Math.max(5, 4 + Math.round(L * 0.8))

      const cap = k + 2 * 5
      const px = new Float32Array(cap)
      const py = new Float32Array(cap)
      const mv = new Uint8Array(cap)
      let n = 0
      let segLen = 0
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
        if (j > 0) segLen += Math.hypot(px[n] - px[n - 1], py[n] - py[n - 1])
        n++
      }
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
          if (m > 0) segLen += Math.hypot(px[n] - px[n - 1], py[n] - py[n - 1])
          n++
        }
      }

      const dash = segLen * 1.2 // margin over the per-frame jitter
      const slotPaths = paths[RUNNERS + slot]
      for (const p of slotPaths) p.setAttribute('stroke-dasharray', `${dash.toFixed(1)} ${dash.toFixed(1)}`)
      strikes[slot] = {
        born: now,
        life: 550 + Math.random() * 400,
        drawMs: 60 + L * 6,
        n,
        px,
        py,
        mv,
        dash,
        restrike: Math.random() < 0.35 ? 0.25 + 0.35 * Math.random() : 0,
      }
    }

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dtMs = lastT ? Math.min(64, now - lastT) : 16
      lastT = now
      const dt = dtMs / 1000

      analyser.getByteFrequencyData(bins)
      const { level, kick } = beat.update(bins, dt, now)
      root.style.setProperty('--level', level.toFixed(3))
      if (kick > 0) {
        // The aura flashes with the hit; bolt count and reach follow it.
        flash = Math.max(flash, 0.4 + 0.6 * kick)
        const count = 1 + Math.round(2 * kick)
        for (let i = 0; i < count; i++) spawnStrike(now, kick * (0.75 + 0.5 * Math.random()))
      }
      flash *= Math.exp(-dt / 0.18)
      root.style.setProperty('--flash', flash < 0.01 ? '0' : flash.toFixed(3))

      // ── runners: the current that races around the frame ──
      for (let slot = 0; slot < RUNNERS; slot++) {
        const r = runners[slot]
        const g = groups[slot]
        if (!r) {
          if (now >= runnerNextAt[slot]) spawnRunner(now, slot, level)
          continue
        }
        const t = (now - r.born) / r.life
        if (t >= 1) {
          runners[slot] = null
          runnerNextAt[slot] = now + 150 + Math.random() * 500
          g.style.opacity = '0'
          continue
        }
        r.s0 += r.vel * dt
        let d = ''
        for (let j = 0; j < r.k; j++) {
          const o = railOffset(RAIL, r.s0 + (r.span * j) / (r.k - 1))
          const flick = (Math.random() - 0.5) * 1.2 * (0.4 + 0.6 * r.shape[j])
          const disp = Math.max(
            0.35 * r.shape[j],
            r.amp * (0.6 + 0.7 * level) * r.shape[j] * RAIL.lut[o + 4] + flick,
          )
          const x = RAIL.lut[o] + RAIL.lut[o + 2] * disp
          const y = RAIL.lut[o + 1] + RAIL.lut[o + 3] * disp
          d += `${j === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
        }
        for (const p of paths[slot]) p.setAttribute('d', d)
        const edge = Math.min(1, t / 0.15, (1 - t) / 0.3)
        g.style.opacity = (edge * (0.35 + 0.5 * level) * (0.8 + 0.2 * Math.random())).toFixed(3)
      }

      // ── strikes: leader draw → flash → slow decay ──
      for (let slot = 0; slot < STRIKES; slot++) {
        const b = strikes[slot]
        const g = groups[RUNNERS + slot]
        if (!b) continue
        const t = (now - b.born) / b.life
        if (t >= 1) {
          strikes[slot] = null
          g.style.opacity = '0'
          for (const p of paths[RUNNERS + slot]) p.removeAttribute('stroke-dasharray')
          continue
        }
        const prog = Math.min(1, (now - b.born) / b.drawMs)
        // Frozen bolt with a tremor that stills as it dies.
        const u = Math.max(0, (now - b.born - b.drawMs) / (b.life - b.drawMs))
        const jit = 0.12 + 0.3 * (1 - u)
        let d = ''
        for (let i = 0; i < b.n; i++) {
          const x = b.px[i] + (Math.random() - 0.5) * jit
          const y = b.py[i] + (Math.random() - 0.5) * jit
          d += `${b.mv[i] ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
        }
        for (const p of paths[RUNNERS + slot]) {
          p.setAttribute('d', d)
          p.setAttribute('stroke-dashoffset', (b.dash * (1 - prog)).toFixed(1))
        }
        // Full bright while the leader propagates, then a long fade with an
        // occasional dimmer re-strike.
        let e: number
        if (prog < 1) {
          e = 0.3 + 0.7 * prog
        } else {
          e = (1 - u) ** 2
          if (b.restrike > 0 && u >= b.restrike) {
            e = Math.max(e, 0.6 * (1 - (u - b.restrike) / (1 - b.restrike)) ** 2)
          }
          e *= 0.85 + 0.15 * Math.random()
        }
        g.style.opacity = e.toFixed(3)
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
        {Array.from({ length: RUNNERS }, (_, i) => (
          <g key={`r${i}`} className={cx(styles.bolt, styles.runner)}>
            <path className={styles.halo} />
            <path className={styles.arc} />
            <path className={styles.core} />
          </g>
        ))}
        {Array.from({ length: STRIKES }, (_, i) => (
          <g key={`s${i}`} className={styles.bolt}>
            <path className={styles.halo} />
            <path className={styles.arc} />
            <path className={styles.core} />
          </g>
        ))}
      </svg>
    </div>
  )
}
