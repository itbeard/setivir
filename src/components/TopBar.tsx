import { useEffect, useState } from 'react'
import type { Song } from '../types'
import type { TrackOrder } from '../hooks/useTrackOrder'
import { scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { SongSheet } from './SongSheet'
import styles from './TopBar.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function TopBar({
  activeSong,
  total,
  songs,
  order,
  onToggleOrder,
}: {
  activeSong: number | null
  total: number
  songs: Song[]
  order: TrackOrder
  onToggleOrder: () => void
}) {
  const { lang, setLang, t } = useI18n()
  const sortTitle = `${t('sort.label')}: ${order === 'chrono' ? t('sort.chrono') : t('sort.newest')}`
  // The counter opens a full-width bottom sheet (the counter itself only
  // renders on ≤1024px screens — the dot rail covers wide viewports).
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    if (activeSong === null) setSheetOpen(false)
  }, [activeSong])

  return (
    <header className={styles.bar}>
      <button
        type="button"
        className={styles.wordmark}
        onClick={() => scrollToIndex(0)}
        aria-label="Setivir"
      >
        SETIVIR
      </button>

      {activeSong !== null && (
        <div className={styles.counterWrap}>
          <button
            type="button"
            className={styles.counter}
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-label={t('a11y.openMenu')}
          >
            {pad2(activeSong)}
            <i className={styles.counterTotal}> / {pad2(total)}</i>
            <span className={styles.caret} aria-hidden="true" />
          </button>
        </div>
      )}

      {sheetOpen && (
        <SongSheet
          songs={songs}
          activeSong={activeSong}
          total={total}
          order={order}
          onToggleOrder={onToggleOrder}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <div className={styles.right}>
        <button
          type="button"
          className={styles.sort}
          onClick={onToggleOrder}
          aria-label={sortTitle}
          title={sortTitle}
        >
          {order === 'chrono' ? (
            <>
              01<span className={styles.sortArrow} aria-hidden="true">→</span>{pad2(total)}
            </>
          ) : (
            <>
              {pad2(total)}<span className={styles.sortArrow} aria-hidden="true">→</span>01
            </>
          )}
        </button>

        <div className={styles.langs} role="group" aria-label={lang === 'be' ? 'Мова' : 'Language'}>
          <button
            type="button"
            lang="be"
            className={cx(styles.lang, lang === 'be' && styles.active)}
            onClick={() => setLang('be')}
            aria-pressed={lang === 'be'}
            aria-label={t('a11y.langBe')}
          >
            BE
          </button>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            lang="en"
            className={cx(styles.lang, lang === 'en' && styles.active)}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
            aria-label={t('a11y.langEn')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  )
}
