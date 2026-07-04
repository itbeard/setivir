import type { Song } from '../../types'
import { resolveVisualizer } from './registry'

/**
 * The beat-reactive aura around the current track's cover. Dispatches to the
 * song's own visualizer when one is set (song.visualizer → registry key),
 * otherwise to the default. Mount it only for the current track.
 */
export function CoverViz({ song, playing }: { song: Song; playing: boolean }) {
  const Viz = resolveVisualizer(song.visualizer)
  return <Viz playing={playing} />
}
