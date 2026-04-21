"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const HOTSPOTS = [
  { id: 'lapel', x: '35%', y: '25%' },
  { id: 'buttons', x: '48%', y: '55%' },
  { id: 'shoulder', x: '28%', y: '15%' },
  { id: 'fabric', x: '60%', y: '40%' },
]

export function SuitShowcaseSection() {
  const { t } = useI18n()
  const [activeId, setActiveId] = useState<string | null>(null)

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
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
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
          maxWidth: '800px',
          margin: '0 auto',
          aspectRatio: '4/5',
          maxHeight: '75vh',
          background: '#F8F8F8',
          borderRadius: '4px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
        }}>
          {/* Main Image */}
          <Image
            src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797518/photos/showroom-jackets_n55sfk"
            alt="Suit Detail Showcase"
            fill
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
              filter: activeId ? 'brightness(0.7) blur(2px)' : 'none',
              transition: 'all 0.6s ease',
            }}
          />

          {/* Hotspots */}
          {HOTSPOTS.map((spot) => (
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
                  width: '32px',
                  height: '32px',
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
                  ease: "easeInOut"
                }}
              >
                {activeId === spot.id ? <X size={16} /> : <Plus size={16} />}
                
                {/* Ripple rings */}
                {!activeId && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -8,
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
                {activeId === spot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      top: '45px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '260px',
                      background: '#FFFFFF',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                      zIndex: 30,
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#0A1628',
                      marginBottom: '0.5rem',
                    }}>
                      {t.suit_showcase.hotspots[spot.id as keyof typeof t.suit_showcase.hotspots].title}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      color: 'rgba(10,22,40,0.7)',
                      margin: 0,
                    }}>
                      {t.suit_showcase.hotspots[spot.id as keyof typeof t.suit_showcase.hotspots].desc}
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

        {/* Bottom CTA / Hint */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          color: 'rgba(10,22,40,0.5)',
        }}>
          {t.suit_showcase.hint}
        </div>
      </div>
    </section>
  )
}
