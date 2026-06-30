import type { Song } from '../types'
import { scrollToId } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import styles from './ProgressNav.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function ProgressNav({
  songs,
  activeIndex,
}: {
  songs: Song[]
  activeIndex: number
}) {
  const { t, loc } = useI18n()

  return (
    <nav className={styles.rail} aria-label={t('a11y.openMenu')}>
      <ul className={styles.list}>
        {songs.map((s, i) => {
          // Songs occupy section indices 1..N (intro is 0), in render order.
          const active = activeIndex === i + 1
          return (
            <li key={s.id}>
              <button
                type="button"
                className={cx(styles.tick, active && styles.active)}
                onClick={() => scrollToId(`song-${s.slug}`)}
                aria-current={active ? 'true' : undefined}
                aria-label={`${s.id}. ${loc(s.title)}`}
                title={`${pad2(s.id)} · ${loc(s.title)}`}
              >
                <span className={styles.line} />
                <span className={styles.num}>{pad2(s.id)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
