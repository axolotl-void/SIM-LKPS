"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, CheckCircle2, X, AlertTriangle,
  FileText, ArrowLeft, Loader2, Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Tabel1BClientProps {
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

export function Tabel1BClient({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Tabel1BClientProps) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();

  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  
  // Modals & Toast States
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Form State
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [unitSpmi, setUnitSpmi] = useState("PT");
  const [namaUnitSpmi, setNamaUnitSpmi] = useState("");
  const [dokumenSpmi, setDokumenSpmi] = useState("");
  
  // Numeric values
  const [jumlahAuditorMutuInternal, setJumlahAuditorMutuInternal] = useState<number | string>("");
  const [certified, setCertified] = useState<number | string>("");
  const [nonCertified, setNonCertified] = useState<number | string>("");
  
  // Text area / input
  const [frekuensiAuditMonev, setFrekuensiAuditMonev] = useState("");
  const [buktiCertifiedAuditor, setBuktiCertifiedAuditor] = useState("");
  const [laporanAudit, setLaporanAudit] = useState("");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenAdd = () => {
    setEditId(undefined);
    setUnitSpmi("PT");
    setNamaUnitSpmi("");
    setDokumenSpmi("");
    setJumlahAuditorMutuInternal("");
    setCertified("");
    setNonCertified("");
    setFrekuensiAuditMonev("");
    setBuktiCertifiedAuditor("");
    setLaporanAudit("");
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    setUnitSpmi(row.rowData.unitSpmi || "PT");
    setNamaUnitSpmi(row.rowData.namaUnitSpmi || "");
    setDokumenSpmi(row.rowData.dokumenSpmi || "");
    
    setJumlahAuditorMutuInternal(Number(row.rowData.jumlahAuditorMutuInternal) || "");
    setCertified(Number(row.rowData.certified) || "");
    setNonCertified(Number(row.rowData.nonCertified) || "");
    
    setFrekuensiAuditMonev(row.rowData.frekuensiAuditMonev || "");
    setBuktiCertifiedAuditor(row.rowData.buktiCertifiedAuditor || "");
    setLaporanAudit(row.rowData.laporanAudit || "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    const totalInput = Number(jumlahAuditorMutuInternal) || 0;
    const cert = Number(certified) || 0;
    const nonCert = Number(nonCertified) || 0;
    
    if (totalInput !== (cert + nonCert)) {
      triggerToast("Jumlah Auditor harus sama dengan total Certified + Non Certified", "error");
      return;
    }
    
    setIsLoading(true);

    try {
      const rowData = {
        unitSpmi,
        namaUnitSpmi,
        dokumenSpmi,
        jumlahAuditorMutuInternal: totalInput,
        certified: cert,
        nonCertified: nonCert,
        frekuensiAuditMonev,
        buktiCertifiedAuditor,
        laporanAudit,
      };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      if (editId) {
        setRows(rows.map((r) => (r.id === editId ? result : r)));
        triggerToast("Perubahan data Unit SPMI berhasil disimpan", "success");
      } else {
        setRows([...rows, result]);
        triggerToast("Data Unit SPMI baru berhasil ditambahkan", "success");
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
      await deleteLkpsRow({ rowId: deleteId, tabelKode });
      setRows(rows.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      triggerToast("Data Unit SPMI berhasil dihapus", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus data.", "error");
    }
  };

  // Helper for numeric input changes
  const handleNumericInput = (val: string, setter: React.Dispatch<React.SetStateAction<number | string>>) => {
    if (val === "") {
      setter("");
    } else {
      const parsed = parseInt(val);
      if (!isNaN(parsed) && parsed >= 0) {
        setter(parsed);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/lkps/bab-1"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-soft-sm hover:bg-slate-50 hover:text-indigo-600 transition-all border border-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke BAB 1
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
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm transition-all ${
              canEdit
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" />
            Tambah Unit SPMI
          </button>
        </div>
      </div>

      {/* Row List */}
      <div className="grid grid-cols-1 gap-5">
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4 shadow-3xs">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum ada data Unit SPMI</h3>
            <p className="mt-2 text-xs font-medium text-slate-400">
              Mulai tambahkan data untuk {tabelKode}.
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="group relative flex flex-col rounded-3xl bg-white p-5 shadow-soft border border-slate-100/50 hover:shadow-soft-lg hover:border-slate-200 transition-all duration-300"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 text-indigo-600 shadow-3xs border border-indigo-100/50">
                    <span className="font-extrabold text-sm">{row.rowData.unitSpmi}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                      {row.rowData.namaUnitSpmi || "N/A"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-slate-50 px-2 py-0.5 text-3xs font-bold text-slate-500 border border-slate-100">
                        {row.rowData.frekuensiAuditMonev || "Frekuensi belum diset"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(row)}
                    disabled={!canEdit}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all shadow-3xs ${
                      canEdit
                        ? "border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/20"
                        : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                    title={canEdit ? "Edit" : "Tidak bisa diedit"}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(row.id)}
                    disabled={!canEdit}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all shadow-3xs ${
                      canEdit
                        ? "border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/20"
                        : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                    title={canEdit ? "Hapus" : "Tidak bisa dihapus"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-slate-100/60" />

              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50/50 p-3.5 border border-slate-100/60 shadow-3xs">
                    <h4 className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Dokumen SPMI
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 whitespace-pre-wrap">
                      {row.rowData.dokumenSpmi || "-"}
                    </p>
                  </div>
                  
                  <div className="rounded-2xl bg-slate-50/50 p-3.5 border border-slate-100/60 shadow-3xs">
                    <h4 className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Laporan Audit / Monev
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 whitespace-pre-wrap">
                      {row.rowData.laporanAudit || "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-2xl bg-indigo-50/50 p-3.5 border border-indigo-100/30 shadow-3xs">
                      <h4 className="text-3xs font-extrabold uppercase tracking-wider text-indigo-500 mb-1">
                        Total Auditor
                      </h4>
                      <p className="text-lg font-black text-indigo-700">
                        {row.rowData.jumlahAuditorMutuInternal || 0}
                      </p>
                    </div>
                    <div className="flex-1 rounded-2xl bg-emerald-50/50 p-3.5 border border-emerald-100/30 shadow-3xs">
                      <h4 className="text-3xs font-extrabold uppercase tracking-wider text-emerald-600 mb-1">
                        Certified
                      </h4>
                      <p className="text-lg font-black text-emerald-700">
                        {row.rowData.certified || 0}
                      </p>
                    </div>
                    <div className="flex-1 rounded-2xl bg-orange-50/50 p-3.5 border border-orange-100/30 shadow-3xs">
                      <h4 className="text-3xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">
                        Non-Cert
                      </h4>
                      <p className="text-lg font-black text-orange-700">
                        {row.rowData.nonCertified || 0}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50/50 p-3.5 border border-slate-100/60 shadow-3xs">
                    <h4 className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Bukti Certified Auditor
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 whitespace-pre-wrap">
                      {row.rowData.buktiCertifiedAuditor || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
              <h3 className="text-base font-bold text-slate-850">Hapus Data Unit SPMI?</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pt-16 pb-16">
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
              className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-7 shadow-soft-lg border border-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                  {editId ? "Edit Unit SPMI" : "Tambah Unit SPMI"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Tingkat Unit
                    </label>
                    <select
                      value={unitSpmi}
                      onChange={(e) => setUnitSpmi(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    >
                      <option value="PT">PT (Perguruan Tinggi)</option>
                      <option value="UPPS">UPPS (Fakultas/Departemen)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Nama Unit SPMI
                    </label>
                    <input
                      type="text"
                      required
                      value={namaUnitSpmi}
                      onChange={(e) => setNamaUnitSpmi(e.target.value)}
                      placeholder="e.g. Lembaga Penjaminan Mutu (LPM) UBBG"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    Dokumen SPMI
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={dokumenSpmi}
                    onChange={(e) => setDokumenSpmi(e.target.value)}
                    placeholder="e.g. Kebijakan Mutu, Manual Mutu, Standar SPMI, Formulir SPMI"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs resize-none"
                  />
                </div>

                {/* Subtitle Auditor */}
                <div className="pt-2 border-t border-slate-100/80">
                  <h4 className="text-2xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-indigo-500" />
                    Data Auditor Mutu Internal
                  </h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Total Auditor</label>
                    <input
                      type="number"
                      min="0"
                      value={jumlahAuditorMutuInternal}
                      placeholder="0"
                      onChange={(e) => handleNumericInput(e.target.value, setJumlahAuditorMutuInternal)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-indigo-700 text-center shadow-3xs focus:border-indigo-500 focus:outline-hidden placeholder:text-slate-300 bg-indigo-50/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Certified</label>
                    <input
                      type="number"
                      min="0"
                      value={certified}
                      placeholder="0"
                      onChange={(e) => handleNumericInput(e.target.value, setCertified)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-emerald-700 text-center shadow-3xs focus:border-emerald-500 focus:outline-hidden placeholder:text-slate-300 bg-emerald-50/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Non-Certified</label>
                    <input
                      type="number"
                      min="0"
                      value={nonCertified}
                      placeholder="0"
                      onChange={(e) => handleNumericInput(e.target.value, setNonCertified)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-orange-700 text-center shadow-3xs focus:border-orange-500 focus:outline-hidden placeholder:text-slate-300 bg-orange-50/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Frekuensi Audit/Monev per Tahun
                    </label>
                    <input
                      type="text"
                      required
                      value={frekuensiAuditMonev}
                      onChange={(e) => setFrekuensiAuditMonev(e.target.value)}
                      placeholder="e.g. 2 kali (Audit Mutu Internal per semester)"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Laporan Audit
                    </label>
                    <input
                      type="text"
                      required
                      value={laporanAudit}
                      onChange={(e) => setLaporanAudit(e.target.value)}
                      placeholder="e.g. Laporan Audit Mutu Internal Universitas"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    Bukti Certified Auditor
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={buktiCertifiedAuditor}
                    onChange={(e) => setBuktiCertifiedAuditor(e.target.value)}
                    placeholder="e.g. Sertifikat Auditor AMI/SPMI"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden transition-all shadow-3xs resize-none"
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:bg-indigo-700 hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Simpan Data"
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
