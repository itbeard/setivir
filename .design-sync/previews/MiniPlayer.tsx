import { useEffect } from 'react'
import { MiniPlayer, usePlayer } from 'setivir'
import { RODNY } from './_fixtures'

// The persistent bottom now-playing bar. It renders nothing until a track is
// active, so the story seeds one through the player context on mount (the
// cover image itself doesn't load in previews — see NOTES.md). Rendered as a
// single full-bleed card so the fixed bar stays inside the card.

export function NowPlaying() {
  const { current, toggle } = usePlayer()
  useEffect(() => {
    // Defer past the provider's own mount effect (which creates the shared
    // <audio> element) — effects fire bottom-up, so an immediate toggle would
    // no-op against a not-yet-created audio ref.
    const t = setTimeout(() => {
      if (!current) toggle(RODNY)
    }, 0)
    return () => clearTimeout(t)
  }, [current, toggle])
  // The bar is position:fixed (bottom-anchored). Give it a sized, transformed
  // containing block so it sits near the bottom of the card instead of
  // collapsing to zero height and clipping.
  return (
    <div style={{ position: 'relative', transform: 'translateZ(0)', height: 180, width: '100%' }}>
      <MiniPlayer />
    </div>
  )
}
