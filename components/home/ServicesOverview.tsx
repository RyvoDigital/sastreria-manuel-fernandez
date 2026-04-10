'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Scissors, Heart, Settings, GraduationCap, Video } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const SERVICES = [
  {
    key: 'artisan',
    icon: Scissors,
    href: '/la-sastreria',
    label_es: 'Sastrería Artesanal',
    label_en: 'Artisan Tailoring',
    desc_es: 'Trajes hechos a mano desde cero, sin patrones industriales.',
    desc_en: 'Handmade suits from scratch, no industrial patterns.',
  },
  {
    key: 'weddings',
    icon: Heart,
    href: '/bodas-y-ceremonia',
    label_es: 'Bodas y Ceremonia',
    label_en: 'Weddings & Ceremony',
    desc_es: 'Trajes nupciales únicos: chaqué, frac, esmoquin.',
    desc_en: 'Unique wedding attire: morning coat, tailcoat, tuxedo.',
  },
  {
    key: 'configurator',
    icon: Settings,
    href: '/configurador',
    label_es: 'Configurador de Prendas',
    label_en: 'Garment Configurator',
    desc_es: 'Diseña tu traje paso a paso. Acceso con pago.',
    desc_en: 'Design your suit step by step. Paid access.',
  },
  {
    key: 'courses',
    icon: GraduationCap,
    href: '/cursos',
    label_es: 'Cursos Online',
    label_en: 'Online Courses',
    desc_es: 'Aprende técnicas de sastrería con video tutoriales.',
    desc_en: 'Learn tailoring techniques with video tutorials.',
  },
  {
    key: 'videocall',
    icon: Video,
    href: '/videollamada',
    label_es: 'Videollamadas',
    label_en: 'Video Consultations',
    desc_es: 'Asesoramiento personalizado a distancia. 20-25 min.',
    desc_en: 'Remote personalized advice. 20-25 min.',
  },
]

export function ServicesOverview() {
  const { locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const cards = sectionRef.current?.querySelectorAll('.service-card')
    if (cards) {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [isVisible])

  const t = {
    section_label: locale === 'es' ? 'Nuestros Servicios' : 'Our Services',
    section_title: locale === 'es' 
      ? 'Todo lo que ofrecemos' 
      : 'Everything we offer',
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
        position: 'relative',
      }}
    >
      {/* Decorative background element */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
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
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.section_label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
          }}>
            {t.section_title}
          </h2>
        </div>

        {/* Services grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {SERVICES.map((service) => {
            const Icon = service.icon
            const label = locale === 'es' ? service.label_es : service.label_en
            const desc = locale === 'es' ? service.desc_es : service.desc_en

            return (
              <Link
                key={service.key}
                href={service.href}
                className="service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '2rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A84C'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'rgba(0,0,0,0.3)'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #C9A84C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: '#C9A84C',
                }}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                {/* Label */}
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: '0 0 0.75rem 0',
                }}>
                  {label}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0,
                  flex: 1,
                }}>
                  {desc}
                </p>

                {/* Arrow */}
                <div style={{
                  marginTop: '1.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  {locale === 'es' ? 'Descubrir' : 'Discover'}
                  <span style={{ fontSize: '1.2rem' }}>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
