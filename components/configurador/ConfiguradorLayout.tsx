'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ConfiguradorPaymentGate } from './ConfiguradorPaymentGate'
import { ConfiguradorWizard } from './ConfiguradorWizard'

export function ConfiguradorLayout() {
  const { locale } = useI18n()
  const [hasAccess, setHasAccess] = useState(false)

  const t = {
    es: {
      title: 'Configurador de Prendas',
      subtitle: 'Diseña tu traje paso a paso',
      locked: 'Acceso con pago previo',
    },
    en: {
      title: 'Garment Configurator',
      subtitle: 'Design your suit step by step',
      locked: 'Paid access required',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {!hasAccess ? (
        <ConfiguradorPaymentGate 
          onAccessGranted={() => setHasAccess(true)} 
          title={currentT.title}
          subtitle={currentT.subtitle}
        />
      ) : (
        <ConfiguradorWizard />
      )}
    </div>
  )
}
