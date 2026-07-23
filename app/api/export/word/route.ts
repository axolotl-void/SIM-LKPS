import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
} from "docx";

export async function GET() {
  try {
    const laporanData = [
      { bab: "BAB 1", title: "Tata Pamong", filled: 4, total: 4 },
      { bab: "BAB 2", title: "Pendidikan", filled: 5, total: 6 },
      { bab: "BAB 3", title: "Penelitian", filled: 3, total: 5 },
      { bab: "BAB 4", title: "Pengabdian", filled: 3, total: 4 },
      { bab: "BAB 5 & 6", title: "Tata Kelola & Visi Misi", filled: 7, total: 12 },
    ];

    const totalTables = laporanData.reduce((sum, item) => sum + item.total, 0);
    const totalFilled = laporanData.reduce((sum, item) => sum + item.filled, 0);
    const totalProgress = Math.round((totalFilled / totalTables) * 100);

    const children: Paragraph[] = [];

    // Title
    const titlePara = new Paragraph({
      text: "LAPORAN KINERJA PROGRAM STUDI (LKPS)",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    });
    children.push(titlePara);

    const subtitlePara = new Paragraph({
      text: "SIM-LKPS - Universitas Bina Bangsa Getsempena",
      alignment: AlignmentType.CENTER,
    });
    children.push(subtitlePara);

    const summaryPara = new Paragraph({
      children: [
        new TextRun({ text: "RINGKASAN: ", bold: true }),
        new TextRun({ text: `${totalFilled} dari ${totalTables} tabel terisi (${totalProgress}%)` }),
      ],
    });
    children.push(summaryPara);

    // BAB sections
    for (const section of laporanData) {
      const progress = Math.round((section.filled / section.total) * 100);

      const headingPara = new Paragraph({
        text: `${section.bab} - ${section.title}`,
        heading: HeadingLevel.HEADING_1,
      });
      children.push(headingPara);

      // Table header row
      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "No" })] }),
          new TableCell({ children: [new Paragraph({ text: "Nama BAB" })] }),
          new TableCell({ children: [new Paragraph({ text: "Jumlah" })] }),
          new TableCell({ children: [new Paragraph({ text: "Progress" })] }),
        ],
      });

      // Data row
      const dataRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: section.bab.replace("BAB ", "") })] }),
          new TableCell({ children: [new Paragraph({ text: section.title })] }),
          new TableCell({ children: [new Paragraph({ text: `${section.filled}/${section.total}` })] }),
          new TableCell({ children: [new Paragraph({ text: `${progress}%` })] }),
        ],
      });

      const table = new Table({
        rows: [headerRow, dataRow],
      });
      children.push(table);
      children.push(new Paragraph({ text: "" }));
    }

    // Total Summary
    children.push(new Paragraph({
      text: "RINGKASAN TOTAL",
      heading: HeadingLevel.HEADING_1,
    }));

    const summaryTable = new Table({
      rows: [
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ text: "Total Tabel" })] }),
          new TableCell({ children: [new Paragraph({ text: String(totalTables) })] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ text: "Terisi" })] }),
          new TableCell({ children: [new Paragraph({ text: String(totalFilled) })] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ text: "Progress" })] }),
          new TableCell({ children: [new Paragraph({ text: `${totalProgress}%` })] }),
        ]}),
      ],
    });
    children.push(summaryTable);

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    const buffer = await Packer.toBuffer(doc);
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="LKPS_Report_${dateStr}.docx"`,
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
