import type { LedStatus } from "@prisma/client";

/** Data satu bagian LED yang dikirim dari server ke client. */
export type LedBuktiData = {
  id: string;
  filename: string;
  linkUrl: string | null;
  keterangan: string | null;
  createdAt: string;
};

export type LedIsianData = {
  id: string;
  konten: string;
  status: LedStatus;
  jumlahKarakter: number;
  updatedAt: string;
  evidence: LedBuktiData[];
};

export type LedBagianData = {
  id: string;
  kode: string;
  judul: string;
  petunjuk: string | null;
  tahapPpepp: string | null;
  subButir: string | null;
  kriteria: number | null;
  batasHalaman: number | null;
  isian: LedIsianData | null;
};

/** Hasil simpan dari server action — dipakai editor untuk menampilkan status. */
export type HasilSimpan =
  | { ok: true; konflik: false; updatedAt: string; status: LedStatus; jumlahKarakter: number }
  | { ok: false; konflik: true; updatedAt: string; pesan: string };
