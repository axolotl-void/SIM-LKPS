import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeSync } from "@/components/layout/theme-sync";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  // PERF: font ini hanya dipakai di beberapa halaman (NIDN, audit-log, kode prodi).
  // Tanpa preload, ~30 kB tidak lagi masuk jalur kritis setiap halaman; font tetap
  // terpasang lewat @font-face dan dimuat saat benar-benar dipakai.
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "SIM-LKPS — Sistem Informasi Manajemen LKPS",
    template: "%s | SIM-LKPS",
  },
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi berbasis web untuk Program Studi Ilmu Komputer UBBG",
  icons: {
    icon: "/logo-ubbg.svg",
    shortcut: "/logo-ubbg.svg",
    apple: "/logo-ubbg.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Terapkan tema sebelum paint supaya tidak ada kedipan putih */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var r=document.documentElement;if(p==="/login"||p.indexOf("/login/")===0){r.classList.remove("dark");r.style.colorScheme="light";return;}var t=localStorage.getItem("sim-lkps-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
