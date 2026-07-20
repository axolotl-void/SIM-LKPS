"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Share2, Globe, Edit2, Lightbulb, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface DiseminasiItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    namaDtpr: string;
    judul: string;
    diseminasi: "L" | "N" | "I";
    ts2: number;
    ts1: number;
    ts: number;
    linkBukti: string;
  };
}

interface Props {
  initialRows: DiseminasiItem[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel4C2Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState<DiseminasiItem[]>(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DiseminasiItem | null>(null);
  const [form, setForm] = useState({
    namaDtpr: "", judul: "", diseminasi: "L" as "L" | "N" | "I",
    ts2: "", ts1: "", ts: "", linkBukti: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ namaDtpr: "", judul: "", diseminasi: "L", ts2: "", ts1: "", ts: "", linkBukti: "" });
    setModalOpen(true);
  };

  const openEdit = (item: DiseminasiItem) => {
    setEditItem(item);
    setForm({
      namaDtpr: item.rowData.namaDtpr || "",
      judul: item.rowData.judul || "",
      diseminasi: item.rowData.diseminasi || "L",
      ts2: String(item.rowData.ts2 || ""),
      ts1: String(item.rowData.ts1 || ""),
      ts: String(item.rowData.ts || ""),
      linkBukti: item.rowData.linkBukti || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.namaDtpr.trim() || !form.judul.trim()) {
      triggerToast("Nama DTPR dan Judul harus diisi.", "error"); return;
    }
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "TS", namaDtpr: form.namaDtpr.trim(), judul: form.judul.trim(),
        diseminasi: form.diseminasi, ts2: Number(form.ts2) || 0, ts1: Number(form.ts1) || 0,
        ts: Number(form.ts) || 0, linkBukti: form.linkBukti.trim(),
      };
      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode, tahunAkademikId, rowId: isUpdate ? editItem.id : undefined, rowData,
      });
      const updated: DiseminasiItem = { id: result.id, rowOrder: result.rowOrder, rowData };
      if (editItem) setRows(rows.map((r) => (r.id === editItem.id ? updated : r)));
      else setRows([...rows, updated]);
      setModalOpen(false);
      triggerToast(editItem ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (id: string, nama: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(nama);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteLkpsRow({ tabelKode, rowId: deleteConfirmId });
      setRows(rows.filter((r) => r.id !== deleteConfirmId));
      triggerToast("Berhasil dihapus.", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
      setDeleteConfirmName("");
    }
  };

  const lokal = rows.filter((r) => r.rowData.diseminasi === "L").length;
  const nasional = rows.filter((r) => r.rowData.diseminasi === "N").length;
  const internasional = rows.filter((r) => r.rowData.diseminasi === "I").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-4" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 4
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
          <button onClick={openAdd} disabled={!canEdit} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm hover:shadow-soft transition-all ${canEdit ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
            <Plus className="h-4 w-4" /> Tambah Diseminasi
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-cyan-50/60 border border-cyan-100/60 px-5 py-4 text-xs font-semibold text-cyan-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-cyan-500" />
        <span>Catat diseminasi hasil PkM oleh DTPR berdasarkan skala: Lokal, Nasional, atau Internasional.</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Diseminasi</div>
          <p className="text-3xl font-black mt-2 text-slate-800">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Lokal</div>
          <p className="text-3xl font-black mt-2 text-cyan-600">{lokal}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Nasional</div>
          <p className="text-3xl font-black mt-2 text-blue-600">{nasional}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Internasional</div>
          <p className="text-3xl font-black mt-2 text-indigo-600">{internasional}</p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-cyan-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Diseminasi Hasil PkM</h3>
                <p className="text-2xs font-semibold text-cyan-200">Penyebarluasan hasil PkM DTPR</p>
              </div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">{rows.length} items</span>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Share2 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data diseminasi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Nama DTPR</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Judul</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Skala</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-2</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-1</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.namaDtpr}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{item.rowData.judul}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.diseminasi === "I"
                          ? "bg-purple-100 text-purple-700"
                          : item.rowData.diseminasi === "N"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-cyan-100 text-cyan-700"
                      }`}>
                        {item.rowData.diseminasi === "I" ? "Internasional" : item.rowData.diseminasi === "N" ? "Nasional" : "Lokal"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-cyan-600">{item.rowData.ts2 || "-"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600">{item.rowData.ts1 || "-"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-indigo-600">{item.rowData.ts || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} disabled={!canEdit} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-2xs font-bold transition-colors ${canEdit ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-slate-50 text-slate-400 cursor-not-allowed"}`}><Edit2 className="h-3 w-3" /> Edit</button>
                        <button onClick={() => openDeleteConfirm(item.id, item.rowData.judul)} disabled={!canEdit} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-2xs font-bold transition-colors ${canEdit ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-slate-50 text-slate-400 cursor-not-allowed"}`}><Trash2 className="h-3 w-3" /> Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>{modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 350 }} className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-soft-sm">
                {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editItem ? "Edit Diseminasi" : "Tambah Diseminasi"}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Hasil PkM DTPR</p>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-700"><Share2 className="h-4 w-4" /> Data Diseminasi</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">Nama DTPR <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Nama dosen" value={form.namaDtpr} onChange={(e) => setForm((p) => ({ ...p, namaDtpr: e.target.value }))} className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm placeholder:text-slate-300" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">Skala Diseminasi</label>
                    <div className="flex gap-2 mt-2">
                      {(["L", "N", "I"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, diseminasi: v }))}
                          className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold transition-all ${
                            form.diseminasi === v
                              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-soft-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:border-cyan-300"
                          }`}
                        >
                          {v === "L" ? "Lokal" : v === "N" ? "Nasional" : "Internasional"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Judul Diseminasi <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Judul diseminasi" value={form.judul} onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))} className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm placeholder:text-slate-300" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Globe className="h-4 w-4" /> Jumlah per Tahun</div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS-2</label><input type="number" min="0" placeholder="0" value={form.ts2} onChange={(e) => setForm((p) => ({ ...p, ts2: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS-1</label><input type="number" min="0" placeholder="0" value={form.ts1} onChange={(e) => setForm((p) => ({ ...p, ts1: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS</label><input type="number" min="0" placeholder="0" value={form.ts} onChange={(e) => setForm((p) => ({ ...p, ts: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Link Bukti</label>
                  <input type="url" placeholder="https://..." value={form.linkBukti} onChange={(e) => setForm((p) => ({ ...p, linkBukti: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"><X className="h-4 w-4" /> Batal</button>
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 12 }} transition={{ type: "spring", damping: 28, stiffness: 380 }} className="w-full max-w-sm rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8">
              <div className="flex justify-center mb-5"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500"><AlertTriangle className="h-8 w-8" /></div></div>
              <h3 className="text-base font-bold text-slate-800 text-center">Hapus Diseminasi?</h3>
              <p className="text-xs font-semibold text-slate-500 text-center mt-1.5">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="mt-5 rounded-xl bg-red-50/70 border border-red-100 px-4 py-3 text-center">
                <p className="text-xs font-bold text-red-700">&ldquo;{deleteConfirmName}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button type="button" onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(""); }} disabled={isDeleting} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">Batal</button>
                <button type="button" onClick={handleDelete} disabled={isDeleting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-red-500 to-rose-600 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-60">
                  {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</> : <><Trash2 className="h-4 w-4" /> Ya, Hapus</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800"><CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} /><span>{toast.message}</span></motion.div>)}</AnimatePresence>
    </div>
  );
}
