'use client'

import { useState, Suspense } from 'react'
import { useI18n } from '@/lib/i18n'
import { Modelo3DViewer } from '@/components/modelos-3d/Modelo3DViewer'
import { Rotate3D, User, X } from 'lucide-react'

// Clothing items for the gallery
const CLOTHING_ITEMS = [
  {
    id: 'traje-clasico',
    name_es: 'Traje a Medida',
    name_en: 'Bespoke Suit',
    category_es: 'Trajes',
    category_en: 'Suits',
    modelType: 'male' as const,
  },
  {
    id: 'traje-femenino',
    name_es: 'Traje Femenino',
    name_en: 'Women\'s Suit',
    category_es: 'Trajes',
    category_en: 'Suits',
    modelType: 'female' as const,
  },
]

export default function Modelos3DPage() {
  const { locale } = useI18n()
  const [showViewer, setShowViewer] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'male' | 'female'>('male')

  const t = {
    es: {
      title: 'Modelos 3D',
      subtitle: 'Explora nuestras prendas en un entorno tridimensional interactivo.',
      launch3D: 'Abrir Visualizador 3D',
      close: 'Cerrar',
      selectModel: 'Seleccionar modelo',
      male: 'Masculino',
      female: 'Femenino',
      viewIn3D: 'Ver en 3D',
      explore: 'Explorar',
    },
    en: {
      title: '3D Models',
      subtitle: 'Explore our garments in an interactive 3D environment.',
      launch3D: 'Open 3D Viewer',
      close: 'Close',
      selectModel: 'Select model',
      male: 'Male',
      female: 'Female',
      viewIn3D: 'View in 3D',
      explore: 'Explore',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  const handleOpenViewer = (modelType: 'male' | 'female') => {
    setSelectedModel(modelType)
    setShowViewer(true)
  }

  return (
    <main style={{ minHeight: '100vh', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{
        padding: '4rem var(--container-padding)',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
        }}>
          {locale === 'es' ? 'Colección Virtual' : 'Virtual Collection'}
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#FFFFFF',
          margin: '1rem 0',
        }}>
          {currentT.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '500px',
          margin: '0 auto 2rem',
        }}>
          {currentT.subtitle}
        </p>

        {/* Quick Launch Button */}
        <button
          onClick={() => setShowViewer(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: 'var(--color-gold)',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(201,168,76,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Rotate3D size={18} />
          {currentT.launch3D}
        </button>
      </section>

      {/* Model Selection Cards */}
      <section style={{
        padding: '2rem var(--container-padding) 6rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {/* Male Model Card */}
          <div
            onClick={() => handleOpenViewer('male')}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(255,255,255,0.02) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <User size={64} color="rgba(201,168,76,0.5)" />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.4rem 0.8rem',
                background: 'var(--color-gold)',
                color: '#000',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '2px',
              }}>
                3D
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#FFFFFF',
                marginBottom: '0.5rem',
              }}>
                {currentT.male}
              </h3>
              <button style={{
                padding: '0.6rem 1.2rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--color-gold)',
                border: '1px solid var(--color-gold)',
                cursor: 'pointer',
              }}>
                {currentT.viewIn3D}
              </button>
            </div>
          </div>

          {/* Female Model Card */}
          <div
            onClick={() => handleOpenViewer('female')}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(255,255,255,0.02) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <User size={64} color="rgba(201,168,76,0.5)" />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.4rem 0.8rem',
                background: 'var(--color-gold)',
                color: '#000',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '2px',
              }}>
                3D
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#FFFFFF',
                marginBottom: '0.5rem',
              }}>
                {currentT.female}
              </h3>
              <button style={{
                padding: '0.6rem 1.2rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--color-gold)',
                border: '1px solid var(--color-gold)',
                cursor: 'pointer',
              }}>
                {currentT.viewIn3D}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen 3D Viewer Modal */}
      {showViewer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: '#050C14',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem var(--container-padding)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(5,12,20,0.98)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Rotate3D size={24} color="#C9A84C" />
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#FFFFFF',
                }}>
                  {currentT.title}
                </h2>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {locale === 'es' ? 'Visualizador interactivo' : 'Interactive viewer'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowViewer(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <X size={20} />
              {currentT.close}
            </button>
          </div>

          {/* 3D Viewer */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Suspense fallback={
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C9A84C',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '2px solid rgba(201,168,76,0.2)',
                    borderTopColor: '#C9A84C',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    Cargando...
                  </span>
                </div>
              </div>
            }>
              <Modelo3DViewer />
            </Suspense>
          </div>
        </div>
      )}
    </main>
  )
}
