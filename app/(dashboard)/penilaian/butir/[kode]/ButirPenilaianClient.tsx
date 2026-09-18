"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Check, Lock, Save } from "lucide-react";
import { setSkor as simpanSkorAksi } from "@/lib/actions/penilaian";
import { SkorSelector } from "@/components/penilaian/SkorSelector";
import { cn } from "@/lib/utils/format";

type Props = {
  butirId: string;
  kode: string;
  kriteria: string;
  skorAwal: number | null;
  catatanAwal: string | null;
  readOnly: boolean;
  terkunci: boolean;
};

/** Pemilih skor + catatan bukti untuk satu butir. */
export function ButirPenilaianClient({
  butirId, kode, kriteria, skorAwal, catatanAwal, readOnly, terkunci,
}: Props) {
  const [skor, setSkorState] = useState<number | null>(skorAwal);
  const [catatan, setCatatan] = useState(catatanAwal ?? "");
  const [status, setStatus] = useState<"idle" | "menyimpan" | "tersimpan" | "galat">("idle");
  const [galat, setGalat] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const terkunciTotal = readOnly || terkunci;

  const simpan = (nilai: number | null, catatanBaru?: string) => {
    setStatus("menyimpan");
    setGalat(null);
    startTransition(async () => {
      try {
        await simpanSkorAksi({
          butirId,
          skor: nilai,
          ...(catatanBaru !== undefined ? { catatanBukti: catatanBaru } : {}),
        });
        setStatus("tersimpan");
      } catch (e) {
        setStatus("galat");
        setGalat(e instanceof Error ? e.message : "Gagal menyimpan.");
      }
    });
  };

  const ubahSkor = (nilai: number | null) => {
    const lama = skor;
    setSkorState(nilai);
    startTransition(async () => {
      try {
        await simpanSkorAksi({ butirId, skor: nilai });
        setStatus("tersimpan");
      } catch (e) {
        setSkorState(lama);
        setStatus("galat");
        setGalat(e instanceof Error ? e.message : "Gagal menyimpan.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-slate-700">Beri skor butir ini</span>
        {(readOnly || terkunci) && (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-400">
            <Lock className="w-3 h-3" /> {terkunci ? "Sudah difinalisasi" : "Hanya baca"}
          </span>
        )}
      </div>

      <SkorSelector
        nilai={skor}
        onChange={ubahSkor}
        disabled={terkunciTotal}
        label={`Skor butir ${kode}`}
      />

      {/* catatan bukti */}
      <div className="mt-4">
        <label htmlFor={`catatan-${butirId}`} className="block text-2xs font-bold text-slate-600 mb-1">
          Catatan bukti
        </label>
        <textarea
          id={`catatan-${butirId}`}
          value={catatan}
          readOnly={terkunciTotal}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder={
            terkunciTotal
              ? "Belum ada catatan."
              : "Rujukan bukti/tautan dokumen pendukung penilaian butir ini (opsional)."
          }
          className={cn(
            "w-full rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed outline-none resize-y",
            "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
            terkunciTotal && "bg-slate-50 text-slate-500 cursor-not-allowed",
          )}
        />
        {!terkunciTotal && (
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              disabled={status === "menyimpan"}
              onClick={() => simpan(skor, catatan)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-2xs font-bold text-white hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-60"
            >
              {status === "menyimpan" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Simpan catatan
            </button>
            {catatan !== (catatanAwal ?? "") && status === "idle" && (
              <span className="text-2xs text-slate-400">Belum disimpan</span>
            )}
            {status === "tersimpan" && (
              <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-600">
                <Check className="w-3 h-3" /> tersimpan
              </span>
            )}
            {status === "galat" && <span className="text-2xs text-red-600">{galat}</span>}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/penilaian/kriteria/${kriteria}`}
          className="inline-flex items-center gap-1.5 text-2xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke daftar {kriteria}
        </Link>
      </div>
    </div>
  );
}
