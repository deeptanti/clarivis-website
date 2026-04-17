import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.clarivisintelligence.com" }],
        destination: "https://clarivisintelligence.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;