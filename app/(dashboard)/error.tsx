"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 shadow-soft-sm">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>

      <div className="space-y-1 text-center">
        <h2 className="text-base font-bold text-slate-800">Gagal Memuat Halaman</h2>
        <p className="max-w-xs text-xs font-semibold text-slate-400">
          {error.message || "Terjadi kesalahan saat memuat data dashboard."}
        </p>
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
      >
        <RefreshCw className="h-4 w-4" />
        Muat Ulang
      </button>
    </div>
  );
}
