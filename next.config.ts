/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['coin-images.coingecko.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

export default nextConfig;
