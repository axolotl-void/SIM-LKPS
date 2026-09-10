import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LockOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoginVisual } from "./login-visual";
import { LoginShellClient } from "./login-shell-client";
import { LoginFormSection } from "./login-form-section";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Masuk - SIM-LKPS",
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi, Universitas Bina Bangsa Getsempena.",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <LoginShellClient
      left={<LoginVisual />}
      right={
        <LoginFormSection>
          {/* Sequence 1: header lockup */}
          <div className="login-stagger-item login-stagger-1 mb-4 flex items-center gap-3.5 sm:mb-5 2xl:mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/25 sm:h-11 sm:w-11 2xl:h-[52px] 2xl:w-[52px]">
              <LockOpen className="h-[22px] w-[22px] sm:h-6 sm:w-6 2xl:h-7 2xl:w-7" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase sm:text-xs 2xl:text-sm">
                Portal Masuk Akun
              </p>
              <h1
                id="login-heading"
                className="text-xl font-bold tracking-tight leading-tight text-slate-800 sm:text-2xl 2xl:text-3xl"
              >
                Selamat Datang
              </h1>
            </div>
          </div>

          {/* Sequence 2: subtitle */}
          <p className="login-stagger-item login-stagger-2 mb-4 text-xs leading-relaxed text-slate-500 sm:text-sm 2xl:mb-6 2xl:text-base">
            Silakan masukkan kredensial akun akademik Anda untuk mengakses dasbor
            LKPS.
          </p>

          {/* Sequence 3..6: form (Suspense required for useSearchParams) */}
          <div className="login-stagger-item login-stagger-3">
            <ErrorBoundary>
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Footer help */}
          <div className="login-stagger-item login-stagger-7 mt-4 border-t border-slate-100 pt-2 text-center sm:mt-5 2xl:mt-6">
            <p className="text-xs text-slate-500 2xl:text-sm">
              Butuh akses akun?{" "}
              <a
                href="https://wa.me/6281260312799?text=Halo%2C%20saya%20butuh%20bantuan%20akses%20SIM-LKPS"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0 2xl:h-4 2xl:w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>Hubungi Developer</span>
              </a>
            </p>
          </div>
        </LoginFormSection>
      }
    />
  );
}
