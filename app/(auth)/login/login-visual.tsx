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
      className="relative hidden isolate min-h-[100dvh] overflow-hidden bg-slate-50 lg:flex lg:flex-col"
    >
      {/* Background photo: gedung UBBG full-bleed, low contrast */}
      <Image
        src="/img/gedung-ubbg_11zon.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="(min-width: 1024px) 56vw, 100vw"
        className="object-cover object-center opacity-[0.18]"
      />

      {/* Subtle horizontal hairline rule at top (no decorative blurs, no AI-slop glow) */}
      <div
        aria-hidden
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"
      />

      {/* Content */}
      <motion.div
        variants={reduced ? undefined : stagger}
        {...motionProps}
        className="relative z-10 flex h-full flex-col justify-between gap-12 p-12 xl:p-16"
      >
        {/* Top: logo + academic year */}
        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-center justify-between"
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
            <span className="text-[14px] font-semibold tracking-tight text-slate-900">
              SIM-LKPS
            </span>
          </div>
          <span className="text-[12px] font-medium tracking-wider text-slate-500 uppercase">
            2026 / 2027
          </span>
        </motion.div>

        {/* Middle: editorial headline + abstract data illustration */}
        <div className="my-auto flex flex-col gap-10">
          <motion.div variants={reduced ? undefined : item} className="max-w-md">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Program Studi Ilmu Komputer
            </p>
            <h2 className="text-balance text-[34px] font-semibold leading-[1.1] tracking-tight text-slate-900 xl:text-[40px]">
              Laporan Kinerja Program Studi,
              <span className="block text-slate-600">
                terstruktur dan siap audit.
              </span>
            </h2>
            <p className="mt-5 max-w-[36ch] text-pretty text-[14px] leading-relaxed text-slate-600">
              Sistem terintegrasi untuk mengelola seluruh tabel LKPS sesuai
              standar BAN-PT, dengan workflow validasi yang tercatat.
            </p>
          </motion.div>

          <motion.div
            variants={reduced ? undefined : item}
            className="flex items-center gap-6"
          >
            <DataIllustration />
            <div className="flex flex-col gap-3 text-[13px]">
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                <span>31 tabel LKPS</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                <span>Workflow validasi 4 tahap</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                <span>Audit log otomatis</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: institutional footer */}
        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-end justify-between border-t border-slate-200/80 pt-6 text-[12px] text-slate-500"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-slate-700" strokeWidth={2} />
            <span className="font-medium">Akreditasi Unggul</span>
          </div>
          <span>Universitas Bina Bangsa Getsempena</span>
        </motion.div>
      </motion.div>

      {/* Subtle vertical divider on right edge (no organic wave, no floating particles) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-slate-200/80"
      />
    </aside>
  );
}

/**
 * Minimalist data-driven illustration: a stacked bar chart and document
 * with a checkmark. Single-tone (slate-900) on light background. Reads as
 * editorial/financial-report, not playful or cartoonish.
 */
function DataIllustration() {
  return (
    <svg
      viewBox="0 0 120 96"
      className="h-24 w-30 shrink-0 xl:h-28"
      role="img"
      aria-label="Ilustrasi data tabel LKPS"
      fill="none"
    >
      {/* Document outline */}
      <rect
        x="6"
        y="6"
        width="58"
        height="78"
        rx="2"
        stroke="#0f172a"
        strokeWidth="1.4"
        fill="#ffffff"
      />
      {/* Document header lines */}
      <rect x="14" y="14" width="34" height="3" rx="1.5" fill="#0f172a" />
      <rect x="14" y="22" width="22" height="2" rx="1" fill="#94a3b8" />
      {/* Table rows */}
      <line x1="14" y1="34" x2="56" y2="34" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="14" y="40" width="20" height="2" rx="1" fill="#cbd5e1" />
      <rect x="38" y="40" width="12" height="2" rx="1" fill="#cbd5e1" />
      <rect x="14" y="48" width="24" height="2" rx="1" fill="#cbd5e1" />
      <rect x="42" y="48" width="8" height="2" rx="1" fill="#cbd5e1" />
      <line x1="14" y1="56" x2="56" y2="56" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="14" y="62" width="18" height="2" rx="1" fill="#cbd5e1" />
      <rect x="36" y="62" width="14" height="2" rx="1" fill="#cbd5e1" />
      <rect x="14" y="70" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="40" y="70" width="10" height="2" rx="1" fill="#cbd5e1" />

      {/* Bar chart card (overlapping bottom-right) */}
      <rect
        x="56"
        y="44"
        width="58"
        height="46"
        rx="2"
        stroke="#0f172a"
        strokeWidth="1.4"
        fill="#ffffff"
      />
      <rect x="62" y="50" width="22" height="2.5" rx="1.25" fill="#0f172a" />
      {/* Bars */}
      <rect x="62" y="80" width="6" height="6" rx="0.5" fill="#0f172a" />
      <rect x="72" y="74" width="6" height="12" rx="0.5" fill="#0f172a" />
      <rect x="82" y="68" width="6" height="18" rx="0.5" fill="#0f172a" />
      <rect x="92" y="62" width="6" height="24" rx="0.5" fill="#0f172a" />
      <rect x="102" y="72" width="6" height="14" rx="0.5" fill="#0f172a" />
      {/* Axis */}
      <line x1="60" y1="88" x2="112" y2="88" stroke="#0f172a" strokeWidth="1" />

      {/* Checkmark badge top-right corner of document */}
      <circle cx="64" cy="6" r="6" fill="#0f172a" />
      <path
        d="M60.5 6 L63 8.5 L67.5 4"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
