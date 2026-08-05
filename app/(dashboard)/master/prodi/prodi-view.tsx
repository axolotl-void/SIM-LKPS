"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";

export interface ProdiItem {
  id: string;
  nama: string;
  kode: string;
  jenjang: string;
  isActive: boolean;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.06 },
  }),
};

const emptyVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProdiView({ items }: { items: ProdiItem[] }) {
  const reduced = useReducedMotion() ?? false;
  const motionProps = reduced
    ? {}
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        variants={reduced ? undefined : headerVariants}
        {...motionProps}
        className="relative overflow-hidden rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft"
      >
        {/* Subtle moving accent */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)",
          }}
          animate={
            reduced
              ? undefined
              : { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm"
            aria-hidden
          >
            <Building2 className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Program Studi</h1>
            <p className="mt-0.5 text-sm text-slate-300">
              {items.length} program studi terdaftar
            </p>
          </div>
        </div>
      </motion.header>

      {/* Grid */}
      <motion.div
        variants={reduced ? undefined : containerVariants}
        {...motionProps}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {items.map((prodi) => (
          <motion.article
            key={prodi.id}
            variants={reduced ? undefined : cardVariants}
            whileHover={
              reduced
                ? undefined
                : { y: -3, transition: { duration: 0.2, ease: "easeOut" } }
            }
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.12)]"
          >
            {/* hover-only accent gradient */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/0 to-rose-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,114,182,0.04) 0%, rgba(59,130,246,0.04) 100%)",
              }}
            />

            {/* shimmer line on top */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 transition-transform duration-500 group-hover:scale-x-100"
            />

            <div className="relative flex items-start gap-4">
              <motion.div
                variants={reduced ? undefined : iconVariants}
                className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm"
              >
                <Building2 className="h-6 w-6" />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl ring-1 ring-white/20"
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-800">{prodi.nama}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Kode: <span className="font-mono font-semibold">{prodi.kode}</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <motion.span
                    variants={reduced ? undefined : badgeVariants}
                    custom={0}
                    className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700"
                  >
                    {prodi.jenjang}
                  </motion.span>
                  {prodi.isActive && (
                    <motion.span
                      variants={reduced ? undefined : badgeVariants}
                      custom={1}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700"
                    >
                      <span
                        aria-hidden
                        className="relative flex h-1.5 w-1.5"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Aktif
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {items.length === 0 && (
        <motion.div
          variants={reduced ? undefined : emptyVariants}
          {...motionProps}
          className="rounded-2xl border-none bg-white p-12 text-center shadow-soft"
        >
          <motion.div
            aria-hidden
            animate={
              reduced
                ? undefined
                : { rotate: [0, 8, -8, 0] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Sparkles className="mx-auto h-12 w-12 text-slate-200" />
          </motion.div>
          <p className="mt-4 text-sm font-semibold text-slate-400">
            Belum ada program studi
          </p>
        </motion.div>
      )}
    </div>
  );
}