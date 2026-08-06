"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/utils/audit";
import { notifyMutation } from "@/lib/actions/notification";

function revalidateAkademik() {
  revalidatePath("/dashboard");
  revalidatePath("/master/mahasiswa");
}

export async function createMahasiswa(data: {
  nim: string;
  nama: string;
  angkatan: number;
  status: string;
  jenisKelamin: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mahasiswa.findUnique({ where: { nim: data.nim } });
  if (existing) throw new Error("NIM sudah terdaftar");

  const mahasiswa = await db.mahasiswa.create({ data });

  await createAuditLog({
    action: "CREATE",
    entity: "Mahasiswa",
    entityId: mahasiswa.id,
    newValue: { nim: mahasiswa.nim, nama: mahasiswa.nama, angkatan: mahasiswa.angkatan },
  });

  await notifyMutation({
    action: "CREATE",
    entity: "Mahasiswa",
    entityLabel: `${mahasiswa.nama} (NIM ${mahasiswa.nim})`,
    link: "/master/mahasiswa",
  });

  revalidateAkademik();

  return { id: mahasiswa.id, nim: mahasiswa.nim, nama: mahasiswa.nama };
}

export async function updateMahasiswa(id: string, data: {
  nama?: string;
  angkatan?: number;
  status?: string;
  jenisKelamin?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mahasiswa.findUnique({ where: { id } });
  if (!existing) throw new Error("Mahasiswa tidak ditemukan");

  const updated = await db.mahasiswa.update({ where: { id }, data });

  await createAuditLog({
    action: "UPDATE",
    entity: "Mahasiswa",
    entityId: id,
    oldValue: { nama: existing.nama, status: existing.status, angkatan: existing.angkatan },
    newValue: { nama: updated.nama, status: updated.status, angkatan: updated.angkatan },
  });

  await notifyMutation({
    action: "UPDATE",
    entity: "Mahasiswa",
    entityLabel: `${updated.nama} (NIM ${updated.nim})`,
    link: "/master/mahasiswa",
  });

  revalidateAkademik();

  return { id: updated.id, nim: updated.nim, nama: updated.nama };
}

export async function deleteMahasiswa(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.mahasiswa.findUnique({ where: { id } });
  if (!existing) throw new Error("Mahasiswa tidak ditemukan");

  await db.mahasiswa.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "Mahasiswa",
    entityId: id,
    oldValue: { nim: existing.nim, nama: existing.nama, angkatan: existing.angkatan },
  });

  await notifyMutation({
    action: "DELETE",
    entity: "Mahasiswa",
    entityLabel: `${existing.nama} (NIM ${existing.nim})`,
    link: "/master/mahasiswa",
  });

  revalidateAkademik();

  return { success: true };
}
