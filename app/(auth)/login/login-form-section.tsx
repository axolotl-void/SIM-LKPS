import type { ReactNode } from "react";

/**
 * Right pane: blue fluid wave background (slides in from right on mount)
 * with the white liquid-glass login card positioned with right-padding.
 *
 * No replay controls, no client-side state — pure server-rendered shell.
 */
export function LoginFormSection({ children }: { children: ReactNode }) {
  return (
    <section
      className="relative h-full w-full pointer-events-none"
      aria-labelledby="login-heading"
    >
      {/* Blue fluid wave background */}
      <div className="animate-login-blue-bg pointer-events-none absolute top-0 right-0 z-0 h-full w-[64vw] min-w-[560px] max-w-[85vw] overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="loginFluidGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#f0f7ff" />
              <stop offset="25%" stopColor="#e0f2fe" />
              <stop offset="65%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
            <linearGradient id="loginWaveGrad1" x1="0%" x2="100%" y1="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="loginWaveGrad2" x1="100%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
            <filter
              id="loginSoftGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
            </filter>
            <clipPath id="loginFluidClip">
              <path
                d="M 230 0
                   C 295 140, 245 260, 165 380
                   C 75 510, 125 630, 215 750
                   C 265 810, 195 920, 65 1000
                   L 1000 1000
                   L 1000 0 Z"
              />
            </clipPath>
          </defs>
          <path
            d="M 210 0
               C 275 140, 225 260, 145 380
               C 55 510, 105 630, 195 750
               C 245 810, 175 920, 45 1000
               L 1000 1000
               L 1000 0 Z"
            fill="url(#loginFluidGrad)"
            filter="url(#loginSoftGlow)"
            opacity="0.45"
          />
          <path
            d="M 230 0
               C 295 140, 245 260, 165 380
               C 75 510, 125 630, 215 750
               C 265 810, 195 920, 65 1000
               L 1000 1000
               L 1000 0 Z"
            fill="url(#loginFluidGrad)"
          />
        </svg>

        <div className="absolute inset-0" style={{ clipPath: "url(#loginFluidClip)" }}>
          <div
            className="absolute inset-[-15%]"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 35% 25%, rgba(255,255,255,0.85) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 65%, rgba(59,130,246,0.45) 0%, transparent 75%), radial-gradient(ellipse 80% 70% at 30% 85%, rgba(147,197,253,0.58) 0%, transparent 75%), radial-gradient(circle at 60% 45%, rgba(186,230,254,0.65) 0%, transparent 60%)",
              filter: "blur(48px)",
              opacity: 0.95,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 45%, rgba(59,130,246,0.18) 75%, rgba(37,99,235,0.14) 100%)",
              backdropFilter: "blur(6px)",
            }}
          />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-65 mix-blend-overlay"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 120 180 C 350 280, 520 80, 750 240 C 890 340, 950 210, 1000 290 V 1000 H 60 C 190 920, 260 810, 210 750 C 120 630, 70 510, 160 380 Z"
              fill="url(#loginWaveGrad2)"
            />
            <path
              d="M 80 480 C 260 340, 450 680, 740 520 C 920 420, 960 620, 1000 710 V 1000 H 60 Z"
              fill="url(#loginWaveGrad1)"
            />
          </svg>
        </div>
      </div>

      {/* Login card (slide-in from right) */}
      <div
        className="absolute z-20 my-auto flex w-full items-center justify-end px-4 sm:px-8 md:px-12 lg:px-14 xl:px-18 2xl:px-24"
        style={{
          paddingRight: "clamp(2rem, 7vw, 10rem)",
          top: 0,
          bottom: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <div className="pointer-events-auto w-full max-w-[min(440px,92vw)] 2xl:max-w-[500px]">
          <div className="animate-login-card w-full rounded-3xl border border-white/95 bg-white/92 p-6 shadow-[0_20px_50px_rgba(37,99,235,0.15),0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-2xl ring-1 ring-blue-200/50 sm:p-7 xl:p-8 2xl:p-10">
            <div className="login-card-content">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
