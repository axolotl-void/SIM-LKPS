import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get active academic year
    const tahunAktif = await db.tahunAkademik.findFirst({
      where: { isActive: true },
      include: { prodi: true },
    });

    // Get all table definitions grouped by BAB
    const definitions = await db.tabelDefinition.findMany({
      orderBy: [{ bab: "asc" }, { urutan: "asc" }],
    });

    // Group by BAB
    const groupedByBab: Record<number, typeof definitions> = {};
    for (const def of definitions) {
      if (!groupedByBab[def.bab]) {
        groupedByBab[def.bab] = [];
      }
      groupedByBab[def.bab].push(def);
    }

    // Get filled data for each table
    const filledData: Record<string, number> = {};
    const totalRows: Record<string, number> = {};
    
    if (tahunAktif) {
      const tabelLkps = await db.tabelLkps.findMany({
        where: { tahunAkademikId: tahunAktif.id },
        include: { 
          rows: true,
          tabelDefinition: true,
        },
      });

      for (const item of tabelLkps) {
        if (item.tabelDefinition) {
          const kode = item.tabelDefinition.kode;
          filledData[kode] = item.rows.length;
          totalRows[kode] = item.rows.length;
        }
      }
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIM-LKPS";
    workbook.created = new Date();

    // ==================== SHEET 1: RINGKASAN ====================
    const summarySheet = workbook.addWorksheet("1. Ringkasan");
    
    // Title
    summarySheet.mergeCells("A1:F1");
    summarySheet.getCell("A1").value = "LAPORAN KINERJA PROGRAM STUDI (LKPS)";
    summarySheet.getCell("A1").font = { bold: true, size: 16 };
    summarySheet.getCell("A1").alignment = { horizontal: "center" };

    summarySheet.mergeCells("A2:F2");
    summarySheet.getCell("A2").value = tahunAktif 
      ? `Tahun Ajaran: ${tahunAktif.tahun} - Semester ${tahunAktif.semester} | Prodi: ${tahunAktif.prodi.nama}`
      : "Tahun Ajaran: -";
    summarySheet.getCell("A2").font = { size: 11 };
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    // Summary table header
    const headers = [
      { header: "BAB", key: "bab", width: 10 },
      { header: "Nama BAB", key: "nama", width: 25 },
      { header: "Total Tabel", key: "total", width: 12 },
      { header: "Terisi", key: "terisi", width: 10 },
      { header: "Kosong", key: "kosong", width: 10 },
      { header: "Progress", key: "progress", width: 12 },
    ];

    let rowNum = 4;
    let grandTotal = 0;
    let grandFilled = 0;

    const babNames: Record<number, string> = {
      1: "Tata Pamong",
      2: "Pendidikan",
      3: "Penelitian",
      4: "Pengabdian",
      5: "Tata Kelola",
      6: "Visi dan Misi",
    };

    // Header row
    summarySheet.addRow(["BAB", "Nama BAB", "Total Tabel", "Terisi", "Kosong", "Progress"]);
    for (let i = 0; i < 6; i++) {
      const cell = summarySheet.getCell(rowNum, i + 1);
      cell.font = { bold: true, color: "FFFFFF" };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
      cell.alignment = { horizontal: "center" };
    }
    rowNum++;

    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      const total = defs.length;
      let filled = 0;
      
      for (const def of defs) {
        filled += totalRows[def.kode] || 0;
      }
      
      const empty = total - filled;
      const progress = total > 0 ? Math.round((filled / total) * 100) : 0;
      
      grandTotal += total;
      grandFilled += filled;

      const row = summarySheet.addRow([
        `BAB ${babNum}`,
        babNames[Number(babNum)] || "",
        total,
        filled,
        empty,
        `${progress}%`,
      ]);

      // Color progress based on status
      const progressCell = row.getCell(6);
      if (progress === 100) {
        progressCell.font = { color: "FF10B981", bold: true };
      } else if (progress >= 70) {
        progressCell.font = { color: "FFF59E0B", bold: true };
      } else {
        progressCell.font = { color: "FFEF4444" };
      }
    }

    // Grand total row
    const grandProgress = grandTotal > 0 ? Math.round((grandFilled / grandTotal) * 100) : 0;
    const totalRow = summarySheet.addRow([
      "",
      "TOTAL KESELURUHAN",
      grandTotal,
      grandFilled,
      grandTotal - grandFilled,
      `${grandProgress}%`,
    ]);
    totalRow.font = { bold: true };
    totalRow.getCell(6).font = { bold: true, color: "FF6366F1", size: 12 };

    // Column widths for summary
    summarySheet.columns = [
      { width: 12 },
      { width: 30 },
      { width: 14 },
      { width: 10 },
      { width: 10 },
      { width: 12 },
    ];

    // ==================== SHEET 2-7: DETAIL PER BAB ====================
    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      const babSheet = workbook.addWorksheet(`${babNum}. BAB ${babNum}`);
      
      // BAB Header
      babSheet.mergeCells("A1:D1");
      babSheet.getCell("A1").value = `BAB ${babNum} - ${babNames[Number(babNum)] || ""}`;
      babSheet.getCell("A1").font = { bold: true, size: 14 };
      babSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
      babSheet.getCell("A1").font = { bold: true, size: 14, color: "FFFFFF" };
      babSheet.getCell("A1").alignment = { horizontal: "center" };

      // Column headers
      const dataHeaders = [
        { header: "No", key: "no", width: 6 },
        { header: "Kode Tabel", key: "kode", width: 12 },
        { header: "Nama Tabel", key: "nama", width: 35 },
        { header: "Jumlah Data", key: "jumlah", width: 15 },
      ];
      babSheet.addRow(["No", "Kode Tabel", "Nama Tabel", "Jumlah Data"]);
      const headerRowNum = 2;
      for (let i = 0; i < 4; i++) {
        const cell = babSheet.getCell(headerRowNum, i + 1);
        cell.font = { bold: true, color: "FFFFFF" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8B5CF6" } };
      }

      let rowNumBab = 3;
      let babTotal = 0;
      
      for (let i = 0; i < defs.length; i++) {
        const def = defs[i];
        const jumlah = totalRows[def.kode] || 0;
        babTotal += jumlah;

        babSheet.addRow([i + 1, def.kode, def.nama, jumlah]);
        
        // Color code
        const jumlahCell = babSheet.getCell(rowNumBab, 4);
        if (jumlah > 0) {
          jumlahCell.font = { color: "FF10B981", bold: true };
        } else {
          jumlahCell.font = { color: "FFEF4444" };
        }
        rowNumBab++;
      }

      // BAB Total
      const babTotalRow = babSheet.addRow(["", "", "TOTAL", babTotal]);
      babSheet.mergeCells(`A${rowNumBab}:C${rowNumBab}`);
      babTotalRow.font = { bold: true };
      babTotalRow.getCell(4).font = { bold: true, color: "FF6366F1", size: 12 };

      babSheet.columns = [
        { width: 6 },
        { width: 12 },
        { width: 35 },
        { width: 15 },
      ];
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="LKPS_Laporan_${dateStr}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export Excel error:", error);
    return NextResponse.json(
      { error: "Gagal export Excel: " + (error as Error).message },
      { status: 500 }
    );
  }
}
