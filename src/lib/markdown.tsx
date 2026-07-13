import { type CSSProperties, type ReactNode, useState } from 'react'
import { assetUrl } from './assets'
import { cx } from './cx'
import { useI18n } from '../i18n/I18nContext'
import { ImageLightbox } from '../components/ImageLightbox'

/**
 * A tiny, dependency-free Markdown renderer for song descriptions.
 *
 * Inline (deliberately minimal):
 *   - **bold**    — <strong>
 *   - *italic*    — <em>
 *   - [text](url) — <a>; anchors (#…) stay in-page, everything else opens in
 *                   a new tab. Relative urls resolve against /public, so
 *                   [text](media/kupala/doc.pdf) links a bundled file.
 *
 * Blocks:
 *   - paragraphs  — a blank line starts a new <p>; single line breaks inside
 *                   a paragraph are preserved as <br> (verse-friendly)
 *   - > quote     — lines starting with ">" become a <blockquote>; a lone ">"
 *                   line splits the quote into paragraphs, and line breaks
 *                   inside a quote are preserved (verse-friendly)
 *   - list        — consecutive lines starting with "- " (or "* ") become a
 *                   <ul>; each line is one item, the first non-item line ends
 *                   the list
 *   - media       — an image/video on its own line:
 *                       ![подпіс](media/kupala/photo.jpg)
 *                       ![подпіс](media/kupala/clip.mp4){width=70% align=left}
 *                       ![подпіс](https://www.youtube.com/watch?v=XXXX){cut}
 *                   The extension picks the tag: .mp4/.webm/.mov → <video>,
 *                   a YouTube link (watch/youtu.be/shorts/embed/live) → an
 *                   <iframe> player, anything else → <img>. Images open in a
 *                   zoomable lightbox on click. The alt text
 *                   becomes a caption
 *                   under the media (omit it for no caption); it supports the
 *                   inline syntax above, including [links](…). Optional
 *                   attributes in {…}:
 *                       width=420 | width=70%   — bare numbers are pixels
 *                       align=left|center|right — default center
 *                       poster=media/…jpg       — video poster frame
 *                       cut | cut="Глядзець"    — collapse behind a disclosure
 *                                                 ("пад кат"); the label falls
 *                                                 back to a localized default
 *   - cut         — hide a whole run of blocks (text, quotes, media) behind
 *                   one disclosure:
 *                       ::: cut Што за кадрам
 *                       Абзац, **разьмецены** як звычайна…
 *                       ![](media/kupala/clip.mp4)
 *                       :::
 *                   The label after "cut" is optional (localized default).
 *                   Cuts don't nest.
 *                   Relative paths resolve against /public (like covers and
 *                   audio); http(s) URLs are used as-is.
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
  // Fresh regex per call: renderInline recurses for nested spans (e.g. italics
  // inside a link label), and a shared global regex would have its lastIndex
  // clobbered by the recursion — an infinite loop on the outer scan.
  const inline = new RegExp(INLINE.source, INLINE.flags)

  while ((match = inline.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `${keyBase}-${match.index}`

    if (match[1] !== undefined) {
      out.push(<strong key={key}>{renderInline(match[1], key)}</strong>)
    } else if (match[2] !== undefined) {
      out.push(<em key={key}>{renderInline(match[2], key)}</em>)
    } else {
      const label = match[3]
      const href = match[4]
      // Anchors stay in-page; everything else — external URLs and relative
      // paths to files under /public (a PDF, an image) — opens in a new tab,
      // relative paths resolved the same way as media sources.
      const anchor = href.startsWith('#')
      out.push(
        <a
          key={key}
          href={anchor ? href : mediaUrl(href)}
          {...(anchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {renderInline(label, key)}
        </a>,
      )
    }
    last = inline.lastIndex
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}

/* ── Block layer ─────────────────────────────────────────────────────── */

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'quote'; paragraphs: string[][] }
  | { kind: 'list'; items: string[] }
  | { kind: 'media'; alt: string; src: string; attrs: string }
  | { kind: 'cut'; label: string; blocks: Block[] }

// ::: cut Адвольны подпіс   …   ::: (closing fence)
const CUT_OPEN = /^:::\s*cut(?:\s+(.+?))?\s*$/
const CUT_CLOSE = /^:::\s*$/

// A list item is "- " or "* " at the start of a (trimmed) line. The space is
// required, so a line opening with *italic* is not mistaken for a bullet.
const LIST_ITEM = /^[-*]\s+(.+)$/

