"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  File,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  Shield,
  GraduationCap,
  FlaskConical,
  Users,
  CircleCheck,
  Eye,
} from "lucide-react";

interface BABStats {
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
  babStats: BABStats[];
}

const BAB_ICONS: Record<number, React.ElementType> = {
  1: Shield,
  2: GraduationCap,
  3: FlaskConical,
  4: Users,
  5: CircleCheck,
  6: Eye,
};

export function LaporanClient({
  tahunAkademik,
  prodi,
  globalStats,
  babStats,
}: LaporanClientProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (bab: number | "all", format: "excel" | "word" | "pdf") => {
    setExporting(`${bab}-${format}`);

    try {
      const params = new URLSearchParams({ format });
      if (bab !== "all") {
        params.set("bab", String(bab));
      } else {
        params.set("bab", "all");
      }

      const response = await fetch(`/api/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const ext = format === "excel" ? "xlsx" : format === "word" ? "docx" : "pdf";
      const babLabel = bab === "all" ? "FullReport" : `BAB-${bab}`;
      const filename = `SIM-LKPS_${babLabel}_${new Date().toISOString().split("T")[0]}.${ext}`;

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

  const formatIcon = (format: "excel" | "word" | "pdf") => {
    const icons = {
      excel: { icon: FileSpreadsheet, color: "bg-emerald-500 hover:bg-emerald-600" },
      word: { icon: FileText, color: "bg-blue-500 hover:bg-blue-600" },
      pdf: { icon: File, color: "bg-red-500 hover:bg-red-600" },
    };
    return icons[format];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Laporan & Export</h1>
            <p className="text-white/80 text-sm">
              {tahunAkademik ? `${tahunAkademik} - ${prodi || "Prodi"}` : "Tahun akademik belum diatur"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Tabel" value={globalStats.totalTables} icon={FileText} color="#6366F1" />
        <StatCard label="Terisi" value={globalStats.filledTables} icon={CheckCircle2} color="#10B981" />
        <StatCard label="Disetujui" value={globalStats.approvedTables} icon={CheckCircle2} color="#059669" />
        <StatCard label="Menunggu" value={globalStats.pendingTables} icon={Clock} color="#F59E0B" />
        <StatCard label="Ditolak" value={globalStats.rejectedTables} icon={XCircle} color="#EF4444" />
      </div>

      {/* BAB Export Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Export per BAB</h2>

        {babStats.map((bab) => {
          const Icon = BAB_ICONS[bab.num] || Shield;
          // Kelas .bab-tile-<n> didefinisikan di globals.css supaya ikut mode gelap
          const tileNum = BAB_ICONS[bab.num] ? bab.num : 1;
          const percentage = Math.round((bab.filled / bab.tableCount) * 100);

          return (
            <div key={bab.num} className={`bab-card-${tileNum} rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bab-tile w-12 h-12 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">BAB {bab.num} - {bab.title}</h3>
                    <p className="text-sm text-slate-500">
                      {bab.filled} dari {bab.tableCount} tabel terisi ({percentage}%)
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(["excel", "word", "pdf"] as const).map((format) => {
                    const fmt = formatIcon(format);
                    const isExporting = exporting === `${bab.num}-${format}`;

                    return (
                      <button
                        key={format}
                        onClick={() => handleExport(bab.num, format)}
                        disabled={isExporting || !tahunAkademik}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${fmt.color}`}
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <fmt.icon className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">{format.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bab-bar h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Report Export */}
      <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Export Laporan Lengkap</h3>
        <p className="text-sm text-indigo-600 mb-4">Unduh semua {globalStats.totalTables} tabel LKPS dalam satu file</p>
        <div className="flex justify-center gap-3">
          {(["excel", "word", "pdf"] as const).map((format) => {
            const fmt = formatIcon(format);
            const isExporting = exporting === `all-${format}`;

            return (
              <button
                key={format}
                onClick={() => handleExport("all", format)}
                disabled={isExporting || !tahunAkademik}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${fmt.color}`}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <fmt.icon className="h-4 w-4" />
                )}
                Export All ({format.toUpperCase()})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div
          className="stat-tile w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ "--tile-color": color } as React.CSSProperties}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
