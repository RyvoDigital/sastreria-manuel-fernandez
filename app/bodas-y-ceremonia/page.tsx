import type { Metadata } from 'next'
import { ElHiloBodas } from '@/components/bodas/ElHiloBodas'
import { ServiceGate } from '@/components/global/ServiceGate'
import { isSettingEnabled } from '@/lib/settings-server'

/* Re-read the admin show/hide setting at most once a minute. */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Bodas y Ceremonia | Sastrería Manuel Fernández',
  description: 'Trajes de novio y ceremonia a medida en Madrid. Chaqué, smoking y traje oscuro para el día más importante.',
  alternates: { canonical: '/bodas-y-ceremonia' },
}

export default async function BodasPage() {
  const enabled = await isSettingEnabled('bodas')
  return (
    <ServiceGate settingId="bodas" initialEnabled={enabled}>
      <ElHiloBodas />
    </ServiceGate>
  )
}
