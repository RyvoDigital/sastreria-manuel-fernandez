import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sastreria-five.vercel.app'
  const locales = ['es', 'en', 'it', 'fr']

  const routes = [
    '',
    '/la-sastreria',
    '/bodas-y-ceremonia',
    '/servicios',

    '/configurador',
    '/cursos',
    '/contacto',
    '/legal',
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      })
    }
  }

  return entries
}
