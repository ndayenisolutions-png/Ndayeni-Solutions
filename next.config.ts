import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Strict TypeScript in production builds — surface real bugs instead of hiding them.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Surface unsafe patterns (legacy effects, deprecated APIs) during development.
  reactStrictMode: true,
  // Allow the sandbox preview origin to hot-reload without console warnings.
  allowedDevOrigins: [".space-z.ai"],
  images: {
    // Modern formats first — ~30-50% smaller payloads for mobile users.
    formats: ["image/avif", "image/webp"],
    // Allow locally-served section images to be optimised by the Next/Image pipeline.
    remotePatterns: [],
  },
};

export default nextConfig;
