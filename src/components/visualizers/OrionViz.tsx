import { useEffect, useRef } from 'react'
import { usePlayer } from '../../audio/PlayerContext'
import { cx } from '../../lib/cx'
import type { CoverVizProps } from './types'
import { createBeatTracker } from './beat'
import styles from './OrionViz.module.css'

/**
 * «Вечар той» — начное неба паверх вокладкі. While the song plays, a deep
 * evening veil settles over the cover art and the classic hourglass of Orion
 * comes out: the seven main stars at their real positions (RA/Dec) —
 * shoulders, belt, feet. Stars scintillate with the music's level, a kick
 * makes one of them flare and briefly lights up the constellation figure;
 * a hard drop may send a meteor across the sky.
 *
 * Unlike the rail visualizers this one deliberately paints OVER the cover
 * art (that is the point — the cover sinks into night), but never over the
 * frame chrome: the layer is inset to the framed art area and clipped.
 *
 * Performance: one <canvas>, pre-rendered glow/spike/nebula sprites, flat
 * typed arrays for the star field, zero per-frame allocations, one rAF loop.
 */

// ── The sky ─────────────────────────────────────────────────────────────
// The classic seven-star hourglass of Orion — nothing but the main figure.
// [RA hours, Dec°, apparent magnitude, sprite colour 0-warm/1-blue]
const STARS: [number, number, number, number][] = [
  [5.919, 7.407, 0.45, 0], // 0 Betelgeuse — shoulder, the only warm star
  [5.418, 6.35, 1.64, 1], // 1 Bellatrix — shoulder
  [5.679, -1.943, 1.74, 1], // 2 Alnitak — belt
  [5.604, -1.202, 1.69, 1], // 3 Alnilam — belt
  [5.533, -0.299, 2.25, 1], // 4 Mintaka — belt
  [5.796, -9.67, 2.07, 1], // 5 Saiph — foot
  [5.242, -8.202, 0.18, 1], // 6 Rigel — foot, the brightest
]

/** The hourglass: shoulders, shoulders→belt, the belt, belt→feet, feet. */
const LINES: [number, number][] = [
  [0, 1], [0, 2], [1, 4],
  [2, 3], [3, 4],
  [2, 5], [4, 6], [5, 6],
]

// Project RA/Dec onto the shared 100×100 box: RA grows to the left (as the
// sky is seen looking south), Dec grows upward; one scale for both axes so
// the figure keeps its true proportions.
const PAD = 15
const SKY = (() => {
  const pts = STARS.map(([ra, dec]) => [(6 - ra) * 15, -dec] as [number, number])
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const cx0 = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy0 = (Math.min(...ys) + Math.max(...ys)) / 2
  const span = Math.max(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  )
  const k = (100 - 2 * PAD) / span
  const map = (p: [number, number]): [number, number] => [
    50 + (p[0] - cx0) * k,
    50 + (p[1] - cy0) * k,
  ]
  return { stars: pts.map(map) }
})()

/** Visual radius (100-box units) from apparent magnitude. */
function starRadius(mag: number): number {
  return Math.max(0.7, 2.7 - 0.46 * mag)
}

/** Base brightness 0…1 from magnitude. */
function starBase(mag: number): number {
  return 0.45 + 0.55 * Math.max(0, 1 - mag / 5)
}

const COLORS: [number, number, number][] = [
  [255, 176, 112], // warm — Betelgeuse
  [172, 204, 255], // blue-white — the bright frame of the figure
  [214, 228, 255], // faint white — small stars
]

