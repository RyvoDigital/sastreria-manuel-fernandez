import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Videollamada | Sastrería Manuel Fernández',
  description: 'Reserva una videollamada de asesoría personalizada con nuestros expertos.',
}

export default function VideollamadaPage() {
  redirect('/contacto')
}
