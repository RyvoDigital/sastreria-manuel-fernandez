'use client'

import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const PHOTOS = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797485/cGhvdG9zL21hZHJpZC10d2VlZF96c2ZheGk=',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797420/cGhvdG9zL3dlZGRpbmctbW9ybmluZy1jb2F0X3B0aWJhaA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797352/cGhvdG9zL21pbnQtamFja2V0LW1hZHJpZF9pZ2Fjamo=',
]

const TOTAL = 3

export function TestimonialsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * TOTAL
    const next = Math.min(Math.floor(raw), TOTAL - 1)
    if (next !== active) {
      setActive(next)
    }
  })

  const items = t.testimonials.items

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        height: `${TOTAL * 100}vh`,
        background: '#0A1628',
        overflow: 'visible',
      }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          perspective: '1200px',
        }}
      >
        {/* Subtle fabric texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://res.cloudinary.com/dwruvre6o/image/upload/v1776797394/cGhvdG9zL2N1dHRpbmctZmFicmljLXdpZGVfanF3d2p3')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        />

        {/* Section Header */}
        <div style={{
          position: 'absolute',
          top: '10vh',
          textAlign: 'center',
          zIndex: 10,
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1.5rem',
          }}>
            {t.testimonials.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
          }}>
            {t.testimonials.title}
          </h2>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {items.map((item, i) => {
            const isActive = active === i
            const rotationY = (i - active) * 45 // 45 degree separation
            const translateZ = isActive ? 0 : -300
            const translateX = (i - active) * 350
            const opacity = isActive ? 1 : 0.3

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  rotateY: rotationY,
                  z: translateZ,
                  x: translateX,
                  opacity: opacity,
                  scale: isActive ? 1 : 0.8,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                style={{
                  position: 'absolute',
                  width: 'min(500px, 85vw)',
                  background: 'rgba(5, 12, 20, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '12px',
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.5)' : 'none',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Photo and Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1.5px solid #C9A84C',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTOS[i]}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#C9A84C',
                      marginBottom: '0.2rem',
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      {item.occasion}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                  lineHeight: 1.6,
                  color: '#FFFFFF',
                  fontStyle: 'italic',
                  margin: 0,
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '-1.5rem',
                    fontSize: '4rem',
                    color: 'rgba(201,168,76,0.1)',
                    lineHeight: 1,
                  }}>"</span>
                  {item.quote}
                </blockquote>

                {/* Decorative Author accent */}
                <div style={{
                  width: '30px',
                  height: '1px',
                  background: 'rgba(201,168,76,0.4)',
                  marginTop: '1rem',
                }} />
              </motion.div>
            )
          })}
        </div>

        {/* Progress Navigation */}
        <div style={{
          position: 'absolute',
          bottom: '8vh',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}>
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === active ? '40px' : '8px',
                height: '4px',
                borderRadius: '4px',
                background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>

        {/* Bottom gold progress bar */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
            scaleX: scrollYProgress,
            transformOrigin: 'left',
            width: '100%',
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  )
}
