/**
 * Word Export Module
 * Generates Word (.docx) files using docx library
 * Single document with all tables grouped by BAB with color coding
 */

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  TextRun,
} from "docx";
import type { TableData, ColumnDef } from "./helpers";
import { STATUS_LABELS } from "./helpers";

interface WordExportOptions {
  tables: TableData[];
}

// Hex without # - Word shading format
const BAB_COLORS: Record<number, { header: string; subHeader: string; accent: string }> = {
  1: { header: "2A78D6", subHeader: "DBEAFE", accent: "1C5CAB" }, // blue
  2: { header: "1BAF7A", subHeader: "D1FAE5", accent: "199E70" }, // aqua
  3: { header: "EB6834", subHeader: "FED7AA", accent: "D95926" }, // orange
  4: { header: "E34948", subHeader: "FECACA", accent: "D03B3B" }, // red
  5: { header: "4A3AA7", subHeader: "DDD6FE", accent: "9085E9" }, // violet
  6: { header: "EDA100", subHeader: "FEF3C7", accent: "C98500" }, // yellow
};

const FALLBACK_COLOR = { header: "0F172A", subHeader: "F1F5F9", accent: "52514E" };

type DocChild = Paragraph | Table;

/**
 * Generate Word document from table data
 */
export async function generateWordDocument(
  options: WordExportOptions
): Promise<Buffer> {
  const { tables } = options;

  // Group tables by BAB
  const tablesByBab = new Map<number, TableData[]>();
  for (const table of tables) {
    const bab = table.definition.bab;
    if (!tablesByBab.has(bab)) tablesByBab.set(bab, []);
    tablesByBab.get(bab)!.push(table);
  }
  const sortedBabs = Array.from(tablesByBab.keys()).sort((a, b) => a - b);

  const children: DocChild[] = [];

  // ==== DOCUMENT TITLE ====
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "LAPORAN KINERJA PROGRAM STUDI",
          bold: true,
          size: 36,
          color: "FFFFFF",
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: { fill: "0F172A", type: ShadingType.CLEAR },
      spacing: { before: 100, after: 100 },
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "(LKPS)",
          bold: true,
          size: 28,
          color: "0F172A",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Info block
  const firstTa = tables[0]?.lkps?.tahunAkademik;
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "0F172A" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "0F172A" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              children: [new TextRun({ text: "Perguruan Tinggi", bold: true, size: 20 })],
            })],
            shading: { fill: "F9F9F7", type: ShadingType.CLEAR },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Universitas Bina Bangsa Getsempena", size: 20 })],
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Program Studi", bold: true, size: 20 })],
            })],
            shading: { fill: "F9F9F7", type: ShadingType.CLEAR },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({
                text: `${firstTa?.prodi.nama || "-"} (${firstTa?.prodi.jenjang || "-"})`,
                size: 20,
              })],
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Tahun Akademik", bold: true, size: 20 })],
            })],
            shading: { fill: "F9F9F7", type: ShadingType.CLEAR },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({
                text: `${firstTa?.tahun || "-"} ${firstTa?.semester || ""}`,
                size: 20,
              })],
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Tanggal Cetak", bold: true, size: 20 })],
            })],
            shading: { fill: "F9F9F7", type: ShadingType.CLEAR },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({
                text: new Date().toLocaleString("id-ID"),
                size: 20,
              })],
            })],
          }),
        ],
      }),
    ],
  });
  children.push(infoTable);
  children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

  // ==== EACH BAB ====
  for (const bab of sortedBabs) {
    const babTables = tablesByBab.get(bab)!;
    const colors = BAB_COLORS[bab] || FALLBACK_COLOR;

    // BAB section header - prominent band
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `BAB ${bab}`,
            bold: true,
            size: 28,
            color: "FFFFFF",
          }),
        ],
        alignment: AlignmentType.LEFT,
        shading: { fill: colors.header, type: ShadingType.CLEAR },
        spacing: { before: 300, after: 0 },
      })
    );

    // Each table
    for (const table of babTables) {
      const { definition, lkps } = table;
      const dataColumns: ColumnDef[] = (definition.kolomDefinitions || []).filter(
        (c) => c.type !== "header"
      );

      // Table title sub-header
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${definition.kode} — ${definition.nama}`,
              bold: true,
              size: 22,
              color: colors.accent,
            }),
            new TextRun({
              text: `   (${lkps ? `${lkps.rows.length} data` : "Belum ada data"})`,
              size: 18,
              color: "898781",
              italics: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 80 },
        })
      );

      // Status indicator
      if (lkps) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Status: ", bold: true, size: 18, color: "52514E" }),
              new TextRun({ text: STATUS_LABELS[lkps.status], size: 18, color: colors.accent }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 },
          })
        );
      }

      // Build table
      const tableRows: TableRow[] = [];

      // Header row
      tableRows.push(
        new TableRow({
          tableHeader: true,
          children: dataColumns.map((col) =>
            new TableCell({
              children: [
                new Paragraph({
                  text: col.label,
                  alignment: AlignmentType.CENTER,
                }),
              ],
              shading: {
                fill: colors.header,
                type: ShadingType.CLEAR,
              },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: colors.header },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: colors.header },
                left: { style: BorderStyle.SINGLE, size: 2, color: colors.header },
                right: { style: BorderStyle.SINGLE, size: 2, color: colors.header },
              },
            })
          ),
        })
      );

      // Data rows
      const rows = lkps?.rows || [];
      if (rows.length === 0) {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: dataColumns.length || 1,
                children: [new Paragraph({
                  children: [new TextRun({ text: "(Belum ada data)", italics: true, color: "898781" })],
                  alignment: AlignmentType.CENTER,
                })],
                shading: { fill: "F9F9F7", type: ShadingType.CLEAR },
              }),
            ],
          })
        );
      } else {
        rows.forEach((row, index) => {
          const cells = dataColumns.map((col) => {
            const value = row.rowData[col.key];
            let cellText = "";
            if (value !== null && value !== undefined) {
              if (Array.isArray(value)) {
                cellText = value.join(", ");
              } else if (typeof value === "object") {
                cellText = JSON.stringify(value);
              } else {
                cellText = String(value);
              }
            }

            const isEven = index % 2 === 0;
            return new TableCell({
              children: [new Paragraph({
                text: cellText,
                alignment: col.type === "number" ? AlignmentType.RIGHT : AlignmentType.LEFT,
              })],
              shading: isEven
                ? { fill: colors.subHeader, type: ShadingType.CLEAR }
                : { fill: "FFFFFF", type: ShadingType.CLEAR },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "E1E0D9" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "E1E0D9" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "E1E0D9" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "E1E0D9" },
              },
            });
          });

          tableRows.push(new TableRow({ children: cells }));
        });
      }

      // Add table
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        })
      );

      // Spacing between tables
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    }

    // Page break between BABs (except last) - using Paragraph with pageBreakBefore
    if (bab !== sortedBabs[sortedBabs.length - 1]) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "", break: 0 })],
          pageBreakBefore: true,
        })
      );
    }
  }

  // ==== FOOTER ====
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date().toLocaleString("id-ID")} | SIM-LKPS v0.1.0`,
          italics: true,
          color: "898781",
          size: 16,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1200,
              bottom: 1000,
              left: 1200,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Generate Word document for a single table
 */
export async function generateSingleTableWord(
  table: TableData
): Promise<Buffer> {
  return generateWordDocument({ tables: [table] });
}