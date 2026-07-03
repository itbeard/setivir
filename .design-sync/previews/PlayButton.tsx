import { PlayButton } from 'setivir'
import { RODNY } from './_fixtures'

// A circular play/pause control bound to a track. Colour and icon follow the
// player state; the active (pause) look is playback-driven and can't render
// statically, so the cards show the idle state at both sizes.

export function Default() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
      <PlayButton song={RODNY} />
    </div>
  )
}

export function Large() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
      <PlayButton song={RODNY} large />
    </div>
  )
}
