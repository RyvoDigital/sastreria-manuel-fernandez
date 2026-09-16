import type { Metadata } from 'next'
import { TrajesNovioMadrid } from '@/components/landing/TrajesNovioMadrid'

export const metadata: Metadata = {
  title: 'Trajes de Novio a Medida en Madrid | Manuel Fernández',
  description:
    'Trajes de novio a medida en Madrid. Chaqué, smoking, frac y traje oscuro, cortados y construidos a mano. Jorge Juan 41.',
  alternates: { canonical: '/trajes-novio-madrid' },
}

export default function Page() {
  return <TrajesNovioMadrid />
}
