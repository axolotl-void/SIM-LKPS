/**
 * Lapisan dokumen LED — MURNI, tanpa DB/React.
 *
 * Mengubah daftar bagian LED + narasi Markdown menjadi urutan simpul dokumen
 * yang siap dicetak. Dipakai bersama oleh pembangun Word (`led-docx.ts`) dan
 * PDF (`led-pdf.tsx`), jadi urutan bagian & aturan kelengkapan hanya ditulis
 * sekali di sini.
 *
 * Urutan mengikuti Lampiran 1/2 Instrumen LED LAM INFOKOM 2.1:
 *   Ringkasan Eksekutif → BAB I → BAB II (A, B, C.1–C.6, D) → BAB III
 */

import type { LedBagianData } from "@/components/led/types";

// ─────────────────────────────────────────────────────────────
// Blok Markdown
// ─────────────────────────────────────────────────────────────

export type Blok =
  | { tipe: "heading"; level: number; teks: string }
  | { tipe: "paragraf"; teks: string }
  | { tipe: "list"; ordered: boolean; item: string[] }
  | { tipe: "quote"; teks: string }
  | { tipe: "hr" }
  | { tipe: "code"; teks: string };

const RE_BULLET = /^\s*[-*+]\s+(.*)$/;
const RE_NOMOR = /^\s*\d+[.)]\s+(.*)$/;
const RE_HR = /^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/;

/**
 * Parse Markdown jadi blok.
 *
 * Sengaja sebaris dengan renderer pratinjau (`lib/utils/markdown.tsx`) supaya
 * apa yang dilihat di editor sama dengan apa yang tercetak.
 */
