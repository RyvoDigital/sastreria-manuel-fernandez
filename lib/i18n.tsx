'use client'

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import es from '@/messages/es.json'
import en from '@/messages/en.json'
import it from '@/messages/it.json'
import fr from '@/messages/fr.json'

export type Locale = 'es' | 'en' | 'it' | 'fr'

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  it: 'IT',
  fr: 'FR',
}

type Messages = typeof es

const dictionaries: Record<Locale, Messages> = { es, en, it, fr }

interface I18nContextValue {
  locale: Locale
  t: Messages
  toggleLocale: () => void
  setLocale: (locale: Locale) => void
  locales: Locale[]
  localeLabels: Record<Locale, string>
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const order: Locale[] = ['es', 'en', 'it', 'fr']
      const idx = order.indexOf(prev)
      return order[(idx + 1) % order.length]
    })
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const value: I18nContextValue = {
    locale,
    t: dictionaries[locale],
    toggleLocale,
    setLocale,
    locales: ['es', 'en', 'it', 'fr'],
    localeLabels: LOCALE_LABELS,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider')
  return ctx
}
