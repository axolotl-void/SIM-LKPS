"use client";

import { useState } from "react";
import { 
  Plus, Edit2, Trash2, Loader2, ArrowLeft, 
  FileText, CheckCircle2, X, Save, User, 
  ChevronDown, BookOpen, Search, Filter
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow, createDosen } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface DosenOption {
  id: string;
  nidn: string;
  nama: string;
}

interface Tabel1A4ClientProps {
  initialRows: {
    id: string;
    rowOrder: number;
    rowData: any;
  }[];
  dosenList: DosenOption[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel1A4Client({ initialRows, dosenList, tahunAkademikId, tabelKode, status, userRole }: Tabel1A4ClientProps) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();

  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);

  // Modals & Toast States
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form States
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [dosenId, setDosenId] = useState("");
  const [psSendiri, setPsSendiri] = useState("");
  const [psLainPtSendiri, setPsLainPtSendiri] = useState("");
  const [ptLain, setPtLain] = useState("");
  const [penelitian, setPenelitian] = useState("");
  const [pkm, setPkm] = useState("");
  const [manajemenPtSendiri, setManajemenPtSendiri] = useState("");
  const [manajemenPtLain, setManajemenPtLain] = useState("");

  // Dosen autocomplete states
  const [localDosenList, setLocalDosenList] = useState<DosenOption[]>(dosenList);
  const [dosenSearchQuery, setDosenSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingDosen, setIsCreatingDosen] = useState(false);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenAdd = () => {
    setEditId(undefined);
    setDosenId("");
    setDosenSearchQuery("");
    setPsSendiri("");
    setPsLainPtSendiri("");
    setPtLain("");
    setPenelitian("");
    setPkm("");
    setManajemenPtSendiri("");
    setManajemenPtLain("");
    setIsOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditId(row.id);
    const selected = localDosenList.find(d => d.id === row.rowData.dosenId);
    setDosenId(row.rowData.dosenId || "");
    setDosenSearchQuery(selected ? selected.nama : (row.rowData.dosenNama || ""));
    setPsSendiri(row.rowData.psSendiri !== undefined ? String(row.rowData.psSendiri) : "");
    setPsLainPtSendiri(row.rowData.psLainPtSendiri !== undefined ? String(row.rowData.psLainPtSendiri) : "");
    setPtLain(row.rowData.ptLain !== undefined ? String(row.rowData.ptLain) : "");
    setPenelitian(row.rowData.penelitian !== undefined ? String(row.rowData.penelitian) : "");
    setPkm(row.rowData.pkm !== undefined ? String(row.rowData.pkm) : "");
    setManajemenPtSendiri(row.rowData.manajemenPtSendiri !== undefined ? String(row.rowData.manajemenPtSendiri) : "");
    setManajemenPtLain(row.rowData.manajemenPtLain !== undefined ? String(row.rowData.manajemenPtLain) : "");
    setIsOpen(true);
  };

  const handleSelectDosen = (dosen: DosenOption) => {
    setDosenId(dosen.id);
    setDosenSearchQuery(dosen.nama);
    setIsDropdownOpen(false);
  };

