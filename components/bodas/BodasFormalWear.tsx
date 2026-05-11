'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function BodasFormalWear() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  // Get the formal wear and accessories from translations
  const fw = (t.bodas as Record<string, unknown>)?.formal_wear as { label: string; title: string; items: string[] } | undefined
  const acc = (t.bodas as Record<string, unknown>)?.accesorios as { label: string; title: string; items: string[] } | undefined
  const keyMessage = ((t.bodas as Record<string, unknown>)?.key_message as string) || ''

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from('.mf-formal-block', {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  if (!fw || !acc) return null

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
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
        {/* Section header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {locale === 'es' ? 'Vestimenta & Accesorios' : 'Formal Wear & Accessories'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 1.5rem 0',
          }}>
            {fw.title}
          </h2>
        </div>

        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          marginBottom: '4rem',
        }}>
          {/* Formal Wear */}
          <div className="mf-formal-block" style={{
            padding: '2.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
            }}>
              {fw.label}
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {fw.items.map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                  color: '#FFFFFF',
                }}>
                  <Check size={18} color="#C9A84C" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Accessories */}
          <div className="mf-formal-block" style={{
            padding: '2.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
            }}>
              {acc.label}
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              {acc.items.map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.85)',
                }}>
                  <Check size={14} color="#C9A84C" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Message */}
        <div className="mf-formal-block" style={{
          textAlign: 'center',
          padding: '2.5rem',
          border: '2px solid #C9A84C',
          background: 'rgba(201,168,76,0.05)',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.4,
          }}>
            {keyMessage}
          </p>
        </div>
      </div>
    </section>
  )
}
