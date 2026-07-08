'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ─── Service images grouped by category ─────────────────────────────────── */

const SERVICE_GROUPS = [
  {
    name: 'Traje a Medida',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-artisan-suit.png',
    ],
  },
  {
    name: 'Blazer',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-blazer.png',
    ],
  },
  {
    name: 'Pantalón a Medida',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-shirts.png',
    ],
  },
  {
    name: 'Abrigo a Medida',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-artisan-coat.png',
    ],
  },
  {
    name: 'Traje de Novio',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-tuxedo.png',
    ],
  },
  {
    name: 'Arreglos',
    images: [
      'https://ik.imagekit.io/hvzm7siir/all-images/producto-stroller.png',
    ],
  },
]

/* ─── Photo card ─────────────────────────────────────────────────────────── */

function PhotoCard({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden"
      style={{
        borderRadius: '2px',
        boxShadow: '0 4px 20px rgba(5,12,20,0.15)',
        aspectRatio: '3 / 4',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function ServiciosMorphGallery() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section
      style={{
        background: 'var(--color-cream)',
        padding: 'clamp(4rem, 8vh, 7rem) var(--container-padding)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.58rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.7)',
            marginBottom: '1rem',
          }}
        >
          Galería de Servicios
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}
        >
          El Corte como Lenguaje
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            width: '40px',
            height: '1px',
            background: 'var(--color-gold)',
            margin: '0 auto',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Grouped photo grids */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(3rem, 5vh, 5rem)',
        }}
      >
        {SERVICE_GROUPS.map((group, gIndex) => (
          <div key={group.name}>
            {/* Group label */}
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 400,
                color: 'var(--color-navy)',
                marginBottom: '1.25rem',
                paddingLeft: '0.25rem',
              }}
            >
              {group.name}
            </motion.h3>

            {/* Photo grid for this group */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 22vw, 220px), 1fr))',
                gap: '0.75rem',
              }}
            >
              {group.images.map((src, i) => (
                <PhotoCard key={`${group.name}-${i}`} src={src} index={i + gIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
