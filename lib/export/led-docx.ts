/**
 * Pembangun Word (`.docx`) untuk dokumen LED.
 *
 * Format mengikuti Lampiran 2 Instrumen LED LAM INFOKOM 2.1:
 * A4, Arial 11 pt, spasi 1,15, margin 3 cm, nomor halaman di footer.
 *
 * Memakai library `docx` (sudah dipakai modul export LKPS) — TIDAK memakai
 * Playwright/Chromium karena gagal di Vercel (lihat RANCANGAN-005).
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ISectionOptions,
} from "docx";
import type { LedBagianData } from "@/components/led/types";
import {
  sanitasiTeks,
  pecahInline,
  susunDokumenLed,
  type Blok,
  type Potongan,
} from "./led-dokumen";

/** docx pakai half-point: 11 pt → 22. */
const UKURAN = 22;
/** Spasi 1,15 = 276 twips (240 = 1,0). */
const SPASI = { line: 276, lineRule: "auto" as const };

const FONT = "Arial";

export type MetaLed = {
  perguruanTinggi: string;
  prodi: string;
  jenjang: string;
  tahun: string;
  semester: string;
  /** Tanggal cetak; default sekarang. */
  tanggal?: Date;
};

type AnakDokumen = Paragraph | Table;

/** TextRun dari potongan inline yang sudah dipecah. */
function runs(teks: string, opsi?: { bold?: boolean; italic?: boolean; ukuran?: number; warna?: string }): TextRun[] {
  return pecahInline(sanitasiTeks(teks)).map(
    (p: Potongan) =>
      new TextRun({
        text: p.teks,
        bold: opsi?.bold || p.bold,
        italics: opsi?.italic || p.italic,
        font: p.kode ? "Courier New" : FONT,
        size: opsi?.ukuran ?? UKURAN,
        ...(opsi?.warna ? { color: opsi.warna } : {}),
      }),
  );
}

/** Blok Markdown → paragraf docx. */
function blokKeParagraf(blok: Blok[]): AnakDokumen[] {
  const hasil: AnakDokumen[] = [];

  for (const b of blok) {
    switch (b.tipe) {
      case "heading": {
        const level =
          b.level <= 1
            ? HeadingLevel.HEADING_2
            : b.level === 2
              ? HeadingLevel.HEADING_3
              : HeadingLevel.HEADING_4;
        hasil.push(
          new Paragraph({
            heading: level,
            spacing: { before: 200, after: 100, ...SPASI },
            children: runs(b.teks, { bold: true }),
          }),
        );
        break;
      }

      case "paragraf":
        hasil.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120, ...SPASI },
            children: runs(b.teks),
          }),
        );
        break;

      case "list":
        for (const item of b.item) {
          hasil.push(
            new Paragraph({
              ...(b.ordered
                ? { numbering: { reference: "daftar-nomor", level: 0 } }
                : { bullet: { level: 0 } }),
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 60, ...SPASI },
              children: runs(item),
            }),
          );
        }
        break;

      case "quote":
        hasil.push(
          new Paragraph({
            indent: { left: 567 },
            spacing: { after: 120, ...SPASI },
            children: runs(b.teks, { italic: true }),
          }),
        );
        break;

      case "hr":
        hasil.push(
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 1 },
            },
            spacing: { after: 120 },
            children: [],
          }),
        );
        break;

      case "code":
        hasil.push(
          new Paragraph({
            shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
            spacing: { after: 120, ...SPASI },
            children: [
              new TextRun({ text: sanitasiTeks(b.teks), font: "Courier New", size: 18 }),
            ],
          }),
        );
        break;
    }
  }

  return hasil;
}

/** Sel tabel sederhana. */
function sel(teks: string, opsi?: { header?: boolean; lebar?: number; tengah?: boolean }): TableCell {
  return new TableCell({
    ...(opsi?.lebar ? { width: { size: opsi.lebar, type: WidthType.PERCENTAGE } } : {}),
    ...(opsi?.header ? { shading: { fill: "E8E8E8", type: ShadingType.CLEAR } } : {}),
    children: [
      new Paragraph({
        alignment: opsi?.tengah ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: runs(teks, { bold: opsi?.header, ukuran: 20 }),
      }),
    ],
  });
}

