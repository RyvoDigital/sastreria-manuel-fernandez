'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Scissors, Layers, Palette, Heart, MessageSquare } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const PANEL_PHOTOS = [
  '/photos/madrid-tweed.jpg',
  '/photos/cutting-fabric-wide.jpg',
  '/photos/cutting-table.jpg',
  '/photos/wedding-morning-coat.jpg',
  '/photos/tailor-workshop.jpg',
]

const PANEL_ICONS = [
  <Scissors      key="scissors" size={18} color="white" strokeWidth={1.5} />,
  <Layers        key="layers"   size={18} color="white" strokeWidth={1.5} />,
  <Palette       key="palette"  size={18} color="white" strokeWidth={1.5} />,
  <Heart         key="heart"    size={18} color="white" strokeWidth={1.5} />,
  <MessageSquare key="msg"      size={18} color="white" strokeWidth={1.5} />,
]

// Smooth luxury easing — slow start, springy finish
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function EditorialSection() {
  const { t } = useI18n()
  const [active, setActive]           = useState(0)
  const [visible, setVisible]         = useState(false)
  const [isTouch, setIsTouch]         = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const articles = t.editorial.articles

  useEffect(() => {
    // Detect touch/no-hover devices for click vs hover
    setIsTouch(window.matchMedia('(hover: none)').matches)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-navy)',
        padding:    'clamp(6rem, 10vw, 10rem) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Section label */}
        <div
          style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color:         'var(--color-gold)',
            marginBottom:  '3rem',
            opacity:        0.8,
          }}
        >
          {t.editorial.label}
        </div>

        {/* Accordion */}
        <div
          style={{
            display:  'flex',
            height:   '520px',
            overflow: 'hidden',
            gap:      '2px',
          }}
        >
          {articles.map((article, i) => {
            const isActive = active === i

            return (
              <motion.div
                key={i}
                initial={{ x: -60, opacity: 0 }}
                animate={visible ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: i * 0.08 }}
                onMouseEnter={!isTouch ? () => setActive(i) : undefined}
                onClick={isTouch ? () => setActive(i) : undefined}
                style={{
                  position:   'relative',
                  flexGrow:   isActive ? 7 : 1,
                  flexShrink: 1,
                  flexBasis:  0,
                  minWidth:   '52px',
                  overflow:   'hidden',
                  cursor:     'pointer',
                  // Single transition covers all CSS properties that change
                  transition: `flex-grow 0.9s ${EASE}, border-color 0.7s ${EASE}`,
                  border:     `1px solid ${isActive ? 'rgba(196,163,90,0.45)' : 'rgba(196,163,90,0.1)'}`,
                }}
              >
                {/* Background photo */}
                <div
                  style={{
                    position:           'absolute',
                    inset:               0,
                    backgroundImage:    `url('${PANEL_PHOTOS[i]}')`,
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                    transition:         `filter 0.9s ${EASE}`,
                    filter:             isActive
                      ? 'brightness(0.72) saturate(0.65)'
                      : 'brightness(0.22) saturate(0.25)',
                  }}
                />

                {/* Dark-to-transparent gradient — fades in/out via opacity */}
                <div
                  style={{
                    position:      'absolute',
                    inset:          0,
                    background:    'linear-gradient(to top, rgba(5,12,20,0.95) 0%, rgba(5,12,20,0.4) 40%, transparent 75%)',
                    opacity:       isActive ? 1 : 0.6,
                    transition:    `opacity 0.9s ${EASE}`,
                    pointerEvents: 'none',
                  }}
                />

                {/* ── Text block — bottom of panel, clears the icon ── */}
                <div
                  style={{
                    position:      'absolute',
                    bottom:        '5.2rem',   // sits above the icon circle
                    left:          '1.4rem',
                    right:         '1.4rem',
                    overflow:      'hidden',
                    opacity:       isActive ? 1 : 0,
                    transform:     isActive ? 'translateY(0)' : 'translateY(12px)',
                    transition:    `opacity 0.55s ${EASE} 0.18s, transform 0.55s ${EASE} 0.18s`,
                    pointerEvents: 'none',
                  }}
                >
                  {/* Category */}
                  <div
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontSize:      '0.58rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color:         'var(--color-gold)',
                      marginBottom:  '0.5rem',
                      opacity:        0.9,
                    }}
                  >
                    {article.category}
                  </div>

                  {/* Gold rule */}
                  <div
                    style={{
                      width:        '24px',
                      height:       '1px',
                      background:   'rgba(196,163,90,0.45)',
                      marginBottom: '0.75rem',
                    }}
                  />

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily:   'var(--font-serif)',
                      fontSize:     'clamp(1.2rem, 1.8vw, 1.75rem)',
                      fontWeight:    400,
                      lineHeight:    1.2,
                      color:         'var(--color-offwhite)',
                      fontStyle:    'italic',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize:   '0.75rem',
                      fontWeight:  300,
                      lineHeight:  1.75,
                      color:      'rgba(245,240,234,0.5)',
                    }}
                  >
                    {article.excerpt}
                  </p>
                </div>

                {/* ── Icon circle — always at bottom-left ── */}
                <div
                  style={{
                    position:       'absolute',
                    bottom:         '1.5rem',
                    left:           '1.2rem',
                    width:          '38px',
                    height:         '38px',
                    borderRadius:   '50%',
                    background:     'rgba(5,12,20,0.85)',
                    border:         `1.5px solid ${isActive ? 'rgba(196,163,90,0.55)' : 'rgba(196,163,90,0.2)'}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    transition:     `border-color 0.7s ${EASE}`,
                    pointerEvents:  'none',
                  }}
                >
                  {PANEL_ICONS[i]}
                </div>

                {/* ── Vertical category label (inactive only) ── */}
                <div
                  style={{
                    position:      'absolute',
                    bottom:        '5rem',
                    left:          '50%',
                    transform:     'translateX(-50%) rotate(-90deg)',
                    whiteSpace:    'nowrap',
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '0.48rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color:         'rgba(196,163,90,0.4)',
                    opacity:       isActive ? 0 : 1,
                    transition:    `opacity 0.4s ${EASE}`,
                    pointerEvents: 'none',
                  }}
                >
                  {article.category}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom hairline */}
        <div
          style={{
            height:     '1px',
            background: 'linear-gradient(to right, transparent, rgba(196,163,90,0.2), transparent)',
            marginTop:  '2px',
          }}
        />
      </div>
    </section>
  )
}
