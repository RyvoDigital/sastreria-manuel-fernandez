'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { Scissors, Heart, Settings, GraduationCap, Video } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    key: 'artisan' as const,
    icon: Scissors,
    href: '/la-sastreria',
  },
  {
    key: 'weddings' as const,
    icon: Heart,
    href: '/bodas-y-ceremonia',
  },
  {
    key: 'configurator' as const,
    icon: Settings,
    href: '/configurador',
  },
  {
    key: 'courses' as const,
    icon: GraduationCap,
    href: '/cursos',
  },
  {
    key: 'videocall' as const,
    icon: Video,
    href: '/videollamada',
  },
]

// 3D Tilt Card Component
function TiltCard({ 
  service, 
  index,
  t 
}: { 
  service: typeof SERVICES[0]
  index: number
  t: any
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const iconRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Calculate tilt (-15 to 15 degrees)
    const tiltX = (y - 0.5) * -20
    const tiltY = (x - 0.5) * 20

    setTilt({ x: tiltX, y: tiltY })
    setGlowPosition({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const { label, desc } = t.home_services.items[service.key]

  // SVG Path data for icons
  const iconPaths: Record<string, string[]> = {
    artisan: [
      "M6 6 L18 18", "M18 6 L6 18", // Simplified Scissors-like X
      "M6 6 A3 3 0 1 0 6 12 A3 3 0 1 0 6 6", // Left handle
      "M18 6 A3 3 0 1 1 18 12 A3 3 0 1 1 18 6" // Right handle
    ],
    weddings: ["M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"],
    configurator: ["M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"],
    courses: ["M22 10v6M2 10l10-5 10 5-10 5z", "M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"],
    videocall: ["m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11", "M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"]
  }

  return (
    <Link
      ref={cardRef}
      href={service.href}
      className="service-card"
      style={{
        gridColumn: service.key === 'artisan' || service.key === 'weddings' ? 'span 3' : 'span 2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: service.key === 'artisan' || service.key === 'weddings' ? '3rem' : '2.5rem',
        background: service.key === 'courses' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: '4px',
        textDecoration: 'none',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Background image for specific cards (e.g. Courses) to make them stand out */}
      {service.key === 'courses' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: isHovered ? 0.4 : 0.25,
          transition: 'opacity 0.3s ease',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797480/cGhvdG9zL2ZhYnJpYy1jb25zdWx0YXRpb25fdnRxam1v" 
            alt="Courses background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }} 
          />
        </div>
      )}

      {/* Glow effect following cursor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(201,168,76,0.15) 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Border glow on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '4px',
          border: '1px solid rgba(201,168,76,0.3)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          boxShadow: isHovered ? '0 0 30px rgba(201,168,76,0.2), inset 0 0 30px rgba(201,168,76,0.05)' : 'none',
        }}
      />

      {/* Icon with animation */}
      <div
        ref={iconRef}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '1px solid #C9A84C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: '#C9A84C',
          transform: 'translateZ(30px)',
          transition: 'box-shadow 0.3s ease',
          boxShadow: isHovered ? '0 0 20px rgba(201,168,76,0.3)' : 'none',
        }}
      >
        <motion.svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {iconPaths[service.key].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              initial={{ pathLength: 1 }}
              animate={{ 
                pathLength: isHovered ? [0, 1] : 1,
                opacity: isHovered ? [0, 1] : 1
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut",
                delay: isHovered ? i * 0.1 : 0
              }}
            />
          ))}
        </motion.svg>
      </div>

      {/* Label */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.5rem',
        fontWeight: 400,
        color: '#FFFFFF',
        margin: '0 0 0.75rem 0',
        transform: 'translateZ(20px)',
      }}>
        {label}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.95rem',
        fontWeight: 300,
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.65)',
        margin: 0,
        flex: 1,
        transform: 'translateZ(15px)',
      }}>
        {desc}
      </p>

      {/* Arrow with hover animation */}
      <div
        style={{
          marginTop: '2rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transform: `translateX(${isHovered ? 8 : 0}px) translateZ(25px)`,
          transition: 'transform 0.3s ease',
        }}
      >
        {t.home_services.discover}
        <span style={{ fontSize: '1.2rem' }}>→</span>
      </div>

      {/* Corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, transparent 50%, rgba(201,168,76,0.1) 50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Link>
  )
}

export function ServicesEnhanced() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Cards stagger animation
      gsap.fromTo(
        '.service-card',
        { y: 80, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
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

  const t_local = {
    section_label: t.home_services.section_label,
    section_title: t.home_services.section_title,
  }

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
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Section header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
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
            {t_local.section_label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
          }}>
            {t_local.section_title}
          </h2>
        </div>

        {/* Modernized grid layout (2 large + 3 regular) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '2rem',
          perspective: '1000px',
        }}>
          {SERVICES.map((service, index) => (
            <TiltCard
              key={service.key}
              service={service}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
