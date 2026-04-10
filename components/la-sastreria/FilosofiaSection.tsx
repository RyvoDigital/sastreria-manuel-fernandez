'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function FilosofiaSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 75%', toggleActions: 'play none none none' }

      // Curtain-up quote lines — inner spans rise from y:100% to 0%
      gsap.from('.mf-filo-inner', {
        y:             '105%',
        duration:      0.9,
        ease:          'power3.out',
        stagger:       0.18,
        scrollTrigger: trigger,
      })

      // Label
      gsap.from('.mf-filo-label', {
        y: 12, opacity: 0, duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: trigger,
      })

      // Supporting paragraphs
      gsap.from('.mf-filo-p', {
        y:             20,
        opacity:       0,
        duration:      0.8,
        ease:          'power3.out',
        stagger:       0.2,
        delay:         0.7,
        scrollTrigger: trigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const quoteLines = [
    t.la_sastreria.filosofia.q1,
    t.la_sastreria.filosofia.q2,
    t.la_sastreria.filosofia.q3,
  ]

  return (
    <section
      ref={sectionRef}
      style={{
        position:   'relative',
        background: '#0A1628',
        padding:    'clamp(7rem, 13vh, 12rem) var(--container-padding)',
        overflow:   'hidden',
      }}
    >
      {/* Subtle gold radial grain */}
      <div style={{
        position:      'absolute', inset: 0, pointerEvents: 'none',
        background:    'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Label */}
        <div className="mf-filo-label" style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(201,168,76,0.6)',
          marginBottom:  'clamp(3rem, 5vh, 4rem)',
        }}>
          {t.la_sastreria.filosofia.label}
        </div>

        {/* Quote — lines with curtain-up reveal */}
        <div style={{
          marginBottom:  'clamp(3.5rem, 6vh, 6rem)',
          marginLeft:    'calc(var(--container-padding) * -0.25)',
          marginRight:   'calc(var(--container-padding) * -0.25)',
        }}>
          {quoteLines.map((line, i) => (
            <div key={i} style={{
              display:    'block',
              overflow:   'hidden',
              lineHeight:  1.15,
            }}>
              <span className="mf-filo-inner" style={{
                display:       'block',
                fontFamily:    'var(--font-serif)',
                fontStyle:     'italic',
                fontSize:      'clamp(2.8rem, 5.5vw, 6rem)',
                fontWeight:     400,
                color:         i < 2 ? '#FFFFFF' : '#C9A84C',
                paddingBottom:  '0.1em',
              }}>
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* Supporting paragraphs — 2-column */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 'clamp(2rem, 5vw, 6rem)',
          maxWidth:            '900px',
        }}>
          {[t.la_sastreria.filosofia.p1, t.la_sastreria.filosofia.p2].map((p, i) => (
            <p key={i} className="mf-filo-p" style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   'clamp(0.85rem, 1.3vw, 1rem)',
              lineHeight:  1.85,
              color:      'rgba(255,255,255,0.65)',
              margin:      0,
            }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
