import { type ReactNode } from 'react'

/**
 * A tiny, dependency-free Markdown renderer for song descriptions.
 *
 * Supported (deliberately minimal):
 *   - paragraphs  — a blank line starts a new <p>
 *   - **bold**    — <strong>
 *   - *italic*    — <em>
 *   - [text](url) — <a> (opens in a new tab for external links)
 *
 * Everything else is rendered verbatim, so plain text and unfilled
 * "[placeholder]" strings pass through untouched.
 */

// Bold, then italic, then link. Bold is tried before italic so `**x**` is not
// mistaken for two empty italics. Non-greedy so adjacent spans don't merge.
const INLINE = /\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  INLINE.lastIndex = 0

  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `${keyBase}-${match.index}`

    if (match[1] !== undefined) {
      out.push(<strong key={key}>{renderInline(match[1], key)}</strong>)
    } else if (match[2] !== undefined) {
      out.push(<em key={key}>{renderInline(match[2], key)}</em>)
    } else {
      const label = match[3]
      const href = match[4]
      const external = /^https?:\/\//i.test(href)
      out.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {renderInline(label, key)}
        </a>,
      )
    }
    last = INLINE.lastIndex
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({
  text,
  paragraphClassName,
}: {
  text: string
  /** Class applied to every generated <p>. */
  paragraphClassName?: string
}) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={paragraphClassName}>
          {renderInline(para, `p${i}`)}
        </p>
      ))}
    </>
  )
}
