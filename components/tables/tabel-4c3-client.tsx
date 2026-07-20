"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Award, FileText, Edit2, Lightbulb, AlertTriangle, CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface HkiPkmItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    judul: string;
    jenisHki: string;
    namaDtpr: string;
    ts2: boolean;
    ts1: boolean;
    ts: boolean;
    linkBukti: string;
  };
}

interface Props {
  initialRows: HkiPkmItem[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel4C3Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<HkiPkmItem | null>(null);
  const [form, setForm] = useState({
    judul: "", jenisHki: "", namaDtpr: "",
    ts2: false, ts1: false, ts: false, linkBukti: "",
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
    setForm({ judul: "", jenisHki: "", namaDtpr: "", ts2: false, ts1: false, ts: false, linkBukti: "" });
    setModalOpen(true);
  };

  const openEdit = (item: HkiPkmItem) => {
    setEditItem(item);
    setForm({
      judul: item.rowData.judul || "",
      jenisHki: item.rowData.jenisHki || "",
      namaDtpr: item.rowData.namaDtpr || "",
      ts2: item.rowData.ts2 || false,
      ts1: item.rowData.ts1 || false,
      ts: item.rowData.ts || false,
      linkBukti: item.rowData.linkBukti || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judul.trim() || !form.namaDtpr.trim()) {
      triggerToast("Judul dan Nama DTPR harus diisi.", "error"); return;
    }
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "TS",
        judul: form.judul.trim(),
        jenisHki: form.jenisHki.trim(),
        namaDtpr: form.namaDtpr.trim(),
        ts2: form.ts2,
        ts1: form.ts1,
        ts: form.ts,
        linkBukti: form.linkBukti.trim(),
      };
      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode, tahunAkademikId, rowId: isUpdate ? editItem.id : undefined, rowData,
      });
      const updated: HkiPkmItem = { id: result.id, rowOrder: result.rowOrder, rowData };
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-4" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-600 transition-colors">
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
          <button onClick={openAdd} disabled={!canEdit} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm hover:shadow-soft transition-all ${canEdit ? "bg-gradient-to-tr from-pink-500 to-rose-600 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
            <Plus className="h-4 w-4" /> Tambah HKI PkM
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-pink-50/60 border border-pink-100/60 px-5 py-4 text-xs font-semibold text-pink-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-pink-500" />
        <span>Catat perolehan HKI dari hasil PkM. Centang tahun perolehan (TS-2, TS-1, TS).</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total HKI</div>
          <p className="text-3xl font-black mt-2 text-slate-800">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Jenis HKI Berbeda</div>
          <p className="text-3xl font-black mt-2 text-pink-600">{new Set(rows.map((r) => r.rowData.jenisHki)).size}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">DTPR Unik</div>
          <p className="text-3xl font-black mt-2 text-rose-600">{new Set(rows.map((r) => r.rowData.namaDtpr)).size}</p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-pink-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Perolehan HKI PkM</h3>
                <p className="text-2xs font-semibold text-pink-200">Hak Kekayaan Intelektual hasil PkM</p>
              </div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">{rows.length} items</span>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Award className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data HKI PkM.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Judul HKI</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Jenis HKI</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Nama DTPR</th>
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
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.judul}</td>
                    <td className="px-4 py-3 text-slate-600">{item.rowData.jenisHki || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{item.rowData.namaDtpr}</td>
                    <td className="px-4 py-3 text-center">
                      {item.rowData.ts2 ? <span className="inline-flex items-center rounded-lg bg-rose-100 px-2.5 py-1 text-2xs font-bold text-rose-700"><CalendarCheck className="h-3 w-3 mr-1" /> TS-2</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.rowData.ts1 ? <span className="inline-flex items-center rounded-lg bg-pink-100 px-2.5 py-1 text-2xs font-bold text-pink-700"><CalendarCheck className="h-3 w-3 mr-1" /> TS-1</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.rowData.ts ? <span className="inline-flex items-center rounded-lg bg-fuchsia-100 px-2.5 py-1 text-2xs font-bold text-fuchsia-700"><CalendarCheck className="h-3 w-3 mr-1" /> TS</span> : <span className="text-slate-300">—</span>}
                    </td>
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
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 350 }} className="w-full max-w-md rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-soft-sm">
                {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editItem ? "Edit HKI PkM" : "Tambah Perolehan HKI PkM"}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Hak Kekayaan Intelektual</p>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              <div className="rounded-2xl border border-pink-100 bg-pink-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-700"><Award className="h-4 w-4" /> Data HKI</div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Judul HKI <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="cth: Aplikasi X" value={form.judul} onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))} className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Jenis HKI</label>
                  <input type="text" placeholder="cth: Paten, Hak Cipta, Merek" value={form.jenisHki} onChange={(e) => setForm((p) => ({ ...p, jenisHki: e.target.value }))} className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1">Nama DTPR <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Nama lengkap" value={form.namaDtpr} onChange={(e) => setForm((p) => ({ ...p, namaDtpr: e.target.value }))} className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm placeholder:text-slate-300" />
                </div>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700"><CalendarCheck className="h-4 w-4" /> Tahun Perolehan</div>
                <div className="flex gap-3">
                  {[
                    { key: "ts2" as const, label: "TS-2" },
                    { key: "ts1" as const, label: "TS-1" },
                    { key: "ts" as const, label: "TS" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, [key]: !p[key] }))}
                      className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold transition-all ${
                        form[key]
                          ? "bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-soft-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-pink-300"
                      }`}
                    >
                      {form[key] ? <><CalendarCheck className="h-4 w-4 inline mr-1" /> {label}</> : label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
                <label className="block text-2xs font-bold text-slate-600 mb-1">Link Bukti / Sertifikat</label>
                <input type="url" placeholder="https://..." value={form.linkBukti} onChange={(e) => setForm((p) => ({ ...p, linkBukti: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"><X className="h-4 w-4" /> Batal</button>
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
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
              <h3 className="text-base font-bold text-slate-800 text-center">Hapus HKI PkM?</h3>
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
