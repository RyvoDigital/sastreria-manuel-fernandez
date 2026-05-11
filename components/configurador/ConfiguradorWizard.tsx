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
  Ruler,
  Shirt,
  Layers,
  PersonStanding,
  CalendarDays,
  Palette,
  Sun,
  Sparkles,
} from 'lucide-react'

/* ─── 3 main steps ─────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 'fabrics',     label_es: 'Tejidos',      label_en: 'Fabrics',           label_it: 'Tessuti',        label_fr: 'Tissus' },
  { id: 'measurements', label_es: 'Medidas',      label_en: 'Measurements',      label_it: 'Misure',         label_fr: 'Mesures' },
  { id: 'design',      label_es: 'Diseño',       label_en: 'Design',            label_it: 'Design',         label_fr: 'Design' },
]

const STEP_ICONS = [Scissors, Ruler, Shirt]

/* ─── Design sub-categories (shown inside step 3) ──────────────────────────── */

const DESIGN_CATEGORIES = [
  { id: 'jacket',    label_es: 'Chaqueta',   label_en: 'Jacket',    label_it: 'Giacca',   label_fr: 'Veste',    icon: Shirt },
  { id: 'waistcoat', label_es: 'Chaleco',    label_en: 'Waistcoat', label_it: 'Gilet',    label_fr: 'Gilet',    icon: Layers },
  { id: 'trousers',  label_es: 'Pantalón',   label_en: 'Trousers',  label_it: 'Pantaloni', label_fr: 'Pantalon', icon: PersonStanding },
  { id: 'occasion',  label_es: 'Ocasión',    label_en: 'Occasion',  label_it: 'Occasione', label_fr: 'Occasion', icon: CalendarDays },
  { id: 'colour',    label_es: 'Color',      label_en: 'Colour',    label_it: 'Colore',   label_fr: 'Couleur',  icon: Palette },
  { id: 'season',    label_es: 'Temporada',  label_en: 'Season',    label_it: 'Stagione', label_fr: 'Saison',   icon: Sun },
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

/* ─── Measurement labels by locale ─────────────────────────────────────────── */

const MEASURE_LABELS: Record<string, { height: string; chest: string; waist: string; sleeve: string; hint: string }> = {
  es: { height: 'Altura (cm)', chest: 'Pecho (cm)', waist: 'Cintura (cm)', sleeve: 'Largo manga (cm)', hint: 'Introduzca sus medidas corporales para un ajuste preciso' },
  en: { height: 'Height (cm)', chest: 'Chest (cm)', waist: 'Waist (cm)', sleeve: 'Sleeve length (cm)', hint: 'Enter your body measurements for a precise fit' },
  it: { height: 'Altezza (cm)', chest: 'Petto (cm)', waist: 'Vita (cm)', sleeve: 'Lunghezza manica (cm)', hint: 'Inserisci le tue misure corporee per una vestibilità precisa' },
  fr: { height: 'Taille (cm)', chest: 'Poitrine (cm)', waist: 'Taille (cm)', sleeve: 'Longueur manche (cm)', hint: 'Entrez vos mesures corporelles pour un ajustement précis' },
}

const tAll: Record<string, { title: string; subtitle: string; next: string; back: string; finish: string; summary: string; submit: string; step_of: string; validation: string; measurements_validation: string }> = {
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
    measurements_validation: 'Completa todas las medidas para continuar',
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
    measurements_validation: 'Complete all measurements to continue',
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
    measurements_validation: 'Completa tutte le misure per continuare',
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
    measurements_validation: 'Complétez toutes les mesures pour continuer',
  },
}

