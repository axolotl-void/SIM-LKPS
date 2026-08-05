/**
 * PDF Export Module
 * Generates PDF files using Playwright (Chromium)
 * Single document with all tables grouped by BAB with color coding
 */

import type { TableData, ColumnDef } from "./helpers";
import { STATUS_LABELS } from "./helpers";

interface PDFExportOptions {
  tables: TableData[];
  title?: string;
}

// Browser instance cached
let browserInstance: import("playwright").Browser | null = null;

async function getBrowser(): Promise<import("playwright").Browser> {
  if (!browserInstance) {
    const { chromium } = await import("playwright");
    browserInstance = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserInstance;
}

// BAB colors (validated palette - hex without #)
const BAB_COLORS: Record<number, { header: string; subHeader: string; accent: string }> = {
  1: { header: "2A78D6", subHeader: "DBEAFE", accent: "1C5CAB" },
  2: { header: "1BAF7A", subHeader: "D1FAE5", accent: "199E70" },
  3: { header: "EB6834", subHeader: "FED7AA", accent: "D95926" },
  4: { header: "E34948", subHeader: "FECACA", accent: "D03B3B" },
  5: { header: "4A3AA7", subHeader: "DDD6FE", accent: "9085E9" },
  6: { header: "EDA100", subHeader: "FEF3C7", accent: "C98500" },
};

const FALLBACK_COLOR = { header: "0F172A", subHeader: "F1F5F9", accent: "52514E" };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generate HTML for PDF
 */
function generatePDFHtml(options: PDFExportOptions): string {
  const { tables, title = "Laporan Kinerja Program Studi (LKPS)" } = options;

  // Group by BAB
  const tablesByBab = new Map<number, TableData[]>();
  for (const table of tables) {
    const bab = table.definition.bab;
    if (!tablesByBab.has(bab)) tablesByBab.set(bab, []);
    tablesByBab.get(bab)!.push(table);
  }
  const sortedBabs = Array.from(tablesByBab.keys()).sort((a, b) => a - b);

  const firstTa = tables[0]?.lkps?.tahunAkademik;

  let bodyHtml = "";

  // ==== TITLE BLOCK ====
  bodyHtml += `
    <div class="title-block">
      <h1>LAPORAN KINERJA PROGRAM STUDI</h1>
      <h2>(LKPS)</h2>
    </div>

    <div class="info-box">
      <table class="info-table">
        <tr>
          <td class="label">Perguruan Tinggi</td>
          <td>Universitas Bina Bangsa Getsempena</td>
        </tr>
        <tr>
          <td class="label">Program Studi</td>
          <td>${escapeHtml(firstTa?.prodi.nama || "-")} (${escapeHtml(firstTa?.prodi.jenjang || "-")})</td>
        </tr>
        <tr>
          <td class="label">Tahun Akademik</td>
          <td>${escapeHtml(firstTa?.tahun || "-")} ${escapeHtml(firstTa?.semester || "")}</td>
        </tr>
        <tr>
          <td class="label">Tanggal Cetak</td>
          <td>${new Date().toLocaleString("id-ID")}</td>
        </tr>
      </table>
    </div>
  `;

  // ==== EACH BAB ====
  for (let i = 0; i < sortedBabs.length; i++) {
    const bab = sortedBabs[i]!;
    const babTables = tablesByBab.get(bab)!;
    const colors = BAB_COLORS[bab] || FALLBACK_COLOR;

    // BAB header band
    bodyHtml += `
      <div class="bab-header" style="background: #${colors.header};">
        BAB ${bab}
      </div>
    `;

    // Each table
    for (const table of babTables) {
      const { definition, lkps } = table;
      const dataColumns: ColumnDef[] = (definition.kolomDefinitions || []).filter(
        (c) => c.type !== "header"
      );

      const status = lkps ? STATUS_LABELS[lkps.status] : "Belum Diisi";
      const rowCount = lkps?.rows.length || 0;

      // Table header
      bodyHtml += `
        <div class="table-header" style="border-left: 4px solid #${colors.header};">
          <h3 style="color: #${colors.accent};">
            ${escapeHtml(definition.kode)} — ${escapeHtml(definition.nama)}
          </h3>
          <div class="table-meta">
            <span class="badge" style="background: #${colors.subHeader}; color: #${colors.accent};">
              ${rowCount} data
            </span>
            ${lkps ? `<span class="status">Status: <strong style="color: #${colors.accent};">${escapeHtml(status)}</strong></span>` : ""}
          </div>
        </div>
      `;

      // Build data rows
      const rows = lkps?.rows || [];
      let rowsHtml = "";
      if (rows.length === 0) {
        rowsHtml = `<tr><td colspan="${dataColumns.length || 1}" class="empty">Belum ada data</td></tr>`;
      } else {
        rows.forEach((row, index) => {
          const isEven = index % 2 === 0;
          const bgColor = isEven ? colors.subHeader : "FFFFFF";
          const cells = dataColumns
            .map((col) => {
              let value = row.rowData[col.key];
              if (value === null || value === undefined) value = "";
              if (Array.isArray(value)) value = value.join(", ");
              if (typeof value === "object") value = JSON.stringify(value);
              const align = col.type === "number" ? "right" : "left";
              return `<td style="background: #${bgColor}; text-align: ${align};">${escapeHtml(String(value))}</td>`;
            })
            .join("");
          rowsHtml += `<tr>${cells}</tr>`;
        });
      }

      // Header cells
      const headerCells = dataColumns
        .map((col) => `<th>${escapeHtml(col.label)}</th>`)
        .join("");

      bodyHtml += `
        <table class="data-table">
          <thead>
            <tr style="background: #${colors.header};">
              ${headerCells}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    }

    // Page break between BABs (except last)
    if (i < sortedBabs.length - 1) {
      bodyHtml += `<div class="page-break"></div>`;
    }
  }

  // ==== FOOTER ====
  bodyHtml += `
    <div class="footer">
      Generated: ${new Date().toLocaleString("id-ID")} | SIM-LKPS v0.1.0
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 10px;
          color: #0F172A;
          line-height: 1.5;
          background: #FFFFFF;
          padding: 0;
        }

        /* Title block */
        .title-block {
          background: #0F172A;
          color: #FFFFFF;
          padding: 24px 28px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .title-block h1 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 1px;
          margin: 0;
        }
        .title-block h2 {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-top: 4px;
          opacity: 0.8;
        }

        /* Info box */
        .info-box {
          border: 1px solid #E1E0D9;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          background: #F9F9F7;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table td {
          padding: 6px 8px;
          font-size: 10px;
        }
        .info-table td.label {
          font-weight: 600;
          color: #52514E;
          width: 30%;
        }

        /* BAB section header */
        .bab-header {
          color: #FFFFFF;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          border-radius: 6px;
          margin: 16px 0 12px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Table header */
        .table-header {
          padding: 10px 14px;
          margin: 8px 0 6px 0;
          background: #FFFFFF;
        }
        .table-header h3 {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        .table-meta {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 9px;
          color: #52514E;
        }
        .badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 9px;
        }
        .status {
          font-size: 9px;
          color: #52514E;
        }

        /* Data table */
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          font-size: 9px;
        }
        .data-table th {
          color: #FFFFFF;
          padding: 8px 10px;
          text-align: center;
          font-weight: 600;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .data-table td {
          padding: 7px 10px;
          border: 1px solid #E1E0D9;
          vertical-align: top;
        }
        .data-table .empty {
          text-align: center;
          color: #898781;
          font-style: italic;
          padding: 16px;
        }

        .page-break {
          page-break-after: always;
        }

        .footer {
          text-align: center;
          font-size: 8px;
          color: #898781;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #E1E0D9;
        }

        @page { size: A4; margin: 12mm; }
      </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `;
}

/**
 * Generate PDF document from table data
 */
export async function generatePDFDocument(
  options: PDFExportOptions
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const html = generatePDFHtml(options);
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        bottom: "12mm",
        left: "12mm",
        right: "12mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

/**
 * Generate PDF for a single table
 */
export async function generateSingleTablePDF(
  table: TableData
): Promise<Buffer> {
  return generatePDFDocument({ tables: [table] });
}