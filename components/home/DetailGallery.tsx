'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797367/cGhvdG9zL0lNR18wMDA1X3VqYnYxdQ==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797479/cGhvdG9zL0lNR18wMDUxX3BucmdsaQ==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797479/cGhvdG9zL0lNR18wMDU3X3F2YXhscg==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797396/cGhvdG9zL0lNR18wMDYyX3pkbWdqeA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797426/cGhvdG9zL0lNR18wMDY3X2hscjl5bQ==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797399/cGhvdG9zL0lNR183NDA5X29ya2sxeA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797517/cGhvdG9zL0lNR183NDE0X21jYzlwaQ==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797485/cGhvdG9zL0lNR183NTExX2w3dWE0eA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797357/cGhvdG9zL0lNR183Nzg0X3RkbmtmNg==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797522/cGhvdG9zL0lNR183Nzg5X3oyeTNoaA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797361/cGhvdG9zL0lNR185NDIzX2JuOGJhcQ==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797363/cGhvdG9zL0lNR185NDM2X3V5ZXRyMA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797470/cGhvdG9zL0lNR185NjY2X3J2enBlcw==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797468/cGhvdG9zL0lNR185NzAyX2ZyeXpkeA==',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797383/cGhvdG9zL0lNR185NzIxX3p4YWh4cA==',
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
