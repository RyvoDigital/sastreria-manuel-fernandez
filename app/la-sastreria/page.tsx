import type { Metadata } from 'next'
import { SastreriaLayout } from '@/components/la-sastreria/SastreriaLayout'

export const metadata: Metadata = {
  title: 'La Sastrería · Sastrería Manuel Fernández',
  description: 'Conoce la historia, el espacio y la filosofía de Sastrería Manuel Fernández, maestros sastres en Madrid.',
}

export default function LaSastreriaPage() {
  return <SastreriaLayout />
}
