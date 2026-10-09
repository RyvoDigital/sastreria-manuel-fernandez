import type { Metadata } from 'next'
import { ElHiloSastreria } from '@/components/la-sastreria/ElHiloSastreria'

export const metadata: Metadata = {
  title: 'La Sastrería · Sastrería Manuel Fernández',
  description: 'Conoce la historia, el espacio y la filosofía de Sastrería Manuel Fernández, maestros sastres en Madrid.',
  alternates: { canonical: '/la-sastreria' },
}

export default function LaSastreriaPage() {
  return <ElHiloSastreria />
}
