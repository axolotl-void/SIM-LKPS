/**
 * Export API Route
 * Handles Excel, Word, PDF export requests
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import {
  getTableDataForExport,
  getBabDataForExport,
  getAllTablesDataForExport,
  getActiveTahunAkademik,
} from "@/lib/export/helpers";
import { generateExcelWorkbook } from "@/lib/export/excel";
import { generateWordDocument } from "@/lib/export/word";
import { generatePDFDocument } from "@/lib/export/pdf";

export async function GET(request: NextRequest) {
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

  // Parse query params
  const { searchParams } = new URL(request.url);
  const bab = searchParams.get("bab");
  const tabelKode = searchParams.get("tabel");
  const format = searchParams.get("format") || "excel"; // excel, word, pdf
  const tahunAkademikId = searchParams.get("ta");

  // Validate format
  if (!["excel", "word", "pdf"].includes(format)) {
    return NextResponse.json(
      { error: "Format tidak valid. Gunakan: excel, word, atau pdf" },
      { status: 400 }
    );
  }

  // Get tahun akademik
  let taId = tahunAkademikId;
  if (!taId) {
    const activeTa = await getActiveTahunAkademik();
    taId = activeTa?.id ?? null;
  }

  if (!taId) {
    return NextResponse.json(
      { error: "Tahun akademik tidak ditemukan" },
      { status: 404 }
    );
  }

  const activeTa = await db.tahunAkademik.findUnique({
    where: { id: taId },
    include: { prodi: true },
  });

  if (!activeTa) {
    return NextResponse.json(
      { error: "Tahun akademik tidak valid" },
      { status: 404 }
    );
  }

  // Build filename
  const tahunStr = `${activeTa.tahun.replace("/", "-")}_${activeTa.semester}`;
  const prodiStr = activeTa.prodi.nama.replace(/\s+/g, "-");

  try {
    let buffer: Buffer;
    let filename: string;
    let contentType: string;

    if (tabelKode) {
      // Export single table
      const tableData = await getTableDataForExport(tabelKode, taId);
      if (!tableData) {
        return NextResponse.json(
          { error: `Tabel ${tabelKode} tidak ditemukan` },
          { status: 404 }
        );
      }

      const sanitizedKode = tabelKode.replace(/\./g, "-");
      filename = `SIM-LKPS_${prodiStr}_${sanitizedKode}_${tahunStr}`;

      if (format === "excel") {
        buffer = await generateExcelWorkbook({ tables: [tableData] });
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename += ".xlsx";
      } else if (format === "word") {
        buffer = await generateWordDocument({ tables: [tableData] });
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename += ".docx";
      } else {
        buffer = await generatePDFDocument({ tables: [tableData] });
        contentType = "application/pdf";
        filename += ".pdf";
      }
    } else if (bab && bab !== "all") {
      // Export by BAB
      const babNum = parseInt(bab, 10);
      if (isNaN(babNum) || babNum < 1 || babNum > 6) {
        return NextResponse.json(
          { error: "BAB harus angka 1-6" },
          { status: 400 }
        );
      }

      const tablesData = await getBabDataForExport(babNum, taId);
      filename = `SIM-LKPS_${prodiStr}_BAB-${babNum}_${tahunStr}`;

      if (format === "excel") {
        buffer = await generateExcelWorkbook({ tables: tablesData });
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename += ".xlsx";
      } else if (format === "word") {
        buffer = await generateWordDocument({ tables: tablesData });
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename += ".docx";
      } else {
        buffer = await generatePDFDocument({ tables: tablesData });
        contentType = "application/pdf";
        filename += ".pdf";
      }
    } else {
      // Export all tables
      const allTables = await getAllTablesDataForExport(taId);
      filename = `SIM-LKPS_${prodiStr}_FullReport_${tahunStr}`;

      if (format === "excel") {
        buffer = await generateExcelWorkbook({ tables: allTables });
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename += ".xlsx";
      } else if (format === "word") {
        buffer = await generateWordDocument({ tables: allTables });
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename += ".docx";
      } else {
        buffer = await generatePDFDocument({ tables: allTables });
        contentType = "application/pdf";
        filename += ".pdf";
      }
    }

    // Return file - convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Gagal generate file export" },
      { status: 500 }
    );
  }
}
