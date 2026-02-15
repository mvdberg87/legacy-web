import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "logo.clearbit.com",
      "placehold.co",
    ],
  },

  // ✅ CORRECT voor Next.js 15
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
