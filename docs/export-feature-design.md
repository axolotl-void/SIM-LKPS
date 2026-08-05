# Export Feature Design Document

**Versi:** 1.0  
**Tanggal:** 2026-08-02  
**Status:** READY TO EXECUTE  
**Priority:** P1 — High

---

## 1. Overview

Fitur export memungkinkan user mengunduh data LKPS dalam format:
- **Excel (.xlsx)** — Untuk editing/data manipulation
- **Word (.docx)** — Untuk laporan formal
- **PDF** — Untuk arsip/cetak

Target user: Admin, Operator, Validator, Pimpinan

---

## 2. Tech Stack

| Library | Purpose | Status |
|---------|---------|--------|
| **ExcelJS** | Generate Excel files | ✅ Already installed |
| **docx** | Generate Word documents | ✅ Already installed |
| **Puppeteer/Playwright** | PDF generation | ⚠️ Playwright installed, need config |

---

## 3. Export Scope

### 3.1 Per BAB
```
/laporan/export/[bab]
```
Export semua tabel dalam 1 BAB ke Excel/Word/PDF

### 3.2 Per Tabel
```
/laporan/export/[bab]/[tabel]
```
Export 1 tabel spesifik

### 3.3 Full Report
```
/laporan/export/all
```
Export semua 31 tabel dalam 1 file

### 3.4 Per Tahun Akademik
Filter berdasarkan tahun akademik aktif

---

## 4. Database Queries

### 4.1 Export Single Table

```typescript
async function getTableDataForExport(tabelKode: string, tahunAkademikId: string) {
  const definition = await db.tabelDefinition.findUnique({
    where: { kode: tabelKode }
  });

  const lkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: definition.id,
        tahunAkademikId,
      }
    },
    include: {
      rows: { orderBy: { rowOrder: 'asc' } },
      tahunAkademik: { include: { prodi: true } },
    }
  });

  return { definition, lkps };
}
```

### 4.2 Export BAB

```typescript
async function getBabDataForExport(bab: number, tahunAkademikId: string) {
  const definitions = await db.tabelDefinition.findMany({
    where: { bab },
    orderBy: { urutan: 'asc' }
  });

  const tables = await Promise.all(
    definitions.map(async (def) => {
      const lkps = await db.tabelLkps.findUnique({
        where: {
          tabelDefinitionId_tahunAkademikId: {
            tabelDefinitionId: def.id,
            tahunAkademikId,
          }
        },
        include: { rows: { orderBy: { rowOrder: 'asc' } } }
      });
      return { definition: def, lkps };
    })
  );

  return tables;
}
```

---

## 5. Excel Export Specification

### 5.1 File Structure

```
SIM-LKPS_[TahunAkademik]_[BAB-X]_[Timestamp].xlsx
Example: SIM-LKPS_2025-2026_BAB-1_20260802_1430.xlsx
```

### 5.2 Workbook Structure

**Sheet per Tabel:**
```
Sheet 1: "1.A.1 - Pimpinan"
Sheet 2: "1.A.2 - Pendanaan"
Sheet 3: "1.A.3 - Penggunaan Dana"
...
```

### 5.3 Sheet Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER SECTION                                              │
├─────────────────────────────────────────────────────────────┤
│ Institution: Universitas Bina Bangsa Getsempena                │
│ Program Studi: Ilmu Komputer (S1)                          │
│ Tahun Akademik: 2025/2026                                  │
│ Tabel: 1.A.1 - Pimpinan dan Tupoksi UPPS dan PS          │
│ Status: DISETUJUI | Updated: 2026-08-01                  │
├─────────────────────────────────────────────────────────────┤
│ DATA SECTION                                                │
├─────────┬──────────┬─────────────┬────────────┬──────────┤
│ No      │ Nama     │ Jabatan     │ Pendidikan  │ Tupoksi  │
├─────────┼──────────┼─────────────┼────────────┼──────────┤
│ 1       │ John Doe │ Dekan       │ S2         │ Memimpin │
│ 2       │ Jane     │ WD I        │ S2         │ Akademik │
├─────────┴──────────┴─────────────┴────────────┴──────────┤
│ FOOTER                                                      │
│ Generated: 2026-08-02 14:30:00 | SIM-LKPS v0.1.0         │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 ExcelJS Implementation

