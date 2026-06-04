'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Box } from 'lucide-react'
import { ServiceGate } from '@/components/global/ServiceGate'

interface Garment {
  id: number
  name: string
  slug: string
  thumbnail_url: string
  description: string
}

export default function Modelos3DPage() {
  const { locale } = useI18n()
  const [garments, setGarments] = useState<Garment[]>([])
  const [loading, setLoading] = useState(true)

  const t = {
    es: {
      title: 'Crea tu Traje',
      subtitle: 'Visualización 3D',
      desc: 'Explora nuestras prendas en un entorno tridimensional interactivo. Selecciona una prenda para verla en detalle.',
      loading: 'Cargando…',
      empty: 'No hay prendas disponibles.',
    },
    en: {
      title: 'Create your Suit',
      subtitle: '3D Visualisation',
      desc: 'Explore our garments in an interactive three-dimensional environment. Select a garment to view it in detail.',
      loading: 'Loading…',
      empty: 'No garments available.',
    },
    it: {
      title: 'Crea il tuo Abito',
      subtitle: 'Visualizzazione 3D',
      desc: 'Esplora i nostri abiti in un ambiente tridimensionale interattivo. Seleziona un abito per vederlo in dettaglio.',
      loading: 'Caricamento…',
      empty: 'Nessun abito disponibile.',
    },
    fr: {
      title: 'Créez votre Costume',
      subtitle: 'Visualisation 3D',
      desc: 'Explorez nos vêtements dans un environnement tridimensionnel interactif. Sélectionnez un vêtement pour le voir en détail.',
      loading: 'Chargement…',
      empty: 'Aucun vêtement disponible.',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  useEffect(() => {
    fetch('/api/garments')
      .then((r) => r.json())
      .then((data) => {
        setGarments(data.garments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <ServiceGate settingId="modelos3d">
      <main className="flex flex-col bg-[#0A1628] min-h-screen">
        <section style={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem var(--container-padding) 3rem',
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
              alt=""
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

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
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
                3D
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
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              {c.desc}
            </p>
          </div>
        </section>

        <section style={{
          padding: 'clamp(3rem, 6vh, 5rem) var(--container-padding)',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{c.loading}</p>
          ) : garments.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{c.empty}</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}>
              {garments.map((g) => (
                <Link
                  key={g.id}
                  href={`/modelos-3d/${g.slug}`}
                  style={{
                    display: 'block',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#0D1D30',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.4s ease',
                    textDecoration: 'none',
                  }}
                  className="garment-card"
                >
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '4/5',
                    background: '#050A10',
                  }}>
                    <img
                      src={g.thumbnail_url}
                      alt={g.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, transparent 50%)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1.5rem',
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        fontStyle: 'italic',
                      }}>
                        {g.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <style jsx>{`
          .garment-card:hover {
            border-color: rgba(201, 168, 76, 0.2) !important;
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          .garment-card:hover img {
            transform: scale(1.05);
          }
        `}</style>
      </main>
    </ServiceGate>
  )
}
