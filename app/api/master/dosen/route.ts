import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { z } from "zod";

// Zod schema for input validation
const createDosenSchema = z.object({
  nidn: z.string().min(1, "NIDN wajib diisi").max(20, "NIDN maksimal 20 karakter").regex(/^\d+$/, "NIDN harus berupa angka"),
  nama: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  jabatanFungsional: z.string().max(100).optional(),
  pendidikanTerakhir: z.enum(["S1", "S2", "S3"], { message: "Pendidikan harus S1, S2, atau S3" }),
  bidangKeahlian: z.string().max(255).optional(),
  status: z.enum(["Tetap", "Tidak Tetap"]).optional(),
  jenisKelamin: z.enum(["L", "P"], { message: "Jenis kelamin harus L atau P" }),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "master.dosen.create")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk menambah data dosen" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const parsed = createDosenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validasi gagal" },
        { status: 400 }
      );
    }

    const { nidn, nama, jabatanFungsional, pendidikanTerakhir, bidangKeahlian, status, jenisKelamin } = parsed.data;

    // Check duplicate NIDN
    const existing = await db.dosen.findUnique({
      where: { nidn },
    });

    if (existing) {
      return NextResponse.json(
        { error: "NIDN sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create dosen
    const dosen = await db.dosen.create({
      data: {
        nidn,
        nama,
        jabatanFungsional: jabatanFungsional || null,
        pendidikanTerakhir,
        bidangKeahlian: bidangKeahlian || null,
        status: status || "Tetap",
        jenisKelamin,
        isActive: true,
      },
    });

    return NextResponse.json(dosen, { status: 201 });
  } catch (error) {
    console.error("Error creating dosen:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data dosen" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dosens = await db.dosen.findMany({
      orderBy: { nama: "asc" },
    });

    return NextResponse.json(dosens);
  } catch (error) {
    console.error("Error fetching dosens:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dosen" },
      { status: 500 }
    );
  }
}