/** Soft glowing star dot with a near-white core. */
function makeStarSprite(r: number, g: number, b: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.12, `rgba(${r},${g},${b},0.85)`)
  grad.addColorStop(0.38, `rgba(${r},${g},${b},0.26)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return c
}

/** Four-point diffraction spikes for flaring / hero stars. */
function makeSpikeSprite(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  ctx.filter = 'blur(1px)'
  ctx.lineCap = 'round'
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
    const grad = ctx.createLinearGradient(64, 64, 64 + dx * 62, 64 + dy * 62)
    grad.addColorStop(0, 'rgba(235,242,255,0.9)')
    grad.addColorStop(0.25, 'rgba(210,225,255,0.35)')
    grad.addColorStop(1, 'rgba(210,225,255,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(64, 64)
    ctx.lineTo(64 + dx * 62, 64 + dy * 62)
    ctx.stroke()
  }
  return c
}

const BG_STARS = 64 // faint anonymous stars behind the figure

export function OrionViz({ playing }: CoverVizProps) {
  const { getAnalyser } = usePlayer()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // While paused the whole layer fades out via CSS — the last drawn frame
    // dissolves together with the veil, so nothing is cleared here.
    if (!playing) return

    const sprites = COLORS.map(([r, g, b]) => makeStarSprite(r, g, b))
    const spike = makeSpikeSprite()

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let ux = 1
    let uy = 1
    let staticSky = false // reduced motion / no analyser — one still frame
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
      ux = canvas.width / 100
      uy = canvas.height / 100
      // Assigning canvas.width wipes the bitmap; the animated path repaints
      // on the next rAF anyway, the still sky must be repainted by hand.
      if (staticSky) render(0, 0.3)
    }
    const ro = new ResizeObserver(resize)

    // Twinkle phases/speeds for the figure's stars…
    const n = STARS.length
    const PH = new Float32Array(n)
    const SP = new Float32Array(n)
    const FLARE = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      PH[i] = Math.random() * Math.PI * 2
      SP[i] = 1.2 + Math.random() * 2.6
    }
    // …and the anonymous background field.
    const BX = new Float32Array(BG_STARS)
    const BY = new Float32Array(BG_STARS)
    const BR = new Float32Array(BG_STARS)
    const BA = new Float32Array(BG_STARS)
    const BP = new Float32Array(BG_STARS)
    const BS = new Float32Array(BG_STARS)
    for (let i = 0; i < BG_STARS; i++) {
      BX[i] = 3 + Math.random() * 94
      BY[i] = 3 + Math.random() * 94
      BR[i] = 0.16 + Math.random() * 0.4
      BA[i] = 0.08 + Math.random() * 0.24
      BP[i] = Math.random() * Math.PI * 2
      BS[i] = 0.6 + Math.random() * 2.4
    }

    let lineGlow = 0 // constellation figure lights up on the beat
    // Meteor state — at most one at a time, rare on purpose.
    let mLife = 0
    let mX = 0, mY = 0, mVX = 0, mVY = 0
    let lastMeteor = -1e9

    /** Draw one full frame of the sky. */
    const render = (T: number, level: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      const scint = 0.16 + 0.3 * level // music makes the air tremble

      // Background field.
      for (let i = 0; i < BG_STARS; i++) {
        const tw = 1 - scint * (0.5 + 0.5 * Math.sin(T * BS[i] + BP[i]))
        ctx.globalAlpha = BA[i] * tw * (0.75 + 0.5 * level)
        const w = BR[i] * 6 * ux
        ctx.drawImage(sprites[2], BX[i] * ux - w / 2, BY[i] * uy - w / 2, w, w)
      }

      // The hourglass figure — barely-there threads that light up on a kick,
      // never touching the stars themselves.
      const lineA = 0.04 + 0.18 * lineGlow
      ctx.strokeStyle = 'rgb(150,182,255)'
      ctx.lineWidth = Math.max(1, 0.18 * ux)
      ctx.lineCap = 'round'
      for (const [a, b] of LINES) {
        const [ax, ay] = SKY.stars[a]
        const [bx, by] = SKY.stars[b]
        const dx = bx - ax
        const dy = by - ay
        const len = Math.hypot(dx, dy)
        const ga = (starRadius(STARS[a][2]) + 1.6) / len
        const gb = (starRadius(STARS[b][2]) + 1.6) / len
        if (ga + gb >= 1) continue
        ctx.globalAlpha = lineA
        ctx.beginPath()
        ctx.moveTo((ax + dx * ga) * ux, (ay + dy * ga) * uy)
        ctx.lineTo((bx - dx * gb) * ux, (by - dy * gb) * uy)
        ctx.stroke()
      }

      // The stars of Orion.
      for (let i = 0; i < n; i++) {
        const [, , mag, ci] = STARS[i]
        const [sx, sy] = SKY.stars[i]
        const tw = 1 - scint * (0.5 + 0.5 * Math.sin(T * SP[i] + PH[i]))
        const flare = FLARE[i]
        const a = Math.min(1, starBase(mag) * tw * (0.8 + 0.35 * level) * (1 + 1.3 * flare))
        const r = starRadius(mag) * (1 + 0.45 * flare)
        const w = r * 5.4 * ux
        // Diffraction spikes: always a whisper on Betelgeuse and Rigel,
        // full-on when a star flares with the beat.
        const spikeA = (i === 0 || i === 6 ? 0.14 * tw : 0) + 0.55 * flare
        if (spikeA > 0.02) {
          const sw = r * 13 * ux
          ctx.globalAlpha = Math.min(1, spikeA)
          ctx.drawImage(spike, sx * ux - sw / 2, sy * uy - sw / 2, sw, sw)
        }
        ctx.globalAlpha = a
        ctx.drawImage(sprites[ci], sx * ux - w / 2, sy * uy - w / 2, w, w)
      }

      // A meteor, if one is falling.
      if (mLife > 0) {
        const fade = Math.min(1, mLife / 0.25) // burns out at the end
        const tailX = mX - mVX * 0.16
        const tailY = mY - mVY * 0.16
        ctx.strokeStyle = 'rgb(215,230,255)'
        ctx.globalAlpha = 0.14 * fade
        ctx.lineWidth = Math.max(1, 0.9 * ux)
        ctx.beginPath()
        ctx.moveTo(tailX * ux, tailY * uy)
        ctx.lineTo(mX * ux, mY * uy)
        ctx.stroke()
        ctx.globalAlpha = 0.6 * fade
        ctx.lineWidth = Math.max(1, 0.3 * ux)
        ctx.beginPath()
        ctx.moveTo((mX - mVX * 0.09) * ux, (mY - mVY * 0.09) * uy)
        ctx.lineTo(mX * ux, mY * uy)
        ctx.stroke()
        const w = 3 * ux
        ctx.globalAlpha = 0.9 * fade
        ctx.drawImage(sprites[2], mX * ux - w / 2, mY * uy - w / 2, w, w)
      }
      ctx.globalAlpha = 1
    }

    resize()
    ro.observe(canvas)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const analyser = getAnalyser()
    if (reduce || !analyser) {
      // Reduced motion / no Web Audio: a still evening sky is the picture.
      staticSky = true
      lineGlow = 0.12
      render(0, 0.3)
      return () => ro.disconnect()
    }

    const bins = new Uint8Array(analyser.frequencyBinCount)
    const beat = createBeatTracker()
    let lastT = 0
    let raf = 0

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = (lastT ? Math.min(64, now - lastT) : 16) / 1000
      lastT = now
      const T = now / 1000

      analyser.getByteFrequencyData(bins)
      const { level, kick } = beat.update(bins, dt, now)

      lineGlow *= Math.exp(-dt / 0.9)
      for (let i = 0; i < n; i++) FLARE[i] *= Math.exp(-dt / 0.55)
      if (kick > 0) {
        // The figure lights up and one or two stars answer the beat.
        lineGlow = Math.max(lineGlow, 0.35 + 0.65 * kick)
        for (let f = 0, m = kick > 0.5 ? 2 : 1; f < m; f++) {
          const i = Math.floor(Math.random() * n)
          FLARE[i] = Math.max(FLARE[i], kick * (0.6 + 0.4 * Math.random()))
        }
        // A good kick may send a meteor across the sky — a recurring guest,
        // but never a swarm: one at a time, with a breath between falls.
        if (kick > 0.4 && now - lastMeteor > 5000 && mLife <= 0 && Math.random() < 0.65) {
          lastMeteor = now
          const dir = Math.random() < 0.5 ? 1 : -1
          const ang = (0.35 + 0.35 * Math.random()) * dir
          const sp = 100 + 60 * Math.random()
          mX = dir > 0 ? 6 + Math.random() * 30 : 64 + Math.random() * 30
          mY = 4 + Math.random() * 22
          mVX = Math.cos(ang) * sp * dir
          mVY = Math.abs(Math.sin(ang)) * sp
          mLife = 1
        }
      }
      if (mLife > 0) {
        mLife -= dt
        mX += mVX * dt
        mY += mVY * dt
      }

      render(T, level)
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [playing, getAnalyser])

  return (
    <div className={cx(styles.night, playing && styles.playing)} aria-hidden="true">
      <span className={styles.veil} />
      <canvas ref={canvasRef} className={styles.viz} aria-hidden="true" />
    </div>
  )
}