```typescript
// lib/export/excel.ts
import ExcelJS from 'exceljs';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
}

interface ExportOptions {
  tahunAkademik: string;
  prodi: string;
  tabelKode: string;
  tabelNama: string;
  status: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
}

export async function generateExcel(options: ExportOptions): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIM-LKPS';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(options.tabelKode, {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  // Header styling
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
  const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const headerBorder = {
    top: { style: 'thin', color: { argb: 'FF6366F1' } },
    left: { style: 'thin', color: { argb: 'FF6366F1' } },
    bottom: { style: 'thin', color: { argb: 'FF6366F1' } },
    right: { style: 'thin', color: { argb: 'FF6366F1' } }
  };

  // Info section (rows 1-6)
  sheet.mergeCells('A1:' + String.fromCharCode(64 + options.columns.length) + '1');
  sheet.getCell('A1').value = 'LAPORAN KINERJA PROGRAM STUDI (LKPS)';
  sheet.getCell('A1').font = { bold: true, size: 14 };
  sheet.getCell('A1').alignment = { horizontal: 'center' };

  sheet.getRow(2).getCell(1).value = `Perguruan Tinggi: Universitas Bina Bangsa Getsempena`;
  sheet.getRow(3).getCell(1).value = `Program Studi: ${options.prodi}`;
  sheet.getRow(4).getCell(1).value = `Tahun Akademik: ${options.tahunAkademik}`;
  sheet.getRow(5).getCell(1).value = `Tabel: ${options.tabelKode} - ${options.tabelNama}`;
  sheet.getRow(6).getCell(1).value = `Status: ${options.status}`;

  // Empty row
  sheet.getRow(7);

  // Column headers (row 8)
  const headerRow = sheet.addRow(options.columns.map(c => c.label));
  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.border = headerBorder;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Data rows
  options.rows.forEach((row, index) => {
    const dataRow = sheet.addRow(options.columns.map(c => {
      const value = row.rowData[c.key];
      return value ?? '';
    }));

    // Alternating row colors
    const rowFill = index % 2 === 0
      ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } }
      : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    dataRow.eachCell((cell) => {
      cell.fill = rowFill;
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });
  });

  // Set column widths
  options.columns.forEach((col, index) => {
    sheet.getColumn(index + 1).width = col.width;
  });

  // Footer
  const lastRow = sheet.rowCount + 2;
  sheet.getRow(lastRow).getCell(1).value = `Generated: ${new Date().toISOString()} | SIM-LKPS v0.1.0`;
  sheet.getRow(lastRow).getCell(1).font = { size: 9, color: { argb: 'FF94A3B8' } };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
```

---

## 6. Word Export Specification

### 6.1 Document Structure

```typescript
// lib/export/word.ts
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';

interface WordExportOptions {
  tahunAkademik: string;
  prodi: string;
  tabelKode: string;
  tabelNama: string;
  status: string;
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}

export async function generateWord(options: WordExportOptions): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: 'LAPORAN KINERJA PROGRAM STUDI',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),

        // Info section
        new Paragraph({ text: `Perguruan Tinggi: Universitas Bina Bangsa Getsempena` }),
        new Paragraph({ text: `Program Studi: ${options.prodi}` }),
        new Paragraph({ text: `Tahun Akademik: ${options.tahunAkademik}` }),
        new Paragraph({ text: `Tabel: ${options.tabelKode} - ${options.tabelNama}` }),
        new Paragraph({ text: `Status: ${options.status}` }),
        new Paragraph({ text: '' }),

        // Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Header row
            new TableRow({
              tableHeader: true,
              children: options.columns.map(col =>
                new TableCell({
                  children: [new Paragraph({ text: col.label, bold: true })],
                  shading: { fill: '6366F1', type: ShadingType.CLEAR },
                })
              ),
            }),
            // Data rows
            ...options.rows.map(row =>
              new TableRow({
                children: options.columns.map(col =>
                  new TableCell({
                    children: [new Paragraph({ text: String(row.rowData[col.key] ?? '') })],
                  })
                ),
              })
            ),
          ],
        }),

        // Footer
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `Generated: ${new Date().toISOString()} | SIM-LKPS v0.1.0`,
          style: 'Caption',
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}
```

---

## 7. PDF Export Specification

### 7.1 Approach

**Option A: Puppeteer (Recommended)**
- Generate HTML template
- Render with Puppeteer
- Export as PDF

**Option B: React to PDF (simpler)**
- Create printable React component
- Use `@react-pdf/renderer` or `puppeteer`

### 7.2 Puppeteer Implementation

