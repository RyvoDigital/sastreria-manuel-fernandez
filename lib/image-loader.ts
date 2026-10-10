'use client'

import { variantLoader } from './responsive-image'

/*
 * Every next/image on the site goes through this loader instead of Vercel
 * image optimisation (metered on this plan): a requested width maps to the
 * nearest pre-built copy in public/img/w at least that wide, else the
 * original. Images marked `unoptimized` skip it and load their src as is.
 */
export default variantLoader
