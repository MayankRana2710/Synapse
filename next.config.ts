import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["utf-8-validate", "bufferutil"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "c9hjpnivk0.ufs.sh",
      },
    ],
  },
};

export default nextConfig;