"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/utils/audit";

export async function createMatakuliah(data: {
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  kategori?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mataKuliah.findUnique({ where: { kode: data.kode } });
  if (existing) throw new Error("Kode mata kuliah sudah terdaftar");

  const matakuliah = await db.mataKuliah.create({ data });

  await createAuditLog({
    action: "CREATE",
    entity: "MataKuliah",
    entityId: matakuliah.id,
    newValue: { kode: matakuliah.kode, nama: matakuliah.nama, sks: matakuliah.sks },
  });

  return { id: matakuliah.id, kode: matakuliah.kode, nama: matakuliah.nama };
}

export async function updateMatakuliah(id: string, data: {
  nama?: string;
  sks?: number;
  semester?: number;
  kategori?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mataKuliah.findUnique({ where: { id } });
  if (!existing) throw new Error("Mata kuliah tidak ditemukan");

  const updated = await db.mataKuliah.update({ where: { id }, data });

  await createAuditLog({
    action: "UPDATE",
    entity: "MataKuliah",
    entityId: id,
    oldValue: { nama: existing.nama, sks: existing.sks },
    newValue: { nama: updated.nama, sks: updated.sks },
  });

  return { id: updated.id, kode: updated.kode, nama: updated.nama };
}

export async function deleteMatakuliah(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mataKuliah.findUnique({ where: { id } });
  if (!existing) throw new Error("Mata kuliah tidak ditemukan");

  await db.mataKuliah.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "MataKuliah",
    entityId: id,
    oldValue: { kode: existing.kode, nama: existing.nama, sks: existing.sks },
  });

  return { success: true };
}
