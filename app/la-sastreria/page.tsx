import type { Metadata } from 'next'
import { SastreriaLayout } from '@/components/la-sastreria/SastreriaLayout'

export const metadata: Metadata = {
  title: 'La Sastrería · Sastrería Manuel Fernández',
  description: 'Conoce la historia, el espacio y la filosofía de Sastrería Manuel Fernández, fundada en Madrid en 1978.',
}

export default function LaSastreriaPage() {
  return <SastreriaLayout />
}
