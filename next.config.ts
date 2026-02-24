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
    domains: ["logo.clearbit.com", "placehold.co"],
  },
  turbopack: {
    root: __dirname,
  },

  async rewrites() {
    return [
      {
        source: "/:slug",
        destination: "/club/:slug/jobs/public",
      },
    ];
  },
};

export default nextConfig;