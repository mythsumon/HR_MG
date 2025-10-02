/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  outputFileTracingRoot: __dirname,
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig