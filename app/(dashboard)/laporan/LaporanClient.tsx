"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  File,
  Loader2,
  BarChart3,
  Shield,
  GraduationCap,
  FlaskConical,
  Users,
  CircleCheck,
  Eye,
  Package,
} from "lucide-react";

/**
 * Halaman Laporan & Export.
 *
 * CATATAN ISTILAH: kode ini masih memakai nama variabel `bab*` (dari format lama
 * BAN-PT), tapi SEMUA yang dilihat pengguna memakai istilah baru LAM INFOKOM 2.1
 * yaitu "Kriteria". Nama variabel sengaja tidak diganti supaya tidak menyentuh
 * parameter API export (`?bab=`).
 *
 * UKURAN TEKS: sebelumnya label tombol disembunyikan di layar kecil
 * (`hidden sm:inline`) sehingga di jendela sempit tombol export hanya berupa
 * ikon tanpa keterangan — inilah keluhan "font kecil / tidak kelihatan".
 * Sekarang label selalu tampil, dan teks terkecil di halaman ini 14px (text-sm).
 */

interface BabStats {
  num: number;
  title: string;
  tableCount: number;
  filled: number;
  disetujui: number;
  diajukan: number;
}

interface GlobalStats {
  totalTables: number;
  filledTables: number;
  approvedTables: number;
  pendingTables: number;
  rejectedTables: number;
}

interface LaporanClientProps {
  tahunAkademik: string | null;
  prodi: string | null;
  globalStats: GlobalStats;
  babStats: BabStats[];
}

const KRITERIA_ICONS: Record<number, React.ElementType> = {
  1: Shield,
  2: GraduationCap,
  3: FlaskConical,
  4: Users,
  5: CircleCheck,
  6: Eye,
};

const FORMAT_INFO = {
  excel: { label: "Excel", ext: "xlsx", icon: FileSpreadsheet, btn: "bg-emerald-600 hover:bg-emerald-700" },
  word: { label: "Word", ext: "docx", icon: FileText, btn: "bg-blue-600 hover:bg-blue-700" },
  pdf: { label: "PDF", ext: "pdf", icon: File, btn: "bg-rose-600 hover:bg-rose-700" },
} as const;

type Format = keyof typeof FORMAT_INFO;

export function LaporanClient({ tahunAkademik, prodi, globalStats, babStats }: LaporanClientProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (kriteria: number | "all", format: Format) => {
    setExporting(`${kriteria}-${format}`);

    try {
      const params = new URLSearchParams({ format });
      params.set("bab", kriteria === "all" ? "all" : String(kriteria));

      const response = await fetch(`/api/export?${params.toString()}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const label = kriteria === "all" ? "Semua-Kriteria" : `Kriteria-${kriteria}`;
      const tanggal = new Date().toISOString().split("T")[0];
      const filename = `SIM-LKPS_${label}_${tanggal}.${FORMAT_INFO[format].ext}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export. Silakan coba lagi.");
    } finally {
      setExporting(null);
    }
  };

  const adaTahun = Boolean(tahunAkademik);

  return (
    <div className="space-y-6">
      {/* ── Kepala halaman ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan &amp; Export</h1>
              <p className="mt-1 text-sm text-slate-600">
                {tahunAkademik ? `${tahunAkademik} — ${prodi || "Program Studi"}` : "Tahun akademik belum diatur"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <RingkasChip label="Terisi" nilai={`${globalStats.filledTables}/${globalStats.totalTables}`} tone="emerald" />
            <RingkasChip label="Disetujui" nilai={globalStats.approvedTables} tone="indigo" />
            <RingkasChip label="Menunggu" nilai={globalStats.pendingTables} tone="amber" />
            <RingkasChip label="Ditolak" nilai={globalStats.rejectedTables} tone="rose" />
          </div>
        </div>
      </div>

      {/* ── Aksi utama: unduh semuanya ─────────────────────────────── */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export Laporan Lengkap</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Semua {globalStats.totalTables} tabel LKPS (Kriteria 1–6) dalam satu berkas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Object.keys(FORMAT_INFO) as Format[]).map((format) => {
              const info = FORMAT_INFO[format];
              const sedang = exporting === `all-${format}`;
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() => handleExport("all", format)}
                  disabled={sedang || !adaTahun}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${info.btn}`}
                >
                  {sedang ? <Loader2 className="h-5 w-5 animate-spin" /> : <info.icon className="h-5 w-5" />}
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {!adaTahun && (
          <p className="mt-4 text-sm font-medium text-amber-700">
            Tombol export nonaktif karena belum ada tahun akademik yang aktif.
          </p>
        )}
      </div>

      {/* ── Export per kriteria ────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Export per Kriteria</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Unduh satu kriteria saja, misalnya untuk dikirim ke penguji bagian tertentu
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {babStats.map((bab) => {
            const Icon = KRITERIA_ICONS[bab.num] || Shield;
            const tileNum = KRITERIA_ICONS[bab.num] ? bab.num : 1;
            const persentase = bab.tableCount > 0 ? Math.round((bab.filled / bab.tableCount) * 100) : 0;

            return (
              <div
                key={bab.num}
                className={`bab-card-${tileNum} flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="bab-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Kriteria {bab.num} — {bab.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {bab.filled} dari {bab.tableCount} tabel terisi
                      <span className="ml-2 font-semibold text-slate-800">{persentase}%</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="bab-bar h-full rounded-full transition-all duration-500"
                    style={{ width: `${persentase}%` }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
                  {(Object.keys(FORMAT_INFO) as Format[]).map((format) => {
                    const info = FORMAT_INFO[format];
                    const sedang = exporting === `${bab.num}-${format}`;
                    return (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleExport(bab.num, format)}
                        disabled={sedang || !adaTahun}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${info.btn}`}
                      >
                        {sedang ? <Loader2 className="h-4 w-4 animate-spin" /> : <info.icon className="h-4 w-4" />}
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Ringkasan status per kriteria ──────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Ringkasan Status</h2>
          <p className="mt-0.5 text-sm text-slate-600">Jumlah tabel dan status verifikasi per kriteria</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm font-semibold text-slate-600">
                <th className="px-5 py-3">Kriteria</th>
                <th className="px-5 py-3 text-right">Tabel</th>
                <th className="px-5 py-3 text-right">Terisi</th>
                <th className="px-5 py-3 text-right">Disetujui</th>
                <th className="px-5 py-3 text-right">Menunggu</th>
              </tr>
            </thead>
            <tbody>
              {babStats.map((bab) => (
                <tr key={bab.num} className="border-t border-slate-100 text-sm text-slate-700">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {bab.num}. {bab.title}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{bab.tableCount}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{bab.filled}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-emerald-700">{bab.disetujui}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-amber-700">{bab.diajukan}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200 bg-slate-50 text-sm font-bold text-slate-900">
                <td className="px-5 py-3">Total</td>
                <td className="px-5 py-3 text-right tabular-nums">{globalStats.totalTables}</td>
                <td className="px-5 py-3 text-right tabular-nums">{globalStats.filledTables}</td>
                <td className="px-5 py-3 text-right tabular-nums">{globalStats.approvedTables}</td>
                <td className="px-5 py-3 text-right tabular-nums">{globalStats.pendingTables}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
};

function RingkasChip({ label, nilai, tone }: { label: string; nilai: string | number; tone: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${TONE[tone]}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-base font-bold tabular-nums">{nilai}</span>
    </div>
  );
}
