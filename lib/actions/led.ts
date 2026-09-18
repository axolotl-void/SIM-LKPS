"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { createAuditLog, logAccessDenied } from "@/lib/utils/audit";
import { LedStatus, Role } from "@prisma/client";
import { BATAS_KARAKTER_PER_BAGIAN } from "@/lib/utils/led-progress";

/**
 * Modul LED — Laporan Evaluasi Diri (LAM INFOKOM 2.1).
 *
 * Aturan izin (RANCANGAN-011 §6.3):
 *   ADMIN    → led.*
 *   OPERATOR → led.read/create/update/submit
 *   PIMPINAN → led.read
 *
 * Pola error mengikuti `lib/actions/lkps.ts`: pesan yang ramah untuk user,
 * error tak terduga dibungkus jadi pesan generik + dicatat ke console.
 */

const KNOWN_ERRORS = [
  "Unauthorized",
  "Tidak terautentikasi",
  "Tidak memiliki izin",
  "Hanya pimpinan",
  "tidak ditemukan",
  "tidak boleh kosong",
  "melebihi batas",
  "tidak valid",
];

async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof Error) {
      if (KNOWN_ERRORS.some((m) => err.message.includes(m))) throw err;
      console.error("[led action]", err);
      throw new Error("Terjadi kesalahan pada server. Silakan coba lagi atau hubungi administrator.");
    }
    throw err;
  }
}

/** Ambil sesi + pastikan punya izin LED. */
async function butuhIzin(permission: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, permission)) {
    logAccessDenied("LED", "LedIsian", "permission_denied", { role, permission });
    throw new Error(`Tidak memiliki izin untuk ${permission.replace("led.", "")} LED.`);
  }
  return session;
}

/** Tahun akademik yang sedang aktif. */
async function tahunAktif() {
  const ta = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  if (!ta) throw new Error("Tahun akademik aktif tidak ditemukan.");
  return ta;
}

function revalidateLed(kriteria?: number | null) {
  revalidatePath("/led", "layout");
  if (kriteria) revalidatePath(`/led/bab-2/kriteria/${kriteria}`);
}

// ──────────────────────────────────────────────
// SIMPAN NARASI (autosave)
// ──────────────────────────────────────────────

export async function saveLedIsian(params: {
  ledBagianId: string;
  konten: string;
  /** Nilai updatedAt yang dipegang client — untuk deteksi konflik 2 tab. */
  updatedAtDiketahui?: string | null;
}): Promise<
  | { ok: true; konflik: false; updatedAt: string; status: LedStatus; jumlahKarakter: number }
  | { ok: false; konflik: true; updatedAt: string; pesan: string }
> {
  return withErrorHandling(async () => {
    await butuhIzin("led.update");
    const ta = await tahunAktif();

    if (params.konten.length > BATAS_KARAKTER_PER_BAGIAN) {
      throw new Error(
        `Isi bagian melebihi batas ${BATAS_KARAKTER_PER_BAGIAN.toLocaleString("id-ID")} karakter.`,
      );
    }

    const bagian = await db.ledBagian.findUnique({
      where: { id: params.ledBagianId },
      select: { id: true, kode: true, kriteria: true, judul: true },
    });
    if (!bagian) throw new Error("Bagian LED tidak ditemukan.");

    const lama = await db.ledIsian.findUnique({
      where: {
        ledBagianId_tahunAkademikId: {
          ledBagianId: params.ledBagianId,
          tahunAkademikId: ta.id,
        },
      },
      select: { id: true, status: true, updatedAt: true },
    });

    // Deteksi konflik: server sudah berubah sejak client memuat
    if (lama && params.updatedAtDiketahui) {
      const diketahui = new Date(params.updatedAtDiketahui).getTime();
      if (lama.updatedAt.getTime() > diketahui + 1000) {
        return {
          ok: false as const,
          konflik: true,
          updatedAt: lama.updatedAt.toISOString(),
          pesan: "Bagian ini sudah diubah di tempat lain. Muat versi terbaru untuk melihat perubahannya.",
        };
      }
    }

    // KOSONG → DRAFT otomatis begitu ada isi
    const statusBaru: LedStatus =
      params.konten.trim().length > 0 && (!lama || lama.status === "KOSONG")
        ? "DRAFT"
        : (lama?.status ?? "KOSONG");

    const disimpan = await db.ledIsian.upsert({
      where: {
        ledBagianId_tahunAkademikId: {
          ledBagianId: params.ledBagianId,
          tahunAkademikId: ta.id,
        },
      },
      update: {
        konten: params.konten,
        jumlahKarakter: params.konten.length,
        status: statusBaru,
        updatedById: (await auth())?.user?.id ?? null,
      },
      create: {
        ledBagianId: params.ledBagianId,
        tahunAkademikId: ta.id,
        konten: params.konten,
        jumlahKarakter: params.konten.length,
        status: statusBaru,
        updatedById: (await auth())?.user?.id ?? null,
      },
      select: { id: true, status: true, updatedAt: true, jumlahKarakter: true },
    });

    await createAuditLog({
      action: "SAVE",
      entity: "LedIsian",
      entityId: disimpan.id,
      newValue: { kode: bagian.kode, jumlahKarakter: disimpan.jumlahKarakter },
    });

    revalidateLed(bagian.kriteria);

    return {
      ok: true as const,
      konflik: false,
      updatedAt: disimpan.updatedAt.toISOString(),
      status: disimpan.status,
      jumlahKarakter: disimpan.jumlahKarakter,
    };
  });
}

