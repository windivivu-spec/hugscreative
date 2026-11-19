import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.18", "192.168.1.19", "192.168.1.24"],
  devIndicators: false,
  images: { qualities: [75, 90] },
};
export default nextConfig;
