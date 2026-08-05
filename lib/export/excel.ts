/**
 * Excel Export Module
 * Generates Excel (.xlsx) files using ExcelJS
 * Single sheet, all tables grouped by BAB with proper spacing and styling
 */

import ExcelJS from "exceljs";
import type { TableData, ColumnDef } from "./helpers";
import { STATUS_LABELS } from "./helpers";

interface ExcelExportOptions {
  tables: TableData[];
}

// BAB color palette (validated light-mode categorical)
const BAB_COLORS: Record<number, { header: string; subHeader: string; rowEven: string; rowOdd: string }> = {
  1: { header: "FF1A78D6", subHeader: "FFDBEAFE", rowEven: "FFEAF3FB", rowOdd: "FFFFFFFF" }, // blue
  2: { header: "FF1BAF7A", subHeader: "FFD1FAE5", rowEven: "FFEAFBF4", rowOdd: "FFFFFFFF" }, // aqua
  3: { header: "FFEB6834", subHeader: "FFFED7AA", rowEven: "FFFCEDE2", rowOdd: "FFFFFFFF" }, // orange
  4: { header: "FFE34948", subHeader: "FFFECACA", rowEven: "FFFCEDED", rowOdd: "FFFFFFFF" }, // red
  5: { header: "FF4A3AA7", subHeader: "FFE9E5FB", rowEven: "FFEFEAF7", rowOdd: "FFFFFFFF" }, // violet
  6: { header: "FFEDA100", subHeader: "FFFEF3C7", rowEven: "FFFDF6E2", rowOdd: "FFFFFFFF" }, // yellow
};

const BORDER_LIGHT = "FFE1E0D9";

/**
 * Generate Excel workbook from table data
 * Single sheet containing all tables grouped by BAB with proper spacing
 */
