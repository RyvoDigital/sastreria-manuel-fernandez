'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const IMAGES = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797447/photos/cutting-table_pgugkd',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471160/photos/others/IMG_0860_vevl7m',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797507/photos/tailor-workshop_rb0bcw',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797375/photos/atelier-workshop_n5x6ce',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797445/photos/sleeve-buttons_drh2px',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797382/photos/velvet-lining_ukeflq',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471107/photos/others/IMG_0945_tkw7o1',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471081/photos/others/IMG_7034_urbpjv',
]

/*
 * Absolute positions calculated from the original component's flex-center + offset model:
 *   natural_top  = (100vh - height) / 2   (flex vertical center)
 *   natural_left = (100vw - width)  / 2   (flex horizontal center)
 *   final        = natural + per-index offset from original Tailwind classes
 *
 * Index 0 center lands exactly at (50vw, 50vh) — the scale transform-origin —
 * so it stays centered and grows toward the viewer while all others fly off-screen.
 */
const IMAGE_LAYOUT: React.CSSProperties[] = [
  /* 0 — CENTER zoom target: natural (37.5vh, 37.5vw), no offset */
  { position: 'absolute', top: '37.5vh', left: '37.5vw', width: '25vw', height: '25vh' },
  /* 1 — top-center-right: natural (35vh, 32.5vw) + offset (-30vh, +5vw) */
  { position: 'absolute', top: '5vh',    left: '37.5vw', width: '35vw', height: '30vh' },
  /* 2 — left-mid: natural (27.5vh, 40vw) + offset (-10vh, -25vw) */
  { position: 'absolute', top: '17.5vh', left: '15vw',   width: '20vw', height: '45vh' },
  /* 3 — right-center: natural (37.5vh, 37.5vw) + offset (0, +27.5vw) */
  { position: 'absolute', top: '37.5vh', left: '65vw',   width: '25vw', height: '25vh' },
  /* 4 — bottom-center-right: natural (37.5vh, 40vw) + offset (+27.5vh, +5vw) */
  { position: 'absolute', top: '65vh',   left: '45vw',   width: '20vw', height: '25vh' },
  /* 5 — bottom-left: natural (37.5vh, 35vw) + offset (+27.5vh, -22.5vw) */
  { position: 'absolute', top: '65vh',   left: '12.5vw', width: '30vw', height: '25vh' },
  /* 6 — bottom-right: natural (42.5vh, 42.5vw) + offset (+22.5vh, +25vw) */
  { position: 'absolute', top: '65vh',   left: '67.5vw', width: '15vw', height: '15vh' },
]

export function ZoomParallaxSection() {
  const { t } = useI18n()
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div
      ref={container}
      style={{
        position:   'relative',
        height:     '300vh',
        background: '#0A1628',
      }}
    >
      {/* Sticky viewport */}
      <div style={{
        position: 'sticky',
        top:      0,
        height:   '100vh',
        overflow: 'hidden',
      }}>

        {/* Image layers */}
        {IMAGES.map((src, index) => {
          // Floating animation constants based on index
          const floatingDelay = index * 0.5
          const floatingDuration = 3 + (index % 3)
          
          return (
            <motion.div
              key={index}
              style={{
                scale:    scales[index],
                position: 'absolute',
                inset:    0,
                display:  'flex',
                alignItems:     'center',
                justifyContent: 'center',
                zIndex: index === 0 ? 5 : 1, // Center image stays prominent
              }}
            >
              <motion.div 
                style={IMAGE_LAYOUT[index]}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 5, 0],
                  rotate: [0, 1, 0]
                }}
                transition={{
                  duration: floatingDuration,
                  repeat: Infinity,
                  delay: floatingDelay,
                  ease: "easeInOut"
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${t.zoom_parallax.alt} ${index + 1}`}
                    style={{
                      width:      '100%',
                      height:     '100%',
                      objectFit:  'cover',
                      filter:     index === 0 ? 'brightness(0.9)' : 'brightness(0.6) saturate(0.4)',
                      display:    'block',
                      transition: 'filter 0.5s ease',
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )
        })}

        {/* Dark vignette overlay — sits above images */}
        <div style={{
          position:   'absolute',
          inset:       0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(10,22,40,0.7) 100%)',
          pointerEvents: 'none',
          zIndex:      10,
        }} />

        {/* Edge darkening for cinematic frame */}
        <div style={{
          position:   'absolute',
          inset:       0,
          boxShadow:  'inset 0 0 160px rgba(10,22,40,0.6)',
          pointerEvents: 'none',
          zIndex:      11,
        }} />

      </div>
    </div>
  )
}
