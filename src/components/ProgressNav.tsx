import type { Song } from '../types'
import { getSections, scrollToId, scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { usePlayer } from '../audio/PlayerContext'
import { cx } from '../lib/cx'
import styles from './ProgressNav.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function ProgressNav({
  songs,
  activeIndex,
  newIds,
}: {
  songs: Song[]
  activeIndex: number
  /** Ids of songs added since the visitor's last visit (still unseen). */
  newIds?: Set<number>
}) {
  const { t, loc } = useI18n()
  const { current, isPlaying } = usePlayer()
  // Sections are intro (0), songs (1..N), outro (N+1).
  const outroActive = activeIndex === songs.length + 1

  return (
    <nav className={styles.rail} aria-label={t('a11y.openMenu')}>
      <ul className={styles.list}>
        <li className={styles.edge}>
          <button
            type="button"
            className={cx(styles.tick, styles.edgeTick, activeIndex === 0 && styles.active)}
            onClick={() => scrollToIndex(0)}
            aria-current={activeIndex === 0 ? 'true' : undefined}
            aria-label={t('sheet.intro')}
            title={t('sheet.intro')}
          >
            <span className={styles.line} />
            <span className={styles.num}>◆</span>
          </button>
        </li>
        {songs.map((s, i) => {
          // Songs occupy section indices 1..N (intro is 0), in render order.
          const active = activeIndex === i + 1
          const playing = current?.id === s.id && isPlaying
          const isNew = newIds?.has(s.id) ?? false
          return (
            <li key={s.id}>
              <button
                type="button"
                className={cx(
                  styles.tick,
                  active && styles.active,
                  playing && styles.playing,
                  isNew && styles.isNew,
                )}
                onClick={() => scrollToId(`song-${s.slug}`)}
                aria-current={active ? 'true' : undefined}
                aria-label={`${s.id}. ${loc(s.title)}${isNew ? ` — ${t('new.badge')}` : ''}`}
                title={`${pad2(s.id)} · ${loc(s.title)}`}
              >
                <span className={styles.line} />
                <span className={styles.num}>{pad2(s.id)}</span>
                {isNew && <span className={styles.ember} aria-hidden="true" />}
              </button>
            </li>
          )
        })}
        <li className={styles.edge}>
          <button
            type="button"
            className={cx(styles.tick, styles.edgeTick, outroActive && styles.active)}
            onClick={() => scrollToIndex(getSections().length - 1)}
            aria-current={outroActive ? 'true' : undefined}
            aria-label={t('sheet.outro')}
            title={t('sheet.outro')}
          >
            <span className={styles.line} />
            <span className={styles.num}>◆</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
