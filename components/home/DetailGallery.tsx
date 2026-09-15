'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  '/img/prenda-medida-etiqueta.webp',
  '/img/sastre-cortando-tela-mesa-exterior.webp',
  '/img/chaleco-verde-chaqueta-azul-showroom.webp',
  '/img/novios-chaque-coliseo-roma.webp',
  '/img/smoking-azul-forro-detalle.webp',
  '/img/prueba-traje-showroom.webp',
  '/img/cliente-bolsa-sastreria-jorge-juan.webp',
  '/img/americana-verde-menta-calle.webp',
  '/img/showroom-libros-tejidos.webp',
  '/img/herramientas-sastre-cinta-metrica.webp',
  '/img/toma-medidas-cliente.webp',
  '/img/chaqueta-verde-construccion-alfileres.webp',
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
