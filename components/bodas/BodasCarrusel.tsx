'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const CARDS = [
  { src: '/photos/sleeve-buttons.jpg',        caption: 'Los Botones' },
  { src: '/photos/velvet-lining.jpg',         caption: 'El Forro' },
  { src: '/photos/purple-lining-interior.jpg',caption: 'El Interior' },
  { src: '/photos/fabric-selection.jpg',      caption: 'Los Tejidos' },
  { src: '/photos/wedding-church.jpg',        caption: 'La Ceremonia' },
  { src: '/photos/wedding-couple.jpg',        caption: 'El Momento' },
  { src: '/photos/wedding-rome.jpg',          caption: 'El Destino' },
]

const CARD_W = 260
const CARD_GAP = 20

export function BodasCarrusel() {
  const { t } = useI18n()
  const c = t.bodas.carousel
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const trackWidth = CARDS.length * CARD_W + (CARDS.length - 1) * CARD_GAP

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

      {/* Drag track */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{
            left: -(trackWidth - (containerRef.current?.clientWidth ?? 800) + 80),
            right: 0,
          }}
          dragElastic={0.12}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            padding: '1rem 5vw',
            width: 'max-content',
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
              {/* Caption overlay */}
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
        </motion.div>
      </div>

      {/* Hint */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.48rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.35)',
        }}>
          ← Arrastrar →
        </p>
      </div>
    </section>
  )
}
