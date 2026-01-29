import type { NextConfig } from "next";
import { env } from "prisma/config";

const devImagePrefix = env("DEV_IMAGE_PREFIX");
const prodImagePrefix = env("PROD_IMAGE_PREFIX");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: devImagePrefix,
        port: "",
      },
      {
        protocol: "http",
        hostname: prodImagePrefix,
        port: "",
      },
    ],
  },
};

export default nextConfig;
