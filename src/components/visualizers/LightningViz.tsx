import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import styles from './LightningViz.module.css'

/**
 * Электрычныя разрады вакол вокладкі — the default cover visualizer.
 *
 * Bolts are anchored to an invisible "rail" — a rounded square running just
 * OUTSIDE the framed art — and every vertex is displaced strictly outward
 * along the rail's normal, so a bolt can never cross onto the frame. Each
 * bolt is a short jagged arc that crawls along the rail, flickers for a few
 * hundred ms and dies; new ones spawn on bass onsets (beats) plus a quiet
 * ambient trickle scaled by loudness.
 *
 * Performance: a fixed pool of SLOTS <g> elements is rendered once; every
 * frame only rewrites their `d`/opacity via refs (no React re-render, no DOM
 * churn). One rAF loop, small typed arrays, no per-frame allocations beyond
 * the path strings.
 */

/* ── Rail geometry ──
 * The svg spans inset:-40% of the cover wrap (see .viz in the css module), so
 * in the 100×100 viewBox the framed art occupies 22.2…77.8 — half-extent
 * ≈27.8 around the centre (50,50). The rail is a rounded square with
 * half-extent H just outside that; C keeps its corner arcs clear of the
 * frame's corners along the diagonals. */
const H = 30.5 // rail half-extent (frame half-extent ≈ 27.8)
const C = 5 // rail corner radius
const EDGE = 2 * (H - C) // straight run of one side
const ARC = (Math.PI / 2) * C // one corner arc
const SIDE = EDGE + ARC
const PERIM = 4 * SIDE

/** Corner-arc centre signs per side (top→right→bottom→left, clockwise). */
const SX = [1, 1, -1, -1]
const SY = [-1, 1, 1, -1]

/**
 * Point on the rail at arc-length `s`, with its outward normal. Returns
 * viewBox coords (centre 50,50). Sides run clockwise starting at the top edge.
 */
function railAt(s: number): [number, number, number, number] {
  s = ((s % PERIM) + PERIM) % PERIM
  const side = Math.floor(s / SIDE)
  const u = s - side * SIDE
  let x: number, y: number, nx: number, ny: number
  if (u < EDGE) {
    const t = u - (H - C) // −(H−C)…(H−C) along the edge
    switch (side) {
      case 0: x = t; y = -H; nx = 0; ny = -1; break // top, →
      case 1: x = H; y = t; nx = 1; ny = 0; break // right, ↓
      case 2: x = -t; y = H; nx = 0; ny = 1; break // bottom, ←
      default: x = -H; y = -t; nx = -1; ny = 0; break // left, ↑
    }
  } else {
    const ang = (side - 1) * (Math.PI / 2) + (u - EDGE) / C
    nx = Math.cos(ang)
    ny = Math.sin(ang)
    x = SX[side] * (H - C) + C * nx
    y = SY[side] * (H - C) + C * ny
  }
  return [50 + x, 50 + y, nx, ny]
}

/* Precomputed rail samples: x, y, nx, ny, env. `env` tapers bolt amplitude
 * toward the vertical axis so discharges stay clear of the track number above
 * the cover and the title below it — fullest at the left/right sides. */
const RAIL_N = 256
const RAIL = new Float32Array(RAIL_N * 5)
for (let i = 0; i < RAIL_N; i++) {
  const [x, y, nx, ny] = railAt((i / RAIL_N) * PERIM)
  const phi = Math.atan2(y - 50, x - 50)
  RAIL[i * 5] = x
  RAIL[i * 5 + 1] = y
  RAIL[i * 5 + 2] = nx
  RAIL[i * 5 + 3] = ny
  RAIL[i * 5 + 4] = 0.25 + 0.75 * Math.abs(Math.cos(phi)) ** 1.1
}

const SLOTS = 6 // hard cap on simultaneous bolts
const MAX_VERTS = 18
const MIN_D = 0.4 // vertices never dip below this height above the rail

interface Bolt {
  born: number
  life: number
  k: number // vertex count
  amp: number // outward reach at the bolt's crest
  s0: number // arc-length of the first vertex (crawls via vel)
  span: number // signed arc-length covered by the bolt
  vel: number // crawl speed, units/ms
  shape: Float32Array // 0…1 arch profile per vertex
  branchAt: number // vertex index of the fork, or −1
  branchStep: number // fork segment length
  branchRot: number // fork angle off the outward normal, radians
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
    let acc = 0 // ambient spawn accumulator
    let lastBurst = 0
    let lastT = 0
    let raf = 0

