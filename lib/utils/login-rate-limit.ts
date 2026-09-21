/**
 * Pembatas percobaan login — berbasis DATABASE, bukan memori proses.
 *
 * MASALAH YANG DIPERBAIKI
 * Pembatas sebelumnya menyimpan hitungan di `Map` dalam memori. Di Vercel,
 * aplikasi berjalan di beberapa instance sekaligus dan tiap instance didaur
 * ulang sesuka waktu. Penghitung di memori karena itu hanya melihat sebagian
 * kecil percobaan, dan hilang sebelum sempat mencapai batas. Uji langsung ke
 * produksi menunjukkan 8 percobaan gagal berturut-turut tidak pernah
 * menghasilkan 429.
 *
 * CARA KERJA SEKARANG
 * Hitungan disimpan di tabel `login_attempt`, jadi berlaku untuk semua
 * instance sekaligus dan tidak hilang saat instance didaur ulang.
 *
 * ATURAN
 *  - Hanya percobaan GAGAL yang dihitung. Login berhasil mengosongkan
 *    hitungan, supaya pengguna sah yang salah ketik tidak ikut terhukum.
 *  - Kunci = IP + email. Mengunci hanya per-IP bisa melukai satu kantor yang
 *    berbagi satu IP publik; mengunci per-email saja tidak berguna karena
 *    penyerang tinggal mencoba banyak email. Kombinasi keduanya membuat
 *    serangan menyasar satu akun ikut terhenti.
 *  - Kalau database bermasalah, permintaan DILOLOSKAN. Alasannya: pembatas
 *    ini pelengkap, bukan pengaman utama (pengaman utamanya bcrypt + sandi
 *    kuat). Menolak login seluruh kampus gara-gara gangguan DB justru
 *    merugikan, dan penyerang bisa memakainya untuk mematikan layanan.
 */

import { db } from "@/lib/db";

/** Jendela waktu penghitungan. */
const JENDELA_MS = 15 * 60 * 1000; // 15 menit
/** Batas percobaan gagal per jendela, per (IP + email). */
const BATAS_PER_AKUN = 10;
/** Batas percobaan gagal per jendela, per IP (menghadang sapuan banyak akun). */
const BATAS_PER_IP = 30;

export interface HasilPembatas {
  diizinkan: boolean;
  /** Detik sampai boleh mencoba lagi (untuk header Retry-After). */
  coba_Lagi_Dalam: number;
  /** Berapa percobaan yang tersisa di jendela ini. */
  sisa: number;
}

/**
 * Ambil alamat IP pemanggil dari header.
 *
 * Di Vercel, `x-forwarded-for` diisi oleh platform dan tidak bisa dipalsukan
 * dari luar. Nilai paling kiri adalah klien asli.
 */
export function ambilIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "tidak-diketahui"
  );
}

/**
 * Normalisasi email supaya `Admin@ubbg.ac.id` dan `admin@ubbg.ac.id` dihitung
 * sebagai akun yang sama.
 */
export function normalEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ambilHitungan(ip: string, email: string) {
  const sekarang = Date.now();
  const awalJendela = BigInt(sekarang - (sekarang % JENDELA_MS));
  const kedaluwarsa = BigInt(sekarang + JENDELA_MS);

  const [perAkun, perIp] = await Promise.all([
    db.loginAttempt.findUnique({
      where: { ip_windowStart: { ip: `${ip}|${email}`, windowStart: awalJendela } },
    }),
    db.loginAttempt.findMany({
      where: { ip: `ip:${ip}`, windowStart: awalJendela },
      take: 1,
    }),
  ]);

  return {
    awalJendela,
    kedaluwarsa,
    gagalAkun: perAkun?.count ?? 0,
    gagalIp: perIp[0]?.count ?? 0,
  };
}

/**
 * Periksa apakah percobaan login berikutnya masih boleh dilakukan.
 *
 * Dipanggil SEBELUM memeriksa sandi, supaya penyerang tidak bisa memakai waktu
 * balasan untuk menebak.
 */
