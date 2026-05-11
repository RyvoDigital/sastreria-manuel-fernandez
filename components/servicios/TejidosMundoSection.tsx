'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import type { GlobeMarker, GlobeArc } from '@/components/ui/globe'

const Globe = dynamic(() => import('@/components/ui/globe').then((m) => m.Globe), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', maxWidth: '540px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#C9A84C', animation: 'spin 1s linear infinite' }} />
    </div>
  ),
})

gsap.registerPlugin(ScrollTrigger)

// Client locations where we work — Madrid workshop at center
const MARKERS: GlobeMarker[] = [
  { id: 'madrid',       location: [40.4168,  -3.7038],  label: 'Madrid — Nuestro Taller' },
  { id: 'miami',        location: [25.7617,  -80.1918], label: 'Miami · USA' },
  { id: 'oporto',       location: [41.1579,   -8.6291], label: 'Oporto · Portugal' },
  { id: 'lisbon',       location: [38.7223,   -9.1393], label: 'Lisboa · Portugal' },
  { id: 'canarias',     location: [28.2916,  -16.6291], label: 'Islas Canarias · España' },
  { id: 'paris',        location: [48.8566,    2.3522], label: 'París · Francia' },
  { id: 'london',       location: [51.5074,   -0.1278], label: 'Londres · UK' },
  { id: 'rome',         location: [41.9028,   12.4964], label: 'Roma · Italia' },
  { id: 'birmingham',   location: [52.4862,   -1.8904], label: 'Birmingham · UK' },
  { id: 'dominican',    location: [18.7357,  -70.1627], label: 'República Dominicana' },
  { id: 'peru',         location: [-9.1900,   -75.0152], label: 'Perú' },
  { id: 'dubai',        location: [25.2048,   55.2708], label: 'Dubái · UAE' },
  { id: 'germany',      location: [51.1657,   10.4515], label: 'Alemania' },
  { id: 'belgium',      location: [50.8503,    4.3517], label: 'Bélgica' },
]

// Arcs from Madrid to client locations
const ARCS: GlobeArc[] = [
  { id: 'madrid-miami',      from: [40.4168, -3.7038], to: [25.7617, -80.1918] },
  { id: 'madrid-oporto',     from: [40.4168, -3.7038], to: [41.1579, -8.6291] },
  { id: 'madrid-lisbon',     from: [40.4168, -3.7038], to: [38.7223, -9.1393] },
  { id: 'madrid-canarias',   from: [40.4168, -3.7038], to: [28.2916, -16.6291] },
  { id: 'madrid-paris',      from: [40.4168, -3.7038], to: [48.8566,  2.3522] },
  { id: 'madrid-london',     from: [40.4168, -3.7038], to: [51.5074, -0.1278] },
  { id: 'madrid-rome',       from: [40.4168, -3.7038], to: [41.9028, 12.4964] },
  { id: 'madrid-birmingham', from: [40.4168, -3.7038], to: [52.4862, -1.8904] },
  { id: 'madrid-dominican',  from: [40.4168, -3.7038], to: [18.7357, -70.1627] },
  { id: 'madrid-peru',       from: [40.4168, -3.7038], to: [-9.1900, -75.0152] },
  { id: 'madrid-dubai',      from: [40.4168, -3.7038], to: [25.2048, 55.2708] },
  { id: 'madrid-germany',    from: [40.4168, -3.7038], to: [51.1657, 10.4515] },
  { id: 'madrid-belgium',    from: [40.4168, -3.7038], to: [50.8503,  4.3517] },
]

export function TejidosMundoSection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
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
      if (!isMobile) {
        gsap.from('.mf-tj-globe', {
          scale: 0.9, opacity: 0, duration: 1.2, ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
        })
      }
    }, el)
    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 70% at 60% 50%, rgba(201,168,76,0.04) 0%, transparent 100%)',
      }} />

      <div className="mf-tj-grid" style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '45fr 55fr',
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
            color: 'rgba(201,168,76,0.6)',
            marginBottom: '1.2rem',
          }}>
            {tj.label}
          </div>

          <div style={{
            width: '36px', height: '1px',
            background: 'rgba(201,168,76,0.4)',
            marginBottom: '1.6rem',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: 'clamp(1.8rem, 3vh, 2.5rem)',
          }}>
            {tj.title}
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.15vw, 0.95rem)',
            lineHeight: 1.88,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '46ch',
            marginBottom: '1.2rem',
          }}>
            {tj.p1}
          </p>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.15vw, 0.95rem)',
            lineHeight: 1.88,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '46ch',
            marginBottom: '2.5rem',
          }}>
            {tj.p2}
          </p>

          {/* Client locations list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { city: 'Miami', country: 'USA' },
              { city: 'Oporto', country: 'Portugal' },
              { city: 'Lisboa', country: 'Portugal' },
              { city: 'París', country: 'Francia' },
              { city: 'Londres', country: 'UK' },
              { city: 'Roma', country: 'Italia' },
              { city: 'Dubái', country: 'UAE' },
              { city: 'Rep. Dominicana', country: 'Caribe' },
            ].map((loc) => (
              <div key={loc.city} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C9A84C', opacity: 0.6 }} />
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.55)',
                }}>
                  <span style={{ color: 'rgba(201,168,76,0.8)' }}>{loc.city}</span>
                  {' · '}{loc.country}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Globe (desktop only) */}
        {!isMobile && (
          <div className="mf-tj-globe" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Gold glow halo behind the globe */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
              <div style={{
                position: 'absolute',
                inset: '-10%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Globe
                  markers={MARKERS}
                  arcs={ARCS}
                  dark={1}
                  markerColor={[0.77, 0.64, 0.35]}
                  arcColor={[0.77, 0.64, 0.35]}
                  baseColor={[0.20, 0.15, 0.07]}
                  glowColor={[0.77, 0.64, 0.35]}
                  mapBrightness={5}
                  mapSamples={20000}
                  speed={0.004}
                  theta={0.38}
                  diffuse={1.8}
                  markerSize={0.05}
                  markerElevation={0.015}
                  arcWidth={0.5}
                  arcHeight={0.35}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