  const handleCreateCustomDosen = async () => {
    if (!dosenSearchQuery.trim()) return;
    setIsCreatingDosen(true);
    try {
      const newDosen = await createDosen(dosenSearchQuery.trim());
      setLocalDosenList([...localDosenList, newDosen]);
      setDosenId(newDosen.id);
      setDosenSearchQuery(newDosen.nama);
      setIsDropdownOpen(false);
      triggerToast(`Dosen "${newDosen.nama}" berhasil ditambahkan`, "success");
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menambahkan dosen kustom baru.", "error");
    } finally {
      setIsCreatingDosen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedDosen = localDosenList.find(d => d.id === dosenId);
    if (!selectedDosen) {
      triggerToast("Dosen wajib dipilih.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const vPsSendiri = Number(psSendiri) || 0;
      const vPsLainPtSendiri = Number(psLainPtSendiri) || 0;
      const vPtLain = Number(ptLain) || 0;
      const vPenelitian = Number(penelitian) || 0;
      const vPkm = Number(pkm) || 0;
      const vManajemenPtSendiri = Number(manajemenPtSendiri) || 0;
      const vManajemenPtLain = Number(manajemenPtLain) || 0;
      const totalSks = vPsSendiri + vPsLainPtSendiri + vPtLain + vPenelitian + vPkm + vManajemenPtSendiri + vManajemenPtLain;

      const rowData = {
        dosenId,
        dosenNama: selectedDosen.nama,
        nidn: selectedDosen.nidn,
        psSendiri: vPsSendiri,
        psLainPtSendiri: vPsLainPtSendiri,
        ptLain: vPtLain,
        penelitian: vPenelitian,
        pkm: vPkm,
        manajemenPtSendiri: vManajemenPtSendiri,
        manajemenPtLain: vManajemenPtLain,
        totalSks,
      };

      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: editId,
        rowData,
      });

      if (editId) {
        setRows(rows.map((r) => (r.id === editId ? result : r)));
        triggerToast("Beban kerja dosen berhasil diperbarui", "success");
      } else {
        setRows([...rows, result]);
        triggerToast("Beban kerja dosen baru berhasil ditambahkan", "success");
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
      triggerToast("Data beban kerja berhasil dihapus", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus data.", "error");
    }
  };

  // Calculations for Averages
  const count = rows.length || 1;
  const avgPsSendiri = rows.reduce((acc, r) => acc + (Number(r.rowData.psSendiri) || 0), 0) / count;
  const avgPsLain = rows.reduce((acc, r) => acc + (Number(r.rowData.psLainPtSendiri) || 0), 0) / count;
  const avgPtLain = rows.reduce((acc, r) => acc + (Number(r.rowData.ptLain) || 0), 0) / count;
  const avgPenelitian = rows.reduce((acc, r) => acc + (Number(r.rowData.penelitian) || 0), 0) / count;
  const avgPkm = rows.reduce((acc, r) => acc + (Number(r.rowData.pkm) || 0), 0) / count;
  const avgManajemenPt = rows.reduce((acc, r) => acc + (Number(r.rowData.manajemenPtSendiri) || 0), 0) / count;
  const avgManajemenLain = rows.reduce((acc, r) => acc + (Number(r.rowData.manajemenPtLain) || 0), 0) / count;
  const avgTotal = rows.reduce((acc, r) => acc + (Number(r.rowData.totalSks) || 0), 0) / count;

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
          <div className="col-span-3">Nama DTPR</div>
          <div className="col-span-2 text-center">Pengajaran (PS/Lain/PT)</div>
          <div className="col-span-1.5 text-center">Penelitian</div>
          <div className="col-span-1.5 text-center">PkM</div>
          <div className="col-span-1.5 text-center">Manajemen (PT/Lain)</div>
          <div className="col-span-1 text-center font-bold text-slate-500">Total</div>
          <div className="col-span-0.5 text-center">Aksi</div>
        </div>

        {/* Card Rows */}
        {rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-xs font-semibold text-slate-400 shadow-soft">
            Belum ada data beban kerja DTPR. Silakan tambah data baru.
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
                
                {/* Nama DTPR */}
                <div className="col-span-3">
                  <div className="text-xs font-bold text-slate-800 leading-snug">{row.rowData.dosenNama}</div>
                </div>

                {/* SKS Pengajaran */}
                <div className="col-span-2 text-center text-xs font-bold text-slate-700">
                  {row.rowData.psSendiri} / {row.rowData.psLainPtSendiri} / {row.rowData.ptLain}
                </div>

                {/* SKS Penelitian */}
                <div className="col-span-1.5 text-center text-xs font-bold text-slate-700">
                  {row.rowData.penelitian} SKS
                </div>

                {/* SKS PkM */}
                <div className="col-span-1.5 text-center text-xs font-bold text-slate-700">
                  {row.rowData.pkm} SKS
                </div>

                {/* SKS Manajemen */}
                <div className="col-span-1.5 text-center text-xs font-bold text-slate-700">
                  {row.rowData.manajemenPtSendiri} / {row.rowData.manajemenPtLain}
                </div>

                {/* Total SKS */}
                <div className="col-span-1 text-center text-xs font-black text-indigo-600">
                  {row.rowData.totalSks}
                </div>

                {/* Aksi */}
                <div className="col-span-0.5 flex items-center justify-center gap-1">
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
            ))}

