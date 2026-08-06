"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import { DeveloperBadge } from "@/components/layout/developer-badge";

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

// Generate deterministic star positions so SSR + client match
function makeStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const size = 2 + ((seed >> 3) % 3);
    const delay = ((seed >> 5) % 100) / 100;
    const duration = 3 + ((seed >> 7) % 30) / 10;
    return { id: i, size, delay, duration };
  });
}

const STARS = makeStars(14);

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
};

const CONFETTI_COLORS = [
  "#60A5FA",
  "#818CF8",
  "#A78BFA",
  "#F472B6",
  "#38BDF8",
  "#34D399",
];

export function ProdiView({ items }: { items: ProdiItem[] }) {
  const reduced = useReducedMotion() ?? false;
  const motionProps = reduced
    ? {}
    : { initial: "hidden" as const, animate: "show" as const };
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const idRef = useRef(0);

  // Cleanup confetti
  useEffect(() => {
    if (confetti.length === 0) return;
    const t = setTimeout(() => setConfetti([]), 1100);
    return () => clearTimeout(t);
  }, [confetti]);

  function burstConfetti() {
    if (reduced) return;
    const next: ConfettiPiece[] = Array.from({ length: 18 }, () => {
      idRef.current += 1;
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 90;
      const color =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? "#60A5FA";
      return {
        id: idRef.current,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        angle: (Math.random() - 0.5) * 360,
        distance,
        color,
        size: 4 + Math.random() * 4,
      };
    });
    setConfetti(next);
  }

  return (
    <div className="space-y-4">
      {/* Developer badge (above the blue header) */}
      <DeveloperBadge />

      {/* Header */}
      <motion.header
        variants={reduced ? undefined : headerVariants}
        {...motionProps}
        onClick={burstConfetti}
        className="relative overflow-hidden rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            burstConfetti();
          }
        }}
        aria-label="Kotak info Program Studi. Tekan untuk efek confetti."
      >
        {/* Wave gradient layer 1 (pink) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.30) 0%, transparent 70%)",
          }}
          animate={
            reduced
              ? undefined
              : { scale: [1, 1.18, 1], opacity: [0.55, 0.95, 0.55] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Wave gradient layer 2 (sky) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.30) 0%, transparent 70%)",
          }}
          animate={
            reduced
              ? undefined
              : { scale: [1, 1.22, 1], opacity: [0.4, 0.85, 0.4] }
          }
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        {/* Wave gradient layer 3 (violet) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
          animate={
            reduced
              ? undefined
              : { x: [-12, 12, -12], opacity: [0.5, 0.8, 0.5] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Star field */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
          >
            {STARS.map((s) => (
              <motion.span
                key={s.id}
                className="absolute left-1/2 top-1/2 block rounded-full bg-white"
                style={{
                  width: s.size,
                  height: s.size,
                  marginLeft: -s.size / 2,
                  marginTop: -s.size / 2,
                  transform: `rotate(${s.id * 25}deg) translateY(-${18 + (s.id % 4) * 4}%) translateX(-${20 + (s.id % 5) * 4}%)`,
                }}
                animate={{
                  opacity: [0.15, 0.9, 0.15],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Confetti burst on click */}
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 block rounded-full"
              style={{
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                background: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [1, 1, 0],
                scale: 1,
                rotate: p.angle,
              }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>

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