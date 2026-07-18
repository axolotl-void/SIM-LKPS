"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Handshake, Globe, DollarSign, Edit2, Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface KerjasamaItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    judulKerjasama: string;
    mitraKerja: string;
    sumber: "L" | "N" | "I";
    durasi: number;
    danaTs2: number;
    danaTs1: number;
    danaTs: number;
    linkBukti: string;
  };
}

interface Props {
  initialRows: KerjasamaItem[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel3C1Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<KerjasamaItem | null>(null);
  const [form, setForm] = useState({ judulKerjasama: "", mitraKerja: "", sumber: "L" as "L" | "N" | "I", durasi: "", danaTs2: "", danaTs1: "", danaTs: "", linkBukti: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => { setEditItem(null); setForm({ judulKerjasama: "", mitraKerja: "", sumber: "L", durasi: "", danaTs2: "", danaTs1: "", danaTs: "", linkBukti: "" }); setModalOpen(true); };
  const openEdit = (item: KerjasamaItem) => {
    setEditItem(item);
    setForm({
      judulKerjasama: item.rowData.judulKerjasama || "",
      mitraKerja: item.rowData.mitraKerja || "",
      sumber: item.rowData.sumber || "L",
      durasi: String(item.rowData.durasi || ""),
      danaTs2: String(item.rowData.danaTs2 || ""),
      danaTs1: String(item.rowData.danaTs1 || ""),
      danaTs: String(item.rowData.danaTs || ""),
      linkBukti: item.rowData.linkBukti || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.judulKerjasama.trim() || !form.mitraKerja.trim()) { triggerToast("Judul dan Mitra harus diisi.", "error"); return; }
    setIsLoading(true);
    try {
      const rowData = { tahun: "TS", judulKerjasama: form.judulKerjasama.trim(), mitraKerja: form.mitraKerja.trim(), sumber: form.sumber, durasi: Number(form.durasi) || 0, danaTs2: Number(form.danaTs2) || 0, danaTs1: Number(form.danaTs1) || 0, danaTs: Number(form.danaTs) || 0, linkBukti: form.linkBukti.trim() };
      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({ tabelKode, tahunAkademikId, rowId: isUpdate ? editItem.id : undefined, rowData });
      const updated: KerjasamaItem = { id: result.id, rowOrder: result.rowOrder, rowData };
      if (editItem) setRows(rows.map((r) => (r.id === editItem.id ? updated : r)));
      else setRows([...rows, updated]);
      setModalOpen(false);
      triggerToast(editItem ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.", "success");
      router.refresh();
    } catch { triggerToast("Gagal menyimpan.", "error"); } finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    setIsLoading(true);
    try { await deleteLkpsRow({ tabelKode, rowId: id }); setRows(rows.filter((r) => r.id !== id)); triggerToast("Berhasil dihapus.", "success"); router.refresh(); }
    catch { triggerToast("Gagal menghapus.", "error"); } finally { setIsLoading(false); }
  };

  const totalDanaTs = rows.reduce((a, r) => a + (r.rowData.danaTs || 0), 0);
  const totalMitra = rows.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-3" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"><ArrowLeft className="h-4 w-4" /> Kembali ke BAB 3</Link>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"><Plus className="h-4 w-4" /> Tambah Kerjasama</button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-blue-50/60 border border-blue-100/60 px-5 py-4 text-xs font-semibold text-blue-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-blue-500" />
        <span>Catat kerjasama penelitian dengan mitra kerja termasuk sumber pendanaan.</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all"><div className="space-y-2"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Jumlah Mitra</div><p className="text-3xl font-black text-slate-800">{totalMitra}</p></div></div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all"><div className="space-y-2"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Dana TS</div><p className="text-3xl font-black text-blue-600">{totalDanaTs.toLocaleString("id-ID")} jt</p></div></div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all"><div className="space-y-2"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Skala Internasional</div><p className="text-3xl font-black text-indigo-600">{rows.filter((r) => r.rowData.sumber === "I").length}</p></div></div>
      </div>

      <div className="rounded-2xl border-2 border-blue-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"><Handshake className="h-5 w-5 text-white" /></div>
              <div><h3 className="text-sm font-bold text-white">Kerjasama Penelitian</h3><p className="text-2xs font-semibold text-blue-200">Mitra kerja dan pendanaan</p></div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">{rows.length} items</span>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="p-12 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"><Handshake className="h-8 w-8 text-slate-400" /></div><p className="text-sm font-semibold text-slate-500">Belum ada data kerjasama.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Judul Kerjasama</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Mitra</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Skala</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-2</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-1</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr></thead>
              <tbody>{rows.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.judulKerjasama}</td>
                  <td className="px-4 py-3 text-slate-600">{item.rowData.mitraKerja}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex rounded-lg px-2.5 py-1 text-2xs font-bold ${item.rowData.sumber === "I" ? "bg-purple-100 text-purple-700" : item.rowData.sumber === "N" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{item.rowData.sumber === "I" ? "Internasional" : item.rowData.sumber === "N" ? "Nasional" : "Lokal"}</span></td>
                  <td className="px-4 py-3 text-center font-semibold text-emerald-600">{item.rowData.danaTs2 > 0 ? item.rowData.danaTs2 + " jt" : "-"}</td>
                  <td className="px-4 py-3 text-center font-semibold text-cyan-600">{item.rowData.danaTs1 > 0 ? item.rowData.danaTs1 + " jt" : "-"}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{item.rowData.danaTs > 0 ? item.rowData.danaTs + " jt" : "-"}</td>
                  <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(item)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-2xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"><Edit2 className="h-3 w-3" /> Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-2xs font-bold text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="h-3 w-3" /> Hapus</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>{modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 350 }} className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-soft-sm">{editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}</div>
              <div><h3 className="text-lg font-bold text-slate-800">{editItem ? "Edit Kerjasama" : "Tambah Kerjasama Penelitian"}</h3><p className="text-xs text-slate-500 font-semibold mt-0.5">Mitra dan Pendanaan</p></div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700"><Handshake className="h-4 w-4" /> Identitas Kerjasama</div>
                <div><label className="block text-2xs font-bold text-slate-600 mb-1">Judul Kerjasama <span className="text-red-500">*</span></label><input type="text" placeholder="Judul kegiatan kerjasama" value={form.judulKerjasama} onChange={(e) => setForm((p) => ({ ...p, judulKerjasama: e.target.value }))} className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">Mitra Kerja <span className="text-red-500">*</span></label><input type="text" placeholder="Nama mitra" value={form.mitraKerja} onChange={(e) => setForm((p) => ({ ...p, mitraKerja: e.target.value }))} className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" /></div>
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">Skala / Sumber</label><div className="flex gap-2">{(["L", "N", "I"] as const).map((v) => (<button key={v} type="button" onClick={() => setForm((p) => ({ ...p, sumber: v }))} className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${form.sumber === v ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>{v === "L" ? "Lokal" : v === "N" ? "Nasional" : "Internasional"}</button>))}</div></div>
                </div>
                <div><label className="block text-2xs font-bold text-slate-600 mb-1">Durasi (tahun)</label><input type="number" min="0" placeholder="1" value={form.durasi} onChange={(e) => setForm((p) => ({ ...p, durasi: e.target.value }))} className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" /></div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><DollarSign className="h-4 w-4" /> Pendanaan (juta rupiah)</div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS-2</label><input type="number" min="0" placeholder="0" value={form.danaTs2} onChange={(e) => setForm((p) => ({ ...p, danaTs2: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS-1</label><input type="number" min="0" placeholder="0" value={form.danaTs1} onChange={(e) => setForm((p) => ({ ...p, danaTs1: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                  <div><label className="block text-2xs font-bold text-slate-600 mb-1">TS</label><input type="number" min="0" placeholder="0" value={form.danaTs} onChange={(e) => setForm((p) => ({ ...p, danaTs: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
                </div>
                <div><label className="block text-2xs font-bold text-slate-600 mb-1">Link Bukti</label><input type="url" placeholder="https://..." value={form.linkBukti} onChange={(e) => setForm((p) => ({ ...p, linkBukti: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300" /></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"><X className="h-4 w-4" /> Batal</button>
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan</>}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800"><CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} /><span>{toast.message}</span></motion.div>)}</AnimatePresence>
    </div>
  );
}
