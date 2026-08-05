import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import ExcelJS from "exceljs";

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

    // Get active academic year
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
      groupedByBab[def.bab]!.push(def);
    }

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

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIM-LKPS";
    workbook.created = new Date();

    const babNames: Record<number, string> = {
      1: "Tata Pamong",
      2: "Pendidikan",
      3: "Penelitian",
      4: "Pengabdian",
      5: "Tata Kelola",
      6: "Visi dan Misi",
    };

    // ==================== SHEET 1: RINGKASAN ====================
    const summarySheet = workbook.addWorksheet("1. Ringkasan");

    // Title
    summarySheet.mergeCells("A1:F1");
    summarySheet.getCell("A1").value = "LAPORAN KINERJA PROGRAM STUDI (LKPS)";
    summarySheet.getCell("A1").font = { bold: true, size: 16 };
    summarySheet.getCell("A1").alignment = { horizontal: "center" };

    summarySheet.mergeCells("A2:F2");
    summarySheet.getCell("A2").value = `Tahun Ajaran: ${tahunAktif.tahun} - Semester ${tahunAktif.semester} | Prodi: ${tahunAktif.prodi.nama}`;
    summarySheet.getCell("A2").font = { size: 11 };
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    // Header row
    let rowNum = 4;
    let grandTotal = 0;
    let grandFilled = 0;
    let grandData = 0;

    summarySheet.addRow(["BAB", "Nama BAB", "Total Tabel", "Terisi", "Jumlah Data", "Progress"]);
    for (let i = 0; i < 6; i++) {
      const cell = summarySheet.getCell(rowNum, i + 1);
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
      cell.alignment = { horizontal: "center" };
    }
    rowNum++;

    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      const total = defs.length;
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

      const progress = total > 0 ? Math.round((dataCount / (total * 10)) * 100) : 0;

      const row = summarySheet.addRow([
        `BAB ${babNum}`,
        babNames[Number(babNum)] || "",
        total,
        filled,
        dataCount,
        `${Math.min(progress, 100)}%`,
      ]);

      // Color progress based on status
      const progressCell = row.getCell(6);
      if (dataCount > 0) {
        progressCell.font = { color: { argb: "FF10B981" }, bold: true };
      } else {
        progressCell.font = { color: { argb: "FFEF4444" } };
      }
    }

    // Grand total row
    summarySheet.addRow([
      "",
      "TOTAL KESELURUHAN",
      grandTotal,
      grandFilled,
      grandData,
      `${grandTotal > 0 ? Math.round((grandData / (grandTotal * 10)) * 100) : 0}%`,
    ]).font = { bold: true };

    summarySheet.columns = [
      { width: 12 },
      { width: 30 },
      { width: 14 },
      { width: 10 },
      { width: 14 },
      { width: 12 },
    ];

    // ==================== SHEET 2-7: DETAIL PER BAB ====================
    for (const [babNum, defs] of Object.entries(groupedByBab)) {
      const babSheet = workbook.addWorksheet(`${babNum}. BAB ${babNum}`);

      // BAB Header
      babSheet.mergeCells("A1:E1");
      babSheet.getCell("A1").value = `BAB ${babNum} - ${babNames[Number(babNum)] || ""}`;
      babSheet.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
      babSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
      babSheet.getCell("A1").alignment = { horizontal: "center" };

      // Column headers
      babSheet.addRow(["No", "Kode Tabel", "Nama Tabel", "Jumlah Data", "Status"]);
      const headerRowNum = 2;
      for (let i = 0; i < 5; i++) {
        const cell = babSheet.getCell(headerRowNum, i + 1);
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8B5CF6" } };
      }

      let rowNumBab = 3;
      let babDataCount = 0;

      for (let i = 0; i < defs.length; i++) {
        const def = defs[i];
        if (!def) continue;
        const data = dataMap[def.kode];
        const jumlah = data?.rows.length || 0;
        babDataCount += jumlah;
        const status = jumlah > 0 ? "Terisi" : "Kosong";

        babSheet.addRow([i + 1, def.kode, def.nama, jumlah, status]);

        // Color code
        const jumlahCell = babSheet.getCell(rowNumBab, 4);
        const statusCell = babSheet.getCell(rowNumBab, 5);
        if (jumlah > 0) {
          jumlahCell.font = { color: { argb: "FF10B981" }, bold: true };
          statusCell.font = { color: { argb: "FF10B981" } };
        } else {
          jumlahCell.font = { color: { argb: "FFEF4444" } };
          statusCell.font = { color: { argb: "FFEF4444" } };
        }
        rowNumBab++;
      }

      // BAB Total
      const babTotalRow = babSheet.addRow(["", "", "TOTAL", babDataCount, ""]);
      babSheet.mergeCells(`A${rowNumBab}:C${rowNumBab}`);
      babTotalRow.font = { bold: true };
      babTotalRow.getCell(4).font = { bold: true, color: { argb: "FF6366F1" }, size: 12 };

      babSheet.columns = [
        { width: 6 },
        { width: 12 },
        { width: 35 },
        { width: 15 },
        { width: 12 },
      ];
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="SIM-LKPS_Laporan_${dateStr}.xlsx"`,
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
