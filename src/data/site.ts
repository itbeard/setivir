import type { Localized } from '../types'
import { parseMarkdownFields } from '../lib/songMarkdown'
import raw from './site.md?raw'

/**
 * Тэксты старонкі па-за песьнямі — уступ (Hero) і фінал (Outro) — жывуць
 * у ./site.md у тым жа фармаце «поле-пад-загалоўкам», што і файлы песень:
 * `# Уступ / Intro`, `# Фінал / Outro`, мовы — падзагалоўкамі `## be` / `## en`.
 * Тэкст падтрымлівае markdown: **тлусты**, *курсіў*, [спасылкі](https://…)
 * і абзацы (пусты радок = новы абзац).
 *
 * The intro (Hero) and outro texts of the page live in ./site.md, using the
 * same field-per-heading format as the song files. Edit the .md file, not this
 * module.
 */

type SiteField = 'intro' | 'outro'

const LABEL_TO_FIELD: Record<string, SiteField> = {
  'уступ': 'intro',
  'intro': 'intro',
  'фінал': 'outro',
  'outro': 'outro',
}

const BILINGUAL: ReadonlySet<SiteField> = new Set<SiteField>(['intro', 'outro'])

const { bi } = parseMarkdownFields(raw, LABEL_TO_FIELD, BILINGUAL)

export const siteText: { intro: Localized; outro: Localized } = {
  intro: bi('intro'),
  outro: bi('outro'),
}
