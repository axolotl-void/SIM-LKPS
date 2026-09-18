/**
 * Kalkulasi Matriks Penilaian LAM INFOKOM 2.1.
 *
 * Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang di-unit-test:
 * nilai akhir berbobot, rerata per kriteria, dan prediksi status akreditasi.
 *
 * ## Rumus nilai akhir
 *
 * PDF §III/§IV menulis bobot sebagai "Bobot dari 400" dengan skor tiap butir
 * 1–4 (Sangat baik 4 · Baik 3 · Cukup 2 · Kurang 1). Supaya nilai akhir jatuh
 * di skala 0–400, jumlah berbobot HARUS dinormalisasi dengan skor maksimum:
 *
 *     nilaiAkhir = Σ(skor × bobot) / 4
 *
 * Ini dicek silang dengan ambang resmi §V — kalau tanpa dibagi 4, skor
 * seragam 1 pun menghasilkan 400 dan ambang "< 200 Tidak Terakreditasi"
 * jadi mustahil. Dengan normalisasi:
 *
 *     semua skor 4 → 400   (Unggul 5 tahun)
 *     semua skor 3 → 300   (Terakreditasi)
 *     semua skor 2 → 200   (Terakreditasi, batas bawah)
 *     semua skor 1 → 100   (Tidak Terakreditasi)
 *
 * ## Ambang status (§V)
 *   < 200        → Tidak Terakreditasi
 *   200 – 320    → Terakreditasi
 *   321 – 360    → Unggul 3 tahun  (kalau syarat terpenuhi)
 *   ≥ 361        → Unggul 5 tahun  (kalau syarat terpenuhi)
 *
 * ## Syarat tambahan gelar Unggul
 * Dua-duanya harus terpenuhi, dan keduanya HANYA menyangkut kriteria C1–C3
 * (Budaya Mutu, Relevansi Pendidikan, Relevansi Penelitian) — bukan seluruh
 * 82 butir. Ini kutipan langsung §V:
 *
 *   • rerata tiap kriteria C1, C2, C3 masing-masing ≥ 3,20
 *   • setiap butir pada C1, C2, C3 bernilai ≥ 3,00
 *
 * Butir yang belum dinilai dianggap belum memenuhi syarat — bukan lolos.
 */

export const BOBOT_TOTAL = 400;
export const SKOR_MAKS = 4;
export const SKOR_MIN = 1;

export const AMBANG = {
  tidakTerakreditasi: 200,
  unggul3Th: 321,
  unggul5Th: 361,
} as const;

/** Kriteria kunci penentu gelar Unggul. */
export const KRITERIA_KUNCI = ["C1", "C2", "C3"] as const;

export const RERATA_KUNCI_MIN = 3.2;
export const BUTIR_MIN = 3.0;

export type StatusPrediksi =
  | "TIDAK_TERAKREDITASI"
  | "TERAKREDITASI"
  | "UNGGUL_3TH"
  | "UNGGUL_5TH";

export const STATUS_META: Record<
  StatusPrediksi,
  { label: string; variant: "danger" | "warning" | "info" | "success" }
> = {
  TIDAK_TERAKREDITASI: { label: "Tidak Terakreditasi", variant: "danger" },
  TERAKREDITASI: { label: "Terakreditasi", variant: "warning" },
  UNGGUL_3TH: { label: "Unggul (berlaku 3 tahun)", variant: "info" },
  UNGGUL_5TH: { label: "Unggul (berlaku 5 tahun)", variant: "success" },
};

/** Urutan tampilan kriteria pada dashboard. */
export const URUTAN_KRITERIA = ["KE", "PU", "C1", "C2", "C3", "C4", "C5", "C6", "SUP"] as const;

export const NAMA_KRITERIA: Record<string, string> = {
  KE: "Kondisi Eksternal",
  PU: "Profil UPPS & Program Studi",
  C1: "Kriteria 1 — Budaya Mutu",
  C2: "Kriteria 2 — Relevansi Pendidikan",
  C3: "Kriteria 3 — Relevansi Penelitian",
  C4: "Kriteria 4 — Relevansi PkM",
  C5: "Kriteria 5 — Akuntabilitas",
  C6: "Kriteria 6 — Diferensiasi Misi",
  SUP: "Suplemen Program Studi",
};

/** Nama pendek untuk kartu/legenda. */
export const NAMA_PENDEK: Record<string, string> = {
  KE: "Kondisi Eksternal",
  PU: "Profil UPPS",
  C1: "Budaya Mutu",
  C2: "Relevansi Pendidikan",
  C3: "Relevansi Penelitian",
  C4: "Relevansi PkM",
  C5: "Akuntabilitas",
  C6: "Diferensiasi Misi",
  SUP: "Suplemen",
};

