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

  // ✅ Rewrite voor publieke clubpagina
  async rewrites() {
    return [
      {
        source:
          "/:slug((?!admin|login|signup|club|api|_next|favicon.ico).*)",
        destination: "/club/:slug/jobs/public",
      },
    ];
  },

  // ✅ CORRECT voor Next.js 15
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;