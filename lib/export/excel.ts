/**
 * Excel Export Module
 * Menghasilkan berkas .xlsx (ExcelJS) berisi SELURUH tabel LKPS dalam satu lembar,
 * dikelompokkan per Kriteria (istilah LAM INFOKOM 2.1).
 *
 * CATATAN TIPOGRAFI — kenapa ukurannya begini:
 * Versi sebelumnya memakai font data 9-10pt. Di Excel 10pt terlihat kecil sekali,
 * apalagi setelah dicetak/di-zoom. Sekarang: judul 20, subjudul 12, header
 * kriteria 14, nama tabel 12, header kolom & isi 11 (ukuran normal Excel),
 * keterangan kecil 10. Tinggi baris ikut konten (bukan dipatok 24).
 */

import ExcelJS from "exceljs";
import type { TableData, ColumnDef } from "./helpers";
import { STATUS_LABELS } from "./helpers";

interface ExcelExportOptions {
  tables: TableData[];
}

/** Nama kriteria mengikuti LAM INFOKOM 2.1 (sama dengan sidebar aplikasi). */
const KRITERIA_NAMES: Record<number, string> = {
  1: "Budaya Mutu",
  2: "Relevansi Pendidikan",
  3: "Relevansi Penelitian",
  4: "Relevansi PkM",
  5: "Akuntabilitas",
  6: "Diferensiasi Misi",
};

// Warna per kriteria (dipakai header kriteria, sub-header tabel, dan baris zebra)
const KRITERIA_COLORS: Record<number, { header: string; subHeader: string; rowEven: string; rowOdd: string }> = {
  1: { header: "FF1A78D6", subHeader: "FFDBEAFE", rowEven: "FFF3F8FD", rowOdd: "FFFFFFFF" },
  2: { header: "FF1BAF7A", subHeader: "FFD1FAE5", rowEven: "FFF2FBF7", rowOdd: "FFFFFFFF" },
  3: { header: "FFEB6834", subHeader: "FFFED7AA", rowEven: "FFFDF4EE", rowOdd: "FFFFFFFF" },
  4: { header: "FFE34948", subHeader: "FFFECACA", rowEven: "FFFDF2F2", rowOdd: "FFFFFFFF" },
  5: { header: "FF4A3AA7", subHeader: "FFE9E5FB", rowEven: "FFF6F3FC", rowOdd: "FFFFFFFF" },
  6: { header: "FFEDA100", subHeader: "FFFEF3C7", rowEven: "FFFEFAF0", rowOdd: "FFFFFFFF" },
};

const BORDER_LIGHT = "FFD8D7D0";
const TEKS = "FF1F2937";
const TEKS_REDUP = "FF6B7280";

/** Lebar kolom maksimum (satuan Excel). Yogi minta dinaikkan dari 34 → 50. */
const LEBAR_MAKS = 50;

/** Font seluruh laporan. Permintaan Yogi: Times New Roman (gaya dokumen akademik). */
const FONT_NAME = "Times New Roman";

/** Ukuran font terpusat. Judul tabel 14, isi tabel 12. */
const FONT = {
  judul: 20,
  subjudul: 13,
  keterangan: 11,
  kriteria: 16,
  namaTabel: 14,
  headerKolom: 12,
  data: 12,
  ringkasan: 12,
};

/** Bikin objek font ExcelJS lengkap dengan nama font, biar tak ada yang kelupaan. */
function huruf(size: number, tambahan: Partial<ExcelJS.Font> = {}): Partial<ExcelJS.Font> {
  return { name: FONT_NAME, size, ...tambahan };
}

