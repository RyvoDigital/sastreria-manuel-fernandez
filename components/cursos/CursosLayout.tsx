'use client'

import { useI18n } from '@/lib/i18n'
import { GraduationCap } from 'lucide-react'
import { CursosList } from './CursosList'

export function CursosLayout() {
  const { locale } = useI18n()

  const t = {
    es: {
      title: 'Cursos Online',
      subtitle: 'Sastrería Artesanal',
      status: 'Próximamente',
      desc: 'Nuestra academia digital está en construcción. Pronto podrás acceder a masterclasses detalladas sobre las técnicas tradicionales que definen nuestro estilo.',
    },
    en: {
      title: 'Online Courses',
      subtitle: 'Artisan Tailoring',
      status: 'Coming Soon',
      desc: 'Our digital academy is under construction. Soon you will be able to access detailed masterclasses on the traditional techniques that define our style.',
    },
    it: {
      title: 'Corsi Online',
      subtitle: 'Sartoria Artigianale',
      status: 'Prossimamente',
      desc: 'La nostra accademia digitale è in costruzione. Presto potrai accedere a masterclass dettagliate sulle tecniche tradizionali che definiscono il nostro stile.',
    },
    fr: {
      title: 'Cours en Ligne',
      subtitle: 'Tailleur Artisanale',
      status: 'Bientôt Disponible',
      desc: 'Notre académie numérique est en construction. Bientôt, vous pourrez accéder à des masterclasses détaillées sur les techniques traditionnelles qui définissent notre style.',
    }
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <div className="flex flex-col bg-[#0A1628]">
      {/* Cinematic Hero */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem var(--container-padding) 4rem',
        background: 'linear-gradient(135deg, #0A1628 0%, #0D1D30 100%)',
        overflow: 'hidden',
      }}>
        {/* Subtle Luxury Pattern/Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vw',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, rgba(10,22,40,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#FFFFFF',
          zIndex: 10,
        }}>
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '9999px',
            marginBottom: '2rem',
          }}>
            <GraduationCap size={16} color="#C9A84C" />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              fontWeight: 500,
            }}>
              {c.status}
            </span>
          </div>

          {/* Titles */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            {c.title}
          </h1>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2.5rem',
          }}>
            {c.subtitle}
          </div>

          <div style={{
            width: '40px',
            height: '1px',
            background: '#C9A84C',
            margin: '0 auto 2.5rem',
            opacity: 0.5,
          }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            {c.desc}
          </p>
        </div>
        
        {/* Bottom fade into the list background color (which is now #0A1628) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, #0A1628)',
        }} />
      </section>

      {/* The List of upcoming modules */}
      <div style={{ position: 'relative', zIndex: 20, marginTop: '2rem' }}>
        <CursosList />
      </div>

      {/* Seamless transition to dark footer */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #0A1628, #070C15)',
        position: 'relative',
        zIndex: 10,
      }} />
    </div>
  )
}