export async function periksaPembatasLogin(
  headers: Headers,
  email: string
): Promise<HasilPembatas> {
  const ip = ambilIp(headers);
  const akun = normalEmail(email);

  try {
    const { awalJendela, gagalAkun, gagalIp } = await ambilHitungan(ip, akun);

    const kelebihanAkun = gagalAkun >= BATAS_PER_AKUN;
    const kelebihanIp = gagalIp >= BATAS_PER_IP;

    if (kelebihanAkun || kelebihanIp) {
      const detikSisa = Math.ceil(
        (Number(awalJendela) + JENDELA_MS - Date.now()) / 1000
      );
      return {
        diizinkan: false,
        coba_Lagi_Dalam: Math.max(detikSisa, 1),
        sisa: 0,
      };
    }

    return {
      diizinkan: true,
      coba_Lagi_Dalam: 0,
      sisa: Math.max(0, BATAS_PER_AKUN - gagalAkun),
    };
  } catch (e) {
    // Gangguan database bukan alasan menolak pemakaian yang sah.
    console.error("[pembatas-login] gagal membaca hitungan:", e);
    return { diizinkan: true, coba_Lagi_Dalam: 0, sisa: 0 };
  }
}

/**
 * Catat satu percobaan login yang GAGAL.
 */
export async function catatLoginGagal(
  headers: Headers,
  email: string
): Promise<void> {
  const ip = ambilIp(headers);
  const akun = normalEmail(email);

  try {
    const sekarang = Date.now();
    const awalJendela = BigInt(sekarang - (sekarang % JENDELA_MS));
    const kedaluwarsa = BigInt(sekarang + JENDELA_MS);

    const kenaikan = {
      count: { increment: 1 },
      expiresAt: kedaluwarsa,
    };

    await db.$transaction([
      db.loginAttempt.upsert({
        where: { ip_windowStart: { ip: `${ip}|${akun}`, windowStart: awalJendela } },
        create: { ip: `${ip}|${akun}`, count: 1, windowStart: awalJendela, expiresAt: kedaluwarsa },
        update: kenaikan,
      }),
      db.loginAttempt.upsert({
        where: { ip_windowStart: { ip: `ip:${ip}`, windowStart: awalJendela } },
        create: { ip: `ip:${ip}`, count: 1, windowStart: awalJendela, expiresAt: kedaluwarsa },
        update: kenaikan,
      }),
    ]);

    // Bersihkan baris kedaluwarsa sesekali (1 dari 20 percobaan) supaya tabel
    // tidak menumpuk. Tidak menunggu hasilnya: ini cuma pembersihan.
    if (Math.random() < 0.05) {
      await db.loginAttempt
        .deleteMany({ where: { expiresAt: { lt: BigInt(sekarang) } } })
        .catch(() => {});
    }
  } catch (e) {
    console.error("[pembatas-login] gagal mencatat percobaan gagal:", e);
  }
}

/**
 * Kosongkan hitungan setelah login BERHASIL.
 *
 * Tanpa ini, pengguna yang salah ketik 9 kali lalu berhasil akan tetap
 * terhitung 9, dan percobaan salah berikutnya mengunci akunnya sendiri.
 */
export async function kosongkanHitungan(headers: Headers, email: string): Promise<void> {
  const ip = ambilIp(headers);
  const akun = normalEmail(email);
  const sekarang = Date.now();
  const awalJendela = BigInt(sekarang - (sekarang % JENDELA_MS));

  try {
    await db.loginAttempt.deleteMany({
      where: {
        OR: [
          { ip: `${ip}|${akun}`, windowStart: awalJendela },
          { ip: `ip:${ip}`, windowStart: awalJendela },
        ],
      },
    });
  } catch (e) {
    console.error("[pembatas-login] gagal mengosongkan hitungan:", e);
  }
}

export const BATAS_LOGIN = { BATAS_PER_AKUN, BATAS_PER_IP, JENDELA_MS };
