'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

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

/* Desktop: scattered collage layout */
const DESKTOP_LAYOUT: React.CSSProperties[] = [
  { position: 'absolute', top: '37.5vh', left: '37.5vw', width: '25vw', height: '25vh' },
  { position: 'absolute', top: '5vh',    left: '37.5vw', width: '35vw', height: '30vh' },
  { position: 'absolute', top: '17.5vh', left: '15vw',   width: '20vw', height: '45vh' },
  { position: 'absolute', top: '37.5vh', left: '65vw',   width: '25vw', height: '25vh' },
  { position: 'absolute', top: '65vh',   left: '45vw',   width: '20vw', height: '25vh' },
  { position: 'absolute', top: '65vh',   left: '12.5vw', width: '30vw', height: '25vh' },
  { position: 'absolute', top: '65vh',   left: '67.5vw', width: '15vw', height: '15vh' },
]

/* Mobile: simple 2x2 grid, fewer images */
const MOBILE_LAYOUT: React.CSSProperties[] = [
  { position: 'absolute', top: '10vh', left: '5vw',  width: '42vw', height: '30vh' },
  { position: 'absolute', top: '10vh', left: '53vw', width: '42vw', height: '30vh' },
  { position: 'absolute', top: '48vh', left: '5vw',  width: '42vw', height: '30vh' },
  { position: 'absolute', top: '48vh', left: '53vw', width: '42vw', height: '30vh' },
]

export function ZoomParallaxSection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])

  const scales = isMobile
    ? [scale4, scale4, scale4, scale4]
    : [scale4, scale5, scale6, scale5, scale6, scale4, scale4]

  const images = isMobile ? IMAGES.slice(0, 4) : IMAGES
  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT

  return (
    <div
      ref={container}
      style={{
        position:   'relative',
        height:     isMobile ? '150vh' : '300vh',
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
        {images.map((src, index) => {
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
                zIndex: index === 0 ? 5 : 1,
              }}
            >
              <motion.div 
                style={layout[index]}
                animate={isMobile ? undefined : {
                  y: [0, -15, 0],
                  x: [0, 5, 0],
                  rotate: [0, 1, 0]
                }}
                transition={isMobile ? undefined : {
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
                  borderRadius: isMobile ? '8px' : '4px',
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

        {/* Dark vignette overlay */}
        <div style={{
          position:   'absolute',
          inset:       0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(10,22,40,0.7) 100%)',
          pointerEvents: 'none',
          zIndex:      10,
        }} />

        {/* Edge darkening */}
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
