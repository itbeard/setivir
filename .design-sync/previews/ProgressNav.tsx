import { ProgressNav } from 'setivir'
import { SONGS } from './_fixtures'

// A vertical progress rail (the desktop side-nav): one tick per song with its
// two-digit number, the active track highlighted in red. It's position:fixed
// and desktop-only (its CSS hides it below 1025px wide or 760px tall), so the
// card uses a wide/tall viewport (set in config). A compact, centered
// containing block keeps the rail near the middle instead of stranded at the
// card's edge.
export function Default() {
  return (
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        height: 360,
        width: 120,
        margin: '0 auto',
      }}
    >
      <ProgressNav songs={SONGS} activeIndex={2} />
    </div>
  )
}
