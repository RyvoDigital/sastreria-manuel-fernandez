'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { Lock, Check, CreditCard, Shield, Loader2 } from 'lucide-react'

interface ConfiguradorPaymentGateProps {
  onAccessGranted: () => void
  title: string
  subtitle: string
}

export function ConfiguradorPaymentGate({
  onAccessGranted,
  title,
  subtitle,
}: ConfiguradorPaymentGateProps) {
  const { locale } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const t = {
    es: {
      badge: 'Acceso Premium',
      description:
        'El configurador de prendas te permite diseñar tu traje a medida paso a paso. Acceso de pago único.',
      features: [
        'Selección de tejidos exclusivos',
        'Configuración de chaqueta, chaleco y pantalón',
        'Asesoramiento de colorimetría',
        'Recomendación de estilo personalizado',
        'Presupuesto instantáneo',
      ],
      cta: 'Solicitar Acceso',
      secure: 'Pago seguro encriptado',
      contact: '¿Prefieres hablar con nosotros?',
      contact_cta: 'Reservar cita',
    },
    en: {
      badge: 'Premium Access',
      description:
        'The garment configurator allows you to design your bespoke suit step by step. One-time paid access.',
      features: [
        'Exclusive fabric selection',
        'Jacket, waistcoat and trouser configuration',
        'Colourimetry advice',
        'Personalised style recommendation',
        'Instant quote',
      ],
      cta: 'Request Access',
      secure: 'Encrypted secure payment',
      contact: 'Prefer to talk to us?',
      contact_cta: 'Book an appointment',
    },
    it: {
      badge: 'Accesso Premium',
      description:
        'Il configuratore di abiti ti permette di progettare il tuo abito su misura passo dopo passo. Accesso a pagamento una tantum.',
      features: [
        'Selezione di tessuti esclusivi',
        'Configurazione di giacca, gilet e pantaloni',
        'Consulenza cromatica',
        'Raccomandazione di stile personalizzata',
        'Preventivo istantaneo',
      ],
      cta: 'Richiedi Accesso',
      secure: 'Pagamento sicuro crittografato',
      contact: 'Preferisci parlarci?',
      contact_cta: 'Prenota un appuntamento',
    },
    fr: {
      badge: 'Accès Premium',
      description:
        'Le configurateur de vêtements vous permet de concevoir votre costume sur mesure étape par étape. Accès payant unique.',
      features: [
        'Sélection de tissus exclusifs',
        'Configuration de veste, gilet et pantalon',
        'Conseil en colorimétrie',
        'Recommandation de style personnalisée',
        'Devis instantané',
      ],
      cta: "Demander l'Accès",
      secure: 'Paiement sécurisé crypté',
      contact: 'Vous préférez nous parler?',
      contact_cta: 'Prendre rendez-vous',
    },
  }

  const currentT = t[locale as keyof typeof t] || t.es

  const handleRequestAccess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onAccessGranted()
    }, 1500)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem var(--container-padding)',
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%),
          #0A1628
        `,
        position: 'relative',
      }}
    >
      {/* Top gold accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Glass card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '1.5px solid rgba(201,168,76,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.75rem',
              background: 'rgba(201,168,76,0.08)',
            }}
          >
            <Lock size={28} color="#C9A84C" strokeWidth={1.5} />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '9999px',
              marginBottom: '1.5rem',
              background: 'rgba(201,168,76,0.05)',
            }}
          >
            <Shield size={13} color="#C9A84C" />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                fontWeight: 500,
              }}
            >
              {currentT.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#FFFFFF',
              marginBottom: '0.75rem',
              lineHeight: 1.15,
            }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
              marginBottom: '2.5rem',
              textAlign: 'left',
              maxWidth: '380px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {currentT.features.map((feature, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.875rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={11} color="#C9A84C" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.4,
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <button
              onClick={handleRequestAccess}
              disabled={isProcessing}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2.5rem',
                background: isHovered && !isProcessing ? '#D4B55A' : '#C9A84C',
                color: '#000000',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '8px',
                cursor: isProcessing ? 'wait' : 'pointer',
                opacity: isProcessing ? 0.8 : 1,
                transition: 'all 0.3s ease',
                boxShadow: isHovered
                  ? '0 8px 24px rgba(201,168,76,0.25)'
                  : '0 4px 12px rgba(201,168,76,0.15)',
                transform: isHovered && !isProcessing ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              {isProcessing ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <CreditCard size={16} />
              )}
              {isProcessing ? '...' : currentT.cta}
            </button>
          </motion.div>

          {/* Secure note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <Lock size={11} color="rgba(201,168,76,0.4)" />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em',
              }}
            >
              {currentT.secure}
            </span>
          </motion.div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
              marginBottom: '1.25rem',
            }}
          />

          {/* Contact note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}
          >
            {currentT.contact}{' '}
            <a
              href="/contacto"
              style={{
                color: '#C9A84C',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.3)',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')
              }
            >
              {currentT.contact_cta}
            </a>
          </motion.p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
