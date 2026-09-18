import Link from "next/link";
import { FileQuestion, LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <FileQuestion className="h-7 w-7 text-slate-500 dark:text-slate-400" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          404 — Halaman tidak ditemukan
        </p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          Data yang Anda cari tidak ada
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Kode kriteria atau halaman yang Anda buka tidak terdaftar pada instrumen
          LAM INFOKOM 2.1. Periksa kembali tautannya.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/penilaian"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Ke Matriks Penilaian
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
