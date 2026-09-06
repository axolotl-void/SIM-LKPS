"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = { success: null };

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const emailId = useId();
  const passwordId = useId();

  const [state, action, pending] = useActionState(loginAction, initialState);

  const [showPassword, setShowPassword] = useState(false);

  // After successful login: set exit-animation flag. Navigation is handled
  // by the Server Action's signIn redirect.
  useEffect(() => {
    if (state.success === true) {
      sessionStorage.setItem("login-exit", "1");
    }
  }, [state.success]);

  // Soft client-side cooldown after many failed attempts.
  const [failureCount, setFailureCount] = useState(0);
  useEffect(() => {
    if (state.success === false && state.error) {
      setFailureCount((c) => c + 1);
    } else if (state.success === true) {
      setFailureCount(0);
    }
  }, [state]);
  const isRateLimited = pending === false && failureCount >= 5;

  const fieldClass = (hasError: boolean) =>
    [
      "block w-full rounded-xl border bg-white/90 py-2.5 pl-10 pr-10 text-sm text-slate-800 shadow-sm transition-all outline-none",
      "2xl:py-3.5 2xl:text-base",
      "placeholder:text-slate-400",
      "focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200/80 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/30",
    ].join(" ");

  const emailError = state.fieldErrors?.email;
  const passwordError = state.fieldErrors?.password;
  const formError = state.success === false ? state.error : null;
  const success = state.success === true;

  return (
    <form action={action} noValidate className="flex flex-col">
      {/* Hidden callback URL for post-login redirect */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {/* Error banner */}
      {formError && !success && (
        <div role="alert" aria-live="assertive" className="mb-4">
          <div className="flex items-start gap-3 rounded-xl border border-red-200/70 bg-red-50/85 p-3.5">
            <span
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100"
              aria-hidden
            >
              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-slate-900">
                Login gagal
              </p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-slate-600">
                {formError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div role="status" aria-live="polite" className="mb-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/85 p-3.5">
            <span
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100"
              aria-hidden
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <p className="text-[13px] font-medium text-slate-700">
              Login berhasil. Mengalihkan ke beranda…
            </p>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="login-stagger-item login-stagger-3 space-y-1.5">
        <label
          htmlFor={emailId}
          className="block text-[11px] font-bold tracking-wide text-slate-700 uppercase 2xl:text-xs"
        >
          Email Pengguna
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 text-lg text-slate-400 2xl:text-xl">
            badge
          </span>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            disabled={pending}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? `${emailId}-err` : undefined}
            placeholder="nama@ubbg.ac.id"
            className={fieldClass(Boolean(emailError))}
          />
        </div>
        {emailError && (
          <p
            id={`${emailId}-err`}
            className="flex items-center gap-1.5 px-1 text-[12px] text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            <span>{emailError}</span>
          </p>
        )}
      </div>

      {/* Password */}
      <div className="login-stagger-item login-stagger-4 mt-3 space-y-1.5 2xl:mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor={passwordId}
            className="block text-[11px] font-bold tracking-wide text-slate-700 uppercase 2xl:text-xs"
          >
            Kata Sandi
          </label>
          <a
            href="#"
            className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 2xl:text-sm"
          >
            Lupa Password?
          </a>
        </div>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 text-lg text-slate-400 2xl:text-xl">
            key
          </span>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={pending}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? `${passwordId}-err` : undefined}
            placeholder="••••••••"
            className={fieldClass(Boolean(passwordError))}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            disabled={pending}
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            aria-pressed={showPassword}
            className="absolute right-3 p-1 text-slate-400 transition-colors duration-150 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <span className="material-symbols-outlined text-lg leading-none 2xl:text-xl">
              visibility
            </span>
          </button>
        </div>
        {passwordError && (
          <p
            id={`${passwordId}-err`}
            className="flex items-center gap-1.5 px-1 text-[12px] text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            <span>{passwordError}</span>
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="login-stagger-item login-stagger-5 mt-3.5 2xl:mt-4">
        <button
          type="submit"
          disabled={pending || isRateLimited}
          aria-busy={pending}
          className="group/btn relative inline-flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-sky-600 hover:shadow-blue-500/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 2xl:py-3.5 2xl:text-base"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full"
          />
          {pending ? (
            <>
              <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden />
              <span>Memproses…</span>
            </>
          ) : isRateLimited ? (
            <span>Terlalu banyak percobaan. Coba lagi nanti.</span>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-0.5 2xl:text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
