'use client'

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import es from '@/messages/es.json'
import en from '@/messages/en.json'

export type Locale = 'es' | 'en'

type Messages = typeof es

const dictionaries: Record<Locale, Messages> = { es, en }

interface I18nContextValue {
  locale: Locale
  t: Messages
  toggleLocale: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'es' ? 'en' : 'es'))
  }, [])

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], toggleLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider')
  return ctx
}
