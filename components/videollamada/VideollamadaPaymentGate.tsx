'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Video, Check, CreditCard, Clock, User, Palette, Scissors } from 'lucide-react'

interface VideollamadaPaymentGateProps {
  onAccessGranted: () => void
  title: string
  subtitle: string
}

export function VideollamadaPaymentGate({ 
  onAccessGranted, 
  title, 
  subtitle 
}: VideollamadaPaymentGateProps) {
  const { locale } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)

  const t = {
    es: {
      badge: 'Consulta Premium',
      description: 'Recibe asesoramiento personalizado de sastrería desde cualquier lugar. Una videollamada de 20-25 minutos con nuestros profesionales cualificados.',
      features: [
        { icon: Palette, text: 'Recomendación de tejidos' },
        { icon: User, text: 'Asesoramiento de color' },
        { icon: Scissors, text: 'Guía de estilo personalizado' },
      ],
      duration: 'Duración: 20-25 minutos',
      delivery: 'Realizado por profesionales cualificados',
      pricing: 'Precio a confirmar',
      cta: 'Reservar Videollamada',
      secure: 'Pago seguro',
    },
    en: {
      badge: 'Premium Consultation',
      description: 'Receive personalised tailoring advice from anywhere. A 20-25 minute video call with our qualified professionals.',
      features: [
        { icon: Palette, text: 'Fabric recommendations' },
        { icon: User, text: 'Colour advice' },
        { icon: Scissors, text: 'Personalised style guidance' },
      ],
      duration: 'Duration: 20-25 minutes',
      delivery: 'Conducted by qualified professionals',
      pricing: 'Price to be confirmed',
      cta: 'Book Video Call',
      secure: 'Secure payment',
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
          <Video size={32} color="#C9A84C" />
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
          <User size={14} color="#C9A84C" />
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
          gap: '1rem',
          marginBottom: '2rem',
          textAlign: 'left',
          maxWidth: '350px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {currentT.features.map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.15)',
            }}>
              <feature.icon size={20} color="#C9A84C" />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: '#FFFFFF',
              }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Duration & Delivery */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <Clock size={16} color="rgba(201,168,76,0.7)" />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.6)',
            }}>
              {currentT.duration}
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {currentT.delivery}
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

        {/* Secure */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
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