export async function generateExcelWorkbook(options: ExcelExportOptions): Promise<Buffer> {
  const { tables } = options;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SIM-LKPS";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("LKPS Laporan", {
    views: [{ state: "frozen", ySplit: 3, zoomScale: 100 }],
  });

  // Kolom terbanyak di antara semua tabel → lebar area judul/merge
  let maxColumns = 5;
  for (const table of tables) {
    const cols = (table.definition.kolomDefinitions || []).filter((c) => c.type !== "header");
    if (cols.length > maxColumns) maxColumns = cols.length;
  }
  const lastColLetter = columnNumberToLetter(maxColumns);
  const firstTa = tables[0]?.lkps?.tahunAkademik;

  // ── Lebar kolom: dipaskan ke panjang teks ─────────────────────────
  // Dihitung DULU sebelum menulis sel, karena angkanya juga dipakai untuk
  // memperkirakan tinggi baris (teks yang tak muat akan turun ke bawah).
  //
  // Cara hitungnya: ambil panjang teks pada persentil 85 dari seluruh isi
  // kolom itu (bukan yang paling panjang), supaya SATU teks panjang — misal
  // satu uraian tupoksi 119 karakter — tidak memaksa kolom jadi lebar untuk
  // semua baris. Judul kolom selalu ikut dihitung supaya tidak terpotong.
  // Teks yang tetap lebih panjang dari kolomnya dibungkus (wrapText).
  const lebarAkhir: number[] = [];
  for (let i = 0; i < maxColumns; i++) {
    let panjangJudul = 0;
    const panjangIsi: number[] = [];
    for (const table of tables) {
      const cols = (table.definition.kolomDefinitions || []).filter((c) => c.type !== "header");
      const col = cols[i];
      if (!col) continue;
      panjangJudul = Math.max(panjangJudul, col.label.length);
      for (const row of table.lkps?.rows || []) {
        const teks = teksSel(row.rowData[col.key]).replace(/\s+/g, " ").trim();
        if (teks) panjangIsi.push(teks.length);
      }
    }
    panjangIsi.sort((a, b) => a - b);
    const p85 = panjangIsi.length > 0 ? panjangIsi[Math.min(Math.floor(panjangIsi.length * 0.85), panjangIsi.length - 1)]! : 0;
    const terpanjang = Math.max(panjangJudul, Math.min(p85, LEBAR_MAKS));
    lebarAkhir[i] = Math.max(8, Math.min(Math.ceil(lebarTeks("x".repeat(terpanjang))), LEBAR_MAKS));
  }

  // ── Kepala laporan ────────────────────────────────────────────────
  sheet.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = sheet.getCell("A1");
  titleCell.value = "LAPORAN KINERJA PROGRAM STUDI (LKPS)";
  titleCell.font = huruf(FONT.judul, { bold: true, color: { argb: "FFFFFFFF" } });
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  sheet.getRow(1).height = 40;

  sheet.mergeCells(`A2:${lastColLetter}2`);
  const subCell = sheet.getCell("A2");
  subCell.value = `${firstTa?.prodi.nama || "-"} (${firstTa?.prodi.jenjang || ""})  •  ${firstTa?.tahun || ""} ${firstTa?.semester || ""}`;
  subCell.font = huruf(FONT.subjudul, { bold: true, color: { argb: TEKS } });
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
  sheet.getRow(2).height = 26;

  sheet.mergeCells(`A3:${lastColLetter}3`);
  const infoCell = sheet.getCell("A3");
  infoCell.value = `Universitas Bina Bangsa Getsempena  •  Instrumen LAM INFOKOM 2.1  •  Dicetak: ${new Date().toLocaleString("id-ID")}`;
  infoCell.font = huruf(FONT.keterangan, { italic: true, color: { argb: TEKS_REDUP } });
  infoCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 20;

  sheet.addRow([]);
  let currentRow = sheet.rowCount;

  // ── Kelompokkan per kriteria ──────────────────────────────────────
  const tablesByKriteria = new Map<number, TableData[]>();
  for (const table of tables) {
    const kriteria = table.definition.bab;
    if (!tablesByKriteria.has(kriteria)) tablesByKriteria.set(kriteria, []);
    tablesByKriteria.get(kriteria)!.push(table);
  }
  const sortedKriteria = Array.from(tablesByKriteria.keys()).sort((a, b) => a - b);

  // ── Ringkasan (dibaca duluan sebelum masuk ke tabel) ──────────────
  currentRow++;
  sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const ringkasJudul = sheet.getRow(currentRow).getCell(1);
  ringkasJudul.value = "RINGKASAN PER KRITERIA";
  ringkasJudul.font = huruf(FONT.kriteria, { bold: true, color: { argb: "FFFFFFFF" } });
  ringkasJudul.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  ringkasJudul.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
  sheet.getRow(currentRow).height = 30;

  // Header ringkasan
  currentRow++;
  const ringkasHeader = sheet.getRow(currentRow);
  ["Kriteria", "Jumlah Tabel", "Terisi", "Disetujui", "Menunggu", "Ditolak"].forEach((label, i) => {
    const cell = ringkasHeader.getCell(i + 1);
    cell.value = label;
    cell.font = huruf(FONT.ringkasan, { bold: true, color: { argb: "FFFFFFFF" } });
    cell.alignment = { horizontal: i === 0 ? "left" : "center", vertical: "middle", indent: i === 0 ? 1 : 0 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF64748B" } };
    cell.border = semuaSisi("FF64748B");
  });
  ringkasHeader.height = 24;

  for (const kriteria of sortedKriteria) {
    const daftar = tablesByKriteria.get(kriteria)!;
    const jumlah = daftar.length;
    const terisi = daftar.filter((t) => (t.lkps?.rows.length || 0) > 0).length;
    const disetujui = daftar.filter((t) => t.lkps?.status === "DISETUJUI").length;
    const menunggu = daftar.filter((t) => t.lkps?.status === "DIAJUKAN").length;
    const ditolak = daftar.filter((t) => t.lkps?.status === "DITOLAK" || t.lkps?.status === "DIREVISI").length;

    currentRow++;
    const baris = sheet.getRow(currentRow);
    const nilai = [
      `Kriteria ${kriteria} — ${KRITERIA_NAMES[kriteria] || ""}`,
      jumlah,
      terisi,
      disetujui,
      menunggu,
      ditolak,
    ];
    nilai.forEach((v, i) => {
      const cell = baris.getCell(i + 1);
      cell.value = v;
      cell.font = huruf(FONT.ringkasan, { color: { argb: TEKS }, bold: i === 0 });
      cell.alignment = { horizontal: i === 0 ? "left" : "center", vertical: "middle", indent: i === 0 ? 1 : 0 };
      cell.border = semuaSisi(BORDER_LIGHT);
      if (i > 0) cell.numFmt = "0";
    });
    baris.height = 22;
  }

  // ── Isi tiap kriteria ─────────────────────────────────────────────
  for (const kriteria of sortedKriteria) {
    const daftarTabel = tablesByKriteria.get(kriteria)!;
    const warna = KRITERIA_COLORS[kriteria] || KRITERIA_COLORS[1]!;

    currentRow += 2;
    sheet.getRow(currentRow - 1).height = 10;

    // Judul kriteria
    sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
    const headKriteria = sheet.getRow(currentRow);
    const selKriteria = headKriteria.getCell(1);
    selKriteria.value = `KRITERIA ${kriteria} — ${KRITERIA_NAMES[kriteria] || ""}`;
    selKriteria.font = huruf(FONT.kriteria, { bold: true, color: { argb: "FFFFFFFF" } });
    selKriteria.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    selKriteria.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warna.header } };
    headKriteria.height = 34;

    for (const table of daftarTabel) {
      const { definition, lkps } = table;
      const dataColumns: ColumnDef[] = (definition.kolomDefinitions || []).filter((c) => c.type !== "header");

      currentRow++;
      sheet.getRow(currentRow).height = 10;

      // Nama tabel
      currentRow++;
      sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const barisNama = sheet.getRow(currentRow);
      const selNama = barisNama.getCell(1);
      selNama.value = `${definition.kode}  •  ${definition.nama}`;
      selNama.font = huruf(FONT.namaTabel, { bold: true, color: { argb: TEKS } });
      selNama.alignment = { horizontal: "left", vertical: "middle", indent: 1, wrapText: true };
      selNama.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warna.subHeader } };
      selNama.border = semuaSisi(warna.header);
      barisNama.height = 26;

      // Status + jumlah data
      currentRow++;
      const status = lkps ? STATUS_LABELS[lkps.status] : "Belum Diisi";
      const rowCount = lkps?.rows.length || 0;
      sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const barisStatus = sheet.getRow(currentRow);
      const selStatus = barisStatus.getCell(1);
      selStatus.value = `Status: ${status}   •   Jumlah data: ${rowCount} baris`;
      selStatus.font = huruf(FONT.keterangan, { italic: true, color: { argb: TEKS_REDUP } });
      selStatus.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      barisStatus.height = 20;

      // Header kolom
      currentRow++;
      const barisHeader = sheet.getRow(currentRow);
      dataColumns.forEach((col, idx) => {
        const cell = barisHeader.getCell(idx + 1);
        cell.value = col.label;
        cell.font = huruf(FONT.headerKolom, { bold: true, color: { argb: "FFFFFFFF" } });
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warna.header } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = semuaSisi(warna.header);
      });
      barisHeader.height = 32;

      // Isi
      const rows = lkps?.rows || [];
      if (rows.length === 0) {
        currentRow++;
        sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
        const barisKosong = sheet.getRow(currentRow);
        const cell = barisKosong.getCell(1);
        cell.value = "— belum ada data untuk tabel ini —";
        cell.font = huruf(FONT.data, { italic: true, color: { argb: TEKS_REDUP } });
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
        cell.border = semuaSisi(BORDER_LIGHT);
        barisKosong.height = 26;
      } else {
        rows.forEach((row, index) => {
          currentRow++;
          const barisData = sheet.getRow(currentRow);
          const isEven = index % 2 === 0;
          const warnaBaris = isEven ? warna.rowEven : warna.rowOdd;
          let terpanjang = 1;

          dataColumns.forEach((col, idx) => {
            const cell = barisData.getCell(idx + 1);
            const value = row.rowData[col.key];

            if (value === null || value === undefined || value === "") {
              cell.value = "";
            } else if (Array.isArray(value)) {
              cell.value = value.join(", ");
            } else if (typeof value === "object") {
              cell.value = JSON.stringify(value);
            } else if (col.type === "number" && !Number.isNaN(Number(value))) {
              // Angka ditulis sebagai angka + pemisah ribuan, bukan teks.
              // Tanpa ini, "3222443214" tampil sebagai deretan digit yang sulit dibaca.
              cell.value = Number(value);
              cell.numFmt = Number.isInteger(Number(value)) ? "#,##0" : "#,##0.##";
            } else {
              cell.value = String(value);
            }

            const teks = String(cell.value ?? "");
            const lebarKolom = lebarAkhir[idx] ?? 20;
            terpanjang = Math.max(terpanjang, Math.ceil(teks.length / Math.max(lebarKolom - 2, 6)));

            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warnaBaris } };
            cell.font = huruf(FONT.data, { color: { argb: TEKS } });
            cell.alignment = {
              horizontal: col.type === "number" ? "right" : "left",
              vertical: "top",
              wrapText: true,
              indent: col.type === "number" ? 0 : 1,
            };
            cell.border = semuaSisi(BORDER_LIGHT);
          });

          // Tinggi baris mengikuti isi (baris yang teksnya panjang jadi lebih tinggi)
          barisData.height = Math.min(Math.max(terpanjang * 15 + 8, 24), 150);
        });
      }
    }
  }

  // ── Catatan penutup ───────────────────────────────────────────────
  currentRow += 2;
  sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const footerCell = sheet.getCell(`A${currentRow}`);
  footerCell.value = `Dibuat otomatis oleh SIM-LKPS • ${new Date().toLocaleString("id-ID")}`;
  footerCell.font = huruf(FONT.keterangan, { italic: true, color: { argb: TEKS_REDUP } });
  footerCell.alignment = { horizontal: "right", vertical: "middle" };
  sheet.getRow(currentRow).height = 20;

  // ── Terapkan lebar kolom ──────────────────────────────────────────
  for (let i = 1; i <= maxColumns; i++) {
    sheet.getColumn(i).width = lebarAkhir[i - 1] ?? 14;
  }

  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer as ArrayBuffer);
}

