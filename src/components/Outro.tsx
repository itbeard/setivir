import type { TrackOrder } from '../hooks/useTrackOrder'
import { scrollToIndex } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import { siteText } from '../data/site'
import { Ornament } from './Ornament'
import styles from './Outro.module.css'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function Outro({
  total,
  order,
  onToggleOrder,
}: {
  total: number
  order: TrackOrder
  onToggleOrder: () => void
}) {
  const { t, loc } = useI18n()
  const year = new Date().getFullYear()
  const sortTitle = `${t('sort.label')}: ${order === 'chrono' ? t('sort.chrono') : t('sort.newest')}`

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

        <div className={styles.order}>
          <p className={styles.orderText}>
            {order === 'chrono' ? t('outro.orderChrono') : t('outro.orderNewest')}
          </p>
          <button
            type="button"
            className={styles.orderBtn}
            onClick={onToggleOrder}
            aria-label={sortTitle}
            title={sortTitle}
          >
            {t('outro.orderFlip')}
            <span className={styles.orderNums} aria-hidden="true">
              {order === 'chrono' ? `${pad2(total)} → 01` : `01 → ${pad2(total)}`}
            </span>
          </button>
        </div>

        <button type="button" className={styles.top} onClick={() => scrollToIndex(0)}>
          ↑ {t('outro.backTop')}
        </button>

        <p className={styles.credit}>© {year} Setivir</p>
      </div>
    </section>
  )
}
