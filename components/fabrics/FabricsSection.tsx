'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { Eye, Leaf, Award, Hand } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CONTENT_BLOCKS = [
  {
    id: 'visual',
    icon: Eye,
    title_es: 'Visual',
    title_en: 'Visual',
    desc_es: 'Fotografías macro de texturas de tejidos; procesos naturales (ovejas, cabras, fibra cruda, hilado).',
    desc_en: 'Macro photography of fabric textures; natural processes (sheep, goats, raw fibre, spinning).',
  },
  {
    id: 'origins',
    icon: Leaf,
    title_es: 'Origen',
    title_en: 'Origin',
    desc_es: 'Cómo se obtiene cada fibra: Lana, Cachemira, Seda, Vicuña — énfasis en singularidad (agua, temperatura, terreno).',
    desc_en: 'How each fibre is obtained: Wool, Cashmere, Silk, Vicuña — emphasis on uniqueness (water, temperature, terrain).',
  },
  {
    id: 'grading',
    icon: Award,
    title_es: 'Graduación',
    title_en: 'Grading',
    desc_es: 'Explicación de Super 100 / 120 / 150 / 200 — qué significa cada uno, cómo afecta la calidad.',
    desc_en: 'Explanation of Super 100 / 120 / 150 / 200 — what each means, how it affects quality.',
  },
  {
    id: 'selection',
    icon: Hand,
    title_es: 'Selección',
    title_en: 'Selection',
    desc_es: 'Cómo se selecciona cada fibra a mano — enfoque artesanal en la selección de materiales.',
    desc_en: 'How each fibre is hand-selected — artisan approach to material selection.',
  },
]

export function FabricsSection() {
  const { locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from('.mf-fabrics-block', {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const t = {
    es: {
      label: 'Los Tejidos',
      title: 'Sensory, educativo y aspiracional',
      subtitle: 'Ayudamos a los clientes a entender y desear el material. Cada fibra cuenta una historia de origen, selección y artesanía.',
      values: 'Valores de marca: Sostenibilidad, selección artesanal, exclusividad material',
      pending: 'Imágenes pendientes del cliente',
    },
    en: {
      label: 'The Fabrics',
      title: 'Sensory, educational and aspirational',
      subtitle: 'We help clients understand and desire the material. Every fibre tells a story of origin, selection and craftsmanship.',
      values: 'Brand values: Sustainability, artisan selection, material exclusivity',
      pending: 'Images pending from client',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

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
        {/* Header */}
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
            {currentT.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#0A1628',
            margin: '0 0 1rem 0',
          }}>
            {currentT.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            lineHeight: 1.6,
            color: 'rgba(10,22,40,0.6)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {currentT.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {CONTENT_BLOCKS.map((block) => {
            const Icon = block.icon
            const title = block[`title_${locale}` as const] || block.title_es
            const desc = block[`desc_${locale}` as const] || block.desc_es

            return (
              <div
                key={block.id}
                className="mf-fabrics-block"
                style={{
                  padding: '2rem',
                  background: 'rgba(10,22,40,0.02)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  transition: 'all 0.3s ease',
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

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 400,
                  color: '#0A1628',
                  margin: '0 0 0.75rem 0',
                }}>
                  {title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'rgba(10,22,40,0.6)',
                  margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Values Banner */}
        <div style={{
          padding: '2rem',
          background: '#0A1628',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 0.5rem 0',
          }}>
            {currentT.values}
          </p>
          <div style={{
            width: '60px',
            height: '2px',
            background: '#C9A84C',
            margin: '0 auto',
          }} />
        </div>

        {/* Pending Assets Notice */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          border: '1px dashed rgba(201,168,76,0.4)',
          background: 'rgba(201,168,76,0.03)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'rgba(10,22,40,0.5)',
            margin: 0,
          }}>
            {currentT.pending}
          </p>
        </div>
      </div>
    </section>
  )
}
