'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797367/photos/IMG_0005_ujbv1u',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797479/photos/IMG_0051_pnrgli',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797479/photos/IMG_0057_qvaxlr',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797396/photos/IMG_0062_zdmgjx',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797426/photos/IMG_0067_hlr9ym',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797399/photos/IMG_7409_orkk1x',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797517/photos/IMG_7414_mcc9pi',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797485/photos/IMG_7511_l7ua4x',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797357/photos/IMG_7784_tdnkf6',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797522/photos/IMG_7789_z2y3hh',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797361/photos/IMG_9423_bn8baq',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797363/photos/IMG_9436_uyetr0',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797470/photos/IMG_9666_rvzpes',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797468/photos/IMG_9702_fryzdx',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797383/photos/IMG_9721_zxahxp',
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
