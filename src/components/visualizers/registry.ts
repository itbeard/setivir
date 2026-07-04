import type { CoverVizComponent } from './types'
import { EmbersViz } from './EmbersViz'
import { LightningViz } from './LightningViz'
import { BarsViz } from './BarsViz'
import { OrionViz } from './OrionViz'

/**
 * Рэестр візуалізатараў вокладкі / cover visualizer registry.
 *
 * Каб даць песьні сваю візуалізацыю: дадайце кампанэнт побач (глядзіце
 * EmbersViz як узор — прымае CoverVizProps, малюе вакол рамкі, не па ёй),
 * зарэгіструйце яго тут і пастаўце ягоны ключ у полі `viz` адпаведнага запісу
 * ASSETS у data/songs.ts. Песьні без `viz` атрымліваюць DEFAULT_VISUALIZER.
 */
export const VISUALIZERS: Record<string, CoverVizComponent> = {
  embers: EmbersViz,
  lightning: LightningViz,
  bars: BarsViz,
  orion: OrionViz,
}

export const DEFAULT_VISUALIZER = 'embers'

/** Component for the given visualizer id, falling back to the default. */
export function resolveVisualizer(id?: string): CoverVizComponent {
  return (id !== undefined && VISUALIZERS[id]) || VISUALIZERS[DEFAULT_VISUALIZER]
}
