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
  
  // Configure headers to improve security and prevent caching of API routes
  async headers() {
    const securityHeaders = [
      // Enforce HTTPS
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload' // 2 years
      },
      // Prevent MIME-sniffing
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      // Prevent Clickjacking
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN' // or 'DENY' if not using iframes
      },
      // Control Referrer information
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      // Control browser features
      {
        key: 'Permissions-Policy',
        value: "camera=(), microphone=(), geolocation=(), payment=()" 
      },
      // Basic Content Security Policy (CSP) - refine this based on specific needs
      {
        key: 'Content-Security-Policy',
        value: `
          default-src 'self'; 
          script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
          style-src 'self' 'unsafe-inline'; 
          img-src 'self' data: coin-images.coingecko.com; 
          font-src 'self'; 
          connect-src 'self' https://api.coingecko.com; 
          frame-src 'none'; 
          object-src 'none'; 
          form-action 'self'; 
          base-uri 'self';
        `.replace(/\s{2,}/g, ' ').trim() 
      }
    ];

    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Apply specific caching headers to API routes
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