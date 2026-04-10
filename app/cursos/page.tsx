import type { Metadata } from 'next'
import { CursosLayout } from '@/components/cursos/CursosLayout'

export const metadata: Metadata = {
  title: 'Cursos Online · Sastrería Manuel Fernández',
  description: 'Aprende técnicas de sastrería artesanal con nuestros cursos en vídeo.',
}

export default function CursosPage() {
  return <CursosLayout />
}
