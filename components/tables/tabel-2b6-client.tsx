"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save,
  Users, Star, Edit2, Lightbulb, BookOpen, BarChart3,
  Target, MessageCircle, Briefcase, TrendingUp, Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Row {
  id: string;
  rowOrder: number;
  rowData: any;
}

interface Props {
  initialRows: Row[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

const DEFAULT_KEMAMPUAN = [
  { key: "kerjasamaTim", label: "Kerjasama Tim", icon: Users },
  { key: "keahlianProdi", label: "Keahlian di Bidang Prodi", icon: BookOpen },
  { key: "bahasaAsing", label: "Kemampuan Berbahasa Asing (Inggris)", icon: MessageCircle },
  { key: "komunikasi", label: "Kemampuan Berkomunikasi", icon: Target },
  { key: "pengembanganDiri", label: "Pengembangan Diri", icon: TrendingUp },
  { key: "kepemimpinan", label: "Kepemimpinan", icon: Shield },
  { key: "etosKerja", label: "Etos Kerja", icon: Briefcase },
];

export function Tabel2B6Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const [rows, setRows] = useState<Row[]>(() => {
    if (initialRows.length > 0) return initialRows;
    // Seed default 7 rows
    return DEFAULT_KEMAMPUAN.map((k, i) => ({
      id: `temp-${i}`,
      rowOrder: i + 1,
      rowData: {
        kemampuan: k.key,
        labelKemampuan: k.label,
        sangatBaik: 0,
        baik: 0,
        cukup: 0,
        kurang: 0,
        rencanaTindakLanjut: "",
      },
    }));
  });

  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Metadata rows (rowOrder > 7)
  const metaRows = rows.filter((r) => r.rowOrder > 7);
  const getMeta = (key: string) => {
    const m = metaRows.find((r) => r.rowData.key === key);
    return m ? String(m.rowData.value || "") : "";
  };

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (row: Row) => {
    setEditId(row.id);
    setForm({
      sangatBaik: String(row.rowData.sangatBaik ?? ""),
      baik: String(row.rowData.baik ?? ""),
      cukup: String(row.rowData.cukup ?? ""),
      kurang: String(row.rowData.kurang ?? ""),
      rencanaTindakLanjut: row.rowData.rencanaTindakLanjut || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const rowData = {
        kemampuan: rows.find((r) => r.id === editId)?.rowData.kemampuan || "",
        labelKemampuan: rows.find((r) => r.id === editId)?.rowData.labelKemampuan || "",
        sangatBaik: Number(form.sangatBaik) || 0,
        baik: Number(form.baik) || 0,
        cukup: Number(form.cukup) || 0,
        kurang: Number(form.kurang) || 0,
        rencanaTindakLanjut: form.rencanaTindakLanjut || "",
      };

      const isTemp = editId?.startsWith("temp-");
      const result = await upsertLkpsRow({ tabelKode, tahunAkademikId, rowId: isTemp ? undefined : editId, rowData });
      setRows(rows.map((r) => (r.id === editId ? { ...r, id: result.id, rowData: result.rowData } : r)));
      setModalOpen(false);
      triggerToast("Data kepuasan berhasil disimpan", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteLkpsRow({ rowId: deleteId, tabelKode });
      setRows(rows.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      triggerToast("Data dihapus", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menghapus.", "error");
    }
  };

  const sumCol = (col: string) => {
    const kemampuanRows = rows.filter((r) => r.rowOrder <= 7);
    return kemampuanRows.reduce((a, r) => a + (Number(r.rowData[col]) || 0), 0);
  };

  const totalScore = sumCol("sangatBaik") * 4 + sumCol("baik") * 3 + sumCol("cukup") * 2 + sumCol("kurang") * 1;
  const totalResponden = sumCol("sangatBaik") + sumCol("baik") + sumCol("cukup") + sumCol("kurang");
  const avgScore = totalResponden > 0 ? (totalScore / (totalResponden * 4) * 100).toFixed(1) : "0";

  const t = (v: number | undefined | null) => (v ?? 0).toLocaleString("id-ID");

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
        <ValidationControls
          tabelKode={tabelKode}
          tahunAkademikId={tahunAkademikId}
          currentStatus={currentStatus}
          userRole={userRole}
          onChangeStatus={setCurrentStatus}
          triggerToast={triggerToast}
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-4 shadow-soft">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Total Responden</p>
          <p className="mt-1 text-2xl font-black text-slate-700">{t(totalResponden)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-4 shadow-soft">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Skor Rata-rata</p>
          <p className="mt-1 text-2xl font-black text-indigo-600">{avgScore}%</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-4 shadow-soft">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Sangat Baik + Baik</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{t(sumCol("sangatBaik") + sumCol("baik"))}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-4 shadow-soft">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Total Penilaian</p>
          <p className="mt-1 text-2xl font-black text-slate-700">{t(totalScore)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft border border-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th rowSpan={2} className="px-3 py-2.5 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100 w-12">No</th>
                <th rowSpan={2} className="px-3 py-2.5 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Jenis Kemampuan</th>
                <th colSpan={4} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100">Tingkat Kepuasan Pengguna (%)</th>
                <th rowSpan={2} className="px-3 py-2.5 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Rencana Tindak Lanjut</th>
                <th rowSpan={2} className="px-3 py-2.5 text-center w-16">Aksi</th>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100 bg-emerald-50/50">Sangat Baik</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100 bg-blue-50/50">Baik</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100 bg-amber-50/50">Cukup</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100 bg-red-50/50">Kurang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.filter((r) => r.rowOrder <= 7).map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-slate-600 text-center border-r border-slate-100">{idx + 1}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-800 border-r border-slate-100">{row.rowData.labelKemampuan || row.rowData.kemampuan}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-emerald-600 border-r border-slate-100">{t(row.rowData.sangatBaik)}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-blue-600 border-r border-slate-100">{t(row.rowData.baik)}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-amber-600 border-r border-slate-100">{t(row.rowData.cukup)}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-red-600 border-r border-slate-100">{t(row.rowData.kurang)}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-500 border-r border-slate-100 max-w-[200px] truncate">
                    {row.rowData.rencanaTindakLanjut || "-"}
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-2xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {/* Jumlah */}
              <tr className="bg-slate-100/80 border-t-2 border-slate-200">
                <td colSpan={2} className="px-3 py-2.5 font-black text-slate-800 border-r border-slate-200">Jumlah</td>
                <td className="px-2 py-2.5 text-center font-black text-slate-700 border-r border-slate-200">{t(sumCol("sangatBaik"))}</td>
                <td className="px-2 py-2.5 text-center font-black text-slate-700 border-r border-slate-200">{t(sumCol("baik"))}</td>
                <td className="px-2 py-2.5 text-center font-black text-slate-700 border-r border-slate-200">{t(sumCol("cukup"))}</td>
                <td className="px-2 py-2.5 text-center font-black text-slate-700 border-r border-slate-200">{t(sumCol("kurang"))}</td>
                <td colSpan={2} className="px-3 py-2.5 text-center text-xs font-bold text-slate-500">
                  Rata-rata: {avgScore}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination summary */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="text-xs font-semibold text-slate-400">{rows.filter((r) => r.rowOrder <= 7).length} jenis kemampuan</div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-2xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-soft-sm">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Kepuasan Pengguna</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {rows.find((r) => r.id === editId)?.rowData.labelKemampuan || "Jenis Kemampuan"}
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <BarChart3 className="h-4 w-4 text-amber-500" />
                    <span>Tingkat Kepuasan (%)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-emerald-700 mb-1">Sangat Baik <span className="text-red-500">*</span></label>
                      <input type="number" min="0" max="100" placeholder="0" value={form.sangatBaik}
                        onChange={(e) => setForm((p) => ({ ...p, sangatBaik: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 shadow-3xs placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-blue-700 mb-1">Baik <span className="text-red-500">*</span></label>
                      <input type="number" min="0" max="100" placeholder="0" value={form.baik}
                        onChange={(e) => setForm((p) => ({ ...p, baik: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 shadow-3xs placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-amber-700 mb-1">Cukup <span className="text-red-500">*</span></label>
                      <input type="number" min="0" max="100" placeholder="0" value={form.cukup}
                        onChange={(e) => setForm((p) => ({ ...p, cukup: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 shadow-3xs placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-red-700 mb-1">Kurang <span className="text-red-500">*</span></label>
                      <input type="number" min="0" max="100" placeholder="0" value={form.kurang}
                        onChange={(e) => setForm((p) => ({ ...p, kurang: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 shadow-3xs placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Target className="h-4 w-4 text-amber-500" />
                    <span>Rencana Tindak Lanjut oleh UPPS/PS</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Tulis rencana tindak lanjut..."
                    value={form.rencanaTindakLanjut}
                    onChange={(e) => setForm((p) => ({ ...p, rencanaTindakLanjut: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 shadow-3xs placeholder:text-slate-300 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
                      : <><Save className="h-4 w-4" /> Simpan</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
                <X className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Data</h3>
              <p className="mt-2 text-xs text-slate-400">Yakin ingin menghapus?</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500">Batal</button>
                <button onClick={handleDeleteConfirm} className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg ${toast.type === "success" ? "bg-slate-900" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
