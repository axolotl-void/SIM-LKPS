"use client";

import { useState } from "react";
import {
  Plus, Edit2, Trash2, Loader2, ArrowLeft,
  CheckCircle2, Save, Target, ListChecks
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface StrategiRow {
  id: string;
  rowOrder: number;
  rowData: {
    nomor: number;
    strategi: string;
    sasaran: string;
    indikator: string;
    target: string;
    linkBukti?: string;
  };
}

interface Props {
  initialRows: StrategiRow[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel62Client({ initialRows, tahunAkademikId, tabelKode, status }: Props) {
  const [rows, setRows] = useState<StrategiRow[]>(initialRows);
  const [currentStatus] = useState(status);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<StrategiRow | null>(null);
  const [form, setForm] = useState({
    nomor: 1,
    strategi: "",
    sasaran: "",
    indikator: "",
    target: "",
    linkBukti: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const sortedRows = [...rows].sort((a, b) => a.rowData.nomor - b.rowData.nomor);

  const openAdd = () => {
    setEditItem(null);
    setForm({
      nomor: rows.length + 1,
      strategi: "",
      sasaran: "",
      indikator: "",
      target: "",
      linkBukti: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item: StrategiRow) => {
    setEditItem(item);
    setForm({
      nomor: item.rowData.nomor,
      strategi: item.rowData.strategi || "",
      sasaran: item.rowData.sasaran || "",
      indikator: item.rowData.indikator || "",
      target: item.rowData.target || "",
      linkBukti: item.rowData.linkBukti || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.strategi.trim() || !form.sasaran.trim() || !form.indikator.trim() || !form.target.trim()) {
      triggerToast("Semua field wajib diisi.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const rowData = {
        nomor: Number(form.nomor),
        strategi: form.strategi.trim(),
        sasaran: form.sasaran.trim(),
        indikator: form.indikator.trim(),
        target: form.target.trim(),
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updated: StrategiRow = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData,
      };

      if (editItem) {
        setRows(rows.map((r) => (r.id === editItem.id ? updated : r)));
      } else {
        setRows([...rows, updated]);
      }

      setModalOpen(false);
      triggerToast(editItem ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.", "success");
      router.refresh();
    } catch (e: unknown) {
      const error = e as Error;
      triggerToast(error.message || "Gagal menyimpan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteLkpsRow({ rowId: deleteConfirmId, tabelKode });
      setRows(rows.filter((r) => r.id !== deleteConfirmId));
      triggerToast("Berhasil dihapus.", "success");
      router.refresh();
    } catch (e: unknown) {
      const error = e as Error;
      triggerToast(error.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-6" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 6
        </Link>
        {canEdit && (
          <button onClick={openAdd} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all cursor-pointer">
            <Plus className="h-4 w-4" /> Tambah Strategi
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-amber-50/60 border border-amber-100/60 px-5 py-4 text-xs font-semibold text-amber-700">
        <Target className="h-5 w-5 shrink-0 text-amber-500" />
        <span>Tabel 6.2 memuat strategi pencapaian tujuan, sasaran, indikator kinerja, dan target yang terukur.</span>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-100/60 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-sm">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Daftar Strategi Pencapaian</h3>
            <p className="text-2xs font-semibold text-slate-400">{sortedRows.length} strategi</p>
          </div>
        </div>

        {sortedRows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Belum ada strategi pencapaian.</p>
            <p className="text-2xs text-slate-400 mt-1">Klik tombol "Tambah Strategi" untuk menambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-2xs font-extrabold uppercase tracking-wider text-slate-500">No</th>
                  <th className="px-4 py-3 text-left text-2xs font-extrabold uppercase tracking-wider text-slate-500">Strategi</th>
                  <th className="px-4 py-3 text-left text-2xs font-extrabold uppercase tracking-wider text-slate-500">Sasaran</th>
                  <th className="px-4 py-3 text-left text-2xs font-extrabold uppercase tracking-wider text-slate-500">Indikator</th>
                  <th className="px-4 py-3 text-left text-2xs font-extrabold uppercase tracking-wider text-slate-500">Target</th>
                  {canEdit && <th className="px-4 py-3 text-right text-2xs font-extrabold uppercase tracking-wider text-slate-500">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedRows.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                        {item.rowData.nomor}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 max-w-xs">{item.rowData.strategi}</td>
                    <td className="px-4 py-3 text-xs text-slate-700 max-w-xs">{item.rowData.sasaran}</td>
                    <td className="px-4 py-3 text-xs text-slate-700 max-w-xs">{item.rowData.indikator}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{item.rowData.target}</td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(item.id)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl rounded-3xl bg-white shadow-lg border border-slate-100/50 p-8 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-sm">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editItem ? "Ubah Strategi" : "Tambah Strategi"}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Strategi Pencapaian Tujuan</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">Nomor <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={form.nomor}
                      onChange={(e) => setForm({ ...form, nomor: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Strategi Pencapaian <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tuliskan strategi pencapaian..."
                    value={form.strategi}
                    onChange={(e) => setForm({ ...form, strategi: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Sasaran <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tuliskan sasaran yang ingin dicapai..."
                    value={form.sasaran}
                    onChange={(e) => setForm({ ...form, sasaran: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Indikator Kinerja <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tuliskan indikator kinerja..."
                    value={form.indikator}
                    onChange={(e) => setForm({ ...form, indikator: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Target <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 80%, 100 orang, dll..."
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Link Bukti (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.linkBukti}
                    onChange={(e) => setForm({ ...form, linkBukti: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan Data</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Strategi?</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed px-2">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} disabled={isDeleting} className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-sm">
                  Batal
                </button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-600 disabled:opacity-50">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-xs font-bold text-white shadow-lg border border-slate-800">
            <CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span>{toast.message}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
