"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save,
  Building2, Factory, Briefcase, Users,
  Edit2, Lightbulb, FileText, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow } from "@/lib/actions/lkps";

interface Props {
  tahunAkademikId: string;
  tabelKode: string;
  defaultSources: { key: string; label: string }[];
  rowsTs: Record<string, any>;
  rowsTs1: Record<string, any>;
  rowsTs2: Record<string, any>;
}

const SOURCE_ICONS: Record<string, any> = {
  masyarakat: Users,
  duniaUsaha: Briefcase,
  duniaIndustri: Factory,
  duniaKerja: Building2,
};

const SOURCE_COLORS: Record<string, string> = {
  masyarakat: "from-blue-500 to-cyan-500",
  duniaUsaha: "from-indigo-500 to-purple-500",
  duniaIndustri: "from-purple-500 to-pink-500",
  duniaKerja: "from-emerald-500 to-teal-500",
};

export function Tabel2DClient({ tahunAkademikId, tabelKode, defaultSources, rowsTs, rowsTs1, rowsTs2 }: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [formJenis, setFormJenis] = useState("");
  const [formTs, setFormTs] = useState("");
  const [linkBukti, setLinkBukti] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (key: string, label: string) => {
    setEditKey(key);
    setEditLabel(label);
    setFormJenis(rowsTs[key]?.jenis || "");
    setFormTs(rowsTs[key]?.ts !== undefined ? String(rowsTs[key].ts) : "");
    setLinkBukti(rowsTs[key]?.linkBukti || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await upsertLkpsRow({
        tabelKode, tahunAkademikId,
        rowId: rowsTs[editKey]?.id || undefined,
        rowData: { key: editKey, label: editLabel, jenis: formJenis, ts: Number(formTs) || 0, linkBukti },
      });

      triggerToast("Data rekognisi berhasil disimpan", "success");
      setModalOpen(false);
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? "-" : n.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/60 px-5 py-4 text-xs font-semibold text-emerald-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-emerald-500" />
        <span>Klik <strong>Edit</strong> pada setiap baris untuk mengisi data TS. Data TS-1 dan TS-2 otomatis dari tahun sebelumnya.</span>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft border border-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Sumber Rekognisi</th>
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">Jenis Pengakuan</th>
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-24">TS-2</th>
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-24">TS-1</th>
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-24">TS</th>
                <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-24">Link</th>
                <th className="px-4 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {defaultSources.map((item) => {
                const Icon = SOURCE_ICONS[item.key] || FileText;
                const tsRow = rowsTs[item.key] || {};
                const ts1Row = rowsTs1[item.key] || {};
                const ts2Row = rowsTs2[item.key] || {};

                return (
                  <tr key={item.key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${SOURCE_COLORS[item.key] || "from-blue-500 to-indigo-600"} text-white shadow-soft-sm`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-500 border-r border-slate-100">{tsRow.jenis || "-"}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-400 border-r border-slate-100">{fmt(ts2Row.ts)}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-400 border-r border-slate-100">{fmt(ts1Row.ts)}</td>
                    <td className="px-4 py-3 text-center font-black text-emerald-600 border-r border-slate-100">{fmt(tsRow.ts)}</td>
                    <td className="px-4 py-3 text-center border-r border-slate-100">
                      {tsRow.linkBukti ? (
                        <a href={tsRow.linkBukti} target="_blank" className="text-emerald-500 hover:text-emerald-700">
                          <LinkIcon className="h-4 w-4 inline" />
                        </a>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => openEdit(item.key, item.label)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-2xs font-bold text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-lg rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${SOURCE_COLORS[editKey] || "from-blue-500 to-indigo-600"} text-white shadow-soft-sm`}>
                  {(() => { const Icon = SOURCE_ICONS[editKey] || FileText; return <Icon className="h-7 w-7" />; })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Rekognisi</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{editLabel}</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Jenis Pengakuan (Rekognisi)</label>
                  <input type="text" placeholder="cth: Sertifikat Kompetensi" value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 shadow-3xs placeholder:text-slate-300" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">TS-2</label>
                    <input type="number" min="0" placeholder="0" value={formTs}
                      onChange={(e) => setFormTs(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-400 transition-all focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500/30 shadow-3xs" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">TS-1</label>
                    <input type="number" min="0" placeholder="0" value={formTs}
                      onChange={(e) => setFormTs(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-400 transition-all focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500/30 shadow-3xs" />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-emerald-600 uppercase mb-1">TS *</label>
                    <input type="number" min="0" placeholder="0" value={formTs}
                      onChange={(e) => setFormTs(e.target.value)}
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 shadow-3xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Link Bukti</label>
                  <input type="url" placeholder="https://..." value={linkBukti}
                    onChange={(e) => setLinkBukti(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 shadow-3xs placeholder:text-slate-300" />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
                      : <><Save className="h-4 w-4" /> Simpan</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
