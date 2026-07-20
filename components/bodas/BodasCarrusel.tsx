'use client'

import { useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

const CARDS = [
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-011-0620.jpg', caption: 'Detail' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-016-0634.jpg', caption: 'Fabric' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-009-0599.jpg', caption: 'Precision' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-008-0596.jpg', caption: 'Atelier' },
  { src: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/03-screenshots/screenshot-09', caption: 'Portfolio' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-017-9305.jpg', caption: 'Handwork' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-013-0625.jpg', caption: 'Craft' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-011-0702.jpg', caption: 'Process' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-009-0640.jpg', caption: 'Tailor Shop' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-008-0693.jpg', caption: 'Studio' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-003-0684.jpg', caption: 'Fitting' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-001-0657.jpg', caption: 'Pattern' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/wedding-groom-detail.jpg', caption: 'Groom Detail' },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/wedding-morning-coat.jpg', caption: 'Morning Coat' },
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
