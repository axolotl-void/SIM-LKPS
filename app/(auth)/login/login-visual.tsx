"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Building2, Lock, ShieldCheck, Sparkles } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.03 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
};

const benefits = [
  {
    icon: Sparkles,
    title: "Terstruktur",
    desc: "Data LKPS terorganisir per BAB",
  },
  {
    icon: Lock,
    title: "Aman",
    desc: "Data terlindungi dan terpercaya",
  },
  {
    icon: ShieldCheck,
    title: "Akuntabel",
    desc: "Mendukung kinerja program studi",
  },
] as const;

export function LoginVisual() {
  const reduced = useReducedMotion() ?? false;
  const motionProps = reduced ? {} : { initial: "hidden" as const, animate: "show" as const };

  return (
    <aside
      aria-hidden
      className="relative isolate hidden min-h-screen overflow-hidden lg:block"
    >
      {/* Image layer */}
      <motion.div
        variants={reduced ? undefined : imageReveal}
        {...motionProps}
        className="absolute inset-0"
      >
        <Image
          src="/images/ubbg-campus.webp"
          alt="Gedung Universitas Bina Bangsa Getsempena"
          fill
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          quality={82}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Multi-stop navy gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,27,70,0.55) 0%, rgba(7,27,70,0.65) 40%, rgba(7,27,70,0.88) 100%)",
        }}
      />

      {/* Soft side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Subtle decorative dots */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at top right, black 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at top right, black 0%, transparent 65%)",
        }}
      />

      {/* Curved hairline ornament */}
      <svg
        className="absolute -bottom-10 left-0 h-48 w-full opacity-25"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,140 C200,80 400,180 600,120 C800,60 1000,160 1200,100"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0,170 C220,110 440,200 640,150 C840,100 1040,190 1200,140"
          stroke="rgba(124,58,237,0.35)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <motion.div
        variants={reduced ? undefined : container}
        {...motionProps}
        className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14"
      >
        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight">SIM-LKPS</p>
            <p className="text-[11.5px] text-white/65">UBBG · Akreditasi Prodi</p>
          </div>
        </motion.div>

        <motion.div
          variants={reduced ? undefined : container}
          className="max-w-[500px] space-y-7"
        >
          <motion.div variants={reduced ? undefined : item} className="space-y-4">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Sistem Informasi Manajemen
            </p>
            <h2 className="text-[28px] font-semibold leading-[1.18] tracking-tight text-white xl:text-[32px]">
              Sistem Informasi
              <br />
              Manajemen{" "}
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Laporan Kinerja
              </span>
              <br />
              Program Studi
            </h2>
            <p className="max-w-[440px] text-[14px] leading-relaxed text-white/75">
              Kelola seluruh tabel LKPS dengan mudah, akurat, dan terstruktur untuk
              mendukung akreditasi program studi.
            </p>
          </motion.div>

          <motion.div
            variants={reduced ? undefined : container}
            className="grid grid-cols-3 gap-3"
          >
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  variants={reduced ? undefined : item}
                  className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5 backdrop-blur-[2px]"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400/30 to-violet-500/30 ring-1 ring-white/15"
                    aria-hidden
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  <p className="mt-2.5 text-[12.5px] font-semibold text-white">{b.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/65">{b.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={reduced ? undefined : item}
          className="flex items-center gap-3 pt-2"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/15"
            aria-hidden
          >
            <Building2 className="h-4 w-4 text-white/80" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-white">
              Universitas Bina Bangsa Getsempena
            </p>
            <p className="text-[11.5px] text-white/65">Program Studi Ilmu Komputer</p>
          </div>
        </motion.div>
      </motion.div>
    </aside>
  );
}