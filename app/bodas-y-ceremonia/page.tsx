import type { Metadata } from 'next'
import { BodasLayout } from '@/components/bodas/BodasLayout'
import { ServiceGate } from '@/components/global/ServiceGate'

export const metadata: Metadata = {
  title: 'Bodas y Ceremonia | Sastrería Manuel Fernández',
  description: 'Trajes de novio y ceremonia a medida en Madrid. Chaqué, smoking y traje oscuro para el día más importante.',
}

export default function BodasPage() {
  return (
    <ServiceGate settingId="bodas">
      <BodasLayout />
    </ServiceGate>
  )
}
