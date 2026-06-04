'use client'

import { useI18n } from '@/lib/i18n'
import { Box } from 'lucide-react'
import { ServiceGate } from '@/components/global/ServiceGate'
import { GLBViewer } from '@/components/modelos-3d/GLBViewer'

export default function Modelos3DPage() {
  const { locale } = useI18n()

  const t = {
    es: {
      title: 'Crea tu Traje',
      subtitle: 'Visualización 3D',
      status: 'Entorno 3D',
      desc: 'Explora el modelo tridimensional. Arrastra para rotar, scroll para hacer zoom.',
    },
    en: {
      title: 'Create your Suit',
      subtitle: '3D Visualisation',
      status: '3D Environment',
      desc: 'Explore the three-dimensional model. Drag to rotate, scroll to zoom.',
    },
    it: {
      title: 'Crea il tuo Abito',
      subtitle: 'Visualizzazione 3D',
      status: 'Ambiente 3D',
      desc: 'Esplora il modello tridimensionale. Trascina per ruotare, scrolla per zoomare.',
    },
    fr: {
      title: 'Créez votre Costume',
      subtitle: 'Visualisation 3D',
      status: 'Environnement 3D',
      desc: 'Explorez le modèle tridimensionnel. Faites glisser pour pivoter, défilez pour zoomer.',
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '8rem var(--container-padding) 4rem',
          background: 'linear-gradient(135deg, #0A1628 0%, #0D1D30 100%)',
          overflow: 'hidden',
          gap: '2rem',
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
                opacity: 0.3,
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.6) 40%, rgba(10,22,40,0.85) 100%)',
            }} />
          </div>

          <div style={{
            position: 'relative',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1.25rem',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '9999px',
                marginBottom: '1.5rem',
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
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
                color: '#FFFFFF',
              }}>
                {c.title}
              </h1>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '1rem',
              }}>
                {c.subtitle}
              </div>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.5)',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {c.desc}
              </p>
            </div>

            {/* 3D Viewer */}
            <GLBViewer url="/models/Environment_.glb" />

            {/* Filename */}
            <p style={{
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}>
              Environment_.glb
            </p>
          </div>
        </section>
      </main>
    </ServiceGate>
  )
}
