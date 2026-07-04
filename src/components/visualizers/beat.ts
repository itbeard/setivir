/**
 * Shared beat detection for cover visualizers.
 *
 * Positive spectral flux over the bass bins — the energy that ARRIVED this
 * frame — compared against an adaptive running norm. This self-calibrates per
 * song: kicks stand out even under a dense, never-quiet bassline, where an
 * average-level detector goes blind. All smoothing is time-based, so a 120Hz
 * display hears the same beats as a 60Hz one.
 */
export interface BeatFrame {
  /** Eased overall bass loudness 0…1 — drive glows and ambient intensity. */
  level: number
  /** Raw bass weight 0…1 this frame. */
  bass: number
  /** Kick strength ~0.3…1 when a beat fired this frame, else 0. */
  kick: number
}

export interface BeatTracker {
  /** Feed one frame of analyser data. dt in seconds, now in ms (rAF clock). */
  update(bins: Uint8Array, dt: number, now: number): BeatFrame
}

export function createBeatTracker(): BeatTracker {
  const prev = new Uint8Array(12) // last frame's bass bins
  let level = 0
  let fluxAvg = 0.4 // running typical flux rate — the adaptive threshold
  let startT = 0 // first-audio timestamp, guards the warm-up
  let lastKick = 0

  return {
    update(bins, dt, now) {
      let sum = 0
      let fluxSum = 0
      for (let i = 1; i < 12; i++) {
        sum += bins[i]
        const d = bins[i] - prev[i]
        if (d > 0) fluxSum += d
        prev[i] = bins[i]
      }
      const bass = Math.min(1, (sum / 11 / 255) * 1.5)
      // The first frame's flux is bogus (prev bins were zero) — drop it, and
      // seed the level so pressing play doesn't read as a jump from silence.
      const rate = startT ? fluxSum / (11 * 255) / dt : 0
      if (!startT) {
        startT = now
        level = bass
      }
      level += (bass - level) * (bass > level ? 1 - Math.exp(-dt / 0.03) : 1 - Math.exp(-dt / 0.25))
      fluxAvg += (rate - fluxAvg) * (1 - Math.exp(-dt / 1.5))

      // A kick: flux clearly above the song's norm, with real bass weight
      // behind it — never right after play, while the norm is still settling.
      const k = rate / (fluxAvg + 0.05)
      let kick = 0
      if (now - startT > 500 && k > 1.7 && bass > 0.4 && now - lastKick > 150) {
        lastKick = now
        kick = 0.3 + 0.7 * Math.min(1, (k - 1.7) / 2.2)
      }
      return { level, bass, kick }
    },
  }
}
