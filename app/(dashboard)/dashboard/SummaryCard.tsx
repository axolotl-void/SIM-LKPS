"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GraduationCap, BookOpen, Users } from "lucide-react";

interface SummaryCardProps {
  dosenAktif: number;
  mahasiswaAktif: number;
  mataKuliahAktif: number;
}

function clampNonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function useCountUp(target: number, durationMs = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const safe = clampNonNegative(target);
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * safe));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

function StatRow({
  icon: Icon,
  label,
  value,
  tone,
  delay = 0,
  reduced,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "indigo" | "sky" | "violet";
  delay?: number;
  reduced: boolean;
}) {
  const animated = useCountUp(value, 600);
  const display = reduced ? clampNonNegative(value) : animated;
  const toneStyles: Record<typeof tone, { bg: string; ring: string; text: string }> = {
    indigo: { bg: "bg-indigo-50", ring: "ring-indigo-100", text: "text-indigo-600" },
    sky: { bg: "bg-sky-50", ring: "ring-sky-100", text: "text-sky-600" },
    violet: { bg: "bg-violet-50", ring: "ring-violet-100", text: "text-violet-600" },
  };
  const s = toneStyles[tone];

  const variants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay } },
  };

  return (
    <motion.div
      variants={reduced ? undefined : variants}
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "show"}
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
    >
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${s.bg} ${s.ring}`}
        aria-hidden
      >
        <Icon className={`h-4 w-4 ${s.text}`} />
      </span>
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-slate-500">{label}</span>
        <span className="text-[15px] font-bold tabular-nums text-slate-900">{display}</span>
      </div>
    </motion.div>
  );
}

export function SummaryCard({ dosenAktif, mahasiswaAktif, mataKuliahAktif }: SummaryCardProps) {
  const reduced = useReducedMotion() ?? false;

  const d = clampNonNegative(dosenAktif);
  const m = clampNonNegative(mahasiswaAktif);
  const k = clampNonNegative(mataKuliahAktif);
  const total = d + m + k;

  const totalAnimated = useCountUp(total, 700);
  const totalDisplay = reduced ? total : totalAnimated;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  const circleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
  };

  return (
    <motion.section
      aria-labelledby="ringkasan-akademik-title"
      variants={reduced ? undefined : cardVariants}
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "show"}
      className="rounded-2xl border border-slate-100 bg-white"
      style={{
        boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.04)",
      }}
    >
      <header className="border-b border-slate-100 px-4 py-3.5">
        <h3
          id="ringkasan-akademik-title"
          className="text-[14px] font-semibold tracking-tight text-slate-900"
        >
          Ringkasan Data Akademik
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-400">Data aktif dari database</p>
      </header>

      <div className="p-4">
        <div className="flex items-center gap-4">
          <motion.div
            variants={reduced ? undefined : circleVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "show"}
            className="relative flex h-[120px] w-[120px] flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #818CF8 55%, #A78BFA 100%)",
              boxShadow: "0 8px 20px rgba(99,102,241,0.22), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
            aria-label="Total entri akademik"
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18) 0%, transparent 55%)",
              }}
              aria-hidden
            />
            <div className="relative text-center text-white">
              <div className="text-[28px] font-bold leading-none tabular-nums tracking-tight">
                {totalDisplay}
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/85">
                Total Entri Akademik
              </div>
            </div>
          </motion.div>

          <div className="flex flex-1 flex-col gap-1">
            <StatRow
              icon={GraduationCap}
              label="Dosen Aktif"
              value={d}
              tone="indigo"
              delay={0.15}
              reduced={reduced}
            />
            <StatRow
              icon={Users}
              label="Mahasiswa Aktif"
              value={m}
              tone="sky"
              delay={0.25}
              reduced={reduced}
            />
            <StatRow
              icon={BookOpen}
              label="Mata Kuliah Aktif"
              value={k}
              tone="violet"
              delay={0.35}
              reduced={reduced}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white"
      style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.04)" }}
      aria-hidden
    >
      <div className="border-b border-slate-100 px-4 py-3.5">
        <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
        <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="flex items-center gap-4 p-4">
        <div className="h-[120px] w-[120px] flex-shrink-0 animate-pulse rounded-full bg-slate-100" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function SummaryCardError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      className="rounded-2xl border border-red-100 bg-white p-4"
      style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.04)" }}
      role="alert"
    >
      <div className="text-[13px] font-semibold text-slate-900">Gagal memuat ringkasan</div>
      <p className="mt-1 text-[12px] text-slate-500">
        Data akademik tidak dapat ditampilkan. Coba segarkan halaman.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}