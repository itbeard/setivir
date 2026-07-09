import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Song } from '../types'
import type { TrackOrder } from '../hooks/useTrackOrder'
import { getSections, scrollToId, scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { usePlayer } from '../audio/PlayerContext'
import { useModalDialog } from '../hooks/useModalDialog'
import { cx } from '../lib/cx'
import styles from './SongSheet.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

const CLOSE_MS = 215

/**
 * Full-width bottom sheet with the song list — the mobile replacement for the
 * old anchored dropdown. Modal: focus-trapped, Esc / backdrop-tap to close,
 * body scroll locked while open (see useModalDialog).
 */
export function SongSheet({
  songs,
  activeSong,
  total,
  order,
  onToggleOrder,
  onClose,
}: {
  songs: Song[]
  activeSong: number | null
  total: number
  order: TrackOrder
  onToggleOrder: () => void
  onClose: () => void
}) {
  const { t, loc } = useI18n()
  const sortTitle = `${t('sort.label')}: ${order === 'chrono' ? t('sort.chrono') : t('sort.newest')}`
  const { current, isPlaying } = usePlayer()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [closing, setClosing] = useState(false)

  // Play the exit animation, then let the parent unmount us.
  const requestClose = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(onClose, CLOSE_MS)
  }

  useModalDialog(panelRef, requestClose)

  const goTo = (slug: string) => {
    requestClose()
    scrollToId(`song-${slug}`)
  }
  const goIntro = () => {
    requestClose()
    scrollToIndex(0)
  }
  const goOutro = () => {
    requestClose()
    scrollToIndex(getSections().length - 1)
  }

  return createPortal(
    <div
      className={cx(styles.overlay, closing && styles.closing)}
      role="dialog"
      aria-modal="true"
      aria-label={t('a11y.openMenu')}
    >
      <div className={styles.backdrop} onClick={requestClose} />
      <div className={styles.panel} ref={panelRef}>
        <button
          type="button"
          className={styles.handle}
          onClick={requestClose}
          aria-label={t('dialog.close')}
        >
          <span className={styles.handleBar} aria-hidden="true" />
        </button>

        <div className={styles.head}>
          <span className={styles.headTitle}>{t('a11y.openMenu')}</span>
          <button
            type="button"
            className={styles.sort}
            onClick={onToggleOrder}
            aria-label={sortTitle}
            title={sortTitle}
          >
            {order === 'chrono'
              ? `01→${pad2(total)}`
              : `${pad2(total)}→01`}
          </button>
          <span className={styles.headCounter}>
            {activeSong !== null ? pad2(activeSong) : '··'} / {pad2(total)}
          </span>
        </div>

        <div className={styles.list}>
          {songs.map((s) => {
            const active = s.id === activeSong
            const playing = current?.id === s.id && isPlaying
            return (
              <button
                key={s.id}
                type="button"
                className={cx(styles.row, active && styles.rowActive)}
                onClick={() => goTo(s.slug)}
                aria-current={active ? 'true' : undefined}
              >
                <span className={styles.num}>{pad2(s.id)}</span>
                <span className={styles.title}>{loc(s.title)}</span>
                <span
                  className={cx(styles.mark, playing && styles.markPlaying)}
                  aria-hidden="true"
                >
                  {playing ? '●' : active ? '◆' : ''}
                </span>
              </button>
            )
          })}
        </div>

        <div className={styles.foot}>
          <button type="button" className={styles.jump} onClick={goIntro}>
            ↑ {t('sheet.intro')}
          </button>
          <button type="button" className={styles.jump} onClick={goOutro}>
            {t('sheet.outro')} ↓
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
