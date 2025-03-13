/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure allowed image domains and modern formats
  images: {
    domains: ['coin-images.coingecko.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Modern optimizations (2025)
  experimental: {
    // Optimize CSS output
    optimizeCss: true,
    // Optimize specific package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-tooltip',
    ],
  },
  
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['@aws-sdk/client-s3'],
  
  // Add webpack configuration for bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
        maxSize: 240000, // 240KB per chunk (below Cloudflare's limit)
        cacheGroups: {
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            name: 'framework',
            priority: 40,
            enforce: true,
          },
          radixui: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radixui',
            priority: 30,
          },
          utilities: {
            test: /[\\/]node_modules[\\/](tailwind-merge|class-variance-authority|clsx)[\\/]/,
            name: 'utilities',
            priority: 20,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
          },
        },
      };
      
      // Enable module concatenation for better tree-shaking
      config.optimization.concatenateModules = true;
    }
    
    return config;
  },
  
  // Improve performance for production builds
  poweredByHeader: false,
  
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