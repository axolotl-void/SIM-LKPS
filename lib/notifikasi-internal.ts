import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NotificationType } from "@prisma/client";

/**
 * Notifikasi internal — BUKAN server action.
 *
 * Berkas ini tidak memakai direktif "use server", jadi fungsinya tidak
 * diekspos sebagai endpoint HTTP publik. Dulu `createNotification` adalah
 * server action dengan argumen `userId` bebas, sehingga siapa pun yang
 * login bisa mengirim notifikasi ke user mana pun. Sekarang fungsi ini
 * hanya bisa dipanggil dari kode server lain.
 */

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

/**
 * Buat satu notifikasi.
 *
 * CATATAN: ini helper internal, bukan pintu publik. Kalau nanti butuh
 * memanggilnya dari client, jangan buka kembali sebagai server action --
 * bikin aksi terpisah yang memeriksa izin dan mengunci penerimanya.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    await db.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type ?? "INFO",
        link: input.link ?? null,
      },
    });
  } catch (error) {
    console.error("[Notification] Failed to create:", error);
  }
}

/**
 * Kirim notifikasi mutasi data ke ADMIN + PIMPINAN.
 *
 * `link` ditulis ke database lalu dipakai client untuk `router.push`.
 * Next.js sudah menolak tujuan non-internal, tapi kita jaga di sumbernya:
 * nilai yang jelas-jelas bukan jalur internal dibuang.
 */
type MutationKind = "CREATE" | "UPDATE" | "DELETE";

interface MutationNotifyInput {
  action: MutationKind;
  entity: string; // e.g. "Mahasiswa", "Dosen", "TabelLkpsRow"
  entityLabel?: string; // human-friendly description, e.g. "NIM 2024001"
  link?: string;
  type?: NotificationType;
  recipientUserIds?: string[]; // override default recipients
}

/** Terima hanya jalur internal seperti "/lkps/kriteria-2/tabel-2a1". */
function tautanInternalAman(link: string): string | null {
  if (!link.startsWith("/")) return null;
  // "//evilsite.com" dan "/\evilsite.com" ditafsirkan browser sebagai host luar.
  if (link.startsWith("//") || link.startsWith("/\\")) return null;
  // Reject CR/LF dan backslash mentah supaya tidak bisa menutup konteks URL.
  if (/[\r\n\\]/.test(link)) return null;
  return link;
}

export async function notifyMutation(input: MutationNotifyInput) {
  try {
    const session = await auth();
    const actorName = session?.user?.name || "Seseorang";

    let recipients: string[];
    if (input.recipientUserIds && input.recipientUserIds.length > 0) {
      recipients = input.recipientUserIds;
    } else {
      // Default: kirim ke ADMIN + PIMPINAN (semua stakeholder selain actor).
      const others = await db.user.findMany({
        where: {
          role: { in: ["ADMIN", "PIMPINAN"] },
          isActive: true,
        },
        select: { id: true },
      });
      recipients = others.map((u) => u.id);
    }

    if (recipients.length === 0) return;

    const verb = input.action === "CREATE" ? "menambahkan" : input.action === "UPDATE" ? "memperbarui" : "menghapus";
    const entityPart = input.entityLabel ? ` ${input.entityLabel}` : "";
    const titleMap = {
      CREATE: "Data baru ditambahkan",
      UPDATE: "Data diperbarui",
      DELETE: "Data dihapus",
    } as const;
    const typeMap = {
      CREATE: "INFO" as const,
      UPDATE: "INFO" as const,
      DELETE: "WARNING" as const,
    };

    const linkAman = input.link ? tautanInternalAman(input.link) : null;

    await db.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        title: titleMap[input.action],
        message: `${actorName} ${verb} ${input.entity}${entityPart}`,
        type: input.type ?? typeMap[input.action],
        link: linkAman,
      })),
    });
  } catch (error) {
    console.error("[Notification] notifyMutation failed:", error);
  }
}