/* ════════════════════════════════════════════════════════════════════════════
   Main Wizard
   ════════════════════════════════════════════════════════════════════════════ */

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
  const [measurements, setMeasurements] = useState({
    height: '',
    chest: '',
    waist: '',
    sleeve: '',
  })
  const [showValidation, setShowValidation] = useState(false)

  const currentT = tAll[locale] || tAll.es
  const currentStepData = STEPS[currentStep]
  const stepId = currentStepData.id

  const toggleSelection = useCallback((option: string, catId?: string) => {
    const key = catId || stepId
    setSelections((prev) => {
      const current = prev[key] || []
      if (current.includes(option)) {
        return { ...prev, [key]: current.filter((o) => o !== option) }
      }
      return { ...prev, [key]: [...current, option] }
    })
    setShowValidation(false)
  }, [stepId])

  const isSelected = useCallback(
    (option: string, catId?: string) => {
      const key = catId || stepId
      return selections[key]?.includes(option) || false
    },
    [selections, stepId]
  )

  const hasSelection = (selections[stepId] || []).length > 0

  const measurementsComplete =
    measurements.height.trim() !== '' &&
    measurements.chest.trim() !== '' &&
    measurements.waist.trim() !== '' &&
    measurements.sleeve.trim() !== ''

  const designHasSelection = DESIGN_CATEGORIES.some(
    (cat) => (selections[cat.id] || []).length > 0
  )

  const isStepValid = () => {
    if (currentStep === 0) return hasSelection
    if (currentStep === 1) return measurementsComplete
    if (currentStep === 2) return designHasSelection
    return false
  }

  const handleNext = () => {
    if (!isStepValid()) {
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

  const designLabel = (cat: (typeof DESIGN_CATEGORIES)[0]) =>
    (cat[`label_${locale}` as keyof typeof cat] as string) || cat.label_es

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
                {currentStep === 1
                  ? currentT.measurements_validation
                  : currentT.validation}
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
              {/* ── Step 1: Fabric Selection ───────────────────────── */}
              {currentStep === 0 && (
                <>
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
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.875rem',
                      marginBottom: '2.5rem',
                    }}
                  >
                    {(
                      OPTIONS.fabrics?.[locale] ||
                      OPTIONS.fabrics?.es ||
                      []
                    ).map((option: string) => {
                      const selected = isSelected(option, 'fabrics')
                      return (
                        <OptionButton
                          key={option}
                          option={option}
                          selected={selected}
                          onClick={() => toggleSelection(option, 'fabrics')}
                        />
                      )
                    })}
                  </div>
                </>
              )}

              {/* ── Step 2: Measurements ───────────────────────────── */}
              {currentStep === 1 && (
                <>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      marginBottom: '1rem',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {stepLabel(currentStepData)}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.4)',
                      textAlign: 'center',
                      marginBottom: '2rem',
                    }}
                  >
                    {MEASURE_LABELS[locale]?.hint || MEASURE_LABELS.en.hint}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '2.5rem',
                    }}
                  >
                    {(
                      [
                        { key: 'height', label: MEASURE_LABELS[locale]?.height || MEASURE_LABELS.en.height },
                        { key: 'chest', label: MEASURE_LABELS[locale]?.chest || MEASURE_LABELS.en.chest },
                        { key: 'waist', label: MEASURE_LABELS[locale]?.waist || MEASURE_LABELS.en.waist },
                        { key: 'sleeve', label: MEASURE_LABELS[locale]?.sleeve || MEASURE_LABELS.en.sleeve },
                      ] as const
                    ).map(({ key, label }) => (
                      <div key={key} style={{ position: 'relative' }}>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'rgba(196,163,90,0.6)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {label}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={measurements[key as keyof typeof measurements]}
                          onChange={(e) =>
                            setMeasurements((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          onFocus={() => setShowValidation(false)}
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${
                              measurements[key as keyof typeof measurements]
                                ? 'rgba(201,168,76,0.35)'
                                : 'rgba(255,255,255,0.1)'
                            }`,
                            borderRadius: '10px',
                            padding: '0.85rem 1rem',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'border-color 0.25s ease',
                          }}
                          onFocusCapture={(e) => {
                            ;(e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.6)'
                          }}
                          onBlurCapture={(e) => {
                            const val = (e.target as HTMLInputElement).value
                            ;(e.target as HTMLInputElement).style.borderColor = val
                              ? 'rgba(201,168,76,0.35)'
                              : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Step 3: Design & Customization ─────────────────── */}
              {currentStep === 2 && (
                <>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {stepLabel(currentStepData)}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.4)',
                      textAlign: 'center',
                      marginBottom: '2rem',
                    }}
                  >
                    Personalice cada detalle de su prenda
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2rem',
                      marginBottom: '2.5rem',
                      maxHeight: '55vh',
                      overflowY: 'auto',
                      paddingRight: '0.5rem',
                    }}
                  >
                    {DESIGN_CATEGORIES.map((cat) => {
                      const CatIcon = cat.icon
                      const isColour = cat.id === 'colour'
                      const opts =
                        OPTIONS[cat.id]?.[locale] ||
                        OPTIONS[cat.id]?.es ||
                        []

                      return (
                        <div
                          key={cat.id}
                          style={{
                            padding: '1.25rem',
                            background: 'rgba(255,255,255,0.015)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '1rem',
                            }}
                          >
                            <CatIcon size={14} color="rgba(201,168,76,0.6)" />
                            <span
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.65rem',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'rgba(201,168,76,0.7)',
                                fontWeight: 500,
                              }}
                            >
                              {designLabel(cat)}
                            </span>
                          </div>

                          {isColour ? (
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                gap: '0.75rem',
                              }}
                            >
                              {COLOUR_OPTIONS.map((colour) => {
                                const name =
                                  (colour[`name_${locale}` as keyof typeof colour] as string) ||
                                  colour.name_es
                                const selected = isSelected(name, 'colour')
                                return (
                                  <ColourButton
                                    key={colour.hex}
                                    colour={colour}
                                    name={name}
                                    selected={selected}
                                    onClick={() => toggleSelection(name, 'colour')}
                                  />
                                )
                              })}
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                gap: '0.625rem',
                              }}
                            >
                              {opts.map((option: string) => {
                                const selected = isSelected(option, cat.id)
                                return (
                                  <OptionButton
                                    key={option}
                                    option={option}
                                    selected={selected}
                                    onClick={() => toggleSelection(option, cat.id)}
                                    compact
                                  />
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
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
        <SummaryPanel selections={selections} measurements={measurements} locale={locale} />
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

/* ─── Option Button ────────────────────────────────────────────────────────── */

function OptionButton({
  option,
  selected,
  onClick,
  compact,
}: {
  option: string
  selected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: compact ? '0.9rem 1rem' : '1.25rem 1.25rem',
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
          fontSize: compact ? '0.82rem' : '0.88rem',
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
}

/* ─── Colour Button ────────────────────────────────────────────────────────── */

function ColourButton({
  colour,
  name,
  selected,
  onClick,
}: {
  colour: (typeof COLOUR_OPTIONS)[0]
  name: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem 0.75rem',
        background: selected
          ? 'rgba(201,168,76,0.12)'
          : 'rgba(255,255,255,0.02)',
        border: `1.5px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
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
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: colour.hex,
          border: `2.5px solid ${selected ? '#C9A84C' : 'rgba(255,255,255,0.25)'}`,
          boxShadow: selected
            ? '0 0 0 3px rgba(201,168,76,0.25), inset 0 2px 4px rgba(255,255,255,0.15)'
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
            <Check size={14} color="#C9A84C" strokeWidth={3} />
          </div>
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
          fontWeight: selected ? 500 : 400,
        }}
      >
        {name}
      </span>
    </button>
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
  measurements,
  locale,
}: {
  selections: Record<string, string[]>
  measurements: { height: string; chest: string; waist: string; sleeve: string }
  locale: string
}) {
  const hasAnyDesign = DESIGN_CATEGORIES.some(
    (cat) => (selections[cat.id] || []).length > 0
  )
  const hasFabrics = (selections.fabrics || []).length > 0
  const hasMeasurements = Object.values(measurements).some((v) => v.trim() !== '')
  const hasAny = hasFabrics || hasMeasurements || hasAnyDesign

  const t = {
    es: { title: 'Tu selección', empty: 'Aún no has seleccionado nada', fabrics: 'Tejidos', measurements: 'Medidas', design: 'Diseño' },
    en: { title: 'Your selection', empty: 'You have not selected anything yet', fabrics: 'Fabrics', measurements: 'Measurements', design: 'Design' },
    it: { title: 'La tua selezione', empty: 'Non hai ancora selezionato nulla', fabrics: 'Tessuti', measurements: 'Misure', design: 'Design' },
    fr: { title: 'Votre sélection', empty: "Vous n'avez encore rien sélectionné", fabrics: 'Tissus', measurements: 'Mesures', design: 'Design' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Fabrics */}
          {hasFabrics && (
            <SummaryGroup
              icon={<Scissors size={12} color="rgba(201,168,76,0.6)" />}
              label={currentT.fabrics}
              items={selections.fabrics}
            />
          )}

          {/* Measurements */}
          {hasMeasurements && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.4rem',
                }}
              >
                <Ruler size={12} color="rgba(201,168,76,0.6)" />
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
                  {currentT.measurements}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Object.entries(measurements)
                  .filter(([, v]) => v.trim() !== '')
                  .map(([k, v]) => (
                    <span
                      key={k}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.8)',
                        padding: '0.3rem 0.6rem',
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      {k}: {v}cm
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Design categories */}
          {DESIGN_CATEGORIES.map((cat) => {
            const selected = selections[cat.id] || []
            if (selected.length === 0) return null
            const label =
              (cat[`label_${locale}` as keyof typeof cat] as string) || cat.label_es
            const CatIcon = cat.icon

            return (
              <SummaryGroup
                key={cat.id}
                icon={<CatIcon size={12} color="rgba(201,168,76,0.6)" />}
                label={label}
                items={selected}
              />
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

/* ─── Summary Group helper ─────────────────────────────────────────────────── */

function SummaryGroup({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode
  label: string
  items: string[]
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '0.4rem',
        }}
      >
        {icon}
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
        {items.map((item) => (
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
}