/**
 * Bobot resmi per kriteria (PDF §III). Dipakai memverifikasi hasil seed:
 * kalau Σ bobot ≠ 400, seluruh prediksi jadi salah dan UI harus menolak render.
 */
export const BOBOT_KRITERIA: Record<string, number> = {
  KE: 4,
  PU: 4,
  C1: 40,
  C2: 120,
  C3: 72,
  C4: 60,
  C5: 40,
  C6: 40,
  SUP: 20,
};

/** Butir ringkas yang dibutuhkan kalkulasi. */
export type ButirHitung = {
  kode: string;
  kriteria: string;
  bobot: number;
  /** null = belum dinilai (dihitung 0, tapi ditandai di UI). */
  skor: number | null;
};

export type RerataKriteria = {
  kriteria: string;
  nama: string;
  jumlahButir: number;
  jumlahTerisi: number;
  /** Σ bobot butir kriteria ini. */
  bobot: number;
  /** Σ(skor × bobot) mentah — maksimum 4 × bobot. */
  nilaiBerbobot: number;
  /** Nilai skala 0–400: nilaiBerbobot / 4. */
  nilai: number;
  /** rerata berbobot pada skala 1–4; null kalau belum ada yang dinilai. */
  rerata: number | null;
  /** true kalau SEMUA butir kriteria ini dinilai ≥ 3,00. */
  semuaButirAman: boolean;
  /** Kriteria ini ikut menentukan gelar Unggul. */
  kunci: boolean;
};

export type HasilPenilaian = {
  /** Skala 0–400 = Σ(skor × bobot) / 4. */
  nilaiAkhir: number;
  totalButir: number;
  jumlahTerisi: number;
  jumlahKosong: number;
  lengkap: boolean;
  perKriteria: RerataKriteria[];
  rerataKunci: Record<string, number | null>;
  /** Syarat Unggul: rerata C1, C2, C3 semuanya ≥ 3,20. */
  rerataKunciOk: boolean;
  /** Syarat Unggul: setiap butir C1, C2, C3 ≥ 3,00. */
  semuaButirOk: boolean;
  /** Butir C1–C3 yang belum memenuhi syarat Unggul (untuk ditampilkan). */
  butirPenghambat: { kode: string; skor: number | null; kriteria: string }[];
  /** Skor terendah di antara butir yang sudah dinilai; null kalau belum ada. */
  skorTerendah: number | null;
  status: StatusPrediksi;
};

/** Σ(skor × bobot) mentah; butir kosong dihitung 0. */
export function nilaiBerbobot(butir: ButirHitung[]): number {
  let total = 0;
  for (const b of butir) total += (b.skor ?? 0) * b.bobot;
  return bulatkan(total);
}

/**
 * Nilai akhir skala 0–400.
 *
 * Σ(skor × bobot) dibagi 4 (skor maksimum) supaya skor penuh = 400.
 */
export function nilaiAkhir(butir: ButirHitung[]): number {
  return bulatkan(nilaiBerbobot(butir) / SKOR_MAKS);
}

/**
 * Rerata tertimbang satu kriteria pada skala 1–4:
 * Σ(skor × bobot) / Σ(bobot). Dipakai juga untuk syarat Unggul.
 */
export function rerataKriteria(butir: ButirHitung[]): number | null {
  const bobot = totalBobot(butir);
  if (bobot === 0) return null;
  if (butir.every((b) => b.skor === null)) return null;
  return bulatkan(nilaiBerbobot(butir) / bobot);
}

export function totalBobot(butir: ButirHitung[]): number {
  return bulatkan(butir.reduce((a, b) => a + b.bobot, 0));
}

/** Semua butir dinilai ≥ 3,00? Butir kosong dianggap belum aman. */
export function semuaButirAman(butir: ButirHitung[]): boolean {
  if (butir.length === 0) return false;
  return butir.every((b) => b.skor !== null && b.skor >= BUTIR_MIN);
}

/**
 * Prediksi status akreditasi.
 *
 * Ambang nilai diperiksa lebih dulu, baru syarat Unggul — jadi nilai 380
 * dengan satu butir C1 bernilai 2,9 tetap Terakreditasi.
 */
