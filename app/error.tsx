"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-soft-sm">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-800">Terjadi Kesalahan</h1>
            <p className="text-sm font-medium text-slate-400">
              Maaf, terjadi kesalahan yang tidak terduga. Tim teknis telah diberitahu.
            </p>
          </div>

          {error.digest && (
            <p className="rounded-xl bg-slate-100 px-3 py-2 text-2xs font-mono text-slate-400">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
