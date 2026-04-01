'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function ColeccionGrid() {
  const { t } = useI18n()
  const c = t.coleccion.grid
  const sectionRef = useRef<HTMLElement>(null)

  const items = [
    { src: '/photos/blue-plaid-form.jpg',      cat: c.item1_cat, name: c.item1_name },
    { src: '/photos/camel-jacket-form.jpg',    cat: c.item2_cat, name: c.item2_name },
    { src: '/photos/mint-jacket-madrid.jpg',   cat: c.item3_cat, name: c.item3_name },
    { src: '/photos/madrid-tweed.jpg',         cat: c.item4_cat, name: c.item4_name },
    { src: '/photos/wedding-morning-coat.jpg', cat: c.item5_cat, name: c.item5_name },
    { src: '/photos/gray-check-mannequin.jpg', cat: c.item6_cat, name: c.item6_name },
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-grid-card', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#F5F0EA',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
      }}
    >
      {/* Header */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto clamp(3rem, 5vh, 4.5rem)',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            lineHeight: 1.1,
          }}>
            {c.label}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.52rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.6)',
            marginTop: '0.4rem',
          }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '3px',
      }}>
        {items.map((item, i) => (
          <GridCard key={i} item={item} cta={c.cta} />
        ))}
      </div>
    </section>
  )
}

function GridCard({ item, cta }: { item: { src: string; cat: string; name: string }; cta: string }) {
  return (
    <div
      className="mf-grid-card"
      style={{
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Photo */}
      <div style={{
        aspectRatio: '3/4',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.6s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
        />
      </div>

      {/* Card info */}
      <div style={{
        padding: '1rem 1.1rem 1.25rem',
        borderTop: '1px solid rgba(5,12,20,0.06)',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.5rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.7)',
          marginBottom: '0.35rem',
        }}>
          {item.cat}
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
          fontWeight: 400,
          color: 'var(--color-navy)',
          marginBottom: '0.6rem',
          lineHeight: 1.2,
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.65)',
          cursor: 'default',
        }}>
          {cta} →
        </p>
      </div>
    </div>
  )
}
