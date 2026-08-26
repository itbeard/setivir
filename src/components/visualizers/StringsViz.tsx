import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { buildRail, type Rail } from './rail'
import { createBeatTracker } from './beat'
import styles from './StringsViz.module.css'

/**
 * «Беларуска» — струны скрыпкі вакол вокладкі. Four violin strings (G D A E,
 * thick wound bass to thin bright treble) run as concentric rails just outside
 * the framed cover. Each string listens to its own band of the spectrum and
 * sways in standing waves — the G string to the bass, the E string to the
 * highs. A kick plucks the strings: they shiver hard and settle, and a
 * handful of tiny notes (♪) is shaken off, tumbling outward and fading like
 * dust off a bow.
 *
 * Layer sits behind the opaque frame card (z-index −1), so the strings and
 * notes always emerge from behind the cover and never paint over it.
 *
 * Performance: one <canvas>, strings as four stroked polylines rebuilt from a
 * LUT each frame, a fixed pool of notes in flat typed arrays, zero per-frame
 * allocations, one rAF loop.
 */

const FRAME = 27.8 // half-extent of the framed art in the 100×100 box
const SEG = 200 // polyline samples per string
const MAX_NOTES = 48

interface StringDef {
  /** Rail the string runs on. */
  rail: Rail
  /** Spectrum band [lo, hi) it listens to. */
  lo: number
  hi: number
  /** Standing-wave mode numbers and their angular speeds (rad/s). */
  modes: [number, number][]
  /** Fake "visible vibration" frequency of a pluck, Hz. */
  pluckHz: number
  /** Stroke width in box units. */
  width: number
  /** 0 = warm wound bronze (G) … 1 = bright steel (E). */
  tone: number
}

// Three strings: G is the outermost (thickest, slowest), E hugs the frame.
// Analyser fftSize is 256 → ≈172 Hz per bin.
const STRINGS: StringDef[] = [
  { rail: buildRail(FRAME + 7.0, 9.2), lo: 1, hi: 4, modes: [[2, 1.1], [3, 1.9]], pluckHz: 7, width: 0.6, tone: 0 },
  { rail: buildRail(FRAME + 4.5, 7.0), lo: 4, hi: 12, modes: [[3, 1.6], [5, 2.5]], pluckHz: 10, width: 0.42, tone: 0.5 },
  { rail: buildRail(FRAME + 2.0, 4.7), lo: 12, hi: 45, modes: [[5, 2.6], [8, 3.9]], pluckHz: 14, width: 0.28, tone: 1 },
]

// "Bowed" detector: the band where violin fundamentals and their harmonics
// live (≈1–7 kHz here). A bowed, sustained tone keeps this band loud with
// little frame-to-frame change (low spectral flux); drums and plucks are the
// opposite. The strings sway with the bow, not with the beat.
const BOW_LO = 6
const BOW_HI = 40

