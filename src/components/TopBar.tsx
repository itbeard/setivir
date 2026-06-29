import { scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import styles from './TopBar.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function TopBar({ activeSong, total }: { activeSong: number | null; total: number }) {
  const { lang, setLang, t } = useI18n()

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
        <span className={styles.counter} aria-hidden="true">
          {pad2(activeSong)}
          <i className={styles.counterTotal}> / {pad2(total)}</i>
        </span>
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
