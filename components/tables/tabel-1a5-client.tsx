"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, 
  FileText, UserCheck, GraduationCap, 
  Briefcase, CheckCircle2, X, Save,
  AlertTriangle, Info, Filter
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface Tabel1A5ClientProps {
  initialRows: {
    id: string;
    rowOrder: number;
    rowData: any;
  }[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel1A5Client({ initialRows, tahunAkademikId, tabelKode }: Tabel1A5ClientProps) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();
  
  // Modals & Toast States
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Form State
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [jenisTendik, setJenisTendik] = useState("Pustakawan");
  const [customJenis, setCustomJenis] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  
  // Kualifikasi counts
  const [s3, setS3] = useState<number | string>(0);
  const [s2, setS2] = useState<number | string>(0);
  const [s1, setS1] = useState<number | string>(0);
  const [d4, setD4] = useState<number | string>(0);
  const [d3, setD3] = useState<number | string>(0);
  const [d2, setD2] = useState<number | string>(0);
  const [d1, setD1] = useState<number | string>(0);
  const [sma, setSma] = useState<number | string>(0);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenAdd = () => {
    setEditId(undefined);
    setJenisTendik("Pustakawan");
    setCustomJenis("");
    setUnitKerja("");
    setS3(0);
    setS2(0);
    setS1(0);
    setD4(0);
    setD3(0);
    setD2(0);
    setD1(0);
    setSma(0);
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    const jt = row.rowData.jenisTendik || "";
    const options = ["Pustakawan", "Laboran/Teknisi", "Administrasi", "Akuntan"];
    if (options.includes(jt)) {
      setJenisTendik(jt);
      setCustomJenis("");
    } else {
      setJenisTendik("Lainnya");
      setCustomJenis(jt);
    }
    setUnitKerja(row.rowData.unitKerja || "");
    setS3(Number(row.rowData.s3 || 0));
    setS2(Number(row.rowData.s2 || 0));
    setS1(Number(row.rowData.s1 || 0));
    setD4(Number(row.rowData.d4 || 0));
    setD3(Number(row.rowData.d3 || 0));
    setD2(Number(row.rowData.d2 || 0));
    setD1(Number(row.rowData.d1 || 0));
    setSma(Number(row.rowData.sma || 0));
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalJenis = jenisTendik === "Lainnya" ? customJenis : jenisTendik;
      const rowData = {
        jenisTendik: finalJenis,
        unitKerja,
        s3: Number(s3),
        s2: Number(s2),
        s1: Number(s1),
        d4: Number(d4),
        d3: Number(d3),
        d2: Number(d2),
        d1: Number(d1),
        sma: Number(sma),
      };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      if (editId) {
        setRows(rows.map((r) => (r.id === editId ? result : r)));
        triggerToast("Perubahan kualifikasi tendik berhasil disimpan", "success");
      } else {
        setRows([...rows, result]);
        triggerToast("Kualifikasi tendik baru berhasil ditambahkan", "success");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteLkpsRow(deleteId, `/lkps/bab-1/tabel-${tabelKode.toLowerCase().replace(/\./g, "")}`);
      setRows(rows.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      triggerToast("Data kualifikasi tendik berhasil dihapus", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus data.", "error");
    }
  };

  // Aggregated totals
  const totalS3 = rows.reduce((sum, r) => sum + Number(r.rowData.s3 || 0), 0);
  const totalS2 = rows.reduce((sum, r) => sum + Number(r.rowData.s2 || 0), 0);
  const totalS1 = rows.reduce((sum, r) => sum + Number(r.rowData.s1 || 0), 0);
  const totalD4 = rows.reduce((sum, r) => sum + Number(r.rowData.d4 || 0), 0);
  const totalD3 = rows.reduce((sum, r) => sum + Number(r.rowData.d3 || 0), 0);
  const totalD2 = rows.reduce((sum, r) => sum + Number(r.rowData.d2 || 0), 0);
  const totalD1 = rows.reduce((sum, r) => sum + Number(r.rowData.d1 || 0), 0);
  const totalSma = rows.reduce((sum, r) => sum + Number(r.rowData.sma || 0), 0);
  const totalAll = totalS3 + totalS2 + totalS1 + totalD4 + totalD3 + totalD2 + totalD1 + totalSma;

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/lkps/bab-1"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Tabel
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Tambah Data
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-xs font-semibold text-slate-400 shadow-soft">
            Belum ada data kualifikasi Tenaga Kependidikan. Silakan tambah data baru.
          </div>
        ) : (
          rows.map((row, index) => {
            const rd = row.rowData;
            const rowTotal = 
              Number(rd.s3 || 0) + 
              Number(rd.s2 || 0) + 
              Number(rd.s1 || 0) + 
              Number(rd.d4 || 0) + 
              Number(rd.d3 || 0) + 
              Number(rd.d2 || 0) + 
              Number(rd.d1 || 0) + 
              Number(rd.sma || 0);

            const educations = [
              { key: "S3", value: rd.s3 },
              { key: "S2", value: rd.s2 },
              { key: "S1", value: rd.s1 },
              { key: "D4", value: rd.d4 },
              { key: "D3", value: rd.d3 },
              { key: "D2", value: rd.d2 },
              { key: "D1", value: rd.d1 },
              { key: "SMA/SMK/MA", value: rd.sma },
            ];

            return (
              <div 
                key={row.id}
                className="rounded-3xl bg-white border border-slate-100/50 p-5.5 shadow-soft hover:shadow-soft-lg hover:border-slate-200/40 transition-all duration-200"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    {/* Header Info */}
                    <div className="flex items-center gap-2">
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        NO. {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                        {rd.jenisTendik}
                      </h3>
                    </div>
                    
                    {/* Unit Kerja */}
                    <div className="flex items-center gap-2 text-2xs font-semibold text-slate-500">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      <span>Unit Kerja:</span>
                      <span className="text-slate-700 font-bold">{rd.unitKerja}</span>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(row)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20 transition-all shadow-3xs"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(row.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/20 transition-all shadow-3xs"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-slate-100/60" />

                {/* Education Grid & Total Staff */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-3xs font-black uppercase text-slate-400 mr-1 tracking-wider">
                      Distribusi Pendidikan:
                    </span>
                    {educations.map((edu) => {
                      if (!edu.value || Number(edu.value) === 0) return null;
                      return (
                        <div 
                          key={edu.key}
                          className="inline-flex items-center rounded-xl bg-slate-50/80 px-2.5 py-1.5 border border-slate-100 text-2xs font-semibold shadow-3xs"
                        >
                          <span className="text-slate-400 font-medium mr-1.5">{edu.key}:</span>
                          <span className="text-slate-800 font-bold">{edu.value}</span>
                        </div>
                      );
                    })}
                    {rowTotal === 0 && (
                      <span className="text-2xs font-medium text-slate-400 italic">
                        Belum diisi
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100/30 px-3.5 py-2 flex items-center gap-2 shadow-3xs shrink-0 ml-auto">
                    <span className="text-3xs font-black uppercase tracking-wider text-indigo-500">
                      Total Staf
                    </span>
                    <span className="text-xs font-black text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-100/50">
                      {rowTotal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Aggregate Bottom Banner (Total Akumulatif) */}
      {rows.length > 0 && (
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-soft-lg border border-slate-850 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300">
            Total Akumulatif Kualifikasi Tenaga Kependidikan
          </h4>
          
          <div className="grid grid-cols-2 gap-3.5 mt-5 sm:grid-cols-4 lg:grid-cols-9">
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">S3</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalS3}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">S2</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalS2}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">S1</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalS1}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">D4</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalD4}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">D3</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalD3}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">D2</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalD2}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">D1</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalD1}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/30 text-center col-span-2 sm:col-span-1">
              <div className="text-4xs font-black text-slate-400 uppercase tracking-wider">SMA/SMK</div>
              <div className="text-sm font-extrabold text-white mt-1">{totalSma}</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-3 text-center col-span-2 sm:col-span-4 lg:col-span-1 shadow-md">
              <div className="text-4xs font-black text-indigo-100 uppercase tracking-wider">TOTAL</div>
              <div className="text-sm font-black text-white mt-1">{totalAll}</div>
            </div>
          </div>
        </div>
      )}

      {/* Save Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg ${
              toast.type === "success" 
                ? "bg-slate-900 border border-slate-800" 
                : "bg-red-600 border border-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 animate-bounce" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-white shrink-0 animate-pulse" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg border border-slate-100 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4 border border-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-850">Hapus Kualifikasi Tendik?</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data kualifikasi tenaga kependidikan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-750 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-7 shadow-soft-lg border border-slate-100 my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                  {editId ? "Edit Kualifikasi Tendik" : "Tambah Kualifikasi Tendik"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Jenis Tendik */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Jenis Tendik
                    </label>
                    <select
                      value={jenisTendik}
                      onChange={(e) => setJenisTendik(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    >
                      <option value="Pustakawan">Pustakawan</option>
                      <option value="Laboran/Teknisi">Laboran/Teknisi</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Akuntan">Akuntan</option>
                      <option value="Lainnya">Lainnya (Ketik Manual)</option>
                    </select>
                  </div>

                  {/* Unit Kerja */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Unit Kerja
                    </label>
                    <input
                      type="text"
                      required
                      value={unitKerja}
                      onChange={(e) => setUnitKerja(e.target.value)}
                      placeholder="e.g. UPT Perpustakaan"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    />
                  </div>

                  {/* Custom Jenis Input */}
                  {jenisTendik === "Lainnya" && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        Ketik Jenis Tendik Manual
                      </label>
                      <input
                        type="text"
                        required
                        value={customJenis}
                        onChange={(e) => setCustomJenis(e.target.value)}
                        placeholder="e.g. Petugas Keamanan, Sopir"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                      />
                    </div>
                  )}
                </div>

                {/* Subtitle Pendidikan */}
                <div className="pt-2 border-t border-slate-100/80">
                  <h4 className="text-2xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    Jumlah Staf Berdasarkan Pendidikan Terakhir
                  </h4>
                </div>

                {/* Grid Inputs for Education */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">S3</label>
                    <input
                      type="number"
                      min="0"
                      value={s3}
                      onChange={(e) => setS3(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">S2</label>
                    <input
                      type="number"
                      min="0"
                      value={s2}
                      onChange={(e) => setS2(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">S1</label>
                    <input
                      type="number"
                      min="0"
                      value={s1}
                      onChange={(e) => setS1(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">D4</label>
                    <input
                      type="number"
                      min="0"
                      value={d4}
                      onChange={(e) => setD4(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">D3</label>
                    <input
                      type="number"
                      min="0"
                      value={d3}
                      onChange={(e) => setD3(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">D2</label>
                    <input
                      type="number"
                      min="0"
                      value={d2}
                      onChange={(e) => setD2(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">D1</label>
                    <input
                      type="number"
                      min="0"
                      value={d1}
                      onChange={(e) => setD1(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">SMA/SMK</label>
                    <input
                      type="number"
                      min="0"
                      value={sma}
                      onChange={(e) => setSma(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50/50 border border-amber-100 p-3.5 text-3xs font-semibold leading-relaxed text-amber-800">
                  <Info className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>
                    Pastikan jumlah kualifikasi pendidikan diisi berdasarkan data riil dari kepegawaian institusi. Isian kosong akan dihitung sebagai 0.
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
