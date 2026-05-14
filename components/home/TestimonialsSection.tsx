'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import { useIsIPhone } from '@/lib/use-iphone'

const PHOTOS = [
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/madrid-tweed_zsfaxi',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/wedding-morning-coat_ptibah',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/mint-jacket-madrid_igacjj',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0808_oo35om',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0416_brafs7',
]

// TOTAL is now derived dynamically from items.length to stay in sync with translations

/* ─── iPhone: simple stacked cards — no sticky, no scroll-driven transforms ─── */
function TestimonialsSimple({ items }: { items: { name: string; occasion: string; quote: string }[] }) {
  const { t } = useI18n()

  return (
    <section style={{ background: '#0A1628', padding: 'clamp(4rem, 10vh, 7rem) 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
          fontSize: 'clamp(1.6rem, 5vw, 3rem)',
          fontWeight: 400,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {t.testimonials.title}
        </h2>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: 'rgba(5, 12, 20, 0.85)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {/* Photo and Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid #C9A84C',
                flexShrink: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTOS[i]}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#C9A84C',
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
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#FFFFFF',
              fontStyle: 'italic',
              margin: 0,
            }}>
              {item.quote}
            </blockquote>

            <div style={{
              width: '30px',
              height: '1px',
              background: 'rgba(201,168,76,0.4)',
            }} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Desktop/Android: sticky scroll-driven 3D carousel ─── */
export function TestimonialsSection() {
  const { t } = useI18n()
  const isIPhone = useIsIPhone()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const isMobile = useIsMobile()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const checkMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    checkMotion()
  }, [])

  const items = t.testimonials.items
  const TOTAL = items.length

  // Call hooks unconditionally to avoid React error #300 when isIPhone toggles
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (isIPhone) return
    const raw = v * TOTAL
    const next = Math.min(Math.floor(raw), TOTAL - 1)
    if (next !== active) {
      setActive(next)
    }
  })

  // iPhone: render simple stacked cards
  if (isIPhone) {
    return <TestimonialsSimple items={items} />
  }

  // Mobile: smaller offsets, no 3D rotation. Reduced motion: disable animations.
  const cardTranslateX = reducedMotion ? 0 : isMobile ? 110 : 350
  const cardRotationY = reducedMotion ? 0 : isMobile ? 0 : 45
  const cardTranslateZ = reducedMotion ? 0 : isMobile ? 0 : -300
  const stageHeight = isMobile ? '46vh' : '52vh'
  const cardPadding = isMobile ? '1.5rem' : '2.5rem'
  const cardWidth = isMobile ? 'min(360px, 92vw)' : 'min(580px, 55vw)'
  const cardHeight = isMobile ? '380px' : '440px'
  const cardGap = isMobile ? '0.875rem' : '1.25rem'
  const photoSize = isMobile ? 44 : 56
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
            backgroundImage: `url('https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/cutting-fabric-wide_jqwwjw')`,
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
          <a
            href="https://www.google.com/maps/search/?api=1&query=Sastrería+Manuel+Fernández,+C.+de+Jorge+Juan,+41,+Salamanca,+28001+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.75rem',
              padding: '0.4rem 0.9rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '9999px',
              textDecoration: 'none',
              transition: 'background 0.25s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            }}
          >
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              color: '#C9A84C',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}>★ 4.9/5</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.5)',
            }}>Google Reviews</span>
          </a>
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
                  height: cardHeight,
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
                  overflow: 'hidden',
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

                {/* Quote — scrollable with fixed card height */}
                <div style={{
                  flex: 1,
                  minHeight: 0,
                  position: 'relative',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}>
                  <style>{`
                    .testimonial-quote::-webkit-scrollbar { display: none; }
                  `}</style>
                  <blockquote
                    className="testimonial-quote"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 1.3vw, 1.25rem)',
                      lineHeight: 1.6,
                      color: '#FFFFFF',
                      fontStyle: 'italic',
                      margin: 0,
                      position: 'relative',
                      paddingLeft: isMobile ? '1rem' : '0',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: isMobile ? '-0.4rem' : '-0.8rem',
                      left: isMobile ? '-0.3rem' : '-1.2rem',
                      fontSize: isMobile ? '1.8rem' : '3rem',
                      color: 'rgba(201,168,76,0.1)',
                      lineHeight: 1,
                    }}>"</span>
                    {item.quote}
                  </blockquote>
                  {/* Fade gradient to indicate scrollable content */}
                  <div style={{
                    position: 'sticky',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '28px',
                    background: 'linear-gradient(to top, rgba(5,12,20,0.95), transparent)',
                    pointerEvents: 'none',
                    marginTop: '-28px',
                  }} />
                </div>

                {/* Decorative accent */}
                <div style={{
                  width: '30px',
                  height: '1px',
                  background: 'rgba(201,168,76,0.4)',
                  flexShrink: 0,
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
