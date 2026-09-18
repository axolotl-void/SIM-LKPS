"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Check, ExternalLink, Lock } from "lucide-react";
import { setSkor as simpanSkorAksi } from "@/lib/actions/penilaian";
import { SkorSelector, LegendaSkor } from "@/components/penilaian/SkorSelector";
import type { ButirLengkap } from "@/lib/utils/penilaian-query";
import { cn } from "@/lib/utils/format";

type Status = "idle" | "menyimpan" | "tersimpan" | "galat";

/**
 * Tabel butir satu kriteria dengan pemilih skor.
 *
 * Skor disimpan per butir (bukan sekali submit semua) supaya aman kalau
 * jaringan putus di tengah pengisian.
 */
export function KriteriaPenilaianClient({
  butir, readOnly, terkunci,
}: {
  butir: ButirLengkap[];
  readOnly: boolean;
  terkunci: boolean;
}) {
  const [skor, setSkorState] = useState<Record<string, number | null>>(
    Object.fromEntries(butir.map((b) => [b.id, b.skor])),
  );
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const ubah = (id: string, nilai: number | null) => {
    const lama = skor[id] ?? null;
    setSkorState((s) => ({ ...s, [id]: nilai }));
    setStatus((s) => ({ ...s, [id]: "menyimpan" }));
    setGalat((g) => {
      const { [id]: _buang, ...sisa } = g;
      return sisa;
    });

    startTransition(async () => {
      try {
        await simpanSkorAksi({ butirId: id, skor: nilai });
        setStatus((s) => ({ ...s, [id]: "tersimpan" }));
      } catch (e) {
        setSkorState((s) => ({ ...s, [id]: lama })); // kembalikan kalau server menolak
        setStatus((s) => ({ ...s, [id]: "galat" }));
        setGalat((g) => ({ ...g, [id]: e instanceof Error ? e.message : "Gagal menyimpan." }));
      }
    });
  };

  const dinilai = Object.values(skor).filter((v) => v !== null).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <span className="text-2xs font-bold text-slate-600">
            {dinilai}/{butir.length} butir dinilai
          </span>
          <LegendaSkor />
        </div>
        {(readOnly || terkunci) && (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-400">
            <Lock className="w-3 h-3" />
            {terkunci ? "Sudah difinalisasi" : "Hanya baca"}
          </span>
        )}
      </div>

      <ul className="divide-y divide-slate-100">
        {butir.map((b) => {
          const st = status[b.id] ?? "idle";
          return (
            <li key={b.id} className="px-4 py-3 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-3">
                <Link
                  href={`/penilaian/butir/${encodeURIComponent(b.kode)}`}
                  className="shrink-0 inline-flex items-center justify-center min-w-14 h-7 px-2 rounded-lg bg-slate-100 text-slate-600 text-2xs font-mono font-black hover:bg-violet-100 hover:text-violet-700 transition-colors"
                  title="Lihat deskriptor 4 level"
                >
                  {b.kode}
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">{b.elemenPenilaian}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                      {b.jenis}
                    </span>
                    <span className="text-2xs text-slate-400">bobot {b.bobot}</span>
                    {b.tahapPpepp && (
                      <span className="text-2xs text-slate-400">{b.tahapPpepp}</span>
                    )}
                    {st === "tersimpan" && (
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-600">
                        <Check className="w-3 h-3" /> tersimpan
                      </span>
                    )}
                    {st === "menyimpan" && (
                      <span className="inline-flex items-center gap-1 text-2xs text-violet-600">
                        <Loader2 className="w-3 h-3 animate-spin" /> menyimpan
                      </span>
                    )}
                    {st === "galat" && (
                      <span className="text-2xs text-red-600">{galat[b.id]}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <SkorSelector
                    nilai={skor[b.id] ?? null}
                    onChange={(n) => ubah(b.id, n)}
                    disabled={readOnly || terkunci || st === "menyimpan"}
                    ukuran="sm"
                    label={`Skor butir ${b.kode}`}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <Link
          href="/penilaian"
          className="inline-flex items-center gap-1.5 text-2xs font-semibold text-slate-500 hover:text-violet-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke ringkasan
        </Link>
        <Link
          href="/penilaian"
          className="inline-flex items-center gap-1.5 text-2xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
        >
          Lihat nilai akhir <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