function mix(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`
}

/** One small quaver (♪) drawn in local units: head at the origin, stem up. */
function drawNote(ctx: CanvasRenderingContext2D, flag: boolean) {
  // head — a tilted ellipse
  ctx.beginPath()
  ctx.ellipse(0, 0, 0.62, 0.42, -0.45, 0, Math.PI * 2)
  ctx.fill()
  // stem — from the head's right edge upward
  ctx.beginPath()
  ctx.moveTo(0.56, -0.18)
  ctx.lineTo(0.56, -2.1)
  ctx.stroke()
  if (flag) {
    ctx.beginPath()
    ctx.moveTo(0.56, -2.1)
    ctx.bezierCurveTo(1.1, -1.7, 1.35, -1.25, 0.95, -0.55)
    ctx.stroke()
  }
}

export function StringsViz({ playing }: CoverVizProps) {
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

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    // Wound bronze for the low strings, pale steel for the high ones.
    const bronze: [number, number, number] = dark ? [214, 156, 82] : [168, 112, 46]
    const steel: [number, number, number] = dark ? [232, 228, 214] : [122, 118, 108]
    const stringColor = STRINGS.map((s) => mix(bronze, steel, s.tone))
    const noteColor = dark ? 'rgb(240, 214, 160)' : 'rgb(110, 76, 34)'

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

    // Per-string state: eased band energy, pluck envelope, mode phases.
    const energy = new Float32Array(STRINGS.length)
    const pluck = new Float32Array(STRINGS.length)
    const pluckT = new Float32Array(STRINGS.length)
    const phase = STRINGS.map((s) => s.modes.map(() => Math.random() * Math.PI * 2))
    const bowPrev = new Uint8Array(BOW_HI) // last frame's bow-band bins
    let bowFluxAvg = 0.3 // running typical flux in the bow band
    let bowed = 0 // eased 0…1 "a bowed string is sounding"

    // Note pool — flat arrays, alive-prefix compaction.
    const X = new Float32Array(MAX_NOTES)
    const Y = new Float32Array(MAX_NOTES)
    const VX = new Float32Array(MAX_NOTES)
    const VY = new Float32Array(MAX_NOTES)
    const ROT = new Float32Array(MAX_NOTES)
    const VROT = new Float32Array(MAX_NOTES)
    const AGE = new Float32Array(MAX_NOTES)
    const LIFE = new Float32Array(MAX_NOTES)
    const SZ = new Float32Array(MAX_NOTES)
    const FLAG = new Uint8Array(MAX_NOTES)
    let alive = 0

    const kill = (i: number) => {
      alive--
      if (i !== alive) {
        X[i] = X[alive]; Y[i] = Y[alive]; VX[i] = VX[alive]; VY[i] = VY[alive]
        ROT[i] = ROT[alive]; VROT[i] = VROT[alive]; AGE[i] = AGE[alive]
        LIFE[i] = LIFE[alive]; SZ[i] = SZ[alive]; FLAG[i] = FLAG[alive]
      }
    }

    /** Shake a note off string `k` at arc-length `s`, flying outward. */
    const emit = (k: number, s: number, strength: number) => {
      if (alive >= MAX_NOTES) return
      const rail = STRINGS[k].rail
      const o = ((Math.round((s / rail.perim) * rail.n) % rail.n) + rail.n) % rail.n * 5
      const env = rail.lut[o + 4]
      // Keep the title below and the number above mostly clear.
      if (Math.random() > 0.2 + 0.8 * env) return
      const i = alive++
      const nx = rail.lut[o + 2]
      const ny = rail.lut[o + 3]
      const tilt = (Math.random() - 0.5) * 1.2
      const cos = Math.cos(tilt)
      const sin = Math.sin(tilt)
      const sp = (6 + 16 * strength) * (0.5 + Math.random() * 0.7)
      X[i] = rail.lut[o] + nx * 0.8
      Y[i] = rail.lut[o + 1] + ny * 0.8
      VX[i] = (nx * cos - ny * sin) * sp
      VY[i] = (nx * sin + ny * cos) * sp - 3
      ROT[i] = (Math.random() - 0.5) * 0.8
      VROT[i] = (Math.random() - 0.5) * 5
      AGE[i] = 0
      LIFE[i] = 0.9 + 0.8 * Math.random()
      SZ[i] = 0.8 + 0.55 * Math.random() * (0.6 + 0.6 * strength)
      FLAG[i] = Math.random() < 0.7 ? 1 : 0
    }

    /** A kick: pluck every string (the low ones hardest). Notes are shaken
     * off ONLY when there is real bass weight behind the hit — a snare or
     * hi-hat accent plucks the strings but sheds nothing. */
    const strike = (bass: number, strength: number) => {
      for (let k = 0; k < STRINGS.length; k++) {
        const w = 1 - 0.45 * STRINGS[k].tone
        pluck[k] = Math.max(pluck[k], Math.min(1, (0.35 + 0.65 * strength) * w))
        pluckT[k] = 0
      }
      if (bass < 0.55) return
      const weight = (bass - 0.55) / 0.45 // 0…1 over the heavy-bass range
      const count = Math.round((2 + 8 * strength) * (0.3 + 0.7 * weight))
      for (let n = 0; n < count; n++) {
        // Notes come mostly off the low strings — that is where the bass lives.
        const k = Math.random() < 0.65 ? 0 : Math.random() < 0.65 ? 1 : 2
        emit(k, Math.random() * STRINGS[k].rail.perim, strength)
      }
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const beat = createBeatTracker()
    let lastT = 0
    let raf = 0

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

      // Bowed-tone measure: loud, steady mid/high band → strings sway wide.
      let bowSum = 0
      let bowFlux = 0
      for (let b = BOW_LO; b < BOW_HI; b++) {
        bowSum += bins[b]
        bowFlux += Math.abs(bins[b] - bowPrev[b])
        bowPrev[b] = bins[b]
      }
      const bowLoud = Math.min(1, (bowSum / (BOW_HI - BOW_LO) / 255) * 2.2)
      const fluxRate = bowFlux / ((BOW_HI - BOW_LO) * 255) / dt
      bowFluxAvg += (fluxRate - bowFluxAvg) * (1 - Math.exp(-dt / 2))
      const steady = Math.max(0, 1 - fluxRate / (bowFluxAvg * 1.6 + 0.05))
      const bowRaw = bowLoud ** 1.2 * (0.35 + 0.65 * steady)
      bowed += (bowRaw - bowed) * (bowRaw > bowed ? 1 - Math.exp(-dt / 0.12) : 1 - Math.exp(-dt / 0.45))

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // ── Strings ──────────────────────────────────────────────────────
      for (let k = 0; k < STRINGS.length; k++) {
        const s = STRINGS[k]
        // Band energy (higher bands are quieter → lift them).
        let sum = 0
        for (let b = s.lo; b < s.hi; b++) sum += bins[b]
        const raw = Math.min(1, (sum / (s.hi - s.lo) / 255) * (0.9 + 1.4 * s.tone)) ** 1.3
        energy[k] += (raw - energy[k]) * (raw > energy[k] ? 1 - Math.exp(-dt / 0.04) : 1 - Math.exp(-dt / 0.3))
        // Pluck decays like a real string ringing down.
        pluckT[k] += dt
        pluck[k] *= Math.exp(-dt / 0.38)
        const shiver = pluck[k] * Math.cos(pluckT[k] * s.pluckHz * Math.PI * 2)
        // A faint idle shimmer, a little from the string's own band, and the
        // real swing from a bowed tone (the lower strings swing widest).
        const swayAmp = 0.05 + 0.3 * energy[k] + 2.4 * bowed * (1 - 0.35 * s.tone)
        for (let m = 0; m < s.modes.length; m++) phase[k][m] += s.modes[m][1] * dt * (0.6 + 0.8 * level)

        const rail = s.rail
        ctx.beginPath()
        for (let j = 0; j <= SEG; j++) {
          const o = Math.round((j % SEG) * (rail.n / SEG)) % rail.n * 5
          const u = j / SEG
          const env = rail.lut[o + 4]
          let d = 0
          for (let m = 0; m < s.modes.length; m++) {
            d += Math.sin(u * Math.PI * 2 * s.modes[m][0] + phase[k][m]) / (m + 1)
          }
          // Pluck: a fast, high-mode shiver with its own spatial pattern.
          d = d * swayAmp + shiver * 0.8 * Math.sin(u * Math.PI * 2 * (s.modes[1][0] + 2) + phase[k][0] * 0.5)
          d *= 0.35 + 0.65 * env
          const x = (rail.lut[o] + rail.lut[o + 2] * d) * ux
          const y = (rail.lut[o + 1] + rail.lut[o + 3] * d) * uy
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        const bright = 0.55 + 0.45 * Math.min(1, energy[k] * 1.5 + pluck[k])
        ctx.strokeStyle = stringColor[k]
        // Faint halo under the string so it reads against both papers.
        ctx.globalAlpha = (dark ? 0.22 : 0.14) * bright
        ctx.lineWidth = (s.width + 1.1) * ux
        ctx.stroke()
        ctx.globalAlpha = (dark ? 0.9 : 0.78) * bright
        ctx.lineWidth = s.width * ux
        ctx.stroke()
      }

      // ── Notes ────────────────────────────────────────────────────────
      ctx.fillStyle = noteColor
      ctx.strokeStyle = noteColor
      const drag = Math.exp(-1.4 * dt)
      for (let i = 0; i < alive; i++) {
        AGE[i] += dt
        if (AGE[i] >= LIFE[i]) {
          kill(i)
          i--
          continue
        }
        VX[i] *= drag
        VY[i] = VY[i] * drag + 4.5 * dt // a little gravity — they fall like dust
        X[i] += VX[i] * dt
        Y[i] += VY[i] * dt
        ROT[i] += VROT[i] * dt
        const t = AGE[i] / LIFE[i]
        const a = t < 0.1 ? t / 0.1 : (1 - t) ** 1.4
        ctx.globalAlpha = a * 0.92
        ctx.save()
        ctx.translate(X[i] * ux, Y[i] * uy)
        ctx.rotate(ROT[i])
        ctx.scale(SZ[i] * ux, SZ[i] * uy)
        ctx.lineWidth = 0.22
        drawNote(ctx, FLAG[i] === 1)
        ctx.restore()
      }
      ctx.globalAlpha = 1

      // Fade everything out where the track number (above) and the title
      // (below) live — the strings vanish into the paper rather than crossing
      // the type. Two soft elliptical erasers, drawn last.
      ctx.globalCompositeOperation = 'destination-out'
      erase(50, 13.5, 30, 9.5)
      erase(50, 90.5, 34, 9.5)
      ctx.globalCompositeOperation = 'source-over'
    }

    /** Erase an ellipse at (cx, cy) with radii (rx, ry), soft toward its rim. */
    const erase = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.save()
      ctx.translate(cx * ux, cy * uy)
      ctx.scale(rx * ux, ry * uy)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
      g.addColorStop(0.55, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(-1, -1, 2, 2)
      ctx.restore()
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
