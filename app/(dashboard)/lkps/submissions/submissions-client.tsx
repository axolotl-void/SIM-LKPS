"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, XCircle, Search, X, ArrowRight, MessageSquare, FileText } from "lucide-react";

interface SubmissionItem {
  id: string;
  kode: string;
  nama: string;
  bab: number;
  status: string;
  submittedAt: string | null;
  validatedAt: string | null;
  submittedByName: string;
  validatedByName: string | null;
  latestComment: string | null;
  latestAction: string | null;
}

interface Props {
  initialSubmissions: SubmissionItem[];
  activeTa: string;
  prodi: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
};

const defaultStatus = statusConfig["DIAJUKAN"];

const FILTER_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "DIAJUKAN", label: "Diajukan" },
  { value: "DIREVISI", label: "Direvisi" },
  { value: "DITOLAK", label: "Ditolak" },
  { value: "DISETUJUI", label: "Disetujui" },
];

export function SubmissionStatusClient({ initialSubmissions, activeTa, prodi }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = initialSubmissions.filter((s) => {
    const matchesSearch =
      !search ||
      s.kode.toLowerCase().includes(search.toLowerCase()) ||
      s.nama.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts: Record<string, number> = { all: initialSubmissions.length };
  for (const s of initialSubmissions) {
    counts[s.status] = (counts[s.status] || 0) + 1;
  }

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = filter === opt.value;
          const count = counts[opt.value] || 0;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-soft-sm"
                  : "bg-white text-slate-500 border border-slate-100 shadow-soft hover:bg-slate-50"
              }`}
            >
              {opt.label}
              <span className={`rounded-lg px-1.5 py-0.5 text-2xs ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode tabel atau nama..."
          className="w-full rounded-xl border border-slate-100 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-soft-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info Bar */}
      <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-2 text-2xs font-semibold text-slate-500">
        <span>{activeTa}</span>
        <span>•</span>
        <span>{prodi}</span>
        <span>•</span>
        <span>{filtered.length} tabel</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center shadow-soft">
          <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-500">
            {search || filter !== "all" ? "Tidak ada hasil pencarian" : "Belum ada pengajuan"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {search || filter !== "all" ? "Coba ubah filter atau kata kunci" : "Ajukan tabel dari halaman BAB terkait"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = (statusConfig as any)[sub.status] ?? defaultStatus;
            return (
              <Link
                key={sub.id}
                href={`/lkps/bab-${sub.bab}/tabel-${sub.kode.toLowerCase().replace(/\./g, "")}`}
                className="group flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft border border-slate-100/50 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)] hover:border-blue-200/60 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.border} text-slate-400`}>
                      <FileText className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-lg">
                          {sub.kode}
                        </span>
                        <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-2xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-bold text-slate-800 leading-snug">{sub.nama}</h3>
                      <p className="mt-1 text-2xs text-slate-400">
                        Diajukan: {formatDate(sub.submittedAt)}
                        {sub.validatedAt && ` • Validasi: ${formatDate(sub.validatedAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    Detail <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Validator comment */}
                {sub.latestComment && (
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare className="h-3 w-3 text-slate-400" />
                      <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                        Catatan Validator
                      </span>
                      {sub.validatedByName && (
                        <span className="text-2xs text-slate-400">— {sub.validatedByName}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{sub.latestComment}"
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
