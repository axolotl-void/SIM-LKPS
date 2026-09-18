import { db } from "@/lib/db";
import type { LedBagianData, LedIsianData } from "@/components/led/types";
import type { LedStatus } from "@prisma/client";

/** Status default untuk bagian yang belum pernah diisi. */
export const STATUS_KOSONG: LedStatus = "KOSONG";

/**
 * Query bagian LED + isiannya untuk satu tahun akademik.
 *
 * Semua halaman LED lewat sini supaya bentuk datanya seragam dan
 * bagian yang belum pernah diisi tetap ikut terkirim (isian = null).
 */
export async function ambilBagianLed(
  tahunAkademikId: string,
  where?: { kode?: string[]; kriteria?: number },
): Promise<LedBagianData[]> {
  const bagian = await db.ledBagian.findMany({
    where: {
      ...(where?.kode ? { kode: { in: where.kode } } : {}),
      ...(where?.kriteria !== undefined ? { kriteria: where.kriteria } : {}),
    },
    orderBy: { urutan: "asc" },
    include: {
      isian: {
        where: { tahunAkademikId },
        include: { evidence: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  return bagian.map((b) => {
    const isian = b.isian[0];
    const data: LedIsianData | null = isian
      ? {
          id: isian.id,
          konten: isian.konten,
          status: isian.status,
          jumlahKarakter: isian.jumlahKarakter,
          updatedAt: isian.updatedAt.toISOString(),
          evidence: isian.evidence.map((e) => ({
            id: e.id,
            filename: e.filename,
            linkUrl: e.linkUrl,
            keterangan: e.keterangan,
            createdAt: e.createdAt.toISOString(),
          })),
        }
      : null;

    return {
      id: b.id,
      kode: b.kode,
      judul: b.judul,
      petunjuk: b.petunjuk,
      tahapPpepp: b.tahapPpepp,
      subButir: b.subButir,
      kriteria: b.kriteria,
      batasHalaman: b.batasHalaman,
      isian: data,
    };
  });
}

/** Semua isian LED pada satu tahun akademik — untuk hitung progres. */
export async function ambilRingkasanLed(tahunAkademikId: string) {
  return db.ledIsian.findMany({
    where: { tahunAkademikId },
    select: { status: true, jumlahKarakter: true },
  });
}

/** Peta kode bagian → status. Dipakai halaman index untuk kartu per BAB. */
export async function ambilStatusPerKode(tahunAkademikId: string) {
  const isian = await db.ledIsian.findMany({
    where: { tahunAkademikId },
    select: { status: true, ledBagian: { select: { kode: true } } },
  });
  const peta = new Map<string, LedStatus>();
  for (const i of isian) peta.set(i.ledBagian.kode, i.status);
  return peta;
}

/** Struktur ringkas semua bagian LED (tanpa join isian). */
export async function ambilStrukturLed() {
  return db.ledBagian.findMany({
    orderBy: { urutan: "asc" },
    select: { kode: true, jenis: true, kriteria: true, bab: true, bagian: true },
  });
}

/** Jumlah total bagian LED yang seharusnya ada (struktur baku). */
export async function jumlahBagianLed() {
  return db.ledBagian.count();
}

/** Tahun akademik aktif. */
export async function tahunAkademikAktif() {
  return db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
}
