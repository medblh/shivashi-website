/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // Disable Turbopack for production build
  experimental: {
    turbo: false
  }
}

module.exports = nextConfig;