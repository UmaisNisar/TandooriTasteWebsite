/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      // Supabase CDN domains
      {
        protocol: "https",
        hostname: "*.supabase.co"
      },
      {
        protocol: "https",
        hostname: "*.supabase.in"
      },
      {
        protocol: "https",
        hostname: "supabase.com"
      },
      // Common image CDNs
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "unsplash.com"
      }
    ],
    // Optimize images for performance
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Enable static optimization where possible
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  webpack: (config, { isServer }) => {
    // Suppress pg-native warning (it's optional and not needed)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('pg-native');
    }
    return config;
  }
};

export default nextConfig;




