import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang, Localized } from '../types'
import { ui, type UiKey } from './translations'

const STORAGE_KEY = 'setivir-lang'

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'be'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'be' || stored === 'en') return stored
  // Auto-detect from the browser: Belarusian browsers → Belarusian, else English.
  const nav = window.navigator
  const langs = [nav.language, ...(nav.languages ?? [])].filter(Boolean)
  return langs.some((l) => l.toLowerCase().startsWith('be')) ? 'be' : 'en'
}

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  /** Translate a UI key. */
  t: (key: UiKey) => string
  /** Pick the current language out of a {be, en} object. */
  loc: (text: Localized) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const toggle = useCallback(
    () => setLangState((prev) => (prev === 'be' ? 'en' : 'be')),
    [],
  )

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (key) => ui[key][lang],
      loc: (text) => text[lang],
    }),
    [lang, setLang, toggle],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}
