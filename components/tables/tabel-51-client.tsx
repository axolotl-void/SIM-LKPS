"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Shield, Globe, Monitor, Edit2, Lightbulb, AlertTriangle, Wifi,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface TataKelolaItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    jenisTataKelola: string;
    namaSistem: string;
    akses: "Lokal" | "Internet";
    unitPengelola: string;
    linkBukti: string;
  };
}

interface Props {
  initialRows: TataKelolaItem[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel51Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const [rows, setRows] = useState<TataKelolaItem[]>(initialRows);
  const router = useRouter();

  // --- Modal tambah / edit ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TataKelolaItem | null>(null);
  const [form, setForm] = useState({
    jenisTataKelola: "",
    namaSistem: "",
    akses: "Lokal" as "Lokal" | "Internet",
    unitPengelola: "",
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
    setForm({ jenisTataKelola: "", namaSistem: "", akses: "Lokal", unitPengelola: "", linkBukti: "" });
    setModalOpen(true);
  };

  const openEditModal = (item: TataKelolaItem) => {
    setEditItem(item);
    setForm({
      jenisTataKelola: item.rowData.jenisTataKelola,
      namaSistem: item.rowData.namaSistem,
      akses: item.rowData.akses,
      unitPengelola: item.rowData.unitPengelola,
      linkBukti: item.rowData.linkBukti,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.jenisTataKelola.trim()) {
      triggerToast("Jenis tata kelola harus diisi.", "error");
      return;
    }
    if (!form.namaSistem.trim()) {
      triggerToast("Nama sistem harus diisi.", "error");
      return;
    }
    if (!form.unitPengelola.trim()) {
      triggerToast("Unit pengelola harus diisi.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const rowData = {
        tahun: "inventory",
        jenisTataKelola: form.jenisTataKelola.trim(),
        namaSistem: form.namaSistem.trim(),
        akses: form.akses,
        unitPengelola: form.unitPengelola.trim(),
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null;
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updatedItem: TataKelolaItem = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: rowData.tahun,
          jenisTataKelola: rowData.jenisTataKelola,
          namaSistem: rowData.namaSistem,
          akses: rowData.akses,
          unitPengelola: rowData.unitPengelola,
          linkBukti: rowData.linkBukti,
        },
      };

      if (isUpdate) {
        setRows((prev) => prev.map((r) => (r.id === editItem.id ? updatedItem : r)));
        triggerToast("Data sistem tata kelola berhasil diperbarui.", "success");
      } else {
        setRows((prev) => [...prev, updatedItem]);
        triggerToast("Sistem tata kelola berhasil ditambahkan.", "success");
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
      triggerToast("Sistem tata kelola berhasil dihapus.", "success");
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
  const totalSistem = rows.length;
  const aksesInternet = rows.filter((r) => r.rowData.akses === "Internet").length;
  const aksesLokal = rows.filter((r) => r.rowData.akses === "Lokal").length;

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/lkps/bab-5"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 5
        </Link>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
        >
          <Plus className="h-4 w-4" /> Tambah Sistem Tata Kelola
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-violet-50/60 border border-violet-100/60 px-5 py-4 text-xs font-semibold text-violet-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-violet-500" />
        <span>
          Klik <strong>"Tambah Sistem Tata Kelola"</strong> untuk menambahkan data. Klik{" "}
          <strong>Edit</strong> untuk mengubah atau <strong>Hapus</strong> untuk menghapus item.
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: "Total Sistem", value: totalSistem, color: "text-slate-800" },
          { label: "Akses Internet", value: aksesInternet, color: "text-violet-600" },
          { label: "Akses Lokal", value: aksesLokal, color: "text-purple-600" },
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
      <div className="rounded-2xl border-2 border-violet-200/70 bg-white shadow-soft overflow-hidden">
        {/* Table header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sistem Tata Kelola</h3>
                <p className="text-2xs font-semibold text-violet-200">Daftar sistem tata kelola perguruan tinggi</p>
              </div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">
              {totalSistem} item
            </span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data sistem tata kelola.</p>
            <p className="text-xs text-slate-400 mt-1">Klik "Tambah Sistem Tata Kelola" di atas untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Jenis Tata Kelola</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Nama Sistem</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Akses</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Unit Pengelola</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Link Bukti</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.jenisTataKelola || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{item.rowData.namaSistem || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.akses === "Internet"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.rowData.akses === "Internet" ? (
                          <><Globe className="h-3 w-3" /> Internet</>
                        ) : (
                          <><Monitor className="h-3 w-3" /> Lokal</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{item.rowData.unitPengelola || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {item.rowData.linkBukti ? (
                        <a
                          href={item.rowData.linkBukti}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-2xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Wifi className="h-3 w-3" /> Bukti
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
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
                          onClick={() => openDeleteConfirm(item.id, item.rowData.namaSistem)}
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
                  <td className="px-4 py-3 font-black text-slate-700">{totalSistem}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-black text-violet-600">{aksesInternet} Internet</span>
                    {" / "}
                    <span className="font-black text-purple-600">{aksesLokal} Lokal</span>
                  </td>
                  <td colSpan={3} />
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-soft-sm">
                  {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editItem ? "Edit Sistem Tata Kelola" : "Tambah Sistem Tata Kelola"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {editItem ? "Perbarui data sistem tata kelola." : "Tambah sistem tata kelola baru."}
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
                {/* Seksi — Informasi Sistem */}
                <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                    <Shield className="h-4 w-4" /> Informasi Sistem
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Jenis Tata Kelola <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Sistem Informasi, SPMI, SPME"
                      value={form.jenisTataKelola}
                      onChange={(e) => setForm((p) => ({ ...p, jenisTataKelola: e.target.value }))}
                      className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Nama Sistem <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="cth: SIAkad, SISTER, SPMI Online"
                      value={form.namaSistem}
                      onChange={(e) => setForm((p) => ({ ...p, namaSistem: e.target.value }))}
                      className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Seksi — Akses & Pengelola */}
                <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <Globe className="h-4 w-4" /> Akses & Pengelola
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-2">
                      Jenis Akses <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {(["Lokal", "Internet"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, akses: v }))}
                          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                            form.akses === v
                              ? "bg-gradient-to-tr from-violet-500 to-purple-600 text-white shadow-soft-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300"
                          }`}
                        >
                          {v === "Internet" ? (
                            <><Globe className="h-3.5 w-3.5 inline mr-1" /> Internet</>
                          ) : (
                            <><Monitor className="h-3.5 w-3.5 inline mr-1" /> Lokal</>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Unit Pengelola <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="cth: UPT TIK, Biro Akademik"
                      value={form.unitPengelola}
                      onChange={(e) => setForm((p) => ({ ...p, unitPengelola: e.target.value }))}
                      className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Seksi — Bukti */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Wifi className="h-4 w-4" /> Dokumentasi
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
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-60"
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

              <h3 className="text-base font-bold text-slate-800 text-center">Hapus Sistem Tata Kelola?</h3>
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
