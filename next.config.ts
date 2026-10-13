import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Nonaktifkan image optimization agar kompatibel dengan static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
