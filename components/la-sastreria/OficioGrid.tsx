'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const PHOTOS = [
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471204/photos/others/IMG_7067_xultr4',  catKey: 'cat1' as const },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471227/photos/others/IMG_1310_u91crm',  catKey: 'cat2' as const },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797508/photos/purple-lining-interior_krylkv', catKey: 'cat3' as const },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797465/photos/tweed-buttons_vse8vw',  catKey: 'cat4' as const },
]

export function OficioGrid() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el   = sectionRef.current
    const grid = gridRef.current
    if (!el || !grid) return

    const ctx = gsap.context(() => {
      const photoEls = grid.querySelectorAll('.mf-oficio-photo')
      const labelEls = grid.querySelectorAll('.mf-oficio-cat')

      // Sequential clip-path reveals from bottom
      gsap.from(photoEls, {
        clipPath:      'inset(0 0 100% 0)',
        duration:       1.2,
        ease:          'power4.inOut',
        stagger:        0.18,
        scrollTrigger: { trigger: grid, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Category labels fade in after photos
      gsap.from(labelEls, {
        opacity:       0,
        y:             8,
        duration:      0.6,
        ease:          'power2.out',
        stagger:       0.12,
        delay:         0.8,
        scrollTrigger: { trigger: grid, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Header
      gsap.from('.mf-oficio-header', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-navy)',
        padding:    '0 var(--container-padding) clamp(5rem, 8vh, 8rem)',
        overflow:   'hidden',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Header */}
        <div className="mf-oficio-header" style={{
          paddingTop:    'clamp(4rem, 7vh, 7rem)',
          paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          display:       'flex',
          alignItems:    'baseline',
          gap:           '2rem',
        }}>
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(196,163,90,0.55)',
          }}>
            {t.la_sastreria.oficio.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle:  'italic',
            fontSize:   'clamp(2rem, 4vw, 3.8rem)',
            fontWeight:  400,
            color:      'var(--color-offwhite)',
            margin:      0,
          }}>
            {t.la_sastreria.oficio.title}
          </h2>
        </div>

        {/* Asymmetric 4-photo grid */}
        <div
          ref={gridRef}
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows:    '55vh 45vh',
            gap:                 '0.75rem',
          }}
        >
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="mf-oficio-photo"
              style={{
                position:   'relative',
                overflow:   'hidden',
                // Asymmetry: odd photos start from top, even from bottom
                alignSelf:  i % 2 === 0 ? 'stretch' : (i === 1 ? 'end' : 'start'),
                height:     i === 1 ? '78%' : i === 2 ? '72%' : '100%',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt=""
                aria-hidden
                style={{
                  width:       '100%',
                  height:      '100%',
                  objectFit:   'cover',
                  objectPosition: 'center',
                  filter:      'brightness(0.82) saturate(0.75)',
                  display:     'block',
                }}
              />

              {/* Bottom gradient */}
              <div style={{
                position:      'absolute', inset: 0, pointerEvents: 'none',
                background:    'linear-gradient(to top, rgba(5,12,20,0.65) 0%, transparent 40%)',
              }} />

              {/* Category label */}
              <div className="mf-oficio-cat" style={{
                position:       'absolute',
                bottom:         '1.2rem',
                left:           '1.2rem',
                fontFamily:     'var(--font-sans)',
                fontSize:       '0.6rem',
                letterSpacing:  '0.25em',
                textTransform:  'uppercase',
                color:          'var(--color-gold)',
                background:     'rgba(5,12,20,0.55)',
                padding:        '0.3rem 0.75rem',
                backdropFilter: 'blur(4px)',
              }}>
                {t.la_sastreria.oficio[photo.catKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
