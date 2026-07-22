"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createMahasiswa, updateMahasiswa } from "@/lib/actions/mahasiswa";

interface MahasiswaFormProps {
  mahasiswa?: {
    id: string;
    nim: string;
    nama: string;
    angkatan: number;
    status: string;
    jenisKelamin: string;
  };
}

export function MahasiswaForm({ mahasiswa }: MahasiswaFormProps) {
  const router = useRouter();
  const isEdit = !!mahasiswa;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nim: mahasiswa?.nim || "",
    nama: mahasiswa?.nama || "",
    angkatan: mahasiswa?.angkatan || new Date().getFullYear(),
    status: mahasiswa?.status || "Aktif",
    jenisKelamin: mahasiswa?.jenisKelamin || "L",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isEdit) {
        await updateMahasiswa(mahasiswa!.id, {
          nama: form.nama,
          angkatan: form.angkatan,
          status: form.status,
          jenisKelamin: form.jenisKelamin,
        });
      } else {
        await createMahasiswa(form);
      }
      router.push("/master/mahasiswa");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <Link
            href="/master/mahasiswa"
            className="rounded-lg p-2 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {isEdit ? `Edit data ${mahasiswa.nama}` : "Tambah data mahasiswa baru"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                NIM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
                disabled={isEdit}
                required
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400 shadow-soft-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-soft-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Angkatan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.angkatan}
                onChange={(e) => setForm({ ...form, angkatan: parseInt(e.target.value) })}
                required
                min={2000}
                max={2100}
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-soft-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-soft-sm"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Lulus">Lulus</option>
                <option value="DO">Drop Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={form.jenisKelamin}
                onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-soft-sm"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/master/mahasiswa"
              className="rounded-xl border border-slate-100 bg-white px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 shadow-soft-sm transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
