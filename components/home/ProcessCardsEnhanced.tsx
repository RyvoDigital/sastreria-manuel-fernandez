'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

const CARD_IMAGES = [
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/web_lista_images/home-selection_vsmq3j',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/web_lista_images/home-sartorial-interpretation_sdszvu',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto:best/f_auto/v1778765991/fotos-web/05-whatsapp/whatsapp-01.jpg',
]

const CSS = `
  @keyframes mf-pc-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mf-pc-card {
    opacity: 0;
  }
  .mf-pc-card.visible {
    animation: mf-pc-fade-up 0.7s ease-out forwards;
  }
`

interface CardProps {
  num: string
  title: string
  body: string
  image: string
  index: number
}

function SimpleProcessCard({ num, title, body, image, index }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="mf-pc-card"
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0A1628',
      }}
    >
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={image}
          alt={title}
          fill
          loading={index > 0 ? 'lazy' : 'eager'}
          style={{
            objectFit: 'cover',
            objectPosition: index === 1 ? 'bottom' : 'center',
            filter: 'brightness(0.45) saturate(0.6)',
          }}
          unoptimized
        />
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,22,40,0.35) 0%, rgba(10,22,40,0.6) 100%)',
      }} />

      {/* Ghost numeral */}
      <div style={{
        position: 'absolute',
        bottom: '-0.05em',
        right: '-0.02em',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(10rem, 30vw, 22rem)',
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: '-0.04em',
        color: 'rgba(201,168,76,0.07)',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {num}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        width: 'min(520px, 85vw)',
        padding: '2rem 0',
      }}>
        {/* Step label */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: '1.4rem',
          opacity: 0.8,
        }}>
          Paso {num}
        </div>

        {/* Gold rule */}
        <div style={{
          width: '40px',
          height: '1px',
          background: 'rgba(196,163,90,0.4)',
          margin: '0 auto 2rem',
        }} />

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.4rem, 8vw, 4rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          fontStyle: 'italic',
          marginBottom: '2rem',
        }}>
          {title}
        </h2>

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
          fontWeight: 300,
          lineHeight: 1.9,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '420px',
          margin: '0 auto',
        }}>
          {body}
        </p>

        {/* Step dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '3rem',
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: step === parseInt(num) ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: step === parseInt(num) ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        zIndex: 2,
      }} />

      {/* Step counter */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        right: 'clamp(1.5rem, 4vw, 4rem)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.52rem',
        letterSpacing: '0.25em',
        color: 'rgba(201,168,76,0.5)',
        zIndex: 3,
        textTransform: 'uppercase',
      }}>
        {num} / 03
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        background: '#C9A84C',
        width: `${(parseInt(num) / 3) * 100}%`,
        zIndex: 4,
      }} />
    </div>
  )
}

export function ProcessCardsEnhanced() {
  const { t } = useI18n()
  const isMobile = useIsMobile()

  const steps = [
    { num: t.proceso.step1_num, title: t.proceso.step1_title, body: t.proceso.step1_body },
    { num: t.proceso.step2_num, title: t.proceso.step2_title, body: t.proceso.step2_body },
    { num: t.proceso.step3_num, title: t.proceso.step3_title, body: t.proceso.step3_body },
  ]

  return (
    <section style={{ background: '#0A1628' }}>
      <style>{CSS}</style>
      {steps.map((step, i) => (
        <SimpleProcessCard
          key={i}
          num={step.num}
          title={step.title}
          body={step.body}
          image={CARD_IMAGES[i]}
          index={i}
        />
      ))}
    </section>
  )
}
