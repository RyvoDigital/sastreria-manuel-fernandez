'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useSettings } from '@/lib/settings-provider'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Check,
  Loader2,
  ArrowLeft,
  Video,
  MapPin,
  X,
} from 'lucide-react'

const WEEKDAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const SATURDAY_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']

export type BookingType = 'inperson' | 'videocall'

interface BookingCalendarProps {
  type: BookingType
  onFreeSubmit?: (data: {
    name: string
    email: string
    date: string
    time: string
  }) => Promise<void>
  onStripeCheckout?: (data: {
    name: string
    email: string
    date: string
    time: string
  }) => Promise<void>
  onBack?: () => void
}

export function BookingCalendar({ type, onFreeSubmit, onStripeCheckout, onBack }: BookingCalendarProps) {
  const { t, locale } = useI18n()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'calendar' | 'details'>('calendar')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const isVideocall = type === 'videocall'
  const { getPrice } = useSettings()
  const videocallPrice = getPrice('videollamada') || 50

  const monthNames: Record<string, string[]> = {
    es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    it: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  }

  const labels = {
    es: {
      title: isVideocall ? 'Reservar Videollamada' : 'Reservar Cita Presencial',
      subtitle: 'Revisa nuestra disponibilidad y reserva la fecha y hora que más te convengan',
      selectDateTime: 'Selecciona fecha y hora',
      timezone: 'hora de verano de Europa central (CEST)',
      serviceDetails: 'Detalles del servicio',
      availability: 'Disponibilidad para:',
      next: 'Siguiente',
      back: 'Volver',
      confirm: isVideocall ? 'Pagar y Reservar' : 'Confirmar Reserva',
      name: 'Nombre completo',
      email: 'Correo electrónico',
      namePlaceholder: 'Tu nombre',
      emailPlaceholder: 'correo@ejemplo.com',
      fillFields: 'Completa todos los campos',
      invalidEmail: 'Introduce un email válido',
      conflict: 'Esta franja horaria ya está reservada. Por favor, elige otra.',
      successTitle: '¡Reserva confirmada!',
      successMsg: isVideocall
        ? 'Te redirigiremos al pago para confirmar tu videollamada.'
        : 'Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.',
      serviceName: isVideocall ? 'Videollamada de asesoría' : 'Cita presencial en taller',
      serviceDesc: isVideocall
        ? 'Consulta personalizada de 20-25 minutos por videollamada con nuestros expertos.'
        : 'Visita a nuestro taller en Madrid para tomar medidas y conocernos.',
      duration: isVideocall ? '20-25 minutos' : '45-60 minutos',
      price: isVideocall ? `€${videocallPrice}` : 'Gratis',
      location: 'Madrid',
    },
    en: {
      title: isVideocall ? 'Book Video Call' : 'Book In-Person Appointment',
      subtitle: 'Check our availability and book the date and time that suits you best',
      selectDateTime: 'Select date and time',
      timezone: 'Central European Summer Time (CEST)',
      serviceDetails: 'Service details',
      availability: 'Availability for:',
      next: 'Next',
      back: 'Back',
      confirm: isVideocall ? 'Pay & Book' : 'Confirm Booking',
      name: 'Full name',
      email: 'Email address',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'email@example.com',
      fillFields: 'Please fill in all fields',
      invalidEmail: 'Please enter a valid email',
      conflict: 'This time slot is already booked. Please choose another.',
      successTitle: 'Booking confirmed!',
      successMsg: isVideocall
        ? 'We will redirect you to payment to confirm your video call.'
        : 'We have received your request. We will contact you soon.',
      serviceName: isVideocall ? 'Video consultation' : 'In-person atelier visit',
      serviceDesc: isVideocall
        ? 'Personalized 20-25 minute video call consultation with our experts.'
        : 'Visit our atelier in Madrid for measurements and to meet us.',
      duration: isVideocall ? '20-25 minutes' : '45-60 minutes',
      price: isVideocall ? `€${videocallPrice}` : 'Free',
      location: 'Madrid',
    },
    it: {
      title: isVideocall ? 'Prenota Videochiamata' : 'Prenota Appuntamento in Sede',
      subtitle: 'Controlla la nostra disponibilità e prenota la data e l\'ora che preferisci',
      selectDateTime: 'Seleziona data e ora',
      timezone: 'Ora legale dell\'Europa centrale (CEST)',
      serviceDetails: 'Dettagli del servizio',
      availability: 'Disponibilità per:',
      next: 'Avanti',
      back: 'Indietro',
      confirm: isVideocall ? 'Paga e Prenota' : 'Conferma Prenotazione',
      name: 'Nome completo',
      email: 'Indirizzo email',
      namePlaceholder: 'Il tuo nome',
      emailPlaceholder: 'email@esempio.com',
      fillFields: 'Compila tutti i campi',
      invalidEmail: 'Inserisci un email valida',
      conflict: 'Questa fascia oraria è già prenotata. Scegli un\'altra.',
      successTitle: 'Prenotazione confermata!',
      successMsg: isVideocall
        ? 'Ti reindirizzeremo al pagamento per confermare la tua videochiamata.'
        : 'Abbiamo ricevuto la tua richiesta. Ti contatteremo presto.',
      serviceName: isVideocall ? 'Consulenza video' : 'Visita in sede a Madrid',
      serviceDesc: isVideocall
        ? 'Consulenza personalizzata di 20-25 minuti in videochiamata con i nostri esperti.'
        : 'Visita il nostro atelier a Madrid per le misure e conoscerci.',
      duration: isVideocall ? '20-25 minuti' : '45-60 minuti',
      price: isVideocall ? `€${videocallPrice}` : 'Gratuito',
      location: 'Madrid',
    },
    fr: {
      title: isVideocall ? 'Réserver Visioconférence' : 'Réserver Rendez-vous en Atelier',
      subtitle: 'Consultez nos disponibilités et réservez la date et l\'heure qui vous conviennent',
      selectDateTime: 'Sélectionnez date et heure',
      timezone: 'Heure d\'été d\'Europe centrale (CEST)',
      serviceDetails: 'Détails du service',
      availability: 'Disponibilité pour:',
      next: 'Suivant',
      back: 'Retour',
      confirm: isVideocall ? 'Payer et Réserver' : 'Confirmer le Rendez-vous',
      name: 'Nom complet',
      email: 'Adresse email',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'email@exemple.com',
      fillFields: 'Veuillez remplir tous les champs',
      invalidEmail: 'Veuillez entrer un email valide',
      conflict: 'Ce créneau horaire est déjà réservé. Veuillez en choisir un autre.',
      successTitle: 'Rendez-vous confirmé!',
      successMsg: isVideocall
        ? 'Nous allons vous rediriger vers le paiement pour confirmer votre visioconférence.'
        : 'Nous avons reçu votre demande. Nous vous contacterons bientôt.',
      serviceName: isVideocall ? 'Consultation vidéo' : 'Visite en atelier à Madrid',
      serviceDesc: isVideocall
        ? 'Consultation personnalisée de 20-25 minutes par visioconférence avec nos experts.'
        : 'Visitez notre atelier à Madrid pour les mesures et nous rencontrer.',
      duration: isVideocall ? '20-25 minutes' : '45-60 minutes',
      price: isVideocall ? `€${videocallPrice}` : 'Gratuit',
      location: 'Madrid',
    },
  }

  const l = labels[locale as keyof typeof labels] || labels.es
  const months = monthNames[locale as keyof typeof monthNames] || monthNames.es

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxBookableDate = new Date()
  maxBookableDate.setDate(maxBookableDate.getDate() + 30)
  maxBookableDate.setHours(0, 0, 0, 0)

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    let startOffset = firstDayOfMonth.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const days: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    return days
  }, [currentMonth])

  const getSlotsForDate = (date: Date | null) => {
    if (!date) return TIME_SLOTS
    const day = date.getDay()
    const isSaturday = day === 6
    return isSaturday ? SATURDAY_SLOTS : TIME_SLOTS
  }

  const isPast = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  const isBeyond30Days = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d > maxBookableDate
  }

  const isSunday = (date: Date) => date.getDay() === 0

  const formatDateLong = (date: Date) => {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
    return date.toLocaleDateString(
      locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'en-GB',
      opts
    )
  }

  const formatDateShort = (date: Date) => {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
    return date.toLocaleDateString(
      locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'en-GB',
      opts
    )
  }

  const fetchAvailability = async (dateStr: string) => {
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/bookings/availability?date=${dateStr}`)
      const data = await res.json()
      if (data.success) {
        setBookedSlots(data.bookedTimes)
      }
    } catch (err) {
      console.error('Failed to fetch availability', err)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    if (isPast(date) || isSunday(date) || isBeyond30Days(date)) return
    setSelectedDate(date)
    setSelectedTime(null)
    fetchAvailability(date.toISOString().split('T')[0])
  }

  const handleNext = () => {
    if (!selectedDate || !selectedTime) return
    setStep('details')
  }

  const handleSubmit = async () => {
    setError(null)
    if (!selectedDate || !selectedTime) return
    if (!name.trim() || !email.trim()) {
      setError(l.fillFields)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(l.invalidEmail)
      return
    }

    setIsSubmitting(true)
    try {
      if (isVideocall && onStripeCheckout) {
        await onStripeCheckout({
          name: name.trim(),
          email: email.trim(),
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
        })
        setSuccess(true)
      } else if (onFreeSubmit) {
        await onFreeSubmit({
          name: name.trim(),
          email: email.trim(),
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
        })
        setSuccess(true)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      if (msg === 'conflict' || msg.toLowerCase().includes('already booked') || msg.toLowerCase().includes('ya está') || msg.toLowerCase().includes('già prenotata') || msg.toLowerCase().includes('déjà réservé')) {
        setError(l.conflict)
        // Refresh availability to show updated state
        if (selectedDate) {
          fetchAvailability(selectedDate.toISOString().split('T')[0])
        }
      } else {
        setError(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    // Don't allow navigating beyond the month that contains maxBookableDate
    const maxMonth = new Date(maxBookableDate.getFullYear(), maxBookableDate.getMonth(), 1)
    if (next > maxMonth) return
    setCurrentMonth(next)
  }

  const handleCloseSuccess = () => {
    setSuccess(false)
    setCancelled(false)
    setCancelError(null)
    setStep('calendar')
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setEmail('')
    setBookedSlots([])
    setError(null)
  }

  const handleCancel = async () => {
    if (!selectedDate || !selectedTime || !email) return
    setIsCancelling(true)
    setCancelError(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
        }),
      })
      if (res.ok) {
        setCancelled(true)
      } else {
        const data = await res.json()
        setCancelError(data.error || 'Failed to cancel')
      }
    } catch {
      setCancelError('Network error')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'clamp(5rem, 10vh, 7rem) var(--container-padding) 4rem',
      background: '#0A1628',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
              marginBottom: '1.5rem', padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            {l.back}
          </button>
        )}

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400, fontStyle: 'italic', color: '#FFFFFF', marginBottom: '0.5rem', lineHeight: 1.2,
          }}>
            {l.title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)',
          }}>
            {l.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'start',
              }}>
                {/* LEFT: Calendar + Time slots */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem',
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic',
                      fontWeight: 400, color: '#FFFFFF',
                    }}>
                      {l.selectDateTime}
                    </h2>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)',
                    }}>
                      {l.timezone}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}>
                    <button
                      onClick={prevMonth}
                      style={{
                        background: 'transparent', border: 'none', color: '#C9A84C',
                        cursor: 'pointer', padding: '0.5rem',
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#FFFFFF',
                      fontWeight: 500, minWidth: '140px', textAlign: 'center',
                    }}>
                      {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={nextMonth}
                      style={{
                        background: 'transparent', border: 'none', color: '#C9A84C',
                        cursor: 'pointer', padding: '0.5rem',
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}>
                    {WEEKDAYS.map((d) => (
                      <div key={d} style={{
                        textAlign: 'center', fontFamily: 'var(--font-sans)',
                        fontSize: '0.65rem', textTransform: 'uppercase',
                        letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)',
                      }}>
                        {d}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem',
                    marginBottom: '2rem',
                  }}>
                    {calendarDays.map((day, i) => {
                      if (!day) return <div key={`empty-${i}`} />
                      const isSelected = selectedDate?.toDateString() === day.toDateString()
                      const disabled = isPast(day) || isSunday(day) || isBeyond30Days(day)
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => handleDateSelect(day)}
                          disabled={disabled}
                          style={{
                            aspectRatio: '1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: isSelected ? '#C9A84C' : 'transparent',
                            color: disabled ? 'rgba(255,255,255,0.15)' : isSelected ? '#000' : '#fff',
                            fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            if (!disabled && !isSelected) {
                              e.currentTarget.style.background = 'rgba(201,168,76,0.15)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!disabled && !isSelected) {
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          {day.getDate()}
                          {!disabled && (
                            <span style={{
                              position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
                              width: '3px', height: '3px', borderRadius: '50%',
                              background: isSelected ? '#000' : '#C9A84C',
                            }} />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.7)', marginBottom: '1rem',
                      }}>
                        {l.availability} {formatDateLong(selectedDate)}
                      </p>
                      {loadingSlots ? (
                        <p style={{
                          fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '1rem',
                        }}>
                          Cargando disponibilidad...
                        </p>
                      ) : (
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.6rem',
                        }}>
                          {getSlotsForDate(selectedDate).map((time) => {
                            const isBooked = bookedSlots.includes(time)
                            return (
                              <button
                                key={time}
                                onClick={() => !isBooked && setSelectedTime(time)}
                                disabled={isBooked}
                                style={{
                                  padding: '0.75rem 0.5rem',
                                  background: selectedTime === time ? '#C9A84C' : isBooked ? 'rgba(255,255,255,0.02)' : 'transparent',
                                  border: `1.5px solid ${selectedTime === time ? '#C9A84C' : isBooked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)'}`,
                                  borderRadius: '6px',
                                  color: selectedTime === time ? '#000' : isBooked ? 'rgba(255,255,255,0.2)' : '#fff',
                                  fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                                  cursor: isBooked ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease',
                                  textDecoration: isBooked ? 'line-through' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isBooked && selectedTime !== time) {
                                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isBooked && selectedTime !== time) {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                                  }
                                }}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* RIGHT: Service details */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: 16,
                  padding: '2rem',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic',
                    fontWeight: 400, color: '#FFFFFF', marginBottom: '1.5rem',
                  }}>
                    {l.serviceDetails}
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                      color: '#C9A84C', marginBottom: '0.5rem', fontWeight: 500,
                    }}>
                      {l.serviceName}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
                    }}>
                      {l.serviceDesc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    marginBottom: '2rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Clock size={14} color="#C9A84C" />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {l.duration}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {isVideocall ? <Video size={14} color="#C9A84C" /> : <MapPin size={14} color="#C9A84C" />}
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {isVideocall ? 'Zoom / Google Meet' : l.location}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CalendarIcon size={14} color="#C9A84C" />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {l.price}
                      </span>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div style={{
                      padding: '1rem', background: 'rgba(201,168,76,0.06)',
                      borderRadius: 10, marginBottom: '1.5rem',
                    }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#C9A84C', margin: 0 }}>
                        {formatDateShort(selectedDate)} · {selectedTime}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                    style={{
                      width: '100%', padding: '1rem',
                      background: selectedDate && selectedTime ? '#C9A84C' : 'rgba(201,168,76,0.2)',
                      border: 'none', borderRadius: 8,
                      color: selectedDate && selectedTime ? '#000' : 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                      fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {l.next}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 560, margin: '0 auto' }}
            >
              <button
                onClick={() => setStep('calendar')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                  marginBottom: '1.5rem', padding: 0,
                }}
              >
                <ArrowLeft size={16} />
                {l.back}
              </button>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 16,
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontStyle: 'italic',
                  fontWeight: 400, color: '#FFFFFF', marginBottom: '1.5rem',
                }}>
                  {l.selectDateTime}
                </h2>

                {selectedDate && selectedTime && (
                  <div style={{
                    padding: '1rem 1.25rem', background: 'rgba(201,168,76,0.06)',
                    borderRadius: 10, marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    <CalendarIcon size={18} color="#C9A84C" />
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#C9A84C', margin: 0, fontWeight: 500 }}>
                        {formatDateLong(selectedDate)}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '0.15rem 0 0' }}>
                        {selectedTime} · {l.duration}
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem',
                    }}>
                      <User size={12} />
                      {l.name}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={l.namePlaceholder}
                      style={{
                        width: '100%', padding: '0.875rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, color: '#FFFFFF',
                        fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                        outline: 'none', transition: 'border-color 0.25s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem',
                    }}>
                      <Mail size={12} />
                      {l.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={l.emailPlaceholder}
                      style={{
                        width: '100%', padding: '0.875rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, color: '#FFFFFF',
                        fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                        outline: 'none', transition: 'border-color 0.25s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                      color: '#e57373', marginBottom: '1rem', textAlign: 'center',
                    }}
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: '100%', padding: '1rem',
                    background: '#C9A84C', border: 'none', borderRadius: 8,
                    color: '#000', fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.25s ease',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  }}
                >
                  {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {l.confirm}
                </button>

                <style jsx>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem var(--container-padding)',
              background: 'rgba(10,22,40,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '20px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
              }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseSuccess}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              >
                <X size={20} />
              </button>

              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(201,168,76,0.1)', border: '1.5px solid #C9A84C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <Check size={32} color="#C9A84C" strokeWidth={2} />
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                fontWeight: 400, fontStyle: 'italic', color: '#FFFFFF', marginBottom: '0.75rem',
              }}>
                {l.successTitle}
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: '1.5rem',
              }}>
                {l.successMsg}
              </p>
              {selectedDate && selectedTime && (
                <div style={{
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12, display: 'inline-block', textAlign: 'left', marginBottom: '1.5rem',
                }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#C9A84C', margin: '0 0 0.25rem', fontWeight: 500 }}>
                    {formatDateShort(selectedDate)} · {selectedTime}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    {l.duration}
                  </p>
                </div>
              )}

              {/* Cancel Booking */}
              {!isVideocall && !cancelled && (
                <div style={{ marginBottom: '1.5rem' }}>
                  {cancelError && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#e57373', marginBottom: '0.5rem' }}>
                      {cancelError}
                    </p>
                  )}
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    style={{
                      padding: '0.6rem 1.25rem',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: isCancelling ? 'wait' : 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,100,100,0.4)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel this booking'}
                  </button>
                </div>
              )}
              {cancelled && (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255,100,100,0.08)',
                  border: '1px solid rgba(255,100,100,0.2)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,150,150,0.8)', margin: 0 }}>
                    Booking cancelled successfully
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseSuccess}
                style={{
                  padding: '0.875rem 2rem',
                  background: '#C9A84C',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#D4B55A'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#C9A84C'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {l.back}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
