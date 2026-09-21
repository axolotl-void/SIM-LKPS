"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Aksi notifikasi yang memang perlu dipanggil dari client.
 *
 * `createNotification` dan `notifyMutation` SENGAJA TIDAK ada di sini.
 * Dulu keduanya server action di berkas ini, sehingga siapa pun yang login
 * bisa memanggil `createNotification({ userId: "<orang lain>", ... })`
 * langsung dari browser. Keduanya sekarang tinggal di
 * `@/lib/notifikasi-internal` yang tidak punya direktif "use server".
 */

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
