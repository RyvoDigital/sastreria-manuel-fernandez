'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Scissors,
  Shirt,
  Layers,
  PersonStanding,
  CalendarDays,
  Palette,
  Sun,
  Sparkles,
} from 'lucide-react'

const STEPS = [
  { id: 'fabrics', label_es: 'Tejidos', label_en: 'Fabrics', label_it: 'Tessuti', label_fr: 'Tissus' },
  { id: 'jacket', label_es: 'Chaqueta', label_en: 'Jacket', label_it: 'Giacca', label_fr: 'Veste' },
  { id: 'waistcoat', label_es: 'Chaleco', label_en: 'Waistcoat', label_it: 'Gilet', label_fr: 'Gilet' },
  { id: 'trousers', label_es: 'Pantalón', label_en: 'Trousers', label_it: 'Pantaloni', label_fr: 'Pantalon' },
  { id: 'occasion', label_es: 'Ocasión', label_en: 'Occasion', label_it: 'Occasione', label_fr: 'Occasion' },
  { id: 'colour', label_es: 'Color', label_en: 'Colour', label_it: 'Colore', label_fr: 'Couleur' },
  { id: 'season', label_es: 'Temporada', label_en: 'Season', label_it: 'Stagione', label_fr: 'Saison' },
]

const STEP_ICONS = [Scissors, Shirt, Layers, PersonStanding, CalendarDays, Palette, Sun]

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

