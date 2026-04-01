'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function BodasFinal() {
  const { t } = useI18n()
  const c = t.bodas.cta
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-bodas-cf-content > *', {
        y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.14,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photos/wedding-ceremony.jpg"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.28) saturate(0.5)',
        }}
      />
      {/* Navy tint overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(5,12,20,0.6) 0%, rgba(5,12,20,0.75) 100%)',
      }} />

      {/* Content */}
      <div
        className="mf-bodas-cf-content"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.65)',
          marginBottom: '1.2rem',
        }}>
          {c.label}
        </p>

        <div style={{
          width: '2rem', height: '1px',
          background: 'rgba(196,163,90,0.4)',
          marginBottom: '2rem',
        }} />

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 400,
          color: 'var(--color-offwhite)',
          lineHeight: 1.15,
          maxWidth: '22ch',
          marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)',
        }}>
          {c.headline}
        </h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/reservar" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2.2rem',
            background: 'var(--color-gold)',
            color: '#080808',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid var(--color-gold)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--color-gold-light)'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--color-gold)'
            el.style.transform = 'translateY(0)'
          }}>
            {c.btn_primary}
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </Link>

          <Link href="/la-sastreria" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2.2rem',
            background: 'transparent',
            color: 'rgba(245,240,234,0.75)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid rgba(245,240,234,0.22)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(245,240,234,0.55)'
            el.style.color = 'var(--color-offwhite)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(245,240,234,0.22)'
            el.style.color = 'rgba(245,240,234,0.75)'
          }}>
            {c.btn_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
