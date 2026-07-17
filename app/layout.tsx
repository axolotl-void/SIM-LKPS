import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SIM-LKPS — Sistem Informasi Manajemen LKPS",
    template: "%s | SIM-LKPS",
  },
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi berbasis web untuk Program Studi Ilmu Komputer UBBG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
