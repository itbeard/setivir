import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { createBeatTracker } from './beat'
import { createBowTracker } from './bow'
import styles from './LightsViz.module.css'

/**
 * «Каля майго церама» — сьветамузыка. Soft radial pools of coloured light
 * drift behind the framed cover like stage lamps on a back wall. Three colour
 * bands: a deep red lamp pair listens to the bass, a warm gold pair to the
 * mids, a cool indigo pair to the highs — each swelling and brightening with
 * its own band. A bowed, sustained tone (shared detector with StringsViz)
 * makes all the lamps breathe wide and slow; a bass kick throws a bright
 * bloom out from behind the cover that fades as it spreads.
 *
 * Layer sits behind the opaque frame card (z-index −1), so the light always
 * spills out from behind the cover and never paints over the art.
 *
 * Performance: one <canvas>, pre-rendered radial sprites, a fixed pool of
 * blooms in flat typed arrays, zero per-frame allocations, one rAF loop.
 */

const MAX_BLOOMS = 8
const MAX_RINGS = 6
const FRAME = 27.8 // half-extent of the framed art — rings are born behind it

interface Lamp {
  /** Spectrum band [lo, hi) the lamp listens to (≈172 Hz per bin). */
  lo: number
  hi: number
  /** Loudness lift for quieter high bands. */
  gain: number
  /** Orbit: mean radius from the centre and angular speed (rad/s). */
  orbit: number
  speed: number
  /** Starting angle; the mirrored twin sits at angle + π. */
  angle: number
  /** Sprite radius at rest and at full energy, in box units. */
  r0: number
  r1: number
  /** Colour index into the palette. */
  color: number
}

const LAMPS: Lamp[] = [
  { lo: 1, hi: 4, gain: 1.0, orbit: 27, speed: 0.11, angle: 0.55, r0: 15, r1: 30, color: 0 }, // bass — red
  { lo: 4, hi: 12, gain: 1.4, orbit: 30, speed: -0.16, angle: 2.4, r0: 11, r1: 24, color: 1 }, // mids — gold
  { lo: 12, hi: 45, gain: 2.3, orbit: 32, speed: 0.22, angle: 4.3, r0: 9, r1: 19, color: 2 }, // highs — indigo
]

