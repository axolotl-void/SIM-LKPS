import crypto from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";

import { db } from "@/lib/db";
import { withDbRetry } from "@/lib/utils/db-retry";
import { createAuditLog } from "@/lib/utils/audit";
import { peranUntuk, periksaTokenSso, asalPublik } from "@/lib/utils/sso-spmi";

/**
 * Pintu masuk dari SPMI (spmi.bbg.ac.id) — RANCANGAN-014.
 *
 * Alur: pengguna klik menu "LAM Infokom" di SPMI → SPMI membuat token
 * bertanda tangan → browser diarahkan ke sini → token diperiksa → sesi
 * SIM-LKPS diterbitkan → pengguna langsung di dalam, tanpa layar login.
 *
 * KENAPA SESI DITERBITKAN DI SINI, BUKAN LEWAT HALAMAN LOGIN:
 * Halaman login meminta sandi. Di sini sandi tidak pernah terlibat: identitas
 * sudah dibuktikan oleh tanda tangan SPMI. Jadi kita langsung membuat cookie
 * sesi yang bentuknya identik dengan hasil login biasa (lihat
 * `callbacks.jwt` di lib/auth.config.ts: token harus memuat `id` dan `role`).
 *
 * Rute ini WAJIB terdaftar di JALUR_PUBLIK pada middleware.ts — kalau tidak,
 * middleware akan memantulkan pengguna ke /login sebelum kode ini sempat jalan.
 */
export const dynamic = "force-dynamic";

/** Harus sama dengan `cookies.sessionToken.name` di lib/auth.config.ts. */
const NAMA_COOKIE = "next-auth.session-token";
/** Harus sama dengan `session.maxAge` di lib/auth.config.ts. */
const UMUR_SESI_DETIK = 60 * 60 * 2;

function gagal(asal: string, pesan: string): NextResponse {
  // Pesan dikirim lewat query supaya halaman login bisa menampilkannya.
  // Tidak ada detail teknis yang dibocorkan — semua alasan sudah manusiawi.
  const url = new URL("/login", asal);
  url.searchParams.set("galat", pesan);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const asal = asalPublik(request);
  const t = url.searchParams.get("t");

  if (!t) {
    return gagal(asal, "Tautan masuk dari SPMI tidak lengkap.");
  }

  const hasil = periksaTokenSso(t);
  if (!hasil.ok) {
    return gagal(asal, hasil.alasan);
  }

  const { e: email, n: nama, r: peranSpmi, j: jti } = hasil.data;

  // Sekali pakai. jti adalah PRIMARY KEY tabel sso_tiket, jadi percobaan kedua
  // dengan token yang sama gagal karena bentrok kunci — pemeriksaan ini tidak
  // bergantung pada jam, jadi tidak bisa dilewati dengan mengubah waktu.
  try {
    await db.ssoTiket.create({ data: { jti, email, peran: peranSpmi } });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return gagal(asal, "Tautan masuk ini sudah dipakai. Klik menu LAM Infokom lagi dari SPMI.");
    }
    console.error("[SSO] gagal mencatat tiket:", error);
    return gagal(asal, "Server SIM-LKPS sedang bermasalah. Coba lagi sebentar lagi.");
  }

  const peran = peranUntuk(peranSpmi);
  const bolehBuatAkun = process.env.SSO_SPMI_AUTOPROVISI !== "0";

  const user = await withDbRetry(
    async () => {
      const ada = await db.user.findUnique({ where: { email } });
      if (ada) return ada;

      // Kampus bisa mematikan pembuatan akun otomatis (SSO_SPMI_AUTOPROVISI=0).
      // Alasannya masuk akal: tidak semua orang yang punya akun SPMI boleh
      // masuk SIM-LKPS. Kalau dimatikan, hanya email yang sudah didaftarkan
      // pengelola lewat halaman Pengguna yang bisa masuk.
      if (!bolehBuatAkun) return null;

      // Akun baru dari SPMI. Sandinya hash acak — bukan hasil undian yang bisa
      // ditebak, dan tidak ada yang tahu nilainya, termasuk kita. Artinya akun
      // ini TIDAK bisa dipakai login manual; satu-satunya jalan masuk adalah
      // lewat SPMI. Kalau nanti mau dipakai mandiri, sandinya direset lewat
      // halaman Pengguna.
      try {
        return await db.user.create({
          data: {
            email,
            name: nama,
            role: peran,
            password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
          },
        });
      } catch (error) {
        if ((error as { code?: string })?.code === "P2002") {
          // Dua permintaan hampir bersamaan untuk email yang sama.
          const adaSekarang = await db.user.findUnique({ where: { email } });
          if (adaSekarang) return adaSekarang;
        }
        throw error;
      }
    },
    { label: "sso: cari/buat user" }
  );

  if (!user) {
    return gagal(
      asal,
      "Email Anda belum terdaftar di SIM-LKPS. Hubungi pengelola untuk didaftarkan lebih dulu."
    );
  }

  if (!user.isActive) {
    return gagal(asal, "Akun Anda dinonaktifkan. Hubungi pengelola SIM-LKPS.");
  }

  // Peran diambil dari database, BUKAN dari token. Kalau admin menurunkan
  // peran seseorang di halaman Pengguna, perubahan itu langsung berlaku pada
  // pemakaian berikutnya — token SPMI tidak bisa menimpanya.
  const token = await encode({
    token: {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.image ?? undefined,
    },
    secret: process.env.AUTH_SECRET as string,
    salt: NAMA_COOKIE,
    maxAge: UMUR_SESI_DETIK,
  });

  void createAuditLog({
    action: "SSO_MASUK_SPMI",
    entity: "User",
    entityId: user.id,
    newValue: { email: user.email, peranSpmi, peranDipakai: user.role },
  });

  const response = NextResponse.redirect(new URL("/dashboard", asal));
  response.cookies.set({
    name: NAMA_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: UMUR_SESI_DETIK,
  });

  return response;
}
