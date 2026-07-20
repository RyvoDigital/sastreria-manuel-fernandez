'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'


const CATS = [
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/bodas-morning-coat.png', height: '46vh', key: 'cat1' as const },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-016-0634.jpg',    height: '63vh', key: 'cat2' as const },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/atelier-unknown-011-0620.jpg',        height: '63vh', key: 'cat4' as const },
  { src: 'https://ik.imagekit.io/hvzm7siir/all-images/wedding-tuxedo.jpg',   height: '46vh', key: 'cat3' as const },
]

export function BodasCategorias() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const c = t.bodas.categorias
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-bodas-cat-card', {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const labels: Record<string, string> = { cat1: c.cat1, cat2: c.cat2, cat3: c.cat3, cat4: c.cat4 }
  const descs: Record<string, string> = { cat1: c.cat1_desc, cat2: c.cat2_desc, cat3: c.cat3_desc, cat4: c.cat4_desc }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding: 'clamp(1rem, 2vh, 2rem) var(--container-padding) clamp(5rem, 10vh, 9rem)',
        overflow: 'hidden',
      }}
    >
      {/* Label */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.7)',
        }}>
          {c.label}
        </p>
      </div>

      {/* Photos — stack on mobile, row on desktop */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
        alignItems: isMobile ? 'stretch' : 'flex-end',
      }}>
        {CATS.map(({ src, height, key }) => (
          <div
            key={key}
            className="mf-bodas-cat-card"
            style={{
              flex: isMobile ? 'none' : (key === 'cat2' || key === 'cat4') ? '1.2' : '1',
              height: isMobile ? '480px' : height,
              position: 'relative',
              borderRadius: '1.5rem 1.5rem 0.5rem 0.5rem',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'box-shadow 0.4s ease, transform 0.4s ease',
              boxShadow: '0 20px 60px rgba(10,22,40,0.15)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-12px)'
              el.style.boxShadow = '0 40px 80px rgba(10,22,40,0.25)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 20px 60px rgba(5,12,20,0.15)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={labels[key]}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
              background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.4) 50%, transparent 100%)',
            }} />
            {/* Text */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: isMobile ? '1.25rem 1rem' : '1.5rem 1.25rem',
            }}>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: isMobile ? '0.55rem' : '0.5rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: '0.4rem',
              }}>
                {labels[key]}
              </p>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: isMobile ? '1rem' : 'clamp(0.85rem, 1.2vw, 1.05rem)',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.4,
              }}>
                {descs[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
