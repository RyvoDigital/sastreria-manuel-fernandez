'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { Globe, type GlobeMarker, type GlobeArc } from '@/components/ui/globe'

gsap.registerPlugin(ScrollTrigger)

const MARKERS: GlobeMarker[] = [
  { id: 'madrid',       location: [40.4168, -3.7038], label: 'Madrid — Atelier'      },
  { id: 'huddersfield', location: [53.6450, -1.7852], label: 'Holland & Sherry'       },
  { id: 'biella',       location: [45.5659,  8.0530], label: 'VBC · Biella'          },
  { id: 'lyon',         location: [45.7640,  4.8357], label: 'Dormeuil · Lyon'        },
  { id: 'sabadell',     location: [41.5433,  2.1094], label: 'Tejidos Españoles'      },
]

const ARCS: GlobeArc[] = [
  { id: 'madrid-huddersfield', from: [40.4168, -3.7038], to: [53.6450, -1.7852] },
  { id: 'madrid-biella',       from: [40.4168, -3.7038], to: [45.5659,  8.0530] },
  { id: 'madrid-lyon',         from: [40.4168, -3.7038], to: [45.7640,  4.8357] },
  { id: 'madrid-sabadell',     from: [40.4168, -3.7038], to: [41.5433,  2.1094] },
]

export function TejidosMundoSection() {
  const { t } = useI18n()
  const tj = t.servicios.tejidos
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-tj-lhs > *', {
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
      gsap.from('.mf-tj-globe', {
        scale: 0.9, opacity: 0, duration: 1.2, ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-navy)',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 70% at 60% 50%, rgba(196,163,90,0.03) 0%, transparent 100%)',
      }} />

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '45fr 55fr',
        gap: 'clamp(3rem, 5vw, 6rem)',
        alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Left: editorial text */}
        <div className="mf-tj-lhs">

          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.55)',
            marginBottom: '1.2rem',
          }}>
            {tj.label}
          </div>

          <div style={{
            width: '36px', height: '1px',
            background: 'rgba(196,163,90,0.4)',
            marginBottom: '1.6rem',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--color-offwhite)',
            marginBottom: 'clamp(1.8rem, 3vh, 2.5rem)',
          }}>
            {tj.title}
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.15vw, 0.95rem)',
            lineHeight: 1.88,
            color: 'rgba(245,240,234,0.42)',
            maxWidth: '46ch',
            marginBottom: '1.2rem',
          }}>
            {tj.p1}
          </p>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.15vw, 0.95rem)',
            lineHeight: 1.88,
            color: 'rgba(245,240,234,0.42)',
            maxWidth: '46ch',
            marginBottom: '2.5rem',
          }}>
            {tj.p2}
          </p>

          {/* Origin list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { city: 'Huddersfield', country: 'Reino Unido', house: 'Holland & Sherry' },
              { city: 'Biella',       country: 'Italia',       house: 'Vitale Barberis Canonico' },
              { city: 'Lyon',         country: 'Francia',      house: 'Dormeuil' },
              { city: 'Sabadell',     country: 'España',       house: 'Tejidos Españoles' },
            ].map((origin) => (
              <div key={origin.city} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-gold)', opacity: 0.6 }} />
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(245,240,234,0.55)',
                }}>
                  <span style={{ color: 'rgba(196,163,90,0.7)' }}>{origin.city}</span>
                  {' · '}{origin.house}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Globe */}
        <div className="mf-tj-globe" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Globe
            markers={MARKERS}
            arcs={ARCS}
            dark={1}
            markerColor={[0.77, 0.64, 0.35]}
            arcColor={[0.77, 0.64, 0.35]}
            baseColor={[0.05, 0.08, 0.1]}
            glowColor={[0.77, 0.64, 0.35]}
            mapBrightness={4}
            mapSamples={16000}
            speed={0.003}
            theta={0.3}
            diffuse={1.2}
            markerSize={0.03}
            arcWidth={0.4}
            arcHeight={0.3}
            className="w-full max-w-[520px]"
          />
        </div>

      </div>
    </section>
  )
}
