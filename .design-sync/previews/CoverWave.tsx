import { CoverWave } from 'setivir'

// The radial audio-spectrum halo that rings the cover art. With `playing` it
// becomes visible (opacity 1); without live audio it paints the RESTING bars —
// a static red radial spectrum, ideal for a still card. Needs a sized,
// position:relative parent and a TRANSPARENT background (the halo sits at
// z-index:-1 and would hide behind an opaque container).

export function Default() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <CoverWave playing />
    </div>
  )
}
