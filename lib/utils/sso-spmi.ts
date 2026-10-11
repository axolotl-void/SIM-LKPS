import crypto from "node:crypto";
import { z } from "zod";
import type { Role } from "@prisma/client";

/**
 * Verifikasi token SSO dari SPMI (spmi.bbg.ac.id) — sisi SIM-LKPS.
 *
 * MENGAPA BENTUKNYA SEPERTI INI:
 * Dua sistem ini beda bahasa (PHP native vs TypeScript) dan beda framework,
 * jadi titik temunya harus sesuatu yang dimiliki keduanya tanpa pustaka
 * tambahan: HMAC-SHA256. PHP punya `hash_hmac`, Node punya `crypto`. Tidak ada
 * OAuth, tidak ada token JWT bertumpuk, tidak ada permintaan jaringan ke SPMI
 * saat pengguna masuk — SPMI menandatangani, SIM-LKPS memeriksa. Tidak ada
 * yang perlu saling memanggil API.
 *
 * ATURAN YANG TIDAK BOLEH DILANGGAR:
 * 1. Rahasia bersama HANYA dari variabel lingkungan. Kalau tidak ada atau
 *    terlalu pendek, verifikasi GAGAL (menutup), bukan lolos.
 * 2. Perbandingan tanda tangan memakai `timingSafeEqual`. Perbandingan `===`
 *    membocorkan berapa karakter awal yang benar lewat selisih waktu balasan.
 * 3. Peran yang tidak dikenal TIDAK PERNAH dipetakan ke ADMIN. Naik peran
 *    harus keputusan sadar, bukan efek samping salah ketik.
 */

/** Isi token. Kunci satu huruf supaya token tetap pendek di URL. */
const skemaPayload = z.object({
  e: z.string().email("email tidak valid"),
  n: z.string().min(1).max(120),
  r: z.string().min(1).max(40),
  j: z.string().min(8).max(64),
  x: z.number().int(),
});

export type PayloadSso = z.infer<typeof skemaPayload>;

export type HasilVerifikasi =
  | { ok: true; data: PayloadSso }
  | { ok: false; alasan: string };

/** Umur token maksimum yang masih diterima, dalam detik. */
const TENGGANG_DETIK = 120;

function rahasiaBersama(): string | null {
  const s = process.env.SSO_SPMI_SECRET;
  // 32 karakter: di bawah itu, HMAC-nya terlalu mudah ditebak untuk dipakai
  // sebagai pembukti identitas.
  if (!s || s.length < 32) return null;
  return s;
}

function dariBase64Url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/**
 * Peta peran SPMI → peran SIM-LKPS.
 *
 * SPMI hanya punya dua portal: `LPM` (pengelola mutu) dan `Auditee`.
 * Di sini LPM jadi ADMIN karena dia yang mengelola data, sedangkan auditee
 * jadi OPERATOR karena dia yang mengisi. `PIMPINAN` sengaja tidak pernah
 * diberikan otomatis — kalau kampus mau ada akun pimpinan, itu diatur manual
 * di halaman Pengguna.
 */
export function peranUntuk(peranSpmi: string): Role {
  const p = peranSpmi.trim().toUpperCase();
  if (p === "LPM" || p === "ADMIN") return "ADMIN";
  return "OPERATOR";
}

/**
 * Alamat publik aplikasi ini, dilihat dari sisi browser.
 *
 * MENGAPA TIDAK `new URL(request.url).origin` SAJA:
 * Di server kampus proses Node berjalan di dalam (127.0.0.1:3000) dan Apache
 * yang meneruskan permintaan. Alamat internal itu ikut terbaca sebagai asal
 * permintaan, sehingga pengalihan mengarahkan browser ke
 * `http://0.0.0.0:3000/dashboard` — alamat yang tidak bisa dibuka pengguna.
 * Karena itu header dari proxy dipakai lebih dulu, lalu `AUTH_URL`, dan baru
 * alamat permintaan sebagai pilihan terakhir.
 *
 * MENGAPA DI BERKAS INI, BUKAN DI `app/masuk/route.ts`:
 * Next.js hanya mengizinkan ekspor tertentu dari berkas route; fungsi bantu
 * yang diekspor dari sana membuat build gagal. Di sini juga bisa diuji.
 */
export function asalPublik(request: Request): string {
  const h = request.headers;
  const ambil = (nama: string) => h.get(nama)?.split(",")[0]?.trim() || "";
  const host = ambil("x-forwarded-host") || ambil("host");
  // Skema (http/https): utamakan kata proxy; kalau tidak ada, ikuti AUTH_URL
  // atau permintaan itu sendiri. Jangan dipatok "https", karena di lokal
  // pengalihan akan menunjuk ke https://127.0.0.1 dan tidak bisa dibuka.
  const proto =
    ambil("x-forwarded-proto") ||
    new URL(process.env.AUTH_URL || request.url).protocol.replace(":", "");
  if (host && host !== "0.0.0.0:3000") return `${proto}://${host}`;
  if (process.env.AUTH_URL) return process.env.AUTH_URL.replace(/\/$/, "");
  return new URL(request.url).origin;
}

/**
 * Periksa token `t` dari URL. Murni fungsi — tidak menyentuh database, supaya
 * bisa diuji tanpa infrastruktur.
 */
export function periksaTokenSso(t: string): HasilVerifikasi {
  const rahasia = rahasiaBersama();
  if (!rahasia) {
    return {
      ok: false,
      alasan: "Masuk dari SPMI belum diaktifkan di server ini (SSO_SPMI_SECRET belum diisi).",
    };
  }

  const potongan = t.split(".");
  if (potongan.length !== 2 || !potongan[0] || !potongan[1]) {
    return { ok: false, alasan: "Tautan masuk tidak lengkap." };
  }

  const [isi, tandaTangan] = potongan;
  const seharusnya = crypto
    .createHmac("sha256", rahasia)
    .update(isi)
    .digest();
  const dikirim = dariBase64Url(tandaTangan);

  // Panjang harus sama dulu: timingSafeEqual melempar kalau beda panjang.
  if (dikirim.length !== seharusnya.length || !crypto.timingSafeEqual(dikirim, seharusnya)) {
    return { ok: false, alasan: "Tautan masuk tidak sah." };
  }

  let mentah: unknown;
  try {
    mentah = JSON.parse(dariBase64Url(isi).toString("utf8"));
  } catch {
    return { ok: false, alasan: "Tautan masuk tidak lengkap." };
  }

  const parsed = skemaPayload.safeParse(mentah);
  if (!parsed.success) {
    return { ok: false, alasan: "Tautan masuk tidak lengkap." };
  }

  const sekarang = Math.floor(Date.now() / 1000);
  if (parsed.data.x < sekarang) {
    return { ok: false, alasan: "Tautan masuk sudah kedaluwarsa. Klik menu LAM Infokom lagi dari SPMI." };
  }
  if (parsed.data.x > sekarang + TENGGANG_DETIK) {
    // Token dari masa depan berarti jam server SPMI melenceng, atau token
    // dibuat dengan umur yang terlalu panjang. Keduanya tidak wajar.
    return { ok: false, alasan: "Waktu server SPMI tidak sinkron dengan server ini." };
  }

  return { ok: true, data: parsed.data };
}
