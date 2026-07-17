import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

interface AuditLogInput {
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    const session = await auth();

    await db.auditLog.create({
      data: {
        userId: session?.user?.id || null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        oldValue: input.oldValue ? (input.oldValue as object) : undefined,
        newValue: input.newValue ? (input.newValue as object) : undefined,
      },
    });
  } catch (error) {
    // Audit log should never break the main operation
    console.error("[AuditLog] Failed to create entry:", error);
  }
}
