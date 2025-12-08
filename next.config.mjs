/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
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




