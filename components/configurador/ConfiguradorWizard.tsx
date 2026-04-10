'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

const STEPS = [
  { id: 'fabrics', label_es: 'Tejidos', label_en: 'Fabrics' },
  { id: 'jacket', label_es: 'Chaqueta', label_en: 'Jacket' },
  { id: 'waistcoat', label_es: 'Chaleco', label_en: 'Waistcoat' },
  { id: 'trousers', label_es: 'Pantalón', label_en: 'Trousers' },
  { id: 'occasion', label_es: 'Ocasión', label_en: 'Occasion' },
  { id: 'colorimetry', label_es: 'Colorimetría', label_en: 'Colorimetry' },
]

const OPTIONS = {
  fabrics: {
    es: ['Príncipe de Gales', 'Pata de gallo', 'Raya diplomática', 'Lisos'],
    en: ['Prince of Wales', 'Houndstooth', 'Diplomacy stripe', 'Solids'],
  },
  jacket: {
    es: ['Solapa clásica', 'Solapa pico', '2 botones', 'Doble botonadura', 'Ajustado', 'Confort'],
    en: ['Classic lapel', 'Peak lapel', '2 buttons', 'Double-breasted', 'Slim fit', 'Relaxed fit'],
  },
  waistcoat: {
    es: ['Clásico', 'Doble botonadura'],
    en: ['Classic', 'Double-breasted'],
  },
  trousers: {
    es: ['Tiro alto', 'Tiro bajo', 'Cinturón', 'Tirantes', 'Con vuelta', 'Sin vuelta'],
    en: ['High rise', 'Low rise', 'Belt', 'Braces', 'With cuff', 'No cuff'],
  },
  occasion: {
    es: ['Boda', 'Negocios', 'Ceremonia', 'Casual elegante', 'Imagen clásica', 'Imagen moderna'],
    en: ['Wedding', 'Business', 'Ceremony', 'Smart casual', 'Classic image', 'Modern image'],
  },
  colorimetry: {
    es: ['Tono claro', 'Tono medio', 'Tono oscuro', 'Primavera/Verano', 'Otoño/Invierno', 'Uso diario', 'Eventos especiales'],
    en: ['Light tone', 'Medium tone', 'Dark tone', 'Spring/Summer', 'Autumn/Winter', 'Daily use', 'Special events'],
  },
}

export function ConfiguradorWizard() {
  const { locale } = useI18n()
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string[]>>({
    fabrics: [],
    jacket: [],
    waistcoat: [],
    trousers: [],
    occasion: [],
    colorimetry: [],
  })

  const t = {
    es: {
      title: 'Configura tu Traje',
      subtitle: 'Selecciona tus preferencias paso a paso',
      next: 'Siguiente',
      back: 'Anterior',
      finish: 'Finalizar',
      summary: 'Resumen',
      submit: 'Enviar Configuración',
    },
    en: {
      title: 'Configure your Suit',
      subtitle: 'Select your preferences step by step',
      next: 'Next',
      back: 'Back',
      finish: 'Finish',
      summary: 'Summary',
      submit: 'Submit Configuration',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es
  const currentStepData = STEPS[currentStep]
  const stepOptions = OPTIONS[currentStepData.id as keyof typeof OPTIONS]
  const options = stepOptions[locale as 'es' | 'en'] || stepOptions.es

  const toggleSelection = (option: string) => {
    setSelections(prev => {
      const current = prev[currentStepData.id] || []
      if (current.includes(option)) {
        return { ...prev, [currentStepData.id]: current.filter(o => o !== option) }
      }
      return { ...prev, [currentStepData.id]: [...current, option] }
    })
  }

  const isSelected = (option: string) => {
    return selections[currentStepData.id]?.includes(option) || false
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div style={{
      minHeight: '100vh',
      padding: '6rem var(--container-padding) 4rem',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}>
            {currentT.title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {currentT.subtitle}
          </p>
        </div>

        {/* Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: i <= currentStep ? '#C9A84C' : 'transparent',
                border: `1px solid ${i <= currentStep ? '#C9A84C' : 'rgba(255,255,255,0.2)'}`,
                color: i <= currentStep ? '#000000' : 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                {i < currentStep ? <Check size={14} /> : i + 1}
              </div>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: i === currentStep ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                display: window?.innerWidth < 600 ? 'none' : 'block',
              }}>
                {step[`label_${locale}` as const] || step.label_es}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '20px',
                  height: '1px',
                  background: i < currentStep ? '#C9A84C' : 'rgba(255,255,255,0.2)',
                  margin: '0 0.5rem',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Title */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 400,
          color: '#FFFFFF',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          {currentStepData[`label_${locale}` as const] || currentStepData.label_es}
        </h2>

        {/* Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggleSelection(option)}
              style={{
                padding: '1.5rem',
                background: isSelected(option) ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${isSelected(option) ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: isSelected(option) ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  fontWeight: isSelected(option) ? 500 : 400,
                }}>
                  {option}
                </span>
                {isSelected(option) && (
                  <Check size={16} color="#C9A84C" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: currentStep === 0 ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
            {currentT.back}
          </button>

          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              background: '#C9A84C',
              border: 'none',
              color: '#000000',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {isLastStep ? currentT.finish : currentT.next}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
