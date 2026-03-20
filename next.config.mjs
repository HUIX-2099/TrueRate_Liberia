/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Serve HD icon for favicon.ico (bookmarks, tab icons)
      { source: '/favicon.ico', destination: '/icons/logo-192.png' },
    ]
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  // Performance optimizations
  experimental: {
    scrollRestoration: true,
  },
  // Compression and caching
  compress: true,
  // Provide env vars - use .env values when set, fallback to demo
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo',
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY || 'demo',
  },
  // Enable React strict mode for better performance
  reactStrictMode: true,
  // Fix workspace detection issues
  outputFileTracingRoot: process.cwd(),
  // External packages that should be treated as external
  serverExternalPackages: [],
}

export default nextConfig