```typescript
// lib/export/pdf.ts
import puppeteer from 'puppeteer';

interface PDFExportOptions {
  tahunAkademik: string;
  prodi: string;
  tabelKode: string;
  tabelNama: string;
  status: string;
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}

export async function generatePDF(options: PDFExportOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Generate HTML template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; padding: 20mm; font-size: 11px; color: #1e293b; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 20px; color: #0f172a; }
        .info { margin-bottom: 16px; }
        .info p { margin: 4px 0; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #6366F1; color: white; padding: 10px 12px; text-align: left; font-weight: 600; }
        td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 24px; font-size: 9px; color: #94a3b8; text-align: right; }
        @page { margin: 15mm; size: A4; }
      </style>
    </head>
    <body>
      <h1>LAPORAN KINERJA PROGRAM STUDI (LKPS)</h1>
      <div class="info">
        <p><strong>Perguruan Tinggi:</strong> Universitas Bina Bangsa Getsempena</p>
        <p><strong>Program Studi:</strong> ${options.prodi}</p>
        <p><strong>Tahun Akademik:</strong> ${options.tahunAkademik}</p>
        <p><strong>Tabel:</strong> ${options.tabelKode} - ${options.tabelNama}</p>
        <p><strong>Status:</strong> ${options.status}</p>
      </div>
      <table>
        <thead>
          <tr>${options.columns.map(col => `<th>${col.label}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${options.rows.map(row => `
            <tr>${options.columns.map(col => `<td>${row.rowData[col.key] ?? ''}</td>`).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        Generated: ${new Date().toISOString()} | SIM-LKPS v0.1.0
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
  });

  await browser.close();
  return Buffer.from(pdf);
}
```

---

## 8. API Routes

### 8.1 Route Structure

```
/app/api/export/
├── route.ts                    # Main export handler
└── [...params]/route.ts      # Dynamic export

/app/(dashboard)/laporan/
├── page.tsx                   # Reports list page
└── export/
    └── [bab]/page.tsx        # Export options page
```

### 8.2 API Handler

```typescript
// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { hasPermission } from '@/lib/utils/permissions';
import { getBabDataForExport } from '@/lib/export/helpers';
import { generateExcel } from '@/lib/export/excel';
import { generateWord } from '@/lib/export/word';
import { generatePDF } from '@/lib/export/pdf';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bab = parseInt(searchParams.get('bab') || '0');
  const format = searchParams.get('format') || 'excel'; // excel, word, pdf
  const tahunAkademikId = searchParams.get('ta');

  if (!bab) {
    return NextResponse.json({ error: 'BAB parameter required' }, { status: 400 });
  }

  // Get active tahun akademik if not specified
  let taId = tahunAkademikId;
  if (!taId) {
    const activeTa = await db.tahunAkademik.findFirst({ where: { isActive: true } });
    taId = activeTa?.id;
  }

  if (!taId) {
    return NextResponse.json({ error: 'Tahun akademik not found' }, { status: 400 });
  }

  // Get data
  const tables = await getBabDataForExport(bab, taId);

  // Generate file based on format
  let buffer: Buffer;
  let filename: string;
  let contentType: string;

  const ta = tables[0]?.lkps?.tahunAkademik;
  const tahunStr = ta ? `${ta.tahun.replace('/', '-')}_${ta.semester}` : 'unknown';

  if (format === 'excel') {
    buffer = await generateExcelWorkbook(tables, ta?.tahunAkademik);
    filename = `SIM-LKPS_BAB-${bab}_${tahunStr}.xlsx`;
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (format === 'word') {
    buffer = await generateWordDocument(tables);
    filename = `SIM-LKPS_BAB-${bab}_${tahunStr}.docx`;
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else {
    buffer = await generatePDFDocument(tables);
    filename = `SIM-LKPS_BAB-${bab}_${tahunStr}.pdf`;
    contentType = 'application/pdf';
  }

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
```

---

## 9. UI Components

### 9.1 Reports Page

```tsx
// app/(dashboard)/laporan/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileSpreadsheet, FileText, File, Download } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const babList = [
    { num: 1, title: "BAB 1 - Tata Pamong", tableCount: 6 },
    { num: 2, title: "BAB 2 - Pendidikan", tableCount: 11 },
    { num: 3, title: "BAB 3 - Penelitian", tableCount: 6 },
    { num: 4, title: "BAB 4 - Pengabdian", tableCount: 5 },
    { num: 5, title: "BAB 5 - Tata Kelola", tableCount: 2 },
    { num: 6, title: "BAB 6 - Visi Misi", tableCount: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Laporan & Export</h1>
        <p className="mt-1 text-white/80">
          Unduh data LKPS dalam format Excel, Word, atau PDF
        </p>
      </div>

      <div className="grid gap-4">
        {babList.map((bab) => (
          <ExportCard key={bab.num} bab={bab} />
        ))}

        <ExportCard bab={{ num: 'all', title: 'Semua BAB (Full Report)', tableCount: 31 }} />
      </div>
    </div>
  );
}

function ExportCard({ bab }: { bab: { num: number | 'all'; title: string; tableCount: number } }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{bab.title}</h3>
          <p className="text-sm text-slate-500">{bab.tableCount} tabel</p>
        </div>
        <div className="flex gap-2">
          <ExportButton bab={bab.num} format="excel" />
          <ExportButton bab={bab.num} format="word" />
          <ExportButton bab={bab.num} format="pdf" />
        </div>
      </div>
    </div>
  );
}

function ExportButton({ bab, format }: { bab: number | 'all'; format: 'excel' | 'word' | 'pdf' }) {
  const icons = {
    excel: FileSpreadsheet,
    word: FileText,
    pdf: File,
  };
  const colors = {
    excel: 'bg-emerald-500 hover:bg-emerald-600',
    word: 'bg-blue-500 hover:bg-blue-600',
    pdf: 'bg-red-500 hover:bg-red-600',
  };
  const Icon = icons[format];

  return (
    <a
      href={`/api/export?bab=${bab}&format=${format}`}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${colors[format]}`}
    >
      <Icon className="h-4 w-4" />
      {format.toUpperCase()}
    </a>
  );
}
```

### 9.2 Export Button Component

```tsx
// components/export/export-button.tsx
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
  bab?: number | 'all';
  tabelKode?: string;
  format: 'excel' | 'word' | 'pdf';
  label?: string;
}

