"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Building2, Server, Monitor, Edit2, Lightbulb, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface PrasaranaPkmItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    namaPrasarana: string;
    dayaTampung: number;
    luasRuang: number;
    status: "M" | "W";
    publicDomain: "P" | "T";
    perangkat: string;
    linkBukti: string;
  };
}

interface Props {
  initialRows: PrasaranaPkmItem[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel4A1Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const [rows, setRows] = useState<PrasaranaPkmItem[]>(initialRows);
  const router = useRouter();

  // --- Modal tambah / edit ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PrasaranaPkmItem | null>(null);
  const [form, setForm] = useState({
    namaPrasarana: "",
    dayaTampung: "",
    luasRuang: "",
    status: "M" as "M" | "W",
    publicDomain: "P" as "P" | "T",
    perangkat: "",
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
  const openAddModal = () => {
    setEditItem(null);
    setForm({ namaPrasarana: "", dayaTampung: "", luasRuang: "", status: "M", publicDomain: "P", perangkat: "", linkBukti: "" });
    setModalOpen(true);
  };

  const openEditModal = (item: PrasaranaPkmItem) => {
    setEditItem(item);
    setForm({
      namaPrasarana: item.rowData.namaPrasarana,
      dayaTampung: item.rowData.dayaTampung ? String(item.rowData.dayaTampung) : "",
      luasRuang: item.rowData.luasRuang ? String(item.rowData.luasRuang) : "",
      status: item.rowData.status,
      publicDomain: item.rowData.publicDomain,
      perangkat: item.rowData.perangkat,
      linkBukti: item.rowData.linkBukti,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.namaPrasarana.trim()) {
      triggerToast("Nama prasarana harus diisi.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "inventory",
        namaPrasarana: form.namaPrasarana.trim(),
        dayaTampung: Number(form.dayaTampung) || 0,
        luasRuang: Number(form.luasRuang) || 0,
        status: form.status,
        publicDomain: form.publicDomain,
        perangkat: form.perangkat.trim(),
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null;
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updatedItem: PrasaranaPkmItem = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: rowData.tahun,
          namaPrasarana: rowData.namaPrasarana,
          dayaTampung: rowData.dayaTampung,
          luasRuang: rowData.luasRuang,
          status: rowData.status,
          publicDomain: rowData.publicDomain,
          perangkat: rowData.perangkat,
          linkBukti: rowData.linkBukti,
        },
      };

      if (isUpdate) {
        setRows((prev) => prev.map((r) => (r.id === editItem.id ? updatedItem : r)));
        triggerToast("Data prasarana berhasil diperbarui.", "success");
      } else {
        setRows((prev) => [...prev, updatedItem]);
        triggerToast("Prasarana berhasil ditambahkan.", "success");
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
      triggerToast("Prasarana berhasil dihapus.", "success");
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
  const totalDayaTampung = rows.reduce((a, r) => a + (r.rowData.dayaTampung || 0), 0);
  const totalLuasRuang = rows.reduce((a, r) => a + (r.rowData.luasRuang || 0), 0);
  const milikSendiri = rows.filter((r) => r.rowData.status === "M").length;
  const sewa = rows.filter((r) => r.rowData.status === "W").length;

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/lkps/bab-4"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 4
        </Link>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
        >
          <Plus className="h-4 w-4" /> Tambah Prasarana PkM
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-amber-50/60 border border-amber-100/60 px-5 py-4 text-xs font-semibold text-amber-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500" />
        <span>
          Klik <strong>"Tambah Prasarana PkM"</strong> untuk menambahkan data. Klik{" "}
          <strong>Edit</strong> untuk mengubah atau <strong>Hapus</strong> untuk menghapus item.
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        {[
          { label: "Total Prasarana", value: rows.length, color: "text-slate-800" },
          { label: "Total Daya Tampung", value: totalDayaTampung, color: "text-amber-600" },
          { label: "Total Luas Ruang", value: `${totalLuasRuang} m²`, color: "text-orange-600" },
          { label: "Milik / Sewa", value: `${milikSendiri} / ${sewa}`, color: "text-slate-700" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</div>
            <p className={`text-3xl font-black mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border-2 border-amber-200/70 bg-white shadow-soft overflow-hidden">
        {/* Table header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sarana dan Prasarana PkM</h3>
                <p className="text-2xs font-semibold text-amber-200">Inventaris laboratorium dan perangkat PkM</p>
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
              <Server className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data prasarana PkM.</p>
            <p className="text-xs text-slate-400 mt-1">Klik "Tambah Prasarana PkM" di atas untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Nama Prasarana</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Daya Tampung</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Luas (m²)</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Kepemilikan</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Lisensi</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Perangkat</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.namaPrasarana || "—"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">
                      {item.rowData.dayaTampung || "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">
                      {item.rowData.luasRuang || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.status === "M"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {item.rowData.status === "M" ? "Milik Sendiri" : "Sewa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.publicDomain === "P"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.rowData.publicDomain === "P" ? "Public Domain" : "Berlisensi"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                      {item.rowData.perangkat || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-2xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item.id, item.rowData.namaPrasarana)}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-2xs font-bold text-red-600 hover:bg-red-100 transition-colors"
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
                  <td colSpan={2} className="px-4 py-3 text-left font-black text-slate-700 uppercase tracking-wider text-xs">
                    Total
                  </td>
                  <td className="px-4 py-3 text-center font-black text-amber-600">{totalDayaTampung}</td>
                  <td className="px-4 py-3 text-center font-black text-orange-600">{totalLuasRuang} m²</td>
                  <td colSpan={4} />
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
              {/* Modal header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-soft-sm">
                  {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editItem ? "Edit Prasarana PkM" : "Tambah Prasarana PkM"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {editItem ? "Perbarui data sarana/prasarana PkM." : "Tambah sarana/prasarana PkM baru."}
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-5"
              >
                {/* Seksi — Identitas */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                    <Building2 className="h-4 w-4" /> Identitas Prasarana
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Nama Prasarana / Laboratorium <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Lab Komputasi, Lab Jaringan"
                      value={form.namaPrasarana}
                      onChange={(e) => setForm((p) => ({ ...p, namaPrasarana: e.target.value }))}
                      className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Daya Tampung</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="cth: 40"
                        value={form.dayaTampung}
                        onChange={(e) => setForm((p) => ({ ...p, dayaTampung: e.target.value }))}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Luas Ruang (m²)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="cth: 100"
                        value={form.luasRuang}
                        onChange={(e) => setForm((p) => ({ ...p, luasRuang: e.target.value }))}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Seksi — Kepemilikan */}
                <div className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-700">
                    <Server className="h-4 w-4" /> Status Kepemilikan
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-2">Milik / Sewa</label>
                      <div className="flex gap-2">
                        {(["M", "W"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, status: v }))}
                            className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                              form.status === v
                                ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-soft-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
                            }`}
                          >
                            {v === "M" ? "Milik Sendiri" : "Sewa"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-2">Lisensi Perangkat</label>
                      <div className="flex gap-2">
                        {(["P", "T"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, publicDomain: v }))}
                            className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                              form.publicDomain === v
                                ? "bg-gradient-to-tr from-orange-500 to-red-600 text-white shadow-soft-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300"
                            }`}
                          >
                            {v === "P" ? "Public" : "Berlisensi"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seksi — Perangkat */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Monitor className="h-4 w-4" /> Perangkat & Dokumentasi
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Daftar Perangkat (Hardware, Software, dll)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="cth: Komputer 40 unit, AC, Proyektor, Internet 100 Mbps"
                      value={form.perangkat}
                      onChange={(e) => setForm((p) => ({ ...p, perangkat: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 shadow-sm placeholder:text-slate-300 resize-none"
                    />
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
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-60"
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
              {/* Icon warning */}
              <div className="flex justify-center mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-800 text-center">Hapus Prasarana PkM?</h3>
              <p className="text-xs font-semibold text-slate-500 text-center mt-1.5">
                Tindakan ini tidak dapat dibatalkan.
              </p>

              {/* Nama item */}
              <div className="mt-5 rounded-xl bg-red-50/70 border border-red-100 px-4 py-3 text-center">
                <p className="text-xs font-bold text-red-700">
                  &ldquo;{deleteConfirmName || "Item ini"}&rdquo;
                </p>
              </div>

              {/* Tombol */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmId(null);
                    setDeleteConfirmName("");
                  }}
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

      {/* ── Toast Notification ────────────────────────────────────── */}
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
