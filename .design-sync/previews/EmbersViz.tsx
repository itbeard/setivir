import { EmbersViz } from 'setivir'

// The default cover visualizer: ember sparks that drift out from behind the
// cover frame, with a soft red radial glow. Without live audio (no analyser in
// a static card) the spark canvas stays clear and the beat-less glow remains —
// that resting warmth is the honest static state. Needs a sized,
// position:relative parent with a TRANSPARENT background (the aura sits at
// z-index:-1 and would hide behind an opaque container), and `playing` to
// fade the aura in (opacity is 0 otherwise).

export function RestingGlow() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <EmbersViz playing />
    </div>
  )
}
