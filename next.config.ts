import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Jangan bocorkan teknologi yang dipakai lewat header "X-Powered-By: Next.js".
  // Header itu membantu penyerang memilih celah sesuai versi framework.
  poweredByHeader: false,

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

  // Header keamanan TIDAK lagi diatur di sini.
  //
  // Sebelumnya header diatur di dua tempat (berkas ini DAN middleware.ts),
  // dengan isi yang berbeda-beda. Ketika sebuah header diatur dua kali, yang
  // menang tidak selalu jelas, dan perubahan di satu tempat diam-diam
  // tertimpa oleh tempat lain. Sekarang semuanya ada di `middleware.ts`,
  // supaya hanya ada SATU sumber kebenaran.
  //
  // Yang diatur di middleware: X-Frame-Options, X-Content-Type-Options,
  // Referrer-Policy, Permissions-Policy, Strict-Transport-Security, dan
  // Content-Security-Policy.
};

export default nextConfig;
