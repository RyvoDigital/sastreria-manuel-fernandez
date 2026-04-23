'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

const STEPS = [
  { id: 'fabrics', label_es: 'Tejidos', label_en: 'Fabrics', label_it: 'Tessuti', label_fr: 'Tissus' },
  { id: 'jacket', label_es: 'Chaqueta', label_en: 'Jacket', label_it: 'Giacca', label_fr: 'Veste' },
  { id: 'waistcoat', label_es: 'Chaleco', label_en: 'Waistcoat', label_it: 'Gilet', label_fr: 'Gilet' },
  { id: 'trousers', label_es: 'Pantalón', label_en: 'Trousers', label_it: 'Pantaloni', label_fr: 'Pantalon' },
  { id: 'occasion', label_es: 'Ocasión', label_en: 'Occasion', label_it: 'Occasione', label_fr: 'Occasion' },
  { id: 'colour', label_es: 'Color', label_en: 'Colour', label_it: 'Colore', label_fr: 'Couleur' },
  { id: 'season', label_es: 'Temporada', label_en: 'Season', label_it: 'Stagione', label_fr: 'Saison' },
]

const COLOUR_OPTIONS = [
  { name_es: 'Negro', name_en: 'Black', name_it: 'Nero', name_fr: 'Noir', hex: '#1a1a1a' },
  { name_es: 'Azul marino', name_en: 'Navy', name_it: 'Blu navy', name_fr: 'Bleu marine', hex: '#1a2744' },
  { name_es: 'Carbón', name_en: 'Charcoal', name_it: 'Carbone', name_fr: 'Anthracite', hex: '#36454F' },
  { name_es: 'Gris medio', name_en: 'Mid grey', name_it: 'Grigio medio', name_fr: 'Gris moyen', hex: '#7a7a7a' },
  { name_es: 'Beige', name_en: 'Beige', name_it: 'Beige', name_fr: 'Beige', hex: '#C4A882' },
  { name_es: 'Burdeos', name_en: 'Burgundy', name_it: 'Bordeaux', name_fr: 'Bordeaux', hex: '#800020' },
  { name_es: 'Verde botella', name_en: 'Bottle green', name_it: 'Verde bottiglia', name_fr: 'Vert bouteille', hex: '#1a472a' },
  { name_es: 'Camel', name_en: 'Camel', name_it: 'Cammello', name_fr: 'Camel', hex: '#C19A6B' },
]

