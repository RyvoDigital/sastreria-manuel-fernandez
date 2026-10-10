import type { Metadata } from 'next'
import { CancelBooking } from '@/components/booking/CancelBooking'

/* Opened from the cancel link in an in-person confirmation email. Not linked
   from the site, not in the sitemap, never indexed. */
export const metadata: Metadata = {
  title: 'Cancelar cita · Sastrería Manuel Fernández',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function CancelarCitaPage() {
  return <CancelBooking />
}
