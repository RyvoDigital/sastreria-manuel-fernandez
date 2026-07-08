'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap-setup'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'


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
        src="https://ik.imagekit.io/hvzm7siir/all-images/bodas-lining.png"
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
        background: 'linear-gradient(to bottom, rgba(10,22,40,0.65) 0%, rgba(10,22,40,0.8) 100%)',
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
          color: 'rgba(201,168,76,0.7)',
          marginBottom: '1.2rem',
        }}>
          {c.label}
        </p>

        <div style={{
          width: '2rem', height: '1px',
          background: 'rgba(201,168,76,0.4)',
          marginBottom: '2rem',
        }} />

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.15,
          maxWidth: '22ch',
          marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)',
        }}>
          {c.headline}
        </h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/contacto" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2.2rem',
            background: '#C9A84C',
            color: '#000000',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid #C9A84C',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#E8D5A3'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#C9A84C'
            el.style.transform = 'translateY(0)'
          }}>
            {c.btn_primary}
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </Link>

          <Link href="/la-sastreria" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.85rem 2.2rem',
            background: 'transparent',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(255,255,255,0.6)'
            el.style.color = '#FFFFFF'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(255,255,255,0.25)'
            el.style.color = 'rgba(255,255,255,0.8)'
          }}>
            {c.btn_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
