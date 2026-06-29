import { scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { Ornament } from './Ornament'
import styles from './Outro.module.css'

export function Outro() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <section id="outro" data-section data-kind="outro" className={cx('section', styles.outro)}>
      <div className={styles.inner}>
        <Ornament className={styles.ornament} />
        <h2 className={styles.heading}>{t('outro.heading')}</h2>
        <p className={styles.text}>{t('outro.text')}</p>

        <a
          className={styles.link}
          href="https://www.instagram.com/iamsetivir/"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t('outro.follow')}
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </a>

        <button type="button" className={styles.top} onClick={() => scrollToIndex(0)}>
          ↑ {t('outro.backTop')}
        </button>

        <p className={styles.credit}>© {year} Setivir</p>
      </div>
    </section>
  )
}
