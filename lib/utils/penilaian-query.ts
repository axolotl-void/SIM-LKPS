import { db } from "@/lib/db";
import type { ButirHitung } from "@/lib/utils/penilaian";

/**
 * Query modul Matriks Penilaian.
 *
 * Sesi bersifat satu per tahun akademik. Kalau sesi belum ada, semua skor
 * dianggap null (belum dinilai) — fungsi di lib/utils/penilaian.ts yang
 * menghitung, bukan database.
 */

/** Tahun akademik aktif. */
export async function tahunAktifPenilaian() {
  return db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
}

/** Sesi penilaian tahun aktif, atau null kalau belum pernah dibuat. */
export async function sesiPenilaian(tahunAkademikId: string) {
  return db.penilaianSesi.findUnique({
    where: { tahunAkademikId },
    select: {
      id: true, finalisasi: true, nilaiAkhir: true,
      statusPrediksi: true, catatan: true, updatedAt: true,
    },
  });
}

export type ButirLengkap = {
  id: string;
  kode: string;
  kriteria: string;
  namaKriteria: string;
  tahapPpepp: string | null;
  subButir: string | null;
  elemenPenilaian: string;
  deskriptor: string;
  skor1: string;
  skor2: string;
  skor3: string;
  skor4: string;
  syaratUnggul: string | null;
  bobot: number;
  jenis: "INPUT" | "PROSES" | "OUTPUT";
  urutan: number;
  /** null = belum dinilai. */
  skor: number | null;
  catatanBukti: string | null;
};

/**
 * Semua butir + skor sesi ini (kalau ada).
 *
 * Mengembalikan `ButirLengkap[]` supaya halaman bisa menampilkan deskriptor
 * 4 level dan sekaligus menghitung nilai akhir tanpa query tambahan.
 */
export async function ambilButirPenilaian(
  tahunAkademikId: string,
  opsi?: { kriteria?: string },
): Promise<ButirLengkap[]> {
  const sesi = await sesiPenilaian(tahunAkademikId);

  const butir = await db.butirPenilaian.findMany({
    where: opsi?.kriteria ? { kriteria: opsi.kriteria } : undefined,
    orderBy: { urutan: "asc" },
    include: { skor: { where: { penilaianSesiId: sesi?.id ?? "__tidak_ada__" } } },
  });

  return butir.map((b) => {
    const s = b.skor[0];
    return {
      id: b.id,
      kode: b.kode,
      kriteria: b.kriteria,
      namaKriteria: b.namaKriteria,
      tahapPpepp: b.tahapPpepp,
      subButir: b.subButir,
      elemenPenilaian: b.elemenPenilaian,
      deskriptor: b.deskriptor,
      skor1: b.skor1,
      skor2: b.skor2,
      skor3: b.skor3,
      skor4: b.skor4,
      syaratUnggul: b.syaratUnggul,
      bobot: b.bobot,
      jenis: b.jenis,
      urutan: b.urutan,
      skor: s?.skor ?? null,
      catatanBukti: s?.catatanBukti ?? null,
    };
  });
}

/** Ubah daftar butir jadi bentuk ringkas untuk kalkulasi murni. */
export function keButirHitung(butir: ButirLengkap[]): ButirHitung[] {
  return butir.map((b) => ({
    kode: b.kode,
    kriteria: b.kriteria,
    bobot: b.bobot,
    skor: b.skor,
  }));
}
