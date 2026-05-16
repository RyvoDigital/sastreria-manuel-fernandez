'use client'

import { useState, useEffect, Suspense } from 'react'
import { useI18n } from '@/lib/i18n'
import { ConfiguradorHero } from './ConfiguradorHero'
import { ConfiguradorValueProp } from './ConfiguradorValueProp'
import { ConfiguradorSteps } from './ConfiguradorSteps'
import { ConfiguradorPaymentGate } from './ConfiguradorPaymentGate'
import { ConfiguradorWizard } from './ConfiguradorWizard'
import { useSearchParams } from 'next/navigation'

function ConfiguradorLayoutInner() {
  const { locale } = useI18n()
  const [hasAccess, setHasAccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setHasAccess(true)
    }
  }, [searchParams])

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

export function ConfiguradorLayout() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ConfiguradorLayoutInner />
    </Suspense>
  )
}
