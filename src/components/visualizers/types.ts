import type { ComponentType } from 'react'

/**
 * Props every cover visualizer receives. A visualizer is mounted inside
 * .coverWrap (position: relative) whenever its song is the current track, and
 * animates only while `playing` is true. It must render *around* the framed
 * cover art without painting over the frame itself.
 */
export interface CoverVizProps {
  /** True while this song is actually sounding (not paused). */
  playing: boolean
}

export type CoverVizComponent = ComponentType<CoverVizProps>
