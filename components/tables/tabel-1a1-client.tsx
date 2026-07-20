"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, 
  FileText, User, Calendar, GraduationCap, 
  Briefcase, Lightbulb, CheckCircle2, X, Save,
  AlertTriangle, Info, RefreshCw, ChevronDown, Filter, ArrowRight,
  Send, MessageSquare, ThumbsUp, ThumbsDown, RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Tabel1A1ClientProps {
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

export function Tabel1A1Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Tabel1A1ClientProps) {
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
  const [unitKerja, setUnitKerja] = useState("");
  const [namaKetua, setNamaKetua] = useState("");
  const [periodeJabatan, setPeriodeJabatan] = useState("");
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState("");
  const [jabatanFungsional, setJabatanFungsional] = useState("");
  const [tupoksi, setTupoksi] = useState("");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenAdd = () => {
    setEditId(undefined);
    setUnitKerja("");
    setNamaKetua("");
    setPeriodeJabatan("");
    setPendidikanTerakhir("Strata 2");
    setJabatanFungsional("Lektor");
    setTupoksi("");
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    setUnitKerja(row.rowData.unitKerja || "");
    setNamaKetua(row.rowData.namaKetua || "");
    setPeriodeJabatan(row.rowData.periodeJabatan || "");
    setPendidikanTerakhir(row.rowData.pendidikanTerakhir || "Strata 2");
    setJabatanFungsional(row.rowData.jabatanFungsional || "Lektor");
    setTupoksi(row.rowData.tupoksi || "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rowData = {
        unitKerja,
        namaKetua,
        periodeJabatan,
        pendidikanTerakhir,
        jabatanFungsional,
        tupoksi,
      };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      // Update local state without reload
      if (editId) {
        setRows(rows.map((r) => (r.id === editId ? result : r)));
        triggerToast("Perubahan data berhasil disimpan", "success");
      } else {
        setRows([...rows, result]);
        triggerToast("Data pimpinan baru berhasil ditambahkan", "success");
      }

      setIsOpen(false);
      router.refresh(); // Sync server state in background
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
      
      // Update local state without reload
      setRows(rows.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      triggerToast("Data pimpinan telah berhasil dihapus", "success");
      router.refresh(); // Sync server state in background
    } catch (err: any) {
      triggerToast(err.message || "Gagal menghapus data.", "error");
    }
  };

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
          {/* Validation Controls */}
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
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-soft-sm hover:shadow-soft transition-all duration-200 ${
              canEdit
                ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" /> Tambah Data
          </button>
        </div>
      </div>

      {/* Card List Table Header */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 px-6 py-2.5 text-2xs font-bold uppercase tracking-wider text-slate-400 select-none">
          <div className="col-span-1">No</div>
          <div className="col-span-2">Unit Kerja</div>
          <div className="col-span-2">Nama Pejabat</div>
          <div className="col-span-2">Periode</div>
          <div className="col-span-1">Pendidikan</div>
          <div className="col-span-1">Jafung</div>
          <div className="col-span-2">Tupoksi</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {/* Card Rows */}
        {rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-xs font-semibold text-slate-400 shadow-soft">
            Belum ada data pimpinan. Silakan tambah data baru.
          </div>
        ) : (
          rows.map((row, index) => (
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
              
              {/* Unit Kerja */}
              <div className="col-span-2 text-xs font-bold text-slate-800 leading-snug">
                {row.rowData.unitKerja}
              </div>

              {/* Nama Pejabat */}
              <div className="col-span-2 text-xs font-bold text-slate-700 leading-snug">
                {row.rowData.namaKetua}
              </div>

              {/* Periode */}
              <div className="col-span-2">
                <span className="inline-flex items-center rounded-lg bg-indigo-50/70 px-2.5 py-1 text-2xs font-semibold text-indigo-600 border border-indigo-100/30">
                  {row.rowData.periodeJabatan}
                </span>
              </div>

              {/* Pendidikan */}
              <div className="col-span-1 text-xs font-semibold text-slate-700">
                {row.rowData.pendidikanTerakhir}
              </div>

              {/* Jafung */}
              <div className="col-span-1 text-xs font-semibold text-slate-500">
                {row.rowData.jabatanFungsional}
              </div>

              {/* Tupoksi */}
              <div className="col-span-2 text-xs text-slate-500 truncate pr-4 font-medium" title={row.rowData.tupoksi}>
                {row.rowData.tupoksi}
              </div>

              {/* Aksi */}
              <div className="col-span-1 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(row)}
                  disabled={!canEdit}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border shadow-2xs transition-all duration-150 ${
                    canEdit
                      ? "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
                      : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
                  title={canEdit ? "Edit" : "Tidak bisa diedit"}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(row.id)}
                  disabled={!canEdit}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border shadow-2xs transition-all duration-150 ${
                    canEdit
                      ? "border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
                  title={canEdit ? "Hapus" : "Tidak bisa dihapus"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination & Summary info */}
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
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {editId ? "Ubah Data Pimpinan" : "Tambah Data Pimpinan"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Lengkapi informasi pimpinan program studi
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Section: Informasi Utama */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>Informasi Utama</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Unit Kerja */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Unit Kerja <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                        </span>
                        <select
                          required
                          value={unitKerja}
                          onChange={(e) => setUnitKerja(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-3xs"
                        >
                          <option value="" disabled>Pilih Unit Kerja</option>
                          <option value="Dekan Fakultas">Dekan Fakultas</option>
                          <option value="Wakil Dekan I Fakultas">Wakil Dekan I Fakultas</option>
                          <option value="Wakil Dekan II Fakultas">Wakil Dekan II Fakultas</option>
                          <option value="Kabid. Penelitian dan PkM Fakultas">Kabid. Penelitian dan PkM Fakultas</option>
                          <option value="Satuan Penjaminan Mutu Fakultas">Satuan Penjaminan Mutu Fakultas</option>
                          <option value="Ketua Program Studi">Ketua Program Studi</option>
                          <option value="Sekretaris Prodi">Sekretaris Prodi</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Nama Ketua / Pejabat */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Nama Ketua / Pejabat <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-4 w-4 text-blue-500" />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap beserta gelar akademik"
                          value={namaKetua}
                          onChange={(e) => setNamaKetua(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                        />
                      </div>
                    </div>

                    {/* Periode Jabatan */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Periode Jabatan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </span>
                        <select
                          required
                          value={periodeJabatan}
                          onChange={(e) => setPeriodeJabatan(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-3xs"
                        >
                          <option value="" disabled>Pilih Periode Jabatan</option>
                          <option value="2020 - Sekarang">2020 - Sekarang</option>
                          <option value="2021 - Sekarang">2021 - Sekarang</option>
                          <option value="2022 - Sekarang">2022 - Sekarang</option>
                          <option value="2023 - Sekarang">2023 - Sekarang</option>
                          <option value="2024 - Sekarang">2024 - Sekarang</option>
                          <option value="2025 - Sekarang">2025 - Sekarang</option>
                          <option value="2026 - Sekarang">2026 - Sekarang</option>
                          <option value="2027 - Sekarang">2027 - Sekarang</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Pendidikan Terakhir */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Pendidikan Terakhir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                        </span>
                        <select
                          required
                          value={pendidikanTerakhir}
                          onChange={(e) => setPendidikanTerakhir(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-3xs"
                        >
                          <option value="" disabled>Pilih jenjang pendidikan terakhir</option>
                          <option value="Strata 3">S3 (Strata 3)</option>
                          <option value="Strata 2">S2 (Strata 2)</option>
                          <option value="Strata 1">S1 (Strata 1)</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Jabatan Fungsional */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Jabatan Fungsional
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                        </span>
                        <select
                          value={jabatanFungsional}
                          onChange={(e) => setJabatanFungsional(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-3xs"
                        >
                          <option value="">Pilih jabatan fungsional</option>
                          <option value="Tenaga Pengajar">Tenaga Pengajar</option>
                          <option value="Asisten Ahli">Asisten Ahli</option>
                          <option value="Lektor">Lektor</option>
                          <option value="Lektor Kepala">Lektor Kepala</option>
                          <option value="Guru Besar">Guru Besar</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Tupoksi */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Tugas Pokok & Fungsi (Tupoksi)
                      </label>
                      <div className="relative">
                        <textarea
                          required
                          rows={3}
                          maxLength={1000}
                          placeholder="Uraian tugas pokok dan fungsi jabatan..."
                          value={tupoksi}
                          onChange={(e) => setTupoksi(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-3xs"
                        />
                        <div className="absolute bottom-2 right-3 text-2xs font-semibold text-slate-400">
                          {tupoksi.length} / 1000
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips Pengisian */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span>Tips Pengisian</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                    <div className="flex items-center gap-2 text-2xs font-semibold text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Pastikan semua data diisi dengan benar dan lengkap</span>
                    </div>
                    <div className="flex items-center gap-2 text-2xs font-semibold text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Periode jabatan diisi dengan tahun dan keterangan</span>
                    </div>
                    <div className="flex items-center gap-2 text-2xs font-semibold text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Gunakan gelar akademik sesuai dengan yang dimiliki</span>
                    </div>
                    <div className="flex items-center gap-2 text-2xs font-semibold text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Tupoksi diisi secara ringkas dan jelas</span>
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
              {/* Colored status circle indicator */}
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
