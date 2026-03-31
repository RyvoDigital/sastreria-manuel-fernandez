'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function SastreriaCTA() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }

      gsap.from('.mf-cta-text', {
        y: 30, opacity: 0, duration: 1.0, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: trigger,
      })

      gsap.from('.mf-cta-btn', {
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
        stagger: 0.15,
        delay: 0.4,
        scrollTrigger: trigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position:       'relative',
        height:         'min(100vh, 900px)',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photos/wedding-rome.jpg"
        alt=""
        aria-hidden
        className="mf-sas-cta-photo"
        style={{ filter: 'brightness(0.6) saturate(0.75)' }}
      />

      {/* Gradient overlay */}
      <div style={{
        position:      'absolute', inset: 0, pointerEvents: 'none',
        background:    'linear-gradient(135deg, rgba(5,12,20,0.78) 0%, rgba(5,12,20,0.42) 50%, rgba(5,12,20,0.68) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position:  'relative', zIndex: 1,
        textAlign: 'center',
        padding:   '0 var(--container-padding)',
        maxWidth:  '800px',
      }}>

        {/* Label */}
        <div className="mf-cta-text" style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.6rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.65)',
          marginBottom:  '1.5rem',
        }}>
          {t.la_sastreria.cta.label}
        </div>

        {/* Headline */}
        <h2 className="mf-cta-text" style={{
          fontFamily:   'var(--font-serif)',
          fontStyle:    'italic',
          fontSize:     'clamp(2rem, 4.2vw, 4rem)',
          fontWeight:    400,
          lineHeight:    1.25,
          color:        'var(--color-offwhite)',
          marginBottom: '3rem',
        }}>
          {t.la_sastreria.cta.headline}
        </h2>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/reservar" className="mf-cta-btn" style={{
            display:        'inline-flex',
            alignItems:     'center',
            padding:        '1rem 2.5rem',
            background:     'var(--color-gold)',
            color:          '#080808',
            fontFamily:     'var(--font-sans)',
            fontSize:       '0.7rem',
            letterSpacing:  '0.18em',
            textTransform:  'uppercase',
            textDecoration: 'none',
            border:         '1px solid var(--color-gold)',
            transition:     'background .25s, transform .2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--color-gold-light)'
            el.style.borderColor = 'var(--color-gold-light)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--color-gold)'
            el.style.borderColor = 'var(--color-gold)'
            el.style.transform = 'translateY(0)'
          }}>
            {t.la_sastreria.cta.btn_primary}
          </Link>

          <Link href="/experiencia" className="mf-cta-btn" style={{
            display:        'inline-flex',
            alignItems:     'center',
            padding:        '1rem 2.5rem',
            background:     'transparent',
            color:          'rgba(245,240,234,0.8)',
            fontFamily:     'var(--font-sans)',
            fontSize:       '0.7rem',
            letterSpacing:  '0.18em',
            textTransform:  'uppercase',
            textDecoration: 'none',
            border:         '1px solid rgba(245,240,234,0.3)',
            transition:     'border-color .25s, color .25s, transform .2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(245,240,234,0.7)'
            el.style.color = 'var(--color-offwhite)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(245,240,234,0.3)'
            el.style.color = 'rgba(245,240,234,0.8)'
            el.style.transform = 'translateY(0)'
          }}>
            {t.la_sastreria.cta.btn_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
