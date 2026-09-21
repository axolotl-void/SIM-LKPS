"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { uploadFile, getDownloadUrl, deleteFile } from "@/lib/minio";
import { revalidatePath } from "next/cache";
import { createAuditLog, logAccessDenied } from "@/lib/utils/audit";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { notifyMutation } from "@/lib/notifikasi-internal";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_EXTENSIONS = [
  ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx", ".zip",
];

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

function sanitizeFilename(filename: string): string {
  // Remove path traversal and dangerous characters
  return filename
    .replace(/[/\\:*?"<>|]/g, "_")
    .replace(/\.\./g, "_")
    .trim()
    .substring(0, 255);
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(lastDot).toLowerCase() : "";
}

export async function uploadEvidence(tabelLkpsId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "evidence.create")) {
      logAccessDenied("UPLOAD", "Evidence", "missing_permission", { role });
      return { success: false, error: "Anda tidak memiliki izin untuk mengunggah bukti." };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    // Sanitize filename
    const safeFilename = sanitizeFilename(file.name);
    if (!safeFilename) {
      return { success: false, error: "Nama file tidak valid" };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file maksimal 10MB" };
    }

    // Check extension
    const ext = getExtension(safeFilename);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return { success: false, error: `Tipe file tidak diizinkan. Gunakan: ${ALLOWED_EXTENSIONS.join(", ")}` };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: "Tipe file tidak valid" };
    }

    const minioKey = `evidence/${tabelLkpsId}/${Date.now()}-${safeFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadFile(minioKey, buffer, file.type);

    const evidence = await db.evidence.create({
      data: {
        tabelLkpsId,
        filename: safeFilename,
        minioKey,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id,
      },
    });

    await notifyMutation({
      action: "CREATE",
      entity: "Evidence",
      entityLabel: safeFilename,
      link: "/evidence",
    });

    revalidatePath(`/evidence`);
    revalidatePath(`/lkps`);

    await createAuditLog({
      action: "UPLOAD",
      entity: "Evidence",
      entityId: evidence.id,
      newValue: { filename: safeFilename, size: file.size, tabelLkpsId },
    });

    return {
      success: true,
      evidence: {
        id: evidence.id,
        filename: evidence.filename,
        mimeType: evidence.mimeType,
        size: evidence.size,
        createdAt: evidence.createdAt,
      },
    };
  } catch (error) {
    console.error("uploadEvidence error:", error);
    return { success: false, error: "Gagal mengunggah file" };
  }
}

export async function getEvidenceList(tabelLkpsId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "evidence.read")) {
      logAccessDenied("READ", "Evidence", "missing_permission", { role });
      return { success: false, error: "Anda tidak memiliki izin untuk melihat bukti." };
    }

    const records = await db.evidence.findMany({
      where: { tabelLkpsId },
      orderBy: { createdAt: "desc" },
    });

    const evidenceList = await Promise.all(
      records.map(async (record) => {
        let downloadUrl = "";
        if (record.minioKey) {
          try {
            downloadUrl = await getDownloadUrl(record.minioKey);
          } catch {
            // if MinIO unavailable, return empty url
          }
        }

        return {
          id: record.id,
          filename: record.filename,
          mimeType: record.mimeType,
          size: record.size,
          version: record.version,
          description: record.description,
          linkUrl: record.linkUrl,
          downloadUrl: record.minioKey ? downloadUrl : "",
          createdAt: record.createdAt,
        };
      }),
    );

    return { success: true, data: evidenceList };
  } catch (error) {
    console.error("getEvidenceList error:", error);
    return { success: false, error: "Gagal mengambil daftar file" };
  }
}

export async function deleteEvidence(evidenceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "evidence.delete")) {
      logAccessDenied("DELETE", "Evidence", "missing_permission", { role });
      return { success: false, error: "Anda tidak memiliki izin untuk menghapus bukti." };
    }

    const evidence = await db.evidence.findUnique({
      where: { id: evidenceId },
    });
    if (!evidence) {
      return { success: false, error: "Evidence tidak ditemukan" };
    }

    // Only delete from MinIO if it's a file (not a link)
    if (evidence.minioKey) {
      await deleteFile(evidence.minioKey);
    }
    await db.evidence.delete({ where: { id: evidenceId } });

    await notifyMutation({
      action: "DELETE",
      entity: "Evidence",
      entityLabel: evidence.filename,
      link: "/evidence",
    });

    await createAuditLog({
      action: "DELETE",
      entity: "Evidence",
      entityId: evidenceId,
      oldValue: { filename: evidence.filename, minioKey: evidence.minioKey },
    });

    revalidatePath(`/evidence`);
    revalidatePath(`/lkps`);

    return { success: true };
  } catch (error) {
    console.error("deleteEvidence error:", error);
    return { success: false, error: "Gagal menghapus file" };
  }
}

export async function addEvidenceLink(tabelLkpsId: string, linkUrl: string, label?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const role = session.user.role as Role;
    if (!hasPermission(role, "evidence.create")) {
      logAccessDenied("ADD_LINK", "Evidence", "missing_permission", { role });
      return { success: false, error: "Anda tidak memiliki izin untuk menambahkan bukti." };
    }

    // Validate URL
    let url: URL;
    try {
      url = new URL(linkUrl);
    } catch {
      return { success: false, error: "URL tidak valid" };
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(url.protocol)) {
      return { success: false, error: "Hanya URL http/https yang diizinkan" };
    }

    const evidence = await db.evidence.create({
      data: {
        tabelLkpsId,
        filename: label || `Link: ${url.hostname}`,
        linkUrl: url.toString(),
        uploadedById: session.user.id,
      },
    });

    await notifyMutation({
      action: "CREATE",
      entity: "Evidence",
      entityLabel: url.hostname,
      link: "/evidence",
    });

    revalidatePath(`/evidence`);
    revalidatePath(`/lkps`);

    await createAuditLog({
      action: "ADD_LINK",
      entity: "Evidence",
      entityId: evidence.id,
      newValue: { linkUrl: url.toString(), tabelLkpsId },
    });

    return { success: true, evidence: { id: evidence.id } };
  } catch (error) {
    console.error("addEvidenceLink error:", error);
    return { success: false, error: "Gagal menambahkan link" };
  }
}
