import type { Metadata } from 'next'
import { ElHiloServicios } from '@/components/servicios/ElHiloServicios'

export const metadata: Metadata = {
  title: 'Servicios · Sastrería Manuel Fernández',
  description: 'Trajes a medida, chaquetas deportivas, pantalones, abrigos y trajes de novio. El repertorio completo de Sastrería Manuel Fernández, Madrid.',
  alternates: { canonical: '/servicios' },
}

export default function ServiciosPage() {
  return <ElHiloServicios />
}
