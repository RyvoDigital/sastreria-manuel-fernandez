'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

const HOTSPOTS = [
  { id: 'lining',     x: '26%', y: '64%' },
  { id: 'label',      x: '30%', y: '57%' },
  { id: 'waistcoat',  x: '44%', y: '54%' },
  { id: 'pocket',     x: '74%', y: '49%' },
  { id: 'lapel',      x: '56%', y: '40%' },
  { id: 'fabric',     x: '80%', y: '66%' },
]

export function SuitShowcaseSection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState<string | null>(null)

  const hs = t.suit_showcase.hotspots as Record<string, { title: string; desc: string }>

  return (
    <section style={{
      background: '#FFFFFF',
      padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            display: 'block',
            marginBottom: '1rem',
          }}>
            {t.suit_showcase.label}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 400,
            color: '#0A1628',
            margin: 0,
          }}>
            {t.suit_showcase.title}
          </h2>
        </div>

        {/* Showcase Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '100%' : '720px',
          margin: '0 auto',
          aspectRatio: '1130/1392',
          maxHeight: isMobile ? 'none' : '75vh',
          background: '#F8F8F8',
          borderRadius: '4px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          {/* Main Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/anatomia-traje.png"
            alt={t.suit_showcase.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
              filter: activeId && !isMobile ? 'brightness(0.75) blur(1px)' : 'none',
              transition: 'all 0.6s ease',
              display: 'block',
            }}
          />

          {/* Desktop Hotspots */}
          {!isMobile && HOTSPOTS.map((spot) => (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                top: spot.y,
                left: spot.x,
                zIndex: activeId === spot.id ? 20 : 10,
              }}
            >
              {/* Pulsing Dot */}
              <motion.button
                onClick={() => setActiveId(activeId === spot.id ? null : spot.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#C9A84C',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(201,168,76,0.6)',
                  position: 'relative',
                }}
                whileHover={{ scale: 1.2 }}
                animate={{
                  scale: activeId === spot.id ? 1.2 : [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {activeId === spot.id ? <X size={14} /> : <Plus size={14} />}

                {/* Ripple rings */}
                {!activeId && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50%',
                      border: '1px solid #C9A84C',
                      opacity: 0.5,
                    }}
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </motion.button>

              {/* Detail Card */}
              <AnimatePresence>
                {activeId === spot.id && hs[spot.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      top: '40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '240px',
                      background: '#FFFFFF',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                      zIndex: 30,
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#0A1628',
                      marginBottom: '0.5rem',
                    }}>
                      {hs[spot.id].title}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      color: 'rgba(10,22,40,0.7)',
                      margin: 0,
                    }}>
                      {hs[spot.id].desc}
                    </p>

                    {/* Arrow pointing up to the dot */}
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: '12px',
                      height: '12px',
                      background: '#FFFFFF',
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Mobile: stacked detail cards */}
        {isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.75rem',
            marginTop: '2rem',
          }}>
            {HOTSPOTS.map((spot, i) => (
              hs[spot.id] && (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#FAFAFA',
                    border: '1px solid rgba(201,168,76,0.12)',
                    borderRadius: '10px',
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#C9A84C',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginTop: '2px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#0A1628',
                      marginBottom: '0.3rem',
                    }}>
                      {hs[spot.id].title}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      color: 'rgba(10,22,40,0.65)',
                      margin: 0,
                    }}>
                      {hs[spot.id].desc}
                    </p>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        )}

        {/* Bottom CTA / Hint */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          color: 'rgba(10,22,40,0.5)',
        }}>
          {t.suit_showcase.hint}
        </div>
      </div>
    </section>
  )
}
