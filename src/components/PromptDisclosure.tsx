import { isPlaceholder } from '../data/songs'
import { cx } from '../lib/cx'
import { Markdown } from '../lib/markdown'
import { useCopyText } from '../hooks/useCopyText'
import { useI18n } from '../i18n/I18nContext'
import { CheckIcon, CopyIcon } from './icons'
import styles from './PromptDisclosure.module.css'

/** Preformatted text block with an optional copy button in its top-right corner. */
function TextBlock({
  content,
  label,
  copyable,
}: {
  content: string
  /** Names the block in the copy button's aria-label. */
  label: string
  copyable: boolean
}) {
  const { t } = useI18n()
  const { copied, copy } = useCopyText()
  const placeholder = isPlaceholder(content)
  return (
    <div className={styles.bodyWrap}>
      <pre className={cx(styles.body, placeholder && 'is-placeholder')}>{content}</pre>
      {copyable && !placeholder && (
        <button
          type="button"
          className={cx(styles.copyBtn, copied && styles.copyBtnDone)}
          onClick={() => copy(content)}
          aria-label={`${t('prompt.copy')} — ${label}`}
          title={copied ? t('prompt.copied') : t('prompt.copy')}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
    </div>
  )
}

export function PromptDisclosure({
  label,
  content,
  note,
  original,
  markdown = false,
  copyable = false,
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
  /** Show copy-to-clipboard buttons on the text blocks. */
  copyable?: boolean
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
        <TextBlock content={content} label={label} copyable={copyable} />
      )}
      {original && (
        <>
          <p className={styles.originalLabel}>{original.label}</p>
          <TextBlock content={original.content} label={original.label} copyable={copyable} />
        </>
      )}
    </details>
  )
}
