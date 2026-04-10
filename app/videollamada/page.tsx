import type { Metadata } from 'next'
import { VideollamadaLayout } from '@/components/videollamada/VideollamadaLayout'

export const metadata: Metadata = {
  title: 'Videollamada · Sastrería Manuel Fernández',
  description: 'Consulta de sastrería personalizada por videollamada. 20-25 minutos de asesoramiento profesional.',
}

export default function VideollamadaPage() {
  return <VideollamadaLayout />
}
