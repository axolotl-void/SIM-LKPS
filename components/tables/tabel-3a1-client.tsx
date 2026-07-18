"use client";

import { useState, useEffect } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save, Plus, Trash2,
  Building2, Server, Wifi, Monitor, Edit2, Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

interface SaranaItem {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    namaPrasarana: string;
    dayaTampung: number;
    luasRuang: number;
    status: "M" | "W"; // Milik sendiri / Sewa
    publicDomain: "P" | "T"; // Public Domain / Tidak Berlisensi
    perangkat: string;
    linkBukti: string;
  };
}

interface Props {
  initialRows: SaranaItem[];
  tahunAkademikId: string;
  tabelKode: string;
}

export function Tabel3A1Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<SaranaItem | null>(null);
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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAddModal = () => {
    setEditItem(null);
    setForm({
      namaPrasarana: "",
      dayaTampung: "",
      luasRuang: "",
      status: "M",
      publicDomain: "P",
      perangkat: "",
      linkBukti: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: SaranaItem) => {
    setEditItem(item);
    setForm({
      namaPrasarana: item.rowData.namaPrasarana || "",
      dayaTampung: String(item.rowData.dayaTampung || ""),
      luasRuang: String(item.rowData.luasRuang || ""),
      status: item.rowData.status || "M",
      publicDomain: item.rowData.publicDomain || "P",
      perangkat: item.rowData.perangkat || "",
      linkBukti: item.rowData.linkBukti || "",
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
      const rowData: Record<string, any> = {
        tahun: "inventory",
        namaPrasarana: form.namaPrasarana.trim(),
        dayaTampung: Number(form.dayaTampung) || 0,
        luasRuang: Number(form.luasRuang) || 0,
        status: form.status,
        publicDomain: form.publicDomain,
        perangkat: form.perangkat.trim(),
        linkBukti: form.linkBukti.trim(),
      };

      const isUpdate = editItem !== null && !editItem.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isUpdate ? editItem.id : undefined,
        rowData,
      });

      const updatedItem: SaranaItem = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: "inventory",
          namaPrasarana: rowData.namaPrasarana,
          dayaTampung: rowData.dayaTampung,
          luasRuang: rowData.luasRuang,
          status: rowData.status,
          publicDomain: rowData.publicDomain,
          perangkat: rowData.perangkat,
          linkBukti: rowData.linkBukti,
        },
      };

      if (editItem) {
        setRows(rows.map((r) => (r.id === editItem.id ? updatedItem : r)));
        triggerToast("Data prasarana berhasil diperbarui.", "success");
      } else {
        setRows([...rows, updatedItem]);
        triggerToast("Prasarana berhasil ditambahkan.", "success");
      }
      setModalOpen(false);
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus prasarana ini?")) return;
    setIsLoading(true);
    try {
      await deleteLkpsRow({ tabelKode, rowId: id });
      setRows(rows.filter((r) => r.id !== id));
      triggerToast("Prasarana berhasil dihapus.", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menghapus data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const totalDayaTampung = rows.reduce((a, r) => a + (r.rowData.dayaTampung || 0), 0);
  const totalLuasRuang = rows.reduce((a, r) => a + (r.rowData.luasRuang || 0), 0);
  const milikSendiri = rows.filter((r) => r.rowData.status === "M").length;
  const sewa = rows.filter((r) => r.rowData.status === "W").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-3" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 3
        </Link>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
        >
          <Plus className="h-4 w-4" /> Tambah Prasarana
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/60 px-5 py-4 text-xs font-semibold text-emerald-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-emerald-500" />
        <span>
          <strong>Klik "Tambah Prasarana"</strong> untuk menambahkan sarana dan prasarana penelitian. Klik <strong>Edit</strong> untuk mengubah atau <strong>Hapus</strong> untuk menghapus item.
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Prasarana</div>
            <p className="text-3xl font-black text-slate-800">{rows.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Daya Tampung</div>
            <p className="text-3xl font-black text-emerald-600">{totalDayaTampung}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Luas Ruang</div>
            <p className="text-3xl font-black text-teal-600">{totalLuasRuang} m²</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Milik / Sewa</div>
            <p className="text-3xl font-black text-slate-700">{milikSendiri} / {sewa}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-emerald-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sarana dan Prasarana Penelitian</h3>
                <p className="text-2xs font-semibold text-emerald-200">Inventaris laboratorium dan perangkat penelitian</p>
              </div>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-sm px-3 py-1 text-2xs font-bold text-white">
              {rows.length} items
            </span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Server className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Belum ada data prasarana penelitian.</p>
            <p className="text-xs text-slate-400 mt-1">Klik "Tambah Prasarana" untuk memulai.</p>
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
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Milik/Sewa</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Public/Lisensi</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Perangkat</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.rowData.namaPrasarana}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">{item.rowData.dayaTampung || "-"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">{item.rowData.luasRuang || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.status === "M"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.rowData.status === "M" ? "Milik Sendiri" : "Sewa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-2xs font-bold ${
                        item.rowData.publicDomain === "P"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.rowData.publicDomain === "P" ? "Public Domain" : "Tidak Berlisensi"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{item.rowData.perangkat || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-2xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                  <td colSpan={2} className="px-4 py-3 text-left font-black text-slate-700 uppercase tracking-wider">Total</td>
                  <td className="px-4 py-3 text-center font-black text-emerald-600">{totalDayaTampung}</td>
                  <td className="px-4 py-3 text-center font-black text-teal-600">{totalLuasRuang} m²</td>
                  <td colSpan={3} className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-soft-sm">
                  {editItem ? <Edit2 className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editItem ? "Edit Prasarana Penelitian" : "Tambah Prasarana Penelitian"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {editItem ? "Ubah data prasarana penelitian." : "Tambah sarana/prasarana baru."}
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                {/* Nama Prasarana */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
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
                      className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-300"
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
                        className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-300"
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
                        className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Kepemilikan */}
                <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
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
                                ? "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-soft-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
                            }`}
                          >
                            {v === "M" ? "Milik Sendiri" : "Sewa"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-2">Public Domain / Lisensi</label>
                      <div className="flex gap-2">
                        {(["P", "T"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, publicDomain: v }))}
                            className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                              form.publicDomain === v
                                ? "bg-gradient-to-tr from-teal-500 to-cyan-600 text-white shadow-soft-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"
                            }`}
                          >
                            {v === "P" ? "Public" : "Tidak Berlisensi"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perangkat */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Monitor className="h-4 w-4" /> Perangkat / Fasilitas
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">
                      Perangkat (Hardware, Software, dll)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="cth: Komputer 40 unit, AC, Proyektor, Internet 100 Mbps"
                      value={form.perangkat}
                      onChange={(e) => setForm((p) => ({ ...p, perangkat: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 mb-1">Link Bukti / Dokumentasi</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.linkBukti}
                      onChange={(e) => setForm((p) => ({ ...p, linkBukti: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50"
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800"
          >
            <CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
