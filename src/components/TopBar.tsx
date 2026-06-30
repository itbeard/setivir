import { useEffect, useRef, useState } from 'react'
import type { Song } from '../types'
import { scrollToId, scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import styles from './TopBar.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function TopBar({
  activeSong,
  total,
  songs,
}: {
  activeSong: number | null
  total: number
  songs: Song[]
}) {
  const { lang, setLang, t, loc } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close the quick-nav on outside tap / Escape, and whenever it would hide.
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (activeSong === null) setMenuOpen(false)
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
        <div className={styles.counterWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.counter}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={t('a11y.openMenu')}
          >
            {pad2(activeSong)}
            <i className={styles.counterTotal}> / {pad2(total)}</i>
            <span className={cx(styles.caret, menuOpen && styles.caretOpen)} aria-hidden="true" />
          </button>

          {menuOpen && (
            <ul className={styles.menu} role="menu" aria-label={t('a11y.openMenu')}>
              {songs.map((s) => {
                const active = s.id === activeSong
                return (
                  <li key={s.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={cx(styles.menuItem, active && styles.menuItemActive)}
                      onClick={() => {
                        scrollToId(`song-${s.slug}`)
                        setMenuOpen(false)
                      }}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className={styles.menuNum}>{pad2(s.id)}</span>
                      <span className={styles.menuTitle}>{loc(s.title)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

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
    </header>
  )
}
