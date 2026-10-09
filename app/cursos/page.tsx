import type { Metadata } from 'next'
import { CursosLayout } from '@/components/cursos/CursosLayout'
import { ServiceGate } from '@/components/global/ServiceGate'
import { isSettingEnabled } from '@/lib/settings-server'

/* Re-read the admin show/hide setting at most once a minute. */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Curso Artesanal · Sastrería Manuel Fernández',
  description: 'Aprende técnicas de sastrería artesanal con nuestros cursos en vídeo.',
  alternates: { canonical: '/cursos' },
}

export default async function CursosPage() {
  const enabled = await isSettingEnabled('cursos')
  return (
    <ServiceGate settingId="cursos" initialEnabled={enabled}>
      <CursosLayout />
    </ServiceGate>
  )
}
