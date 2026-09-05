import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoginVisual } from "./login-visual";
import { LoginPanelEntrance, LoginPanelItem } from "./login-panel-entrance";

export const metadata: Metadata = {
  title: "Masuk - SIM-LKPS",
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi, Universitas Bina Bangsa Getsempena.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-slate-50 lg:grid lg:grid-cols-[56fr_44fr]">
      <LoginVisual />

      <section
        className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-white px-6 py-10 sm:px-8 lg:py-12"
        aria-labelledby="login-heading"
      >
        {/* Soft ambient glow behind the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[460px]">
          <LoginPanelEntrance>
            {/* Header lockup */}
            <LoginPanelItem>
              <div className="mb-6 flex items-center gap-2.5">
                <Image
                  src="/logo-ubbg.svg"
                  alt="Logo Universitas Bina Bangsa Getsempena"
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-10"
                />
                <span className="text-[16px] font-bold tracking-tight text-slate-900">
                  SIM-LKPS
                </span>
              </div>
            </LoginPanelItem>

            <LoginPanelItem>
              <p className="mb-7 text-[13.5px] leading-relaxed text-slate-500">
                Sistem Informasi Manajemen Laporan Kinerja Program Studi Ilmu
                Komputer
              </p>
            </LoginPanelItem>

            <LoginPanelItem>
              <h1
                id="login-heading"
                className="text-[24px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[26px]"
              >
                Masuk ke akun Anda
              </h1>
            </LoginPanelItem>

            {/* Card — heavier entrance (scale + translate) */}
            <LoginPanelItem variant="card">
              <div
                className="mt-6 rounded-3xl border border-slate-200/70 p-7 sm:p-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,255,0.85) 100%)",
                  boxShadow:
                    "0 24px 60px -16px rgba(15,23,42,0.12), 0 1px 0 rgba(255,255,255,0.95) inset",
                }}
              >
                <ErrorBoundary>
                  <LoginForm />
                </ErrorBoundary>
              </div>
            </LoginPanelItem>

            {/* Footer */}
            <LoginPanelItem>
              <p className="mt-6 text-center text-[12px] text-slate-500">
                © 2024 Universitas Bina Bangsa Getsempena | SIM-LKPS
              </p>
            </LoginPanelItem>
          </LoginPanelEntrance>
        </div>
      </section>
    </main>
  );
}
