/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "schwebdesign.com",
      "www.coe.int",
      "conversations.marketing-partners.com",
      "edukasyon-production.s3.amazonaws.com",
      "cdn3.vectorstock.com",
      "i.postimg.cc",
      "cdn-icons-png.flaticon.com",
    ], // Add your hostname here
  },
};

module.exports = nextConfig;