const OPTIONS: Record<string, Record<string, string[]>> = {
  fabrics: {
    es: ['Príncipe de Gales', 'Pata de gallo', 'Raya diplomática', 'Lisos'],
    en: ['Prince of Wales', 'Houndstooth', 'Diplomacy stripe', 'Solids'],
    it: ['Principe di Galles', 'Pied-de-poule', 'Riga diplomatica', 'Tinta unita'],
    fr: ['Prince de Galles', 'Pied-de-poule', 'Rayure diplomatique', 'Unis'],
  },
  jacket: {
    es: ['Solapa clásica', 'Solapa pico', '2 botones', 'Doble botonadura', 'Ajustado', 'Confort'],
    en: ['Classic lapel', 'Peak lapel', '2 buttons', 'Double-breasted', 'Slim fit', 'Relaxed fit'],
    it: ['Revers classico', 'Revers a punta', '2 bottoni', 'Doppiopetto', 'Aderente', 'Comodo'],
    fr: ['Revers classique', 'Revers pointu', '2 boutons', 'Croisé', 'Ajusté', 'Confort'],
  },
  waistcoat: {
    es: ['Clásico', 'Doble botonadura'],
    en: ['Classic', 'Double-breasted'],
    it: ['Classico', 'Doppiopetto'],
    fr: ['Classique', 'Croisé'],
  },
  trousers: {
    es: ['Tiro alto', 'Tiro bajo', 'Cinturón', 'Tirantes', 'Con vuelta', 'Sin vuelta'],
    en: ['High rise', 'Low rise', 'Belt', 'Braces', 'With cuff', 'No cuff'],
    it: ['Vita alta', 'Vita bassa', 'Cintura', 'Bretelle', 'Con risvolto', 'Senza risvolto'],
    fr: ['Taille haute', 'Taille basse', 'Ceinture', 'Bretelles', 'Avec revers', 'Sans revers'],
  },
  occasion: {
    es: ['Boda', 'Negocios', 'Ceremonia', 'Casual elegante', 'Imagen clásica', 'Imagen moderna'],
    en: ['Wedding', 'Business', 'Ceremony', 'Smart casual', 'Classic image', 'Modern image'],
    it: ['Matrimonio', 'Business', 'Cerimonia', 'Casual elegante', 'Immagine classica', 'Immagine moderna'],
    fr: ['Mariage', 'Business', 'Cérémonie', 'Décontracté chic', 'Image classique', 'Image moderne'],
  },
  season: {
    es: ['Primavera/Verano', 'Otoño/Invierno', 'Uso diario', 'Eventos especiales'],
    en: ['Spring/Summer', 'Autumn/Winter', 'Daily use', 'Special events'],
    it: ['Primavera/Estate', 'Autunno/Inverno', 'Uso quotidiano', 'Eventi speciali'],
    fr: ['Printemps/Été', 'Automne/Hiver', 'Usage quotidien', 'Événements spéciaux'],
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
    colour: [],
    season: [],
  })

  const t: Record<string, { title: string; subtitle: string; next: string; back: string; finish: string; summary: string; submit: string }> = {
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
    it: {
      title: 'Configura il tuo Abito',
      subtitle: 'Seleziona le tue preferenze passo dopo passo',
      next: 'Avanti',
      back: 'Indietro',
      finish: 'Termina',
      summary: 'Riepilogo',
      submit: 'Invia Configurazione',
    },
    fr: {
      title: 'Configurez votre Costume',
      subtitle: 'Sélectionnez vos préférences étape par étape',
      next: 'Suivant',
      back: 'Précédent',
      finish: 'Terminer',
      summary: 'Résumé',
      submit: 'Envoyer la Configuration',
    },
  }

  const currentT = t[locale] || t.es
  const currentStepData = STEPS[currentStep]
  const stepId = currentStepData.id

  const toggleSelection = (option: string) => {
    setSelections(prev => {
      const current = prev[stepId] || []
      if (current.includes(option)) {
        return { ...prev, [stepId]: current.filter(o => o !== option) }
      }
      return { ...prev, [stepId]: [...current, option] }
    })
  }

  const isSelected = (option: string) => {
    return selections[stepId]?.includes(option) || false
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

  const stepLabel = (step: typeof STEPS[0]) => step[`label_${locale}` as keyof typeof step] as string || step.label_es

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
              }} className="mf-step-label">
                {stepLabel(step)}
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
          {stepLabel(currentStepData)}
        </h2>

        {/* Colour Picker Step */}
        {stepId === 'colour' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}>
            {COLOUR_OPTIONS.map((colour) => {
              const name = colour[`name_${locale}` as keyof typeof colour] as string || colour.name_es
              const selected = isSelected(name)
              return (
                <button
                  key={colour.hex}
                  onClick={() => toggleSelection(name)}
                  style={{
                    padding: '1.5rem 1rem',
                    background: selected ? 'rgba(201,168,76,0.15)' : 'transparent',
                    border: `1px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: colour.hex,
                    border: `2px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.3)'}`,
                    boxShadow: selected ? '0 0 0 3px rgba(201,168,76,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    fontWeight: selected ? 500 : 400,
                  }}>
                    {name}
                  </span>
                  {selected && <Check size={16} color="#C9A84C" />}
                </button>
              )
            })}
          </div>
        ) : (
          /* Standard Options Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}>
            {(OPTIONS[stepId]?.[locale] || OPTIONS[stepId]?.es || []).map((option: string) => (
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
        )}

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
