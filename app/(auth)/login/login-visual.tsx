"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GraduationCap } from "lucide-react";

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
};

export function LoginVisual() {
  const reduced = useReducedMotion() ?? false;
  const motionProps = reduced ? {} : { initial: "hidden" as const, animate: "show" as const };

  return (
    <aside
      aria-hidden
      className="relative isolate hidden min-h-screen overflow-hidden lg:block"
    >
      {/* Full-bleed photo */}
      <motion.div variants={reduced ? undefined : imageReveal} {...motionProps} className="absolute inset-0">
        <Image
          src="/images/ubbg-campus.webp"
          alt="Kampus Universitas Bina Bangsa Getsempena"
          fill
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          quality={85}
          className="object-cover"
        />
      </motion.div>

      {/* Readability scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,27,70,0.20) 0%, rgba(7,27,70,0.05) 40%, rgba(7,27,70,0.45) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={reduced ? undefined : item}
        {...motionProps}
        className="relative z-10 flex h-full flex-col justify-between p-12 text-white xl:p-16"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md ring-1 ring-white/30">
            <GraduationCap className="h-4.5 w-4.5 text-white" aria-hidden />
          </span>
          <p className="text-[14px] font-semibold tracking-tight">SIM-LKPS</p>
        </div>

        <div className="max-w-[420px] space-y-4">
          <h2 className="text-[42px] font-bold leading-[1.05] tracking-tight xl:text-[50px]">
            Akreditasi,{" "}
            <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-violet-200 bg-clip-text text-transparent">
              selesai.
            </span>
          </h2>
          <p className="text-[14px] leading-relaxed text-white/80 xl:text-[15px]">
            Sistem Informasi Manajemen Laporan Kinerja Program Studi untuk Program
            Studi Ilmu Komputer UBBG.
          </p>
          <div className="pt-3">
            <div className="h-px w-10 bg-white/40" />
            <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white/65">
              Universitas Bina Bangsa Getsempena
            </p>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
