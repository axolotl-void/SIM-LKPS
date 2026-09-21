import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { withDbRetry } from "@/lib/utils/db-retry";
import { catatLoginGagal, kosongkanHitungan, periksaPembatasLogin } from "@/lib/utils/login-rate-limit";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

/**
 * Error yang dilempar saat percobaan login sudah melewati batas.
 *
 * MENGAPA MEWARISI `CredentialsSignin` (bukan `Error` biasa):
 * NextAuth hanya meneruskan sebagian jenis error ke sisi klien (lihat
 * `clientErrors` di @auth/core/errors.js). Error yang tidak dikenal akan
 * dirubah menjadi halaman error umum — pengguna cuma melihat "Configuration",
 * tanpa penjelasan. `CredentialsSignin` termasuk yang diteruskan, dan ia punya
 * properti `code` yang ikut dikirim di URL. Jadi kita isi `code` dengan
 * penanda kita sendiri, dan aplikasi bisa menampilkan pesan yang benar.
 *
 * Penanda ini sengaja TIDAK menyebut email mana yang dikunci, supaya tidak
 * membocorkan akun mana yang ada di sistem.
 */
export const KODE_TERLALU_BANYAK = "terlalu_banyak_percobaan";

export class TerlaluBanyakPercobaan extends CredentialsSignin {
  detikSisa: number;
  constructor(detikSisa: number) {
    super();
    this.code = KODE_TERLALU_BANYAK;
    this.detikSisa = detikSisa;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email;

        // Pembatas percobaan login diperiksa SEBELUM sandi dicek, supaya
        // penyerang tidak bisa memakai waktu balasan untuk menebak.
        const status = await periksaPembatasLogin(request.headers, email);
        if (!status.diizinkan) {
          throw new TerlaluBanyakPercobaan(status.coba_Lagi_Dalam);
        }

        // Neon (serverless) bisa "tidur" lalu bangun saat ada request, dan
        // percobaan pertama kadang gagal. Retry di sini supaya gangguan
        // sesaat tidak berujung "login gagal" bagi pengguna.
        const user = await withDbRetry(
          () =>
            db.user.findUnique({
              where: { email },
            }),
          { label: "login: findUnique user" }
        );

        if (!user || !user.isActive) {
          await catatLoginGagal(request.headers, email);
          return null;
        }

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.password);
        if (!passwordMatch) {
          await catatLoginGagal(request.headers, email);
          return null;
        }

        // Berhasil: kosongkan hitungan supaya salah ketik sebelumnya tidak
        // menumpuk dan mengunci akun sendiri di kemudian hari.
        await kosongkanHitungan(request.headers, email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
});
