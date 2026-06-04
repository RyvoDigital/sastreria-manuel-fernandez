'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Box, ArrowLeft } from 'lucide-react'
import { ServiceGate } from '@/components/global/ServiceGate'
import { GLBViewer } from '@/components/modelos-3d/GLBViewer'

interface Garment {
  id: number
  name: string
  slug: string
  thumbnail_url: string
  description: string
}

export default function Modelo3DDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { locale } = useI18n()
  const [garment, setGarment] = useState<Garment | null>(null)
  const [loading, setLoading] = useState(true)

  const t = {
    es: {
      back: 'Volver a prendas',
      loading: 'Cargando…',
      notFound: 'Prenda no encontrada.',
      status: 'Entorno 3D',
      drag: 'Arrastra para rotar · Scroll para zoom',
    },
    en: {
      back: 'Back to garments',
      loading: 'Loading…',
      notFound: 'Garment not found.',
      status: '3D Environment',
      drag: 'Drag to rotate · Scroll to zoom',
    },
    it: {
      back: 'Torna agli abiti',
      loading: 'Caricamento…',
      notFound: 'Abito non trovato.',
      status: 'Ambiente 3D',
      drag: 'Trascina per ruotare · Scrolla per zoomare',
    },
    fr: {
      back: 'Retour aux vêtements',
      loading: 'Chargement…',
      notFound: 'Vêtement non trouvé.',
      status: 'Environnement 3D',
      drag: 'Faites glisser pour pivoter · Défilez pour zoomer',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  useEffect(() => {
    if (!slug) return
    fetch(`/api/garments/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setGarment(data.garment || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  return (
    <ServiceGate settingId="modelos3d">
      <main className="flex flex-col bg-[#0A1628] min-h-screen">
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '6rem var(--container-padding) 2rem',
          gap: '1.5rem',
        }}>
          {/* Back link */}
          <Link
            href="/modelos-3d"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(201,168,76,0.8)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            className="back-link"
          >
            <ArrowLeft size={16} />
            {c.back}
          </Link>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '4rem' }}>
              {c.loading}
            </p>
          ) : !garment ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '4rem' }}>
              {c.notFound}
            </p>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '9999px',
                  marginBottom: '1rem',
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
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem',
                  color: '#FFFFFF',
                }}>
                  {garment.name}
                </h1>
                {garment.description && (
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: '560px',
                    margin: '0 auto',
                  }}>
                    {garment.description}
                  </p>
                )}
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: '0.75rem',
                  letterSpacing: '0.1em',
                }}>
                  {c.drag}
                </p>
              </div>

              {/* 3D Viewer */}
              <GLBViewer url="/models/Environment_.glb" />
            </>
          )}
        </section>

        <style jsx>{`
          .back-link:hover {
            color: #C9A84C !important;
          }
        `}</style>
      </main>
    </ServiceGate>
  )
}
