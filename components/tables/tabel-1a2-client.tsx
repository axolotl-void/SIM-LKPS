"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, 
  FileText, Wallet, CheckCircle2, X, Save,
  ChevronDown, Link as LinkIcon, Filter
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface Tabel1A2ClientProps {
  initialRows: {
    id: string;
    rowOrder: number;
    rowData: any;
  }[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel1A2Client({ initialRows, tahunAkademikId, tabelKode }: Tabel1A2ClientProps) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();
  
  // Modals & Toast States
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Form State (Single Nominal for TS - Rollover logic handles TS-1 and TS-2)
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [sumberPendanaan, setSumberPendanaan] = useState("");
  const [nominal, setNominal] = useState(""); // Formatted with dots as string
  const [linkBukti, setLinkBukti] = useState("");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper to format string into Indonesian thousand separator
  const formatThousand = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("id-ID").format(Number(clean));
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatThousand(e.target.value);
    setNominal(formatted);
  };

  // Predefined sources for consistency
  const sumberPilihan = [
    "Dana dari PT / UPPS",
    "Dana dari Yayasan",
    "Dana dari Pemerintah (Pusat / Daerah)",
    "Dana dari DUDIKA (Dunia Usaha / Dunia Industri)",
    "Dana dari Hibah Penelitian",
    "Dana dari Pengabdian Masyarakat (PkM)",
    "Dana dari Mahasiswa (SPP / UKT)",
    "Sumber Pendanaan Lainnya"
  ];

  const handleOpenAdd = () => {
    setEditId(undefined);
    setSumberPendanaan("");
    setNominal("");
    setLinkBukti("");
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    setSumberPendanaan(row.rowData.sumberPendanaan || "");
    setNominal(row.rowData.ts !== undefined ? formatThousand(String(row.rowData.ts)) : "");
    setLinkBukti(row.rowData.linkBukti || "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse formatted string back to raw number
      const rawNominal = Number(nominal.replace(/\./g, "")) || 0;

      const rowData = {
        sumberPendanaan,
        nominal: rawNominal,
        linkBukti,
      };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      // Recalculate local state merged representation
      const updatedRow = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          sumberPendanaan: result.rowData.sumberPendanaan,
          ts: Number(result.rowData.nominal) || 0,
          ts1: editId ? (rows.find(r => r.id === editId)?.rowData.ts1 || 0) : 0,
          ts2: editId ? (rows.find(r => r.id === editId)?.rowData.ts2 || 0) : 0,
          linkBukti: result.rowData.linkBukti || "",
        }
      };

      if (editId) {
        setRows(rows.map((r) => (r.id === editId ? updatedRow : r)));
        triggerToast("Perubahan pendanaan berhasil disimpan", "success");
      } else {
        setRows([...rows, updatedRow]);
        triggerToast("Sumber pendanaan baru berhasil ditambahkan", "success");
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
      triggerToast("Data pendanaan berhasil dihapus", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus data.", "error");
    }
  };

  // Calculations
  const totalTs2 = rows.reduce((acc, row) => acc + (Number(row.rowData.ts2) || 0), 0);
  const totalTs1 = rows.reduce((acc, row) => acc + (Number(row.rowData.ts1) || 0), 0);
  const totalTs = rows.reduce((acc, row) => acc + (Number(row.rowData.ts) || 0), 0);

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
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Tambah Data
          </button>
        </div>
      </div>

      {/* Card List Table Header */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 px-6 py-2.5 text-2xs font-bold uppercase tracking-wider text-slate-400 select-none">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Sumber Pendanaan</div>
          <div className="col-span-2 text-right">TS-2 (Juta Rp)</div>
          <div className="col-span-2 text-right">TS-1 (Juta Rp)</div>
          <div className="col-span-2 text-right">TS (Juta Rp)</div>
          <div className="col-span-1 text-center">Bukti</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {/* Card Rows */}
        {rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-xs font-semibold text-slate-400 shadow-soft">
            Belum ada data pendanaan. Silakan tambah data baru.
          </div>
        ) : (
          <>
            {rows.map((row, index) => (
              <div 
                key={row.id} 
                className="grid grid-cols-12 items-center rounded-3xl bg-white p-4.5 border border-slate-100/50 shadow-soft hover:shadow-soft-lg hover:border-slate-200/40 transition-all duration-200 gap-4"
              >
                {/* No Box */}
                <div className="col-span-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100/60 text-xs font-bold text-slate-600">
                    {index + 1}
                  </div>
                </div>
                
                {/* Sumber Pendanaan */}
                <div className="col-span-3 text-xs font-bold text-slate-800 leading-snug">
                  {row.rowData.sumberPendanaan}
                </div>

                {/* TS-2 (Read-only historical data) */}
                <div className="col-span-2 text-xs font-bold text-slate-400 text-right">
                  Rp {(Number(row.rowData.ts2) || 0).toLocaleString("id-ID")}
                </div>

                {/* TS-1 (Read-only historical data) */}
                <div className="col-span-2 text-xs font-bold text-slate-400 text-right">
                  Rp {(Number(row.rowData.ts1) || 0).toLocaleString("id-ID")}
                </div>

                {/* TS (Active year data) */}
                <div className="col-span-2 text-xs font-bold text-slate-700 text-right">
                  Rp {(Number(row.rowData.ts) || 0).toLocaleString("id-ID")}
                </div>

                {/* Bukti */}
                <div className="col-span-1 flex items-center justify-center">
                  {row.rowData.linkBukti ? (
                    <a 
                      href={row.rowData.linkBukti} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-500 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150"
                      title="Buka Link Bukti"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-300 font-semibold">-</span>
                  )}
                </div>

                {/* Aksi */}
                <div className="col-span-1 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(row)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-150"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(row.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-150"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Total Row Card */}
            <div className="grid grid-cols-12 items-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-600 p-5 border border-white/10 shadow-soft-lg gap-4 font-bold text-white">
              <div className="col-span-4 text-xs text-white text-left font-black pl-2 uppercase tracking-widest">
                Jumlah Total Pendanaan
              </div>
              <div className="col-span-2 text-xs text-white/80 text-right font-black">
                Rp {totalTs2.toLocaleString("id-ID")}
              </div>
              <div className="col-span-2 text-xs text-white/80 text-right font-black">
                Rp {totalTs1.toLocaleString("id-ID")}
              </div>
              <div className="col-span-2 text-xs text-emerald-300 text-right font-black drop-shadow-sm">
                Rp {totalTs.toLocaleString("id-ID")}
              </div>
              <div className="col-span-2"></div>
            </div>
          </>
        )}
      </div>

      {/* Pagination & Summary Info */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="text-xs font-semibold text-slate-400">
          Menampilkan 1 - {rows.length} dari {rows.length} data
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
            &lt;
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-soft-sm">
            1
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
            &gt;
          </button>
        </div>
      </div>

      {/* Popups & Dialogs Container */}
      <AnimatePresence mode="wait">
        {/* Main Entry Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-soft-sm">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {editId ? "Ubah Sumber Pendanaan" : "Tambah Sumber Pendanaan"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Lengkapi nominal pendanaan untuk Tahun Sekarang (TS)
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Section: Rincian Pendanaan */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>Rincian Pendanaan</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Sumber Pendanaan */}
                    <div className="md:col-span-2">
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Sumber Pendanaan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Wallet className="h-4 w-4 text-blue-500" />
                        </span>
                        <select
                          required
                          value={sumberPendanaan}
                          onChange={(e) => setSumberPendanaan(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-3xs"
                        >
                          <option value="" disabled>Pilih Sumber Pendanaan</option>
                          {sumberPilihan.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Nominal (TS) */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Nominal Tahun Sekarang (TS) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-bold text-2xs">
                          Rp
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="0"
                          value={nominal}
                          onChange={handleNominalChange}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-20 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 font-semibold text-3xs uppercase">
                          Juta Rp
                        </span>
                      </div>
                    </div>

                    {/* Link Bukti */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Link Bukti Pendukung
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/..."
                          value={linkBukti}
                          onChange={(e) => setLinkBukti(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Batal</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Simpan Data</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Delete Popup */}
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
              {/* Close Button */}
              <button 
                onClick={() => setDeleteId(null)} 
                className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Red Trash Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 shadow-soft-sm">
                <Trash2 className="h-6 w-6" />
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-slate-800">Hapus Data</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed px-2">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-soft-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Soft UI Toast Notification */}
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
                  ? "bg-emerald-50/80 text-emerald-500 border-emerald-500/10 shadow-[0_2px_8px_rgba(16,185,129,0.08)]" 
                  : "bg-rose-50/80 text-rose-500 border-rose-500/10 shadow-[0_2px_8px_rgba(244,63,94,0.08)]"
              }`}>
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-slate-800">
                  {toast.type === "success" ? "Berhasil!" : "Gagal!"}
                </p>
                <p className="text-2xs font-semibold text-slate-400 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              </div>
              
              <button 
                onClick={() => setToast(null)}
                className="text-slate-300 hover:text-slate-500 transition-colors rounded-lg p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
