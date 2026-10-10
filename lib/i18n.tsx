'use client'

import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import es from '@/messages/es.json'

export type Locale = 'es' | 'en' | 'it' | 'fr'

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  it: 'IT',
  fr: 'FR',
}

type Messages = typeof es

/*
 * Spanish ships with every page; the site always opens in Spanish. The other
 * three are fetched the first time someone picks them (about 8 kB each over
 * the wire), so no visitor downloads four dictionaries to read one. The
 * return type keeps each translation checked against the Spanish shape.
 */
const loaders: Record<Exclude<Locale, 'es'>, () => Promise<Messages>> = {
  en: () => import('@/messages/en.json').then((m): Messages => m.default),
  it: () => import('@/messages/it.json').then((m): Messages => m.default),
  fr: () => import('@/messages/fr.json').then((m): Messages => m.default),
}

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
  const [{ locale, t }, setCurrent] = useState<{ locale: Locale; t: Messages }>({ locale: 'es', t: es })
  const cache = useRef<Partial<Record<Locale, Messages>>>({ es })
  const requested = useRef<Locale>('es')

  // Switches once the dictionary is in hand, so the page never renders a
  // locale without its text. The last choice wins if clicks overlap.
  const setLocale = useCallback((newLocale: Locale) => {
    requested.current = newLocale
    const cached = cache.current[newLocale]
    if (cached) {
      setCurrent({ locale: newLocale, t: cached })
      return
    }
    loaders[newLocale as Exclude<Locale, 'es'>]().then((messages) => {
      cache.current[newLocale] = messages
      if (requested.current === newLocale) setCurrent({ locale: newLocale, t: messages })
    })
  }, [])

  const toggleLocale = useCallback(() => {
    const order: Locale[] = ['es', 'en', 'it', 'fr']
    setLocale(order[(order.indexOf(requested.current) + 1) % order.length])
  }, [setLocale])

  const value: I18nContextValue = {
    locale,
    t,
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
