'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useIsIPhone } from '@/lib/use-iphone'
import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx'

const CSS = `
  @keyframes mf-mobile-fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mf-mj-card {
    opacity: 0;
  }
  .mf-mj-card.visible {
    animation: mf-mobile-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
`

export function CraftJourneySection() {
  const { t } = useI18n()
  const isIPhone = useIsIPhone()
  const [mounted, setMounted] = useState(false)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isIPhone || cardsRef.current.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    )
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })
    return () => observer.disconnect()
  }, [isIPhone, mounted])

  const sections = [
    {
      id:          'tejido',
      background:  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1781087697/WhatsApp_Image_2026-06-10_at_11.15.20_lfkgyf.jpg',
      leftLabel:   t.la_sastreria.oficio.cat1,
      title:       'Carácter',
      rightLabel:  'Lana & Seda',
    },
    {
      id:          'diseno',
      background:  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/w_1200/photos/web_lista_images/sastreria-overview_viyqaa',
      leftLabel:   t.la_sastreria.oficio.cat2,
      title:       'Precisión',
      rightLabel:  'Tradición',
    },
    {
      id:          'corte',
      background:  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/w_1200/photos/web_lista_images/sastreria-cut-by-hand_tiomh8',
      leftLabel:   t.la_sastreria.oficio.cat3,
      title:       'Paciencia',
      rightLabel:  'A Mano',
    },
    {
      id:          'proceso',
      background:  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/w_1200/photos/web_lista_images/sastreria-artisan-detail_hfozse',
      leftLabel:   t.la_sastreria.oficio.cat4,
      title:       'Perfección',
      rightLabel:  'El Detalle',
    },
  ]

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

  if (isIPhone) {
    return (
      <section style={{ background: '#0A1628' }}>
        <style>{CSS}</style>
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
            ref={(el) => { if (el) cardsRef.current[i] = el }}
            className="mf-mj-card"
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
              loading={i > 0 ? 'lazy' : 'eager'}
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