/** Ubah nilai sel jadi teks (sama seperti yang ditulis ke lembar Excel). */
function teksSel(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/**
 * Perkiraan lebar kolom (satuan Excel) untuk sebuah teks.
 * Satuan lebar Excel mengikuti lebar karakter font bawaan (Calibri 11);
 * Times New Roman 12 sekitar 5% lebih lebar, jadi dikali 1.05 lalu ditambah
 * sedikit ruang tepi supaya teks terpanjang tidak menyentuh garis kolom.
 */
function lebarTeks(teks: string): number {
  const bersih = teks.replace(/\s+/g, " ").trim();
  return bersih.length * 1.05 + 1.2;
}

function semuaSisi(warna: string): Partial<ExcelJS.Borders> {
  return {
    top: { style: "thin", color: { argb: warna } },
    left: { style: "thin", color: { argb: warna } },
    bottom: { style: "thin", color: { argb: warna } },
    right: { style: "thin", color: { argb: warna } },
  };
}

function columnNumberToLetter(num: number): string {
  let result = "";
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
}

/** Excel untuk satu tabel saja (dipakai export per kriteria bila dibutuhkan). */
export async function generateSingleTableExcel(table: TableData): Promise<Buffer> {
  return generateExcelWorkbook({ tables: [table] });
}
