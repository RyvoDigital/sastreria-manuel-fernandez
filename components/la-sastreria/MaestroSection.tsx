'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function MaestroSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el    = sectionRef.current
    const photo = photoRef.current
    if (!el || !photo) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 65%', toggleActions: 'play none none none' }

      // Photo clip-path from LEFT
      gsap.from(photo, {
        clipPath:      'inset(0 100% 0 0)',
        duration:       1.5,
        ease:          'power4.inOut',
        scrollTrigger: trigger,
      })

      // Quote
      gsap.from('.mf-mae-quote', {
        y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
        delay: 0.25,
        scrollTrigger: trigger,
      })

      // Attribution
      gsap.from('.mf-mae-attr', {
        y: 16, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: 0.5,
        scrollTrigger: trigger,
      })

      // Bio
      gsap.from('.mf-mae-bio', {
        y: 16, opacity: 0, duration: 0.8, ease: 'power3.out',
        delay: 0.7,
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
        display:    'grid',
        gridTemplateColumns: '45fr 55fr',
        minHeight:  '100vh',
      }}
    >
      {/* ── PHOTO — LEFT ── */}
      <div
        ref={photoRef}
        style={{
          position:   'relative',
          overflow:   'hidden',
          minHeight:  '600px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/fitting-vest.jpg"
          alt="Manuel Fernández en su atelier"
          style={{
            position:   'absolute', inset: 0,
            width:      '100%', height: '100%',
            objectFit:  'cover', objectPosition: 'center top',
            filter:     'brightness(0.88) saturate(0.8)',
          }}
        />
        {/* Right bleed gradient */}
        <div style={{
          position:      'absolute', inset: 0, pointerEvents: 'none',
          background:    'linear-gradient(to right, transparent 60%, #0A1628 100%)',
        }} />
      </div>

      {/* ── CONTENT — RIGHT ── */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        padding:        'clamp(5rem, 10vh, 9rem) clamp(3rem, 6vw, 7rem)',
      }}>

        {/* Label */}
        <div style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(201,168,76,0.6)',
          marginBottom:  '2.5rem',
        }}>
          {t.la_sastreria.maestro.label}
        </div>

        {/* Opening quote mark */}
        <div style={{
          fontFamily:   'var(--font-serif)',
          fontSize:     '5.5rem',
          lineHeight:    0,
          color:        '#C9A84C',
          opacity:       0.2,
          marginBottom: '1.5rem',
          fontStyle:    'italic',
          userSelect:   'none',
        }}>
          "
        </div>

        {/* Quote */}
        <blockquote className="mf-mae-quote" style={{
          fontFamily:   'var(--font-serif)',
          fontStyle:    'italic',
          fontSize:     'clamp(1.6rem, 3.2vw, 3.5rem)',
          fontWeight:    400,
          lineHeight:    1.3,
          color:        '#E8D5A3',
          marginBottom: '2rem',
          margin:        '0 0 2rem 0',
        }}>
          {t.la_sastreria.maestro.quote}
        </blockquote>

        {/* Gold rule */}
        <div style={{
          width: '36px', height: '1px',
          background: 'rgba(201,168,76,0.4)',
          marginBottom: '1.5rem',
        }} />

        {/* Attribution */}
        <div className="mf-mae-attr" style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         '#C9A84C',
          marginBottom:  '2.5rem',
          opacity:        0.8,
        }}>
          {t.la_sastreria.maestro.attribution}
        </div>

        {/* Bio */}
        <p className="mf-mae-bio" style={{
          fontFamily: 'var(--font-sans)',
          fontSize:   'clamp(0.85rem, 1.3vw, 1rem)',
          lineHeight:  1.85,
          color:      'rgba(255,255,255,0.65)',
          maxWidth:   '45ch',
          margin:      0,
        }}>
          {t.la_sastreria.maestro.bio}
        </p>
      </div>
    </section>
  )
}
