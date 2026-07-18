"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft,
  CheckCircle2, X, Save, Clock, Users, BarChart3,
  Edit2, Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow } from "@/lib/actions/lkps";

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
}

export function Tabel2B4Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ jumlahLulusan: "", jumlahTerlacak: "", rataRata: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const tsRow = rows.find((r) => r.rowData.tahun === "TS");
  const ts1Row = rows.find((r) => r.rowData.tahun === "TS-1");
  const ts2Row = rows.find((r) => r.rowData.tahun === "TS-2");

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

  const traceRate = (row: Tabel2B4Row | undefined) => {
    if (!row || !row.rowData.jumlahLulusan) return "0%";
    return ((row.rowData.jumlahTerlacak / row.rowData.jumlahLulusan) * 100).toFixed(0) + "%";
  };

  const totalLulusan = rows.reduce((a, r) => a + (r.rowData.jumlahLulusan || 0), 0);
  const totalTerlacak = rows.reduce((a, r) => a + (r.rowData.jumlahTerlacak || 0), 0);
  const avgRata = rows.length > 0 ? rows.reduce((a, r) => a + (r.rowData.rataRata || 0), 0) / rows.length : 0;

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
        <button onClick={openModal} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all">
          <Edit2 className="h-4 w-4" /> Edit Data TS
        </button>
      </div>

      {/* Info */}
      <div className="flex items-center gap-2 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 px-4 py-3 text-2xs font-semibold text-indigo-700">
        <Lightbulb className="h-4 w-4 shrink-0 text-indigo-500" />
        <span>Data TS-2 dan TS-1 otomatis dari tahun akademik sebelumnya. <strong>Klik "Edit Data TS"</strong> untuk mengisi data Tahun Sekarang.</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lulusan</p>
              <p className="mt-1 text-2xl font-black text-slate-700">{fmt(totalLulusan)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white shadow-soft-sm">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lulusan Terlacak</p>
              <p className="mt-1 text-2xl font-black text-slate-700">{fmt(totalTerlacak)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-soft-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Rata-rata Tunggu</p>
              <p className="mt-1 text-2xl font-black text-slate-700">{avgRata.toFixed(1)} <span className="text-sm font-bold text-slate-400">bln</span></p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-soft-sm">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Header table */}
      <div className="grid grid-cols-6 gap-4 px-6 py-2.5 text-2xs font-bold uppercase tracking-wider text-slate-400 select-none">
        <div>Tahun</div>
        <div className="text-right">Jumlah Lulusan</div>
        <div className="text-right">Lulusan Terlacak</div>
        <div className="text-center">Tingkat Terlacak</div>
        <div className="text-right">Rata-rata (Bulan)</div>
        <div />
      </div>

      {/* TS-2 card */}
      <div className="grid grid-cols-6 gap-4 items-center rounded-2xl bg-white border border-slate-100/50 px-5 py-3.5 shadow-2xs">
        <div>
          <span className="inline-flex items-center rounded-lg bg-blue-100 px-2.5 py-1 text-2xs font-bold text-blue-700 border border-blue-200/50">TS-2</span>
        </div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts2Row?.rowData.jumlahLulusan)}</div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts2Row?.rowData.jumlahTerlacak)}</div>
        <div className="text-center">
          <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold bg-slate-100 text-slate-500">{traceRate(ts2Row)}</span>
        </div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts2Row?.rowData.rataRata)}</div>
        <div />
      </div>

      {/* TS-1 card */}
      <div className="grid grid-cols-6 gap-4 items-center rounded-2xl bg-white border border-slate-100/50 px-5 py-3.5 shadow-2xs">
        <div>
          <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2.5 py-1 text-2xs font-bold text-indigo-700 border border-indigo-200/50">TS-1</span>
        </div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts1Row?.rowData.jumlahLulusan)}</div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts1Row?.rowData.jumlahTerlacak)}</div>
        <div className="text-center">
          <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold bg-slate-100 text-slate-500">{traceRate(ts1Row)}</span>
        </div>
        <div className="text-right text-sm font-bold text-slate-400">{fmt(ts1Row?.rowData.rataRata)}</div>
        <div />
      </div>

      {/* TS card (active) */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-white shadow-soft">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-2xs font-black text-white uppercase tracking-wider">
              <Edit2 className="h-3 w-3" /> TS — Tahun Sekarang
            </span>
            <button
              onClick={openModal}
              className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1 text-2xs font-bold text-white hover:bg-white/30 transition-all"
            >
              <Edit2 className="h-3 w-3" /> Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 items-center px-5 py-4">
          <div>
            <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2.5 py-1 text-2xs font-bold text-indigo-700 border border-indigo-200/50">TS</span>
          </div>
          <div className="text-right text-lg font-black text-slate-800">{fmt(tsRow?.rowData.jumlahLulusan)}</div>
          <div className="text-right text-lg font-black text-slate-800">{fmt(tsRow?.rowData.jumlahTerlacak)}</div>
          <div className="text-center">
            <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50">{traceRate(tsRow)}</span>
          </div>
          <div className="text-right text-lg font-black text-indigo-600">{fmt(tsRow?.rowData.rataRata)} <span className="text-xs font-bold text-slate-400">bln</span></div>
          <div />
        </div>

        {/* Total summary */}
        <div className="border-t border-slate-100 px-5 py-3 grid grid-cols-6 gap-4 items-center bg-slate-50/50 rounded-b-2xl">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">Total</div>
          <div className="text-right text-sm font-black text-slate-800">{fmt(totalLulusan)}</div>
          <div className="text-right text-sm font-black text-slate-800">{fmt(totalTerlacak)}</div>
          <div className="text-center text-2xs font-semibold text-slate-400">
            {totalLulusan > 0 ? ((totalTerlacak / totalLulusan) * 100).toFixed(0) + "%" : "0%"}
          </div>
          <div className="text-right text-sm font-black text-indigo-600">{avgRata.toFixed(1)} <span className="text-2xs font-bold text-slate-400">bln</span></div>
          <div />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="text-xs font-semibold text-slate-400">Menampilkan TS-2, TS-1, TS</div>
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
              className="w-full max-w-lg rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-soft-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Edit Masa Tunggu — TS</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Data lulusan Tahun Sekarang</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <BarChart3 className="h-4 w-4" />
                    <span>Data Kelulusan TS</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Jumlah Lulusan <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 50" value={formData.jumlahLulusan}
                        onChange={(e) => setFormData((p) => ({ ...p, jumlahLulusan: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 shadow-3xs placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Lulusan yang Terlacak <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 45" value={formData.jumlahTerlacak}
                        onChange={(e) => setFormData((p) => ({ ...p, jumlahTerlacak: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 shadow-3xs placeholder:text-slate-300" />
                      {formData.jumlahLulusan && Number(formData.jumlahLulusan) > 0 && (
                        <p className="mt-1 text-2xs font-semibold text-slate-400">
                          Tingkat terlacak: <span className="text-indigo-600 font-bold">
                            {((Number(formData.jumlahTerlacak) / Number(formData.jumlahLulusan)) * 100).toFixed(0)}%
                          </span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Rata-rata Waktu Tunggu (Bulan) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type="number" min="0" step="0.1" placeholder="cth: 3.5" value={formData.rataRata}
                          onChange={(e) => setFormData((p) => ({ ...p, rataRata: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-12 text-xs font-bold text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 shadow-3xs placeholder:text-slate-300" />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-2xs font-bold text-slate-400 pointer-events-none">bulan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.jumlahLulusan && Number(formData.jumlahLulusan) > 0 && (
                  <div className="flex items-center gap-2 rounded-2xl bg-indigo-50/50 px-4 py-3 text-2xs font-semibold text-indigo-700">
                    <Lightbulb className="h-4 w-4 shrink-0 text-indigo-500" />
                    <span>{Number(formData.jumlahTerlacak)} dari {Number(formData.jumlahLulusan)} lulusan terlacak ({((Number(formData.jumlahTerlacak) / Number(formData.jumlahLulusan)) * 100).toFixed(0)}%)</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
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
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg ${toast.type === "success" ? "bg-slate-900" : "bg-red-600"}`}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
