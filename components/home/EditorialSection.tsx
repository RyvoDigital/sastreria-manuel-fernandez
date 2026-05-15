'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import { BookOpen } from 'lucide-react'


export function EditorialSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      )

      gsap.from('.editorial-card', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.editorial-grid',
          start: 'top 80%',
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Dynamic grid spans for 5 articles
  const spans = [4, 2, 2, 4, 6]

  return (
    <section 
      ref={sectionRef}
      style={{
        padding: 'clamp(6rem, 12vw, 10rem) var(--container-padding)',
        background: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Section Header */}
        <div ref={headerRef} style={{ marginBottom: '4rem', maxWidth: '600px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 400,
            color: '#0A1628',
            lineHeight: 1.1,
            fontStyle: 'italic',
          }}>
            {t.editorial.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: 'rgba(10,22,40,0.55)',
            margin: '1rem 0 0 0',
            maxWidth: '480px',
          }}>
            {t.editorial.label}
          </p>
        </div>

        {/* Modernized Bento Grid */}
        <div 
          className="editorial-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
          }}
        >
          {t.editorial.articles.map((article: any, index: number) => (
            <motion.div
              key={index}
              className="editorial-card"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                gridColumn: isMobile ? 'span 1' : `span ${spans[index] || 2}`,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '1rem' : '1.5rem',
                padding: isMobile ? '1.75rem 1.5rem' : '3rem 2.5rem',
                background: index % 2 === 0 ? '#F9F7F2' : '#FFFFFF',
                border: '1px solid rgba(10,22,40,0.05)',
                position: 'relative',
                cursor: 'default',
                borderRadius: '4px',
                minHeight: isMobile ? 'auto' : index === 4 ? 'auto' : '320px',
                justifyContent: 'center',
              }}
            >
              {/* Category & Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? '0.6rem' : '0.55rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                }}>
                  {article.category}
                </div>
                <BookOpen size={isMobile ? 16 : 14} style={{ color: 'rgba(201,168,76,0.5)' }} />
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? '1.3rem' : spans[index] === 4 ? '1.8rem' : '1.4rem',
                fontWeight: 400,
                color: '#0A1628',
                lineHeight: 1.2,
                fontStyle: 'italic',
                margin: 0,
              }}>
                {article.title}
              </h3>

              {/* Excerpt */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                lineHeight: 1.7,
                color: 'rgba(10,22,40,0.6)',
                margin: 0,
                maxWidth: '90%',
              }}>
                {article.excerpt}
              </p>

              {/* Background watermark */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? '3rem' : '4rem',
                color: 'rgba(201,168,76,0.03)',
                pointerEvents: 'none',
              }}>
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
