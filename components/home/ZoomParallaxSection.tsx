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

/* Desktop: scattered collage layout — 8 images */
const DESKTOP_LAYOUT: React.CSSProperties[] = [
  /* 0: center — scales to cover full viewport */
  { position: 'absolute', top: '37.5vh', left: '37.5vw', width: '25vw', height: '25vh' },
  /* 1: top center */
  { position: 'absolute', top: '5vh',    left: '37.5vw', width: '30vw', height: '28vh' },
  /* 2: left side */
  { position: 'absolute', top: '17.5vh', left: '10vw',   width: '22vw', height: '42vh' },
  /* 3: right center */
  { position: 'absolute', top: '37.5vh', left: '65vw',   width: '22vw', height: '22vh' },
  /* 4: bottom center */
  { position: 'absolute', top: '65vh',   left: '42vw',   width: '20vw', height: '22vh' },
  /* 5: bottom left */
  { position: 'absolute', top: '62vh',   left: '8vw',    width: '30vw', height: '24vh' },
  /* 6: bottom right */
  { position: 'absolute', top: '65vh',   left: '68vw',   width: '18vw', height: '18vh' },
  /* 7: top right */
  { position: 'absolute', top: '8vh',    left: '72vw',   width: '18vw', height: '30vh' },
]

/* Mobile: 1 center image + 5 orbit images */
const MOBILE_LAYOUT: React.CSSProperties[] = [
  { position: 'absolute', top: '20vh', left: '10vw', width: '80vw', height: '60vh' },  // 0: center/main
  { position: 'absolute', top: '6vh',  left: '6vw',  width: '38vw', height: '20vh' },  // 1: top left
  { position: 'absolute', top: '6vh',  left: '56vw', width: '38vw', height: '20vh' },  // 2: top right
  { position: 'absolute', top: '82vh', left: '20vw', width: '60vw', height: '16vh' },  // 3: bottom
  { position: 'absolute', top: '34vh', left: '4vw',  width: '28vw', height: '28vh' },  // 4: left
  { position: 'absolute', top: '34vh', left: '68vw', width: '28vw', height: '28vh' },  // 5: right
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
    ? [scale4, scale4, scale4, scale4, scale4, scale4]
    : [scale6, scale5, scale5, scale4, scale4, scale4, scale4, scale5]

  const images = isMobile ? IMAGES.slice(0, 6) : IMAGES
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
