'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { FlipGallery } from '@/components/ui/flip-gallery'

gsap.registerPlugin(ScrollTrigger)

export function OficioFlipSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  const images = [
    { title: t.la_sastreria.oficio.cat1, url: '/photos/cutting-table.jpg'  },
    { title: t.la_sastreria.oficio.cat2, url: '/photos/cutting-tweed.jpg'  },
    { title: t.la_sastreria.oficio.cat3, url: '/photos/sleeve-buttons.jpg' },
    { title: t.la_sastreria.oficio.cat4, url: '/photos/velvet-lining.jpg'  },
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 72%', toggleActions: 'play none none none' }

      gsap.from('.mf-oficio-flip-label', {
        y: 12, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: trigger,
      })
      gsap.from('.mf-oficio-flip-title', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out',
        delay: 0.1,
        scrollTrigger: trigger,
      })
      gsap.from('.mf-oficio-flip-body', {
        y: 16, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: trigger,
      })
      gsap.from('.mf-oficio-flip-gallery', {
        x: 40, opacity: 0, duration: 1.1, ease: 'power3.out',
        delay: 0.15,
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
        padding:    'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow:   'hidden',
      }}
    >
      <div style={{
        maxWidth:            'var(--container-max)',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: '45fr 55fr',
        gap:                 'clamp(3rem, 6vw, 8rem)',
        alignItems:          'center',
      }}>

        {/* ── LEFT: text ── */}
        <div>

          {/* Label */}
          <div className="mf-oficio-flip-label" style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(196,163,90,0.55)',
            marginBottom:  '1.2rem',
          }}>
            {t.la_sastreria.oficio.label}
          </div>

          {/* Gold rule */}
          <div style={{
            width: '36px', height: '1px',
            background: 'rgba(196,163,90,0.4)',
            marginBottom: '1.5rem',
          }} />

          {/* Title */}
          <h2 className="mf-oficio-flip-title" style={{
            fontFamily:   'var(--font-serif)',
            fontStyle:    'italic',
            fontSize:     'clamp(2.4rem, 4.5vw, 4.2rem)',
            fontWeight:    400,
            lineHeight:    1.1,
            color:        'var(--color-offwhite)',
            marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          }}>
            {t.la_sastreria.oficio.title}
          </h2>

          {/* Body copy */}
          <p className="mf-oficio-flip-body" style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.85rem, 1.2vw, 0.98rem)',
            lineHeight:  1.85,
            color:      'rgba(245,240,234,0.5)',
            maxWidth:   '40ch',
            margin:      0,
          }}>
            Cada prenda nace de cuatro disciplinas que se superponen con
            precisión milimétrica: el corte, el tejido, la confección y el forro.
            Ninguna es más importante que las demás.
          </p>
        </div>

        {/* ── RIGHT: flip gallery ── */}
        <div
          className="mf-oficio-flip-gallery"
          style={{
            display:        'flex',
            justifyContent: 'center',
          }}
        >
          <FlipGallery
            images={images}
            id="mf-oficio-flip"
            width={310}
            height={510}
          />
        </div>
      </div>
    </section>
  )
}
