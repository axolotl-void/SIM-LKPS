import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoginVisual } from "./login-visual";
import { LockBadge } from "./lock-badge";
import { SecurityFooter } from "./security-footer";

export const metadata: Metadata = {
  title: "Masuk - SIM-LKPS",
  description:
    "Sistem Informasi Manajemen Laporan Kinerja Program Studi, Universitas Bina Bangsa Getsempena.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden lg:grid lg:grid-cols-[56fr_44fr]">
      <LoginVisual />

      <section
        className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden px-6 py-10 sm:px-8 lg:py-12"
        aria-labelledby="login-heading"
      >
        {/* Layer 1: deep navy→indigo→violet base */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #0B2A6B 0%, #1E3A8A 38%, #3730A3 70%, #4C1D95 100%)",
          }}
        />

        {/* Layer 2: sky glow top-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.55) 0%, rgba(59,130,246,0.20) 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Layer 3: sky glow top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.45) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Layer 4: violet glow bottom-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.55) 0%, rgba(124,58,237,0.18) 45%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />

        {/* Layer 5: indigo glow bottom-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Layer 6: dot pattern top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-12 h-56 w-64"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            opacity: 0.5,
            maskImage:
              "radial-gradient(ellipse at top right, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top right, black 0%, transparent 70%)",
          }}
        />

        {/* Layer 7: dot pattern bottom-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-20 left-4 h-44 w-48"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            opacity: 0.45,
            maskImage:
              "radial-gradient(ellipse at bottom left, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at bottom left, black 0%, transparent 70%)",
          }}
        />

        {/* Layer 8: hairline grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.30]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />

        {/* Layer 9: SVG multi-wave bottom */}
        <svg
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 w-full"
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-a" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56,189,248,0)" />
              <stop offset="50%" stopColor="rgba(96,165,250,0.55)" />
              <stop offset="100%" stopColor="rgba(167,139,250,0)" />
            </linearGradient>
            <linearGradient id="wave-b" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(167,139,250,0)" />
              <stop offset="50%" stopColor="rgba(167,139,250,0.45)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,140 C200,80 400,180 600,120 C800,60 1000,160 1200,100 L1200,220 L0,220 Z"
            fill="url(#wave-a)"
            opacity="0.45"
          />
          <path
            d="M0,50 C240,130 480,50 720,100 C960,150 1080,70 1200,90"
            stroke="url(#wave-b)"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M0,90 C220,30 440,130 660,80 C880,30 1020,100 1200,70"
            stroke="url(#wave-a)"
            strokeWidth="1.1"
            fill="none"
          />
        </svg>

        {/* Layer 10: floating decorative rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[6%] top-[14%] h-44 w-44 rounded-full opacity-60"
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[8%] top-[16%] h-32 w-32 rounded-full opacity-50"
          style={{
            border: "1px dashed rgba(167,139,250,0.40)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[22%] right-[5%] h-40 w-40 rounded-full opacity-50"
          style={{
            border: "1px solid rgba(96,165,250,0.30)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[25%] right-[7%] h-24 w-24 rounded-full opacity-40"
          style={{
            border: "1px dashed rgba(255,255,255,0.20)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[520px]">
          {/* Mobile brand block */}
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.45)] ring-1 ring-blue-100"
              aria-hidden
            >
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z"
                />
              </svg>
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-white">
                SIM-LKPS
              </p>
              <p className="text-[11.5px] text-white/65">
                Universitas Bina Bangsa Getsempena
              </p>
            </div>
          </div>

          <div className="relative pt-12 sm:pt-14">
            <LockBadge />

            {/* Strong glow halo behind card */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -m-10 rounded-[44px]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.55) 0%, rgba(124,58,237,0.28) 45%, transparent 75%)",
                filter: "blur(50px)",
              }}
            />

            {/* Outer gradient ring (animated border) */}
            <div
              className="relative rounded-[32px] p-[1.5px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(96,165,250,0.95) 0%, rgba(139,92,246,0.85) 40%, rgba(217,70,239,0.55) 100%)",
                boxShadow:
                  "0 32px 64px -20px rgba(15,23,42,0.55), 0 16px 40px -12px rgba(124,58,237,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="relative rounded-[30.5px] p-6 sm:p-9"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,255,0.94) 100%)",
                  backdropFilter: "blur(18px) saturate(170%)",
                  WebkitBackdropFilter: "blur(18px) saturate(170%)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.95) inset, 0 2px 6px rgba(15,23,42,0.06) inset",
                }}
              >
                {/* Inner top highlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
                  }}
                />

                {/* Header strip with accent gradient + wave */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5 overflow-hidden rounded-t-[30.5px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #60A5FA 0%, #818CF8 35%, #A78BFA 65%, #F472B6 100%)",
                  }}
                />

                {/* Decorative corner ornament (top-right) */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-4 h-12 w-12 opacity-55"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <circle cx="40" cy="8" r="2" fill="rgba(99,102,241,0.7)" />
                  <circle cx="32" cy="8" r="1.2" fill="rgba(139,92,246,0.6)" />
                  <circle cx="40" cy="16" r="1.2" fill="rgba(56,189,248,0.6)" />
                  <path
                    d="M8 8 L24 8 M8 8 L8 24"
                    stroke="rgba(99,102,241,0.5)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Decorative corner ornament (bottom-left) */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 left-4 h-12 w-12 opacity-55"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <circle cx="8" cy="40" r="2" fill="rgba(139,92,246,0.6)" />
                  <circle cx="16" cy="40" r="1.2" fill="rgba(99,102,241,0.6)" />
                  <circle cx="8" cy="32" r="1.2" fill="rgba(56,189,248,0.6)" />
                  <path
                    d="M40 40 L24 40 M40 40 L40 24"
                    stroke="rgba(139,92,246,0.5)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>

                <header className="mb-7 mt-1">
                  <h1
                    id="login-heading"
                    className="text-[26px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[28px]"
                  >
                    Selamat Datang{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      Kembali
                    </span>
                  </h1>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                    Masuk untuk melanjutkan pengelolaan data LKPS.
                  </p>
                </header>

                <ErrorBoundary>
                  <LoginForm />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          <SecurityFooter />
        </div>
      </section>
    </main>
  );
}