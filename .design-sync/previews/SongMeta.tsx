import { SongMeta } from 'setivir'
import { RODNY } from './_fixtures'

// The song-detail metadata list: a <dl> of author / model / released date.
// Small but complete — padded and width-capped so the definition list reads as
// an intentional block rather than three loose lines.

export function Default() {
  return (
    <div style={{ padding: 32, maxWidth: 480 }}>
      <SongMeta song={RODNY} />
    </div>
  )
}
