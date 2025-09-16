/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  output: 'standalone',
  trailingSlash: false,
  swcMinify: true,
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig