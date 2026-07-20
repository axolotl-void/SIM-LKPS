"use server";

import { db } from "@/lib/db";
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
