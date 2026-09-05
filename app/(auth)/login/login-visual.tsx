"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function LoginVisual() {
  const reduced = useReducedMotion() ?? false;
  const motionProps = reduced
    ? {}
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <aside
      aria-hidden
      className="relative hidden isolate min-h-[100dvh] overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-[#ede9fe] to-[#ddd6fe] lg:flex lg:flex-col"
    >
      {/* Background photo: gedung UBBG full-bleed behind everything */}
      <Image
        src="/img/gedung-ubbg_11zon.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="(min-width: 1024px) 56vw, 100vw"
        className="object-cover object-center"
      />

      {/* White overlay — softens the photo so it reads as ambient, not focal */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(245,243,255,0.65) 50%, rgba(221,214,254,0.78) 100%)",
        }}
      />

      {/* Ambient decorative blurs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-80 w-80 rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-violet-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-purple-100/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-fuchsia-100/50 blur-xl" />

      {/* Content — sits above background + overlay */}
      <motion.div
        variants={reduced ? undefined : stagger}
        {...motionProps}
        className="relative z-10 flex h-full flex-col justify-between gap-8 p-10 xl:p-14"
      >
        {/* Top: logo + 2 badges (no pulse dot) */}
        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-ubbg.svg"
              alt="Logo Universitas Bina Bangsa Getsempena"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-indigo-600 shadow-sm">
              Tahun Akademik 2026/2027
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1 text-[12px] font-semibold text-fuchsia-900 shadow-sm">
            <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2.4} />
            Akreditasi Unggul
          </div>
        </motion.div>

        {/* Middle: kartun + headline */}
        <div className="my-auto flex flex-col items-center justify-center gap-5 py-4">
          <motion.div variants={reduced ? undefined : item}>
            <StudentIllustration />
          </motion.div>

          <motion.div
            variants={reduced ? undefined : item}
            className="max-w-md text-center"
          >
            <h2 className="text-balance text-[26px] font-bold leading-tight tracking-tight text-indigo-950 xl:text-[30px]">
              Wujudkan Akreditasi Unggul,
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Mulai dari Data yang Akurat.
              </span>
            </h2>
            <p className="mt-3 text-pretty text-[13.5px] leading-relaxed text-slate-600">
              Kelola laporan kinerja program studi secara terpadu, transparan,
              dan siap audit setiap saat.
            </p>
          </motion.div>
        </div>

        {/* Bottom spacer (was micro-indicators — removed) */}
        <div className="h-2" />
      </motion.div>

      {/* === ORGANIC WAVE DIVIDER (left → right boundary) === */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -right-5 hidden h-full w-20 overflow-visible lg:block"
        viewBox="0 0 80 600"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="waveDropShadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow
              dx="-4"
              dy="0"
              floodColor="#4c1d95"
              floodOpacity="0.08"
              stdDeviation="5"
            />
          </filter>
        </defs>
        <path
          d="M50 0 C 15 110, 80 200, 35 320 C -10 440, 70 520, 40 600 L 80 600 L 80 0 Z"
          fill="#ffffff"
          fillOpacity="0.38"
        />
        <path
          d="M35 0 C 70 120, 10 230, 55 350 C 90 450, 15 530, 38 600 L 80 600 L 80 0 Z"
          fill="#ffffff"
          fillOpacity="0.75"
        />
        <path
          d="M22 0 C 58 130, -2 240, 42 360 C 76 460, 2 540, 25 600 L 80 600 L 80 0 Z"
          fill="#ffffff"
          filter="url(#waveDropShadow)"
        />
      </svg>

      {/* Floating particles along wave */}
      <div
        className="absolute top-16 right-3 h-2.5 w-2.5 rounded-full bg-indigo-500/70 shadow-sm"
        style={{ animation: "float-gentle 4s ease-in-out infinite" }}
        aria-hidden
      />
      <div
        className="absolute top-36 right-7 h-2 w-2 rounded-full bg-violet-500/80 shadow-sm"
        style={{ animation: "float-gentle 4s ease-in-out infinite", animationDelay: "1.2s" }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 right-4 flex h-3 w-3 items-center justify-center rounded-full border border-indigo-400/50 bg-white/80 shadow-sm"
        style={{ animation: "float-slow 7s ease-in-out infinite" }}
        aria-hidden
      >
        <span className="h-1 w-1 rounded-full bg-indigo-500" />
      </div>
      <div
        className="absolute top-2/3 right-8 h-2 w-2 rotate-45 border border-violet-400/60"
        style={{ animation: "float-slow 7s ease-in-out infinite", animationDelay: "2.1s" }}
        aria-hidden
      />
      <div
        className="absolute bottom-28 right-4 h-2 w-2 rounded-full bg-purple-300/90"
        style={{ animation: "float-gentle 4s ease-in-out infinite", animationDelay: "0.7s" }}
        aria-hidden
      />
      <div
        className="absolute bottom-12 right-8 h-1.5 w-1.5 rounded-full bg-indigo-400/60"
        style={{ animation: "float-gentle 4s ease-in-out infinite", animationDelay: "2.8s" }}
        aria-hidden
      />
    </aside>
  );
}

