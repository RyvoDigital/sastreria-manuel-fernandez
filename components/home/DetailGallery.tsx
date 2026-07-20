'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-014-0631.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2012-04-22-001-9645.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-006-0582.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-010-0677.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-004-0661.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2012-10-22-001-1550.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2012-10-01-002-1477.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-2012-08-06-010-0971.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/IMG_7511.JPG',
  'https://ik.imagekit.io/hvzm7siir/all-images/atelier-tools.jpg',
  'https://ik.imagekit.io/hvzm7siir/all-images/IMG_7409.JPG',
  'https://ik.imagekit.io/hvzm7siir/all-images/IMG_7784.JPG',
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
