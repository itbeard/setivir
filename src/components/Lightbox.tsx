import { useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Song } from '../types'
import { assetUrl, downloadName } from '../lib/assets'
import { useI18n } from '../i18n/I18nContext'
import { useModalDialog } from '../hooks/useModalDialog'
import { useCopyTrackLink } from '../hooks/useCopyTrackLink'
import { DownloadIcon, LinkIcon } from './icons'
import styles from './Lightbox.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/**
 * Cover lightbox: framed artwork, `№ NN · author · date` caption and the
 * download / copy-link pills. Modal a11y (focus trap, Esc, scrim tap, scroll
 * lock) comes from useModalDialog. Mounted only while open, so the <img>
 * never renders with an unresolved src.
 */
export function Lightbox({ song, onClose }: { song: Song; onClose: () => void }) {
  const { t, loc } = useI18n()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const title = loc(song.title)
  const { copied: linkCopied, copy: copyTrackLink } = useCopyTrackLink(song.slug)

  useModalDialog(overlayRef, onClose)

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.scrim} onClick={onClose} />
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <img className={styles.img} src={assetUrl(song.coverFull)} alt={title} />
          {linkCopied && (
            <span className={styles.copyToast} role="status">
              {t('song.linkCopied')}
            </span>
          )}
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.title}>{title}</span>
          <span className={styles.meta}>
            № {pad2(song.id)} · {loc(song.lyricsAuthor)} · {song.date}
          </span>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.pill}
              onClick={copyTrackLink}
              title={t('song.copyLink')}
            >
              <LinkIcon /> {t('song.copyLink')}
            </button>
            <a
              className={styles.pill}
              href={assetUrl(song.audio)}
              download={downloadName(song.title.be, song.audio)}
              title={t('song.downloadShort')}
            >
              <DownloadIcon /> {t('song.downloadShort')}
            </a>
          </div>
        </figcaption>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('dialog.close')}
          title={t('dialog.close')}
        >
          ✕
        </button>
      </figure>
    </div>,
    document.body,
  )
}
