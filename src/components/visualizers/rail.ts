/**
 * Shared "rail" geometry for cover visualizers: a rounded square around the
 * framed cover art, in the visualizer's 100×100 box coordinates. The
 * visualizer layer spans inset:-40% of the cover wrap, so the framed art
 * occupies 22.2…77.8 — half-extent ≈27.8 around the centre (50,50). A rail
 * with a larger half-extent runs outside the frame; ≈27.6 hugs its edge.
 *
 * Each LUT sample is 5 floats: x, y, outward-normal x/y, and `env` — a taper
 * envelope that is 1 at the left/right sides and ≈0.25 at the very top and
 * bottom, so effects stay clear of the track number above the cover and the
 * title below it.
 */
export interface Rail {
  /** Total perimeter length (arc-length domain of the rail). */
  perim: number
  /** Number of LUT samples. */
  n: number
  /** Stride-5 samples: x, y, nx, ny, env. */
  lut: Float32Array
}

/** Corner-arc centre signs per side (top→right→bottom→left, clockwise). */
const SX = [1, 1, -1, -1]
const SY = [-1, 1, 1, -1]

export function buildRail(halfExtent: number, cornerR: number, samples = 256): Rail {
  const edge = 2 * (halfExtent - cornerR)
  const side = edge + (Math.PI / 2) * cornerR
  const perim = 4 * side

  /** Point + outward normal at arc-length s; sides run clockwise from the top edge. */
  const at = (s: number): [number, number, number, number] => {
    s = ((s % perim) + perim) % perim
    const q = Math.floor(s / side)
    const u = s - q * side
    let x: number, y: number, nx: number, ny: number
    if (u < edge) {
      const t = u - (halfExtent - cornerR) // −(H−C)…(H−C) along the edge
      switch (q) {
        case 0: x = t; y = -halfExtent; nx = 0; ny = -1; break // top, →
        case 1: x = halfExtent; y = t; nx = 1; ny = 0; break // right, ↓
        case 2: x = -t; y = halfExtent; nx = 0; ny = 1; break // bottom, ←
        default: x = -halfExtent; y = -t; nx = -1; ny = 0; break // left, ↑
      }
    } else {
      const ang = (q - 1) * (Math.PI / 2) + (u - edge) / cornerR
      nx = Math.cos(ang)
      ny = Math.sin(ang)
      x = SX[q] * (halfExtent - cornerR) + cornerR * nx
      y = SY[q] * (halfExtent - cornerR) + cornerR * ny
    }
    return [50 + x, 50 + y, nx, ny]
  }

  const lut = new Float32Array(samples * 5)
  for (let i = 0; i < samples; i++) {
    const [x, y, nx, ny] = at((i / samples) * perim)
    const phi = Math.atan2(y - 50, x - 50)
    lut[i * 5] = x
    lut[i * 5 + 1] = y
    lut[i * 5 + 2] = nx
    lut[i * 5 + 3] = ny
    lut[i * 5 + 4] = 0.25 + 0.75 * Math.abs(Math.cos(phi)) ** 1.1
  }
  return { perim, n: samples, lut }
}

/** Offset into rail.lut of the sample nearest to arc-length `s` (stride 5). */
export function railOffset(rail: Rail, s: number): number {
  return ((Math.round((s / rail.perim) * rail.n) % rail.n) + rail.n) % rail.n * 5
}
