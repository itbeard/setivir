import { TopBar } from 'setivir'
import { SONGS } from './_fixtures'

// The fixed top bar: wordmark "SETIVIR" on the left, a centred track counter
// (only when a song is active) that opens a quick-nav dropdown on click, and
// BE·EN language toggles on the right. It's position:fixed (top-anchored), so
// each cell wraps it in a sized, transformed containing block — otherwise the
// bar would collapse/clip. Height ~120 keeps the top-anchored bar pinned to
// the top of the card. The dropdown only opens on click, so it's shown closed.

// Active song in view — the centred "01 / 20" counter is visible.
export function OnSong() {
  return (
    <div style={{ position: 'relative', transform: 'translateZ(0)', height: 120, width: '100%' }}>
      <TopBar activeSong={1} total={20} songs={SONGS} />
    </div>
  )
}

// Intro / landing state — no active song, so no counter: just the wordmark and
// the BE·EN language toggles.
export function Intro() {
  return (
    <div style={{ position: 'relative', transform: 'translateZ(0)', height: 120, width: '100%' }}>
      <TopBar activeSong={null} total={20} songs={SONGS} />
    </div>
  )
}
