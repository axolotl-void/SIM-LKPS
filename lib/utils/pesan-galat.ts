/**
 * Pesan galat yang aman ditampilkan ke pengguna.
 *
 * MASALAH YANG DIPERBAIKI
 * Beberapa halaman menampilkan `error.message` apa adanya, misalnya
 * "Gagal Memuat Halaman: {error.message}". Kalau Next.js meneruskan galat
 * asli dari server, teksnya ikut terkirim ke layar — dan galat Prisma
 * biasanya memuat nama tabel, nama kolom, bahkan potongan query:
 *
 *     Invalid `prisma.dosen.findMany()` invocation:
 *     Raw query failed. Code: `42P01`. Message: `relation "dosen" does not exist`
 *
 * Nama tabel dan struktur database adalah peta yang memudahkan penyerang
 * memilih sasaran. Jadi pesan asli hanya boleh masuk LOG server (untuk
 * ditelusuri), bukan layar pengguna.
 *
 * YANG DITAMPILKAN KE PENGGUNA
 * Pesan singkat yang menjelaskan KEADAANNYA, bukan penyebab teknisnya, plus
 * `digest` — ID singkat yang dicatat Next.js di log server. Pengguna bisa
 * menyebutkan ID itu saat melapor, dan kita bisa mencari penyebab aslinya
 * di log tanpa pernah menampilkannya di layar.
 */

/** Galat yang pesannya MEMANG sengaja ditulis untuk dibaca pengguna. */
function galatRamahPengguna(pesan: string): boolean {
  // Galat dari kode kita sendiri biasanya berbahasa Indonesia dan tidak
  // memuat istilah teknis. Yang kita saring adalah galat dari Prisma/Node.
  const penandaTeknis = [
    "prisma",
    "invocation",
    "Raw query",
    "relation ",
    "column ",
    "at ",
    ".js:",
    ".ts:",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "P1001",
    "P2002",
    "P2025",
    "SQL",
  ];
  const hurufKecil = pesan.toLowerCase();
  return !penandaTeknis.some((p) => hurufKecil.includes(p.toLowerCase()));
}

/**
 * Ambil pesan yang aman ditampilkan dari sebuah galat.
 *
 * @param error  Galat yang diterima halaman.
 * @param cadangan  Pesan yang dipakai kalau galat tidak layak ditampilkan.
 */
export function pesanAman(
  error: Error & { digest?: string },
  cadangan: string
): { pesan: string; idGalat?: string } {
  // Selalu catat galat aslinya ke konsol server. Ini satu-satunya tempat
  // penyebab teknis boleh muncul.
  console.error("[galat-halaman]", error);

  const pesanAsli = error.message?.trim() ?? "";
  const layak = pesanAsli.length > 0 && pesanAsli.length < 200 && galatRamahPengguna(pesanAsli);

  return {
    pesan: layak ? pesanAsli : cadangan,
    idGalat: error.digest,
  };
}
