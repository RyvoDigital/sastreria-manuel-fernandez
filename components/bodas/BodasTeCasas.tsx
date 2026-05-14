'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'


export function BodasTeCasas() {
  const { t } = useI18n()
  const c = t.bodas.te_casas
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 75%', toggleActions: 'play none none none' }

      gsap.from('.mf-tecasas-label', {
        y: 30, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: trigger,
      })
      gsap.from('.mf-tecasas-p', {
        y: 20, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.18,
        delay: 0.25,
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
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Label */}
        <h2 className="mf-tecasas-label" style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          color: '#FFFFFF',
          marginBottom: 'clamp(2rem, 4vh, 3rem)',
        }}>
          {c.label}
        </h2>

        {/* Gold rule */}
        <div style={{
          width: '48px', height: '1px',
          background: 'rgba(201,168,76,0.45)',
          margin: '0 auto 2rem',
        }} />

        {/* Paragraphs */}
        <p className="mf-tecasas-p" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '52ch',
          margin: '0 auto 1.4rem',
        }}>
          {c.p1}
        </p>

        <p className="mf-tecasas-p" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '52ch',
          margin: '0 auto',
        }}>
          {c.p2}
        </p>
      </div>
    </section>
  )
}
