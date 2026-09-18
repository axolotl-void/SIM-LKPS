"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { LedEditor } from "./LedEditor";
import { LedEvidenceList } from "./LedEvidenceList";
import { LedStatusSelect } from "./LedStatusSelect";
import type { LedBagianData } from "./types";
import { statusKelas, statusMeta } from "./status";

/** Satu kartu butir LED: judul + status + petunjuk + editor + bukti. */
export function LedButirKartu({
  butir,
  readOnly,
  nomor,
}: {
  butir: LedBagianData;
  readOnly: boolean;
  /** Label pengganti sub-butir kalau kosong (mis. untuk daftar datar). */
  nomor?: string;
}) {
  const [petunjukBuka, setPetunjukBuka] = useState(true);
  const meta = statusMeta(butir.isian?.status ?? "KOSONG");
  const label = butir.subButir ?? nomor;

  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex gap-2 min-w-0">
          {label && (
            <span className="shrink-0 flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-black">
              {label}
            </span>
          )}
          <h4 className="text-sm font-semibold text-slate-800 leading-snug">{butir.judul}</h4>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span
            className={cn(
              "hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold border",
              statusKelas(butir.isian?.status),
            )}
          >
            {meta.label}
          </span>
          <LedStatusSelect
            bagianId={butir.id}
            statusAwal={butir.isian?.status ?? "KOSONG"}
            readOnly={readOnly}
          />
        </div>
      </div>

      {butir.petunjuk && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50/70 overflow-hidden">
          <button
            type="button"
            onClick={() => setPetunjukBuka((v) => !v)}
            aria-expanded={petunjukBuka}
            className="w-full flex items-center gap-2 px-3 py-2 text-2xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-violet-500" />
            Petunjuk instrumen
            <ChevronDown
              className={cn("w-3 h-3 ml-auto transition-transform", petunjukBuka && "rotate-180")}
            />
          </button>
          {petunjukBuka && (
            <p className="px-3 pb-3 text-xs leading-relaxed text-slate-600">{butir.petunjuk}</p>
          )}
        </div>
      )}

      <LedEditor
        bagianId={butir.id}
        nilaiAwal={butir.isian?.konten ?? ""}
        updatedAtAwal={butir.isian?.updatedAt ?? null}
        readOnly={readOnly}
      />

      <LedEvidenceList
        bagianId={butir.id}
        evidence={butir.isian?.evidence ?? []}
        readOnly={readOnly}
      />

      {butir.batasHalaman && (
        <p className="mt-2 text-2xs text-slate-400">
          Batas resmi bagian ini: maks {butir.batasHalaman} halaman.
        </p>
      )}
    </div>
  );
}
