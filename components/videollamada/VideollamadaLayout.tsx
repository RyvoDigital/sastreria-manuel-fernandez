'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { VideollamadaPaymentGate } from './VideollamadaPaymentGate'
import { VideollamadaBooking } from './VideollamadaBooking'

export function VideollamadaLayout() {
  const { locale } = useI18n()
  const [hasAccess, setHasAccess] = useState(false)

  const t = {
    es: {
      title: 'Videollamada',
      subtitle: 'Consulta personalizada a distancia',
    },
    en: {
      title: 'Video Call',
      subtitle: 'Remote personal consultation',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {!hasAccess ? (
        <VideollamadaPaymentGate 
          onAccessGranted={() => setHasAccess(true)} 
          title={currentT.title}
          subtitle={currentT.subtitle}
        />
      ) : (
        <VideollamadaBooking />
      )}
    </div>
  )
}