export async function generateExcelWorkbook(
  options: ExcelExportOptions
): Promise<Buffer> {
  const { tables } = options;
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "SIM-LKPS";
  workbook.created = new Date();

  // Single sheet
  const sheetName = "LKPS Laporan";
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", xSplit: 0, ySplit: 3 }],
  });

  // Determine max column count across all tables
  let maxColumns = 5;
  for (const table of tables) {
    const cols = (table.definition.kolomDefinitions || []).filter(
      (c) => c.type !== "header"
    );
    if (cols.length > maxColumns) maxColumns = cols.length;
  }

  const lastColLetter = columnNumberToLetter(maxColumns);
  const firstTa = tables[0]?.lkps?.tahunAkademik;

  // ==== MAIN TITLE ====
  sheet.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = sheet.getCell("A1");
  titleCell.value = "LAPORAN KINERJA PROGRAM STUDI (LKPS)";
  titleCell.font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F172A" },
  };
  sheet.getRow(1).height = 36;

  // Subtitle row
  sheet.mergeCells(`A2:${lastColLetter}2`);
  const subCell = sheet.getCell("A2");
  subCell.value = `${firstTa?.prodi.nama || "-"} (${firstTa?.prodi.jenjang || ""}) • ${firstTa?.tahun || ""} ${firstTa?.semester || ""}`;
  subCell.font = { size: 11, color: { argb: "FF0B0B0B" }, bold: true };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF9F9F7" },
  };
  sheet.getRow(2).height = 24;

  // Info bar
  sheet.mergeCells(`A3:${lastColLetter}3`);
  const infoCell = sheet.getCell("A3");
  infoCell.value = `Universitas Bina Bangsa Getsempena • Dicetak: ${new Date().toLocaleString("id-ID")}`;
  infoCell.font = { size: 9, color: { argb: "FF898781" }, italic: true };
  infoCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(3).height = 18;

  // Spacing row
  sheet.addRow([]);
  let currentRow = sheet.rowCount;

  // ==== GROUP TABLES BY BAB ====
  const tablesByBab = new Map<number, TableData[]>();
  for (const table of tables) {
    const bab = table.definition.bab;
    if (!tablesByBab.has(bab)) tablesByBab.set(bab, []);
    tablesByBab.get(bab)!.push(table);
  }

  const sortedBabs = Array.from(tablesByBab.keys()).sort((a, b) => a - b);

  // ==== EACH BAB ====
  for (const bab of sortedBabs) {
    const babTables = tablesByBab.get(bab)!;
    const babColor = BAB_COLORS[bab] || BAB_COLORS[1]!;

    // Empty row spacing before BAB
    currentRow++;
    sheet.getRow(currentRow).height = 8;

    // BAB section header
    currentRow++;
    sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
    const babHeaderRow = sheet.getRow(currentRow);
    const babHeaderCell = babHeaderRow.getCell(1);
    babHeaderCell.value = `BAB ${bab}`;
    babHeaderCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    babHeaderCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    babHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: babColor.header },
    };
    babHeaderRow.height = 32;

    // Each table inside BAB
    for (const table of babTables) {
      const { definition, lkps } = table;
      const dataColumns: ColumnDef[] = (definition.kolomDefinitions || []).filter(
        (c) => c.type !== "header"
      );

      // Spacing row
      currentRow++;
      sheet.getRow(currentRow).height = 8;

      // Table title row (sub-header)
      currentRow++;
      sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const tableTitleRow = sheet.getRow(currentRow);
      const tableTitleCell = tableTitleRow.getCell(1);
      tableTitleCell.value = `${definition.kode}  •  ${definition.nama}`;
      tableTitleCell.font = { bold: true, size: 12, color: { argb: "FF0B0B0B" } };
      tableTitleCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      tableTitleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: babColor.subHeader },
      };
      tableTitleRow.height = 26;

      // Status row
      currentRow++;
      const status = lkps ? STATUS_LABELS[lkps.status] : "Belum Diisi";
      const rowCount = lkps?.rows.length || 0;
      sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const statusRow = sheet.getRow(currentRow);
      const statusCell = statusRow.getCell(1);
      statusCell.value = `Status: ${status}   •   Jumlah data: ${rowCount}`;
      statusCell.font = { size: 9, color: { argb: "FF52514E" }, italic: true };
      statusCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFAFBFC" },
      };
      statusRow.height = 18;

      // Spacing row
      currentRow++;
      sheet.getRow(currentRow).height = 6;

      // Column headers row
      currentRow++;
      const headerRow = sheet.getRow(currentRow);
      dataColumns.forEach((col, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = col.label;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: babColor.header },
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin", color: { argb: babColor.header } },
          left: { style: "thin", color: { argb: babColor.header } },
          bottom: { style: "thin", color: { argb: babColor.header } },
          right: { style: "thin", color: { argb: babColor.header } },
        };
      });
      headerRow.height = 30;

      // Data rows
      const rows = lkps?.rows || [];
      if (rows.length === 0) {
        currentRow++;
        sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
        const emptyRow = sheet.getRow(currentRow);
        const cell = emptyRow.getCell(1);
        cell.value = "(Belum ada data)";
        cell.font = { italic: true, size: 10, color: { argb: "FF898781" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFAFBFC" },
        };
        emptyRow.height = 30;
      } else {
        rows.forEach((row, index) => {
          currentRow++;
          const dataRow = sheet.getRow(currentRow);
          const isEven = index % 2 === 0;
          const rowFill = isEven ? babColor.rowEven : babColor.rowOdd;

          // Set row height - bigger for content
          dataRow.height = 24;

          dataColumns.forEach((col, idx) => {
            const cell = dataRow.getCell(idx + 1);
            const value = row.rowData[col.key];
            if (value === null || value === undefined) {
              cell.value = "";
            } else if (Array.isArray(value)) {
              cell.value = value.join(", ");
            } else if (typeof value === "object") {
              cell.value = JSON.stringify(value);
            } else {
              cell.value = String(value);
            }

            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: rowFill },
            };
            cell.font = { size: 10, color: { argb: "FF0B0B0B" } };
            cell.alignment = {
              horizontal: col.type === "number" ? "right" : "left",
              vertical: "middle",
              wrapText: true,
              indent: 1,
            };
            cell.border = {
              top: { style: "thin", color: { argb: BORDER_LIGHT } },
              left: { style: "thin", color: { argb: BORDER_LIGHT } },
              bottom: { style: "thin", color: { argb: BORDER_LIGHT } },
              right: { style: "thin", color: { argb: BORDER_LIGHT } },
            };
          });
        });
      }
    }
  }

  // Bottom spacing
  currentRow++;
  sheet.getRow(currentRow).height = 12;

  // ==== FOOTER ====
  currentRow++;
  sheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const footerCell = sheet.getCell(`A${currentRow}`);
  footerCell.value = `Generated: ${new Date().toLocaleString("id-ID")} | SIM-LKPS v0.1.0`;
  footerCell.font = { size: 9, color: { argb: "FF898781" }, italic: true };
  footerCell.alignment = { horizontal: "right", vertical: "middle" };
  sheet.getRow(currentRow).height = 18;

  // Set column widths (auto-fit based on content)
  for (const table of tables) {
    const cols = (table.definition.kolomDefinitions || []).filter(
      (c) => c.type !== "header"
    );
    cols.forEach((col, idx) => {
      const currentWidth = sheet.getColumn(idx + 1).width || 0;
      // Width based on longest content (label + data)
      const headerWidth = col.label.length + 2;
      const dataWidth = (table.lkps?.rows || []).reduce((max, row) => {
        const val = row.rowData[col.key];
        const valStr = val === null || val === undefined ? "" : String(val);
        return Math.max(max, valStr.length);
      }, 0);
      const fitWidth = Math.min(Math.max(headerWidth, dataWidth) + 3, 50);
      if (fitWidth > currentWidth) {
        sheet.getColumn(idx + 1).width = fitWidth;
      }
    });
  }

  // Default widths for empty columns
  for (let i = 1; i <= maxColumns; i++) {
    if (!sheet.getColumn(i).width || sheet.getColumn(i).width! < 12) {
      sheet.getColumn(i).width = 14;
    }
  }

  // Page setup for printing
  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.5,
      bottom: 0.5,
      header: 0.3,
      footer: 0.3,
    },
  };

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer as ArrayBuffer);
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

/**
 * Generate Excel for a single table
 */
export async function generateSingleTableExcel(
  table: TableData
): Promise<Buffer> {
  return generateExcelWorkbook({ tables: [table] });
}