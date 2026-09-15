'use client'

import { useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

const CARDS = [
  { src: '/img/novio-chaque-paseo-novia.webp', caption: 'Detail' },
  { src: '/img/novio-traje-azul-sentado.webp', caption: 'Fabric' },
  { src: '/img/novios-playa-traje-azul.webp', caption: 'Precision' },
  { src: '/img/novio-traje-gris-boutonniere.webp', caption: 'Atelier' },
  { src: '/img/novio-traje-verde-bosque.webp', caption: 'Handwork' },
  { src: '/img/novios-escalera-jardin.webp', caption: 'Craft' },
  { src: '/img/novios-petalos-salida-boda.webp', caption: 'Process' },
  { src: '/img/novia-velo-novio-jardin.webp', caption: 'Tailor Shop' },
  { src: '/img/novios-tarta-boda.webp', caption: 'Studio' },
  { src: '/img/novios-baile-boda-jardin.webp', caption: 'Fitting' },
  { src: '/img/novios-ramo-boda.webp', caption: 'Pattern' },
  { src: '/img/boda-novios-ceremonia.webp', caption: 'Groom Detail' },
  { src: '/img/novio-chaque-roma.webp', caption: 'Morning Coat' },
]

const CARD_W = 260
const CARD_GAP = 20
const SCROLL_SPEED = 0.8 // pixels per frame

export function BodasCarrusel() {
  const { t } = useI18n()
  const c = t.bodas.carousel
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const singleSetWidth = CARDS.length * CARD_W + (CARDS.length - 1) * CARD_GAP

  // Auto-scroll with RAF only (no manual drag)
  useEffect(() => {
    const animate = () => {
      const containerW = containerRef.current?.clientWidth ?? 800
      const maxScroll = -(singleSetWidth - containerW + 80)

      xRef.current -= SCROLL_SPEED

      // Loop back to start
      if (xRef.current < maxScroll) {
        xRef.current = 0
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [singleSetWidth])

  return (
    <section style={{
      background: '#0A1628',
      padding: 'clamp(5rem, 10vh, 9rem) 0',
      overflow: 'hidden',
      borderTop: '1px solid rgba(201,168,76,0.1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0 var(--container-padding)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto clamp(3rem, 5vh, 4rem)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.6)',
          marginBottom: '0.8rem',
        }}>
          {c.label}
        </p>
        <div style={{
          width: '2.5rem',
          height: '1px',
          background: 'rgba(201,168,76,0.35)',
          margin: '0 auto',
        }} />
      </div>

      {/* Auto-scroll track */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            padding: '1rem 5vw',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={`a-${i}`}
              style={{
                width: `${CARD_W}px`,
                height: '360px',
                borderRadius: '1rem',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                border: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              <img
                src={card.src}
                alt={card.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
                draggable={false}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, transparent 100%)',
                padding: '2rem 1.25rem 1.25rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                }}>
                  {card.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
