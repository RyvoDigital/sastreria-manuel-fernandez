'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Play, Check, CreditCard, GraduationCap, Clock } from 'lucide-react'

interface CursosPaymentGateProps {
  onAccessGranted: () => void
  title: string
  subtitle: string
}

export function CursosPaymentGate({ 
  onAccessGranted, 
  title, 
  subtitle 
}: CursosPaymentGateProps) {
  const { locale } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)

  const t = {
    es: {
      badge: 'Acceso a Cursos',
      description: 'Accede a nuestra biblioteca de cursos en vídeo sobre técnicas de sastrería artesanal. Aprende desde anywhere, a tu ritmo.',
      features: [
        'Técnicas de entretelado a mano',
        'Construcción de solapas',
        'Bolsillos de chaqueta',
        'Confección de ojales',
        'Acabados profesionales',
        'Acceso ilimitado',
      ],
      pricing: 'Precio a confirmar',
      cta: 'Acceder a Cursos',
      secure: 'Pago seguro',
      note: 'Los vídeos serán subidos por el cliente una vez construida la estructura',
      duration: 'Duración aprox: 10-15 horas',
    },
    en: {
      badge: 'Course Access',
      description: 'Access our video course library on artisan tailoring techniques. Learn from anywhere, at your own pace.',
      features: [
        'Hand canvas techniques',
        'Lapel construction',
        'Jacket pockets',
        'Buttonhole making',
        'Professional finishes',
        'Unlimited access',
      ],
      pricing: 'Price to be confirmed',
      cta: 'Access Courses',
      secure: 'Secure payment',
      note: 'Videos will be uploaded by client once structure is built',
      duration: 'Approx duration: 10-15 hours',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  const handleRequestAccess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onAccessGranted()
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem var(--container-padding)',
      background: 'linear-gradient(135deg, #0A1628 0%, #0D1D30 100%)',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '2px solid #C9A84C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          background: 'rgba(201,168,76,0.1)',
        }}>
          <GraduationCap size={32} color="#C9A84C" />
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '9999px',
          marginBottom: '1.5rem',
        }}>
          <Play size={14} color="#C9A84C" />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}>
            {currentT.badge}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#FFFFFF',
          marginBottom: '0.75rem',
        }}>
          {title}
        </h1>

        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '2rem',
        }}>
          {subtitle}
        </p>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '2.5rem',
          maxWidth: '480px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {currentT.description}
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '2rem',
          textAlign: 'left',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {currentT.features.map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <Check size={16} color="#C9A84C" />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Duration */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}>
          <Clock size={16} color="rgba(201,168,76,0.7)" />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {currentT.duration}
          </span>
        </div>

        {/* Price */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '1.5rem',
          padding: '0.75rem 1.5rem',
          border: '1px solid rgba(201,168,76,0.3)',
          display: 'inline-block',
        }}>
          {currentT.pricing}
        </div>

        {/* CTA */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleRequestAccess}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 3rem',
              background: '#C9A84C',
              color: '#000000',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            <CreditCard size={16} />
            {isProcessing ? '...' : currentT.cta}
          </button>
        </div>

        {/* Note */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.35)',
          fontStyle: 'italic',
        }}>
          {currentT.note}
        </p>

        {/* Secure */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.35)',
          }}>
            {currentT.secure}
          </span>
        </div>
      </div>
    </div>
  )
}