const tAll: Record<string, { title: string; subtitle: string; next: string; back: string; finish: string; summary: string; submit: string; step_of: string; validation: string }> = {
  es: {
    title: 'Configura tu Traje',
    subtitle: 'Selecciona tus preferencias paso a paso',
    next: 'Siguiente',
    back: 'Anterior',
    finish: 'Finalizar',
    summary: 'Resumen',
    submit: 'Enviar Configuración',
    step_of: 'Paso {current} de {total}',
    validation: 'Selecciona al menos una opción para continuar',
  },
  en: {
    title: 'Configure your Suit',
    subtitle: 'Select your preferences step by step',
    next: 'Next',
    back: 'Back',
    finish: 'Finish',
    summary: 'Summary',
    submit: 'Submit Configuration',
    step_of: 'Step {current} of {total}',
    validation: 'Select at least one option to continue',
  },
  it: {
    title: 'Configura il tuo Abito',
    subtitle: 'Seleziona le tue preferenze passo dopo passo',
    next: 'Avanti',
    back: 'Indietro',
    finish: 'Termina',
    summary: 'Riepilogo',
    submit: 'Invia Configurazione',
    step_of: 'Passo {current} di {total}',
    validation: 'Seleziona almeno un\'opzione per continuare',
  },
  fr: {
    title: 'Configurez votre Costume',
    subtitle: 'Sélectionnez vos préférences étape par étape',
    next: 'Suivant',
    back: 'Précédent',
    finish: 'Terminer',
    summary: 'Résumé',
    submit: 'Envoyer la Configuration',
    step_of: 'Étape {current} sur {total}',
    validation: 'Sélectionnez au moins une option pour continuer',
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
  const [showValidation, setShowValidation] = useState(false)

  const currentT = tAll[locale] || tAll.es
  const currentStepData = STEPS[currentStep]
  const stepId = currentStepData.id

  const toggleSelection = useCallback((option: string) => {
    setSelections((prev) => {
      const current = prev[stepId] || []
      if (current.includes(option)) {
        return { ...prev, [stepId]: current.filter((o) => o !== option) }
      }
      return { ...prev, [stepId]: [...current, option] }
    })
    setShowValidation(false)
  }, [stepId])

  const isSelected = useCallback(
    (option: string) => selections[stepId]?.includes(option) || false,
    [selections, stepId]
  )

  const hasSelection = (selections[stepId] || []).length > 0

  const handleNext = () => {
    if (!hasSelection) {
      setShowValidation(true)
      return
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setShowValidation(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setShowValidation(false)
    }
  }

  const isLastStep = currentStep === STEPS.length - 1

  const stepLabel = (step: (typeof STEPS)[0]) =>
    (step[`label_${locale}` as keyof typeof step] as string) || step.label_es

  const StepIcon = STEP_ICONS[currentStep]

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 'clamp(5rem, 10vh, 7rem) var(--container-padding) 4rem',
        background: `
          radial-gradient(ellipse at 15% 85%, rgba(201,168,76,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 15%, rgba(201,168,76,0.03) 0%, transparent 50%),
          #0A1628
        `,
        position: 'relative',
      }}
    >
      {/* Top gold line */}
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

      <div
        className="wizard-grid"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Main wizard card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                marginBottom: '1rem',
              }}
            >
              <StepIcon size={22} color="#C9A84C" strokeWidth={1.5} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#FFFFFF',
                marginBottom: '0.4rem',
                lineHeight: 1.2,
              }}
            >
              {currentT.title}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '0.5rem',
              }}
            >
              {currentT.subtitle}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}
            >
              {currentT.step_of
                .replace('{current}', String(currentStep + 1))
                .replace('{total}', String(STEPS.length))}
            </p>
          </div>

          {/* Progress bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {STEPS.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.25rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i <= currentStep ? '#C9A84C' : 'transparent',
                    border: `1.5px solid ${i <= currentStep ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                    color: i <= currentStep ? '#000000' : 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    flexShrink: 0,
                    transition: 'all 0.4s ease',
                  }}
                >
                  {i < currentStep ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      borderRadius: '1px',
                      background:
                        i < currentStep
                          ? '#C9A84C'
                          : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.4s ease',
                      minWidth: '8px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step labels row (desktop only) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginBottom: '2rem',
              marginTop: '-1.5rem',
            }}
          >
            {STEPS.map((step, i) => (
              <div key={step.id} style={{ flex: 1, textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: i === currentStep ? '#C9A84C' : 'rgba(255,255,255,0.25)',
                    fontWeight: i === currentStep ? 500 : 400,
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stepLabel(step)}
                </span>
              </div>
            ))}
          </div>

          {/* Validation message */}
          <AnimatePresence>
            {showValidation && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  padding: '0.6rem 1rem',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                }}
              >
                <AlertCircle size={14} />
                {currentT.validation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content with transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Step Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '1.75rem',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                {stepLabel(currentStepData)}
              </h2>

              {/* Colour Picker Step */}
              {stepId === 'colour' ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                  }}
                >
                  {COLOUR_OPTIONS.map((colour) => {
                    const name =
                      (colour[`name_${locale}` as keyof typeof colour] as string) || colour.name_es
                    const selected = isSelected(name)
                    return (
                      <button
                        key={colour.hex}
                        onClick={() => toggleSelection(name)}
                        style={{
                          padding: '1.25rem 1rem',
                          background: selected
                            ? 'rgba(201,168,76,0.12)'
                            : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.75rem',
                          boxShadow: selected
                            ? '0 0 0 3px rgba(201,168,76,0.15)'
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) {
                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: colour.hex,
                            border: `2.5px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.25)'}`,
                            boxShadow: selected
                              ? '0 0 0 4px rgba(201,168,76,0.25), inset 0 2px 4px rgba(255,255,255,0.15)'
                              : 'inset 0 2px 4px rgba(255,255,255,0.1)',
                            transition: 'all 0.25s ease',
                            position: 'relative',
                          }}
                        >
                          {selected && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Check size={16} color="#C9A84C" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                            fontWeight: selected ? 500 : 400,
                          }}
                        >
                          {name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                /* Standard Options Grid */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.875rem',
                    marginBottom: '2.5rem',
                  }}
                >
                  {(
                    OPTIONS[stepId]?.[locale] ||
                    OPTIONS[stepId]?.es ||
                    []
                  ).map((option: string) => {
                    const selected = isSelected(option)
                    return (
                      <button
                        key={option}
                        onClick={() => toggleSelection(option)}
                        style={{
                          padding: '1.25rem 1.25rem',
                          background: selected
                            ? 'rgba(201,168,76,0.12)'
                            : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          boxShadow: selected
                            ? '0 0 0 3px rgba(201,168,76,0.15)'
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) {
                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.88rem',
                            color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                            fontWeight: selected ? 500 : 400,
                            lineHeight: 1.4,
                          }}
                        >
                          {option}
                        </span>
                        {selected && (
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: '#C9A84C',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Check size={13} color="#000000" strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <NavButton
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ChevronLeft size={16} />
              {currentT.back}
            </NavButton>

            <NavButton onClick={handleNext} variant="primary">
              {isLastStep ? currentT.finish : currentT.next}
              <ChevronRight size={16} />
            </NavButton>
          </div>
        </motion.div>

        {/* Summary sidebar */}
        <SummaryPanel selections={selections} locale={locale} />
      </div>

      {/* Mobile: stack summary below */}
      <style jsx>{`
        @media (max-width: 900px) {
          .wizard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ─── Nav Button ─── */

function NavButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant: 'primary' | 'outline'
}) {
  const [hovered, setHovered] = useState(false)

  const isPrimary = variant === 'primary'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.75rem',
        background: isPrimary
          ? hovered && !disabled
            ? '#D4B55A'
            : '#C9A84C'
          : 'transparent',
        border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.2)',
        color: isPrimary
          ? '#000000'
          : disabled
            ? 'rgba(255,255,255,0.3)'
            : '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        fontWeight: isPrimary ? 600 : 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        borderRadius: '8px',
        transition: 'all 0.25s ease',
        boxShadow:
          isPrimary && hovered && !disabled
            ? '0 6px 20px rgba(201,168,76,0.25)'
            : 'none',
        transform: isPrimary && hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {children}
    </button>
  )
}

/* ─── Summary Panel ─── */

function SummaryPanel({
  selections,
  locale,
}: {
  selections: Record<string, string[]>
  locale: string
}) {
  const hasAny = Object.values(selections).some((arr) => arr.length > 0)

  const t = {
    es: { title: 'Tu selección', empty: 'Aún no has seleccionado nada' },
    en: { title: 'Your selection', empty: 'You have not selected anything yet' },
    it: { title: 'La tua selezione', empty: 'Non hai ancora selezionato nulla' },
    fr: { title: 'Votre sélection', empty: "Vous n'avez encore rien sélectionné" },
  }
  const currentT = t[locale as keyof typeof t] || t.es

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        position: 'sticky',
        top: '100px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.25rem',
        }}
      >
        <Sparkles size={16} color="#C9A84C" />
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
          }}
        >
          {currentT.title}
        </h3>
      </div>

      {!hasAny ? (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}
        >
          {currentT.empty}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {STEPS.map((step, i) => {
            const selected = selections[step.id] || []
            if (selected.length === 0) return null
            const label =
              (step[`label_${locale}` as keyof typeof step] as string) || step.label_es
            const Icon = STEP_ICONS[i]

            return (
              <div key={step.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  <Icon size={12} color="rgba(201,168,76,0.6)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(201,168,76,0.7)',
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selected.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.8)',
                        padding: '0.3rem 0.6rem',
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
