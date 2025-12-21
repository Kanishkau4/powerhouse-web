import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.theflavorbender.com',
      },
      {
        protocol: 'https',
        hostname: 'media.defense.gov',
      },
      {
        protocol: 'https',
        hostname: 'ulyqupxmrmwtxprvnciz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.hungrylankan.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
