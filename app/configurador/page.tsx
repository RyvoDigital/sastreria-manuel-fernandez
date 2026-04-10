import type { Metadata } from 'next'
import { ConfiguradorLayout } from '@/components/configurador/ConfiguradorLayout'

export const metadata: Metadata = {
  title: 'Configurador de Prendas · Sastrería Manuel Fernández',
  description: 'Diseña tu traje a medida paso a paso. Configurador de prendas artesanales con pago previo.',
}

export default function ConfiguradorPage() {
  return <ConfiguradorLayout />
}
