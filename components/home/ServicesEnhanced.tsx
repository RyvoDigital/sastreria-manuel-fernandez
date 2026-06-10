'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap-setup'
import { Scissors, Heart, Briefcase, Box, Settings, GraduationCap, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import Image from 'next/image'


const SERVICES = [
  {
    key: 'sastreria' as const,
    icon: Scissors,
    href: '/la-sastreria',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765778/fotos-web/01-atelier-canon/atelier-2026-04-24-005-0682.jpg',
  },
  {
    key: 'bodas' as const,
    icon: Heart,
    href: '/bodas-y-ceremonia',
      image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765793/fotos-web/01-atelier-canon/atelier-2026-04-24-009-0640.jpg',
  
  },
  {
    key: 'servicios' as const,
    icon: Briefcase,
    href: '/servicios',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/tailor-workshop_rb0bcw',
  },
  {
    key: 'modelos3d' as const,
    icon: Box,
    href: '/modelos-3d',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778764139/photos/IMG_0067_hlr9ym.jpg',
  },
  {
    key: 'configurador' as const,
    icon: Settings,
    href: '/configurador',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/fabric-consultation_vtqjmo',
  },
  {
    key: 'cursos' as const,
    icon: GraduationCap,
    href: '/cursos',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/atelier-tools_clirtk',
  },

  {
    key: 'contacto' as const,
    icon: Mail,
    href: '/contacto',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778764246/photos/others/IMG_0734_ug3baf.jpg',
  },
]

export function ServicesEnhanced() {
  const { t, locale } = useI18n()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        '.service-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getLabel = (key: string) => {
    return (t.nav as Record<string, string>)[key] || key
  }

  const discoverLabel = locale === 'es' ? 'Descubrir' : locale === 'en' ? 'Discover' : locale === 'it' ? 'Scopri' : 'Découvrir'

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(201,168,76,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201,168,76,0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Section header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 5vw, 4rem)',
            opacity: 0,
          }}
        >
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.home_services.section_label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
          }}>
            {t.home_services.section_title}
          </h2>
        </div>

        {/* 3x3 Grid of image cards — stacks on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '1rem' : '1.25rem',
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
                  aspectRatio: isMobile ? '16/9' : '16/10',
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
                  }}>
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
      `}</style>
    </section>
  )
}
