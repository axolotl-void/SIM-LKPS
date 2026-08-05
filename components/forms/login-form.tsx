"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.07 },
  }),
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: -8, height: 0, marginTop: 0, marginBottom: 0 },
  show: {
    opacity: 1,
    y: 0,
    height: "auto",
    marginTop: 0,
    marginBottom: 16,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: { duration: 0.2 },
  },
};

type FieldErrors = Partial<Record<"email" | "password", string>>;

function friendlyError(raw: string | undefined): string {
  if (!raw) return "Email atau kata sandi tidak sesuai.";
  const lower = raw.toLowerCase();
  if (lower.includes("credential") || lower.includes("invalid") || lower.includes("not found")) {
    return "Email atau kata sandi tidak sesuai.";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
  }
  return "Email atau kata sandi tidak sesuai.";
}

export function LoginForm() {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;

  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submittingRef = useRef(false);

  const motionProps = reduced
    ? {}
    : { initial: "hidden" as const, animate: "show" as const };

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const trimmed = email.trim();
    if (!trimmed) next.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      next.email = "Format email tidak valid.";
    if (!password) next.password = "Kata sandi wajib diisi.";
    else if (password.length < 6) next.password = "Kata sandi minimal 6 karakter.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current || isLoading) return;

    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      setFormError(null);
      return;
    }

    submittingRef.current = true;
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setFormError(friendlyError(result?.error));
        setSuccess(false);
        return;
      }

      setSuccess(true);
      router.push("/");
      router.refresh();
    } catch {
      setFormError("Terjadi kesalahan tak terduga. Silakan coba lagi.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  }

  const fieldClass = (hasError: boolean) =>
    [
      "block w-full rounded-2xl border bg-white/95 py-3.5 pl-12 text-[14px] text-slate-900",
      "placeholder:text-slate-400 transition-all duration-200 outline-none",
      "focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
      hasError
        ? "h-14 border-red-300 focus:border-red-400 focus:ring-red-100"
        : "h-14 border-slate-200/80 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100",
    ].join(" ");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      <AnimatePresence initial={false}>
        {formError && !success && (
          <motion.div
            key="form-error"
            variants={reduced ? undefined : messageVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "show"}
            exit={reduced ? undefined : "exit"}
            role="alert"
            aria-live="assertive"
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-red-200/70 bg-red-50/85 p-3.5">
              <span
                className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-100"
                aria-hidden
              >
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-900">Login gagal</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-slate-600">{formError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="form-success"
            variants={reduced ? undefined : messageVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "show"}
            exit={reduced ? undefined : "exit"}
            role="status"
            aria-live="polite"
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/85 p-3.5">
              <span
                className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100"
                aria-hidden
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </span>
              <p className="text-[13px] font-medium text-slate-700">
                Login berhasil. Mengalihkan ke beranda…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={0}
        className="space-y-1.5"
      >
        <label htmlFor={emailId} className="block text-[13px] font-medium text-slate-700">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Mail className="h-[18px] w-[18px] text-slate-400" aria-hidden />
          </span>
          <input
            id={emailId}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              if (formError) setFormError(null);
            }}
            placeholder="nama@ubbg.ac.id"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? `${emailId}-err` : undefined}
            className={fieldClass(Boolean(fieldErrors.email))}
          />
        </div>
        {fieldErrors.email && (
          <p
            id={`${emailId}-err`}
            className="flex items-center gap-1.5 px-1 text-[12px] text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            <span>{fieldErrors.email}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={1}
        className="mt-4 space-y-1.5"
      >
        <label htmlFor={passwordId} className="block text-[13px] font-medium text-slate-700">
          Kata sandi
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Lock className="h-[18px] w-[18px] text-slate-400" aria-hidden />
          </span>
          <input
            id={passwordId}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              if (formError) setFormError(null);
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? `${passwordId}-err` : undefined}
            className={fieldClass(Boolean(fieldErrors.password))}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            disabled={isLoading}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl text-slate-400 transition-colors duration-150 hover:text-slate-600 focus-visible:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" aria-hidden />
            ) : (
              <Eye className="h-[18px] w-[18px]" aria-hidden />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p
            id={`${passwordId}-err`}
            className="flex items-center gap-1.5 px-1 text-[12px] text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            <span>{fieldErrors.password}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={2}
        className="mt-6"
      >
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="group relative inline-flex h-14 w-full min-h-[56px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 px-4 text-[14px] font-semibold tracking-tight text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(37,99,235,0.65)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
          <span className="relative inline-flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden />
                <span>Memproses…</span>
              </>
            ) : (
              <>
                <span>Masuk ke SIM-LKPS</span>
                <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </>
            )}
          </span>
        </button>
      </motion.div>

      <motion.div
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={3}
        className="mt-5 flex items-center gap-3"
        aria-hidden={false}
      >
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
          atau
        </span>
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
      </motion.div>

      <motion.button
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={4}
        type="button"
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/60 px-4 text-[13px] font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:scale-[0.98]"
      >
        <Headphones className="h-4 w-4 text-slate-500" aria-hidden />
        <span>Hubungi Administrator</span>
      </motion.button>

      <motion.p
        {...motionProps}
        variants={reduced ? undefined : fieldVariants}
        custom={5}
        className="mt-5 text-center text-[12.5px] text-slate-500"
      >
        Kendala login? Hubungi administrator prodi untuk reset kredensial.
      </motion.p>
    </form>
  );
}