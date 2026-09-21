import type { NextAuthConfig } from "next-auth";
import { Role } from "@prisma/client";

/**
 * Konfigurasi autentikasi yang aman untuk Edge runtime.
 *
 * MENGAPA DIPISAH DARI `lib/auth.ts`:
 * `middleware.ts` berjalan di Edge runtime, yang tidak bisa memuat Prisma,
 * bcrypt, atau modul Node apa pun. Kalau middleware mengimpor `lib/auth.ts`
 * (yang berisi PrismaAdapter + bcrypt), build akan gagal.
 *
 * Berkas ini karena itu HANYA memuat hal-hal yang bisa jalan di Edge:
 * pengaturan cookie, durasi sesi, dan callback token. Adapter database dan
 * logika pemeriksaan sandi tetap tinggal di `lib/auth.ts` (runtime Node).
 *
 * KEDUA SISI HARUS SEPAKAT soal `callbacks.jwt` dan `callbacks.session`.
 * Sesi disimpan sebagai JWT, jadi middleware bisa membacanya sendiri tanpa
 * menyentuh database — tapi hanya kalau bentuk tokennya identik.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 2 }, // sesi 2 jam
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Sengaja kosong di sini; provider diisi di `lib/auth.ts`.
  // Edge tidak punya akses jaringan database untuk memeriksa kredensial.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
    /**
     * Dipakai NextAuth saat `auth()` dijadikan middleware. Kita TIDAK
     * memakainya sebagai middleware (middleware sendiri menangani izin), tapi
     * tetap diisi supaya perilakunya tetap benar kalau suatu saat dipakai.
     */
    async authorized({ auth, request: { nextUrl } }) {
      const masuk = !!auth?.user;
      if (nextUrl.pathname.startsWith("/login")) {
        if (masuk) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return masuk;
    },
  },
} satisfies NextAuthConfig;
