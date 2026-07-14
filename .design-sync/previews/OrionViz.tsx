import { OrionViz } from 'setivir'

// The constellation visualizer: an evening-veil night sky with scintillating
// stars painted over the cover area. Without live audio it draws one still
// frame of the sky — a genuine static render. Needs a sized, position:relative
// parent with a TRANSPARENT background, and `playing` (it renders nothing at
// all when not playing).

export function StillSky() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <OrionViz playing />
    </div>
  )
}
