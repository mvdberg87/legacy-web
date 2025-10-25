import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Laat de build NIET falen bij lint-fouten
    ignoreDuringBuilds: true,
  },
  // Optioneel: als je TypeScript-fouten ook tijdelijk wil negeren:
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
