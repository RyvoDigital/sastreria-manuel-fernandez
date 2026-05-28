'use client'

import { useI18n } from '@/lib/i18n'
import { Box } from 'lucide-react'
import { ServiceGate } from '@/components/global/ServiceGate'

export default function Modelos3DPage() {
  const { locale } = useI18n()

  const t = {
    es: {
      title: 'Crea tu Traje',
      subtitle: 'Visualización 3D',
      status: 'Próximamente',
      desc: 'Nuestro probador virtual está en desarrollo. Pronto podrás explorar y personalizar tu traje a medida en un entorno tridimensional interactivo.',
    },
    en: {
      title: 'Create your Suit',
      subtitle: '3D Visualisation',
      status: 'Coming Soon',
      desc: 'Our virtual fitting room is under development. Soon you will be able to explore and customise your bespoke suit in an interactive three-dimensional environment.',
    },
    it: {
      title: 'Crea il tuo Abito',
      subtitle: 'Visualizzazione 3D',
      status: 'Prossimamente',
      desc: 'Il nostro camerino virtuale è in fase di sviluppo. Presto potrai esplorare e personalizzare il tuo abito su misura in un ambiente tridimensionale interattivo.',
    },
    fr: {
      title: 'Créez votre Costume',
      subtitle: 'Visualisation 3D',
      status: 'Bientôt Disponible',
      desc: 'Notre cabine d\'essayage virtuelle est en développement. Bientôt, vous pourrez explorer et personnaliser votre costume sur mesure dans un environnement tridimensionnel interactif.',
    }
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <ServiceGate settingId="modelos3d">
      <main className="flex flex-col bg-[#0A1628]">
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem var(--container-padding) 4rem',
          background: 'linear-gradient(135deg, #0A1628 0%, #0D1D30 100%)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}>
            <img
              src="https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1779672949/Screenshot_2026-05-25_at_02.33.52_kkbpez.png"
              alt="Sastrería Manuel Fernández"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.5,
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.5) 40%, rgba(10,22,40,0.75) 100%)',
            }} />
          </div>

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vw',
            background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, rgba(10,22,40,0) 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          <div style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#FFFFFF',
            zIndex: 10,
          }}>
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
              <Box size={16} color="#C9A84C" />
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
        </section>
      </main>
    </ServiceGate>
  )
}
