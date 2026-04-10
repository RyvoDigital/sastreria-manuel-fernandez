'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Lock, Check, CreditCard, Shield } from 'lucide-react'

interface ConfiguradorPaymentGateProps {
  onAccessGranted: () => void
  title: string
  subtitle: string
}

export function ConfiguradorPaymentGate({ 
  onAccessGranted, 
  title, 
  subtitle 
}: ConfiguradorPaymentGateProps) {
  const { locale } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)

  const t = {
    es: {
      badge: 'Acceso Premium',
      description: 'El configurador de prendas te permite diseñar tu traje a medida paso a paso. Acceso de pago único.',
      features: [
        'Selección de tejidos exclusivos',
        'Configuración de chaqueta, chaleco y pantalón',
        'Asesoramiento de colorimetría',
        'Recomendación de estilo personalizado',
        'Presupuesto instantáneo',
      ],
      price: 'Precio a confirmar',
      cta: 'Solicitar Acceso',
      secure: 'Pago seguro encriptado',
      contact: 'Contacte con nosotros para acceder',
    },
    en: {
      badge: 'Premium Access',
      description: 'The garment configurator allows you to design your bespoke suit step by step. One-time paid access.',
      features: [
        'Exclusive fabric selection',
        'Jacket, waistcoat and trouser configuration',
        'Colourimetry advice',
        'Personalised style recommendation',
        'Instant quote',
      ],
      price: 'Price to be confirmed',
      cta: 'Request Access',
      secure: 'Encrypted secure payment',
      contact: 'Contact us for access',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  const handleRequestAccess = () => {
    setIsProcessing(true)
    // Simulate payment processing - in production, this would redirect to payment gateway
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
        {/* Lock Icon */}
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
          <Lock size={32} color="#C9A84C" />
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
          <Shield size={14} color="#C9A84C" />
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
          marginBottom: '2.5rem',
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
          {currentT.price}
        </div>

        {/* CTA Button */}
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
              transition: 'all 0.3s ease',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            <CreditCard size={16} />
            {isProcessing ? '...' : currentT.cta}
          </button>
        </div>

        {/* Secure note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}>
          <Lock size={12} color="rgba(201,168,76,0.5)" />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.35)',
          }}>
            {currentT.secure}
          </span>
        </div>

        {/* Contact note */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          marginTop: '2rem',
        }}>
          {currentT.contact}
        </p>
      </div>
    </div>
  )
}
