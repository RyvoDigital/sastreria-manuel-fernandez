'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useSettings } from '@/lib/settings-provider'
import { Lock, Check, Clock, Loader2, CreditCard, ArrowRight } from 'lucide-react'

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
  const { getPrice } = useSettings()
  const configPrice = getPrice('configurador') || 29
  const [isProcessing, setIsProcessing] = useState(false)

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
      cta: `Comprar Acceso — €${configPrice}`,
      secure: 'Pago seguro con Stripe',
      contact: '¿Prefieres hablar con nosotros?',
      contact_cta: 'Reservar cita',
      comingSoonNote: 'Acceso inmediato tras la compra. Devolución garantizada en 14 días.',
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
      cta: `Buy Access — €${configPrice}`,
      secure: 'Secure payment with Stripe',
      contact: 'Prefer to talk to us?',
      contact_cta: 'Book an appointment',
      comingSoonNote: 'Immediate access after purchase. 14-day money-back guarantee.',
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
      cta: `Acquista Accesso — €${configPrice}`,
      secure: 'Pagamento sicuro con Stripe',
      contact: 'Preferisci parlarci?',
      contact_cta: 'Prenota un appuntamento',
      comingSoonNote: 'Accesso immediato dopo l\'acquisto. Rimborso garantito in 14 giorni.',
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
      cta: `Acheter l'Accès — €${configPrice}`,
      secure: 'Paiement sécurisé avec Stripe',
      contact: 'Vous préférez nous parler?',
      contact_cta: 'Prendre rendez-vous',
      comingSoonNote: 'Accès immédiat après l\'achat. Remboursement garanti sous 14 jours.',
    },
  }

  const currentT = t[locale as keyof typeof t] || t.es

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
            <Clock size={13} color="#C9A84C" />
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

          {/* Stripe Checkout Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <button
              onClick={async () => {
                setIsProcessing(true)
                try {
                  const res = await fetch('/api/stripe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'configurator', price: configPrice * 100 }),
                  })
                  const data = await res.json()
                  if (data.url) {
                    window.location.href = data.url
                  } else {
                    setIsProcessing(false)
                  }
                } catch {
                  setIsProcessing(false)
                }
              }}
              disabled={isProcessing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2.5rem',
                background: '#C9A84C',
                color: '#000000',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '8px',
                cursor: isProcessing ? 'wait' : 'pointer',
                opacity: isProcessing ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              <CreditCard size={16} />
              {isProcessing ? '...' : currentT.cta}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '1.5rem',
            }}
          >
            {currentT.comingSoonNote}
          </motion.p>

          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
              marginBottom: '1.25rem',
            }}
          />

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
    </div>
  )
}
