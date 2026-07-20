"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { createAuditLog } from "@/lib/utils/audit";
import { createNotification } from "@/lib/actions/notification";
import { Role, TabelStatus } from "@prisma/client";

// ──────────────────────────────────────────────
// Helper: resolve revalidation path from kode
// ──────────────────────────────────────────────

function revalidateTabel(kode: string, bab?: number) {
  const clean = kode.toLowerCase().replace(/\./g, "");
  const path = bab ? `/lkps/bab-${bab}/tabel-${clean}` : `/lkps`;
  revalidatePath(path);
}

// ──────────────────────────────────────────────
// Helper: get TabelLkps instance (create if needed)
// ──────────────────────────────────────────────

async function getOrCreateLkps(tabelKode: string, tahunAkademikId: string) {
  const def = await db.tabelDefinition.findUnique({ where: { kode: tabelKode } });
  if (!def) throw new Error("Table definition not found");

  let lkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId,
      },
    },
    include: { tabelDefinition: true },
  });

  if (!lkps) {
    lkps = await db.tabelLkps.create({
      data: {
        tabelDefinitionId: def.id,
        tahunAkademikId,
        status: "DRAFT",
      },
      include: { tabelDefinition: true },
    });
  }

  return lkps;
}

// ──────────────────────────────────────────────
// UPSERT / DELETE ROWS
// ──────────────────────────────────────────────

export async function upsertLkpsRow(params: {
  tabelKode: string;
  tahunAkademikId: string;
  rowId?: string;
  rowData: any;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const lkps = await getOrCreateLkps(params.tabelKode, params.tahunAkademikId);

  // Jika status DISETUJUI atau DIAJUKAN → blokir edit
  if (lkps.status === "DISETUJUI" || lkps.status === "DIAJUKAN") {
    throw new Error("Tidak dapat mengubah data tabel yang sudah disetujui atau sedang diajukan.");
  }

  let savedRow;
  if (params.rowId) {
    savedRow = await db.tabelLkpsRow.update({
      where: { id: params.rowId },
      data: { rowData: params.rowData },
    });
  } else {
    const lastRow = await db.tabelLkpsRow.findFirst({
      where: { tabelLkpsId: lkps.id },
      orderBy: { rowOrder: "desc" },
    });
    const order = lastRow ? lastRow.rowOrder + 1 : 1;
    savedRow = await db.tabelLkpsRow.create({
      data: { tabelLkpsId: lkps.id, rowOrder: order, rowData: params.rowData },
    });
  }

  // Jika DITOLAK, edit otomatis balik ke DRAFT
  if (lkps.status === "DITOLAK") {
    await db.tabelLkps.update({
      where: { id: lkps.id },
      data: { status: "DRAFT", submittedById: null, submittedAt: null },
    });
  }

  const bab = lkps.tabelDefinition.bab;
  revalidateTabel(params.tabelKode, bab);

  return { id: savedRow.id, rowOrder: savedRow.rowOrder, rowData: savedRow.rowData };
}

export async function deleteLkpsRow(params: { rowId: string; tabelKode: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const row = await db.tabelLkpsRow.findUnique({
    where: { id: params.rowId },
    include: { tabelLkps: { include: { tabelDefinition: true } } },
  });
  if (!row) throw new Error("Row not found");

  // Blokir hapus jika DIAJUKAN atau DISETUJUI
  if (row.tabelLkps.status === "DIAJUKAN" || row.tabelLkps.status === "DISETUJUI") {
    throw new Error("Tidak dapat menghapus data pada tabel yang sedang diproses.");
  }

  await db.tabelLkpsRow.delete({ where: { id: params.rowId } });

  const { kode, bab } = row.tabelLkps.tabelDefinition;
  revalidateTabel(kode, bab);
}

// ──────────────────────────────────────────────
// SUBMIT — Operator mengirim tabel untuk divalidasi
// ──────────────────────────────────────────────

export async function submitLkpsTabel(tabelKode: string, tahunAkademikId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, "tabel_lkps.submit")) {
    throw new Error("Anda tidak memiliki izin untuk submit tabel.");
  }

  const lkps = await getOrCreateLkps(tabelKode, tahunAkademikId);

  if (lkps.status !== "DRAFT" && lkps.status !== "DIREVISI") {
    throw new Error("Status tabel harus DRAFT atau DIREVISI untuk diajukan.");
  }

  // Minimal 1 baris
  const rowCount = await db.tabelLkpsRow.count({ where: { tabelLkpsId: lkps.id } });
  if (rowCount === 0) {
    throw new Error("Tidak dapat mengajukan tabel kosong. Tambahkan minimal 1 data.");
  }

  await db.tabelLkps.update({
    where: { id: lkps.id },
    data: {
      status: "DIAJUKAN",
      submittedById: session.user.id,
      submittedAt: new Date(),
    },
  });

  // Catat history
  await db.validationHistory.create({
    data: {
      tabelLkpsId: lkps.id,
      userId: session.user.id,
      action: "SUBMIT",
    },
  });

  // Audit log
  await createAuditLog({
    action: "SUBMIT",
    entity: "TabelLkps",
    entityId: lkps.id,
    newValue: { status: "DIAJUKAN" },
  });

  // Notifikasi ke semua VALIDATOR
  const validators = await db.user.findMany({ where: { role: "VALIDATOR", isActive: true } });
  for (const v of validators) {
    await createNotification({
      userId: v.id,
      title: "Tabel Diajukan",
      message: `Tabel ${lkps.tabelDefinition.kode} - ${lkps.tabelDefinition.nama} telah diajukan untuk divalidasi.`,
      type: "INFO",
      link: `/lkps/bab-${lkps.tabelDefinition.bab}/tabel-${tabelKode.toLowerCase().replace(/\./g, "")}`,
    });
  }

  const bab = lkps.tabelDefinition.bab;
  revalidateTabel(tabelKode, bab);

  return { status: "DIAJUKAN" as const };
}