export function ExportButton({ bab, tabelKode, format, label }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ format });
      if (bab) params.set('bab', String(bab));
      if (tabelKode) params.set('tabel', tabelKode);

      const response = await fetch(`/api/export?${params}`);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || `export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {label || `Export ${format.toUpperCase()}`}
    </button>
  );
}
```

---

## 10. File Structure

```
lib/export/
├── helpers.ts       # Shared data fetching functions
├── excel.ts         # ExcelJS export logic
├── word.ts         # docx export logic
└── pdf.ts          # Puppeteer PDF export logic

app/api/export/
└── route.ts        # API endpoint

app/(dashboard)/laporan/
└── page.tsx        # Reports page with export options

components/export/
├── export-button.tsx
└── export-modal.tsx
```

---

## 11. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Authorization | Check `hasPermission(role, "report.export")` before export |
| SQL Injection | Use Prisma parameterized queries (safe) |
| Path Traversal | Validate bab parameter (integer 1-6) |
| Large Files | Add timeout, limit rows per export |
| Sensitive Data | Only export user's accessible tables |

---

## 12. Error Handling

| Scenario | Response |
|---------|----------|
| Unauthorized | 401 + "Login required" |
| BAB not found | 400 + "Invalid BAB parameter" |
| No data | 404 + "No data for export" |
| Export failed | 500 + error message |
| Invalid format | 400 + "Invalid format parameter" |

---

## 13. Performance Considerations

| Optimization | Implementation |
|-------------|----------------|
| Streaming | Stream large Excel/PDF directly to response |
| Caching | Cache export data for 5 minutes |
| Pagination | Export in chunks for >1000 rows |
| Compression | Gzip response for large files |

---

## 14. Testing Plan

### 14.1 Unit Tests

```typescript
// tests/export/excel.test.ts
describe('Excel Export', () => {
  it('generates valid Excel file', async () => {
    const buffer = await generateExcel({
      tahunAkademik: '2025/2026',
      prodi: 'Ilmu Komputer',
      tabelKode: '1.A.1',
      tabelNama: 'Pimpinan UPPS',
      status: 'DISETUJUI',
      columns: [{ key: 'no', label: 'No', width: 5 }],
      rows: [{ rowData: { no: 1 } }],
    });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('handles empty rows', async () => {
    const buffer = await generateExcel({...});
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
```

### 14.2 E2E Tests

```typescript
// tests/export.spec.ts
test('export excel from laporan page', async ({ page }) => {
  await login(page);
  await page.goto('/laporan');
  
  // Click Excel export button for BAB 1
  const exportBtn = page.locator('a[href*="bab=1"][href*="format=excel"]');
  await expect(exportBtn).toBeVisible();
  
  // File should download
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('SIM-LKPS');
  expect(download.suggestedFilename()).toContain('.xlsx');
});
```

---

## 15. Execution Checklist

- [ ] Create `lib/export/` folder structure
- [ ] Implement `lib/export/helpers.ts`
- [ ] Implement `lib/export/excel.ts`
- [ ] Implement `lib/export/word.ts`
- [ ] Implement `lib/export/pdf.ts`
- [ ] Create `app/api/export/route.ts`
- [ ] Update `app/(dashboard)/laporan/page.tsx`
- [ ] Create `components/export/export-button.tsx`
- [ ] Add export buttons to LKPS table pages
- [ ] Add permission checks
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Update documentation

---

## 16. Timeline

| Task | Estimate | Dependency |
|------|----------|------------|
| Excel export | 2 hours | — |
| Word export | 1 hour | After Excel |
| PDF export | 2 hours | After Word |
| UI integration | 1 hour | All exports |
| Testing | 1 hour | All features |
| **Total** | **7 hours** | — |

---

*Dokumen ini dibuat untuk Export Feature - SIM-LKPS*
