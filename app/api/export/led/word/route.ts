import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { buildLedDocx } from "@/lib/export/led-docx";
import { namaBerkasLed } from "@/lib/export/led-dokumen";
import { siapkanExportLed } from "@/lib/utils/led-export-query";
import { createAuditLog } from "@/lib/utils/audit";

export const runtime = "nodejs";
/** Dokumen panjang butuh waktu; Vercel Hobby default 10s. */
export const maxDuration = 60;

/**
 * GET /api/export/led/word?tahun=<id>
 *
 * Membuat `.docx` LED (A4, Arial 11, spasi 1,15). Tanpa parameter `tahun`,
 * memakai tahun akademik aktif.
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "report.export")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk export laporan" },
        { status: 403 },
      );
    }

    const tahunId = new URL(request.url).searchParams.get("tahun") ?? undefined;
    const ctx = await siapkanExportLed(tahunId);

    if (!ctx) {
      return NextResponse.json(
        { error: "Tahun akademik tidak ditemukan" },
        { status: 404 },
      );
    }

    const buffer = await buildLedDocx(ctx.bagianCetak, {
      perguruanTinggi: "Universitas Bina Bangsa Getsempena",
      prodi: ctx.prodi.nama,
      jenjang: ctx.prodi.jenjang,
      tahun: ctx.tahunAkademik.tahun,
      semester: ctx.tahunAkademik.semester,
    });

    const nama = namaBerkasLed(
      ctx.prodi.nama,
      ctx.tahunAkademik.tahun,
      ctx.tahunAkademik.semester,
      "docx",
    );

    await createAuditLog({
      action: "EXPORT_LED_WORD",
      entity: "LedBagian",
      entityId: ctx.tahunAkademik.id,
      newValue: {
        prodi: ctx.prodi.nama,
        tahun: ctx.tahunAkademik.tahun,
        semester: ctx.tahunAkademik.semester,
        format: "docx",
        bagian: ctx.bagianCetak.length,
      },
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${nama}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Export LED Word error:", error);
    return NextResponse.json(
      { error: "Gagal export dokumen: " + (error as Error).message },
      { status: 500 },
    );
  }
}
