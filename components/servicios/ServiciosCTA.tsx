'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function ServiciosCTA() {
  const { t } = useI18n()
  const c = t.servicios.cta
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }
      gsap.from('.mf-sv-cta-text', { y: 30, opacity: 0, duration: 1.0, ease: 'power3.out', stagger: 0.15, scrollTrigger: trigger })
      gsap.from('.mf-sv-cta-btn',  { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15, delay: 0.4, scrollTrigger: trigger })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: 'min(100vh, 900px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photos/scissors-cutting.jpg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          filter: 'brightness(0.45) saturate(0.6)',
        }}
      />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(5,12,20,0.82) 0%, rgba(5,12,20,0.38) 50%, rgba(5,12,20,0.72) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) var(--container-padding) 0',
        maxWidth: '800px',
      }}>
        <div className="mf-sv-cta-text" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.65)',
          marginBottom: '1.5rem',
        }}>
          {c.label}
        </div>

        <h2 className="mf-sv-cta-text" style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 4.2vw, 4rem)',
          fontWeight: 400,
          lineHeight: 1.25,
          color: 'var(--color-offwhite)',
          marginBottom: '3rem',
        }}>
          {c.headline}
        </h2>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/reservar" className="mf-sv-cta-btn" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '1rem 2.5rem',
            background: 'var(--color-gold)',
            color: '#080808',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid var(--color-gold)',
            transition: 'all .25s ease',
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
            {c.btn_primary}
          </Link>

          <Link href="/la-sastreria" className="mf-sv-cta-btn" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '1rem 2.5rem',
            background: 'transparent',
            color: 'rgba(245,240,234,0.8)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid rgba(245,240,234,0.3)',
            transition: 'all .25s ease',
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
            {c.btn_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