// ──────────────────────────────────────────────
// UBAH STATUS
// ──────────────────────────────────────────────

export async function setLedStatus(params: { ledBagianId: string; status: LedStatus }) {
  return withErrorHandling(async () => {
    await butuhIzin("led.update");
    const ta = await tahunAktif();

    const valid: LedStatus[] = ["KOSONG", "DRAFT", "LENGKAP", "DIAJUKAN", "DISETUJUI"];
    if (!valid.includes(params.status)) throw new Error("Status LED tidak valid.");

    const bagian = await db.ledBagian.findUnique({
      where: { id: params.ledBagianId },
      select: { kode: true, kriteria: true },
    });
    if (!bagian) throw new Error("Bagian LED tidak ditemukan.");

    const simpan = await db.ledIsian.upsert({
      where: {
        ledBagianId_tahunAkademikId: {
          ledBagianId: params.ledBagianId,
          tahunAkademikId: ta.id,
        },
      },
      update: { status: params.status },
      create: {
        ledBagianId: params.ledBagianId,
        tahunAkademikId: ta.id,
        status: params.status,
      },
      select: { id: true, status: true },
    });

    await createAuditLog({
      action: "UPDATE_STATUS",
      entity: "LedIsian",
      entityId: simpan.id,
      newValue: { kode: bagian.kode, status: simpan.status },
    });

    revalidateLed(bagian.kriteria);
    return { ok: true as const, status: simpan.status };
  });
}

// ──────────────────────────────────────────────
// BUKTI PENDUKUNG
// ──────────────────────────────────────────────

export async function addLedEvidence(params: {
  ledBagianId: string;
  filename: string;
  linkUrl?: string;
  keterangan?: string;
  minioKey?: string;
  mimeType?: string;
  size?: number;
}) {
  return withErrorHandling(async () => {
    const session = await butuhIzin("led.update");
    const ta = await tahunAktif();

    if (!params.filename.trim()) throw new Error("Nama berkas tidak boleh kosong.");
    if (!params.minioKey && !params.linkUrl) {
      throw new Error("Bukti harus berupa berkas terunggah atau tautan.");
    }

    // Pastikan baris isian ada supaya bukti tidak menggantung
    const isian = await db.ledIsian.upsert({
      where: {
        ledBagianId_tahunAkademikId: {
          ledBagianId: params.ledBagianId,
          tahunAkademikId: ta.id,
        },
      },
      update: {},
      create: { ledBagianId: params.ledBagianId, tahunAkademikId: ta.id },
      select: { id: true },
    });

    const bukti = await db.ledEvidence.create({
      data: {
        ledIsianId: isian.id,
        filename: params.filename.trim(),
        linkUrl: params.linkUrl?.trim() || null,
        keterangan: params.keterangan?.trim() || null,
        minioKey: params.minioKey ?? null,
        mimeType: params.mimeType ?? null,
        size: params.size ?? null,
        uploadedById: session.user.id,
      },
      select: { id: true, filename: true, linkUrl: true, createdAt: true },
    });

    await createAuditLog({
      action: "UPLOAD",
      entity: "LedEvidence",
      entityId: bukti.id,
      newValue: { filename: bukti.filename },
    });

    revalidatePath("/led", "layout");
    return { ok: true as const, bukti };
  });
}

export async function deleteLedEvidence(params: { evidenceId: string }) {
  return withErrorHandling(async () => {
    await butuhIzin("led.update");

    const ada = await db.ledEvidence.findUnique({
      where: { id: params.evidenceId },
      select: { id: true, filename: true },
    });
    if (!ada) throw new Error("Bukti tidak ditemukan.");

    await db.ledEvidence.delete({ where: { id: params.evidenceId } });

    await createAuditLog({
      action: "DELETE",
      entity: "LedEvidence",
      entityId: ada.id,
      oldValue: { filename: ada.filename },
    });

    revalidatePath("/led", "layout");
    return { ok: true as const };
  });
}
