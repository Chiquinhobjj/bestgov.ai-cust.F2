/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static optimization for routes that use dynamic variables
  experimental: {
    // Configurações experimentais aqui
  },
  // Allow dynamic route handling
  output: 'standalone',
}

export default nextConfig