            {/* Averages Row Card */}
            <div className="grid grid-cols-12 items-center rounded-3xl bg-slate-50/50 p-5 border border-slate-200/60 shadow-3xs gap-4 font-bold">
              <div className="col-span-4 text-xs text-slate-800 text-left font-extrabold pl-2">
                Rata-rata Beban SKS
              </div>
              <div className="col-span-2 text-center text-xs text-slate-500 font-extrabold">
                {avgPsSendiri.toFixed(1)} / {avgPsLain.toFixed(1)} / {avgPtLain.toFixed(1)}
              </div>
              <div className="col-span-1.5 text-center text-xs text-slate-500 font-extrabold">
                {avgPenelitian.toFixed(1)} SKS
              </div>
              <div className="col-span-1.5 text-center text-xs text-slate-500 font-extrabold">
                {avgPkm.toFixed(1)} SKS
              </div>
              <div className="col-span-1.5 text-center text-xs text-slate-500 font-extrabold">
                {avgManajemenPt.toFixed(1)} / {avgManajemenLain.toFixed(1)}
              </div>
              <div className="col-span-1 text-center text-xs text-indigo-700 font-black">
                {avgTotal.toFixed(1)}
              </div>
              <div className="col-span-0.5"></div>
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
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {editId ? "Ubah Beban Kerja DTPR" : "Tambah Beban Kerja DTPR"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Lengkapi alokasi SKS beban mengajar dan tridharma dosen
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* DTPR Selection */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                    <BookOpen className="h-4 w-4" />
                    <span>Dosen Tetap Program Studi (DTPR)</span>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                      Pilih Dosen <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-blue-500" />
                      </span>
                      <input
                        type="text"
                        required
                        value={dosenSearchQuery}
                        onChange={(e) => {
                          setDosenSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                          const matched = localDosenList.find(d => d.nama.toLowerCase() === e.target.value.toLowerCase());
                          if (matched) {
                            setDosenId(matched.id);
                          } else {
                            setDosenId("");
                          }
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Ketik untuk mencari atau menambah dosen baru..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </span>

                      {isDropdownOpen && (
                        <>
                          {/* Close dropdown overlay helper */}
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-soft-lg">
                            {localDosenList.filter(d => 
                              d.nama.toLowerCase().includes(dosenSearchQuery.toLowerCase())
                            ).length > 0 ? (
                              localDosenList.filter(d => 
                                d.nama.toLowerCase().includes(dosenSearchQuery.toLowerCase())
                              ).map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => handleSelectDosen(d)}
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                >
                                  {d.nama}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-xs text-slate-400 font-medium">
                                Dosen tidak ditemukan
                              </div>
                            )}
                            
                            {dosenSearchQuery.trim() && !localDosenList.some(d => d.nama.toLowerCase() === dosenSearchQuery.toLowerCase().trim()) && (
                              <div className="border-t border-slate-100/60 my-1 pt-1">
                                <button
                                  type="button"
                                  disabled={isCreatingDosen}
                                  onClick={handleCreateCustomDosen}
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center gap-1.5"
                                >
                                  {isCreatingDosen ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Plus className="h-3.5 w-3.5" />
                                  )}
                                  Tambah "{dosenSearchQuery}" sebagai dosen baru
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SKS Workloads */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>Rincian Beban Kinerja SKS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* PS Sendiri */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        PS Sendiri (Pengajaran)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={psSendiri}
                        onChange={(e) => setPsSendiri(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* PS Lain PT Sendiri */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        PS Lain di PT Sendiri
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={psLainPtSendiri}
                        onChange={(e) => setPsLainPtSendiri(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* PT Lain */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        PT Lain (Luar Kampus)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={ptLain}
                        onChange={(e) => setPtLain(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* Penelitian */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        SKS Penelitian
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={penelitian}
                        onChange={(e) => setPenelitian(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* PkM */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        SKS Pengabdian (PkM)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={pkm}
                        onChange={(e) => setPkm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* Manajemen PT Sendiri */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Manajemen PT Sendiri
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={manajemenPtSendiri}
                        onChange={(e) => setManajemenPtSendiri(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
                    </div>

                    {/* Manajemen PT Lain */}
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
                        Manajemen PT Lain
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0"
                        value={manajemenPtLain}
                        onChange={(e) => setManajemenPtLain(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
                      />
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
