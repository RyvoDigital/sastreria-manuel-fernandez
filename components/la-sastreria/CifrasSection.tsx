'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function CifrasSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { n: t.la_sastreria.cifras.n1, l: t.la_sastreria.cifras.l1 },
    { n: t.la_sastreria.cifras.n2, l: t.la_sastreria.cifras.l2 },
    { n: t.la_sastreria.cifras.n3, l: t.la_sastreria.cifras.l3 },
    { n: t.la_sastreria.cifras.n4, l: t.la_sastreria.cifras.l4 },
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }

      // Gold rules draw left → right
      gsap.from('.mf-cifras-rule', {
        scaleX:          0,
        transformOrigin: 'left center',
        duration:        0.6,
        ease:            'power2.out',
        stagger:         0.1,
        scrollTrigger:   trigger,
      })

      // Numbers slide up
      gsap.from('.mf-cifras-num', {
        y:             30,
        opacity:       0,
        duration:      0.7,
        ease:          'power3.out',
        stagger:       0.12,
        delay:         0.2,
        scrollTrigger: trigger,
      })

      // Labels fade up
      gsap.from('.mf-cifras-lbl', {
        y:             12,
        opacity:       0,
        duration:      0.5,
        ease:          'power2.out',
        stagger:       0.12,
        delay:         0.5,
        scrollTrigger: trigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-navy)',
        padding:    'clamp(6rem, 12vh, 11rem) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Section label */}
        <div style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.55)',
          marginBottom:  'clamp(3rem, 6vh, 5rem)',
        }}>
          {t.la_sastreria.cifras.label}
        </div>

        {/* Stats grid */}
        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(4, 1fr)',
          gap:                   'clamp(1.5rem, 3vw, 3rem)',
        }}>
          {stats.map(({ n, l }, i) => (
            <div key={i} style={{ position: 'relative', paddingTop: '1.5rem' }}>

              {/* Gold rule */}
              <div className="mf-cifras-rule" style={{
                height:     '1px',
                background: 'var(--color-gold)',
                marginBottom: '1.5rem',
                opacity:    0.5,
              }} />

              {/* Number */}
              <span className="mf-cifras-num" style={{
                display:    'block',
                fontFamily: 'var(--font-serif)',
                fontStyle:  'italic',
                fontSize:   'clamp(3.2rem, 7vw, 7rem)',
                fontWeight:  400,
                lineHeight:  1,
                color:      'var(--color-offwhite)',
              }}>
                {n}
              </span>

              {/* Label */}
              <span className="mf-cifras-lbl" style={{
                display:       'block',
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'var(--color-gold)',
                marginTop:     '0.75rem',
                opacity:        0.7,
              }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
