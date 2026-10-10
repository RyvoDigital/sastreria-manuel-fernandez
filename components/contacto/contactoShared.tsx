'use client'

import { Calendar, MessageSquare, Video } from 'lucide-react'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { BOOKING_ANCHOR } from '@/lib/booking'
import type { Contacto } from './contactoContent'
import s from './el-hilo-contacto.module.css'

/* The calendar step, unchanged: BookingCalendar full page, with the
   paid video call's confirmation banner on the Stripe return. */
export function BookingScreen({ c }: { c: Contacto }) {
  const b = c.booking
  if (b.mode === 'none') return null
  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {b.videocallSuccess && b.mode === 'videocall' && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.3)',
            padding: '1rem var(--container-padding)', textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#C9A84C', margin: 0 }}>{c.bl.videocallPaidSuccess}</p>
        </div>
      )}
      <BookingCalendar type={b.mode} onFreeSubmit={b.handleFreeBooking} onStripeCheckout={b.handleStripeCheckout} onBack={b.back} />
    </div>
  )
}

/* Address, phone, hours, email: same values, same tel: and mailto: links. */
export function Details({ c, className }: { c: Contacto; className?: string }) {
  return (
    <dl className={`${s.details} ${className ?? ''}`}>
      {c.details.map(({ label, value, href }) => (
        <div key={label} className={s.detail} data-detail>
          <dt className={s.eyebrow}>{label}</dt>
          <dd className={s.detailValue}>
            {href ? (
              <a href={href} className={s.link}>
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

const ICONS = { calendar: Calendar, video: Video, message: MessageSquare }

/* The booking hub: the target of every "Reservar cita" link (#reservar). */
export function Hub({ c, className, knots }: { c: Contacto; className?: string; knots?: boolean }) {
  return (
    <div id={BOOKING_ANCHOR} className={`${s.hub} ${className ?? ''}`}>
      <p className={s.hubTitle}>{c.bl.hubTitle}</p>
      <ul className={s.options}>
        {c.options.map((o) => {
          const Icon = ICONS[o.icon]
          return (
            <li key={o.key} data-option>
              {knots && <span className={s.optKnot} aria-hidden="true" data-knot />}
              <button type="button" className={s.option} onClick={o.onClick}>
                <Icon size={18} strokeWidth={1.5} className={s.optIcon} aria-hidden="true" />
                <span className={s.optTitle}>{o.title}</span>
                <span className={s.optDesc}>{o.desc}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* The message form: same fields, names, honeypot, endpoint and analytics event. */
export function ContactForm({ c }: { c: Contacto }) {
  const f = c.form
  return (
    <div id="contact-form" className={s.formWrap}>
      <h2 className={s.eyebrow}>{c.t.form_title}</h2>
      {f.submitted ? (
        <p className={s.success}>{c.t.form_success}</p>
      ) : (
        <form onSubmit={f.handleSubmit} className={s.form}>
          {/* Honeypot: hidden from people, bots often fill it */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="mf-website">Website</label>
            <input type="text" name="website" id="mf-website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <div className={s.formRow}>
            <Field id="mf-cn" name="nombre" type="text" label={c.t.form_name} disabled={f.loading} />
            <Field id="mf-ce" name="email" type="email" label={c.t.form_email} disabled={f.loading} />
          </div>
          <Field id="mf-ct" name="telefono" type="tel" label={c.t.form_phone} disabled={f.loading} />
          <div className={s.field} data-field>
            <textarea name="mensaje" id="mf-cm" rows={3} placeholder=" " required className={`${s.input} ${s.textarea}`} disabled={f.loading} />
            <label htmlFor="mf-cm" className={s.label}>
              {c.t.form_message}
            </label>
            <span className={s.fieldLine} aria-hidden="true" />
          </div>
          {f.error && <p className={s.error}>{f.error}</p>}
          <button type="submit" className={s.btnPrimary} disabled={f.loading} style={{ opacity: f.loading ? 0.6 : 1 }}>
            {f.loading ? c.t.form_sending : c.t.form_submit}
          </button>
        </form>
      )}
    </div>
  )
}

function Field({ id, name, type, label, disabled }: { id: string; name: string; type: string; label: string; disabled: boolean }) {
  return (
    <div className={s.field} data-field>
      <input type={type} name={name} id={id} placeholder=" " required className={s.input} disabled={disabled} />
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <span className={s.fieldLine} aria-hidden="true" />
    </div>
  )
}
