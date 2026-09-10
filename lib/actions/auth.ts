"use server";

import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { isTransientDbError } from "@/lib/utils/db-retry";

/**
 * Cari akar error di rantai `cause`.
 *
 * NextAuth membungkus error dari `authorize()` di dalam AuthError dengan
 * type "Configuration"/"CredentialsSignin", sehingga kegagalan database
 * (mis. Neon sedang bangun) tampak seperti masalah kredensial. Kita telusuri
 * rantainya supaya bisa membedakan gangguan koneksi dari password salah.
 */
function cariErrorDb(e: unknown): unknown {
  let cur: unknown = e;
  for (let i = 0; i < 5 && cur; i++) {
    if (isTransientDbError(cur)) return cur;
    cur = (cur as { cause?: unknown }).cause;
  }
  return null;
}

export interface LoginState {
  success: boolean | null;
  error?: string;
  fieldErrors?: { email?: string; password?: string };
}

/**
 * Sanitize callbackUrl — only allow same-origin paths starting with "/".
 * Prevents open-redirect: attacker can't pass "//evil.com" or "https://evil.com".
 */
function safeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return "/";
  // Allow only paths starting with single "/" (not "//" or "http")
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

/**
 * Server Action: Login with credentials.
 *
 * Flow:
 *  1. Read email/password/callbackUrl from FormData
 *  2. Validate with Zod (loginSchema) — strict email + min-6 password
 *     On invalid: return LoginState with fieldErrors, form shows error
 *  3. Fire-and-forget audit log "LOGIN_ATTEMPT" (so we have a record even
 *     if credentials are wrong; success audit happens via session callback)
 *  4. signIn with redirect:true + redirectTo=sanitized callbackUrl
 *     - On success: Next.js sets session cookie + throws NEXT_REDIRECT,
 *       client navigates to callbackUrl
 *     - On CredentialsSignin: catch → return LoginState
 *     - On AccessDenied: catch → return LoginState
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const callbackUrl = safeCallbackUrl(
    formData.get("callbackUrl") as string | null
  );

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const fieldErrors: LoginState["fieldErrors"] = {};
    for (const issue of parsed.error.errors) {
      const path = issue.path[0];
      if (path === "email") fieldErrors.email = issue.message;
      else if (path === "password") fieldErrors.password = issue.message;
    }
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Input tidak valid",
      fieldErrors,
    };
  }

  try {
    // signIn with redirect:true throws NEXT_REDIRECT on success → client navigates.
    // Session cookie is set in the Server Action response headers automatically.
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
    // Unreachable on success: signIn throws NEXT_REDIRECT above.
    return { success: true };
  } catch (error) {
    // Kegagalan database (Neon bangun / koneksi putus sesaat) BUKAN salah
    // password. Deteksi dulu supaya pesannya tidak menyesatkan, dan catat
    // penyebab aslinya ke log server supaya bisa ditelusuri.
    const errorDb = cariErrorDb(error);
    if (errorDb) {
      console.error("[login] gangguan koneksi database:", errorDb);
      return {
        success: false,
        error:
          "Server sedang tidak dapat dihubungi. Coba lagi sebentar lagi.",
      };
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Email atau kata sandi tidak sesuai.",
          };
        case "AccessDenied":
          return {
            success: false,
            error: "Akun Anda tidak memiliki akses. Hubungi administrator.",
          };
        default:
          // Jangan telan penyebabnya: tanpa ini, error tak terduga di
          // authorize() hilang jejak dan hanya muncul sebagai pesan generik.
          console.error(`[login] AuthError tak tertangani (${error.type}):`, error);
          return {
            success: false,
            error: "Terjadi kesalahan autentikasi. Coba lagi nanti.",
          };
      }
    }
    // Re-throw NEXT_REDIRECT and other framework errors so Next.js can handle them.
    throw error;
  }
}

/**
 * Server Action: Logout
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
}
