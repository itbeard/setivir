import type { Song } from '../types'
import { scrollToId } from '../lib/nav'
import { useI18n } from '../i18n/I18nContext'
import styles from './NewSongsBar.module.css'

/** Belarusian plural forms: 1 песьня, 2–4 песьні, 5+ песень. */
function beSongs(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'новая песьня'
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'новыя песьні'
  return 'новых песень'
}

/**
 * Slim strip under the top bar for returning visitors: "N new songs → listen".
 * Rendered only while at least one new song is still unseen; clicking scrolls
 * to the first unseen one in the current page order.
 */
export function NewSongsBar({ songs, newIds }: { songs: Song[]; newIds: Set<number> }) {
  const { lang, t } = useI18n()
  const first = songs.find((s) => newIds.has(s.id))
  if (!first) return null
  const n = newIds.size

  const label =
    lang === 'be'
      ? n === 1
        ? `Зьявілася ${beSongs(1)}`
        : `Зьявіліся ${n} ${beSongs(n)}`
      : n === 1
        ? 'A new song has arrived'
        : `${n} new songs have arrived`

  return (
    <div className={styles.wrap} role="status">
      <button
        type="button"
        className={styles.bar}
        onClick={() => scrollToId(`song-${first.slug}`)}
      >
        <span className={styles.ember} aria-hidden="true" />
        <span className={styles.text}>{label}</span>
        <span className={styles.cta}>{t('new.listen')} →</span>
      </button>
    </div>
  )
}
