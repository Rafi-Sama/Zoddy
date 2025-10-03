import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Enable ESLint during builds for code quality
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
