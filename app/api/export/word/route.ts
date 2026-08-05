import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
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

type DocChild = Paragraph | Table;

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permission
    const role = session.user.role as Role;
    if (!hasPermission(role, "report.export")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk export laporan" },
        { status: 403 }
      );
    }

    // Get active tahun akademik
    const tahunAktif = await db.tahunAkademik.findFirst({
      where: { isActive: true },
      include: { prodi: true },
    });

    if (!tahunAktif) {
      return NextResponse.json(
        { error: "Tahun akademik tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get all table definitions
    const definitions = await db.tabelDefinition.findMany({
      orderBy: [{ bab: "asc" }, { urutan: "asc" }],
    });

    // Get filled data for each table
    const tabelLkps = await db.tabelLkps.findMany({
      where: { tahunAkademikId: tahunAktif.id },
      include: {
        rows: { orderBy: { rowOrder: "asc" } },
        tabelDefinition: true,
      },
    });

    // Build lookup map
    const dataMap: Record<string, typeof tabelLkps[0] | undefined> = {};
    for (const item of tabelLkps) {
      if (item.tabelDefinition) {
        dataMap[item.tabelDefinition.kode] = item;
      }
    }

    // Group by BAB
    const groupedByBab: Record<number, typeof definitions> = {};
    for (const def of definitions) {
      if (!groupedByBab[def.bab]) {
        groupedByBab[def.bab] = [];
      }
      groupedByBab[def.bab]!.push(def);
    }

    const babNames: Record<number, string> = {
      1: "Tata Pamong",
      2: "Pendidikan",
      3: "Penelitian",
      4: "Pengabdian",
      5: "Tata Kelola",
      6: "Visi dan Misi",
    };

    // Build document content
    const children: DocChild[] = [];

    // Title
    children.push(
      new Paragraph({
        text: "LAPORAN KINERJA PROGRAM STUDI (LKPS)",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Info
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Perguruan Tinggi: ", bold: true }),
          new TextRun("Universitas Bina Bangsa Getsempena"),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Program Studi: ", bold: true }),
          new TextRun(`${tahunAktif.prodi.nama} (${tahunAktif.prodi.jenjang})`),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Tahun Akademik: ", bold: true }),
          new TextRun(`${tahunAktif.tahun} / ${tahunAktif.semester}`),
        ],
        spacing: { after: 400 },
      })
    );

    // Summary table
    children.push(
      new Paragraph({
        text: "RINGKASAN PENGISIAN TABEL",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    const headerCellStyle = {
      shading: { fill: "6366F1", type: ShadingType.CLEAR },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "6366F1" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "6366F1" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "6366F1" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "6366F1" },
      },
    };

    const summaryRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            children: [new Paragraph({ text: "BAB", alignment: AlignmentType.CENTER })],
            ...headerCellStyle,
          }),
          new TableCell({
            children: [new Paragraph({ text: "Nama BAB" })],
            ...headerCellStyle,
          }),
          new TableCell({
            children: [new Paragraph({ text: "Total Tabel", alignment: AlignmentType.CENTER })],
            ...headerCellStyle,
          }),
          new TableCell({
            children: [new Paragraph({ text: "Terisi", alignment: AlignmentType.CENTER })],
            ...headerCellStyle,
          }),
          new TableCell({
            children: [new Paragraph({ text: "Jumlah Data", alignment: AlignmentType.CENTER })],
            ...headerCellStyle,
          }),
        ],
      }),
    ];

    let grandTotal = 0;
    let grandFilled = 0;
    let grandData = 0;

    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      let total = defs.length;
      let filled = 0;
      let dataCount = 0;

      for (const def of defs) {
        const data = dataMap[def.kode];
        if (data && data.rows.length > 0) {
          filled++;
          dataCount += data.rows.length;
        }
      }

      grandTotal += total;
      grandFilled += filled;
      grandData += dataCount;

      summaryRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: `BAB ${babNum}` })] }),
            new TableCell({ children: [new Paragraph({ text: babNames[Number(babNum)] || "" })] }),
            new TableCell({ children: [new Paragraph({ text: String(total), alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ text: String(filled), alignment: AlignmentType.CENTER })] }),
            new TableCell({ children: [new Paragraph({ text: String(dataCount), alignment: AlignmentType.CENTER })] }),
          ],
        })
      );
    }

    // Grand total row
    summaryRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TOTAL", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(grandTotal), bold: true })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(grandFilled), bold: true })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(grandData), bold: true })], alignment: AlignmentType.CENTER })] }),
        ],
      })
    );

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: summaryRows,
      })
    );

    // Detail per BAB
    children.push(new Paragraph({ text: "", spacing: { after: 300 } }));

    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      children.push(
        new Paragraph({
          text: `BAB ${babNum} — ${babNames[Number(babNum)] || ""}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      for (const def of defs) {
        const data = dataMap[def.kode];
        const hasData = data && data.rows.length > 0;
        const statusText = hasData ? `${data!.rows.length} data` : "Belum ada data";
        const statusColor = hasData ? "059669" : "EF4444";

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${def.kode} — ${def.nama}`, bold: true }),
              new TextRun({ text: ` (${statusText})`, color: statusColor }),
            ],
            spacing: { before: 100, after: 50 },
          })
        );
      }
    }

    // Footer
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${new Date().toLocaleString("id-ID")} | SIM-LKPS v0.1.0`,
            italics: true,
            color: "94A3B8",
            size: 18,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 500 },
      })
    );

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="SIM-LKPS_Laporan_${dateStr}.docx"`,
      },
    });
  } catch (error) {
    console.error("Export Word error:", error);
    return NextResponse.json(
      { error: "Gagal export dokumen: " + (error as Error).message },
      { status: 500 }
    );
  }
}
