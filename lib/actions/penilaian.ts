"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { createAuditLog, logAccessDenied } from "@/lib/utils/audit";
import { Role } from "@prisma/client";
import { hitungPenilaian, SKOR_MIN, SKOR_MAKS, type ButirHitung } from "@/lib/utils/penilaian";

/**
 * Modul Matriks Penilaian — LAM INFOKOM 2.1.
 *
 * Satu `PenilaianSesi` per tahun akademik (keputusan RANCANGAN-010).
 * Sesi dibuat otomatis saat skor pertama disimpan.
 *
 * Izin: ADMIN penilaian.* · OPERATOR read/create/update · PIMPINAN read.
 * Finalisasi hanya ADMIN (penilaian.finalisasi).
 */

const KNOWN_ERRORS = [
  "Unauthorized",
  "Tidak terautentikasi",
  "Tidak memiliki izin",
  "tidak ditemukan",
  "tidak valid",
  "belum lengkap",
  "sudah difinalisasi",
  "belum difinalisasi",
];

async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof Error) {
      if (KNOWN_ERRORS.some((m) => err.message.includes(m))) throw err;
      console.error("[penilaian action]", err);
      throw new Error("Terjadi kesalahan pada server. Silakan coba lagi atau hubungi administrator.");
    }
    throw err;
  }
}

async function butuhIzin(permission: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  if (!hasPermission(role, permission)) {
    logAccessDenied("Penilaian", "SkorPenilaian", "permission_denied", { role, permission });
    throw new Error(`Tidak memiliki izin untuk ${permission.replace("penilaian.", "")} penilaian.`);
  }
  return session;
}

async function tahunAktif() {
  const ta = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  if (!ta) throw new Error("Tahun akademik aktif tidak ditemukan.");
  return ta;
}

/** Ambil (atau buat) sesi penilaian untuk tahun akademik aktif. */
async function sesiAktif(buat = true) {
  const ta = await tahunAktif();
  const ada = await db.penilaianSesi.findUnique({
    where: { tahunAkademikId: ta.id },
    select: { id: true, finalisasi: true },
  });
  if (ada) return { ta, sesi: ada };

  if (!buat) return { ta, sesi: null };

  const baru = await db.penilaianSesi.create({
    data: { tahunAkademikId: ta.id },
    select: { id: true, finalisasi: true },
  });
  return { ta, sesi: baru };
}

function revalidatePenilaian() {
  revalidatePath("/penilaian", "layout");
}

// ──────────────────────────────────────────────
// SIMPAN SKOR
// ──────────────────────────────────────────────

export async function setSkor(params: {
  butirId: string;
  /** null = kosongkan penilaian butir ini. */
  skor: number | null;
  catatanBukti?: string | null;
}) {
  return withErrorHandling(async () => {
    const session = await butuhIzin("penilaian.update");

    if (params.skor !== null && (params.skor < SKOR_MIN || params.skor > SKOR_MAKS)) {
      throw new Error(`Skor harus ${SKOR_MIN}–${SKOR_MAKS} atau kosong.`);
    }

    const { sesi } = await sesiAktif();
    if (!sesi) throw new Error("Sesi penilaian tidak ditemukan.");
    if (sesi.finalisasi) throw new Error("Penilaian sudah difinalisasi. Buka kembali dulu untuk mengubah.");

    const butir = await db.butirPenilaian.findUnique({
      where: { id: params.butirId },
      select: { id: true, kode: true, kriteria: true },
    });
    if (!butir) throw new Error("Butir penilaian tidak ditemukan.");

    const skor = await db.skorPenilaian.upsert({
      where: {
        penilaianSesiId_butirPenilaianId: {
          penilaianSesiId: sesi.id,
          butirPenilaianId: params.butirId,
        },
      },
      update: {
        skor: params.skor,
        ...(params.catatanBukti !== undefined ? { catatanBukti: params.catatanBukti } : {}),
        dinilaiOlehId: session.user.id,
      },
      create: {
        penilaianSesiId: sesi.id,
        butirPenilaianId: params.butirId,
        skor: params.skor,
        catatanBukti: params.catatanBukti ?? null,
        dinilaiOlehId: session.user.id,
      },
      select: { id: true, skor: true },
    });

    await createAuditLog({
      action: "SAVE",
      entity: "SkorPenilaian",
      entityId: skor.id,
      newValue: { kode: butir.kode, skor: skor.skor },
    });

    revalidatePenilaian();
    return { ok: true as const, skor: skor.skor };
  });
}

