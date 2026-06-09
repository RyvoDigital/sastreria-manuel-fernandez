'use client'

import { useState, useEffect, Suspense } from 'react'
import { useI18n } from '@/lib/i18n'
import { GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react'
import { CursosList } from './CursosList'
import { CursosPaymentGate } from './CursosPaymentGate'
import { useSearchParams } from 'next/navigation'

function CursosLayoutInner() {
  const { locale } = useI18n()
  const searchParams = useSearchParams()
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string
    title: string
    price: number
  } | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setPurchaseSuccess(true)
    }
  }, [searchParams])

  const t = {
    es: {
      title: 'Curso Artesanal',
      desc: 'Nuestra academia digital ofrece masterclasses detalladas sobre las técnicas tradicionales que definen nuestro estilo. Aprende desde cualquier lugar, a tu ritmo.',
      back: 'Volver a cursos',
      successTitle: '¡Compra exitosa!',
      successMsg: 'Gracias por tu compra. Pronto tendrás acceso completo al curso.',
    },
    en: {
      title: 'Artisan Course',
      desc: 'Our digital academy offers detailed masterclasses on the traditional techniques that define our style. Learn from anywhere, at your own pace.',
      back: 'Back to courses',
      successTitle: 'Purchase successful!',
      successMsg: 'Thank you for your purchase. You will soon have full access to the course.',
    },
    it: {
      title: 'Corso Artigianale',
      desc: 'La nostra accademia digitale offre masterclass dettagliate sulle tecniche tradizionali che definiscono il nostro stile. Impara da qualsiasi luogo, al tuo ritmo.',
      back: 'Torna ai corsi',
      successTitle: 'Acquisto riuscito!',
      successMsg: 'Grazie per il tuo acquisto. Presto avrai accesso completo al corso.',
    },
    fr: {
      title: 'Cours Artisanal',
      desc: 'Notre académie numérique propose des masterclasses détaillées sur les techniques traditionnelles qui définissent notre style. Apprenez de n\'importe où, à votre rythme.',
      back: 'Retour aux cours',
      successTitle: 'Achat réussi !',
      successMsg: 'Merci pour votre achat. Vous aurez bientôt un accès complet au cours.',
    }
  }

  const c = t[locale as keyof typeof t] || t.es

  if (purchaseSuccess) {
    return (
      <div className="flex flex-col bg-[#0A1628] min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/20 rounded-full mb-6">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-serif text-white mb-3">{c.successTitle}</h1>
          <p className="text-gray-400 mb-8">{c.successMsg}</p>
          <button
            onClick={() => {
              setPurchaseSuccess(false)
              setSelectedCourse(null)
              window.history.replaceState({}, '', '/cursos')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors"
          >
            <ArrowLeft size={16} />
            {c.back}
          </button>
        </div>
      </div>
    )
  }

  if (selectedCourse) {
    return (
      <CursosPaymentGate
        onAccessGranted={() => setSelectedCourse(null)}
        title={selectedCourse.title}
        subtitle={c.subtitle}
        courseId={selectedCourse.id}
        courseName={selectedCourse.title}
        price={selectedCourse.price}
      />
    )
  }

  return (
    <div className="flex flex-col bg-[#0A1628]">
      {/* Cinematic Hero */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem var(--container-padding) 4rem',
        background: 'linear-gradient(135deg, #0A1628 0%, #0D1D30 100%)',
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <img
            src="https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778763721/photos/IMG_9423_bn8baq.jpg"
            alt="Cursos de Sastrería"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.45) 40%, rgba(10,22,40,0.72) 100%)',
          }} />
        </div>

        {/* Subtle Luxury Pattern/Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vw',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, rgba(10,22,40,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#FFFFFF',
          zIndex: 10,
        }}>
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '9999px',
            marginBottom: '2rem',
          }}>
            <GraduationCap size={16} color="#C9A84C" />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              fontWeight: 500,
            }}>
              Online Academy
            </span>
          </div>

          {/* Titles */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            {c.title}
          </h1>
          <div style={{
            width: '40px',
            height: '1px',
            background: '#C9A84C',
            margin: '0 auto 2.5rem',
            opacity: 0.5,
          }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            {c.desc}
          </p>
        </div>
        
        {/* Bottom fade into the list background color (which is now #0A1628) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, #0A1628)',
          zIndex: 10,
        }} />
      </section>

      {/* The List of upcoming modules */}
      <div style={{ position: 'relative', zIndex: 20, marginTop: '2rem' }}>
        <CursosList onSelectCourse={(course) => {
          const title = (course[`title_${locale}` as keyof typeof course] as string) || course.title_es
          setSelectedCourse({
            id: course.id,
            title,
            price: course.price || 35000,
          })
          window.scrollTo({ top: 0, behavior: 'instant' })
        }} />
      </div>

      {/* Seamless transition to dark footer */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #0A1628, #070C15)',
        position: 'relative',
        zIndex: 10,
      }} />
    </div>
  )
}

export function CursosLayout() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CursosLayoutInner />
    </Suspense>
  )
}
