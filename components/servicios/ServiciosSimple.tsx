'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

const SERVICES = [
  {
    num: '01',
    title_es: 'Frac',
    title_en: 'Tailcoat',
    desc_es: 'La máxima expresión de la elegancia ceremonial. Confección artesanal para las ocasiones más formales.',
    desc_en: 'The ultimate expression of ceremonial elegance. Artisan construction for the most formal occasions.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471223/photos/others/IMG_0387_hqnum4',
  },
  {
    num: '02',
    title_es: 'Chaqué',
    title_en: 'Morning Coat',
    desc_es: 'El traje de día por excelencia. Elegancia clásica para bodas matutinas y eventos de alto standing.',
    desc_en: 'The quintessential day suit. Classic elegance for morning weddings and high-standing events.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471120/photos/others/IMG_1044_dkkcri',
  },
  {
    num: '03',
    title_es: 'Smoking',
    title_en: 'Tuxedo',
    desc_es: 'Elegancia nocturna sin concesiones. Para cenas de gala, ópera y eventos donde solo lo excepcional basta.',
    desc_en: 'Uncompromising evening elegance. For gala dinners, opera, and events where only the exceptional will do.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471209/photos/others/IMG_1316_ivo6wg',
  },
  {
    num: '04',
    title_es: 'Traje Artesanal',
    title_en: 'Bespoke Suit',
    desc_es: 'Cada traje construido desde cero, sin patrones industriales. Entretela cosida a mano, solapa que cae sola, ajuste perfecto.',
    desc_en: 'Each suit built from scratch, no industrial patterns. Hand-sewn canvas, natural lapel fall, perfect fit.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471166/photos/others/IMG_0121_jbgi0j',
  },
  {
    num: '05',
    title_es: 'Abrigo Artesanal',
    title_en: 'Bespoke Overcoat',
    desc_es: 'Protección elegante contra el frío. Tejidos pesados de las mejores casas inglesas e italianas.',
    desc_en: 'Elegant protection against the cold. Heavy fabrics from the finest English and Italian mills.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471159/photos/others/IMG_0096_d9ctv7',
  },
  {
    num: '06',
    title_es: 'Blazer',
    title_en: 'Blazer',
    desc_es: 'Versatilidad sin compromiso. Tejidos exclusivos para cada ocasión, desde lo más casual hasta lo semi-formal.',
    desc_en: 'Versatility without compromise. Exclusive fabrics for every occasion, from casual to semi-formal.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797472/photos/wedding-groom-detail_akayli',
  },
  {
    num: '07',
    title_es: 'Camisas',
    title_en: 'Shirts',
    desc_es: 'La segunda piel del caballero. Confección a medida con telas de las mejores hilanderías del mundo.',
    desc_en: "The gentleman's second skin. Bespoke construction with fabrics from the world's finest mills.",
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471144/photos/others/IMG_6589_khncrc',
  },
  {
    num: '08',
    title_es: 'Pantalones Sport',
    title_en: 'Sport Trousers',
    desc_es: 'El complemento esencial. Corte preciso, caída perfecta, confección que respira con el movimiento.',
    desc_en: 'The essential complement. Precise cut, perfect drape, construction that moves with you.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471174/photos/others/IMG_0694_gcpuv3',
  },
  {
    num: '09',
    title_es: 'Chalecos',
    title_en: 'Waistcoats',
    desc_es: 'La capa intermedia que eleva cualquier conjunto. Tejidos exclusivos, forros personalizados, ajuste impecable.',
    desc_en: 'The middle layer that elevates any ensemble. Exclusive fabrics, custom linings, impeccable fit.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471138/photos/others/IMG_0139_pkwt80',
  },
  {
    num: '10',
    title_es: 'Arreglos a Medida',
    title_en: 'Bespoke Alterations',
    desc_es: 'Damos nueva vida a prendas existentes. Ajustes precisos, reparaciones que duran, modernización con respeto.',
    desc_en: 'We give new life to existing garments. Precise adjustments, lasting repairs, respectful modernization.',
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471155/photos/others/IMG_9461_nskjt7',
  },
]

export function ServiciosSimple() {
  const { locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = sectionRef.current?.querySelectorAll('.service-card')
    if (!cards) return

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  const t = {
    label: locale === 'es' ? 'Nuestros Servicios' : 'Our Services',
    title: locale === 'es' ? 'El Corte como Lenguaje' : 'The Cut as Language',
    subtitle: locale === 'es'
      ? 'Todo hecho a mano. Sin patrones industriales.'
      : 'All handmade. No industrial patterns.',
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
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
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#0A1628',
            margin: '0 0 1rem 0',
          }}>
            {t.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: 300,
            color: 'rgba(10,22,40,0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {t.subtitle}
          </p>
        </div>

        {/* Services list - clean, direct format */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {SERVICES.map((service, index) => {
            const title = locale === 'es' ? service.title_es : service.title_en
            const desc = locale === 'es' ? service.desc_es : service.desc_en
            const isActive = activeIndex === index

            return (
              <div
                key={service.num}
                className="service-card"
                onMouseEnter={() => setActiveIndex(index)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '2rem',
                  alignItems: 'center',
                  padding: '2rem',
                  background: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderLeft: isActive ? '3px solid #C9A84C' : '1px solid rgba(201,168,76,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                }}
              >
                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  color: '#C9A84C',
                  minWidth: '40px',
                }}>
                  {service.num}
                </div>

                {/* Content */}
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    fontWeight: 400,
                    color: '#0A1628',
                    margin: '0 0 0.5rem 0',
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: 'rgba(10,22,40,0.6)',
                    margin: 0,
                    maxWidth: '600px',
                  }}>
                    {desc}
                  </p>
                </div>

                {/* Thumbnail - shows on hover/active */}
                <div style={{
                  width: '120px',
                  height: '80px',
                  overflow: 'hidden',
                  opacity: isActive ? 1 : 0.3,
                  transition: 'opacity 0.3s ease',
                  display: isMobile ? 'none' : 'block',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'saturate(0.7)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem',
          border: '1px solid rgba(201,168,76,0.2)',
          background: '#0A1628',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 1rem 0',
          }}>
            {locale === 'es'
              ? 'We are a real artisan tailor — everything handmade, no industrial patterns, no prior fitting, each garment built from scratch'
              : 'We are a real artisan tailor — everything handmade, no industrial patterns, no prior fitting, each garment built from scratch'}
          </p>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}>
            — Sastrería Manuel Fernández
          </div>
        </div>
      </div>
    </section>
  )
}
