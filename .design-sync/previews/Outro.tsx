import { Outro } from 'setivir'

// The closing screen: an ornament divider, the "thank you for listening"
// display-serif heading, a follow link, the track-order toggle ("20 → 01"),
// a back-to-top button, and the copyright line. In-flow `.section`,
// single-card viewport (1000x820). The order toggle is stateful in the app
// (useTrackOrder); here it gets the chronological state and a no-op handler.

export function Default() {
  return <Outro total={20} order="chrono" onToggleOrder={() => {}} />
}
