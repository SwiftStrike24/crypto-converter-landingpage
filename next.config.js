/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure allowed image domains
  images: {
    domains: ['coin-images.coingecko.com'],
  },
  
  // Disable static optimization for API routes
  experimental: {
    // Enable app directory features
    appDir: true,
    // Ensure proper handling of API routes
    serverComponentsExternalPackages: ['@aws-sdk/client-s3'],
  },
  
  // Configure headers to prevent caching of API routes
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 