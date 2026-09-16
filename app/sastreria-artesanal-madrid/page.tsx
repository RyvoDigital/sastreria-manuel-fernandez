import type { Metadata } from 'next'
import { SastreriaArtesanalMadrid } from '@/components/landing/SastreriaArtesanalMadrid'

export const metadata: Metadata = {
  title: 'Sastrería Artesanal en Madrid | Manuel Fernández',
  description:
    'Sastrería artesanal a medida en Madrid. Cada prenda se corta y se construye a mano sobre el tejido, sin patrones. Jorge Juan 41.',
  alternates: { canonical: '/sastreria-artesanal-madrid' },
}

export default function SastreriaArtesanalMadridPage() {
  return <SastreriaArtesanalMadrid />
}
