import { goNext } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import { usePlayer } from '../audio/PlayerContext'
import { cx } from '../lib/cx'
import { Ornament } from './Ornament'
import styles from './Hero.module.css'

export function Hero() {
  const { t } = useI18n()
  const { current } = usePlayer()

  return (
    <section id="intro" data-section data-kind="intro" className={cx('section', styles.hero)}>
      <div className={styles.inner}>
        <p className={styles.kicker}>{t('site.tagline')}</p>
        <h1 className={styles.wordmark}>Setivir</h1>
        <Ornament className={styles.ornament} />
        <div className={styles.intro}>
          {t('hero.intro')
            .split(/\n\s*\n/)
            .map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
        </div>
        <p className={styles.listen}>{t('hero.listen')}</p>
        <button type="button" className={styles.enter} onClick={goNext}>
          {t('hero.enter')}
          <span className={styles.enterChevron} aria-hidden="true" />
        </button>
      </div>

      <span
        className={cx(styles.scrollHint, current && styles.scrollHintHidden)}
        aria-hidden="true"
      >
        {t('hero.scroll')}
      </span>
    </section>
  )
}