/** Pre-render one soft pool of light in the given colour. */
function makeSprite(rgb: [number, number, number], core: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const [r, g, b] = rgb
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, `rgba(${r},${g},${b},${core})`)
  grad.addColorStop(0.35, `rgba(${r},${g},${b},${core * 0.55})`)
  grad.addColorStop(0.7, `rgba(${r},${g},${b},${core * 0.16})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  return c
}

export function LightsViz({ playing }: CoverVizProps) {
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
      clearAll()
      return
    }

    // In the dark the lamps add light (screen-like); on light paper they tint
    // it (multiply), so the same three colours read as coloured washes.
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const palette: [number, number, number][] = dark
      ? [[214, 52, 44], [232, 168, 62], [96, 84, 214]]
      : [[228, 92, 82], [226, 176, 86], [132, 122, 222]]
    const sprites = palette.map((c) => makeSprite(c, dark ? 0.7 : 0.5))
    const bloomSprite = makeSprite(dark ? [255, 214, 170] : [230, 120, 90], dark ? 0.85 : 0.6)
    const blend: GlobalCompositeOperation = dark ? 'lighter' : 'multiply'

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

    // Per-lamp state.
    const energy = new Float32Array(LAMPS.length)
    const angle = Float32Array.from(LAMPS, (l) => l.angle)

    // Bloom pool — a kick's flash spreading out from behind the cover.
    const BR = new Float32Array(MAX_BLOOMS) // radius
    const BA = new Float32Array(MAX_BLOOMS) // age
    const BL = new Float32Array(MAX_BLOOMS) // life
    const BS = new Float32Array(MAX_BLOOMS) // strength
    const BX = new Float32Array(MAX_BLOOMS) // origin direction (unit)
    const BY = new Float32Array(MAX_BLOOMS)
    let blooms = 0

    // Ring pool — a heavy bass hit sends a big circle out from the centre.
    const RR = new Float32Array(MAX_RINGS) // radius
    const RA = new Float32Array(MAX_RINGS) // age
    const RL = new Float32Array(MAX_RINGS) // life
    const RS = new Float32Array(MAX_RINGS) // strength
    let rings = 0
    const ringColor = dark ? '255, 120, 96' : '200, 50, 43'

    const kill = (i: number) => {
      blooms--
      if (i !== blooms) {
        BR[i] = BR[blooms]; BA[i] = BA[blooms]; BL[i] = BL[blooms]
        BS[i] = BS[blooms]; BX[i] = BX[blooms]; BY[i] = BY[blooms]
      }
    }

    /** A kick with real bass weight: a bloom from a random side, and — when
     * the bass is heavy — a big ring rolling out from the centre. */
    const strike = (bass: number, strength: number) => {
      if (bass < 0.55) return
      const weight = (bass - 0.55) / 0.45
      if (weight > 0.3 && rings < MAX_RINGS) {
        const r = rings++
        RR[r] = FRAME * 0.9
        RA[r] = 0
        RL[r] = 0.9 + 0.6 * weight
        RS[r] = Math.min(1, (0.3 + 0.7 * weight) * (0.5 + 0.5 * strength))
      }
      if (blooms >= MAX_BLOOMS) return
      const i = blooms++
      // Favour the sides (left/right) so the bloom stays clear of the type.
      const a = (Math.random() < 0.5 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.4
      BX[i] = Math.cos(a)
      BY[i] = Math.sin(a)
      BR[i] = 20
      BA[i] = 0
      BL[i] = 0.7 + 0.5 * strength
      BS[i] = Math.min(1, (0.35 + 0.65 * strength) * (0.5 + 0.5 * weight))
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const beat = createBeatTracker()
    const bow = createBowTracker()
    let lastT = 0
    let raf = 0

    /** Erase an ellipse at (cx, cy) with radii (rx, ry), soft toward its rim. */
    const erase = (cx: number, cy: number, rx: number, ry: number, strength: number) => {
      ctx.save()
      ctx.translate(cx * ux, cy * uy)
      ctx.scale(rx * ux, ry * uy)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
      g.addColorStop(0.45, `rgba(0,0,0,${strength})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(-1, -1, 2, 2)
      ctx.restore()
    }

    // Radial mask in unit space: keep the centre, fade to nothing at the rim.
    const vignette = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    vignette.addColorStop(0.7, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,1)')

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dtMs = lastT ? Math.min(64, now - lastT) : 16
      lastT = now
      const dt = dtMs / 1000
      const T = now / 1000

      analyser.getByteFrequencyData(bins)
      const { level, bass, kick } = beat.update(bins, dt, now)
      root.style.setProperty('--level', level.toFixed(3))
      if (kick > 0) strike(bass, kick)
      const bowed = bow.update(bins, dt)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = blend

      // ── Lamps ────────────────────────────────────────────────────────
      for (let k = 0; k < LAMPS.length; k++) {
        const l = LAMPS[k]
        let sum = 0
        for (let b = l.lo; b < l.hi; b++) sum += bins[b]
        const raw = Math.min(1, (sum / (l.hi - l.lo) / 255) * l.gain) ** 1.3
        energy[k] += (raw - energy[k]) * (raw > energy[k] ? 1 - Math.exp(-dt / 0.06) : 1 - Math.exp(-dt / 0.35))
        // The bow slows the drift and widens the pools — a long, breathing glow.
        angle[k] += l.speed * dt * (1 - 0.6 * bowed)
        const breathe = 1 + 0.4 * bowed * (0.7 + 0.3 * Math.sin(T * 0.9 + k * 2.1))
        const radius = (l.r0 + (l.r1 - l.r0) * energy[k]) * breathe
        const orbit = l.orbit * (1 + 0.12 * bowed)
        const alpha = (0.18 + 0.82 * energy[k]) * (0.75 + 0.25 * bowed)
        ctx.globalAlpha = alpha
        // The lamp and its mirrored twin — the halo stays balanced.
        for (let m = 0; m < 2; m++) {
          const a = angle[k] + m * Math.PI
          const x = (50 + Math.cos(a) * orbit) * ux
          const y = (50 + Math.sin(a) * orbit * 0.9) * uy
          const w = radius * 2 * ux
          ctx.drawImage(sprites[l.color], x - w / 2, y - w / 2, w, w)
        }
      }

      // ── Blooms ───────────────────────────────────────────────────────
      for (let i = 0; i < blooms; i++) {
        BA[i] += dt
        if (BA[i] >= BL[i]) {
          kill(i)
          i--
          continue
        }
        const t = BA[i] / BL[i]
        BR[i] += (18 + 22 * BS[i]) * dt * (1 - t * 0.5)
        const d = 28 + 10 * t
        const x = (50 + BX[i] * d) * ux
        const y = (50 + BY[i] * d) * uy
        const w = BR[i] * 2 * ux
        ctx.globalAlpha = BS[i] * (1 - t) ** 1.5
        ctx.drawImage(bloomSprite, x - w / 2, y - w / 2, w, w)
      }
      ctx.globalAlpha = 1

      // ── Bass halo + rings ────────────────────────────────────────────
      // A steady heavy bassline keeps a wide circle of light pulsing around
      // the cover; each hard hit rolls a big ring outward from the centre.
      const halo = Math.max(0, (level - 0.45) / 0.55)
      if (halo > 0) {
        const hr = 26 + 16 * halo
        ctx.globalAlpha = (dark ? 0.55 : 0.35) * halo
        ctx.drawImage(sprites[0], (50 - hr) * ux, (50 - hr) * uy, hr * 2 * ux, hr * 2 * uy)
      }
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      ctx.lineCap = 'round'
      for (let i = 0; i < rings; i++) {
        RA[i] += dt
        if (RA[i] >= RL[i]) {
          rings--
          if (i !== rings) { RR[i] = RR[rings]; RA[i] = RA[rings]; RL[i] = RL[rings]; RS[i] = RS[rings] }
          i--
          continue
        }
        const t = RA[i] / RL[i]
        RR[i] += (26 + 22 * RS[i]) * dt * (1 - 0.6 * t) // fast start, easing out
        const a = RS[i] * (1 - t) ** 1.3
        const w = (2.2 + 3.5 * RS[i]) * (1 + 1.2 * t) // the ring widens as it thins
        ctx.beginPath()
        ctx.arc(50 * ux, 50 * uy, RR[i] * ux, 0, Math.PI * 2)
        // soft wide body + a brighter core line
        ctx.strokeStyle = `rgba(${ringColor}, ${(a * 0.35).toFixed(3)})`
        ctx.lineWidth = w * 2.6 * ux
        ctx.stroke()
        ctx.strokeStyle = `rgba(${ringColor}, ${(a * 0.85).toFixed(3)})`
        ctx.lineWidth = w * ux
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Keep the track number (above) and the title (below) readable: soften
      // the light under the type without cutting it dead.
      ctx.globalCompositeOperation = 'destination-out'
      erase(50, 13.5, 24, 8, 0.75)
      erase(50, 90.5, 30, 8, 0.75)
      // Vignette: the light dies away well before the canvas edge, so the
      // layer never shows as a hard rectangle.
      ctx.save()
      ctx.translate(50 * ux, 50 * uy)
      ctx.scale(50 * ux, 50 * uy)
      ctx.fillStyle = vignette
      ctx.fillRect(-1, -1, 2, 2)
      ctx.restore()
      ctx.globalCompositeOperation = 'source-over'
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
      <canvas ref={canvasRef} className={styles.viz} aria-hidden="true" />
    </div>
  )
}
