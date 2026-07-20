'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { isModelos3dHiddenByDeploy } from '@/lib/features'

export interface SiteSetting {
  id: string
  name: string
  enabled: boolean
  price: number | null
}

interface SettingsContextValue {
  settings: SiteSetting[]
  loading: boolean
  getSetting: (id: string) => SiteSetting | undefined
  getPrice: (id: string) => number | null
  isEnabled: (id: string) => boolean
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: [],
  loading: true,
  getSetting: () => undefined,
  getPrice: () => null,
  isEnabled: () => true,
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getSetting = (id: string) => settings.find((s) => s.id === id)
  const getPrice = (id: string) => getSetting(id)?.price ?? null

  /** DB setting + deploy-time hide flags (e.g. Ryvo hides modelos3d via env). */
  const isEnabled = (id: string) => {
    if (id === 'modelos3d' && isModelos3dHiddenByDeploy()) return false
    return getSetting(id)?.enabled ?? true
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, getSetting, getPrice, isEnabled }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