/** Simpan banyak skor sekaligus (dipakai form per kriteria). */
export async function setSkorBanyak(
  daftar: { butirId: string; skor: number | null }[],
) {
  return withErrorHandling(async () => {
    const session = await butuhIzin("penilaian.update");

    for (const d of daftar) {
      if (d.skor !== null && (d.skor < SKOR_MIN || d.skor > SKOR_MAKS)) {
        throw new Error(`Skor harus ${SKOR_MIN}–${SKOR_MAKS} atau kosong.`);
      }
    }

    const { sesi } = await sesiAktif();
    if (!sesi) throw new Error("Sesi penilaian tidak ditemukan.");
    if (sesi.finalisasi) throw new Error("Penilaian sudah difinalisasi. Buka kembali dulu untuk mengubah.");

    await db.$transaction(
      daftar.map((d) =>
        db.skorPenilaian.upsert({
          where: {
            penilaianSesiId_butirPenilaianId: {
              penilaianSesiId: sesi.id,
              butirPenilaianId: d.butirId,
            },
          },
          update: { skor: d.skor, dinilaiOlehId: session.user.id },
          create: {
            penilaianSesiId: sesi.id,
            butirPenilaianId: d.butirId,
            skor: d.skor,
            dinilaiOlehId: session.user.id,
          },
        }),
      ),
    );

    await createAuditLog({
      action: "SAVE",
      entity: "SkorPenilaian",
      entityId: sesi.id,
      newValue: { jumlah: daftar.length },
    });

    revalidatePenilaian();
    return { ok: true as const, jumlah: daftar.length };
  });
}

// ──────────────────────────────────────────────
// FINALISASI
// ──────────────────────────────────────────────

/**
 * Kunci penilaian + simpan nilai akhir & status.
 * Ditolak kalau masih ada butir yang belum dinilai (Edge Case §7).
 */
export async function finalisasiSesi(params: { catatan?: string } = {}) {
  return withErrorHandling(async () => {
    await butuhIzin("penilaian.finalisasi");

    const { sesi } = await sesiAktif();
    if (!sesi) throw new Error("Sesi penilaian tidak ditemukan.");
    if (sesi.finalisasi) throw new Error("Penilaian sudah difinalisasi.");

    const butir = await db.butirPenilaian.findMany({
      select: {
        kode: true, kriteria: true, bobot: true,
        skor: { where: { penilaianSesiId: sesi.id }, select: { skor: true } },
      },
      orderBy: { urutan: "asc" },
    });

    const data: ButirHitung[] = butir.map((b) => ({
      kode: b.kode,
      kriteria: b.kriteria,
      bobot: b.bobot,
      skor: b.skor[0]?.skor ?? null,
    }));

    const kosong = data.filter((b) => b.skor === null);
    if (kosong.length > 0) {
      const contoh = kosong.slice(0, 5).map((b) => b.kode).join(", ");
      throw new Error(
        `Penilaian belum lengkap — ${kosong.length} butir belum dinilai (mis. ${contoh}).`,
      );
    }

    const hasil = hitungPenilaian(data);

    const disimpan = await db.penilaianSesi.update({
      where: { id: sesi.id },
      data: {
        finalisasi: true,
        nilaiAkhir: hasil.nilaiAkhir,
        statusPrediksi: hasil.status,
        ...(params.catatan !== undefined ? { catatan: params.catatan } : {}),
      },
      select: { id: true, nilaiAkhir: true, statusPrediksi: true },
    });

    await createAuditLog({
      action: "UPDATE_STATUS",
      entity: "PenilaianSesi",
      entityId: sesi.id,
      newValue: {
        finalisasi: true,
        nilaiAkhir: disimpan.nilaiAkhir,
        status: disimpan.statusPrediksi,
      },
    });

    revalidatePenilaian();
    return { ok: true as const, nilaiAkhir: disimpan.nilaiAkhir, status: disimpan.statusPrediksi };
  });
}

/** Buka kembali penilaian yang sudah difinalisasi (ADMIN saja). */
export async function bukaKembaliSesi() {
  return withErrorHandling(async () => {
    await butuhIzin("penilaian.finalisasi");

    const { sesi } = await sesiAktif(false);
    if (!sesi) throw new Error("Sesi penilaian tidak ditemukan.");
    if (!sesi.finalisasi) throw new Error("Penilaian belum difinalisasi.");

    await db.penilaianSesi.update({
      where: { id: sesi.id },
      data: { finalisasi: false },
    });

    await createAuditLog({
      action: "UPDATE_STATUS",
      entity: "PenilaianSesi",
      entityId: sesi.id,
      newValue: { finalisasi: false },
    });

    revalidatePenilaian();
    return { ok: true as const };
  });
}

/** Kosongkan seluruh skor sesi ini (ADMIN). */
export async function resetSesi() {
  return withErrorHandling(async () => {
    await butuhIzin("penilaian.finalisasi");

    const { sesi } = await sesiAktif(false);
    if (!sesi) throw new Error("Sesi penilaian tidak ditemukan.");

    const dihapus = await db.skorPenilaian.deleteMany({ where: { penilaianSesiId: sesi.id } });
    await db.penilaianSesi.update({
      where: { id: sesi.id },
      data: { finalisasi: false, nilaiAkhir: null, statusPrediksi: null },
    });

    await createAuditLog({
      action: "DELETE",
      entity: "PenilaianSesi",
      entityId: sesi.id,
      oldValue: { jumlahSkorDihapus: dihapus.count },
    });

    revalidatePenilaian();
    return { ok: true as const, dihapus: dihapus.count };
  });
}
