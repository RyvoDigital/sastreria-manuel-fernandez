'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { Calendar, Clock, Video, Check, ChevronLeft, Loader2 } from 'lucide-react'

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const SATURDAY_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']

export function VideollamadaBooking() {
  const { t, locale } = useI18n()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const c = t.videollamada.booking

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date
  }).filter((date) => date.getDay() !== 0).slice(0, 7).map((date) => date.toISOString().split('T')[0])

  const getAvailableSlots = (dateStr: string | null) => {
    if (!dateStr) return TIME_SLOTS
    const day = new Date(dateStr).getDay()
    const isSaturday = day === 6
    return isSaturday ? SATURDAY_SLOTS : TIME_SLOTS
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setError(null)

    const dateStr = formatDate(selectedDate)

    if (!userName.trim() || !userEmail.trim()) {
      setError(c.fillFields)
      setIsSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail.trim())) {
      setError(c.invalidEmail)
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName.trim(),
          email: userEmail.trim(),
          message: `Solicitud de videollamada para el ${dateStr} a las ${selectedTime}`,
          type: 'videollamada',
          date: dateStr,
          time: selectedTime,
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || c.errorMessage)
      }
      setStep('confirm')
    } catch (err) {
      setError(err instanceof Error ? err.message : c.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'en-GB',
      { weekday: 'short', day: 'numeric', month: 'short' }
    )
  }

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

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
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
                color: '#C9A84C',
              }}
            >
              <Video size={22} strokeWidth={1.5} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#FFFFFF',
                marginBottom: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {c.title}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.5)',
                  padding: '0.35rem 0.8rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Clock size={13} />
                {c.duration}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.5)',
                  padding: '0.35rem 0.8rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Video size={13} />
                {c.platform}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'confirm' ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1.5px solid #C9A84C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Check size={32} color="#C9A84C" strokeWidth={2} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    marginBottom: '0.75rem',
                  }}
                >
                  {c.success}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: '2rem',
                    lineHeight: 1.5,
                  }}
                >
                  {c.successMessage}
                </p>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '12px',
                    display: 'inline-block',
                    textAlign: 'left',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      color: '#C9A84C',
                      margin: '0 0 0.25rem 0',
                      fontWeight: 500,
                    }}
                  >
                    {selectedDate && formatDate(selectedDate)} · {selectedTime}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.4)',
                      margin: 0,
                    }}
                  >
                    {c.duration}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 'date' ? 20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Step indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  {['date', 'time'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: (step === s) || (step === 'time' && s === 'date') ? '#C9A84C' : 'transparent',
                          border: `1.5px solid ${(step === s) || (step === 'time' && s === 'date') ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
                          color: (step === s) || (step === 'time' && s === 'date') ? '#000000' : 'rgba(255,255,255,0.4)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {s === 'date' && step === 'time' ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: step === s ? '#C9A84C' : 'rgba(255,255,255,0.3)',
                          fontWeight: step === s ? 500 : 400,
                        }}
                      >
                        {s === 'date' ? c.selectDate : c.selectTime}
                      </span>
                      {i === 0 && (
                        <div
                          style={{
                            flex: 1,
                            height: '2px',
                            borderRadius: '1px',
                            background: step === 'time' ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {step === 'date' ? (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                      }}
                    >
                      {dates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date)
                            setStep('time')
                          }}
                          style={{
                            padding: '1.25rem 0.75rem',
                            background:
                              selectedDate === date
                                ? 'rgba(201,168,76,0.12)'
                                : 'rgba(255,255,255,0.02)',
                            border: `1.5px solid ${selectedDate === date ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow:
                              selectedDate === date
                                ? '0 0 0 3px rgba(201,168,76,0.15)'
                                : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedDate !== date) {
                              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedDate !== date) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                            }
                          }}
                        >
                          <Calendar size={18} color="#C9A84C" />
                          <div
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.78rem',
                              color: '#FFFFFF',
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}
                          >
                            {formatDate(date)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setStep('date')
                        setSelectedTime(null)
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        marginBottom: '1.5rem',
                        padding: 0,
                      }}
                    >
                      <ChevronLeft size={16} />
                      {c.back}
                    </button>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                      }}
                    >
                      {getAvailableSlots(selectedDate).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.875rem 0.5rem',
                            background:
                              selectedTime === time
                                ? 'rgba(201,168,76,0.12)'
                                : 'rgba(255,255,255,0.02)',
                            border: `1.5px solid ${selectedTime === time ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.85rem',
                            color: selectedTime === time ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                            fontWeight: selectedTime === time ? 500 : 400,
                            boxShadow:
                              selectedTime === time
                                ? '0 0 0 3px rgba(201,168,76,0.15)'
                                : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedTime !== time) {
                              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedTime !== time) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                            }
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {/* Name & Email fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.5)',
                          marginBottom: '0.4rem',
                        }}>{c.yourName}</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder={c.namePlaceholder}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1.5px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'border-color 0.25s ease',
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.5)',
                          marginBottom: '0.4rem',
                        }}>{c.yourEmail}</label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder={c.emailPlaceholder}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1.5px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'border-color 0.25s ease',
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
                      onClick={handleConfirm}
                      disabled={!selectedTime || isSubmitting}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: selectedTime && !isSubmitting ? '#C9A84C' : 'rgba(201,168,76,0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000000',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: selectedTime && !isSubmitting ? 'pointer' : 'not-allowed',
                        opacity: selectedTime ? 1 : 0.5,
                        transition: 'all 0.25s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : null}
                      {c.confirmBooking}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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
