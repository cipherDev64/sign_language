import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add any Vercel-specific rewrites if needed
  // For example, to proxy API calls to the Python serverless function:
  // async rewrites() {
  //   return [{ source: "/api/:path*", destination: "/api/index.py" }];
  // },
};

export default nextConfig;