export function prediksiStatus(
  nilai: number,
  rerataKunciOk: boolean,
  semuaButirOk: boolean,
): StatusPrediksi {
  if (nilai < AMBANG.tidakTerakreditasi) return "TIDAK_TERAKREDITASI";
  if (nilai < AMBANG.unggul3Th) return "TERAKREDITASI";

  const memenuhiUnggul = rerataKunciOk && semuaButirOk;
  if (nilai < AMBANG.unggul5Th) return memenuhiUnggul ? "UNGGUL_3TH" : "TERAKREDITASI";
  return memenuhiUnggul ? "UNGGUL_5TH" : "TERAKREDITASI";
}

/** Hitung semuanya sekaligus dari daftar butir. */
export function hitungPenilaian(butir: ButirHitung[]): HasilPenilaian {
  const kriteriaUnik = [...new Set(butir.map((b) => b.kriteria))];
  // urutkan sesuai URUTAN_KRITERIA; kriteria tak dikenal ditaruh di belakang
  kriteriaUnik.sort((a, b) => {
    const ia = URUTAN_KRITERIA.indexOf(a as (typeof URUTAN_KRITERIA)[number]);
    const ib = URUTAN_KRITERIA.indexOf(b as (typeof URUTAN_KRITERIA)[number]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  const perKriteria: RerataKriteria[] = kriteriaUnik.map((k) => {
    const daftar = butir.filter((b) => b.kriteria === k);
    const bobot = totalBobot(daftar);
    const mentah = nilaiBerbobot(daftar);
    return {
      kriteria: k,
      nama: NAMA_KRITERIA[k] ?? k,
      jumlahButir: daftar.length,
      jumlahTerisi: daftar.filter((b) => b.skor !== null).length,
      bobot,
      nilaiBerbobot: mentah,
      nilai: bulatkan(mentah / SKOR_MAKS),
      rerata: rerataKriteria(daftar),
      semuaButirAman: semuaButirAman(daftar),
      kunci: (KRITERIA_KUNCI as readonly string[]).includes(k),
    };
  });

  const nilai = nilaiAkhir(butir);
  const dinilai = butir.filter((b) => b.skor !== null);

  const rerataKunci: Record<string, number | null> = {};
  for (const k of KRITERIA_KUNCI) {
    rerataKunci[k] = perKriteria.find((p) => p.kriteria === k)?.rerata ?? null;
  }

  // Syarat Unggul hanya berlaku pada butir C1–C3, sesuai bunyi §V.
  const butirKunci = butir.filter((b) => (KRITERIA_KUNCI as readonly string[]).includes(b.kriteria));

  const rerataKunciOk = KRITERIA_KUNCI.every((k) => (rerataKunci[k] ?? 0) >= RERATA_KUNCI_MIN);
  const semuaButirOk = butirKunci.length > 0 ? semuaButirAman(butirKunci) : false;

  const butirPenghambat = butirKunci
    .filter((b) => b.skor === null || b.skor < BUTIR_MIN)
    .map((b) => ({ kode: b.kode, skor: b.skor, kriteria: b.kriteria }));

  return {
    nilaiAkhir: nilai,
    totalButir: butir.length,
    jumlahTerisi: dinilai.length,
    jumlahKosong: butir.length - dinilai.length,
    lengkap: butir.length > 0 && dinilai.length === butir.length,
    perKriteria,
    rerataKunci,
    rerataKunciOk,
    semuaButirOk,
    butirPenghambat,
    skorTerendah:
      dinilai.length === 0 ? null : Math.min(...dinilai.map((b) => b.skor as number)),
    status: prediksiStatus(nilai, rerataKunciOk, semuaButirOk),
  };
}

/**
 * Cek total bobot hasil seed. Kalau tidak persis 400, seluruh prediksi salah —
 * dashboard harus menolak render (Edge Case §7 RANCANGAN-012).
 */
export function bobotValid(butir: ButirHitung[]): boolean {
  return totalBobot(butir) === BOBOT_TOTAL;
}

/** Bulatkan ke 2 desimal — menghindari 60,49999999 dari aritmetika float. */
export function bulatkan(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Persentase progres pengisian butir. */
export function persenTerisi(jumlahTerisi: number, total: number): number {
  return total === 0 ? 0 : Math.round((jumlahTerisi / total) * 100);
}

/** Label skor 1–4 sesuai deskriptor matriks. */
export const SKOR_LABEL: Record<number, string> = {
  1: "Kurang",
  2: "Cukup",
  3: "Baik",
  4: "Sangat Baik",
};

/** Ambient warna rerata kriteria: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20. */
export function warnaRerata(rerata: number | null): "merah" | "amber" | "hijau" | "abu" {
  if (rerata === null) return "abu";
  if (rerata < BUTIR_MIN) return "merah";
  if (rerata < RERATA_KUNCI_MIN) return "amber";
  return "hijau";
}
