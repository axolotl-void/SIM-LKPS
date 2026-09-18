"use client";

import { cn } from "@/lib/utils/format";
import { SKOR_LABEL } from "@/lib/utils/penilaian";

type Props = {
  nilai: number | null;
  onChange: (n: number | null) => void;
  disabled?: boolean;
  /** Ukuran tombol. */
  ukuran?: "sm" | "md";
  label?: string;
};

const SKOR = [1, 2, 3, 4] as const;

/**
 * Pemilih skor 1–4 sesuai deskriptor Matriks Penilaian.
 *
 * Kurang(1) · Cukup(2) · Baik(3) · Sangat Baik(4).
 * Pakai role="radiogroup" + navigasi panah kiri/kanan (a11y).
 */
export function SkorSelector({ nilai, onChange, disabled = false, ukuran = "md", label }: Props) {
  const geser = (arah: 1 | -1) => {
    if (disabled) return;
    const kini = nilai ?? 0;
    const baru = Math.min(4, Math.max(1, kini + arah));
    if (baru !== nilai) onChange(baru);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label ?? "Skor penilaian"}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          geser(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          geser(-1);
        }
      }}
      className="inline-flex items-center gap-1"
    >
      {SKOR.map((s) => {
        const aktif = nilai === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={aktif}
            aria-label={`${s} — ${SKOR_LABEL[s]}`}
            disabled={disabled}
            tabIndex={aktif || (nilai === null && s === 1) ? 0 : -1}
            onClick={() => onChange(aktif ? null : s)}
            title={`${s} — ${SKOR_LABEL[s]}`}
            className={cn(
              "rounded-lg border font-bold transition-all cursor-pointer",
              ukuran === "sm" ? "w-7 h-7 text-2xs" : "w-9 h-9 text-xs",
              aktif
                ? "bg-violet-600 border-violet-600 text-white shadow-sm scale-105"
                : "bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600",
              disabled && "opacity-60 cursor-not-allowed hover:border-slate-200 hover:text-slate-500",
            )}
          >
            {s}
          </button>
        );
      })}
      {nilai !== null && !disabled && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-1 text-2xs font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Kosongkan penilaian butir ini"
        >
          kosongkan
        </button>
      )}
    </div>
  );
}

/** Legenda skor untuk header tabel. */
export function LegendaSkor() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-slate-500">
      {SKOR.map((s) => (
        <span key={s} className="inline-flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-100 font-bold text-slate-600">
            {s}
          </span>
          {SKOR_LABEL[s]}
        </span>
      ))}
    </div>
  );
}
