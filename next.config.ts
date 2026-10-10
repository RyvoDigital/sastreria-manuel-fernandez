import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  // Every image is self-hosted under public/img, so no remote hosts are
  // allowed. Keep this empty: an entry here would re-enable Vercel image
  // optimization for that host, which is metered on the Hobby plan.
  images: {
    remotePatterns: [],
    // next/image never calls the optimiser: lib/image-loader.ts serves the
    // copies scripts/image-variants.mjs builds into public/img/w.
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // The configurator (/configurador) and the 3D viewer (/modelos-3d) were
  // removed in October 2026. Old links and search results land on Servicios.
  // Locale is not in the path on this site, so the bare paths cover every
  // language.
  async redirects() {
    return [
      { source: '/configurador/:path*', destination: '/servicios', statusCode: 301 },
      { source: '/modelos-3d/:path*', destination: '/servicios', statusCode: 301 },
    ]
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(nextConfig);
