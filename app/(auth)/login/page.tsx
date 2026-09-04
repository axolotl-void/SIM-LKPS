import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoginVisual } from "./login-visual";

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
        className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden px-6 py-10 sm:px-8 lg:py-12"
        aria-labelledby="login-heading"
      >
        {/* Background dots - subtle pattern on right pane */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(99,102,241,0.18) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at top right, black 0%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top right, black 0%, transparent 65%)",
          }}
        />

        {/* Soft floating blob behind the card (liquid feel) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.20) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[440px]">
          <header className="mb-8">
            <h1
              id="login-heading"
              className="text-[26px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[28px]"
            >
              Selamat Datang{" "}
              <span className="text-blue-600">Kembali</span>
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
              Masuk untuk melanjutkan pengelolaan data LKPS.
            </p>
          </header>

          {/* Liquid glass card */}
          <div
            className="rounded-3xl border border-white/70 p-7 sm:p-9"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,250,255,0.65) 100%)",
              backdropFilter: "blur(24px) saturate(170%)",
              WebkitBackdropFilter: "blur(24px) saturate(170%)",
              boxShadow:
                "0 24px 60px -16px rgba(15,23,42,0.20), 0 1px 0 rgba(255,255,255,0.95) inset, 0 0 0 1px rgba(99,102,241,0.05)",
            }}
          >
            {/* Top hairline highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
              }}
            />

            <ErrorBoundary>
              <LoginForm />
            </ErrorBoundary>
          </div>

          <p className="mt-5 text-center text-[11.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Universitas Bina Bangsa Getsempena
          </p>
        </div>
      </section>

      {/* === CLOUD DIVIDER — SVG path that replaces straight line === */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[56%] hidden h-full w-24 -translate-x-1/2 lg:block"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Cloud-shaped edge: organic curves, multiple bumps */}
        <defs>
          <linearGradient id="cloudFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.0)" />
            <stop offset="25%" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="75%" stopColor="rgba(139,92,246,0.30)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.0)" />
          </linearGradient>
        </defs>

        {/* Soft halo blob behind the cloud */}
        <ellipse cx="50" cy="500" rx="35" ry="500" fill="url(#cloudFade)" />

        {/* Main cloud edge — multiple subtle bumps for organic feel */}
        <path
          d="M50,0
             C 65,80 35,160 50,240
             C 65,320 35,400 50,480
             C 65,560 35,640 50,720
             C 65,800 35,880 50,1000"
          stroke="rgba(99,102,241,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Secondary softer cloud trail (slightly offset) */}
        <path
          d="M50,40
             C 70,120 30,200 50,280
             C 70,360 30,440 50,520
             C 70,600 30,680 50,760
             C 70,840 30,920 50,1000"
          stroke="rgba(167,139,250,0.25)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 6"
          fill="none"
        />

        {/* Floating cloud blob 1 - top */}
        <g transform="translate(50,180)">
          <circle r="14" fill="rgba(99,102,241,0.10)" />
          <circle cx="-8" cy="-4" r="6" fill="rgba(255,255,255,0.9)" />
          <circle cx="6" cy="-6" r="5" fill="rgba(255,255,255,0.9)" />
        </g>

        {/* Floating cloud blob 2 - middle */}
        <g transform="translate(50,520)">
          <circle r="18" fill="rgba(139,92,246,0.10)" />
          <circle cx="-10" cy="-5" r="7" fill="rgba(255,255,255,0.9)" />
          <circle cx="8" cy="-7" r="6" fill="rgba(255,255,255,0.9)" />
          <circle cx="0" cy="6" r="5" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Floating cloud blob 3 - bottom */}
        <g transform="translate(50,840)">
          <circle r="12" fill="rgba(99,102,241,0.10)" />
          <circle cx="-7" cy="-3" r="5" fill="rgba(255,255,255,0.9)" />
          <circle cx="5" cy="-5" r="4" fill="rgba(255,255,255,0.9)" />
        </g>
      </svg>
    </main>
  );
}
