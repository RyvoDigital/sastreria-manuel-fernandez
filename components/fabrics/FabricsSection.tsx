'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import { Eye, Leaf, Award, Hand } from 'lucide-react'


const CONTENT_BLOCKS = [
  { id: 'visual' as const, icon: Eye, image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242028/photos/web_lista_images/home-visual_xki5xz', span: 4 },
  { id: 'origins' as const, icon: Leaf, image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242088/photos/web_lista_images/home-origin_xacgvx', span: 2 },
  { id: 'grading' as const, icon: Award, image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242106/photos/web_lista_images/home-the-process_qjrutl', span: 2 },
  { id: 'selection' as const, icon: Hand, image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242036/photos/web_lista_images/home-selection_vsmq3j', span: 4 },
]

export function FabricsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from('.mf-fabrics-block', {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [])


  return (
    <section
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
        position: 'relative',
      }}
    >
      {/* Top gold line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
      }} />

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.fabrics.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#0A1628',
            margin: '0 0 1rem 0',
          }}>
            {t.fabrics.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            lineHeight: 1.6,
            color: 'rgba(10,22,40,0.6)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {t.fabrics.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
          gap: isMobile ? '1rem' : '1.5rem',
          marginBottom: '3rem',
        }}>
          {CONTENT_BLOCKS.map((block) => {
            const Icon = block.icon
            const { title, desc } = t.fabrics.items[block.id]

            return (
              <motion.div
                key={block.id}
                className="mf-fabrics-block"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  gridColumn: isMobile ? 'span 1' : `span ${block.span}`,
                  minHeight: isMobile ? '280px' : '380px',
                  padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                  background: '#0B1522',
                  border: '1px solid rgba(201,168,76,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                {/* Background Image */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  transition: 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)',
                }} className="card-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={block.image} 
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.4) saturate(0.8)',
                    }}
                  />
                </div>

                <style>{`
                  .mf-fabrics-block:hover .card-bg {
                    transform: scale(1.08);
                  }
                `}</style>

                {/* Content Overlay */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.15)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.3)',
                  }}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: isMobile ? '1.5rem' : '1.8rem',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: '0 0 1rem 0',
                    fontStyle: 'italic',
                  }}>
                    {title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                    maxWidth: '400px',
                  }}>
                    {desc}
                  </p>
                </div>
                
                {/* Hover border glow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid #C9A84C',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                }} className="hover-border" />

                <style>{`
                  .mf-fabrics-block:hover .hover-border {
                    opacity: 0.3;
                  }
                `}</style>
              </motion.div>
            )
          })}
        </div>

        {/* Values Banner */}
        <div style={{
          padding: '4rem 2rem',
          background: '#FFFFFF',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Decorative fibers bg */}
          {(() => {
            const DecorativeIcon = Leaf
            return (
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: '10%',
                opacity: 0.05,
                userSelect: 'none',
                pointerEvents: 'none'
              }}>
                <DecorativeIcon size={120} color="#C9A84C" strokeWidth={0.5} />
              </div>
            )
          })()}

          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
            fontStyle: 'italic',
            color: '#0A1628',
            margin: '0 0 1rem 0',
            maxWidth: '800px',
            marginInline: 'auto'
          }}>
            {t.fabrics.values}
          </p>
          <div style={{
            width: '80px',
            height: '2px',
            background: '#C9A84C',
            margin: '0 auto',
          }} />
        </div>
      </div>
    </section>
  )
}
