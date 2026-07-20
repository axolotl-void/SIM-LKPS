"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft,
  CheckCircle2, X, Save, Clock, Users, BarChart3,
  Edit2, Lightbulb, GraduationCap, Target, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Tabel2B4Row {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    jumlahLulusan: number;
    jumlahTerlacak: number;
    rataRata: number;
  };
}

interface Props {
  initialRows: Tabel2B4Row[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel2B4Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ jumlahLulusan: "", jumlahTerlacak: "", rataRata: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const tsRow = rows.find((r) => r.rowData.tahun === "TS");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openModal = () => {
    setFormData({
      jumlahLulusan: String(tsRow?.rowData.jumlahLulusan || ""),
      jumlahTerlacak: String(tsRow?.rowData.jumlahTerlacak || ""),
      rataRata: String(tsRow?.rowData.rataRata || ""),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "TS",
        jumlahLulusan: Number(formData.jumlahLulusan) || 0,
        jumlahTerlacak: Number(formData.jumlahTerlacak) || 0,
        rataRata: parseFloat(formData.rataRata) || 0,
      };

      const isTemp = tsRow?.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isTemp ? undefined : tsRow?.id,
        rowData,
      });

      const updated: Tabel2B4Row = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: "TS",
          jumlahLulusan: Number(result.rowData.jumlahLulusan) || 0,
          jumlahTerlacak: Number(result.rowData.jumlahTerlacak) || 0,
          rataRata: parseFloat(String(result.rowData.rataRata || 0)),
        },
      };

      setRows(rows.map((r) => (r.rowData.tahun === "TS" ? updated : r)));
      setModalOpen(false);
      triggerToast("Data masa tunggu berhasil disimpan", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (val: number | undefined | null) => (val ?? 0).toLocaleString("id-ID");

  const tracePct = tsRow && tsRow.rowData.jumlahLulusan > 0
    ? ((tsRow.rowData.jumlahTerlacak / tsRow.rowData.jumlahLulusan) * 100).toFixed(0)
    : "0";

  const allJumlahLulusan = rows.reduce((a, r) => a + (r.rowData.jumlahLulusan || 0), 0);
  const allJumlahTerlacak = rows.reduce((a, r) => a + (r.rowData.jumlahTerlacak || 0), 0);
  const allAvgRata = rows.length > 0 ? rows.reduce((a, r) => a + (r.rowData.rataRata || 0), 0) / rows.length : 0;

  return (
    <div className="space-y-8">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
        <div className="flex items-center gap-2.5">
          <ValidationControls
            tabelKode={tabelKode}
            tahunAkademikId={tahunAkademikId}
            currentStatus={currentStatus}
            userRole={userRole}
            onChangeStatus={setCurrentStatus}
            triggerToast={triggerToast}
          />
          <button
            onClick={openModal}
            disabled={!canEdit}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm transition-all ${
              canEdit
                ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white hover:shadow-soft"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Edit2 className="h-4 w-4" /> Edit Data TS
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/60 px-5 py-4 text-xs font-semibold text-indigo-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-indigo-500" />
        <span><strong>Klik "Edit Data TS"</strong> untuk mengisi data masa tunggu lulusan Tahun Sekarang.</span>
      </div>

      {/* Cards: 3 large stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                Total Lulusan
              </div>
              <p className="text-3xl font-black text-slate-800">{fmt(allJumlahLulusan)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-soft-sm">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-2xs font-semibold text-slate-400">
            <TrendingUp className="h-3 w-3" />
            <span>TS: {fmt(tsRow?.rowData.jumlahLulusan || 0)} lulusan</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Target className="h-4 w-4 text-indigo-500" />
                Lulusan Terlacak
              </div>
              <p className="text-3xl font-black text-slate-800">{fmt(allJumlahTerlacak)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-soft-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-2xs font-semibold text-slate-400">
            <span>Tingkat terlacak: <strong className="text-indigo-600">{tracePct}%</strong></span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Clock className="h-4 w-4 text-purple-500" />
                Rata-rata Tunggu
              </div>
              <p className="text-3xl font-black text-slate-800">{allAvgRata.toFixed(1)} <span className="text-lg font-bold text-slate-400">bulan</span></p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-soft-sm">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-2xs font-semibold text-slate-400">
            <span>TS: <strong className="text-purple-600">{tsRow?.rowData.rataRata || 0} bulan</strong></span>
          </div>
        </div>
      </div>

      {/* TS Card — Main Large */}
      <div className="rounded-2xl border-2 border-indigo-200/70 bg-white shadow-soft overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tahun Sekarang (TS)</h3>
                <p className="text-2xs font-semibold text-indigo-200">Data lulusan tahun berjalan</p>
              </div>
            </div>
            <button onClick={openModal} className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-2xs font-bold text-white hover:bg-white/30 transition-all">
              <Edit2 className="h-3.5 w-3.5" /> Edit Data
            </button>
          </div>
        </div>

        {/* Body — large spacious layout */}
        <div className="p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jumlah Lulusan */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/30 border border-blue-100/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Jumlah Lulusan</span>
              </div>
              <p className="text-4xl font-black text-blue-900">{fmt(tsRow?.rowData.jumlahLulusan)}</p>
              <p className="mt-2 text-2xs font-semibold text-blue-500">Total lulusan pada periode TS</p>
            </div>

            {/* Lulusan Terlacak */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-50/30 border border-indigo-100/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Target className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Lulusan Terlacak</span>
              </div>
              <p className="text-4xl font-black text-indigo-900">{fmt(tsRow?.rowData.jumlahTerlacak)}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-2 rounded-full bg-indigo-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(Number(tracePct), 100)}%` }} />
                </div>
                <span className="text-2xs font-bold text-indigo-600">{tracePct}%</span>
              </div>
            </div>

            {/* Rata-rata */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-50/30 border border-purple-100/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Rata-rata Tunggu</span>
              </div>
              <p className="text-4xl font-black text-purple-900">
                {tsRow?.rowData.rataRata || 0}
                <span className="text-lg font-bold text-purple-400 ml-1">bln</span>
              </p>
              <p className="mt-2 text-2xs font-semibold text-purple-500">Rata-rata waktu tunggu bekerja pertama</p>
            </div>
          </div>
        </div>

        {/* Total summary bar */}
        <div className="border-t border-slate-100 mx-7 py-4 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Gabungan Seluruh Data</span>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Total Lulusan</p>
              <p className="text-sm font-black text-slate-800">{fmt(allJumlahLulusan)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Total Terlacak</p>
              <p className="text-sm font-black text-slate-800">{fmt(allJumlahTerlacak)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Rata-rata</p>
              <p className="text-sm font-black text-indigo-600">{allAvgRata.toFixed(1)} bln</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-soft-sm">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Data Masa Tunggu</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Tahun Sekarang (TS) — Program Studi Ilmu Komputer</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-700">Jumlah Lulusan</span>
                    </div>
                    <input type="number" min="0" placeholder="cth: 50" value={formData.jumlahLulusan}
                      onChange={(e) => setFormData((p) => ({ ...p, jumlahLulusan: e.target.value }))}
                      className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" />
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-700">Lulusan Terlacak</span>
                    </div>
                    <input type="number" min="0" placeholder="cth: 45" value={formData.jumlahTerlacak}
                      onChange={(e) => setFormData((p) => ({ ...p, jumlahTerlacak: e.target.value }))}
                      className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-300" />
                    {formData.jumlahLulusan && Number(formData.jumlahLulusan) > 0 && formData.jumlahTerlacak && (
                      <div className="flex items-center gap-1.5 text-2xs font-bold text-indigo-600">
                        <TrendingUp className="h-3 w-3" />
                        Terlacak: {((Number(formData.jumlahTerlacak) / Number(formData.jumlahLulusan)) * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 rounded-2xl border border-purple-100 bg-purple-50/30 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-bold text-purple-700">Rata-rata Waktu Tunggu (Bulan)</span>
                    </div>
                    <div className="relative">
                      <input type="number" min="0" step="0.1" placeholder="cth: 3.5" value={formData.rataRata}
                        onChange={(e) => setFormData((p) => ({ ...p, rataRata: e.target.value }))}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 pr-16 text-sm font-bold text-slate-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm placeholder:text-slate-300" />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-purple-400 pointer-events-none">bulan</span>
                    </div>
                  </div>
                </div>

                {formData.jumlahLulusan && Number(formData.jumlahLulusan) > 0 && (
                  <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4 text-xs font-semibold text-indigo-700 border border-indigo-100/50">
                    <Lightbulb className="h-5 w-5 shrink-0 text-indigo-500" />
                    <span>{Number(formData.jumlahTerlacak) || 0} dari {Number(formData.jumlahLulusan)} lulusan terlacak — <strong>{((Number(formData.jumlahTerlacak || 0) / Number(formData.jumlahLulusan)) * 100).toFixed(0)}%</strong></span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                      : <><Save className="h-4 w-4" /> Simpan Data</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
