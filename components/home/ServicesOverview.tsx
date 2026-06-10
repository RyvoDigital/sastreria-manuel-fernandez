'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Scissors, Heart, Briefcase, Box, Settings, GraduationCap, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import Image from 'next/image'

const SERVICES = [
  {
    key: 'sastreria',
    icon: Scissors,
    href: '/la-sastreria',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765778/fotos-web/01-atelier-canon/atelier-2026-04-24-005-0682.jpg',
  },
  {
    key: 'bodas',
    icon: Heart,
    href: '/bodas-y-ceremonia',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765793/fotos-web/01-atelier-canon/atelier-2026-04-24-009-0640.jpg',
  },
  {
    key: 'servicios',
    icon: Briefcase,
    href: '/servicios',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/tailor-workshop_rb0bcw',
  },
  {
    key: 'modelos3d',
    icon: Box,
    href: '/modelos-3d',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778764139/photos/IMG_0067_hlr9ym.jpg',
  },
  {
    key: 'configurador',
    icon: Settings,
    href: '/configurador',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0577_nokw47',
  },
  {
    key: 'cursos',
    icon: GraduationCap,
    href: '/cursos',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/atelier-tools_clirtk',
  },

  {
    key: 'contacto',
    icon: Mail,
    href: '/contacto',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778764246/photos/others/IMG_0734_ug3baf.jpg',
  },
]

export function ServicesOverview() {
  const { locale, t } = useI18n()
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
      { threshold: 0.15 }
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
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
    }
  }, [isVisible])

  const getLabel = (key: string) => {
    return (t.nav as Record<string, string>)[key] || key
  }

  const sectionTitle = locale === 'es'
    ? 'Experiencia Sartorial'
    : locale === 'en'
    ? 'Sartorial Experience'
    : locale === 'it'
    ? 'Esperienza Sartoriale'
    : 'Expérience Sartoriale'

  const sectionLabel = locale === 'es' ? 'Nuestros Servicios' : 'Our Services'
  const discoverLabel = locale === 'es' ? 'Descubrir' : 'Discover'

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
        position: 'relative',
      }}
    >
      {/* Decorative top line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 4rem)' }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {sectionLabel}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
          }}>
            {sectionTitle}
          </h2>
        </div>

        {/* 3x3 Grid of cards with images */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
        }}>
          {SERVICES.map((service) => {
            const Icon = service.icon
            const label = getLabel(service.key)

            return (
              <Link
                key={service.key}
                href={service.href}
                className="service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(201,168,76,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer',
                  opacity: 0,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'
                  const img = e.currentTarget.querySelector('.service-img') as HTMLElement
                  if (img) img.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  const img = e.currentTarget.querySelector('.service-img') as HTMLElement
                  if (img) img.style.transform = 'scale(1)'
                }}
              >
                {/* Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  background: '#050A10',
                }}>
                  <Image
                    src={service.image}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.7s ease',
                    }}
                    className="service-img"
                    unoptimized
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.2) 50%, transparent 100%)',
                  }} />

                  {/* Icon badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(10,22,40,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C9A84C',
                  }}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '0.02em',
                  }}>
                    {label}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    transition: 'gap 0.3s ease',
                  }} className="discover-text">
                    {discoverLabel}
                    <span style={{ fontSize: '0.9rem', transition: 'transform 0.3s ease' }} className="arrow-icon">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .service-card:hover .arrow-icon {
          transform: translateX(4px);
        }
        .service-card:hover .discover-text {
          gap: 0.6rem;
        }
        @media (max-width: 768px) {
          .service-card {
            grid-column: span 4 !important;
          }
        }
      `}</style>
    </section>
  )
}
