'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

const IMAGES = [
  '/photos/cutting-table.jpg',
  '/photos/madrid-tweed.jpg',
  '/photos/tailor-workshop.jpg',
  '/photos/sleeve-buttons.jpg',
  '/photos/velvet-lining.jpg',
  '/photos/mint-jacket-madrid.jpg',
  '/photos/blue-plaid-form.jpg',
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
        background: '#050C14',
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
        {IMAGES.map((src, index) => (
          <motion.div
            key={index}
            style={{
              scale:    scales[index],
              position: 'absolute',
              inset:    0,
              display:  'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <div style={IMAGE_LAYOUT[index]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Sastrería Manuel Fernández — imagen ${index + 1}`}
                style={{
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'cover',
                  filter:     'brightness(0.75) saturate(0.6)',
                  display:    'block',
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Dark vignette overlay — sits above images */}
        <div style={{
          position:   'absolute',
          inset:       0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(5,12,20,0.65) 100%)',
          pointerEvents: 'none',
          zIndex:      10,
        }} />

        {/* Edge darkening for cinematic frame */}
        <div style={{
          position:   'absolute',
          inset:       0,
          boxShadow:  'inset 0 0 160px rgba(5,12,20,0.5)',
          pointerEvents: 'none',
          zIndex:      11,
        }} />

      </div>
    </div>
  )
}
