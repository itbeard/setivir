import type { Localized } from '../types'

/**
 * Parsed text content of one song's Markdown file.
 *
 * The Markdown format is field-per-heading (see src/data/songs/*.md):
 *
 *   # Назва / Title          ← a field, matched by the label after "/" (or before)
 *   ## be                    ← language subsection (bilingual fields only)
 *   Родны Флоў
 *   ## en
 *   Rodny Fłoŭ
 *
 *   # Дата / Date            ← a scalar field: content sits directly under it
 *   17/08/2025
 *
 * Everything between a heading and the next heading is captured verbatim
 * (leading/trailing blank lines trimmed), so lyrics and prompts keep their
 * line breaks and bracket tags like [Куплет].
 */
export interface ParsedSong {
  title: Localized
  date: string
  model: string
  lyricsAuthor: Localized
  description: Localized
  lyrics: Localized
  stylePrompt: string
  lyricsPrompt: string
}

type FieldKey =
  | 'title'
  | 'date'
  | 'model'
  | 'lyricsAuthor'
  | 'description'
  | 'lyrics'
  | 'stylePrompt'
  | 'lyricsPrompt'

/**
 * Map a heading label to a field key. Both the Belarusian and the English
 * label are accepted, so a "# Назва / Title" heading still parses if either
 * half is edited away. Matching is exact (case-insensitive) on a segment.
 */
const LABEL_TO_FIELD: Record<string, FieldKey> = {
  'назва': 'title',
  'title': 'title',
  'дата': 'date',
  'date': 'date',
  'мадэль': 'model',
  'model': 'model',
  'аўтар тэксту': 'lyricsAuthor',
  'lyrics author': 'lyricsAuthor',
  'апісаньне': 'description',
  'апісанне': 'description',
  'description': 'description',
  'тэкст песьні': 'lyrics',
  'тэкст песні': 'lyrics',
  'тэкст': 'lyrics',
  'lyrics': 'lyrics',
  'промпт стылю': 'stylePrompt',
  'style prompt': 'stylePrompt',
  'промпт тэксту': 'lyricsPrompt',
  'lyrics prompt': 'lyricsPrompt',
}

const BILINGUAL: ReadonlySet<FieldKey> = new Set<FieldKey>([
  'title',
  'lyricsAuthor',
  'description',
  'lyrics',
])

/** Resolve a `# heading` line to a field key by trying each "/"-split label. */
function fieldFromHeading(heading: string): FieldKey | null {
  for (const part of heading.split('/')) {
    const key = LABEL_TO_FIELD[part.trim().toLowerCase()]
    if (key) return key
  }
  return null
}

/** Collapse collected lines into a trimmed block, preserving inner newlines. */
function block(lines: string[]): string {
  return lines.join('\n').replace(/^\n+/, '').replace(/\n+$/, '')
}

/**
 * Parse a song Markdown file into its text fields. Missing fields fall back to
 * empty strings; the caller (data/songs.ts) supplies technical fields.
 */
export function parseSongMarkdown(raw: string): ParsedSong {
  // Buckets keyed by field; bilingual fields hold { be, en }, scalars a string.
  const scalars: Partial<Record<FieldKey, string[]>> = {}
  const langs: Partial<Record<FieldKey, { be: string[]; en: string[] }>> = {}

  let field: FieldKey | null = null
  let lang: 'be' | 'en' | null = null

  for (const line of raw.split(/\r?\n/)) {
    const h1 = /^#\s+(.+?)\s*$/.exec(line)
    const h2 = /^##\s+(.+?)\s*$/.exec(line)

    if (h1) {
      field = fieldFromHeading(h1[1])
      lang = null
      if (field && BILINGUAL.has(field) && !langs[field]) {
        langs[field] = { be: [], en: [] }
      } else if (field && !BILINGUAL.has(field) && !scalars[field]) {
        scalars[field] = []
      }
      continue
    }

    if (h2) {
      const tag = h2[1].trim().toLowerCase()
      if (tag === 'be' || tag === 'en') {
        lang = tag
        continue
      }
      // A `##` that isn't a language tag — treat as body text (rare).
    }

    if (!field) continue
    if (BILINGUAL.has(field)) {
      if (lang) langs[field]![lang].push(line)
    } else {
      scalars[field]!.push(line)
    }
  }

  const bi = (key: FieldKey): Localized => {
    const b = langs[key]
    return { be: b ? block(b.be) : '', en: b ? block(b.en) : '' }
  }
  const sc = (key: FieldKey): string => {
    const s = scalars[key]
    return s ? block(s) : ''
  }

  return {
    title: bi('title'),
    date: sc('date'),
    model: sc('model'),
    lyricsAuthor: bi('lyricsAuthor'),
    description: bi('description'),
    lyrics: bi('lyrics'),
    stylePrompt: sc('stylePrompt'),
    lyricsPrompt: sc('lyricsPrompt'),
  }
}
