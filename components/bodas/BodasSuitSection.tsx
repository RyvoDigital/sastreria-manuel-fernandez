'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

export function BodasSuitSection() {
  const { t, locale } = useI18n()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  const label = locale === 'es' ? 'Traje a Medida' : locale === 'en' ? 'Bespoke Suit' : locale === 'fr' ? 'Costume Sur Mesure' : 'Abito Su Misura'
  const title = locale === 'es' ? 'El traje que nace de ti' : locale === 'en' ? 'The suit born from you' : locale === 'fr' ? 'Le costume né de vous' : 'L\'abito nato da te'
  const body = locale === 'es'
    ? 'Para el novio que busca algo más que un traje. Cada detalle — solapa, botonadura, tejido — se decide contigo. Sin prisas, sin catálogos. Solo tú, tu historia y nuestras manos.'
    : locale === 'en'
    ? 'For the groom seeking more than a suit. Every detail — lapel, buttoning, fabric — is decided with you. No rush, no catalogues. Just you, your story, and our hands.'
    : locale === 'fr'
    ? 'Pour le marié qui cherche plus qu\'un costume. Chaque détail — revers, boutonnage, tissu — se décide avec vous. Sans hâte, sans catalogues. Juste vous, votre histoire et nos mains.'
    : 'Per lo sposo che cerca qualcosa di più di un abito. Ogni dettaglio — rever, bottonatura, tessuto — si decide con te. Senza fretta, senza cataloghi. Solo tu, la tua storia e le nostre mani.'

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-suit-content', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '50fr 50fr',
        gap: 'clamp(3rem, 6vw, 6rem)',
        alignItems: 'center',
      }}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          viewport={{ once: true }}
          style={{
            position: 'relative',
            height: isMobile ? '50vh' : '65vh',
            borderRadius: '1.5rem 1.5rem 0.5rem 0.5rem',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/web_lista_images/bodas-suit_m8cqj3"
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>

        {/* Text */}
        <div className="mf-suit-content">
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.75)',
            marginBottom: '1.5rem',
          }}>
            {label}
          </p>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}>
            {title}
          </h2>

          <div style={{
            width: '2.5rem', height: '1px',
            background: '#C9A84C',
            opacity: 0.5,
            marginBottom: '2rem',
          }} />

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
            lineHeight: 1.85,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '46ch',
          }}>
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}
