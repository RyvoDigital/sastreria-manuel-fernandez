import type { Metadata } from 'next'
import { SastreriaBarrioSalamanca } from '@/components/landing/SastreriaBarrioSalamanca'

export const metadata: Metadata = {
  title: 'Sastrería Artesanal en el Barrio de Salamanca | Manuel Fernández',
  description:
    'Sastrería artesanal en el Barrio de Salamanca, Madrid. Trajes cortados y construidos a mano en Jorge Juan 41, junto a Serrano.',
  alternates: { canonical: '/sastreria-barrio-salamanca' },
}

export default function Page() {
  return <SastreriaBarrioSalamanca />
}
