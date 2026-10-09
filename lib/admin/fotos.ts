import { del } from '@vercel/blob'

// Folders the admin may upload into. A2 uses productos/; more can be added per module.
export const FOTO_PREFIXES = ['productos/'] as const

export function isOwnFotoUrl(url: string) {
  try {
    const u = new URL(url)
    return u.hostname.endsWith('.public.blob.vercel-storage.com') && FOTO_PREFIXES.some((p) => u.pathname.startsWith('/' + p))
  } catch {
    return false
  }
}

// Best effort: a dangling blob costs pennies, a failed save because of it costs a photo
export async function deleteFotos(urls: (string | null | undefined)[]) {
  const own = urls.filter((u): u is string => !!u && isOwnFotoUrl(u))
  if (own.length === 0) return
  try {
    await del(own)
  } catch (error) {
    console.error('Delete fotos error:', error)
  }
}
