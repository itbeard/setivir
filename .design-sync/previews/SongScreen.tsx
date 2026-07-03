import { SongScreen } from 'setivir'
import { RODNY } from './_fixtures'

// A full-screen song card: index, cover frame, title, metadata rows, a
// markdown description, and three collapsible disclosures (lyrics + the two
// generation prompts). Rendered as a single tall card — it's a full-viewport
// section. The cover image doesn't load in previews (see NOTES.md).

export function Default() {
  return <SongScreen song={RODNY} total={20} />
}
