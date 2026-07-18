"use client";

import { useState, useCallback } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save,
  GraduationCap, BookOpen, Monitor, Users, GitBranch,
  Edit2, Lightbulb, Globe, Link as LinkIcon, Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow, deleteLkpsRow } from "@/lib/actions/lkps";

const TYPES = [
  { key: "mahasiswaAktif", label: "Jumlah Mahasiswa Aktif", icon: Users, color: "from-blue-500 to-cyan-500" },
  { key: "microCredential", label: "Micro-credential", icon: GraduationCap, color: "from-indigo-500 to-purple-500" },
  { key: "rplA2", label: "RPL tipe A-2", icon: BookOpen, color: "from-purple-500 to-pink-500" },
  { key: "pembelajaranPSLain", label: "Pembelajaran di PS lain", icon: Monitor, color: "from-emerald-500 to-teal-500" },
  { key: "pembelajaranPTLain", label: "Pembelajaran di PT lain", icon: Globe, color: "from-orange-500 to-amber-500" },
  { key: "cblPbl", label: "CBL / PBL", icon: GitBranch, color: "from-rose-500 to-red-500" },
];

interface Props {
  tahunAkademikId: string;
  tabelKode: string;
  rowsTs: Record<string, any>;
  rowsTs1: Record<string, any>;
  rowsTs2: Record<string, any>;
}

export function Tabel2CClient({ tahunAkademikId, tabelKode, rowsTs, rowsTs1, rowsTs2 }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formLink, setFormLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Get link from any existing entry
  const getExistingLink = useCallback(() => {
    for (const t of TYPES) {
      const link = rowsTs[t.key]?.linkBukti;
      if (link) return link;
    }
    return "";
  }, [rowsTs]);

  const openModal = () => {
    const data: Record<string, string> = {};
    for (const t of TYPES) {
      data[t.key] = rowsTs[t.key]?.ts ? String(rowsTs[t.key].ts) : "";
    }
    setFormData(data);
    setFormLink(getExistingLink());
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      for (const t of TYPES) {
        await upsertLkpsRow({
          tabelKode,
          tahunAkademikId,
          rowId: rowsTs[t.key]?.id || undefined,
          rowData: {
            key: t.key,
            label: t.label,
            ts: Number(formData[t.key]) || 0,
            linkBukti: formLink,
          },
        });
      }
      setModalOpen(false);
      triggerToast("Semua data fleksibilitas berhasil disimpan", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    const id = rowsTs[key]?.id;
    if (!id) return;
    setIsLoading(true);
    try {
      await deleteLkpsRow(id, "/lkps/bab-2/tabel-2c");
      setDeleteKey(null);
      triggerToast("Data berhasil dihapus", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menghapus.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getNum = (row: any) => {
    const n = Number(row?.ts);
    return isNaN(n) ? "-" : n.toLocaleString("id-ID");
  };

  // Totals
  const sumField = (rows: Record<string, any>, key: string) => {
    const v = rows[key]?.ts;
    return isNaN(Number(v)) ? 0 : Number(v);
  };

  const totalTs2 = TYPES.reduce((a, t) => a + sumField(rowsTs2, t.key), 0);
  const totalTs1 = TYPES.reduce((a, t) => a + sumField(rowsTs1, t.key), 0);
  const totalTs = TYPES.reduce((a, t) => a + sumField(rowsTs, t.key), 0);
  const mhsAktif = sumField(rowsTs, "mahasiswaAktif");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
        <button onClick={openModal} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all">
          <Edit2 className="h-4 w-4" /> Edit Data TS
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/60 px-5 py-4 text-xs font-semibold text-indigo-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-indigo-500" />
        <span>Klik <strong>"Edit Data TS"</strong> untuk mengisi semua bentuk pembelajaran sekaligus.</span>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft border border-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Bentuk Pembelajaran</th>
                <th className="px-3 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-20">TS-2</th>
                <th className="px-3 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-20">TS-1</th>
                <th className="px-3 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-20">TS</th>
                <th className="px-3 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Link Bukti</th>
                <th className="px-3 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TYPES.map((item) => {
                const Icon = item.icon;
                const ts = rowsTs[item.key] || {};
                const ts1 = rowsTs1[item.key] || {};
                const ts2 = rowsTs2[item.key] || {};
                const link = ts.linkBukti;
                return (
                  <tr key={item.key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-soft-sm`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-slate-400 border-r border-slate-100">{getNum(ts2)}</td>
                    <td className="px-3 py-3.5 text-center font-bold text-slate-400 border-r border-slate-100">{getNum(ts1)}</td>
                    <td className="px-3 py-3.5 text-center font-black text-indigo-600 border-r border-slate-100">{getNum(ts)}</td>
                    <td className="px-3 py-3.5 border-r border-slate-100">
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-2xs font-bold text-indigo-600 border border-indigo-100/50 hover:bg-indigo-100 hover:text-indigo-700 transition-all max-w-[220px] truncate">
                          <LinkIcon className="h-3 w-3 shrink-0" />
                          <span className="truncate">{link.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 text-2xs font-semibold">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={() => { if (rowsTs[item.key]?.id) setDeleteKey(item.key); }}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-100/80">
                <td className="px-4 py-3 font-black text-slate-800 border-r border-slate-200">Jumlah Total</td>
                <td className="px-3 py-3 text-center font-black text-slate-700 border-r border-slate-200">{totalTs2.toLocaleString("id-ID")}</td>
                <td className="px-3 py-3 text-center font-black text-slate-700 border-r border-slate-200">{totalTs1.toLocaleString("id-ID")}</td>
                <td className="px-3 py-3 text-center font-black text-indigo-700 border-r border-slate-200">{totalTs.toLocaleString("id-ID")}</td>
                <td colSpan={2} className="px-3 py-3 text-xs font-bold text-slate-500">
                  {mhsAktif > 0 ? (
                    <span>Persentase partisipasi: <strong className="text-indigo-600">{((totalTs / mhsAktif) * 100).toFixed(1)}%</strong> dari {mhsAktif.toLocaleString("id-ID")} mahasiswa aktif</span>
                  ) : "Isi Jumlah Mahasiswa Aktif untuk melihat persentase"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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
              className="w-full max-w-2xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-soft-sm">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Fleksibilitas Pembelajaran — TS</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Isi jumlah mahasiswa untuk setiap bentuk pembelajaran</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TYPES.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft-sm hover:shadow-soft transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-soft-sm`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData[item.key] || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, [item.key]: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-300 text-center"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
                  <label className="block text-2xs font-bold text-slate-600 mb-2">Link Bukti Pendukung</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-300"
                  />
                  <p className="mt-1.5 text-2xs font-semibold text-slate-400">Link akan diterapkan ke semua jenis pembelajaran</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                      : <><Save className="h-4 w-4" /> Simpan Semua</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 shadow-soft-sm">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hapus Data</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold">Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeleteKey(null)}
                  className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
                <button onClick={() => { if (deleteKey) handleDelete(deleteKey); }}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition-colors">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800">
            {toast.type === "success"
              ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              : <X className="h-5 w-5 text-red-400 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
