'use client'

import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const PHOTOS = [
  '/photos/madrid-tweed.jpg',
  '/photos/wedding-morning-coat.jpg',
  '/photos/mint-jacket-madrid.jpg',
]

const TOTAL = 3

export function TestimonialsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<'down' | 'up'>('down')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * TOTAL
    const next = Math.min(Math.floor(raw), TOTAL - 1)
    if (next !== active) {
      setDirection(next > active ? 'down' : 'up')
      setActive(next)
    }
  })

  const items = t.testimonials.items

  // thumbnails = the two testimonials that are NOT active
  const thumbIndices = [0, 1, 2].filter((i) => i !== active)

  const imageVariants = {
    enter: (dir: 'down' | 'up') => ({
      y: dir === 'down' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { y: '0%', opacity: 1 },
    exit: (dir: 'down' | 'up') => ({
      y: dir === 'down' ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  const textVariants = {
    enter: (dir: 'down' | 'up') => ({
      y: dir === 'down' ? 30 : -30,
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (dir: 'down' | 'up') => ({
      y: dir === 'down' ? -30 : 30,
      opacity: 0,
    }),
  }

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        height: `${TOTAL * 100}vh`,
        background: 'var(--color-navy)',
      }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* Subtle fabric texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/photos/cutting-fabric-wide.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        />

        {/* 3-column grid */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 2.2fr 2.8fr',
            padding: 'clamp(4rem, 8vw, 7rem) clamp(3rem, 6vw, 6rem)',
            gap: 'clamp(2rem, 4vw, 4rem)',
          }}
        >
          {/* ── LEFT COLUMN ── counter + label + thumbnails ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Section label */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  marginBottom: '1.8rem',
                  opacity: 0.8,
                }}
              >
                {t.testimonials.label}
              </div>

              {/* Counter */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(245,240,234,0.35)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>
                  {String(active + 1).padStart(2, '0')}
                </span>
                {' / '}
                {String(TOTAL).padStart(2, '0')}
              </div>

              {/* Vertical label */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,234,0.2)',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  marginTop: '2rem',
                }}
              >
                Testimonios
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {thumbIndices.map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    maxHeight: '110px',
                    overflow: 'hidden',
                    borderRadius: '2px',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTOS[i]}
                    alt={items[i]?.name ?? ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.6) saturate(0.4)',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── CENTER COLUMN ── main portrait photo ── */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px',
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTOS[active]}
                  alt={items[active]?.name ?? ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    filter: 'brightness(0.88) saturate(0.7)',
                  }}
                />
                {/* Bottom gradient for readability */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(5,12,20,0.6), transparent)',
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT COLUMN ── quote + name + scroll hint ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingLeft: 'clamp(1rem, 3vw, 3rem)',
              borderLeft: '1px solid rgba(196,163,90,0.12)',
            }}
          >
            {/* Quote block */}
            <div style={{ paddingTop: '2rem' }}>
              {/* Gold opening quote */}
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3.5rem',
                  lineHeight: 0.7,
                  color: 'var(--color-gold)',
                  opacity: 0.4,
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                  userSelect: 'none',
                }}
              >
                "
              </div>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={active}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Quote text */}
                  <blockquote
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: 'var(--color-offwhite)',
                      fontStyle: 'italic',
                      marginBottom: '2.5rem',
                    }}
                  >
                    {items[active]?.quote}
                  </blockquote>

                  {/* Gold rule */}
                  <div
                    style={{
                      width: '32px',
                      height: '1px',
                      background: 'rgba(196,163,90,0.5)',
                      marginBottom: '1.5rem',
                    }}
                  />

                  {/* Author */}
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      fontWeight: 400,
                      letterSpacing: '0.08em',
                      color: 'var(--color-gold-light, var(--color-gold))',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {items[active]?.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.18em',
                      color: 'rgba(245,240,234,0.35)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {items[active]?.occasion}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scroll hint — fades out on last testimonial */}
            <motion.div
              animate={{ opacity: active === TOTAL - 1 ? 0 : 0.45 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {/* Animated scroll line */}
              <div
                style={{
                  position: 'relative',
                  width: '1px',
                  height: '40px',
                  background: 'rgba(196,163,90,0.2)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'var(--color-gold)',
                    opacity: 0.6,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,234,0.4)',
                }}
              >
                Scroll
              </span>
            </motion.div>
          </div>
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
