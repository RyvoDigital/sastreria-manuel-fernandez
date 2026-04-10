'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Calendar, Clock, Video, Check, ChevronLeft } from 'lucide-react'

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

export function VideollamadaBooking() {
  const { locale } = useI18n()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date')

  const t = {
    es: {
      title: 'Reservar Videollamada',
      selectDate: 'Selecciona una fecha',
      selectTime: 'Selecciona una hora',
      confirm: 'Confirmar reserva',
      duration: '20-25 minutos',
      platform: 'Plataforma: Zoom / Meet',
      next: 'Siguiente',
      back: 'Atrás',
      confirmBooking: 'Confirmar Reserva',
      selected: 'Seleccionado',
      success: '¡Reserva confirmada!',
      successMessage: 'Recibirás un email con los detalles de la videollamada.',
    },
    en: {
      title: 'Book Video Call',
      selectDate: 'Select a date',
      selectTime: 'Select a time',
      confirm: 'Confirm booking',
      duration: '20-25 minutes',
      platform: 'Platform: Zoom / Meet',
      next: 'Next',
      back: 'Back',
      confirmBooking: 'Confirm Booking',
      selected: 'Selected',
      success: 'Booking confirmed!',
      successMessage: 'You will receive an email with the video call details.',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  const handleConfirm = () => {
    setStep('confirm')
  }

  if (step === 'confirm') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.1)',
            border: '2px solid #C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
          }}>
            <Check size={32} color="#C9A84C" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            marginBottom: '1rem',
          }}>
            {currentT.success}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
          }}>
            {currentT.successMessage}
          </p>
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              color: '#C9A84C',
              margin: '0 0 0.5rem 0',
            }}>
              {selectedDate} · {selectedTime}
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
            }}>
              {currentT.duration}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '6rem var(--container-padding) 4rem',
    }}>
      <div style={{
        maxWidth: '600px',
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
            }}>
              <Clock size={14} />
              {currentT.duration}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
            }}>
              <Video size={14} />
              {currentT.platform}
            </span>
          </div>
        </div>

        {step === 'date' ? (
          <>
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              {currentT.selectDate}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date)
                    setStep('time')
                  }}
                  style={{
                    padding: '1.5rem 1rem',
                    background: selectedDate === date ? 'rgba(201,168,76,0.15)' : 'transparent',
                    border: `1px solid ${selectedDate === date ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <Calendar size={20} color="#C9A84C" style={{ marginBottom: '0.5rem' }} />
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    color: '#FFFFFF',
                  }}>
                    {new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <button
                onClick={() => setStep('date')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                }}
              >
                <ChevronLeft size={16} />
                {currentT.back}
              </button>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: '#C9A84C',
              }}>
                {selectedDate}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              {currentT.selectTime}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '1rem',
                    background: selectedTime === time ? 'rgba(201,168,76,0.15)' : 'transparent',
                    border: `1px solid ${selectedTime === time ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: selectedTime === time ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <button
                onClick={handleConfirm}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#C9A84C',
                  border: 'none',
                  color: '#000000',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {currentT.confirmBooking}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
