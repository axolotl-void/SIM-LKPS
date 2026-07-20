"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, GraduationCap, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

export function Tabel2B2Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: any) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();
  const [form, setForm] = useState({ kodeCpl: "", pl01: false, pl02: false, pl03: false, pl04: false, pl05: false });

  const handleOpenEdit = (r: any) => {
    setEditId(r.id);
    setForm({ kodeCpl: r.rowData.kodeCpl || "", pl01: !!r.rowData.pl01, pl02: !!r.rowData.pl02, pl03: !!r.rowData.pl03, pl04: !!r.rowData.pl04, pl05: !!r.rowData.pl05 });
    setIsOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await upsertLkpsRow({ tabelKode, tahunAkademikId, rowId: editId, rowData: form });
    setRows(editId ? rows.map((r: any) => r.id === editId ? res : r) : [...rows, res]);
    setIsOpen(false);
  };

  const CheckMark = ({ v }: { v: boolean }) => v ? <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black mx-auto">V</div> : <div className="h-5 w-5 rounded-full border border-slate-100 mx-auto" />;

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
            onClick={() => { setEditId(undefined); setForm({ kodeCpl: "", pl01: false, pl02: false, pl03: false, pl04: false, pl05: false }); setIsOpen(true); }}
            disabled={!canEdit}
            className={`rounded-xl px-4 py-2 text-xs font-bold ${
              canEdit
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            + Tambah Mapping
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-50 text-2xs font-black uppercase text-slate-400 border-b">
              <th className="p-4 w-20">No</th>
              <th className="p-4 text-left">Kode CPL</th>
              {[1,2,3,4,5].map(n => <th key={n} className="p-4">PL0{n}</th>)}
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row: any, i: number) => (
              <tr key={row.id}>
                <td className="p-4 font-bold text-slate-400">{i + 1}</td>
                <td className="p-4 text-left font-black text-indigo-900">{row.rowData.kodeCpl}</td>
                {[1,2,3,4,5].map(n => <td key={n} className="p-4"><CheckMark v={row.rowData[`pl0${n}`]} /></td>)}
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => handleOpenEdit(row)} disabled={!canEdit} className={`${canEdit ? "text-slate-400 hover:text-blue-600" : "text-slate-300 cursor-not-allowed"}`} title={canEdit ? "Edit" : "Tidak bisa diedit"}><Edit2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-3xl bg-white p-7">
              <h3 className="text-lg font-bold mb-6 flex gap-2"><GraduationCap className="h-5 w-5 text-indigo-600" /> Mapping CPL → Profil</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-2xs font-bold mb-1">Kode CPL</label><input required value={form.kodeCpl} onChange={e => setForm({...form, kodeCpl: e.target.value})} className="w-full border p-2 rounded-xl text-xs" placeholder="Misal: CPL-01" /></div>
                <div className="grid grid-cols-5 gap-2">
                  {[1,2,3,4,5].map(n => (
                    <label key={n} className="flex flex-col items-center gap-2 p-3 border rounded-2xl cursor-pointer hover:bg-slate-50">
                      <span className="text-[10px] font-black text-slate-400">PL0{n}</span>
                      <input type="checkbox" checked={(form as any)[`pl0${n}`]} onChange={e => setForm({...form, [`pl0${n}`]: e.target.checked})} className="rounded text-indigo-600" />
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400">Batal</button>
                  <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white">Simpan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
