"use server";

import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { createAuditLog } from "@/lib/utils/audit";
import { AuthError } from "next-auth";

export interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Login with credentials
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Input tidak valid" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    await createAuditLog({
      action: "LOGIN",
      entity: "User",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email atau password salah" };
        default:
          return { success: false, error: "Terjadi kesalahan autentikasi" };
      }
    }
    throw error;
  }
}

/**
 * Server Action: Logout
 */
export async function logoutAction(): Promise<void> {
  await createAuditLog({
    action: "LOGOUT",
    entity: "User",
  });
  await signOut({ redirect: false });
}
