import type { CoverVizComponent } from './types'
import { LightningViz } from './LightningViz'
import { BarsViz } from './BarsViz'

/**
 * Рэестр візуалізатараў вокладкі / cover visualizer registry.
 *
 * Каб даць песьні сваю візуалізацыю: дадайце кампанэнт побач (глядзіце
 * LightningViz як узор — прымае CoverVizProps, малюе вакол рамкі, не па ёй),
 * зарэгіструйце яго тут і пастаўце ягоны ключ у полі `viz` адпаведнага запісу
 * ASSETS у data/songs.ts. Песьні без `viz` атрымліваюць DEFAULT_VISUALIZER.
 */
export const VISUALIZERS: Record<string, CoverVizComponent> = {
  lightning: LightningViz,
  bars: BarsViz,
}

export const DEFAULT_VISUALIZER = 'lightning'

/** Component for the given visualizer id, falling back to the default. */
export function resolveVisualizer(id?: string): CoverVizComponent {
  return (id !== undefined && VISUALIZERS[id]) || VISUALIZERS[DEFAULT_VISUALIZER]
}
