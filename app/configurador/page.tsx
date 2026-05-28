import type { Metadata } from 'next'
import { ConfiguradorLayout } from '@/components/configurador/ConfiguradorLayout'
import { ServiceGate } from '@/components/global/ServiceGate'

export const metadata: Metadata = {
  title: 'Configurador de Prendas · Sastrería Manuel Fernández',
  description: 'Diseña tu traje a medida paso a paso. Configurador de prendas artesanales con pago previo.',
}

export default function ConfiguradorPage() {
  return (
    <ServiceGate settingId="configurador">
      <ConfiguradorLayout />
    </ServiceGate>
  )
}
