import { useEffect, useState } from 'react'
import type { Song } from '../types'
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
  edge,
}: {
  activeSong: number | null
  total: number
  songs: Song[]
  /** Which bookend screen is active, when not on a song. */
  edge: 'intro' | 'outro' | null
}) {
  const { lang, setLang, t } = useI18n()
  // The counter opens a full-width bottom sheet (the counter itself only
  // renders on ≤1024px screens — the dot rail covers wide viewports). On the
  // intro/outro it reads "Уступ"/"Фінал" instead of the track numbers, so the
  // menu stays reachable on every screen.
  const [sheetOpen, setSheetOpen] = useState(false)
  const counterShown = activeSong !== null || edge !== null

  useEffect(() => {
    if (activeSong === null && edge === null) setSheetOpen(false)
  }, [activeSong, edge])

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

      {counterShown && (
        <div className={styles.counterWrap}>
          <button
            type="button"
            className={styles.counter}
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-label={t('a11y.openMenu')}
          >
            {activeSong !== null ? (
              <>
                {pad2(activeSong)}
                <i className={styles.counterTotal}> / {pad2(total)}</i>
              </>
            ) : (
              <span className={styles.counterLabel}>
                {t(edge === 'intro' ? 'sheet.intro' : 'sheet.outro')}
              </span>
            )}
            <span className={styles.caret} aria-hidden="true" />
          </button>
        </div>
      )}

      {sheetOpen && (
        <SongSheet
          songs={songs}
          activeSong={activeSong}
          total={total}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <div className={styles.right}>
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
