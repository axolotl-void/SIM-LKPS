"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  FileText,
  FileType2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import { ruteBagianLed } from "@/lib/utils/led-rute";

type BagianKosong = { kode: string; judul: string };

export type RingkasExport = {
  jumlahBagian: number;
  jumlahKosong: number;
  kosong: BagianKosong[];
  totalKarakter: number;
  estimasiHalaman: number;
  batasHalaman: number;
  lebihBatas: boolean;
  siap: boolean;
};

type Props = {
  ringkas: RingkasExport;
  /** URL siap pakai, sudah membawa ?tahun= kalau ada. */
  urlWord: string;
  urlPdf: string;
  jumlahCetak: number;
};

type Status = "diam" | "jalan" | "sukses" | "galat";

/** Dialog unduh LED: pratinjau kelengkapan + tombol Word/PDF. */
export function LedExportDialog({ ringkas, urlWord, urlPdf, jumlahCetak }: Props) {
  const [buka, setBuka] = useState(false);
  const [status, setStatus] = useState<Record<"word" | "pdf", Status>>({
    word: "diam",
    pdf: "diam",
  });
  const [galat, setGalat] = useState<Record<"word" | "pdf", string | null>>({
    word: null,
    pdf: null,
  });
  const [, startTransition] = useTransition();

  const unduh = (format: "word" | "pdf", url: string) => {
    setStatus((s) => ({ ...s, [format]: "jalan" }));
    setGalat((g) => ({ ...g, [format]: null }));

    // Unduhan lewat <a> tersembunyi: fetch+blob kehilangan nama berkas dari
    // Content-Disposition, dan dokumen bisa besar.
    startTransition(() => {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setStatus((s) => ({ ...s, [format]: "sukses" }));
        setTimeout(() => setStatus((s) => ({ ...s, [format]: "diam" })), 4000);
      } catch (e) {
        setStatus((s) => ({ ...s, [format]: "galat" }));
        setGalat((g) => ({
          ...g,
          [format]: e instanceof Error ? e.message : "Gagal mengunduh.",
        }));
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-soft-sm transition-colors hover:bg-violet-700 cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        Export Dokumen
      </button>

      {buka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBuka(false);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                  <Download className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Export Laporan Evaluasi Diri</h2>
                  <p className="text-2xs text-slate-500">
                    A4 · Arial 11 · spasi 1,15 · maks {ringkas.batasHalaman} halaman
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBuka(false)}
                aria-label="Tutup"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── ringkasan */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              <Kotak label="Bagian dicetak" nilai={jumlahCetak} />
              <Kotak
                label="Belum diisi"
                nilai={ringkas.jumlahKosong}
                peringatan={ringkas.jumlahKosong > 0}
              />
              <Kotak
                label="Estimasi halaman"
                nilai={ringkas.estimasiHalaman}
                peringatan={ringkas.lebihBatas}
              />
            </div>

            {/* ── peringatan */}
            {ringkas.lebihBatas && (
              <Peringatan warna="merah">
                Estimasi <strong>{ringkas.estimasiHalaman} halaman</strong> melewati batas{" "}
                {ringkas.batasHalaman} halaman (Lampiran 2). Ringkas narasi sebelum dikirim.
              </Peringatan>
            )}

            {ringkas.jumlahKosong > 0 && (
              <Peringatan warna="kuning">
                <strong>{ringkas.jumlahKosong} bagian belum diisi</strong> dan tidak ikut tercetak.
                <div className="mt-2 flex max-h-24 flex-wrap gap-1 overflow-y-auto">
                  {ringkas.kosong.slice(0, 30).map((b) => (
                    <Link
                      key={b.kode}
                      href={ruteBagianLed(b.kode)}
                      className="rounded-md border border-amber-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 transition-colors hover:border-amber-400"
                    >
                      {b.kode}
                    </Link>
                  ))}
                  {ringkas.kosong.length > 30 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-amber-700">
                      +{ringkas.kosong.length - 30} lagi
                    </span>
                  )}
                </div>
              </Peringatan>
            )}

            {ringkas.siap && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <p className="text-2xs text-emerald-800">
                  Semua bagian terisi dan estimasi halaman masih di bawah batas.
                </p>
              </div>
            )}

            {/* ── tombol format */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <TombolFormat
                label="Unduh Word (.docx)"
                keterangan="Arial 11 · siap diedit"
                ikon={<FileText className="h-4 w-4" />}
                status={status.word}
                galat={galat.word}
                onClick={() => unduh("word", urlWord)}
              />
              <TombolFormat
                label="Unduh PDF"
                keterangan="Helvetica · siap kirim"
                ikon={<FileType2 className="h-4 w-4" />}
                status={status.pdf}
                galat={galat.pdf}
                onClick={() => unduh("pdf", urlPdf)}
              />
            </div>

            {jumlahCetak === 0 && (
              <p className="mt-3 text-2xs text-amber-700">
                Belum ada narasi yang terisi — dokumen hanya berisi halaman muka dan daftar isi.
              </p>
            )}

            <p className="mt-4 border-t border-slate-100 pt-3 text-2xs text-slate-500">
              Unduhan tercatat di audit log.{" "}
              <Link
                href="/led"
                className="inline-flex items-center gap-0.5 font-semibold text-violet-600 hover:underline"
              >
                Kembali ke ringkasan LED
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Kotak({
  label,
  nilai,
  peringatan,
}: {
  label: string;
  nilai: number;
  peringatan?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div
        className={cn(
          "text-lg font-black",
          peringatan ? "text-amber-600" : "text-slate-800",
        )}
      >
        {nilai}
      </div>
    </div>
  );
}

function Peringatan({
  warna,
  children,
}: {
  warna: "merah" | "kuning";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex items-start gap-2 rounded-xl border px-3 py-2.5",
        warna === "merah"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="text-2xs">{children}</div>
    </div>
  );
}

function TombolFormat({
  label,
  keterangan,
  ikon,
  status,
  galat,
  onClick,
}: {
  label: string;
  keterangan: string;
  ikon: React.ReactNode;
  status: Status;
  galat: string | null;
  onClick: () => void;
}) {
  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={onClick}
        disabled={status === "jalan"}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer",
          "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <span className="text-slate-500">
          {status === "jalan" ? <Loader2 className="h-4 w-4 animate-spin" /> : ikon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-slate-800">
            {status === "sukses" ? "Terunduh" : label}
          </span>
          <span className="block text-[10px] text-slate-500">{keterangan}</span>
        </span>
        {status === "sukses" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
      </button>
      {galat && <p className="mt-1 text-[10px] text-red-600">{galat}</p>}
    </div>
  );
}
