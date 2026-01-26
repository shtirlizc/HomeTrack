import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // develop
      {
        protocol: "https",
        hostname: "uvywuqzirlqcullegqlk.supabase.co",
        port: "",
      },
      // production
      {
        protocol: "https",
        hostname: "vlgguavsjhygzpooojii.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
