import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'

/**
 * Ryvo Vercel projects hide Modelos 3D by default (shared DB with Ajemark).
 * Explicit NEXT_PUBLIC_HIDE_MODELOS3D always wins.
 * Ajemark / local: stays visible unless that env is set to true.
 */
function resolveHideModelos3d(): string {
  const explicit = process.env.NEXT_PUBLIC_HIDE_MODELOS3D
  if (explicit === 'true' || explicit === '1' || explicit === 'yes') return 'true'
  if (explicit === 'false' || explicit === '0' || explicit === 'no') return 'false'

  const owner = (process.env.VERCEL_GIT_REPO_OWNER || '').toLowerCase()
  const urls = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const isRyvo =
    owner === 'ryvodigital' ||
    urls.includes('ryvo-digital') ||
    urls.includes('ryvodigital') ||
    urls.includes('sastreriamanuelfernandez.com')

  return isRyvo ? 'true' : 'false'
}

const nextConfig: NextConfig = {
  // Bake into client + server so settings-provider sees it
  env: {
    NEXT_PUBLIC_HIDE_MODELOS3D: resolveHideModelos3d(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Serve GLB as 3D assets for the viewer (not browser file-download)
  async headers() {
    return [
      {
        source: '/models/:path*.glb',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' },
          { key: 'Content-Disposition', value: 'inline' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(nextConfig);
