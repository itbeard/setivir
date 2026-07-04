import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { buildRail, railOffset } from './rail'
import styles from './EmbersViz.module.css'

/**
 * Купальскія іскры — the default cover visualizer. On every bass onset a
 * sheaf of sparks bursts out from behind the framed cover, drifts outward
 * through a turbulent field, leaves fading trails and dies down like embers
 * settling on paper. Quiet passages carry only a sparse trickle of single
 * sparks — the beat is what lights the fire.
 *
 * Sparks are emitted ON the frame's edge moving outward, and the whole layer
 * sits behind the opaque frame card (z-index −1), so they visually emerge
 * from behind the cover and can never paint over it.
 *
 * Performance: one <canvas>, a fixed pool of particles in flat typed arrays
 * (swap-with-last compaction, zero per-frame allocations) and pre-rendered
 * radial-gradient sprites instead of per-particle gradients. The canvas is
 * fully cleared every frame — trails are velocity streaks drawn per spark, so
 * no fade residue can ever accumulate. One rAF loop.
 */

const RAIL = buildRail(27.6, 4) // right at the frame's edge — sparks slip out from behind it
const MAX = 320 // particle pool cap
const SPRITES = 6 // colour ramp steps, ember-red → hot gold

function parseHex(c: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(c.trim())
  const v = m ? parseInt(m[1], 16) : 0xc8322b
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

/** Pre-render one soft glowing dot of the given colour. */
function makeSprite(r: number, g: number, b: number, dark: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  const core = dark ? 0.95 : 0.92
  grad.addColorStop(0, `rgba(${r},${g},${b},${core})`)
  grad.addColorStop(0.2, `rgba(${r},${g},${b},${core * 0.6})`)
  grad.addColorStop(0.55, `rgba(${r},${g},${b},${core * 0.22})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return c
}

export function EmbersViz({ playing }: CoverVizProps) {
  const { getAnalyser } = usePlayer()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')

    const clearAll = () => {
      root.style.setProperty('--level', '0')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const analyser = playing ? getAnalyser() : null
    if (!playing || reduce || !analyser || !ctx) {
      // Reduced motion / no Web Audio: only the soft beat-less glow remains.
      clearAll()
      return
    }

    // Ember colour ramp from the theme's red toward hot gold. In the dark
    // theme sparks blend additively (real fire glow); on light paper additive
    // washes out, so there they draw normally.
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [r0, g0, b0] = parseHex(getComputedStyle(root).getPropertyValue('--red'))
    const [r1, g1, b1] = [236, 170, 60]
    const sprites: HTMLCanvasElement[] = []
    const colors: string[] = [] // matching solid colours for the streak strokes
    for (let i = 0; i < SPRITES; i++) {
      const t = i / (SPRITES - 1)
      const r = Math.round(r0 + (r1 - r0) * t)
      const g = Math.round(g0 + (g1 - g0) * t)
      const b = Math.round(b0 + (b1 - b0) * t)
      sprites.push(makeSprite(r, g, b, dark))
      colors.push(`rgb(${r},${g},${b})`)
    }

    // Backing store tracks the on-screen size; coordinates stay in the shared
    // 100×100 box (ux/uy = device px per unit).
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let ux = 1
    let uy = 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
      ux = canvas.width / 100
      uy = canvas.height / 100
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Particle pool — flat arrays, alive-prefix compaction.
    const X = new Float32Array(MAX)
    const Y = new Float32Array(MAX)
    const VX = new Float32Array(MAX)
    const VY = new Float32Array(MAX)
    const AGE = new Float32Array(MAX)
    const LIFE = new Float32Array(MAX)
    const SZ = new Float32Array(MAX)
    const SEED = new Float32Array(MAX)
    const SPR = new Uint8Array(MAX)
    let alive = 0

    const kill = (i: number) => {
      alive--
      if (i !== alive) {
        X[i] = X[alive]; Y[i] = Y[alive]; VX[i] = VX[alive]; VY[i] = VY[alive]
        AGE[i] = AGE[alive]; LIFE[i] = LIFE[alive]; SZ[i] = SZ[alive]
        SEED[i] = SEED[alive]; SPR[i] = SPR[alive]
      }
    }

    /** One spark at arc-length `s`, flying outward. Bursts fly harder. */
    const emit = (s: number, energy: number, burst: boolean) => {
      if (alive >= MAX) return // pool full — drop, never pile up work
      const o = railOffset(RAIL, s)
      const env = RAIL.lut[o + 4]
      // Taper near the top/bottom (title and track number live there).
      if (Math.random() > 0.25 + 0.75 * env) return
      const i = alive++
      const tilt = (Math.random() - 0.5) * (burst ? 0.9 : 1.7)
      const cos = Math.cos(tilt)
      const sin = Math.sin(tilt)
      const nx = RAIL.lut[o + 2]
      const ny = RAIL.lut[o + 3]
      const sp =
        (burst ? 8 + 24 * energy * (0.5 + Math.random()) : 2.5 + 7 * energy * Math.random()) *
        (0.6 + 0.4 * env)
      X[i] = RAIL.lut[o]
      Y[i] = RAIL.lut[o + 1]
      VX[i] = (nx * cos - ny * sin) * sp - ny * (Math.random() - 0.5) * 4
      VY[i] = (nx * sin + ny * cos) * sp + nx * (Math.random() - 0.5) * 4
      AGE[i] = 0
      LIFE[i] = burst ? 0.7 + 0.9 * Math.random() : 0.5 + 0.8 * Math.random()
      SZ[i] = (0.55 + 1.2 * Math.random() * Math.random()) * (0.75 + 0.5 * energy)
      SEED[i] = Math.random() * 100
      // Hotter sparks sit closer to the gold end of the ramp.
      SPR[i] = Math.min(
        SPRITES - 1,
        Math.floor(SPRITES * (0.55 * Math.random() + 0.6 * energy * Math.random())),
      )
    }

    /** A beat: one sheaf of sparks — two on opposite sides when it hits hard.
     * Size and speed scale with both the kick strength (how sharply the bass
     * energy arrived) and its absolute weight, so a juicy drop detonates and
     * a mild accent only sputters. */
    const burst = (energy: number, strength: number) => {
      const count = Math.round((12 + 58 * strength) * (0.4 + 0.6 * energy))
      const punch = Math.min(1, energy * (0.6 + 0.8 * strength))
      const c1 = Math.random() * RAIL.perim
      const two = strength > 0.45
      const c2 = c1 + RAIL.perim * (0.5 + (Math.random() - 0.5) * 0.2)
      for (let n = 0; n < count; n++) {
        const c = two && n % 2 ? c2 : c1
        // ~gaussian spread of the sheaf around its centre
        const spread = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
        emit(c + spread * 0.06 * RAIL.perim, punch, true)
      }
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const prevBass = new Uint8Array(12) // last frame's bass bins, for spectral flux
    let level = 0 // eased loudness → glow brightness
    let fluxAvg = 0.4 // running typical flux rate — the adaptive kick threshold
    let ambAcc = 0 // ambient trickle accumulator
    let lastBurst = 0
    let lastT = 0
    let startT = 0 // first-audio timestamp, seeds the baseline
    let raf = 0

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dtMs = lastT ? Math.min(64, now - lastT) : 16
      lastT = now
      const dt = dtMs / 1000
      const T = now / 1000

      analyser.getByteFrequencyData(bins)
      let sum = 0
      let fluxSum = 0
      for (let i = 1; i < 12; i++) {
        sum += bins[i]
        const d = bins[i] - prevBass[i]
        if (d > 0) fluxSum += d // positive spectral flux: energy that ARRIVED
        prevBass[i] = bins[i]
      }
      const bass = Math.min(1, (sum / 11 / 255) * 1.5)
      // Normalised to a per-second rate so display refresh doesn't matter.
      // The first frame's flux is bogus (prev bins were zero) — drop it, and
      // seed the level so pressing play doesn't detonate a greeting firework.
      const rate = startT ? fluxSum / (11 * 255) / dt : 0
      if (!startT) {
        startT = now
        level = bass
      }
      level += (bass - level) * (bass > level ? 1 - Math.exp(-dt / 0.03) : 1 - Math.exp(-dt / 0.25))
      root.style.setProperty('--level', level.toFixed(3))
      // Adaptive threshold: the detector compares each frame's flux with the
      // song's own typical flux, so kicks stand out even under a dense,
      // never-quiet bassline (where an average-level detector goes blind).
      fluxAvg += (rate - fluxAvg) * (1 - Math.exp(-dt / 1.5))

      // A sheaf fires on a genuine kick: flux clearly above the song's norm,
      // with real bass weight behind it — never right after play, while the
      // norm is still settling.
      const kick = rate / (fluxAvg + 0.05)
      if (now - startT > 500 && kick > 1.7 && bass > 0.4 && now - lastBurst > 150) {
        lastBurst = now
        burst(bass, Math.min(1, (kick - 1.7) / 2.2))
      }
      // Tiny ambient trickle so the fire never looks fully dead mid-song —
      // kept sparse on purpose: the beat is what should move the picture.
      ambAcc += dtMs * (0.0015 + 0.01 * level * level)
      while (ambAcc >= 1) {
        ambAcc -= 1
        emit(Math.random() * RAIL.perim, 0.2 + 0.5 * level, false)
      }

      // Full clear every frame: no fade residue can survive. The trail feel
      // comes from per-spark velocity streaks drawn below.
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      ctx.lineCap = 'round'

      const drag = Math.exp(-1.7 * dt)
      for (let i = 0; i < alive; i++) {
        AGE[i] += dt
        if (AGE[i] >= LIFE[i]) {
          kill(i)
          i--
          continue
        }
        // Cheap turbulence — a swirling angle field — plus a light updraft.
        const n = Math.sin(X[i] * 0.23 + T * 1.2 + SEED[i]) + Math.cos(Y[i] * 0.19 - T * 0.8 + SEED[i] * 1.7)
        VX[i] = VX[i] * drag + Math.cos(n * 2.2) * 7 * dt
        VY[i] = VY[i] * drag + Math.sin(n * 2.2) * 7 * dt - 1.4 * dt
        X[i] += VX[i] * dt
        Y[i] += VY[i] * dt

        const t = AGE[i] / LIFE[i]
        const flick = 0.75 + 0.25 * Math.sin(T * 24 + SEED[i] * 7)
        const a = (1 - t) ** 1.6 * flick
        const size = SZ[i] * (1 - 0.45 * t)
        // Motion streak: a short tail back along the velocity — fast burst
        // sparks stretch into fiery strokes, drifting embers barely smear.
        ctx.globalAlpha = a * 0.4
        ctx.strokeStyle = colors[SPR[i]]
        ctx.lineWidth = Math.max(1, size * 0.9 * ux)
        ctx.beginPath()
        ctx.moveTo((X[i] - VX[i] * 0.09) * ux, (Y[i] - VY[i] * 0.09) * uy)
        ctx.lineTo(X[i] * ux, Y[i] * uy)
        ctx.stroke()
        const w = size * 3.2 * ux
        ctx.globalAlpha = a
        ctx.drawImage(sprites[SPR[i]], X[i] * ux - w / 2, Y[i] * uy - w / 2, w, w)
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      clearAll()
    }
  }, [playing, getAnalyser])

  return (
    <div ref={rootRef} className={cx(styles.aura, playing && styles.playing)} aria-hidden="true">
      <span className={styles.glow} />
      <canvas ref={canvasRef} className={styles.viz} aria-hidden="true" />
    </div>
  )
}
