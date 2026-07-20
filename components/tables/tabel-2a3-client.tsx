"use client";

import { useState } from "react";
import {
  Plus, Edit2, Trash2, Loader2, ArrowLeft,
  Users, CheckCircle2, X, Save,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Tabel2A3ClientProps {
  initialRows: {
    id: string;
    rowOrder: number;
    rowData: any;
  }[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel2A3Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Tabel2A3ClientProps) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();

  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const kategoriPilihan = [
    "Mahasiswa Baru",
    "Mahasiswa Aktif pada saat TS",
    "Lulus pada saat TS",
    "Mengundurkan Diri/DO pada saat TS",
  ];

  const handleOpenAdd = () => {
    setEditId(undefined);
    setKategori("");
    setJumlah("");
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    setKategori(row.rowData.kategori || "");
    setJumlah(row.rowData.ts !== undefined ? String(row.rowData.ts) : "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawJumlah = Number(jumlah) || 0;
      const rowData = { kategori, nominal: rawJumlah };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      const updatedRow = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          kategori: result.rowData.kategori,
          ts: Number(result.rowData.nominal) || 0,
          ts1: editId ? (rows.find(r => r.id === editId)?.rowData.ts1 || 0) : 0,
          ts2: editId ? (rows.find(r => r.id === editId)?.rowData.ts2 || 0) : 0,
        },
      };

      if (editId) {
        setRows(rows.map(r => (r.id === editId ? updatedRow : r)));
        triggerToast("Data diperbarui", "success");
      } else {
        setRows([...rows, updatedRow]);
        triggerToast("Data ditambahkan", "success");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menyimpan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteLkpsRow({ rowId: deleteId, tabelKode });
      setRows(rows.filter(r => r.id !== deleteId));
      setDeleteId(null);
      triggerToast("Data dihapus", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus.", "error");
    }
  };

  const totalTs2 = rows.reduce((acc, r) => acc + (Number(r.rowData.ts2) || 0), 0);
  const totalTs1 = rows.reduce((acc, r) => acc + (Number(r.rowData.ts1) || 0), 0);
  const totalTs = rows.reduce((acc, r) => acc + (Number(r.rowData.ts) || 0), 0);
  const grandTotal = rows.reduce((acc, r) => acc + (Number(r.rowData.ts2) || 0) + (Number(r.rowData.ts1) || 0) + (Number(r.rowData.ts) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
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
            onClick={handleOpenAdd}
            disabled={!canEdit}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-soft-sm transition-all ${
              canEdit
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" /> Tambah Data
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 px-6 py-2.5 text-2xs font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-1">No</div>
          <div className="col-span-4">Kondisi</div>
          <div className="col-span-2 text-center">TS-2</div>
          <div className="col-span-2 text-center">TS-1</div>
          <div className="col-span-1 text-center">TS</div>
          <div className="col-span-1 text-center">Jumlah</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-xs font-semibold text-slate-400 shadow-soft">
            Belum ada data. Silakan tambah data baru.
          </div>
        ) : (
          <>
            {rows.map((row, index) => {
              const rowTotal = (Number(row.rowData.ts2) || 0) + (Number(row.rowData.ts1) || 0) + (Number(row.rowData.ts) || 0);
              return (
                <div key={row.id} className="grid grid-cols-12 items-center rounded-3xl bg-white p-4 border border-slate-100/50 shadow-soft hover:shadow-soft-lg transition-all gap-4">
                  <div className="col-span-1 flex justify-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-500 border border-slate-100">{index + 1}</div>
                  </div>
                  <div className="col-span-4 text-xs font-bold text-slate-800">{row.rowData.kategori}</div>
                  <div className="col-span-2 text-xs font-bold text-slate-400 text-center">{row.rowData.ts2 || "-"}</div>
                  <div className="col-span-2 text-xs font-bold text-slate-400 text-center">{row.rowData.ts1 || "-"}</div>
                  <div className="col-span-1 text-xs font-bold text-indigo-600 text-center">{row.rowData.ts || "-"}</div>
                  <div className="col-span-1 text-xs font-black text-slate-700 text-center">{rowTotal}</div>
                  <div className="col-span-1 flex justify-center gap-1.5">
                    <button onClick={() => handleOpenEdit(row)} disabled={!canEdit} className={`p-1.5 ${canEdit ? "text-slate-400 hover:text-blue-600" : "text-slate-300 cursor-not-allowed"} transition-colors`} title={canEdit ? "Edit" : "Tidak bisa diedit"}><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(row.id)} disabled={!canEdit} className={`p-1.5 ${canEdit ? "text-slate-400 hover:text-red-600" : "text-slate-300 cursor-not-allowed"} transition-colors`} title={canEdit ? "Hapus" : "Tidak bisa dihapus"}><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              );
            })}

            {/* Total Row */}
            <div className="grid grid-cols-12 items-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-600 p-5 text-white shadow-soft-lg gap-4 border border-white/10">
              <div className="col-span-5 text-xs font-black px-2 uppercase tracking-widest">Jumlah Total</div>
              <div className="col-span-2 text-center text-xs font-black text-white/90">{totalTs2}</div>
              <div className="col-span-2 text-center text-xs font-black text-white/90">{totalTs1}</div>
              <div className="col-span-1 text-center text-xs font-black text-emerald-300 drop-shadow-sm">{totalTs}</div>
              <div className="col-span-1 text-center text-xs font-black text-yellow-300 drop-shadow-sm">{grandTotal}</div>
              <div className="col-span-1"></div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-soft-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600" /> {editId ? "Edit Data" : "Tambah Data"}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1.5">Kondisi Mahasiswa</label>
                  <select required value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none">
                    <option value="" disabled>Pilih Kondisi</option>
                    {kategoriPilihan.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1.5">Jumlah (TS)</label>
                  <input type="number" required min="0" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
                  <button type="submit" disabled={isLoading} className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white shadow-soft hover:bg-indigo-700 disabled:opacity-50 transition-all">
                    {isLoading ? "Proses..." : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg text-center relative"
            >
              <button onClick={() => setDeleteId(null)} className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 shadow-soft-sm">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Data</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed px-2">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-soft-sm transition-colors">
                  Batal
                </button>
                <button onClick={handleDeleteConfirm} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:bg-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 right-6 z-50 w-full max-w-xs">
            <motion.div
              initial={{ x: 120, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 120, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="flex items-center gap-3.5 rounded-2xl bg-white/90 backdrop-blur-md p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100/80"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                toast.type === "success"
                  ? "bg-emerald-50/80 text-emerald-500 border-emerald-500/10"
                  : "bg-rose-50/80 text-rose-500 border-rose-500/10"
              }`}>
                {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-slate-800">{toast.type === "success" ? "Berhasil!" : "Gagal!"}</p>
                <p className="text-2xs font-semibold text-slate-400 mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-slate-300 hover:text-slate-500 rounded-lg p-1">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
