import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { warnaRerata, type RerataKriteria } from "@/lib/utils/penilaian";

/**
 * Bar per kriteria + rerata tertimbang.
 *
 * Ambient warna: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20.
 * Kriteria kunci (C1–C3) diberi penanda karena menentukan gelar Unggul.
 */
export function KriteriaBreakdown({ perKriteria }: { perKriteria: RerataKriteria[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <h2 className="text-sm font-bold text-slate-800">Rincian per Kriteria</h2>
        <p className="text-2xs text-slate-500 mt-0.5">
          Rerata tertimbang (Σ skor×bobot ÷ Σ bobot). Kriteria kunci menentukan gelar Unggul.
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {perKriteria.map((p) => (
          <li key={p.kriteria}>
            <Link
              href={`/penilaian/kriteria/${p.kriteria}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100/50 transition-colors group"
            >
              <span
                className={cn(
                  "shrink-0 inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-lg text-xs font-black",
                  p.kunci ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-500",
                )}
                title={p.kunci ? "Kriteria kunci penentu Unggul" : undefined}
              >
                {p.kriteria}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 truncate">{p.nama}</span>
                  {p.kunci && (
                    <span className="shrink-0 rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-black text-slate-800 uppercase">
                      kunci
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", barWarna(p.rerata))}
                      style={{ width: `${((p.rerata ?? 0) / 4) * 100}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-2xs text-slate-400 tabular-nums">
                    {p.jumlahTerisi}/{p.jumlahButir} butir
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className={cn("text-sm font-black tabular-nums", teksWarna(p.rerata))}>
                  {p.rerata === null ? "–" : p.rerata.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-2xs text-slate-400 tabular-nums">
                  bobot {p.bobot}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-slate-500">
        <span className="font-semibold">Warna rerata:</span>
        <span className="inline-flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt; 3,00
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 3,00 – 3,19
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> ≥ 3,20
        </span>
      </div>
    </div>
  );
}

function barWarna(r: number | null): string {
  switch (warnaRerata(r)) {
    case "merah": return "bg-red-400";
    case "amber": return "bg-amber-400";
    case "hijau": return "bg-emerald-500";
    default: return "bg-slate-200";
  }
}

function teksWarna(r: number | null): string {
  switch (warnaRerata(r)) {
    case "merah": return "text-red-600";
    case "amber": return "text-amber-600";
    case "hijau": return "text-emerald-600";
    default: return "text-slate-400";
  }
}

/** Grid kartu ringkas per kriteria (dipakai di halaman kriteria). */
export function KartuKriteriaRingkas({ perKriteria }: { perKriteria: RerataKriteria[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {perKriteria.map((p) => (
        <div key={p.kriteria} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-black text-slate-500">{p.kriteria}</span>
            <span className="text-2xs text-slate-400">{p.jumlahTerisi}/{p.jumlahButir}</span>
          </div>
          <div className={cn("text-lg font-black tabular-nums", teksWarna(p.rerata))}>
            {p.rerata === null ? "–" : p.rerata.toFixed(2).replace(".", ",")}
          </div>
          <div className="text-2xs text-slate-400 truncate">{p.nama}</div>
        </div>
      ))}
    </div>
  );
}
