import { scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import { siteText } from '../data/site'
import { Ornament } from './Ornament'
import styles from './Outro.module.css'

export function Outro() {
  const { t, loc } = useI18n()
  const year = new Date().getFullYear()

  return (
    <section id="outro" data-section data-kind="outro" className={cx('section', styles.outro)}>
      <div className={styles.inner} data-anim-stack>
        <Ornament className={styles.ornament} />
        <h2 className={styles.heading}>{t('outro.heading')}</h2>
        <Markdown text={loc(siteText.outro)} paragraphClassName={styles.text} />

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
