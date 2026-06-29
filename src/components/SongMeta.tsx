import type { Song } from '../types'
import { isPlaceholder } from '../data/songs'
import { useI18n } from '../i18n/I18nContext'
import { cx } from '../lib/cx'
import styles from './SongMeta.module.css'

export function SongMeta({ song }: { song: Song }) {
  const { t, loc } = useI18n()
  const author = loc(song.lyricsAuthor)

  const rows = [
    { label: t('meta.author'), value: author },
    { label: t('meta.model'), value: song.model },
    { label: t('meta.date'), value: song.date },
  ]

  return (
    <dl className={styles.meta}>
      {rows.map((r) => (
        <div key={r.label} className={styles.row}>
          <dt className={styles.label}>{r.label}</dt>
          <dd className={cx(styles.value, isPlaceholder(r.value) && 'is-placeholder')}>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
