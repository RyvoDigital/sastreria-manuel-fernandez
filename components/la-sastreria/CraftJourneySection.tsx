'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx'

export function CraftJourneySection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      id:          'tejido',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471227/photos/others/IMG_7104_ndueh5',
      leftLabel:   t.la_sastreria.oficio.cat1,
      title:       'Carácter',
      rightLabel:  'Lana & Seda',
    },
    {
      id:          'diseno',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471206/photos/others/IMG_0395_sy6wko',
      leftLabel:   t.la_sastreria.oficio.cat2,
      title:       'Precisión',
      rightLabel:  'Tradición',
    },
    {
      id:          'corte',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797497/photos/ChatGPT_Image_13_abr_2026_10_52_40_kegrpt',
      leftLabel:   t.la_sastreria.oficio.cat3,
      title:       'Paciencia',
      rightLabel:  'A Mano',
    },
    {
      id:          'proceso',
      background:  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797445/photos/ChatGPT_Image_10_abr_2026_11_48_37_opyl4v',
      leftLabel:   t.la_sastreria.oficio.cat4,
      title:       'Perfección',
      rightLabel:  'El Detalle',
    },
  ]

  // SSR / hydration placeholder — avoids mounting heavy GSAP on mobile
  if (!mounted) {
    return (
      <section style={{ background: '#0A1628', minHeight: '100vh' }} aria-hidden="true">
        <div style={{ padding: 'clamp(4rem, 8vh, 6rem) 1rem' }}>
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
        </div>
      </section>
    )
  }

  // Mobile: lightweight static cards — no GSAP pinning, no scroll snap
  if (isMobile) {
    return (
      <section style={{ background: '#0A1628' }}>
        {/* Header */}
        <div style={{ padding: 'clamp(4rem, 8vh, 6rem) 1rem 2rem' }}>
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
        </div>

        {sections.map((s, i) => (
          <div
            key={s.id}
            style={{
              minHeight:      '100svh',
              position:       'relative',
              display:        'flex',
              alignItems:     'center',
              padding:        '0 1rem',
              overflow:       'hidden',
            }}
          >
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.background}
              alt=""
              aria-hidden
              style={{
                position:   'absolute',
                inset:      0,
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
                filter:     'brightness(0.78) saturate(0.72)',
              }}
            />

            {/* Dark overlay */}
            <div style={{
              position:   'absolute',
              inset:      0,
              background: 'rgba(10,22,40,0.55)',
            }} />

            {/* Content — left-aligned */}
            <div style={{
              position:   'relative',
              zIndex:     2,
              width:      '100%',
              padding:    '2rem 0',
            }}>
              <div style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         '#C9A84C',
                marginBottom:  '1.2rem',
              }}>
                {s.leftLabel}
              </div>

              <h2 style={{
                fontFamily:    'var(--font-serif)',
                fontStyle:     'italic',
                fontSize:      'clamp(2.5rem, 14vw, 4.5rem)',
                fontWeight:    400,
                color:         '#FFFFFF',
                margin:        '0 0 1.2rem',
                lineHeight:    1.05,
                letterSpacing: '-0.02em',
              }}>
                {s.title}
              </h2>

              <div style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.5)',
              }}>
                {s.rightLabel}
              </div>

              {/* Progress bar */}
              <div style={{
                marginTop:    '2rem',
                width:        '120px',
                height:       '1px',
                background:   'rgba(196,163,90,0.2)',
                position:     'relative',
              }}>
                <div style={{
                  position:   'absolute',
                  inset:      '0 auto 0 0',
                  width:      `${((i + 1) / sections.length) * 100}%`,
                  height:     '100%',
                  background: 'rgba(196,163,90,0.7)',
                }} />
              </div>
              <div style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.6rem',
                letterSpacing: '0.1em',
                color:         'rgba(196,163,90,0.5)',
                marginTop:     '0.5rem',
              }}>
                {String(i + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        ))}
      </section>
    )
  }

  // Desktop: full GSAP scroll-driven experience
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
