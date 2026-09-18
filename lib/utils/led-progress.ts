import type { LedStatus } from "@prisma/client";

/**
 * Estimasi halaman LED.
 *
 * Lampiran 2 Instrumen LED: A4, Arial 11, spasi 1,15, maksimum 150 halaman.
 * Pada setelan itu satu halaman A4 menampung ±3.000 karakter teks mengalir.
 * Angka ini PERKIRAAN — dipakai sebagai indikator, bukan patokan mutlak.
 */
export const KARAKTER_PER_HALAMAN = 3000;

/** Batas total halaman LED (Lampiran 2). */
export const BATAS_HALAMAN_LED = 150;

/** Batas karakter per bagian — menjaga editor tetap responsif. */
export const BATAS_KARAKTER_PER_BAGIAN = 100_000;

export type RingkasanIsian = {
  status: LedStatus;
  jumlahKarakter: number;
};

export type ProgresLed = {
  total: number;
  kosong: number;
  draft: number;
  lengkap: number;
  diajukan: number;
  disetujui: number;
  terisi: number;
  persenTerisi: number;
  totalKarakter: number;
  estimasiHalaman: number;
  lebihBatas: boolean;
};

/**
 * Hitung progres dari daftar isian.
 *
 * `total` = jumlah bagian yang SEHARUSNYA ada (dari struktur `LedBagian`),
 * bukan jumlah baris `LedIsian` — supaya bagian yang belum pernah dibuka
 * tetap terhitung sebagai kosong.
 */
export function hitungProgres(isian: RingkasanIsian[], totalBagian?: number): ProgresLed {
  const total = totalBagian ?? isian.length;

  let kosong = 0;
  let draft = 0;
  let lengkap = 0;
  let diajukan = 0;
  let disetujui = 0;
  let totalKarakter = 0;

  for (const i of isian) {
    totalKarakter += i.jumlahKarakter;
    switch (i.status) {
      case "KOSONG":
        kosong++;
        break;
      case "DRAFT":
        draft++;
        break;
      case "LENGKAP":
        lengkap++;
        break;
      case "DIAJUKAN":
        diajukan++;
        break;
      case "DISETUJUI":
        disetujui++;
        break;
    }
  }

  // Bagian yang belum punya baris LedIsian sama sekali = kosong
  const belumAdaBaris = Math.max(0, total - isian.length);
  kosong += belumAdaBaris;

  const terisi = total - kosong;
  const estimasiHalaman = Math.ceil(totalKarakter / KARAKTER_PER_HALAMAN);

  return {
    total,
    kosong,
    draft,
    lengkap,
    diajukan,
    disetujui,
    terisi,
    persenTerisi: total === 0 ? 0 : Math.round((terisi / total) * 100),
    totalKarakter,
    estimasiHalaman,
    lebihBatas: estimasiHalaman > BATAS_HALAMAN_LED,
  };
}

/** Estimasi halaman dari sejumlah karakter. */
export function estimasiHalaman(jumlahKarakter: number): number {
  return Math.ceil(jumlahKarakter / KARAKTER_PER_HALAMAN);
}

/** Label + varian badge untuk tiap status LED. */
export const LED_STATUS_META: Record<
  LedStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "pending" }
> = {
  KOSONG: { label: "Kosong", variant: "default" },
  DRAFT: { label: "Draft", variant: "warning" },
  LENGKAP: { label: "Lengkap", variant: "info" },
  DIAJUKAN: { label: "Diajukan", variant: "pending" },
  DISETUJUI: { label: "Disetujui", variant: "success" },
};

/** Label tahap PPEPP yang enak dibaca. */
export const TAHAP_LABEL: Record<string, string> = {
  PENETAPAN: "Penetapan",
  PELAKSANAAN: "Pelaksanaan",
  EVALUASI: "Evaluasi",
  PENGENDALIAN: "Pengendalian",
  PENINGKATAN: "Peningkatan",
};

/** Urutan tahap PPEPP yang baku. */
export const TAHAP_URUTAN = [
  "PENETAPAN",
  "PELAKSANAAN",
  "EVALUASI",
  "PENGENDALIAN",
  "PENINGKATAN",
] as const;

/** Label BAB yang enak dibaca. */
export const BAB_LABEL: Record<string, string> = {
  I: "Pendahuluan",
  II: "Laporan Evaluasi Diri",
  III: "Penutup",
};
