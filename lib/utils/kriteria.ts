/**
 * Pemetaan kriteria LKPS — LAM INFOKOM 2.1
 *
 * Instrumen LKPS tidak memakai istilah "BAB" (itu milik LED).
 * Penomoran resminya per kriteria. Kolom `bab` di `TabelDefinition`
 * tetap Int 1–6 (internal), tapi URL & label memakai kriteria.
 */

/** Slug route untuk tiap nilai `bab` (1–6). */
const SLUG_BY_BAB: Record<number, string> = {
  1: "kriteria-1",
  2: "kriteria-2",
  3: "kriteria-3",
  4: "kriteria-4",
  5: "kriteria-5",
  6: "kriteria-6",
};

/** Nama kriteria sesuai instrumen LAM INFOKOM 2.1. */
const LABEL_BY_BAB: Record<number, string> = {
  1: "Budaya Mutu",
  2: "Relevansi Pendidikan",
  3: "Relevansi Penelitian",
  4: "Relevansi PkM",
  5: "Akuntabilitas",
  6: "Diferensiasi Misi",
};

/** Slug route halaman kriteria, mis. `kriteria-5`. */
export function kriteriaSlug(bab: number): string {
  return SLUG_BY_BAB[bab] ?? `kriteria-${bab}`;
}

/** Nama kriteria, mis. "Relevansi Pendidikan". */
export function kriteriaNama(bab: number): string {
  return LABEL_BY_BAB[bab] ?? `Kriteria ${bab}`;
}

/** Label lengkap dengan nomor, mis. "Kriteria 2 — Relevansi Pendidikan". */
export function kriteriaLabel(bab: number): string {
  return `Kriteria ${bab} — ${kriteriaNama(bab)}`;
}

/** URL halaman detail sebuah tabel. */
export function tabelHref(bab: number, kode: string): string {
  return `/lkps/${kriteriaSlug(bab)}/tabel-${kode.toLowerCase().replace(/\./g, "")}`;
}
