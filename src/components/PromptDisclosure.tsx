import { isPlaceholder } from '../data/songs'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import styles from './PromptDisclosure.module.css'

export function PromptDisclosure({
  label,
  content,
  note,
  original,
  markdown = false,
}: {
  label: string
  content: string
  /** Optional caption shown above the content (e.g. a translation disclaimer). */
  note?: string
  /** Optional second block under the main content, with its own caption
      (e.g. the Belarusian original beneath an English translation). */
  original?: { label: string; content: string }
  /** Render the content as Markdown prose instead of preformatted text. */
  markdown?: boolean
}) {
  const placeholder = isPlaceholder(content)
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <span>{label}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      {note && <p className={styles.note}>{note}</p>}
      {markdown ? (
        <div className={cx(styles.prose, placeholder && 'is-placeholder')}>
          <Markdown text={content} />
        </div>
      ) : (
        <pre className={cx(styles.body, placeholder && 'is-placeholder')}>{content}</pre>
      )}
      {original && (
        <>
          <p className={styles.originalLabel}>{original.label}</p>
          <pre className={styles.body}>{original.content}</pre>
        </>
      )}
    </details>
  )
}
