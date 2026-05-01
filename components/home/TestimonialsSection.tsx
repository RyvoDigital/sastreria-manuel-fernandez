'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const PHOTOS = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797485/photos/madrid-tweed_zsfaxi',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797420/photos/wedding-morning-coat_ptibah',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797352/photos/mint-jacket-madrid_igacjj',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471066/photos/others/IMG_0808_oo35om',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471068/photos/others/IMG_0416_brafs7',
]

const TOTAL = 5

export function TestimonialsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    checkMobile()
    checkMotion()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Mobile: smaller offsets, no 3D rotation. Reduced motion: disable animations.
  const cardTranslateX = reducedMotion ? 0 : isMobile ? 110 : 350
  const cardRotationY = reducedMotion ? 0 : isMobile ? 0 : 45
  const cardTranslateZ = reducedMotion ? 0 : isMobile ? 0 : -300
  const stageHeight = isMobile ? '42vh' : '48vh'
  const cardPadding = isMobile ? '1.5rem' : '3rem'
  const cardWidth = isMobile ? 'min(320px, 88vw)' : 'min(500px, 85vw)'
  const cardGap = isMobile ? '1rem' : '2rem'
  const photoSize = isMobile ? 48 : 64
  const springStiffness = reducedMotion ? 300 : isMobile ? 140 : 100
  const springDamping = reducedMotion ? 30 : isMobile ? 25 : 20

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
          perspective: isMobile ? 'none' : '1200px',
        }}
      >
        {/* Subtle fabric texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://res.cloudinary.com/dwruvre6o/image/upload/v1776797394/photos/cutting-fabric-wide_jqwwjw')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        />

        {/* Section Header */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '5vh' : '7vh',
          textAlign: 'center',
          zIndex: 10,
          padding: '0 1rem 2rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.testimonials.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {t.testimonials.title}
          </h2>
          {/* Google Reviews badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.4rem 0.9rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '9999px',
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              color: '#C9A84C',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}>★ 5.0/5</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.5)',
            }}>Google Reviews</span>
          </div>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: stageHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
          }}
        >
          {items.map((item: { name: string; occasion: string; quote: string }, i: number) => {
            const isActiveCard = active === i
            const rotationY = (i - active) * cardRotationY
            const translateZ = isActiveCard ? 0 : cardTranslateZ
            const translateX = (i - active) * cardTranslateX
            const opacity = isActiveCard ? 1 : isMobile ? 0 : 0.3

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  rotateY: rotationY,
                  z: translateZ,
                  x: translateX,
                  opacity: opacity,
                  scale: isActiveCard ? 1 : 0.85,
                }}
                transition={{
                  type: 'spring',
                  stiffness: springStiffness,
                  damping: springDamping,
                }}
                style={{
                  position: 'absolute',
                  width: cardWidth,
                  background: 'rgba(5, 12, 20, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isActiveCard ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '12px',
                  padding: cardPadding,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: cardGap,
                  boxShadow: isActiveCard ? '0 30px 60px rgba(0,0,0,0.5)' : 'none',
                  backfaceVisibility: isMobile ? 'visible' : 'hidden',
                }}
              >
                {/* Photo and Name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: `${photoSize}px`,
                    height: `${photoSize}px`,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1.5px solid #C9A84C',
                    flexShrink: 0,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTOS[i]}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      fontWeight: 500,
                      color: '#C9A84C',
                      marginBottom: '0.15rem',
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.6rem',
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
                  fontSize: isMobile ? '1rem' : 'clamp(1.1rem, 1.5vw, 1.4rem)',
                  lineHeight: 1.6,
                  color: '#FFFFFF',
                  fontStyle: 'italic',
                  margin: 0,
                  position: 'relative',
                  paddingLeft: isMobile ? '1rem' : '0',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: isMobile ? '-0.5rem' : '-1rem',
                    left: isMobile ? '-0.3rem' : '-1.5rem',
                    fontSize: isMobile ? '2rem' : '4rem',
                    color: 'rgba(201,168,76,0.1)',
                    lineHeight: 1,
                  }}>"</span>
                  {item.quote}
                </blockquote>

                {/* Decorative accent */}
                <div style={{
                  width: '30px',
                  height: '1px',
                  background: 'rgba(201,168,76,0.4)',
                  marginTop: '0.5rem',
                }} />
              </motion.div>
            )
          })}
        </div>

        {/* Progress Navigation */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '5vh' : '8vh',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {items.map((_: unknown, i: number) => (
            <div
              key={i}
              style={{
                width: i === active ? '32px' : '8px',
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
