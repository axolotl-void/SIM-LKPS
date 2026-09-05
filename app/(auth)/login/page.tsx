import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoginVisual } from "./login-visual";
import { LoginPanelEntrance, LoginPanelItem } from "./login-panel-entrance";
import { LoginShellClient } from "./login-shell-client";
import { LoginFormSection } from "./login-form-section";

export const metadata: Metadata = {
  title: "Masuk - SIM-LKPS",
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi, Universitas Bina Bangsa Getsempena.",
};

export default function LoginPage() {
  return (
    <LoginShellClient
      left={<LoginVisual />}
      right={
        <LoginFormSection>
          <LoginPanelEntrance>
            {/* Header lockup */}
            <LoginPanelItem>
              <div className="mb-6 flex items-center gap-2.5">
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

            {/* Card — plain bordered, no glassmorphism */}
            <LoginPanelItem variant="card">
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
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
        </LoginFormSection>
      }
    />
  );
}