// A media embed is a whole line of its own: ![alt](src) plus optional {attrs}.
// The alt/caption is matched greedily so it may itself contain inline Markdown
// links — `![Глядзі [кліп](https://…)](photo.jpg)` — the greedy `.*` makes
// `](` bind to the media source, the last one on the line.
const MEDIA_LINE = /^!\[(.*)\]\(([^)\s]+)\)(?:\s*\{([^}]*)\})?$/
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(?:[?#]|$)/i

// Any of the usual YouTube URL shapes; captures the 11-char video id.
const YOUTUBE =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|(?:embed|shorts|live)\/)|youtu\.be\/)([\w-]{11})/i

/** Privacy-friendly embed URL for a YouTube link, or null if it isn't one. */
function youTubeEmbedUrl(src: string): string | null {
  const match = YOUTUBE.exec(src)
  if (!match) return null
  // Carry over a start time (?t=90 / &start=90); other params are dropped.
  const time = /[?&](?:t|start)=(\d+)/.exec(src)
  const query = time ? `?start=${time[1]}` : ''
  return `https://www.youtube-nocookie.com/embed/${match[1]}${query}`
}

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  let para: string[] = []
  let quote: string[][] | null = null
  let list: string[] | null = null

  const flushPara = () => {
    const joined = para.join('\n').trim()
    if (joined) blocks.push({ kind: 'p', text: joined })
    para = []
  }
  const flushQuote = () => {
    if (quote) {
      const paragraphs = quote.filter((lines) => lines.some((l) => l.trim()))
      if (paragraphs.length) blocks.push({ kind: 'quote', paragraphs })
      quote = null
    }
  }
  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', items: list })
      list = null
    }
  }

  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const cutOpen = CUT_OPEN.exec(line.trim())
    if (cutOpen) {
      flushPara()
      flushQuote()
      flushList()
      const inner: string[] = []
      // Collect up to the closing ":::"; an unterminated cut runs to the end.
      for (i++; i < lines.length && !CUT_CLOSE.test(lines[i].trim()); i++) {
        inner.push(lines[i])
      }
      blocks.push({ kind: 'cut', label: cutOpen[1] ?? '', blocks: parseBlocks(inner.join('\n')) })
      continue
    }

    if (/^>/.test(line.trimStart())) {
      flushPara()
      flushList()
      const inner = line.trimStart().replace(/^>\s?/, '')
      if (!quote) quote = [[]]
      if (inner.trim() === '') quote.push([])
      else quote[quote.length - 1].push(inner)
      continue
    }
    flushQuote()

    const media = MEDIA_LINE.exec(line.trim())
    if (media) {
      flushPara()
      flushList()
      blocks.push({ kind: 'media', alt: media[1], src: media[2], attrs: media[3] ?? '' })
      continue
    }

    const item = LIST_ITEM.exec(line.trim())
    if (item) {
      flushPara()
      if (!list) list = []
      list.push(item[1])
      continue
    }

    // A blank line keeps an open list open (items are often spaced out in the
    // source); any other non-item line ends it.
    if (line.trim() === '') {
      flushPara()
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushQuote()
  flushList()
  return blocks
}

interface MediaAttrs {
  width?: string
  align?: string
  poster?: string
  /** Present when the media is collapsed "пад кат"; '' means default label. */
  cut?: string
}

/** Parse "{width=70% align=left poster=… cut="Глядзець кліп"}" attribute strings. */
function parseAttrs(attrs: string): MediaAttrs {
  const out: MediaAttrs = {}

  // A quoted cut label may contain spaces — peel it off before splitting.
  const quotedCut = /(?:^|\s)cut="([^"]*)"/.exec(attrs)
  if (quotedCut) {
    out.cut = quotedCut[1]
    attrs = attrs.replace(quotedCut[0], ' ')
  }

  for (const part of attrs.split(/\s+/)) {
    const [key, value] = part.split('=')
    if (key === 'cut') {
      out.cut ??= value ?? ''
      continue
    }
    if (!value) continue
    if (key === 'width' && /^\d+(%|px)?$/.test(value)) {
      out.width = /^\d+$/.test(value) ? `${value}px` : value
    } else if (key === 'align' && /^(left|center|right)$/.test(value)) {
      out.align = value
    } else if (key === 'poster') {
      out.poster = value
    }
  }
  return out
}

