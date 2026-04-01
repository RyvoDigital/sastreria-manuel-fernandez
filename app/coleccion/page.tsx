import type { Metadata } from 'next'
import { ColeccionLayout } from '@/components/coleccion/ColeccionLayout'

export const metadata: Metadata = {
  title: 'La Colección · Sastrería Manuel Fernández',
  description: 'Trajes a medida, chaquetas deportivas, abrigos y trajes de ceremonia. La colección completa del atelier Sastrería Manuel Fernández, Madrid.',
}

export default function ColeccionPage() {
  return <ColeccionLayout />
}
