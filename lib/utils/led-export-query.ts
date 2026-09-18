import { db } from "@/lib/db";
import { ambilBagianLed } from "@/lib/utils/led-query";
import { periksaPraExport } from "@/lib/export/led-dokumen";

/**
 * Query khusus export LED.
 *
 * Hanya bagian yang punya isi yang diikutkan ke dokumen — bagian kosong tetap
 * dilaporkan lewat pra-export check, tapi tidak dicetak sebagai halaman
 * "[belum diisi]" sebanyak 92 kali.
 */
export const ikutkanBagianKosong = false;

export type KonteksExportLed = Awaited<ReturnType<typeof siapkanExportLed>>;

/** Ambil tahun akademik (aktif atau yang diminta) + semua bagian LED-nya. */
export async function siapkanExportLed(tahunAkademikId?: string) {
  const ta = tahunAkademikId
    ? await db.tahunAkademik.findUnique({
        where: { id: tahunAkademikId },
        include: { prodi: true },
      })
    : await db.tahunAkademik.findFirst({
        where: { isActive: true },
        include: { prodi: true },
      });

  if (!ta) return null;

  const bagian = await ambilBagianLed(ta.id);
  const pra = periksaPraExport(bagian);

  return {
    tahunAkademik: ta,
    prodi: ta.prodi,
    bagian,
    pra,
    /** Bagian yang benar-benar dicetak. */
    bagianCetak: bagian.filter((b) => (b.isian?.konten ?? "").trim().length > 0),
  };
}

/** Daftar tahun akademik untuk pemilih di halaman export. */
export async function daftarTahunAkademik() {
  return db.tahunAkademik.findMany({
    orderBy: [{ tahun: "desc" }, { semester: "asc" }],
    include: { prodi: { select: { nama: true, jenjang: true } } },
  });
}
