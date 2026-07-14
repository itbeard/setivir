import { CoverViz } from 'setivir'
import { RODNY } from './_fixtures'

// The dispatcher the app itself mounts: picks the song's own visualizer
// (song.visualizer → registry key: embers | lightning | bars | orion),
// falling back to the default (embers). Shown here dispatching to the
// resting-bars look via the fixture's `visualizer` field. Same container
// rules as the visualizers themselves: sized, position:relative, transparent
// background, and only mount it for the current track.

export function Default() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <CoverViz song={{ ...RODNY, visualizer: 'bars' }} playing />
    </div>
  )
}
