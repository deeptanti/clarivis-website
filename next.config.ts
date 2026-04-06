import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "clarivisintelligence.com" }],
        destination: "https://www.clarivisintelligence.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;