'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import { useIsIPhone } from '@/lib/use-iphone'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PHOTOS = [
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/madrid-tweed_zsfaxi',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/IMG_9423_bn8baq',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/mint-jacket-madrid_igacjj',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0808_oo35om',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0416_brafs7',
]

const AUTO_ROTATE_INTERVAL = 3000

/* ─── iPhone: simple stacked cards ─── */
function TestimonialsSimple({ items }: { items: { name: string; occasion: string; quote: string }[] }) {
  const { t } = useI18n()

  return (
    <section style={{ background: '#0A1628', padding: 'clamp(4rem, 10vh, 7rem) 1rem' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid #C9A84C',
                flexShrink: 0,
              }}>
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

/* ─── Desktop/Android: auto-rotating 3D carousel ─── */
export function TestimonialsSection() {
  const { t } = useI18n()
  const isIPhone = useIsIPhone()
  const [active, setActive] = useState(0)
  const isMobile = useIsMobile()
  const [reducedMotion, setReducedMotion] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const checkMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    checkMotion()
  }, [])

  const items = t.testimonials.items
  const TOTAL = items.length

  const goTo = useCallback((index: number) => {
    setActive(((index % TOTAL) + TOTAL) % TOTAL)
  }, [TOTAL])

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  // Auto-rotate
  useEffect(() => {
    if (reducedMotion) return
    intervalRef.current = setInterval(next, AUTO_ROTATE_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next, reducedMotion])

  // Pause on hover
  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
  const resume = () => {
    if (reducedMotion) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(next, AUTO_ROTATE_INTERVAL)
  }

  // iPhone: render simple stacked cards
  if (isIPhone) {
    return <TestimonialsSimple items={items} />
  }

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
    <section
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 12vh, 10rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
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
        textAlign: 'center',
        marginBottom: 'clamp(2rem, 5vh, 4rem)',
        position: 'relative',
        zIndex: 10,
        padding: '0 1rem',
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
          perspective: isMobile ? 'none' : '1200px',
          zIndex: 5,
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
                background: 'rgba(5, 12, 20, 0.95)',
                backdropFilter: isMobile ? 'none' : 'blur(12px)',
                border: `1px solid ${isActiveCard ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '12px',
                padding: cardPadding,
                display: 'flex',
                flexDirection: 'column',
                gap: cardGap,
                boxShadow: isActiveCard ? '0 30px 60px rgba(0,0,0,0.5)' : 'none',
                backfaceVisibility: isMobile ? 'visible' : 'hidden',
                overflow: 'hidden',
                willChange: 'transform',
                pointerEvents: isActiveCard ? 'auto' : 'none',
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

      {/* Arrow Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        marginTop: '2rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <button
          onClick={prev}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'transparent',
            color: '#C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {items.map((_: unknown, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? '32px' : '8px',
                height: '4px',
                borderRadius: '4px',
                background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'transparent',
            color: '#C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
