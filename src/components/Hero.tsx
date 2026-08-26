import { useEffect, useState } from 'react'
import { goNextFrom } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import { siteText } from '../data/site'
import { Ornament } from './Ornament'
import { SocialLinks } from './SocialLinks'
import styles from './Hero.module.css'

/**
 * `compact` (newest-first order): the visitor has most likely already read the
 * intro and came back for new songs — fold the text away behind a toggle so
 * the first track sits right under the wordmark. They can still expand it.
 */
export function Hero({ compact = false }: { compact?: boolean }) {
  const { t, loc } = useI18n()
  const [expanded, setExpanded] = useState(false)
  // Re-fold whenever the order flips back to compact.
  useEffect(() => {
    if (compact) setExpanded(false)
  }, [compact])
  const folded = compact && !expanded

  return (
    <section
      id="intro"
      data-section
      data-kind="intro"
      // data-attribute, not a class: a className change would make React
      // rewrite the attribute and wipe the observer-added `.is-in`, blanking
      // the whole hero mid-toggle.
      data-folded={folded || undefined}
      className={cx('section', styles.hero)}
    >
      <div className={styles.inner} data-anim-stack>
        <p className={styles.kicker}>{t('site.tagline')}</p>
        <h1 className={styles.wordmark}>Setivir</h1>
        <SocialLinks />
        <Ornament className={styles.ornament} />
        {folded ? (
          <button
            type="button"
            className={styles.expand}
            aria-expanded={false}
            aria-controls="intro-text"
            onClick={() => setExpanded(true)}
          >
            {t('hero.about')}
            <span className={styles.expandChevron} aria-hidden="true" />
          </button>
        ) : (
          <div id="intro-text" className={styles.intro}>
            <Markdown text={loc(siteText.intro)} />
          </div>
        )}
        {!folded && (
          <button type="button" className={styles.enter} onClick={(e) => goNextFrom(e.currentTarget)}>
            {t('hero.enter')}
            <span className={styles.enterChevron} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}
