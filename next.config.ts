import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
        // Supabase storage/CDN examples — adjust to your project:
        { protocol: 'https', hostname: '**.supabase.co' },
        { protocol: 'https', hostname: 'your-cdn.example.com' },
        ],
    },
};

export default nextConfig;
