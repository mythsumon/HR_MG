/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
    ],
  },
  outputFileTracingRoot: __dirname,
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig