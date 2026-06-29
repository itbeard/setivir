import { useState } from 'react'
import { usePlayer, formatTime } from '../audio/PlayerContext'
import { useI18n } from '../i18n/I18nContext'
import { assetUrl } from '../lib/assets'
import { scrollToId } from '../lib/nav'
import { PlayIcon, PauseIcon } from './icons'
import styles from './MiniPlayer.module.css'

export function MiniPlayer() {
  const { current, isPlaying, currentTime, duration, toggle, seek } = usePlayer()
  const { t, loc } = useI18n()

  // While the user drags the slider, drive it from local state so incoming
  // timeupdate events can't make the thumb jitter.
  const [scrub, setScrub] = useState<number | null>(null)

  if (!current) return null
  const title = loc(current.title)
  const max = duration || 0
  const shownTime = scrub ?? currentTime
  const sliderValue = Math.min(shownTime, max)

  return (
    <div className={styles.bar} role="region" aria-label={t('player.nowPlaying')}>
      <button
        type="button"
        className={styles.coverBtn}
        onClick={() => scrollToId(`song-${current.slug}`)}
        aria-label={title}
      >
        <img className={styles.cover} src={assetUrl(current.cover)} alt="" />
      </button>

      <div className={styles.info}>
        <span className={styles.label}>{t('player.nowPlaying')}</span>
        <span className={styles.title}>{title}</span>
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={() => toggle(current)}
        aria-label={isPlaying ? t('player.pause') : t('player.play')}
        aria-pressed={isPlaying}
      >
        <span className={styles.toggleIcon}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
      </button>

      <div className={styles.seekWrap}>
        <span className={styles.time}>{formatTime(shownTime)}</span>
        <input
          type="range"
          className={styles.seek}
          min={0}
          max={max}
          step={0.1}
          value={sliderValue}
          onPointerDown={() => setScrub(currentTime)}
          onChange={(e) => {
            const v = Number(e.target.value)
            setScrub(v)
            seek(v)
          }}
          onPointerUp={() => setScrub(null)}
          onBlur={() => setScrub(null)}
          disabled={!duration}
          aria-label={t('player.seek')}
          aria-valuetext={`${formatTime(shownTime)} / ${formatTime(duration)}`}
        />
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
