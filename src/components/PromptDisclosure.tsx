import { isPlaceholder } from '../data/songs'
import { cx } from '../lib/cx'
import styles from './PromptDisclosure.module.css'

export function PromptDisclosure({ label, content }: { label: string; content: string }) {
  const placeholder = isPlaceholder(content)
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <span>{label}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <pre className={cx(styles.body, placeholder && 'is-placeholder')}>{content}</pre>
    </details>
  )
}
