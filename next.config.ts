import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Stop Lightning CSS from handling your CSS (fixes the crash)
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
