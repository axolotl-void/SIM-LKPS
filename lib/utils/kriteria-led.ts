/** Daftar 6 kriteria LED LAM INFOKOM 2.1 beserta bobotnya. */
export const KRITERIA_LED = [
  { nomor: 1, judul: "Budaya Mutu", bobot: 40 },
  { nomor: 2, judul: "Relevansi Pendidikan", bobot: 120 },
  { nomor: 3, judul: "Relevansi Penelitian", bobot: 72 },
  { nomor: 4, judul: "Relevansi Pengabdian kepada Masyarakat", bobot: 60 },
  { nomor: 5, judul: "Akuntabilitas", bobot: 40 },
  { nomor: 6, judul: "Diferensiasi Misi", bobot: 40 },
] as const;

/** Lima tahap siklus PPEPP. */
export const TAHAP_PPEPP = ["PENETAPAN", "PELAKSANAAN", "EVALUASI", "PENGENDALIAN", "PENINGKATAN"] as const;
