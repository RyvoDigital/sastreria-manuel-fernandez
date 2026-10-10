import widths from './image-widths.json'

/*
 * srcset for the self-hosted photographs. scripts/image-variants.mjs writes
 * smaller copies of every public/img/*.webp to public/img/w and records which
 * widths exist in image-widths.json; this turns that into srcset so a phone
 * stops downloading the 2000px original.
 *
 * `sizes` must describe the widest the image is ever drawn, not the width of
 * its box: object-fit: cover, parallax and zoom effects draw many of these
 * photos at several times the viewport width, and a smaller `sizes` would
 * make the browser pick a copy that looks softer than today. The values at
 * each call site were measured at 390, 768 and 1440px with 10% headroom.
 */

const WIDTHS = widths as unknown as Record<string, [number, number[]]>

export function srcSetFor(src: string): string | undefined {
  const match = /^\/img\/([^/]+\.webp)$/.exec(src)
  if (!match) return undefined
  const entry = WIDTHS[match[1]]
  if (!entry || entry[1].length === 0) return undefined
  const name = match[1].slice(0, -'.webp'.length)
  return [...entry[1].map((w) => `/img/w/${name}-${w}.webp ${w}w`), `${src} ${entry[0]}w`].join(', ')
}

/** Props to spread on an <img>: src, srcSet and sizes. */
export function responsive(src: string, sizes: string) {
  const srcSet = srcSetFor(src)
  return srcSet ? { src, srcSet, sizes } : { src }
}

/** next/image loader that maps a requested width to the nearest copy at least that wide. */
export function variantLoader({ src, width }: { src: string; width: number }): string {
  const match = /^\/img\/([^/]+\.webp)$/.exec(src)
  const entry = match ? WIDTHS[match[1]] : undefined
  if (!match || !entry) return src
  const w = entry[1].find((v) => v >= width)
  return w ? `/img/w/${match[1].slice(0, -'.webp'.length)}-${w}.webp` : src
}
