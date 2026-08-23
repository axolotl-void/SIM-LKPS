"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  hasPermission,
  canEditTable,
  canDeleteRow,
} from "@/lib/utils/permissions";
import { createAuditLog } from "@/lib/utils/audit";
import { createNotification, notifyMutation } from "@/lib/actions/notification";
import { Role, TabelStatus } from "@prisma/client";

/**
 * Status labels for error messages (verbose variant for clarity)
 */
const STATUS_LABELS_ERROR: Record<TabelStatus, string> = {
  DRAFT: "Draft",
  DIAJUKAN: "Diajukan untuk validasi",
  DIREVISI: "Direvisi",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  const lkps = await getOrCreateLkps(params.tabelKode, params.tahunAkademikId);

  // VALIDASI: Role-based edit permission
  if (!canEditTable(role, lkps.status)) {
    throw new Error(
      `Tidak dapat mengubah data pada tabel berstatus ${STATUS_LABELS_ERROR[lkps.status]}.`
    );
  }

  let savedRow;
  const isUpdate = !!params.rowId;

  if (isUpdate) {
    savedRow = await db.tabelLkpsRow.update({
      where: { id: params.rowId },
      data: { rowData: params.rowData },
    });
    // Audit log untuk UPDATE
    await createAuditLog({
      action: "UPDATE",
      entity: "TabelLkpsRow",
      entityId: savedRow.id,
      newValue: { tabelKode: params.tabelKode, rowData: params.rowData },
    });
    await notifyMutation({
      action: "UPDATE",
      entity: "TabelLkpsRow",
      entityLabel: `Tabel ${params.tabelKode}`,
      link: `/lkps/${lkps.tabelDefinition.bab}/${params.tabelKode}`,
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
    // Audit log untuk CREATE
    await createAuditLog({
      action: "CREATE",
      entity: "TabelLkpsRow",
      entityId: savedRow.id,
      newValue: { tabelKode: params.tabelKode, rowData: params.rowData },
    });
    await notifyMutation({
      action: "CREATE",
      entity: "TabelLkpsRow",
      entityLabel: `Tabel ${params.tabelKode}`,
      link: `/lkps/${lkps.tabelDefinition.bab}/${params.tabelKode}`,
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

  const role = session.user.role as Role;
  const row = await db.tabelLkpsRow.findUnique({
    where: { id: params.rowId },
    include: { tabelLkps: { include: { tabelDefinition: true } } },
  });
  if (!row) throw new Error("Row not found");

  // VALIDASI: Role-based delete permission
  if (!canDeleteRow(role, row.tabelLkps.status)) {
    throw new Error(
      `Tidak dapat menghapus data pada tabel berstatus ${STATUS_LABELS_ERROR[row.tabelLkps.status]}.`
    );
  }

  // Simpan data sebelum hapus untuk audit log
  const deletedData = { tabelKode: row.tabelLkps.tabelDefinition.kode, rowData: row.rowData };

  await db.tabelLkpsRow.delete({ where: { id: params.rowId } });

  await notifyMutation({
    action: "DELETE",
    entity: "TabelLkpsRow",
    entityLabel: `Tabel ${params.tabelKode}`,
    link: `/lkps/${row.tabelLkps.tabelDefinition.bab}/${params.tabelKode}`,
  });

  // Audit log untuk DELETE
  await createAuditLog({
    action: "DELETE",
    entity: "TabelLkpsRow",
    entityId: params.rowId,
    oldValue: deletedData,
  });

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

  // Notifikasi ke semua OPERATOR + ADMIN (reviewers, selain actor)
  const reviewers = await db.user.findMany({
    where: {
      role: { in: ["OPERATOR", "ADMIN"] },
      isActive: true,
      id: { not: session.user.id },
    },
  });
  for (const v of reviewers) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  await createAuditLog({
    action: "CREATE",
    entity: "Dosen",
    entityId: newDosen.id,
    newValue: { nama, nidn, status: "Tetap" },
  });

  await notifyMutation({
    action: "CREATE",
    entity: "Dosen",
    entityLabel: `${nama} (NIDN ${nidn})`,
    link: "/master/dosen",
  });

  revalidatePath("/dashboard");
  revalidatePath("/master/dosen");

  return {
    id: newDosen.id,
    nidn: newDosen.nidn,
    nama: newDosen.nama,
  };
}

export async function updateDosen(id: string, data: { nama?: string; status?: string; pendidikanTerakhir?: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.dosen.findUnique({ where: { id } });
  if (!existing) throw new Error("Dosen tidak ditemukan");

  const updated = await db.dosen.update({
    where: { id },
    data,
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "Dosen",
    entityId: id,
    oldValue: { nama: existing.nama, status: existing.status },
    newValue: { nama: updated.nama, status: updated.status },
  });

  await notifyMutation({
    action: "UPDATE",
    entity: "Dosen",
    entityLabel: `${updated.nama} (NIDN ${updated.nidn})`,
    link: "/master/dosen",
  });

  revalidatePath("/dashboard");
  revalidatePath("/master/dosen");

  return { id: updated.id, nama: updated.nama, status: updated.status };
}

export async function deleteDosen(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.dosen.findUnique({ where: { id } });
  if (!existing) throw new Error("Dosen tidak ditemukan");

  await db.dosen.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "Dosen",
    entityId: id,
    oldValue: { nama: existing.nama, nidn: existing.nidn },
  });

  await notifyMutation({
    action: "DELETE",
    entity: "Dosen",
    entityLabel: `${existing.nama} (NIDN ${existing.nidn})`,
    link: "/master/dosen",
  });

  revalidatePath("/dashboard");
  revalidatePath("/master/dosen");

  return { success: true };
}
