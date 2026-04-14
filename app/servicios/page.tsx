import type { Metadata } from 'next'
import { ServiciosLayout } from '@/components/servicios/ServiciosLayout'

export const metadata: Metadata = {
  title: 'Servicios · Sastrería Manuel Fernández',
  description: 'Trajes a medida, chaquetas deportivas, pantalones, abrigos y trajes de novio. El repertorio completo de Sastrería Manuel Fernández, Madrid.',
}

export default function ServiciosPage() {
  return <ServiciosLayout />
}
