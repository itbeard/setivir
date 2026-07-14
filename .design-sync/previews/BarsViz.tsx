import { BarsViz } from 'setivir'

// The radial spectrum-bar halo (successor of the old CoverWave look). Without
// live audio it draws the RESTING bars — a static red radial spectrum, ideal
// for a still card. Needs a sized, position:relative parent with a TRANSPARENT
// background (the aura sits at z-index:-1), and `playing` to fade the aura in.

export function RestingBars() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <BarsViz playing />
    </div>
  )
}
