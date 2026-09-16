import type { Metadata } from 'next'
import { ChaqueMedidaMadrid } from '@/components/landing/ChaqueMedidaMadrid'

export const metadata: Metadata = {
  title: 'Chaqué a Medida en Madrid | Sastrería Manuel Fernández',
  description:
    'Chaqué a medida en Madrid, cortado y construido a mano para ceremonias de día. Faldones, chaleco y pantalón. Jorge Juan 41.',
  alternates: { canonical: '/chaque-medida-madrid' },
}

export default function Page() {
  return <ChaqueMedidaMadrid />
}
