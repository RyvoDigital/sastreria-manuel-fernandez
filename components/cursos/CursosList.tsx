'use client'

import { useI18n } from '@/lib/i18n'
import { Play, Lock, Clock, BookOpen } from 'lucide-react'

const COURSES = [
  {
    id: 'intro',
    title_es: 'Introducción a la Sastrería Artesanal',
    title_en: 'Introduction to Artisan Tailoring',
    desc_es: 'Fundamentos y filosofía del traje a mano.',
    desc_en: 'Fundamentals and philosophy of handmade tailoring.',
    duration: '45 min',
    lessons: 3,
    locked: false,
  },
  {
    id: 'canvas',
    title_es: 'Entretelado a Mano',
    title_en: 'Hand Canvas',
    desc_es: 'Técnicas de cosido de la entretela canvas.',
    desc_en: 'Hand-stitching canvas interlining techniques.',
    duration: '2h 30min',
    lessons: 5,
    locked: true,
  },
  {
    id: 'lapel',
    title_es: 'Construcción de Solapas',
    title_en: 'Lapel Construction',
    desc_es: 'Tipos de solapa y su confección paso a paso.',
    desc_en: 'Lapel types and step-by-step construction.',
    duration: '1h 45min',
    lessons: 4,
    locked: true,
  },
  {
    id: 'pockets',
    title_es: 'Bolsillos de Chaqueta',
    title_en: 'Jacket Pockets',
    desc_es: 'Bolsillos de ojal, de parche y de tapeta.',
    desc_en: 'Welt, patch and flap pockets.',
    duration: '2h 15min',
    lessons: 6,
    locked: true,
  },
  {
    id: 'buttonholes',
    title_es: 'Ojales a Mano',
    title_en: 'Hand-made Buttonholes',
    desc_es: 'Técnica de ojales de ojaladero.',
    desc_en: 'Buttonhole stitch technique.',
    duration: '1h 30min',
    lessons: 3,
    locked: true,
  },
  {
    id: 'finishes',
    title_es: 'Acabados Profesionales',
    title_en: 'Professional Finishes',
    desc_es: 'Detalles que marcan la diferencia.',
    desc_en: 'Details that make the difference.',
    duration: '2h',
    lessons: 4,
    locked: true,
  },
]

export function CursosList() {
  const { locale } = useI18n()

  const t = {
    es: {
      title: 'Cursos Artesanales',
      subtitle: 'Próximamente',
      lessons: 'lecciones',
      locked: 'Próximamente',
      available: 'Disponible',
    },
    en: {
      title: 'Artisan Courses',
      subtitle: 'Coming Soon',
      lessons: 'lessons',
      locked: 'Coming soon',
      available: 'Available',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  return (
    <div style={{
      minHeight: '100vh',
      padding: '6rem var(--container-padding) 4rem',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}>
            {currentT.title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {currentT.subtitle}
          </p>
        </div>

        {/* Course Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {COURSES.map((course, index) => {
            const title = course[`title_${locale}` as const] || course.title_es
            const desc = course[`desc_${locale}` as const] || course.desc_es

            return (
              <div
                key={course.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: course.locked ? 'rgba(0,0,0,0.2)' : 'rgba(201,168,76,0.05)',
                  border: `1px solid ${course.locked ? 'rgba(255,255,255,0.1)' : 'rgba(201,168,76,0.2)'}`,
                  opacity: course.locked ? 0.7 : 1,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: course.locked ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                  border: `1px solid ${course.locked ? 'rgba(255,255,255,0.1)' : '#C9A84C'}`,
                }}>
                  {course.locked ? (
                    <Lock size={20} color="rgba(255,255,255,0.3)" />
                  ) : (
                    <Play size={20} color="#C9A84C" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem',
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                    }}>
                      {title}
                    </h3>
                    {course.locked && (
                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                        padding: '0.2rem 0.5rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}>
                        {currentT.locked}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.5)',
                    margin: '0 0 0.5rem 0',
                  }}>
                    {desc}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      <Clock size={12} />
                      {course.duration}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      <BookOpen size={12} />
                      {course.lessons} {currentT.lessons}
                    </span>
                  </div>
                </div>

                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  color: course.locked ? 'rgba(255,255,255,0.1)' : 'rgba(201,168,76,0.3)',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          border: '1px dashed rgba(201,168,76,0.3)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.4)',
            margin: 0,
          }}>
            {locale === 'es' 
              ? 'Los vídeos serán subidos por el cliente una vez finalizada la estructura.'
              : 'Videos will be uploaded by the client once the structure is completed.'}
          </p>
        </div>
      </div>
    </div>
  )
}
