import styles from './PaperGrain.module.css'

/** Fixed paper-grain overlay (inline SVG feTurbulence noise, tiled). */
export function PaperGrain() {
  return <div className={styles.grain} aria-hidden="true" />
}
