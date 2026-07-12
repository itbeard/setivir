import { useState } from 'react'
import type { Song } from '../types'
import { isPlaceholder } from '../data/songs'
import { assetUrl, downloadName } from '../lib/assets'
import { cx } from '../lib/cx'
import { goNextFrom } from '../lib/nav'
import { usePlayer } from '../audio/PlayerContext'
import { useI18n } from '../i18n/I18nContext'
import { settings } from '../settings'
import { PlayButton } from './PlayButton'
import { SongMeta } from './SongMeta'
import { PromptDisclosure } from './PromptDisclosure'
import { CoverViz } from './visualizers/CoverViz'
import { Lightbox } from './Lightbox'
import { DownloadIcon, LinkIcon } from './icons'
import { useCopyTrackLink } from '../hooks/useCopyTrackLink'
import { Markdown } from '../lib/markdown'
import styles from './SongScreen.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/** First line of the original lyrics, for the margin mural (art layer). */
function muralLine(song: Song): string | undefined {
  if (!settings.lyricsMural || isPlaceholder(song.lyrics.be)) return undefined
  const line = (song.lyrics.be.split('\n')[0] ?? '').replace(/[,.…]+\s*$/, '').trim()
  return line || undefined
}

export function SongScreen({
  song,
  total,
  alt = false,
}: {
  song: Song
  total: number
  /** Gallery rhythm: every 2nd rendered song sits on --paper-2. */
  alt?: boolean
}) {
  const { t, loc, lang } = useI18n()
  const { current, isCurrent, isPlaying } = usePlayer()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { copied: linkCopied, copy: copyTrackLink } = useCopyTrackLink(song.slug)
  const trackActive = current !== null
  const isThisTrack = isCurrent(song)
  const title = loc(song.title)
  const description = loc(song.description)
  const descPlaceholder = isPlaceholder(description)
  const lyrics = loc(song.lyrics)
  const lyricsNotes = loc(song.lyricsNotes).trim()
  // On the English version the Belarusian original follows the translation
  // inside the same Lyrics disclosure.
  const originalLyrics = song.lyrics.be
  const showOriginal =
    lang === 'en' && !isPlaceholder(originalLyrics) && originalLyrics !== lyrics

  return (
    <section
      id={`song-${song.slug}`}
      data-section
      data-kind="song"
      data-num={settings.marginNumeral ? pad2(song.id) : undefined}
      data-mural={muralLine(song)}
      className={cx('section', styles.screen, alt && styles.altRow)}
      aria-label={`${t('meta.song')} ${song.id}: ${title}`}
    >
      <article className={styles.card} data-anim-stack>
        <div className={styles.index}>
          <span className={styles.num}>№&nbsp;{pad2(song.id)}</span>
          <span className={styles.total}>/ {pad2(total)}</span>
        </div>

        <div className={styles.coverWrap}>
          {isThisTrack && <CoverViz song={song} playing={isPlaying} />}
          <div className={styles.frame}>
            <button
              type="button"
              className={styles.zoom}
              onClick={() => setLightboxOpen(true)}
              aria-label={`${t('song.viewCover')} — ${title}`}
              title={t('song.viewCover')}
            >
              <img
                className={styles.cover}
                src={assetUrl(song.cover)}
                alt={title}
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
          <div className={styles.playDock}>
            <PlayButton song={song} large />
          </div>
          <a
            className={cx(styles.coverAction, styles.coverDownload)}
            href={assetUrl(song.audio)}
            download={downloadName(song.title.be, song.audio)}
            aria-label={`${t('song.downloadShort')} — ${title}`}
            title={t('song.downloadShort')}
          >
            <DownloadIcon />
          </a>
          <button
            type="button"
            className={cx(styles.coverAction, styles.coverShare)}
            onClick={copyTrackLink}
            aria-label={`${t('song.copyLink')} — ${title}`}
            title={t('song.copyLink')}
          >
            <LinkIcon />
          </button>
          {linkCopied && (
            <span className={styles.copyToast} role="status">
              {t('song.linkCopied')}
            </span>
          )}
        </div>

        <h2 className={styles.title}>{title}</h2>

        <SongMeta song={song} />

        <div className={styles.text}>
          <Markdown
            text={description}
            paragraphClassName={cx(styles.description, descPlaceholder && 'is-placeholder')}
          />
        </div>

        <div className={styles.prompts}>
          <PromptDisclosure
            label={t('lyrics.label')}
            content={lyrics}
            note={
              lang === 'en' && !isPlaceholder(lyrics)
                ? t('lyrics.translationNote')
                : undefined
            }
            original={
              showOriginal
                ? { label: t('lyrics.original'), content: originalLyrics }
                : undefined
            }
            copyable
          />
          {lyricsNotes && (
            <PromptDisclosure label={t('lyrics.notes')} content={lyricsNotes} markdown />
          )}
          <PromptDisclosure label={t('prompt.style')} content={song.stylePrompt} copyable />
          <PromptDisclosure label={t('prompt.lyrics')} content={song.lyricsPrompt} copyable />
        </div>
      </article>

      <button
        type="button"
        className={cx(styles.next, trackActive && styles.nextLifted)}
        onClick={(e) => goNextFrom(e.currentTarget)}
        aria-label={t('card.nextSong')}
        title={t('card.nextSong')}
      >
        <span className={styles.nextChevron} aria-hidden="true" />
      </button>

      {lightboxOpen && <Lightbox song={song} onClose={() => setLightboxOpen(false)} />}
    </section>
  )
}
