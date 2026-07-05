import { goNextFrom } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import { siteText } from '../data/site'
import { Ornament } from './Ornament'
import { SocialLinks } from './SocialLinks'
import styles from './Hero.module.css'

export function Hero() {
  const { t, loc } = useI18n()

  return (
    <section id="intro" data-section data-kind="intro" className={cx('section', styles.hero)}>
      <div className={styles.inner} data-anim-stack>
        <p className={styles.kicker}>{t('site.tagline')}</p>
        <h1 className={styles.wordmark}>Setivir</h1>
        <SocialLinks />
        <Ornament className={styles.ornament} />
        <div className={styles.intro}>
          <Markdown text={loc(siteText.intro)} />
        </div>
        <button type="button" className={styles.enter} onClick={(e) => goNextFrom(e.currentTarget)}>
          {t('hero.enter')}
          <span className={styles.enterChevron} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
