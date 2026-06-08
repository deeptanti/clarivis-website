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
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/services/real-estate", destination: "/solutions/real-estate", permanent: true },
      { source: "/services/healthcare", destination: "/solutions/healthcare", permanent: true },
      { source: "/services/agribusiness", destination: "/solutions/agribusiness", permanent: true },
      { source: "/products", destination: "/solutions", permanent: true },
      { source: "/audit", destination: "/how-it-works", permanent: true },
      { source: "/book", destination: "/contact", permanent: true },
      { source: "/solutions", destination: "/", permanent: true },
      { source: "/solutions/real-estate", destination: "/real-estate", permanent: true },
      { source: "/solutions/healthcare", destination: "/healthcare", permanent: true },
      { source: "/solutions/agribusiness", destination: "/agribusiness", permanent: true },
      { source: "/insights", destination: "/", permanent: false },
      {
        source: "/insights/guides/:vertical/:slug",
        destination: "/:vertical/insights/guides/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