function mediaUrl(src: string): string {
  return /^https?:\/\//i.test(src) ? src : assetUrl(src)
}

function MediaFigure({ alt, src, attrs }: { alt: string; src: string; attrs: string }) {
  const { t } = useI18n()
  const [enlarged, setEnlarged] = useState(false)
  const { width, align, poster, cut } = parseAttrs(attrs)
  const url = mediaUrl(src)
  const style: CSSProperties | undefined = width ? { width } : undefined
  const youTube = youTubeEmbedUrl(src)
  const isVideo = youTube !== null || VIDEO_EXT.test(src)

  const figure = (
    <figure className="md-figure" data-align={align ?? 'center'} style={style}>
      {youTube ? (
        <iframe
          className="md-media md-youtube"
          src={youTube}
          title={alt || 'YouTube'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      ) : isVideo ? (
        <video
          className="md-media"
          src={url}
          controls
          playsInline
          preload="metadata"
          poster={poster ? mediaUrl(poster) : undefined}
        />
      ) : (
        <button
          type="button"
          className="md-mediaButton"
          onClick={() => setEnlarged(true)}
          aria-label={alt ? `${t('md.enlarge')} — ${alt}` : t('md.enlarge')}
          title={t('md.enlarge')}
        >
          <img className="md-media" src={url} alt={alt} loading="lazy" decoding="async" />
        </button>
      )}
      {alt && <figcaption className="md-caption">{renderInline(alt, 'cap')}</figcaption>}
      {enlarged && (
        <ImageLightbox
          src={url}
          alt={alt}
          caption={alt ? renderInline(alt, 'lb-cap') : undefined}
          onClose={() => setEnlarged(false)}
        />
      )}
    </figure>
  )

  if (cut === undefined) return figure

  return (
    <details className="md-cut">
      <summary className="md-cutSummary">
        <span>{cut || t(isVideo ? 'md.showVideo' : 'md.showImage')}</span>
        <span className="md-cutChevron" aria-hidden="true" />
      </summary>
      {figure}
    </details>
  )
}

/** A paragraph keeps its source line breaks (text is often verse). */
function paragraphLines(lines: string[], keyBase: string): ReactNode[] {
  return lines.flatMap((line, i) => {
    const rendered = renderInline(line, `${keyBase}-l${i}`)
    return i === 0 ? rendered : [<br key={`${keyBase}-br${i}`} />, ...rendered]
  })
}

function CutBlock({
  label,
  blocks,
  paragraphClassName,
  keyBase,
}: {
  label: string
  blocks: Block[]
  paragraphClassName?: string
  keyBase: string
}) {
  const { t } = useI18n()
  return (
    <details className="md-cut">
      <summary className="md-cutSummary">
        <span>{label ? renderInline(label, `${keyBase}-label`) : t('md.showMore')}</span>
        <span className="md-cutChevron" aria-hidden="true" />
      </summary>
      <div className="md-cutBody">{renderBlocks(blocks, paragraphClassName, keyBase)}</div>
    </details>
  )
}

function renderBlocks(
  blocks: Block[],
  paragraphClassName: string | undefined,
  keyBase: string,
): ReactNode[] {
  return blocks.map((block, i) => {
    const key = `${keyBase}-${i}`
    switch (block.kind) {
      case 'media':
        return <MediaFigure key={key} alt={block.alt} src={block.src} attrs={block.attrs} />
      case 'quote':
        return (
          <blockquote key={key} className="md-quote">
            {block.paragraphs.map((lines, j) => (
              <p key={j}>{paragraphLines(lines, `${key}-q${j}`)}</p>
            ))}
          </blockquote>
        )
      case 'list':
        return (
          <ul key={key} className={cx('md-list', paragraphClassName)}>
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item, `${key}-i${j}`)}</li>
            ))}
          </ul>
        )
      case 'cut':
        return (
          <CutBlock
            key={key}
            label={block.label}
            blocks={block.blocks}
            paragraphClassName={paragraphClassName}
            keyBase={key}
          />
        )
      default:
        return (
          <p key={key} className={paragraphClassName}>
            {paragraphLines(block.text.split('\n'), key)}
          </p>
        )
    }
  })
}

export function Markdown({
  text,
  paragraphClassName,
}: {
  text: string
  /** Class applied to every generated <p> and <ul> (typography carrier). */
  paragraphClassName?: string
}) {
  return <>{renderBlocks(parseBlocks(text), paragraphClassName, 'b')}</>
}
