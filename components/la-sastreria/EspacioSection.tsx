'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function EspacioSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const mainPhotoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el   = sectionRef.current
    const main = mainPhotoRef.current
    if (!el || !main) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }

      // Main photo — clip from LEFT
      gsap.from(main, {
        clipPath:      'inset(0 100% 0 0)',
        duration:       1.5,
        ease:          'power4.inOut',
        scrollTrigger: trigger,
      })

      // Side images — clip from RIGHT, staggered
      gsap.from('.mf-esp-side', {
        clipPath:      'inset(0 0 0 100%)',
        duration:       1.2,
        ease:          'power4.inOut',
        stagger:        0.25,
        delay:          0.3,
        scrollTrigger: trigger,
      })

      // Text block
      gsap.from('.mf-esp-text', {
        y:             20,
        opacity:       0,
        duration:      0.9,
        ease:          'power3.out',
        stagger:       0.2,
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
        background: '#0A1628',
        overflow:   'hidden',
        padding:    '0 var(--container-padding) clamp(5rem, 8vh, 7rem)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Section header */}
        <div className="mf-esp-text" style={{
          paddingTop:    'clamp(4rem, 7vh, 7rem)',
          paddingBottom: 'clamp(2rem, 3vh, 3rem)',
          display:       'flex',
          alignItems:    'baseline',
          gap:           '2rem',
        }}>
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.6)',
          }}>
            {t.la_sastreria.espacio.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle:  'italic',
            fontSize:   'clamp(2rem, 4vw, 3.8rem)',
            fontWeight:  400,
            color:      '#FFFFFF',
            margin:      0,
          }}>
            {t.la_sastreria.espacio.title}
          </h2>
        </div>

        {/* 70/30 photo grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '70fr 30fr',
          gap:                 '0.75rem',
          minHeight:           '70vh',
        }}>

          {/* Main photo — left */}
          <div
            ref={mainPhotoRef}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797507/cGhvdG9zL3RhaWxvci13b3Jrc2hvcF9yYjBiY3c="
              alt="Taller de Sastrería Manuel Fernández"
              style={{
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: 'center',
                filter:         'brightness(0.85) saturate(0.72)',
                display:        'block',
              }}
            />
            {/* Bottom gradient */}
            <div style={{
              position:   'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(10,15,23,0.7) 0%, transparent 40%)',
            }} />
          </div>

          {/* Side stack — right */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.75rem',
          }}>
            {[
              { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797485/cGhvdG9zL2JsdWUtcGxhaWQtZm9ybV9yZ2tvZGo=', alt: 'Tejido azul en maniquí' },
              { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797462/cGhvdG9zL2ZhYnJpYy1zZWxlY3Rpb25fc3RrYmNm', alt: 'Selección de tejidos' },
            ].map((photo, i) => (
              <div
                key={i}
                className="mf-esp-side"
                style={{
                  position: 'relative',
                  flex:     1,
                  overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  style={{
                    width:          '100%',
                    height:         '100%',
                    objectFit:      'cover',
                    objectPosition: 'center',
                    filter:         'brightness(0.82) saturate(0.7)',
                    display:        'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description text below photos */}
        <div style={{
          marginTop:    'clamp(2rem, 3.5vh, 3rem)',
          maxWidth:     '55ch',
        }}>
          <p className="mf-esp-text" style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.85rem, 1.3vw, 1rem)',
            lineHeight:  1.85,
            color:      'rgba(255,255,255,0.6)',
            margin:      0,
          }}>
            {t.la_sastreria.espacio.description}
          </p>
        </div>
      </div>
    </section>
  )
}
