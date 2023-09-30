/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['schwebdesign.com', 'www.coe.int'], // Add your hostname here
  },
}

module.exports = nextConfig
