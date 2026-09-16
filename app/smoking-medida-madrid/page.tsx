import type { Metadata } from 'next'
import { SmokingMedidaMadrid } from '@/components/landing/SmokingMedidaMadrid'

export const metadata: Metadata = {
  title: 'Smoking a Medida en Madrid | Sastrería Manuel Fernández',
  description:
    'Smoking a medida en Madrid, construido a mano. Solapa de pico o chal en raso, pantalón con galón y camisa de etiqueta. Jorge Juan 41.',
  alternates: { canonical: '/smoking-medida-madrid' },
}

export default function Page() {
  return <SmokingMedidaMadrid />
}
