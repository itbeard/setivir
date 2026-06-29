import type { Song } from '../types'
import { usePlayer } from '../audio/PlayerContext'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { PlayIcon, PauseIcon } from './icons'
import styles from './PlayButton.module.css'

export function PlayButton({ song, large = false }: { song: Song; large?: boolean }) {
  const { toggle, isCurrent, isPlaying } = usePlayer()
  const { t, loc } = useI18n()
  const active = isCurrent(song) && isPlaying
  const label = `${active ? t('player.pause') : t('player.play')} — ${loc(song.title)}`

  return (
    <button
      type="button"
      className={cx(styles.btn, large && styles.large, active && styles.active)}
      onClick={() => toggle(song)}
      aria-label={label}
      aria-pressed={active}
    >
      <span className={styles.icon}>{active ? <PauseIcon /> : <PlayIcon />}</span>
    </button>
  )
}
