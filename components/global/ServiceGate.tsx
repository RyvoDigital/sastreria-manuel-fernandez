'use client'

import { useSettings } from '@/lib/settings-provider'
import { useI18n } from '@/lib/i18n'
import Link from 'next/link'
import { Construction } from 'lucide-react'

interface ServiceGateProps {
  settingId: string
  children: React.ReactNode
}

export function ServiceGate({ settingId, children }: ServiceGateProps) {
  const { isEnabled, loading } = useSettings()
  const { t } = useI18n()

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1628' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isEnabled(settingId)) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A1628',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <Construction size={48} style={{ color: 'rgba(201,168,76,0.4)', marginBottom: '1.5rem' }} />
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          color: '#FFFFFF',
          marginBottom: '1rem',
        }}>
          {t.coming_soon.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.4)',
          maxWidth: '400px',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          {t.coming_soon.description}
        </p>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 2rem',
          background: '#C9A84C',
          color: '#000000',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: '4px',
        }}>
          {t.nav.inicio}
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
