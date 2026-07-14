import { LightningViz } from 'setivir'

// Beat-reactive lightning: runners race along the cover frame's rail and
// strikes flash on kicks. Without live audio (no analyser in a static card)
// only the soft beat-less glow renders — the honest static state. Needs a
// sized, position:relative parent with a TRANSPARENT background (the aura sits
// at z-index:-1), and `playing` to fade the aura in.

export function RestingGlow() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <LightningViz playing />
    </div>
  )
}
