"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Network } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

export function Tabel2B3Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: any) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();
  const [form, setForm] = useState({ kodeCpl: "", rumusanCpl: "", kodeCpmk: "", rumusanCpmk: "", mataKuliah: "" });

  const handleOpenEdit = (r: any) => {
    setEditId(r.id);
    setForm({ kodeCpl: r.rowData.kodeCpl || "", rumusanCpl: r.rowData.rumusanCpl || "", kodeCpmk: r.rowData.kodeCpmk || "", rumusanCpmk: r.rowData.rumusanCpmk || "", mataKuliah: r.rowData.mataKuliah || "" });
    setIsOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await upsertLkpsRow({ tabelKode, tahunAkademikId, rowId: editId, rowData: form });
    setRows(editId ? rows.map((r: any) => r.id === editId ? res : r) : [...rows, res]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Link href="/lkps/bab-2" className="flex gap-2 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
        <div className="flex items-center gap-2.5">
          <ValidationControls
            tabelKode={tabelKode}
            tahunAkademikId={tahunAkademikId}
            currentStatus={currentStatus}
            userRole={userRole}
            onChangeStatus={setCurrentStatus}
            triggerToast={(msg, type) => {}}
          />
          <button
            onClick={() => { setEditId(undefined); setForm({ kodeCpl: "", rumusanCpl: "", kodeCpmk: "", rumusanCpmk: "", mataKuliah: "" }); setIsOpen(true); }}
            disabled={!canEdit}
            className={`rounded-xl px-4 py-2 text-xs font-bold ${
              canEdit
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            + Tambah Peta CPL
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row: any, i: number) => (
          <div key={row.id} className="rounded-3xl bg-white p-5 border border-slate-100 shadow-soft flex gap-5 items-start">
            <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">{i + 1}</div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-3xs font-black text-slate-400 uppercase tracking-widest">{row.rowData.kodeCpl}</span>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">{row.rowData.rumusanCpl}</p>
              </div>
              <div className="border-l border-slate-100 pl-6">
                <span className="text-3xs font-black text-purple-400 uppercase tracking-widest">{row.rowData.kodeCpmk}</span>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">{row.rowData.rumusanCpmk}</p>
              </div>
              <div className="border-l border-slate-100 pl-6">
                <span className="text-3xs font-black text-emerald-400 uppercase tracking-widest">Mata Kuliah</span>
                <p className="mt-1 text-xs font-bold text-emerald-900 leading-relaxed whitespace-pre-wrap">{row.rowData.mataKuliah}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-l border-slate-50 pl-5">
              <button onClick={() => handleOpenEdit(row)} disabled={!canEdit} className={`p-2 rounded-xl ${canEdit ? "bg-slate-50 text-blue-500" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`} title={canEdit ? "Edit" : "Tidak bisa diedit"}><Edit2 className="h-4 w-4" /></button>
              <button onClick={async () => { await deleteLkpsRow({ rowId: row.id, tabelKode }); setRows(rows.filter((r:any) => r.id !== row.id)); }} disabled={!canEdit} className={`p-2 rounded-xl ${canEdit ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`} title={canEdit ? "Hapus" : "Tidak bisa dihapus"}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-3xl bg-white p-7">
              <h3 className="text-lg font-bold mb-6 flex gap-2"><Network className="h-5 w-5 text-indigo-600" /> Relasi Pemenuhan CPL</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold mb-1 text-slate-500">KODE CPL</label>
                    <input required value={form.kodeCpl} onChange={e => setForm({...form, kodeCpl: e.target.value})} className="w-full border p-2 rounded-xl text-xs bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold mb-1 text-slate-500">KODE CPMK</label>
                    <input required value={form.kodeCpmk} onChange={e => setForm({...form, kodeCpmk: e.target.value})} className="w-full border p-2 rounded-xl text-xs bg-slate-50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold mb-1">Rumusan CPL</label>
                    <textarea required rows={4} value={form.rumusanCpl} onChange={e => setForm({...form, rumusanCpl: e.target.value})} className="w-full border p-2.5 rounded-xl text-xs leading-relaxed" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold mb-1">Rumusan CPMK</label>
                    <textarea required rows={4} value={form.rumusanCpmk} onChange={e => setForm({...form, rumusanCpmk: e.target.value})} className="w-full border p-2.5 rounded-xl text-xs leading-relaxed" />
                  </div>
                </div>
                <div>
                  <label className="block text-2xs font-bold mb-1">Daftar Mata Kuliah (Pisahkan dengan koma/enter)</label>
                  <textarea required rows={3} value={form.mataKuliah} onChange={e => setForm({...form, mataKuliah: e.target.value})} className="w-full border p-2.5 rounded-xl text-xs font-mono text-emerald-700 bg-emerald-50/30 border-emerald-100" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400">Batal</button>
                  <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white">Simpan Peta</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
