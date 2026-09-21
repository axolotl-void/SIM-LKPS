"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createAuditLog, logAccessDenied } from "@/lib/utils/audit";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { notifyMutation } from "@/lib/notifikasi-internal";

function revalidateAkademik() {
  revalidatePath("/dashboard");
  revalidatePath("/master/mata-kuliah");
}

export async function createMatakuliah(data: {
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  kategori?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, "master_data.create")) {
    logAccessDenied("CREATE", "MataKuliah", "missing_permission", { role });
    throw new Error("Anda tidak memiliki izin menambah mata kuliah.");
  }

  const existing = await db.mataKuliah.findUnique({ where: { kode: data.kode } });
  if (existing) throw new Error("Kode mata kuliah sudah terdaftar");

  const matakuliah = await db.mataKuliah.create({ data });

  await createAuditLog({
    action: "CREATE",
    entity: "MataKuliah",
    entityId: matakuliah.id,
    newValue: { kode: matakuliah.kode, nama: matakuliah.nama, sks: matakuliah.sks },
  });

  await notifyMutation({
    action: "CREATE",
    entity: "MataKuliah",
    entityLabel: `${matakuliah.kode} - ${matakuliah.nama}`,
    link: "/master/mata-kuliah",
  });

  revalidateAkademik();

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

  const role = session.user.role as Role;
  if (!hasPermission(role, "master_data.update")) {
    logAccessDenied("UPDATE", "MataKuliah", "missing_permission", { role });
    throw new Error("Anda tidak memiliki izin mengubah mata kuliah.");
  }

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

  await notifyMutation({
    action: "UPDATE",
    entity: "MataKuliah",
    entityLabel: `${updated.kode} - ${updated.nama}`,
    link: "/master/mata-kuliah",
  });

  revalidateAkademik();

  return { id: updated.id, kode: updated.kode, nama: updated.nama };
}

export async function deleteMatakuliah(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, "master_data.delete")) {
    logAccessDenied("DELETE", "MataKuliah", "missing_permission", { role });
    throw new Error("Anda tidak memiliki izin menghapus mata kuliah.");
  }

  const existing = await db.mataKuliah.findUnique({ where: { id } });
  if (!existing) throw new Error("Mata kuliah tidak ditemukan");

  await db.mataKuliah.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "MataKuliah",
    entityId: id,
    oldValue: { kode: existing.kode, nama: existing.nama, sks: existing.sks },
  });

  await notifyMutation({
    action: "DELETE",
    entity: "MataKuliah",
    entityLabel: `${existing.kode} - ${existing.nama}`,
    link: "/master/mata-kuliah",
  });

  revalidateAkademik();

  return { success: true };
}
