'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { Eye, Leaf, Award, Hand } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CONTENT_BLOCKS = [
  { id: 'visual' as const, icon: Eye },
  { id: 'origins' as const, icon: Leaf },
  { id: 'grading' as const, icon: Award },
  { id: 'selection' as const, icon: Hand },
]

export function FabricsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {CONTENT_BLOCKS.map((block) => {
            const Icon = block.icon
            const { title, desc } = t.fabrics.items[block.id]

            return (
              <motion.div
                key={block.id}
                className="mf-fabrics-block"
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  rotateY: -5,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  padding: '2.5rem 2rem',
                  background: '#FFFFFF',
                  border: '1px solid rgba(201,168,76,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  perspective: '1000px',
                }}
              >
                {/* Decorative fabric drape background element (blurred) */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-20%',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                  whileHover={{ scale: 1.5, opacity: 0.1 }}
                />

                {/* Icon */}
                <motion.div 
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '4px',
                    background: 'rgba(201,168,76,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.3)',
                  }}
                >
                  <Icon size={28} strokeWidth={1} />
                </motion.div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: '#0A1628',
                  margin: '0 0 1rem 0',
                }}>
                  {title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'rgba(10,22,40,0.6)',
                  margin: 0,
                }}>
                  {desc}
                </p>
                
                {/* Subtle gold accent line revealed on hover */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '40px' }}
                  style={{
                    height: '2px',
                    background: '#C9A84C',
                    marginTop: '1.5rem',
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Values Banner */}
        <div style={{
          padding: '2rem',
          background: '#0A1628',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 0.5rem 0',
          }}>
            {t.fabrics.values}
          </p>
          <div style={{
            width: '60px',
            height: '2px',
            background: '#C9A84C',
            margin: '0 auto',
          }} />
        </div>

        {/* Pending Assets Notice */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          border: '1px dashed rgba(201,168,76,0.4)',
          background: 'rgba(201,168,76,0.03)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'rgba(10,22,40,0.5)',
            margin: 0,
          }}>
            {t.fabrics.pending}
          </p>
        </div>
      </div>
    </section>
  )
}
