"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Users, FlaskConical, DollarSign, Edit2, Lightbulb, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface PenelitianItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    namaDtpr: string;
    judulPenelitian: string;
    jumlahMahasiswa: number;
    jenisHibah: "L" | "N" | "I";
    durasi: number;
    danaTs2: number;
    danaTs1: number;
    danaTs: number;
    linkBukti: string;
  };
}

interface Props {
  initialRows: PenelitianItem[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel3A2Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState<PenelitianItem[]>(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);
  const router = useRouter();

  // --- Modal tambah / edit ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PenelitianItem | null>(null);
  const [form, setForm] = useState({
    namaDtpr: "",
    judulPenelitian: "",
    jumlahMahasiswa: "",
    jenisHibah: "L" as "L" | "N" | "I",
    durasi: "",
    danaTs2: "",
    danaTs1: "",
    danaTs: "",
    linkBukti: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- Modal konfirmasi hapus ---
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Toast ---
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Handlers ---
  const openAdd = () => {
    setEditItem(null);
    setForm({ namaDtpr: "", judulPenelitian: "", jumlahMahasiswa: "", jenisHibah: "L", durasi: "", danaTs2: "", danaTs1: "", danaTs: "", linkBukti: "" });
    setModalOpen(true);
  };

  const openEdit = (item: PenelitianItem) => {
    setEditItem(item);
    setForm({
      namaDtpr: item.rowData.namaDtpr,
      judulPenelitian: item.rowData.judulPenelitian,
      jumlahMahasiswa: item.rowData.jumlahMahasiswa ? String(item.rowData.jumlahMahasiswa) : "",
      jenisHibah: item.rowData.jenisHibah,
      durasi: item.rowData.durasi ? String(item.rowData.durasi) : "",
      danaTs2: item.rowData.danaTs2 ? String(item.rowData.danaTs2) : "",
      danaTs1: item.rowData.danaTs1 ? String(item.rowData.danaTs1) : "",
      danaTs: item.rowData.danaTs ? String(item.rowData.danaTs) : "",
      linkBukti: item.rowData.linkBukti,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.namaDtpr.trim() || !form.judulPenelitian.trim()) {
      triggerToast("Nama DTPR dan Judul Penelitian harus diisi.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "TS",
        namaDtpr: form.namaDtpr.trim(),
        judulPenelitian: form.judulPenelitian.trim(),
        jumlahMahasiswa: Number(form.jumlahMahasiswa) || 0,
        jenisHibah: form.jenisHibah,
        durasi: Number(form.durasi) || 0,
        danaTs2: Number(form.danaTs2) || 0,
        danaTs1: Number(form.danaTs1) || 0,
        danaTs: Number(form.danaTs) || 0,
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null;
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updated: PenelitianItem = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: rowData.tahun,
          namaDtpr: rowData.namaDtpr,
          judulPenelitian: rowData.judulPenelitian,
          jumlahMahasiswa: rowData.jumlahMahasiswa,
          jenisHibah: rowData.jenisHibah,
          durasi: rowData.durasi,
          danaTs2: rowData.danaTs2,
          danaTs1: rowData.danaTs1,
          danaTs: rowData.danaTs,
          linkBukti: rowData.linkBukti,
        },
      };

      if (isUpdate) {
        setRows((prev) => prev.map((r) => (r.id === editItem.id ? updated : r)));
        triggerToast("Data penelitian berhasil diperbarui.", "success");
      } else {
        setRows((prev) => [...prev, updated]);
        triggerToast("Data penelitian berhasil ditambahkan.", "success");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menyimpan data. Coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (id: string, nama: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(nama);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteLkpsRow({ rowId: deleteConfirmId, tabelKode });
      setRows((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      triggerToast("Data penelitian berhasil dihapus.", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      triggerToast("Gagal menghapus data.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
      setDeleteConfirmName("");
    }
  };

  // --- Stats ---
  const totalDanaTs = rows.reduce((a, r) => a + (r.rowData.danaTs || 0), 0);
  const totalDanaTs1 = rows.reduce((a, r) => a + (r.rowData.danaTs1 || 0), 0);
  const totalDanaTs2 = rows.reduce((a, r) => a + (r.rowData.danaTs2 || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/lkps/bab-3"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 3
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
            onClick={openAdd}
            disabled={!canEdit}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm hover:shadow-soft transition-all ${
              canEdit
                ? "bg-gradient-to-tr from-teal-500 to-cyan-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" /> Tambah Penelitian
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-teal-50/60 border border-teal-100/60 px-5 py-4 text-xs font-semibold text-teal-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-teal-500" />
        <span>
          Klik <strong>"Tambah Penelitian"</strong> untuk menambahkan data. Isi data penelitian DTPR
          termasuk jenis hibah dan pendanaan per tahun (TS-2, TS-1, TS).
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        {[
          { label: "Jumlah Penelitian", value: rows.length, color: "text-slate-800" },
          { label: "Total Dana TS", value: `${totalDanaTs.toLocaleString("id-ID")} jt`, color: "text-teal-600" },
          { label: "Total Dana TS-1", value: `${totalDanaTs1.toLocaleString("id-ID")} jt`, color: "text-cyan-600" },
          { label: "Total Dana TS-2", value: `${totalDanaTs2.toLocaleString("id-ID")} jt`, color: "text-emerald-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</div>
            <p className={`text-3xl font-black mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border-2 border-teal-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Penelitian DTPR</h3>
                <p className="text-2xs font-semibold text-teal-200">Hibah dan pembiayaan penelitian</p>
              </div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">
              {rows.length} item
            </span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <FlaskConical className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data penelitian.</p>
            <p className="text-xs text-slate-400 mt-1">Klik "Tambah Penelitian" di atas untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Nama DTPR</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Judul Penelitian</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Mhs</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Hibah</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-2 (jt)</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS-1 (jt)</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">TS (jt)</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.namaDtpr || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{item.rowData.judulPenelitian || "—"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">{item.rowData.jumlahMahasiswa || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.jenisHibah === "I"
                          ? "bg-purple-100 text-purple-700"
                          : item.rowData.jenisHibah === "N"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.rowData.jenisHibah === "I" ? "Internasional" : item.rowData.jenisHibah === "N" ? "Nasional" : "Lokal"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                      {item.rowData.danaTs2 > 0 ? item.rowData.danaTs2.toLocaleString("id-ID") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-cyan-600">
                      {item.rowData.danaTs1 > 0 ? item.rowData.danaTs1.toLocaleString("id-ID") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-teal-600">
                      {item.rowData.danaTs > 0 ? item.rowData.danaTs.toLocaleString("id-ID") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          disabled={!canEdit}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-2xs font-bold transition-colors ${
                            canEdit
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              : "bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item.id, item.rowData.namaDtpr || item.rowData.judulPenelitian)}
                          disabled={!canEdit}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-2xs font-bold transition-colors ${
                            canEdit
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={5} className="px-4 py-3 text-left font-black text-slate-700 uppercase tracking-wider text-xs">
                    Total Dana (juta Rp)
                  </td>
                  <td className="px-4 py-3 text-center font-black text-emerald-600">
                    {totalDanaTs2 > 0 ? totalDanaTs2.toLocaleString("id-ID") : "—"}
                  </td>
                  <td className="px-4 py-3 text-center font-black text-cyan-600">
                    {totalDanaTs1 > 0 ? totalDanaTs1.toLocaleString("id-ID") : "—"}
                  </td>
                  <td className="px-4 py-3 text-center font-black text-teal-600">
                    {totalDanaTs > 0 ? totalDanaTs.toLocaleString("id-ID") : "—"}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Tambah / Edit ───────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8"
            >
              {/* Header modal */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-soft-sm">
                  {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editItem ? "Edit Penelitian" : "Tambah Penelitian"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    DTPR, Hibah dan Pembiayaan Penelitian
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                {/* Identitas */}
                <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                    <Users className="h-4 w-4" /> Identitas Penelitian
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">
                        Nama DTPR (Ketua) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nama lengkap dosen"
                        value={form.namaDtpr}
                        onChange={(e) => setForm((p) => ({ ...p, namaDtpr: e.target.value }))}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Jumlah Mahasiswa Terlibat</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.jumlahMahasiswa}
                        onChange={(e) => setForm((p) => ({ ...p, jumlahMahasiswa: e.target.value }))}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Judul Penelitian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Judul lengkap penelitian"
                      value={form.judulPenelitian}
                      onChange={(e) => setForm((p) => ({ ...p, judulPenelitian: e.target.value }))}
                      className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-2">Jenis Hibah</label>
                      <div className="flex gap-2">
                        {(["L", "N", "I"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, jenisHibah: v }))}
                            className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold transition-all ${
                              form.jenisHibah === v
                                ? "bg-gradient-to-tr from-teal-500 to-cyan-600 text-white shadow-soft-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"
                            }`}
                          >
                            {v === "L" ? "Lokal" : v === "N" ? "Nasional" : "Internasional"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Durasi (tahun)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={form.durasi}
                        onChange={(e) => setForm((p) => ({ ...p, durasi: e.target.value }))}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Pendanaan */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <DollarSign className="h-4 w-4" /> Pendanaan (juta rupiah)
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: "danaTs2", label: "TS-2" },
                      { key: "danaTs1", label: "TS-1" },
                      { key: "danaTs", label: "TS" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-2xs font-bold text-slate-600 mb-1">{label}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 shadow-sm placeholder:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">Link Bukti / Dokumentasi</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/..."
                      value={form.linkBukti}
                      onChange={(e) => setForm((p) => ({ ...p, linkBukti: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Footer tombol */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                    ) : (
                      <><Save className="h-4 w-4" /> {editItem ? "Perbarui" : "Simpan"}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal Konfirmasi Hapus ─────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="w-full max-w-sm rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8"
            >
              <div className="flex justify-center mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-800 text-center">Hapus Penelitian?</h3>
              <p className="text-xs font-semibold text-slate-500 text-center mt-1.5">
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-5 rounded-xl bg-red-50/70 border border-red-100 px-4 py-3 text-center">
                <p className="text-xs font-bold text-red-700">
                  &ldquo;{deleteConfirmName || "Item ini"}&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(""); }}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-red-500 to-rose-600 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-60"
                >
                  {isDeleting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</>
                  ) : (
                    <><Trash2 className="h-4 w-4" /> Ya, Hapus</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-5 py-4 text-xs font-bold text-white shadow-soft-lg"
          >
            <CheckCircle2
              className={`h-5 w-5 shrink-0 ${
                toast.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
