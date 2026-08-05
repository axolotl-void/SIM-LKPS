"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NewDosenPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    nidn: "",
    nama: "",
    jabatanFungsional: "",
    pendidikanTerakhir: "S2",
    bidangKeahlian: "",
    status: "Tetap",
    jenisKelamin: "L",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/master/dosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }

      triggerToast("Data dosen berhasil ditambahkan", "success");
      setTimeout(() => router.push("/master/dosen"), 1500);
    } catch (err: any) {
      triggerToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/master/dosen"
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 shadow-soft"
      >
        <div className="mb-6">
          <h1 className="text-lg font-bold text-slate-800">Tambah Dosen</h1>
          <p className="text-sm text-slate-500 mt-1">Lengkapi data dosen baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NIDN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NIDN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nidn}
                onChange={(e) => updateField("nidn", e.target.value)}
                placeholder="Contoh: 0012345678"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => updateField("nama", e.target.value)}
                placeholder="Contoh: Dr. John Doe, M.Kom"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Jabatan Fungsional */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jabatan Fungsional
              </label>
              <select
                value={form.jabatanFungsional}
                onChange={(e) => updateField("jabatanFungsional", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Pilih Jabatan</option>
                <option value="Guru Besar">Guru Besar</option>
                <option value="Lektor Kepala">Lektor Kepala</option>
                <option value="Lektor">Lektor</option>
                <option value="Asisten Ahli">Asisten Ahli</option>
                <option value="Tenaga Pengajar">Tenaga Pengajar</option>
              </select>
            </div>

            {/* Pendidikan Terakhir */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pendidikan Terakhir <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.pendidikanTerakhir}
                onChange={(e) => updateField("pendidikanTerakhir", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="S3">S3 (Strata 3)</option>
                <option value="S2">S2 (Strata 2)</option>
                <option value="S1">S1 (Strata 1)</option>
              </select>
            </div>

            {/* Bidang Keahlian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bidang Keahlian
              </label>
              <input
                type="text"
                value={form.bidangKeahlian}
                onChange={(e) => updateField("bidangKeahlian", e.target.value)}
                placeholder="Contoh: Kecerdasan Buatan, Jaringan Komputer"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Tetap">Tetap</option>
                <option value="Tidak Tetap">Tidak Tetap</option>
              </select>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.jenisKelamin}
                onChange={(e) => updateField("jenisKelamin", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/master/dosen"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-lg border"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                : "bg-red-50 text-red-500 border-red-100"
            }`}>
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {toast.type === "success" ? "Berhasil!" : "Gagal!"}
              </p>
              <p className="text-xs text-slate-500">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
