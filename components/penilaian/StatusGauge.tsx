"use client";

import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/format";
import {
  AMBANG, BOBOT_TOTAL, STATUS_META, RERATA_KUNCI_MIN, BUTIR_MIN,
  type StatusPrediksi,
} from "@/lib/utils/penilaian";

type Props = {
  nilaiAkhir: number;
  status: StatusPrediksi;
  syarat: { rerataOk: boolean; butirOk: boolean };
  /** Ada butir yang belum dinilai → tampilkan tanda "sementara". */
  sementara?: boolean;
  rerataKunci: Record<string, number | null>;
};

const WARNA_STATUS: Record<StatusPrediksi, string> = {
  TIDAK_TERAKREDITASI: "text-red-300",
  TERAKREDITASI: "text-amber-300",
  UNGGUL_3TH: "text-sky-300",
  UNGGUL_5TH: "text-emerald-300",
};

/**
 * Gauge nilai akhir 0–400 dengan 3 zona ambang resmi §V:
 * merah <200 · amber 200–320 · hijau ≥321.
 */
export function StatusGauge({ nilaiAkhir, status, syarat, sementara, rerataKunci }: Props) {
  const persen = Math.min(100, Math.max(0, (nilaiAkhir / BOBOT_TOTAL) * 100));
  const meta = STATUS_META[status];
  // 565 ≈ setengah keliling lingkaran r=180 (π × 180)
  const busur = 565;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-5 shadow-xl">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Gauge */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 400 230" className="w-56 h-32">
            {/* zona latar */}
            <path d={arc(180, 180, 130, 180, 200)} stroke="rgb(248 113 113 / 0.35)" strokeWidth="22" fill="none" strokeLinecap="round" />
            <path d={arc(180, 180, 130, 202, 320)} stroke="rgb(251 191 36 / 0.35)" strokeWidth="22" fill="none" />
            <path d={arc(180, 180, 130, 322, 360)} stroke="rgb(52 211 153 / 0.35)" strokeWidth="22" fill="none" strokeLinecap="round" />
            {/* nilai */}
            <path
              d={arc(180, 180, 130, 180, 360)}
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(persen / 100) * busur} ${busur}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
            <span className="text-3xl font-black text-white leading-none">
              {nilaiAkhir.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
            </span>
            <span className="text-2xs font-bold text-white/60 mt-1">dari {BOBOT_TOTAL}</span>
            {sementara && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-300/40 px-2 py-0.5 text-2xs font-bold text-amber-200">
                <AlertTriangle className="w-2.5 h-2.5" /> sementara
              </span>
            )}
          </div>
        </div>

        {/* Keterangan */}
        <div className="flex-1 min-w-0 w-full">
          <div className="text-white/60 text-2xs font-bold uppercase tracking-widest mb-1">
            Prediksi Status Akreditasi
          </div>
          <div className={cn("text-2xl font-black mb-1", WARNA_STATUS[status])}>{meta.label}</div>
          <p className="text-2xs text-white/60 mb-4">
            Penilaian Mandiri (simulasi) — bukan hasil resmi asesor.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Syarat
              ok={syarat.rerataOk}
              teks={`Rerata C1–C3 ≥ ${RERATA_KUNCI_MIN.toFixed(2).replace(".", ",")}`}
              detail={`C1 ${fmt(rerataKunci.C1)} · C2 ${fmt(rerataKunci.C2)} · C3 ${fmt(rerataKunci.C3)}`}
            />
            <Syarat
              ok={syarat.butirOk}
              teks={`Setiap butir C1–C3 ≥ ${BUTIR_MIN.toFixed(2).replace(".", ",")}`}
              detail="Syarat gelar Unggul"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Syarat({ ok, teks, detail }: { ok: boolean; teks: string; detail: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        ok ? "bg-emerald-500/15 border-emerald-400/40" : "bg-white/10 border-white/20",
      )}
    >
      <div className="flex items-center gap-1.5">
        {ok ? (
          <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        ) : (
          <X className="w-3.5 h-3.5 text-white/50 shrink-0" />
        )}
        <span className={cn("text-xs font-bold", ok ? "text-emerald-200" : "text-white/70")}>
          {teks}
        </span>
      </div>
      <div className="text-2xs text-white/50 mt-0.5 ml-5">{detail}</div>
    </div>
  );
}

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  return n.toFixed(2).replace(".", ",");
}

/** Busur lingkaran untuk gauge (derajat 180 = kiri, 360 = kanan). */
function arc(cx: number, cy: number, r: number, dari: number, sampai: number): string {
  const p = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = p(dari);
  const [x2, y2] = p(sampai);
  const besar = sampai - dari > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${besar} 1 ${x2} ${y2}`;
}
