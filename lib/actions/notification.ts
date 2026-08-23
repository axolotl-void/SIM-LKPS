"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

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
 * Centralized helper for data-mutation notifications.
 * Sends to ADMIN + PIMPINAN by default, or to a specific userId.
 * Fire-and-forget (does not block mutation response).
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

export async function notifyMutation(input: MutationNotifyInput) {
  try {
    const session = await auth();
    const actorId = session?.user?.id;
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

    await db.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        title: titleMap[input.action],
        message: `${actorName} ${verb} ${input.entity}${entityPart}`,
        type: input.type ?? typeMap[input.action],
        link: input.link ?? null,
      })),
    });
  } catch (error) {
    console.error("[Notification] notifyMutation failed:", error);
  }
}

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  try {
    await db.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("[Notification] markAsRead failed:", error);
    return { ok: false };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  try {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("[Notification] markAll failed:", error);
    return { ok: false };
  }
}