// ──────────────────────────────────────────────
// VALIDATE — Validator menyetujui/menolak/meminta revisi
// ──────────────────────────────────────────────

export async function validateLkpsTabel(
  tabelKode: string,
  tahunAkademikId: string,
  action: "APPROVE" | "REJECT" | "REVISE",
  comment?: string
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, "tabel_lkps.validate")) {
    throw new Error("Anda tidak memiliki izin untuk validasi.");
  }

  const lkps = await getOrCreateLkps(tabelKode, tahunAkademikId);

  if (lkps.status !== "DIAJUKAN") {
    throw new Error("Hanya tabel berstatus Diajukan yang dapat divalidasi.");
  }

  // REJECT dan REVISE wajib komentar
  if ((action === "REJECT" || action === "REVISE") && (!comment || !comment.trim())) {
    throw new Error("Komentar wajib diisi untuk menolak atau meminta revisi.");
  }

  const statusMap = {
    APPROVE: "DISETUJUI" as TabelStatus,
    REJECT: "DITOLAK" as TabelStatus,
    REVISE: "DIREVISI" as TabelStatus,
  };

  const updateData: any = { status: statusMap[action] };
  if (action === "APPROVE") {
    updateData.validatedById = session.user.id;
    updateData.validatedAt = new Date();
  }

  await db.tabelLkps.update({ where: { id: lkps.id }, data: updateData });

  // Catat history
  await db.validationHistory.create({
    data: {
      tabelLkpsId: lkps.id,
      userId: session.user.id,
      action,
      comment: comment ?? null,
    },
  });

  // Audit log
  await createAuditLog({
    action,
    entity: "TabelLkps",
    entityId: lkps.id,
    newValue: { status: statusMap[action], comment },
  });

  // Notifikasi ke submitter
  if (lkps.submittedById) {
    const labelMap = { APPROVE: "disetujui", REJECT: "ditolak", REVISE: "direvisi" };
    await createNotification({
      userId: lkps.submittedById,
      title: `Tabel ${labelMap[action]}`,
      message: `Tabel ${lkps.tabelDefinition.kode} - ${lkps.tabelDefinition.nama} telah ${labelMap[action]} oleh validator.${comment ? ` Catatan: ${comment}` : ""}`,
      type: action === "APPROVE" ? "SUCCESS" : "WARNING",
      link: `/lkps/bab-${lkps.tabelDefinition.bab}/tabel-${tabelKode.toLowerCase().replace(/\./g, "")}`,
    });
  }

  const bab = lkps.tabelDefinition.bab;
  revalidateTabel(tabelKode, bab);

  return { status: statusMap[action] };
}

export async function createDosen(nama: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Generate a random 10-digit NIDN that doesn't conflict
  let nidn = "";
  let isUnique = false;
  while (!isUnique) {
    const rand = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existing = await db.dosen.findUnique({
      where: { nidn: rand },
    });
    if (!existing) {
      nidn = rand;
      isUnique = true;
    }
  }

  const newDosen = await db.dosen.create({
    data: {
      nidn,
      nama,
      status: "Tetap",
      pendidikanTerakhir: "S2",
      jenisKelamin: "L", // default
    },
  });

  return {
    id: newDosen.id,
    nidn: newDosen.nidn,
    nama: newDosen.nama,
  };
}
