'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Star, Target, Crown, Scissors, Gem, Layers, Sparkles, Ruler } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const CSS = `
  @keyframes mf-cr-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .mf-cr-marquee { animation: mf-cr-marquee 40s linear infinite; }
`

const FABRIC_HOUSES = [
  { name: 'Holland & Sherry', icon: Scissors },
  { name: 'Scabal',           icon: Gem       },
  { name: 'Loro Piana',       icon: Layers    },
  { name: 'Dormeuil',         icon: Star      },
  { name: 'VBC',              icon: Sparkles  },
  { name: 'Drapers',          icon: Ruler     },
]

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
      fontWeight: 400,
      color: 'var(--color-offwhite)',
    }}>{value}</span>
    <span style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '0.52rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(196,163,90,0.45)',
      marginTop: '0.25rem',
    }}>{label}</span>
  </div>
)

export function CredencialesSection() {
  const { t } = useI18n()
  const c = t.servicios.credenciales
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-cr-lhs > *', {
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
      gsap.from('.mf-cr-card', {
        x: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: 'var(--color-navy)',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Radial gold glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 80% at 72% 50%, rgba(196,163,90,0.04) 0%, transparent 100%)',
      }} />

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 'clamp(2.5rem, 5vw, 6rem)',
        alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Left column */}
        <div className="mf-cr-lhs" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(196,163,90,0.18)',
            background: 'rgba(196,163,90,0.06)',
            padding: '0.4rem 0.9rem',
            marginBottom: '1.8rem',
            width: 'fit-content',
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.52rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.7)',
            }}>{c.badge}</span>
            <Star style={{ width: '0.8rem', height: '0.8rem', color: 'var(--color-gold)', fill: 'var(--color-gold)' }} />
          </div>

          {/* Heading */}
          <h2 style={{ marginBottom: '1.8rem' }}>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--color-offwhite)',
              lineHeight: 1.05,
            }}>{c.headline1}</span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.4rem, 4.2vw, 4.2rem)',
              fontWeight: 400,
              color: 'var(--color-gold)',
              lineHeight: 1.05,
            }}>{c.headline2}</span>
          </h2>

          {/* Body */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.2vw, 0.96rem)',
            lineHeight: 1.85,
            color: 'rgba(245,240,234,0.42)',
            maxWidth: '44ch',
            marginBottom: '2.5rem',
          }}>{c.body}</p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/reservar" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem',
              background: 'var(--color-gold)',
              color: '#080808',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-gold)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold-light)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold)'
              el.style.transform = 'translateY(0)'
            }}>
              {c.btn_primary}
              <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
            </Link>

            <Link href="/la-sastreria" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem',
              background: 'transparent',
              color: 'rgba(245,240,234,0.7)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(245,240,234,0.18)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(245,240,234,0.5)'
              el.style.color = 'var(--color-offwhite)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(245,240,234,0.18)'
              el.style.color = 'rgba(245,240,234,0.7)'
            }}>
              {c.btn_secondary}
            </Link>
          </div>
        </div>

        {/* Right column — cards */}
        <div className="mf-cr-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Stats card */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1.5rem',
            border: '1px solid rgba(196,163,90,0.12)',
            background: 'rgba(255,255,255,0.04)',
            padding: '2rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 25px 60px rgba(5,12,20,0.6)',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '16rem', height: '16rem',
              borderRadius: '50%',
              background: 'rgba(196,163,90,0.04)',
              filter: 'blur(48px)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '3rem', height: '3rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0.75rem',
                  background: 'rgba(196,163,90,0.1)',
                  border: '1px solid rgba(196,163,90,0.2)',
                }}>
                  <Target style={{ width: '1.4rem', height: '1.4rem', color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '2.2rem',
                    fontWeight: 400,
                    color: 'var(--color-offwhite)',
                    lineHeight: 1,
                  }}>45+</div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(196,163,90,0.5)',
                    marginTop: '0.15rem',
                  }}>{c.stat1_label}</div>
                </div>
              </div>

              {/* Satisfaction bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'rgba(245,240,234,0.45)' }}>{c.satisfaction_label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'var(--color-offwhite)', fontWeight: 500 }}>98%</span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.07)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '98%', background: 'linear-gradient(to right, var(--color-gold), var(--color-gold-light))' }} />
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(196,163,90,0.1)', marginBottom: '1.25rem' }} />

              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr)', alignItems: 'center', textAlign: 'center' }}>
                <StatItem value={c.stat1_val} label={c.stat1_label} />
                <div style={{ width: '1px', height: '2.5rem', background: 'rgba(196,163,90,0.12)' }} />
                <StatItem value={c.stat2_val} label={c.stat2_label} />
                <div style={{ width: '1px', height: '2.5rem', background: 'rgba(196,163,90,0.12)' }} />
                <StatItem value={c.stat3_val} label={c.stat3_label} />
              </div>

              {/* Tag pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(196,163,90,0.15)',
                  background: 'rgba(196,163,90,0.05)',
                  padding: '0.3rem 0.75rem',
                }}>
                  <span style={{ position: 'relative', display: 'inline-flex', width: '0.5rem', height: '0.5rem' }}>
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(74,222,128,0.75)', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
                    }} />
                    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '0.5rem', height: '0.5rem', background: '#22c55e' }} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,234,0.6)' }}>Est. 1978</span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(196,163,90,0.15)',
                  background: 'rgba(196,163,90,0.05)',
                  padding: '0.3rem 0.75rem',
                }}>
                  <Crown style={{ width: '0.65rem', height: '0.65rem', color: 'var(--color-gold)' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,234,0.6)' }}>Maestro Sastre</span>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee card — fabric houses */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1.5rem',
            border: '1px solid rgba(196,163,90,0.12)',
            background: 'rgba(255,255,255,0.04)',
            padding: '1.5rem 0',
            backdropFilter: 'blur(16px)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.55rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(196,163,90,0.35)',
              paddingLeft: '2rem',
              marginBottom: '1.25rem',
            }}>
              Casas de tejido con las que trabajamos
            </p>

            <div style={{
              position: 'relative',
              display: 'flex',
              overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}>
              <div className="mf-cr-marquee" style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', paddingLeft: '1rem' }}>
                {[...FABRIC_HOUSES, ...FABRIC_HOUSES, ...FABRIC_HOUSES].map((house, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
                    <house.icon style={{ width: '1rem', height: '1rem', color: 'var(--color-gold)' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-offwhite)' }}>
                      {house.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
