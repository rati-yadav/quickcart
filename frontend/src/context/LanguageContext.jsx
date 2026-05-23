import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { interpolate, LANG_STORAGE_KEY, translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    return saved === 'hi' ? 'hi' : 'en'
  })

  const setLang = useCallback((code) => {
    const next = code === 'hi' ? 'hi' : 'en'
    setLangState(next)
    localStorage.setItem(LANG_STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
  }, [lang])

  const t = useCallback(
    (key, vars) => {
      const parts = key.split('.')
      let node = translations[lang]
      for (const p of parts) {
        node = node?.[p]
      }
      if (typeof node !== 'string') return key
      return interpolate(node, vars)
    },
    [lang],
  )

  const tCategory = useCallback(
    (name) => translations[lang].categories?.[name] || name,
    [lang],
  )

  const value = useMemo(
    () => ({
      lang,
      isHindi: lang === 'hi',
      setLang,
      t,
      tCategory,
      messages: translations[lang],
    }),
    [lang, setLang, t, tCategory],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
