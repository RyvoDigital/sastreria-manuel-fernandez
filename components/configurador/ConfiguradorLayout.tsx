'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ConfiguradorHero } from './ConfiguradorHero'
import { ConfiguradorValueProp } from './ConfiguradorValueProp'
import { ConfiguradorSteps } from './ConfiguradorSteps'
import { ConfiguradorPaymentGate } from './ConfiguradorPaymentGate'
import { ConfiguradorWizard } from './ConfiguradorWizard'

export function ConfiguradorLayout() {
  const { locale } = useI18n()
  const [hasAccess, setHasAccess] = useState(false)

  const t = {
    es: {
      title: 'Configurador de Prendas',
      subtitle: 'Diseña tu traje paso a paso',
    },
    en: {
      title: 'Garment Configurator',
      subtitle: 'Design your suit step by step',
    },
    it: {
      title: 'Configuratore di Abiti',
      subtitle: 'Progetta il tuo abito passo dopo passo',
    },
    fr: {
      title: 'Configurateur de Vêtements',
      subtitle: 'Concevez votre costume étape par étape',
    },
  }

  const currentT = t[locale as keyof typeof t] || t.es

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {!hasAccess ? (
        <>
          <ConfiguradorHero />
          <ConfiguradorValueProp />
          <ConfiguradorSteps />
          <ConfiguradorPaymentGate
            onAccessGranted={() => setHasAccess(true)}
            title={currentT.title}
            subtitle={currentT.subtitle}
          />
        </>
      ) : (
        <ConfiguradorWizard />
      )}
    </div>
  )
}
