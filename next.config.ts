import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uvywuqzirlqcullegqlk.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "hdqfkvsfaszajfdmvcfi.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
