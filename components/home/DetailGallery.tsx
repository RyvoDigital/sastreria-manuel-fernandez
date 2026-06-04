'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/03-screenshots/screenshot-06',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-unknown-014-0631',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/02-ai-promo/promo-ai-05',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2012-04-22-001-9645',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-unknown-006-0582',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2026-04-24-010-0677',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2026-04-24-004-0661',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2012-10-22-001-1550',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2012-10-01-002-1477',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/fotos-web/01-atelier-canon/atelier-2012-08-06-010-0971',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/IMG_7511_l7ua4x',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/atelier-tools_clirtk',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/IMG_7409_orkk1x',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/IMG_7784_tdnkf6',
]

export function DetailGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section 
      style={{ 
        padding: '1rem 0',
        background: '#050C14',
        overflow: 'hidden',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      {/* Horizontal Marquee */}
      <div 
        className="marquee-container"
        style={{
          display: 'flex',
          gap: '1rem',
          width: 'max-content',
        }}
      >
        <motion.div
          animate={{ x: [0, -4650] }} // 15 images * 310px (width+gap)
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            display: 'flex',
            gap: '1rem',
            willChange: 'transform',
          }}
        >
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div 
              key={i}
              style={{
                width: '300px',
                height: '400px',
                position: 'relative',
                flexShrink: 0,
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={src} 
                alt={`Detail ${i}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7)',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(5,12,20,0.8) 100%)',
              }} />
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .marquee-container:hover .motion-div {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
