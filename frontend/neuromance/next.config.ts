import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/", // All unmatched paths go to the root page
      },
    ];
  },
};

export default nextConfig;
