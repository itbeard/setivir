import type { Song } from '../types'
import { isPlaceholder } from '../data/songs'
import { assetUrl } from '../lib/assets'
import { cx } from '../lib/cx'
import { goNext } from '../lib/nav'
import { usePlayer } from '../audio/PlayerContext'
import { useI18n } from '../i18n/I18nContext'
import { PlayButton } from './PlayButton'
import { SongMeta } from './SongMeta'
import { PromptDisclosure } from './PromptDisclosure'
import { Ornament } from './Ornament'
import { CoverWave } from './CoverWave'
import styles from './SongScreen.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function SongScreen({ song, total }: { song: Song; total: number }) {
  const { t, loc, lang } = useI18n()
  const { current, isCurrent, isPlaying } = usePlayer()
  const trackActive = current !== null
  const isThisTrack = isCurrent(song)
  const title = loc(song.title)
  const description = loc(song.description)
  const descPlaceholder = isPlaceholder(description)
  const lyrics = loc(song.lyrics)

  return (
    <section
      id={`song-${song.slug}`}
      data-section
      data-kind="song"
      className={cx('section', styles.screen)}
      aria-label={`${t('meta.song')} ${song.id}: ${title}`}
    >
      <article className={styles.card}>
        <div className={styles.index}>
          <span className={styles.num}>№&nbsp;{pad2(song.id)}</span>
          <span className={styles.total}>/ {pad2(total)}</span>
        </div>

        <div className={styles.coverWrap}>
          {isThisTrack && <CoverWave playing={isPlaying} />}
          <div className={styles.frame}>
            <img
              className={styles.cover}
              src={assetUrl(song.cover)}
              alt={title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className={styles.playDock}>
            <PlayButton song={song} large />
          </div>
        </div>

        <h2 className={styles.title}>{title}</h2>
        <Ornament className={styles.ornament} />

        <div className={styles.text}>
          {description.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className={cx(styles.description, descPlaceholder && 'is-placeholder')}>
              {para.trim()}
            </p>
          ))}
        </div>

        <SongMeta song={song} />

        <div className={styles.prompts}>
          <PromptDisclosure
            label={t('lyrics.label')}
            content={lyrics}
            note={
              lang === 'en' && !isPlaceholder(lyrics)
                ? t('lyrics.translationNote')
                : undefined
            }
          />
          <PromptDisclosure label={t('prompt.style')} content={song.stylePrompt} />
          <PromptDisclosure label={t('prompt.lyrics')} content={song.lyricsPrompt} />
        </div>
      </article>

      <button
        type="button"
        className={cx(styles.next, trackActive && styles.nextLifted)}
        onClick={goNext}
        aria-label={t('card.nextSong')}
      >
        <span className={styles.nextChevron} aria-hidden="true" />
      </button>
    </section>
  )
}
