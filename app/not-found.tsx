import Link from 'next/link'
import { BookingLink } from '@/components/global/BookingLink'
import s from './not-found.module.css'

/* Any unmatched URL. Navy like the rest of the site, so the menu reads; in
   Spanish; a way home and a way to book. Next adds noindex on its own. */
export default function NotFound() {
  return (
    <section className={s.page} aria-labelledby="h-404">
      <div className={s.inner}>
        <span className={s.eyebrow}>Error 404</span>
        <h1 id="h-404" className={s.h1}>
          Esta página no existe
        </h1>
        <span className={s.rule} aria-hidden="true" />
        <p className={s.body}>Puede que el enlace haya cambiado o que la dirección esté mal escrita.</p>
        <div className={s.actions}>
          <Link href="/" className={s.btnPrimary}>
            Volver al inicio
          </Link>
          <BookingLink end className={s.btnGhost}>
            Reservar Cita
          </BookingLink>
        </div>
      </div>
    </section>
  )
}
