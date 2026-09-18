"use client";

import { useState, useTransition } from "react";
import { Loader2, Lock, LockOpen, Trash2, AlertTriangle } from "lucide-react";
import { finalisasiSesi, bukaKembaliSesi, resetSesi } from "@/lib/actions/penilaian";

type Props = {
  finalisasi: boolean;
  lengkap: boolean;
  jumlahKosong: number;
  /** ADMIN saja. */
  bolehFinalisasi: boolean;
};

/** Tombol finalisasi / buka kembali / reset + blokir kalau belum lengkap. */
export function AksiFinalisasi({ finalisasi, lengkap, jumlahKosong, bolehFinalisasi }: Props) {
  const [pending, startTransition] = useTransition();
  const [galat, setGalat] = useState<string | null>(null);
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);

  if (!bolehFinalisasi) {
    return finalisasi ? (
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700">
        <Lock className="w-3.5 h-3.5" /> Sudah difinalisasi
      </span>
    ) : null;
  }

  const jalankan = (fn: () => Promise<unknown>) => {
    setGalat(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setGalat(e instanceof Error ? e.message : "Gagal memproses.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {finalisasi ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => jalankan(() => bukaKembaliSesi())}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LockOpen className="w-3.5 h-3.5" />}
            Buka kembali
          </button>
        ) : (
          <button
            type="button"
            disabled={pending || !lengkap}
            title={!lengkap ? `${jumlahKosong} butir belum dinilai` : "Kunci penilaian & simpan status"}
            onClick={() => jalankan(() => finalisasiSesi({}))}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            Finalisasi
          </button>
        )}

        {konfirmasiReset ? (
          <span className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
            <span className="text-2xs font-bold text-red-700">Hapus semua skor?</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setKonfirmasiReset(false);
                jalankan(() => resetSesi());
              }}
              className="text-2xs font-black text-red-700 underline cursor-pointer"
            >
              Ya, hapus
            </button>
            <button
              type="button"
              onClick={() => setKonfirmasiReset(false)}
              className="text-2xs font-semibold text-slate-500 cursor-pointer"
            >
              Batal
            </button>
          </span>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => setKonfirmasiReset(true)}
            title="Kosongkan seluruh skor sesi ini"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!lengkap && !finalisasi && (
        <span className="inline-flex items-center gap-1 text-2xs text-amber-700">
          <AlertTriangle className="w-3 h-3" />
          {jumlahKosong} butir belum dinilai — finalisasi terkunci
        </span>
      )}
      {galat && <span className="text-2xs text-red-600 max-w-xs text-right">{galat}</span>}
    </div>
  );
}
