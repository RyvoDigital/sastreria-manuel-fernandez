/**
 * ImageKit URL helper.
 * Set NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in env, e.g. https://ik.imagekit.io/your_id
 */

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''

export function getImageKitUrl(path: string, transforms?: string): string {
  if (!urlEndpoint) return path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  if (transforms) {
    return `${urlEndpoint}/tr:${transforms}/${cleanPath}`
  }
  return `${urlEndpoint}/${cleanPath}`
}

/** Cloudinary-style auto format/quality via ImageKit */
export function getOptimizedImageKitUrl(path: string, width?: number): string {
  const parts = ['f-auto', 'q-auto']
  if (width) parts.unshift(`w-${width}`)
  return getImageKitUrl(path, parts.join(','))
}

export function isImageKitConfigured(): boolean {
  return Boolean(urlEndpoint)
}