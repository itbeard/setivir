import { useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Song } from '../types'
import { assetUrl, downloadName } from '../lib/assets'
import { useI18n } from '../i18n/I18nContext'
import { useModalDialog } from '../hooks/useModalDialog'
import styles from './Lightbox.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/**
 * Cover lightbox: framed artwork, `№ NN · author · date` caption and a
 * download pill. Modal a11y (focus trap, Esc, scrim tap, scroll lock) comes
 * from useModalDialog. Mounted only while open, so the <img> never renders
 * with an unresolved src.
 */
export function Lightbox({ song, onClose }: { song: Song; onClose: () => void }) {
  const { t, loc } = useI18n()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const title = loc(song.title)

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
          <img className={styles.img} src={assetUrl(song.cover)} alt={title} />
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.title}>{title}</span>
          <span className={styles.meta}>
            № {pad2(song.id)} · {loc(song.lyricsAuthor)} · {song.date}
          </span>
          <a
            className={styles.download}
            href={assetUrl(song.audio)}
            download={downloadName(song.title.be, song.audio)}
          >
            <span aria-hidden="true">⤓</span> {t('song.downloadShort')}
          </a>
        </figcaption>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('dialog.close')}
        >
          ✕
        </button>
      </figure>
    </div>,
    document.body,
  )
}
