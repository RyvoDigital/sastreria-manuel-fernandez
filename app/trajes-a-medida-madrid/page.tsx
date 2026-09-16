import type { Metadata } from 'next'
import { TrajesAMedidaMadrid } from '@/components/landing/TrajesAMedidaMadrid'

export const metadata: Metadata = {
  title: 'Trajes a Medida en Madrid | Sastrería Manuel Fernández',
  description:
    'Trajes a medida en Madrid, cortados y construidos a mano. Traje artesanal, chaqué, smoking, frac y blazer. Primera cita en Jorge Juan 41.',
  alternates: { canonical: '/trajes-a-medida-madrid' },
}

export default function TrajesAMedidaMadridPage() {
  return <TrajesAMedidaMadrid />
}
