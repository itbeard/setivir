/**
 * Shared "bowed tone" detector for cover visualizers.
 *
 * Looks at the band where violin/cello fundamentals and their harmonics live
 * (≈1–7 kHz with the player's fftSize 256 → ≈172 Hz per bin). A bowed,
 * sustained tone keeps this band loud with little frame-to-frame change (low
 * spectral flux); drums and plucks are the opposite. Returns an eased 0…1
 * "a bowed string is sounding" — visuals that should sway with the bow, not
 * the beat, drive off this.
 */
export const BOW_LO = 6
export const BOW_HI = 40

export interface BowTracker {
  /** Feed one frame of analyser data; dt in seconds. Returns eased 0…1. */
  update(bins: Uint8Array, dt: number): number
}

export function createBowTracker(): BowTracker {
  const prev = new Uint8Array(BOW_HI)
  let fluxAvg = 0.3 // running typical flux in the band
  let bowed = 0
  return {
    update(bins, dt) {
      let sum = 0
      let flux = 0
      for (let b = BOW_LO; b < BOW_HI; b++) {
        sum += bins[b]
        flux += Math.abs(bins[b] - prev[b])
        prev[b] = bins[b]
      }
      const loud = Math.min(1, (sum / (BOW_HI - BOW_LO) / 255) * 2.2)
      const rate = flux / ((BOW_HI - BOW_LO) * 255) / dt
      fluxAvg += (rate - fluxAvg) * (1 - Math.exp(-dt / 2))
      const steady = Math.max(0, 1 - rate / (fluxAvg * 1.6 + 0.05))
      const raw = loud ** 1.2 * (0.35 + 0.65 * steady)
      bowed += (raw - bowed) * (raw > bowed ? 1 - Math.exp(-dt / 0.12) : 1 - Math.exp(-dt / 0.45))
      return bowed
    },
  }
}
