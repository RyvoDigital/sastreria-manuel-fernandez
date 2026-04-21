'use client'

import { useI18n } from '@/lib/i18n'
import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx'

export function CraftJourneySection() {
  const { t } = useI18n()

  const sections = [
    {
      id:          'corte',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797447/cGhvdG9zL2N1dHRpbmctdGFibGVfcGd1Z2tk',
      leftLabel:   t.la_sastreria.oficio.cat1,
      title:       'Precisión',
      rightLabel:  '1978',
    },
    {
      id:          'tejido',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797423/cGhvdG9zL2N1dHRpbmctdHdlZWRfc2drZmlm',
      leftLabel:   t.la_sastreria.oficio.cat2,
      title:       'Carácter',
      rightLabel:  'Lana & Seda',
    },
    {
      id:          'confeccion',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797445/cGhvdG9zL3NsZWV2ZS1idXR0b25zX2RyaDJweA==',
      leftLabel:   t.la_sastreria.oficio.cat3,
      title:       'Paciencia',
      rightLabel:  'A Mano',
    },
    {
      id:          'forro',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797382/cGhvdG9zL3ZlbHZldC1saW5pbmdfdWtlZmxx',
      leftLabel:   t.la_sastreria.oficio.cat4,
      title:       'Perfección',
      rightLabel:  'El Detalle',
    },
  ]

  return (
    <FullScreenScrollFX
      sections={sections}
      header={
        <div style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.55)',
        }}>
          {t.la_sastreria.oficio.label}
          <span style={{ margin: '0 0.8em', opacity: 0.4 }}>·</span>
          {t.la_sastreria.oficio.title}
        </div>
      }
      fontFamily="var(--font-serif), 'Cormorant Garamond', Georgia, serif"
      colors={{
        text:    'rgba(255,255,255,0.95)',
        overlay: 'rgba(10,22,40,0.55)',
        pageBg:  '#0A1628',
        stageBg: '#0A1628',
      }}
      showProgress
      durations={{ change: 0.8, snap: 900 }}
      gridPaddingX={3}
      ariaLabel="El Oficio — journey through the craft"
    />
  )
}
