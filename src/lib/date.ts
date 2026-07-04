import type { Lang } from '../types'

// Month names for the short release-date stamp, Belarusian in тарашкевіца.
const MONTHS: Record<Lang, string[]> = {
  be: [
    'Студзень',
    'Люты',
    'Сакавік',
    'Красавік',
    'Травень',
    'Чэрвень',
    'Ліпень',
    'Жнівень',
    'Верасень',
    'Кастрычнік',
    'Лістапад',
    'Сьнежань',
  ],
  en: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
}

// Genitive month names for the full "17 жніўня 2025" form.
const MONTHS_FULL: Record<Lang, string[]> = {
  be: [
    'студзеня',
    'лютага',
    'сакавіка',
    'красавіка',
    'траўня',
    'чэрвеня',
    'ліпеня',
    'жніўня',
    'верасьня',
    'кастрычніка',
    'лістапада',
    'сьнежня',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
}

function parse(date: string): { day?: number; month: number; year: string } | null {
  const m = date.trim().match(/^(?:(\d{1,2})\/)?(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const month = Number(m[2])
  if (month < 1 || month > 12) return null
  return { day: m[1] ? Number(m[1]) : undefined, month, year: m[3] }
}

/**
 * Turn a `DD/MM/YYYY` (or `MM/YYYY`) source date into a compact bilingual
 * stamp: `Жнівень’25` / `Aug’25`. Anything that doesn't parse (placeholders,
 * free-form text) is returned untouched.
 */
export function formatReleaseDate(date: string, lang: Lang): string {
  const p = parse(date)
  if (!p) return date
  return `${MONTHS[lang][p.month - 1]}’${p.year.slice(-2)}`
}

/**
 * Full bilingual date with the month spelled out: `17 жніўня 2025` /
 * `17 August 2025`. Falls back to the month-only stamp when the source has
 * no day, and returns unparseable values untouched.
 */
export function formatFullDate(date: string, lang: Lang): string {
  const p = parse(date)
  if (!p) return date
  if (p.day === undefined) return formatReleaseDate(date, lang)
  return `${p.day} ${MONTHS_FULL[lang][p.month - 1]} ${p.year}`
}
