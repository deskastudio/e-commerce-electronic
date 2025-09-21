// next.config.ts - Simplified untuk Fix Images
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization sementara untuk debugging
    unoptimized: true,
    
    // Allow semua domains
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;