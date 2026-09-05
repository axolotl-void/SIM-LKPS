"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Cloud,
  Lock,
} from "lucide-react";

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

      {/* Live data stream accent lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <div
          className="absolute top-1/4 left-6 h-[2px] w-32 origin-left bg-gradient-to-r from-transparent via-indigo-600/40 to-transparent"
          style={{ animation: "pulse-stream 3s ease-in-out infinite" }}
        />
        <div
          className="absolute top-2/3 left-16 h-[2px] w-44 origin-left bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          style={{ animation: "pulse-stream 3s ease-in-out infinite", animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-24 right-12 h-[2px] w-28 origin-left bg-gradient-to-r from-transparent via-purple-500/35 to-transparent"
          style={{ animation: "pulse-stream 3s ease-in-out infinite", animationDelay: "0.8s" }}
        />
      </div>

      {/* Content — sits above background + overlay */}
      <motion.div
        variants={reduced ? undefined : stagger}
        {...motionProps}
        className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14"
      >
        {/* Top: badges + logo */}
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
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Tahun Akademik 2023/2024
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1 text-[12px] font-semibold text-fuchsia-900 shadow-sm">
            <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2.4} />
            Akreditasi Unggul
          </div>
        </motion.div>

        {/* Middle: floating Evaluasi Terpadu card over background */}
        <div className="my-auto flex flex-col items-center justify-center py-6">
          <motion.div
            variants={reduced ? undefined : item}
            className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/60 bg-white/90 p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <BarChart3 className="h-[22px] w-[22px]" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-semibold text-slate-900">
                Evaluasi Terpadu
              </h3>
              <p className="truncate text-[12.5px] text-slate-500">
                Pemantauan &amp; Evaluasi Kinerja Akademik Terpadu
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom: micro-indicators */}
        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-center justify-between text-[11.5px] font-medium text-slate-600"
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </span>
            <Cloud className="h-4 w-4 text-indigo-600" strokeWidth={2} />
            <span>Real-time BAN-PT Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-violet-700" strokeWidth={2} />
            <span>Enkripsi Institusi SSL</span>
          </div>
        </motion.div>
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
        {/* Layer 1: subtle translucent outer glow */}
        <path
          d="M50 0 C 15 110, 80 200, 35 320 C -10 440, 70 520, 40 600 L 80 600 L 80 0 Z"
          fill="#ffffff"
          fillOpacity="0.38"
        />
        {/* Layer 2: medium soft wave */}
        <path
          d="M35 0 C 70 120, 10 230, 55 350 C 90 450, 15 530, 38 600 L 80 600 L 80 0 Z"
          fill="#ffffff"
          fillOpacity="0.75"
        />
        {/* Layer 3: solid seamless S-curve */}
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
