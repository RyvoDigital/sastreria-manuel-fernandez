'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Play, Lock, CreditCard, GraduationCap, Clock, ArrowRight } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface CursosPaymentGateProps {
  onAccessGranted: () => void
  title: string
  subtitle: string
  courseId?: string
  courseName?: string
  price?: number
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export function CursosPaymentGate({
  onAccessGranted,
  title,
  subtitle,
  courseId = 'default',
  courseName = 'Curso de Sastrería Artesanal',
  price = 35000,
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
      price: '350 €',
      cta: 'Comprar Acceso',
      secure: 'Pago seguro con Stripe',
      note: 'Acceso inmediato tras la compra. Devolución garantizada en 14 días.',
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
      price: '€350',
      cta: 'Buy Access',
      secure: 'Secure payment with Stripe',
      note: 'Immediate access after purchase. 14-day money-back guarantee.',
      duration: 'Approx duration: 10-15 hours',
    },
    it: {
      badge: 'Accesso ai Corsi',
      description: 'Accedi alla nostra libreria di corsi video sulle tecniche di sartoria artigianale. Impara da qualsiasi luogo, al tuo ritmo.',
      features: [
        'Tecniche di canvas a mano',
        'Costruzione del revers',
        'Tasche della giacca',
        'Confezione delle asole',
        'Finiture professionali',
        'Accesso illimitato',
      ],
      price: '99 €',
      cta: 'Acquista Accesso',
      secure: 'Pagamento sicuro con Stripe',
      note: 'Accesso immediato dopo l\'acquisto. Rimborso garantito in 14 giorni.',
      duration: 'Durata appross: 10-15 ore',
    },
    fr: {
      badge: 'Accès aux Cours',
      description: 'Accédez à notre bibliothèque de cours vidéo sur les techniques de tailleur artisanal. Apprenez de n\'importe où, à votre rythme.',
      features: [
        'Techniques de canvas à la main',
        'Construction du revers',
        'Poches de la veste',
        'Confection des boutonnières',
        'Finitions professionnelles',
        'Accès illimité',
      ],
      price: '99 €',
      cta: 'Acheter l\'Accès',
      secure: 'Paiement sécurisé avec Stripe',
      note: 'Accès immédiat après l\'achat. Remboursement garanti sous 14 jours.',
      duration: 'Durée approx: 10-15 heures',
    },
  }

  const currentT = t[locale as keyof typeof t] || t.es

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseName,
          price,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsProcessing(false)
    }
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
              <Lock size={16} color="#C9A84C" />
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
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#C9A84C',
          marginBottom: '0.5rem',
        }}>
          {currentT.price}
        </div>

        {/* CTA Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleCheckout}
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
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.background = '#E8D5A3'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C9A84C'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <CreditCard size={16} />
            {isProcessing ? '...' : currentT.cta}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Note */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '1.5rem',
        }}>
          {currentT.note}
        </p>

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
