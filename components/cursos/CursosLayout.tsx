'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { CursosPaymentGate } from './CursosPaymentGate'
import { CursosList } from './CursosList'

export function CursosLayout() {
  const { locale } = useI18n()
  const [hasAccess, setHasAccess] = useState(false)

  const t = {
    es: {
      title: 'Cursos Online',
      subtitle: 'Aprende sastrería artesanal',
    },
    en: {
      title: 'Online Courses',
      subtitle: 'Learn artisan tailoring',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {!hasAccess ? (
        <CursosPaymentGate 
          onAccessGranted={() => setHasAccess(true)} 
          title={currentT.title}
          subtitle={currentT.subtitle}
        />
      ) : (
        <CursosList />
      )}
    </div>
  )
}
