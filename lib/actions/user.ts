"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validations/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { createAuditLog } from "@/lib/utils/audit";
import { Role } from "@prisma/client";

interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Guard: check if current user has permission
 */
async function requirePermission(permission: string): Promise<{ userId: string; role: Role }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");

  const role = (session.user as { role: Role }).role;
  if (!hasPermission(role, permission)) {
    throw new Error("Tidak memiliki izin");
  }

  return { userId: session.user.id, role };
}

/**
 * Get all users (paginated)
 */
export async function getUsers(page = 1, limit = 20, search?: string) {
  await requirePermission("user.read");

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new user
 */
export async function createUser(formData: FormData): Promise<ActionResult> {
  await requirePermission("user.create");

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  // Check if email already exists
  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { success: false, error: "Email sudah terdaftar" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: parsed.data.role as Role,
    },
  });

  await createAuditLog({
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    newValue: { name: user.name, email: user.email, role: user.role },
  });

  revalidatePath("/settings/users");
  return { success: true, data: { id: user.id, name: user.name } };
}

/**
 * Update a user
 */
export async function updateUser(userId: string, formData: FormData): Promise<ActionResult> {
  await requirePermission("user.update");

  const raw: Record<string, unknown> = {};
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const isActive = formData.get("isActive");

  if (name) raw.name = name;
  if (email) raw.email = email;
  if (role) raw.role = role;
  if (isActive !== null) raw.isActive = isActive === "true";

  const parsed = updateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const oldUser = await db.user.findUnique({ where: { id: userId } });
  if (!oldUser) {
    return { success: false, error: "User tidak ditemukan" };
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: parsed.data as Record<string, unknown>,
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "User",
    entityId: userId,
    oldValue: { name: oldUser.name, email: oldUser.email, role: oldUser.role, isActive: oldUser.isActive },
    newValue: { name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, isActive: updatedUser.isActive },
  });

  revalidatePath("/settings/users");
  return { success: true };
}

/**
 * Delete (deactivate) a user
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  await requirePermission("user.delete");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: "User tidak ditemukan" };
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await createAuditLog({
    action: "DELETE",
    entity: "User",
    entityId: userId,
    oldValue: { name: user.name, isActive: true },
    newValue: { isActive: false },
  });

  revalidatePath("/settings/users");
  return { success: true };
}

/**
 * Reset user password
 */
export async function resetUserPassword(userId: string, newPassword: string): Promise<ActionResult> {
  await requirePermission("user.update");

  if (newPassword.length < 8) {
    return { success: false, error: "Password minimal 8 karakter" };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: "User tidak ditemukan" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "User",
    entityId: userId,
    newValue: { action: "Password reset" },
  });

  return { success: true };
}
