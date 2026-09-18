"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { LedButirKartu } from "./LedButirKartu";
import type { LedBagianData } from "./types";
import { TAHAP_LABEL, TAHAP_URUTAN } from "@/lib/utils/led-progress";

type Props = {
  tahap: string;
  butir: LedBagianData[];
  readOnly?: boolean;
  defaultOpen?: boolean;
};

/** Accordion per tahap PPEPP (dipakai di halaman kriteria). */
export function LedAccordion({ tahap, butir, readOnly = false, defaultOpen = true }: Props) {
  const [buka, setBuka] = useState(defaultOpen);
  const id = `tahap-${tahap}`;
  const terisi = butir.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;
  const nomorTahap = TAHAP_URUTAN.indexOf(tahap as (typeof TAHAP_URUTAN)[number]) + 1;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-expanded={buka}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-slate-100/70 to-transparent hover:from-slate-200/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 text-slate-800 text-xs font-black">
            {nomorTahap > 0 ? nomorTahap : "•"}
          </span>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800">{TAHAP_LABEL[tahap] ?? tahap}</div>
            <div className="text-2xs text-slate-500">
              {terisi}/{butir.length} butir terisi
            </div>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", buka && "rotate-180")} />
      </button>

      {buka && (
        <div id={id} role="region" className="divide-y divide-slate-100">
          {butir.map((b) => (
            <LedButirKartu key={b.id} butir={b} readOnly={readOnly} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Daftar datar butir LED (tanpa accordion) — untuk BAB I, III, Kondisi Eksternal, Profil, Suplemen. */
export function LedBagianList({
  bagian,
  readOnly = false,
  denganNomor = true,
}: {
  bagian: LedBagianData[];
  readOnly?: boolean;
  denganNomor?: boolean;
}) {
  if (bagian.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
        Belum ada bagian untuk ditampilkan.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
      {bagian.map((b, i) => (
        <LedButirKartu
          key={b.id}
          butir={b}
          readOnly={readOnly}
          nomor={denganNomor && !b.subButir ? String(i + 1) : undefined}
        />
      ))}
    </div>
  );
}
