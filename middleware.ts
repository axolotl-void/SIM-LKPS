import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Instance NextAuth khusus untuk Edge runtime.
 *
 * HANYA memakai `authConfig` (tanpa Prisma/bcrypt), karena middleware berjalan
 * di Edge. Karena sesi disimpan sebagai JWT, instance ini bisa MEMBACA sesi
 * tanpa menyentuh database — cukup memverifikasi tanda tangannya.
 *
 * Ini yang membuat pemeriksaan login di middleware bisa jalan: keputusannya
 * diambil dari isi token, bukan dari query database.
 */
const { auth } = NextAuth(authConfig);

/**
 * Middleware — lapisan pertahanan terdepan.
 *
 * DUA TUGAS:
 *  1. Menolak akses halaman yang butuh login SEBELUM halaman itu dieksekusi
 *     (sebelumnya tidak ada pemeriksaan di sini; keamanan bergantung pada
 *     pemeriksaan di tiap halaman, sehingga halaman baru berisiko lupa dijaga).
 *  2. Menempelkan header keamanan ke setiap balasan.
 *
 * CATATAN PENTING soal pembatas percobaan login:
 * Penghitung login TIDAK lagi di sini. Tempatnya sudah pindah ke
 * `lib/utils/login-rate-limit.ts` (berbasis database) dan dipanggil dari
 * `lib/auth.ts`. Alasannya: middleware berjalan di beberapa instance sekaligus
 * di Vercel, dan penghitung yang disimpan di memori proses tidak pernah
 * mencapai batasnya — uji langsung ke produksi membuktikannya (8 percobaan
 * gagal berturut-turut, tidak pernah 429).
 *
 * Middleware ini tetap menjadi pertahanan lapis pertama, tetapi keputusan
 * izin yang mengikat tetap ada di server (halaman/aksi), bukan di sini.
 */

/**
 * Jalur yang boleh diakses TANPA login.
 *
 * Ditulis sebagai daftar TOLAK-LEWAT yang sempit. Apa pun yang tidak cocok
 * dengan daftar ini akan diminta login lebih dulu — jadi halaman baru otomatis
 * terlindungi, bukan otomatis terbuka.
 */
const JALUR_PUBLIK = [
  "/login",
  "/api/auth",           // alur login NextAuth sendiri
  "/api/health",         // pemantauan uptime, tidak memuat data
  "/_next",              // berkas statis Next.js
  "/favicon.ico",
  "/robots.txt",
  "/manifest.webmanifest",
];

function jalurPublik(pathname: string): boolean {
  return JALUR_PUBLIK.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p)
  );
}

/**
 * Ekstensi yang menandakan permintaan berkas statis, bukan halaman.
 *
 * KENAPA INI PERLU — pernah kejadian (21 Sep 2026):
 * Pemeriksaan login di middleware tanpa ini membuat **semua aset di `public/`
 * ikut dialihkan ke `/login`**. Terbukti: `/logo-ubbg.svg` dan
 * `/images/ubbg-campus.webp` balas `307 → /login?callbackUrl=...`. Akibatnya
 * logo UBBG dan seluruh gambar halaman login rusak — halaman yang justru
 * dibuka SEBELUM pengguna punya sesi.
 *
 * Berkas statis memang harus bisa diakses tanpa login (logo itu bagian dari
 * halaman login itu sendiri). Halaman aplikasi dan route API tidak punya
 * ekstensi berkas, jadi aturan ini tidak membuka jalan masuk apa pun.
 */
const EKSTENSI_STATIS =
  /\.(svg|png|jpe?g|gif|webp|avif|ico|bmp|txt|xml|json|webmanifest|css|js|mjs|map|woff2?|ttf|eot|otf|mp4|webm|pdf)$/i;

function berkasStatis(pathname: string): boolean {
  return EKSTENSI_STATIS.test(pathname);
}

/**
 * Apakah permintaan ini minta balasan JSON, bukan halaman HTML?
 *
 * Dipakai untuk memilih bentuk balasan yang tepat: API dan permintaan
 * server-action menerima JSON 401, halaman biasa dialihkan ke /login.
 */
function mintaJson(request: NextRequest): boolean {
  if (request.nextUrl.pathname.startsWith("/api/")) return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/json") && !accept.includes("text/html");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------------
  // 1. Pemeriksaan login
  // ---------------------------------------------------------------------
  if (!jalurPublik(pathname) && !berkasStatis(pathname)) {
    const sesi = await auth();
    if (!sesi?.user) {
      if (mintaJson(request)) {
        return NextResponse.json(
          { error: "Tidak terautentikasi" },
          { status: 401 }
        );
      }
      const url = new URL("/login", request.url);
      // Simpan tujuan awal supaya pengguna dikembalikan ke sana setelah masuk.
      // Nilainya dibersihkan di sisi login (safeCallbackUrl) agar tidak bisa
      // dipakai untuk pengalihan ke situs lain.
      url.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // ---------------------------------------------------------------------
  // 2. Header keamanan
  // ---------------------------------------------------------------------
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  // HSTS: paksa HTTPS selama 2 tahun, termasuk subdomain. Hanya dikirim di
  // produksi — di lokal protokolnnya http dan header ini akan mengunci
  // localhost ke HTTPS di browser.
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // CSP ketat di produksi.
  //
  // Catatan soal 'unsafe-inline' pada script-src: Next.js menyisipkan skrip
  // bootstrap dan data hidrasi sebagai skrip inline, jadi menghapusnya akan
  // mematikan aplikasi. Yang WAJIB dihapus adalah 'unsafe-eval' — itu tidak
  // dibutuhkan runtime produksi, dan justru itu yang membuat celah XSS bisa
  // berubah menjadi eksekusi kode. Kalau nanti Next.js menyediakan nonce,
  // 'unsafe-inline' bisa diganti dengan nonce.
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://fonts.gstatic.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; ")
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
