import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/evidence/**",
      },
    ],
  },

  // Redirect URL lama /lkps/bab-N → /lkps/kriteria-* (terminologi LAM INFOKOM 2.1)
  async redirects() {
    return [
      { source: "/lkps/bab-1", destination: "/lkps/kriteria-1", permanent: true },
      { source: "/lkps/bab-2", destination: "/lkps/kriteria-2", permanent: true },
      { source: "/lkps/bab-3", destination: "/lkps/kriteria-3", permanent: true },
      { source: "/lkps/bab-4", destination: "/lkps/kriteria-4", permanent: true },
      { source: "/lkps/bab-5", destination: "/lkps/kriteria-5-6", permanent: true },
      { source: "/lkps/bab-6", destination: "/lkps/kriteria-6", permanent: true },
      // Spesifik dulu — Next.js mencocokkan redirects secara berurutan
      { source: "/lkps/bab-5/tabel-:kode", destination: "/lkps/kriteria-5-6/tabel-:kode", permanent: true },
      { source: "/lkps/bab-6/tabel-:kode", destination: "/lkps/kriteria-6/tabel-:kode", permanent: true },
      { source: "/lkps/bab-:n/tabel-:kode", destination: "/lkps/kriteria-:n/tabel-:kode", permanent: true },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
