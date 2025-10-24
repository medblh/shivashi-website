/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'], // Ajoutez vos domaines d'images ici
  },
}

module.exports = nextConfig