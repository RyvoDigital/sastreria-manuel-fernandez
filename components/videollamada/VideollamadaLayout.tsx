'use client'

import { useState } from 'react'
import { VideollamadaHero } from './VideollamadaHero'
import { VideollamadaValue } from './VideollamadaValue'
import { VideollamadaHowItWorks } from './VideollamadaHowItWorks'
import { VideollamadaPaymentGate } from './VideollamadaPaymentGate'
import { VideollamadaBooking } from './VideollamadaBooking'

export function VideollamadaLayout() {
  const [hasAccess, setHasAccess] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {!hasAccess ? (
        <>
          <VideollamadaHero />
          <VideollamadaValue />
          <VideollamadaHowItWorks />
          <VideollamadaPaymentGate onAccessGranted={() => setHasAccess(true)} />
        </>
      ) : (
        <VideollamadaBooking />
      )}
    </div>
  )
}