/** Halaman muka: judul, identitas, dan tanggal cetak. */
function halamanMuka(meta: MetaLed): AnakDokumen[] {
  const out: AnakDokumen[] = [];

  out.push(new Paragraph({ spacing: { before: 1200 }, children: [] }));

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: sanitasiTeks(meta.perguruanTinggi.toUpperCase()),
          bold: true,
          font: FONT,
          size: 28,
        }),
      ],
    }),
  );

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: sanitasiTeks(`${meta.prodi} (${meta.jenjang})`),
          font: FONT,
          size: 24,
        }),
      ],
    }),
  );

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "LAPORAN EVALUASI DIRI",
          bold: true,
          font: FONT,
          size: 36,
        }),
      ],
    }),
  );

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 900 },
      children: [
        new TextRun({
          text: "Akreditasi Program Studi — LAM INFOKOM 2.1",
          font: FONT,
          size: 24,
        }),
      ],
    }),
  );

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: sanitasiTeks(`Tahun Akademik ${meta.tahun} — ${meta.semester}`),
          font: FONT,
          size: 24,
        }),
      ],
    }),
  );

  out.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: sanitasiTeks(
            `Dicetak: ${(meta.tanggal ?? new Date()).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}`,
          ),
          font: FONT,
          size: 20,
          color: "666666",
        }),
      ],
    }),
  );

  return out;
}

/** Daftar isi manual — Word tidak menghitung ulang TOC dari field secara langsung. */
function daftarIsi(bagian: LedBagianData[]): AnakDokumen[] {
  const out: AnakDokumen[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
      children: runs("Daftar Isi", { bold: true, ukuran: 28 }),
    }),
  ];

  for (const b of bagian) {
    out.push(
      new Paragraph({
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: sanitasiTeks(`${b.kode.replace(/^BAB/, "BAB ")}  ${b.judul}`),
            font: FONT,
            size: 20,
          }),
        ],
      }),
    );
  }

  return out;
}

/**
 * Bangun dokumen Word lengkap.
 *
 * Mengembalikan Buffer siap kirim. Tidak menyentuh DB — pemanggil yang
 * menyiapkan `bagian` (lihat `lib/utils/led-export-query.ts`).
 */
export async function buildLedDocx(
  bagian: LedBagianData[],
  meta: MetaLed,
): Promise<Buffer> {
  const simpul = susunDokumenLed(bagian);
  const children: AnakDokumen[] = [];

  // ── Isi dokumen
  for (const s of simpul) {
    if (s.tipe === "bab") {
      children.push(
        new Paragraph({
          pageBreakBefore: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240, ...SPASI },
          children: [
            new TextRun({
              text: sanitasiTeks(`BAB ${s.nomor}`),
              bold: true,
              font: FONT,
              size: 32,
            }),
          ],
        }),
      );
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 360, ...SPASI },
          children: [
            new TextRun({ text: sanitasiTeks(s.judul), bold: true, font: FONT, size: 26 }),
          ],
        }),
      );
      continue;
    }

    if (s.tipe === "kelompok") {
      children.push(
        new Paragraph({
          spacing: { before: 320, after: 160, ...SPASI },
          children: [
            new TextRun({ text: sanitasiTeks(s.judul), bold: true, font: FONT, size: 26 }),
          ],
        }),
      );
      continue;
    }

    // bagian
    const nomor = sanitasiTeks(s.label);
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120, ...SPASI },
        children: runs(`${nomor}  ${s.judul}`, { bold: true, ukuran: 24 }),
      }),
    );

    if (s.tahapPpepp) {
      const label: Record<string, string> = {
        PENETAPAN: "Penetapan",
        PELAKSANAAN: "Pelaksanaan",
        EVALUASI: "Evaluasi",
        PENGENDALIAN: "Pengendalian",
        PENINGKATAN: "Peningkatan",
      };
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `Tahap PPEPP: ${label[s.tahapPpepp] ?? s.tahapPpepp}`,
              font: FONT,
              size: 18,
              italics: true,
              color: "666666",
            }),
          ],
        }),
      );
    }

    if (s.kosong) {
      children.push(
        new Paragraph({
          spacing: { after: 120, ...SPASI },
          children: [
            new TextRun({
              text: "[belum diisi]",
              font: FONT,
              size: UKURAN,
              italics: true,
              color: "999999",
            }),
          ],
        }),
      );
      continue;
    }

    children.push(...blokKeParagraf(s.blok));
  }

  // ── Halaman muka + daftar isi ditaruh paling depan
  const depan = [...halamanMuka(meta), ...daftarIsi(bagian)];
  const section: ISectionOptions = {
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4 twips
        margin: { top: 1701, right: 1701, bottom: 1701, left: 1701 }, // 3 cm
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: sanitasiTeks(`LED ${meta.prodi} — ${meta.tahun} ${meta.semester}`),
                font: FONT,
                size: 16,
                color: "888888",
              }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                children: ["Halaman ", PageNumber.CURRENT, " dari ", PageNumber.TOTAL_PAGES],
                font: FONT,
                size: 18,
                color: "666666",
              }),
            ],
          }),
        ],
      }),
    },
    children: [...depan, ...children],
  };

  const doc = new Document({
    creator: "SIM-LKPS",
    title: `Laporan Evaluasi Diri — ${meta.prodi}`,
    description: `LED ${meta.prodi} ${meta.tahun} ${meta.semester}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: UKURAN },
          paragraph: { spacing: SPASI },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "daftar-nomor",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [section],
  });

  return Packer.toBuffer(doc);
}
