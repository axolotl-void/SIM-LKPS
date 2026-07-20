"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, 
  Lightbulb, CheckCircle2, X, Save,
  AlertTriangle, Flag, Sparkles, BookOpen
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface VisiMisiRow {
  id: string;
  rowOrder: number;
  rowData: {
    kategori: "VISI" | "MISI";
    nomor?: number;
    pt: string;
    upps: string;
    ps: string;
    linkBukti?: string;
  };
}

interface Props {
  initialRows: VisiMisiRow[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel6Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState<VisiMisiRow[]>(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<VisiMisiRow | null>(null);
  const [form, setForm] = useState({
    kategori: "VISI" as "VISI" | "MISI",
    nomor: 1,
    pt: "",
    upps: "",
    ps: "",
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

  const visiRows = rows.filter((r) => r.rowData.kategori === "VISI");
  const misiRows = rows.filter((r) => r.rowData.kategori === "MISI").sort((a, b) => (a.rowData.nomor || 0) - (b.rowData.nomor || 0));

  const openAdd = (kategori: "VISI" | "MISI") => {
    setEditItem(null);
    setForm({
      kategori,
      nomor: misiRows.length + 1,
      pt: "",
      upps: "",
      ps: "",
      linkBukti: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item: VisiMisiRow) => {
    setEditItem(item);
    setForm({
      kategori: item.rowData.kategori,
      nomor: item.rowData.nomor || 1,
      pt: item.rowData.pt || "",
      upps: item.rowData.upps || "",
      ps: item.rowData.ps || "",
      linkBukti: item.rowData.linkBukti || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.pt.trim() || !form.upps.trim() || !form.ps.trim()) {
      triggerToast("Pernyataan PT, UPPS, dan PS wajib diisi.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const rowData = {
        kategori: form.kategori,
        nomor: form.kategori === "MISI" ? Number(form.nomor) : undefined,
        pt: form.pt.trim(),
        upps: form.upps.trim(),
        ps: form.ps.trim(),
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updated: VisiMisiRow = {
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
    } catch (e: any) {
      triggerToast(e.message || "Gagal menyimpan.", "error");
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
    } catch (e: any) {
      triggerToast(e.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-6" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 6
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
          {canEdit && (
            <>
              {visiRows.length === 0 && (
                <button onClick={() => openAdd("VISI")} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all">
                  <Plus className="h-4 w-4" /> Set Visi
                </button>
              )}
              <button onClick={() => openAdd("MISI")} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all">
                <Plus className="h-4 w-4" /> Tambah Butir Misi
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/60 px-5 py-4 text-xs font-semibold text-indigo-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-indigo-500" />
        <span>Tabel 6 memetakan keselarasan Visi dan Misi antara Perguruan Tinggi (PT), Fakultas (UPPS), dan Program Studi (PS).</span>
      </div>

      {/* 1. SEKSI VISI */}
      <div className="rounded-3xl border border-slate-100/60 bg-white p-7 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-soft-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">1. Keselarasan Visi</h3>
              <p className="text-2xs font-semibold text-slate-400">Visi PT vs UPPS vs Keilmuan PS</p>
            </div>
          </div>
          {visiRows.length > 0 && canEdit && (
            <button onClick={() => openEdit(visiRows[0]!)} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition-all">
              <Edit2 className="h-3.5 w-3.5" /> Ubah Visi
            </button>
          )}
        </div>

        {visiRows.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400">Belum ada data Visi yang dimasukkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 space-y-2">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Visi PT</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">{visiRows[0]!.rowData.pt}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 space-y-2">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Visi UPPS</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">{visiRows[0]!.rowData.upps}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 space-y-2">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Visi Keilmuan PS</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">{visiRows[0]!.rowData.ps}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. SEKSI MISI */}
      <div className="rounded-3xl border border-slate-100/60 bg-white p-7 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">2. Keselarasan Butir Misi</h3>
              <p className="text-2xs font-semibold text-slate-400">Daftar keselarasan butir-butir misi</p>
            </div>
          </div>
          <span className="text-2xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-xl">{misiRows.length} Butir</span>
        </div>

        {misiRows.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400">Belum ada butir Misi yang dimasukkan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {misiRows.map((item, idx) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-3xs hover:shadow-soft transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">Butir Misi #{item.rowData.nomor ?? (idx + 1)}</span>
                  {canEdit && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteConfirmId(item.id)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/50">
                    <p className="text-3xs font-extrabold uppercase text-slate-400 mb-1">Misi PT</p>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.rowData.pt}</p>
                  </div>
                  <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/50">
                    <p className="text-3xs font-extrabold uppercase text-slate-400 mb-1">Misi UPPS</p>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.rowData.upps}</p>
                  </div>
                  <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/50">
                    <p className="text-3xs font-extrabold uppercase text-slate-400 mb-1">Misi PS</p>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.rowData.ps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM ADD / EDIT */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 350 }} className="w-full max-w-2xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm">
                  {form.kategori === "VISI" ? <Sparkles className="h-6 w-6" /> : <Flag className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editItem ? `Ubah ${form.kategori}` : `Tambah ${form.kategori}`}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Kesesuaian dan Keselarasan Visi Misi</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                {form.kategori === "MISI" && (
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">Nomor Butir Misi <span className="text-red-500">*</span></label>
                    <input type="number" min={1} required value={form.nomor} onChange={(e) => setForm({ ...form, nomor: Number(e.target.value) })} className="w-28 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">{form.kategori} Perguruan Tinggi (PT) <span className="text-red-500">*</span></label>
                    <textarea required rows={3} placeholder={`Tuliskan ${form.kategori.toLowerCase()} tingkat Universitas...`} value={form.pt} onChange={(e) => setForm({ ...form, pt: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-3xs" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">{form.kategori} Fakultas (UPPS) <span className="text-red-500">*</span></label>
                    <textarea required rows={3} placeholder={`Tuliskan ${form.kategori.toLowerCase()} tingkat Fakultas...`} value={form.upps} onChange={(e) => setForm({ ...form, upps: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-3xs" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">{form.kategori === "VISI" ? "Visi Keilmuan Program Studi (PS)" : "Misi Program Studi (PS)"} <span className="text-red-500">*</span></label>
                    <textarea required rows={3} placeholder={`Tuliskan ${form.kategori.toLowerCase()} tingkat Program Studi...`} value={form.ps} onChange={(e) => setForm({ ...form, ps: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-3xs" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">Link Bukti Pendukung (Opsional)</label>
                    <input type="url" placeholder="https://..." value={form.linkBukti} onChange={(e) => setForm({ ...form, linkBukti: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 15 }} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4"><Trash2 className="h-6 w-6" /></div>
              <h3 className="text-base font-bold text-slate-800">Hapus Butir Misi?</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed px-2">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} disabled={isDeleting} className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-soft-sm">Batal</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:bg-red-600 disabled:opacity-50">
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
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-xs font-bold text-white shadow-soft-lg border border-slate-800">
            <CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span>{toast.message}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