/**
 * Inline SVG illustration of a student working on a laptop with academic
 * motifs (books, graduation cap floating). Self-hosted, no external asset.
 * Style: flat illustration, indigo/violet palette to match login page theme.
 */
function StudentIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      className="h-44 w-auto xl:h-52"
      role="img"
      aria-label="Mahasiswa mengerjakan laporan LKPS di laptop"
    >
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
        <linearGradient id="laptopBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Floor circle (platform) */}
      <ellipse cx="160" cy="218" rx="120" ry="14" fill="url(#floorGrad)" />

      {/* Floating decorative dots */}
      <circle cx="42" cy="48" r="4" fill="#c4b5fd" />
      <circle cx="278" cy="62" r="3" fill="#a78bfa" />
      <circle cx="58" cy="92" r="2.5" fill="#ddd6fe" />
      <circle cx="288" cy="108" r="3.5" fill="#c4b5fd" />

      {/* Floating graduation cap top-right */}
      <g transform="translate(232, 22)">
        <path
          d="M0 12 L18 4 L36 12 L18 20 Z"
          fill="#4f46e5"
        />
        <path
          d="M10 14 L10 22 C10 25, 26 25, 26 22 L26 14"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="1.6"
        />
        <line x1="34" y1="13" x2="34" y2="22" stroke="#4f46e5" strokeWidth="1.4" />
        <circle cx="34" cy="23" r="1.6" fill="#fbbf24" />
      </g>

      {/* Stack of books left */}
      <g transform="translate(36, 158)">
        <rect x="0" y="20" width="56" height="10" rx="2" fill="#7c3aed" />
        <rect x="4" y="10" width="50" height="10" rx="2" fill="#a78bfa" />
        <rect x="2" y="0" width="52" height="10" rx="2" fill="#c4b5fd" />
        <line x1="6" y1="5" x2="50" y2="5" stroke="#fff" strokeWidth="1" />
        <line x1="6" y1="15" x2="48" y2="15" stroke="#fff" strokeWidth="1" />
        <line x1="6" y1="25" x2="50" y2="25" stroke="#fff" strokeWidth="1" />
      </g>

      {/* Desk */}
      <rect x="100" y="170" width="160" height="6" rx="2" fill="#a78bfa" />
      <line x1="108" y1="176" x2="108" y2="218" stroke="#a78bfa" strokeWidth="3" />
      <line x1="252" y1="176" x2="252" y2="218" stroke="#a78bfa" strokeWidth="3" />

      {/* Laptop */}
      <g transform="translate(132, 110)">
        {/* Screen */}
        <rect x="0" y="0" width="100" height="64" rx="4" fill="url(#laptopScreen)" />
        <rect x="4" y="4" width="92" height="56" rx="2" fill="#1e1b4b" />
        {/* Screen content — bar chart */}
        <rect x="10" y="38" width="8" height="14" rx="1" fill="#a78bfa" />
        <rect x="22" y="30" width="8" height="22" rx="1" fill="#a78bfa" />
        <rect x="34" y="22" width="8" height="30" rx="1" fill="#818cf8" />
        <rect x="46" y="26" width="8" height="26" rx="1" fill="#a78bfa" />
        <rect x="58" y="18" width="8" height="34" rx="1" fill="#818cf8" />
        <rect x="70" y="14" width="8" height="38" rx="1" fill="#c4b5fd" />
        <rect x="82" y="20" width="8" height="32" rx="1" fill="#818cf8" />
        {/* Base */}
        <rect x="-6" y="62" width="112" height="6" rx="3" fill="url(#laptopBase)" />
      </g>

      {/* Student body — sits behind laptop */}
      <g>
        {/* Head */}
        <circle cx="182" cy="86" r="14" fill="#fde7d2" />
        {/* Hair */}
        <path
          d="M168 84 C 168 72, 196 72, 196 84 L 196 80 C 196 70, 168 70, 168 80 Z"
          fill="#1e1b4b"
        />
        {/* Smile */}
        <path
          d="M178 90 Q 182 94, 186 90"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Eyes */}
        <circle cx="178" cy="84" r="1.5" fill="#1e1b4b" />
        <circle cx="186" cy="84" r="1.5" fill="#1e1b4b" />
        {/* Body / shirt */}
        <path
          d="M158 110 Q 158 100, 182 100 Q 206 100, 206 110 L 208 130 L 156 130 Z"
          fill="#6366f1"
        />
        {/* Arms reaching to laptop */}
        <path
          d="M158 116 Q 152 122, 146 130"
          fill="none"
          stroke="#fde7d2"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M206 116 Q 212 122, 218 130"
          fill="none"
          stroke="#fde7d2"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* Floating checkmark badge bottom-left near books */}
      <g transform="translate(86, 132)">
        <circle cx="0" cy="0" r="11" fill="#10b981" />
        <path
          d="M-5 0 L-1 4 L5 -3"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
