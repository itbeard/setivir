import type { ComponentType } from 'react'

/**
 * Props every cover visualizer receives. A visualizer is mounted inside
 * .coverWrap (position: relative) whenever its song is the current track, and
 * animates only while `playing` is true. Most visualizers render *around* the
 * framed cover art; one may also paint over the art itself (see OrionViz's
 * night sky), but never over the frame chrome or the cover controls.
 */
export interface CoverVizProps {
  /** True while this song is actually sounding (not paused). */
  playing: boolean
}

export type CoverVizComponent = ComponentType<CoverVizProps>