export function parseMarkdownBlok(md: string): Blok[] {
  const baris = md.replace(/\r\n/g, "\n").split("\n");
  const hasil: Blok[] = [];
  let i = 0;

  while (i < baris.length) {
    const b = baris[i] ?? "";

    // code fence
    if (b.trimStart().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < baris.length && !(baris[i] ?? "").trimStart().startsWith("```")) {
        buf.push(baris[i] ?? "");
        i++;
      }
      i++;
      hasil.push({ tipe: "code", teks: buf.join("\n") });
      continue;
    }

    if (!b.trim()) {
      i++;
      continue;
    }

    if (RE_HR.test(b)) {
      hasil.push({ tipe: "hr" });
      i++;
      continue;
    }

    const h = /^(#{1,6})\s+(.*)$/.exec(b);
    if (h) {
      hasil.push({ tipe: "heading", level: (h[1] ?? "#").length, teks: (h[2] ?? "").trim() });
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(b)) {
      const buf: string[] = [];
      while (i < baris.length && /^\s*>\s?/.test(baris[i] ?? "")) {
        buf.push((baris[i] ?? "").replace(/^\s*>\s?/, ""));
        i++;
      }
      hasil.push({ tipe: "quote", teks: buf.join(" ") });
      continue;
    }

    const isBullet = RE_BULLET.test(b);
    const isNomor = RE_NOMOR.test(b);
    if (isBullet || isNomor) {
      const re = isNomor ? RE_NOMOR : RE_BULLET;
      const item: string[] = [];
      while (i < baris.length) {
        const cur = baris[i] ?? "";
        const m = re.exec(cur);
        if (m) {
          item.push((m[1] ?? "").trim());
          i++;
        } else if (cur.trim() && /^\s{2,}/.test(cur) && item.length) {
          item[item.length - 1] = `${item[item.length - 1]} ${cur.trim()}`;
          i++;
        } else {
          break;
        }
      }
      hasil.push({ tipe: "list", ordered: isNomor, item });
      continue;
    }

    const buf: string[] = [];
    while (i < baris.length) {
      const cur = baris[i] ?? "";
      if (
        !cur.trim() ||
        /^(#{1,6})\s/.test(cur) ||
        RE_BULLET.test(cur) ||
        RE_NOMOR.test(cur) ||
        /^\s*>\s?/.test(cur) ||
        cur.trimStart().startsWith("```") ||
        RE_HR.test(cur)
      ) {
        break;
      }
      buf.push(cur.trim());
      i++;
    }
    if (buf.length) hasil.push({ tipe: "paragraf", teks: buf.join(" ") });
  }

  return hasil;
}

// ─────────────────────────────────────────────────────────────
// Teks inline (bold/italic/code) → potongan berformat
// ─────────────────────────────────────────────────────────────

export type Potongan = { teks: string; bold?: boolean; italic?: boolean; kode?: boolean };

const RE_INLINE = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/g;

/** Pecah teks inline jadi potongan berformat, untuk TextRun/Text dokumen. */
export function pecahInline(teks: string): Potongan[] {
  const bagian = teks.split(RE_INLINE).filter((s) => s !== "");
  const hasil: Potongan[] = [];

  for (const s of bagian) {
    if (s.length > 2 && s.startsWith("`") && s.endsWith("`")) {
      hasil.push({ teks: s.slice(1, -1), kode: true });
    } else if (
      s.length > 4 &&
      ((s.startsWith("**") && s.endsWith("**")) || (s.startsWith("__") && s.endsWith("__")))
    ) {
      hasil.push({ teks: s.slice(2, -2), bold: true });
    } else if (s.length > 4 && s.startsWith("~~") && s.endsWith("~~")) {
      // coret → dicetak apa adanya; dokumen resmi tidak pakai strikethrough
      hasil.push({ teks: s.slice(2, -2) });
    } else if (
      s.length > 2 &&
      ((s.startsWith("*") && s.endsWith("*")) || (s.startsWith("_") && s.endsWith("_")))
    ) {
      hasil.push({ teks: s.slice(1, -1), italic: true });
    } else {
      hasil.push({ teks: s });
    }
  }

  return hasil.length ? hasil : [{ teks }];
}

/**
 * Bersihkan karakter yang tidak ada di Arial/Helvetica dan bikin rusak di
 * dokumen resmi (emoji, simbol aneh). Tanda baca tipografis dinormalkan.
 */
export function sanitasiTeks(teks: string): string {
  return teks
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\u2022/g, "-")
    // emoji & simbol di luar Basic Multilingual Plane aman, tapi variasi
    // selector dan zero-width dibuang supaya tidak jadi kotak kosong
    .replace(/[\uFE00-\uFE0F\u200B-\u200D]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

const teksPolos = (p: Potongan[]) => sanitasiTeks(p.map((x) => x.teks).join("")).trim();

/** Ringkas blok jadi satu kalimat — dipakai untuk daftar isi & pratinjau. */
export function ringkasBlok(blok: Blok[], maks = 160): string {
  for (const b of blok) {
    if (b.tipe === "paragraf" && b.teks.trim()) {
      const t = sanitasiTeks(b.teks).replace(/\s+/g, " ").trim();
      if (t.length <= maks) return t;
      // sisakan ruang untuk "..." supaya hasil akhir tidak melebihi `maks`
      return `${t.slice(0, Math.max(0, maks - 3)).trimEnd()}...`;
    }
  }
  return "";
}

// ─────────────────────────────────────────────────────────────
// Struktur dokumen
// ─────────────────────────────────────────────────────────────

export type SimpulDokumen =
  | { tipe: "bab"; nomor: string; judul: string }
  | { tipe: "kelompok"; kode: string; judul: string }
  | {
      tipe: "bagian";
      kode: string;
      judul: string;
      /** Judul kecil di atas narasi, mis. "A. Dasar Penyusunan". */
      label: string;
      tahapPpepp: string | null;
      batasHalaman: number | null;
      blok: Blok[];
      kosong: boolean;
      karakter: number;
      ringkas: string;
    };

export const JUDUL_BAB: Record<string, string> = {
  I: "Pendahuluan",
  II: "Laporan Evaluasi Diri",
  III: "Penutup",
};

const JUDUL_KELOMPOK: Record<string, string> = {
  "BAB2.A": "A. Kondisi Eksternal",
  "BAB2.B": "B. Profil Unit Pengelola Program Studi",
  "BAB2.C": "C. Kriteria",
  "BAB2.D": "D. Suplemen Program Studi",
};

/** Ambil huruf bagian dari kode, mis. "BAB2.C.1.1.A" → "C". */
function bagianDariKode(kode: string): string {
  const m = /^BAB2\.([A-D])/.exec(kode);
  return m?.[1] ?? "";
}

/**
 * Susun urutan dokumen dari bagian LED terurut.
 *
 * Simpul "kelompok" hanya muncul untuk BAB II (A/B/C/D) — struktur itu yang
 * dipakai instrumen, dan tanpa itu dokumen jadi daftar panjang tanpa peta.
 */
export function susunDokumenLed(bagian: LedBagianData[]): SimpulDokumen[] {
  const simpul: SimpulDokumen[] = [];
  let babAktif: string | null = null;
  let kelompokAktif: string | null = null;

  for (const b of bagian) {
    const bab = babDariKode(b.kode);

    if (bab && bab !== babAktif) {
      babAktif = bab;
      kelompokAktif = null;
      simpul.push({
        tipe: "bab",
        nomor: bab,
        judul: JUDUL_BAB[bab] ?? "",
      });
    }

    if (bab === "II") {
      const huruf = bagianDariKode(b.kode);
      const kunci = huruf ? `BAB2.${huruf}` : "";
      if (kunci && kunci !== kelompokAktif) {
        kelompokAktif = kunci;
        simpul.push({
          tipe: "kelompok",
          kode: kunci,
          judul: JUDUL_KELOMPOK[kunci] ?? huruf,
        });
      }
    }

    const konten = b.isian?.konten ?? "";
    const blok = konten.trim() ? parseMarkdownBlok(konten) : [];
    const karakter = b.isian?.jumlahKarakter ?? konten.length;

    simpul.push({
      tipe: "bagian",
      kode: b.kode,
      judul: sanitasiTeks(b.judul),
      label: labelBagian(b),
      tahapPpepp: b.tahapPpepp,
      batasHalaman: b.batasHalaman,
      blok,
      kosong: !konten.trim(),
      karakter,
      ringkas: ringkasBlok(blok),
    });
  }

  return simpul;
}

/** "BAB2.C.2.1.A" → "C.2.1.A" — nomor bagian tanpa awalan BAB. */
export function labelBagian(b: Pick<LedBagianData, "kode">): string {
  return b.kode.replace(/^BAB\d+\./, "");
}

function babDariKode(kode: string): string | null {
  const m = /^BAB(\d+)/.exec(kode);
  if (!m) return null;
  return { "1": "I", "2": "II", "3": "III" }[m[1] ?? ""] ?? null;
}

// ─────────────────────────────────────────────────────────────
// Pra-export
// ─────────────────────────────────────────────────────────────

export type BagianKosong = { kode: string; judul: string };

export type HasilPraExport = {
  jumlahBagian: number;
  jumlahKosong: number;
  kosong: BagianKosong[];
  totalKarakter: number;
  estimasiHalaman: number;
  batasHalaman: number;
  lebihBatas: boolean;
  /** true kalau tidak ada bagian kosong dan tidak lewat batas halaman. */
  siap: boolean;
};

export const BATAS_HALAMAN_LED = 150;
export const KARAKTER_PER_HALAMAN = 3000;

/** Periksa kelengkapan & estimasi halaman sebelum dokumen dibuat. */
export function periksaPraExport(
  bagian: LedBagianData[],
  opsi?: { batasHalaman?: number; karakterPerHalaman?: number },
): HasilPraExport {
  const batas = opsi?.batasHalaman ?? BATAS_HALAMAN_LED;
  const perHalaman = opsi?.karakterPerHalaman ?? KARAKTER_PER_HALAMAN;

  let totalKarakter = 0;
  const kosong: BagianKosong[] = [];

  for (const b of bagian) {
    const karakter = b.isian?.jumlahKarakter ?? (b.isian?.konten.length ?? 0);
    totalKarakter += karakter;
    if (!(b.isian?.konten ?? "").trim()) {
      kosong.push({ kode: b.kode, judul: b.judul });
    }
  }

  const estimasiHalaman = Math.ceil(totalKarakter / perHalaman);

  return {
    jumlahBagian: bagian.length,
    jumlahKosong: kosong.length,
    kosong,
    totalKarakter,
    estimasiHalaman,
    batasHalaman: batas,
    lebihBatas: estimasiHalaman > batas,
    siap: kosong.length === 0 && estimasiHalaman <= batas,
  };
}

/** Nama berkas unduhan: LED_<prodi>_<tahun>-<semester>_<tanggal>.<ext> */
export function namaBerkasLed(
  prodi: string,
  tahun: string,
  semester: string,
  ext: string,
  tanggal = new Date(),
): string {
  const bersih = (s: string) =>
    s
      .normalize("NFKD")
      // pemisah jalur & titik dua diganti strip supaya tidak terhapus begitu
      // saja dan tahun "2024/2025" tidak menempel jadi "20242025"
      .replace(/[/\\:]+/g, "-")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "");
  const tgl = tanggal.toISOString().slice(0, 10);
  return ["LED", bersih(prodi), bersih(`${tahun}-${semester}`), tgl]
    .filter(Boolean)
    .join("_")
    .concat(`.${ext}`);
}