    const spawn = (now: number, count: number, energy: number) => {
      for (let n = 0; n < count; n++) {
        const slot = bolts.findIndex((b) => b === null)
        if (slot < 0) return // pool full — drop, never pile up work
        const span = (0.08 + 0.14 * Math.random()) * PERIM
        const k = Math.min(MAX_VERTS, 8 + Math.round(span / 3))
        const shape = new Float32Array(k)
        for (let j = 0; j < k; j++) {
          // Arched crest with per-vertex raggedness; endpoints sit on the rail.
          const t = j / (k - 1)
          shape[j] = Math.sin(Math.PI * t) ** 0.7 * (0.45 + 0.55 * Math.random())
        }
        bolts[slot] = {
          born: now,
          life: 160 + Math.random() * 240,
          k,
          amp: Math.min(10.5, (3 + 8 * energy) * (0.75 + 0.5 * Math.random())),
          s0: Math.random() * PERIM,
          span: Math.random() < 0.5 ? span : -span,
          vel: (Math.random() < 0.5 ? -1 : 1) * (0.025 + 0.045 * Math.random()),
          shape,
          branchAt: Math.random() < 0.6 ? 2 + Math.floor(Math.random() * (k - 4)) : -1,
          branchStep: 1.2 + Math.random() * 1.4,
          branchRot: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5),
        }
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

      // A bass jump over the running baseline is a beat → burst of bolts.
      if (bass - slowAvg > 0.16 && now - lastBurst > 90) {
        lastBurst = now
        spawn(now, bass > 0.55 ? 3 : 2, bass)
      }
      // Ambient trickle so quiet passages still spark now and then.
      acc += dt * (0.0005 + 0.0045 * level * level)
      while (acc >= 1) {
        acc -= 1
        spawn(now, 1, Math.max(0.25, level))
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
        b.s0 += b.vel * dt

        let d = ''
        let bx = 0
        let by = 0
        let bnx = 0
        let bny = 0
        for (let j = 0; j < b.k; j++) {
          const st = b.s0 + (b.span * j) / (b.k - 1)
          const idx = ((Math.round((st / PERIM) * RAIL_N) % RAIL_N) + RAIL_N) % RAIL_N
          const o = idx * 5
          // Outward-only displacement: arch × side-taper + flicker, floored at
          // MIN_D — the bolt can approach the rail but never cross inside it.
          const flick = (Math.random() - 0.5) * 1.5 * (0.4 + 0.6 * b.shape[j])
          const disp = Math.max(MIN_D * b.shape[j], b.amp * b.shape[j] * RAIL[o + 4] + flick)
          const x = RAIL[o] + RAIL[o + 2] * disp
          const y = RAIL[o + 1] + RAIL[o + 3] * disp
          d += `${j === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
          if (j === b.branchAt) {
            bx = x
            by = y
            bnx = RAIL[o + 2]
            bny = RAIL[o + 3]
          }
        }
        if (b.branchAt >= 0) {
          // Short fork peeling off a middle vertex, also strictly outward.
          const cos = Math.cos(b.branchRot)
          const sin = Math.sin(b.branchRot)
          const dx = bnx * cos - bny * sin
          const dy = bnx * sin + bny * cos
          d += `M${bx.toFixed(2)},${by.toFixed(2)}`
          for (let m = 1; m <= 3; m++) {
            const fx = bx + dx * b.branchStep * m + (Math.random() - 0.5) * 1.2
            const fy = by + dy * b.branchStep * m + (Math.random() - 0.5) * 1.2
            d += `L${fx.toFixed(2)},${fy.toFixed(2)}`
          }
        }

        for (const p of paths[slot]) p.setAttribute('d', d)
        // Fast strike-in, eased fade-out, per-frame electric flicker.
        const env = Math.min(1, t / 0.12) * Math.min(1, (1 - t) / 0.88)
        g.style.opacity = (env * (0.82 + 0.18 * Math.random())).toFixed(3)
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
