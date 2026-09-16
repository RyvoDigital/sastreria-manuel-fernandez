import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Real, indexable routes only.
 *
 * There is no `app/[locale]` segment in this project (locale lives in React
 * state, see lib/i18n.tsx), so locale-prefixed URLs such as /es/servicios
 * return 404. They must never appear here.
 *
 * Deliberately excluded:
 * - `/modelos-3d`   feature-flagged off on Ryvo deploys via
 *                   NEXT_PUBLIC_HIDE_MODELOS3D in next.config.ts.
 * - `/videollamada` redirects to /contacto, so it never returns 200.
 *
 * When a new page ships, add it here in the same commit as the page.
 */
const routes = [
  '',
  '/la-sastreria',
  '/servicios',
  '/bodas-y-ceremonia',
  '/configurador',
  '/cursos',
  '/contacto',
  '/legal',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
