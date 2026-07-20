"use client";

import { useState } from "react";
import {
  Loader2, ArrowLeft, CheckCircle2, X, Save,
  Briefcase, Users, Globe, Edit2, Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow } from "@/lib/actions/lkps";
import ValidationControls from "@/components/tables/validation-controls";

interface Row {
  id: string;
  rowOrder: number;
  rowData: {
    tahun: string;
    jumlahLulusan: number;
    jumlahTerlacak: number;
    profesiInfokom: number;
    profesiNonInfokom: number;
    internasional: number;
    nasional: number;
    wirausaha: number;
  };
}

interface Props {
  initialRows: Row[];
  tahunAkademikId: string;
  tabelKode: string;
  status: string;
  userRole: string;
}

export function Tabel2B5Client({ initialRows, tahunAkademikId, tabelKode, status, userRole }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();
  const canEdit = ["DRAFT", "DIREVISI", "DITOLAK"].includes(currentStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const tsRow = rows.find((r) => r.rowData.tahun === "TS");

  const t = (v: number | undefined | null) => (v ?? 0).toLocaleString("id-ID");

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openModal = () => {
    const data: Record<string, string> = {};
    const fields = ["jumlahLulusan", "jumlahTerlacak", "profesiInfokom", "profesiNonInfokom", "internasional", "nasional", "wirausaha"];
    for (const f of fields) {
      data[f] = tsRow?.rowData[f] !== undefined && tsRow.rowData[f] !== null ? String(tsRow.rowData[f]) : "";
    }
    setForm(data);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const rowData: Record<string, any> = { tahun: "TS" };
      const fields = ["jumlahLulusan", "jumlahTerlacak", "profesiInfokom", "profesiNonInfokom", "internasional", "nasional", "wirausaha"];
      for (const f of fields) {
        rowData[f] = form[f] === "" ? 0 : Number(form[f]) || 0;
      }

      const isTemp = tsRow?.id?.startsWith("temp-");
      const result = await upsertLkpsRow({ tabelKode, tahunAkademikId, rowId: isTemp ? undefined : tsRow?.id, rowData });

      const updated: Row = {
        id: result.id,
        rowOrder: result.rowOrder,
        rowData: {
          tahun: "TS",
          jumlahLulusan: Number(result.rowData.jumlahLulusan) || 0,
          jumlahTerlacak: Number(result.rowData.jumlahTerlacak) || 0,
          profesiInfokom: Number(result.rowData.profesiInfokom) || 0,
          profesiNonInfokom: Number(result.rowData.profesiNonInfokom) || 0,
          internasional: Number(result.rowData.internasional) || 0,
          nasional: Number(result.rowData.nasional) || 0,
          wirausaha: Number(result.rowData.wirausaha) || 0,
        },
      };

      setRows(rows.map((r) => (r.rowData.tahun === "TS" ? updated : r)));
      setModalOpen(false);
      triggerToast("Data bidang kerja berhasil disimpan", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sumField = (key: keyof Row["rowData"]) => rows.reduce((a, r) => a + (r.rowData[key] || 0), 0);
  const tracePct = tsRow && tsRow.rowData.jumlahLulusan > 0
    ? ((tsRow.rowData.jumlahTerlacak / tsRow.rowData.jumlahLulusan) * 100).toFixed(0)
    : "0";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/lkps/bab-2" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
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
            onClick={openModal}
            disabled={!canEdit}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-soft-sm transition-all ${
              canEdit
                ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:shadow-soft"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Edit2 className="h-4 w-4" /> Edit Data TS
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-blue-50/60 border border-blue-100/60 px-5 py-4 text-xs font-semibold text-blue-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-blue-500" />
        <span><strong>Klik "Edit Data TS"</strong> untuk mengisi data kesesuaian bidang kerja Tahun Sekarang.</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lulusan</div>
            <p className="text-3xl font-black text-slate-800">{t(sumField("jumlahLulusan"))}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Terlacak</div>
            <p className="text-3xl font-black text-slate-800">{t(sumField("jumlahTerlacak"))}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Bidang Infokom</div>
            <p className="text-3xl font-black text-indigo-600">{t(sumField("profesiInfokom"))}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tingkat Terlacak</div>
            <p className="text-3xl font-black text-slate-700">
              {sumField("jumlahLulusan") > 0 ? ((sumField("jumlahTerlacak") / sumField("jumlahLulusan")) * 100).toFixed(0) + "%" : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-blue-200/70 bg-white shadow-soft overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-7 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tahun Sekarang (TS)</h3>
                <p className="text-2xs font-semibold text-blue-200">Data kesesuaian bidang kerja lulusan</p>
              </div>
            </div>
            <button onClick={openModal} disabled={!canEdit} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-2xs font-bold transition-all ${canEdit ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30" : "bg-white/5 text-white/30 cursor-not-allowed"}`}>
              <Edit2 className="h-3.5 w-3.5" /> Edit Data
            </button>
          </div>
        </div>

        <div className="p-7">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/30 border border-blue-100/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-blue-700">Data Lulusan</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-2xs font-semibold text-slate-400">Jumlah Lulusan</p>
                  <p className="text-xl font-black text-slate-800">{t(tsRow?.rowData.jumlahLulusan)}</p>
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-400">Lulusan Terlacak</p>
                  <p className="text-xl font-black text-slate-800">{t(tsRow?.rowData.jumlahTerlacak)}</p>
                </div>
                <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${Math.min(Number(tracePct), 100)}%` }} />
                </div>
                <p className="text-2xs font-bold text-blue-600">{tracePct}% terlacak</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-50/30 border border-indigo-100/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-indigo-700">Profesi Kerja</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-2xs font-semibold text-slate-400">Bidang Infokom</p>
                  <p className="text-xl font-black text-indigo-600">{t(tsRow?.rowData.profesiInfokom)}</p>
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-400">Bidang Non-Infokom</p>
                  <p className="text-xl font-black text-slate-800">{t(tsRow?.rowData.profesiNonInfokom)}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-50/30 border border-purple-100/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <span className="text-2xs font-bold uppercase tracking-wider text-purple-700">Lingkup Tempat Kerja</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/70 border border-purple-100/50 p-3">
                  <p className="text-2xs font-semibold text-slate-400">Multinasional</p>
                  <p className="text-lg font-black text-purple-700">{t(tsRow?.rowData.internasional)}</p>
                </div>
                <div className="rounded-xl bg-white/70 border border-purple-100/50 p-3">
                  <p className="text-2xs font-semibold text-slate-400">Nasional</p>
                  <p className="text-lg font-black text-purple-700">{t(tsRow?.rowData.nasional)}</p>
                </div>
                <div className="rounded-xl bg-white/70 border border-purple-100/50 p-3">
                  <p className="text-2xs font-semibold text-slate-400">Wirausaha</p>
                  <p className="text-lg font-black text-purple-700">{t(tsRow?.rowData.wirausaha)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mx-7 py-4 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Seluruh Data</span>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Lulusan</p>
              <p className="text-sm font-black text-slate-800">{t(sumField("jumlahLulusan"))}</p>
            </div>
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Terlacak</p>
              <p className="text-sm font-black text-slate-800">{t(sumField("jumlahTerlacak"))}</p>
            </div>
            <div className="text-right">
              <p className="text-2xs font-semibold text-slate-400">Infokom</p>
              <p className="text-sm font-black text-indigo-600">{t(sumField("profesiInfokom"))}</p>
            </div>
          </div>
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
              className="w-full max-w-xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-8 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-soft-sm">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Kesesuaian Bidang Kerja</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Tahun Sekarang (TS)</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Users className="h-4 w-4" /> Data Lulusan
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Jumlah Lulusan <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 50" value={form.jumlahLulusan || ""}
                        onChange={(e) => setForm((p) => ({ ...p, jumlahLulusan: e.target.value }))}
                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Lulusan Terlacak <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 45" value={form.jumlahTerlacak || ""}
                        onChange={(e) => setForm((p) => ({ ...p, jumlahTerlacak: e.target.value }))}
                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <Briefcase className="h-4 w-4" /> Profesi Kerja
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Bidang Infokom <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 30" value={form.profesiInfokom || ""}
                        onChange={(e) => setForm((p) => ({ ...p, profesiInfokom: e.target.value }))}
                        className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Bidang Non-Infokom <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="cth: 10" value={form.profesiNonInfokom || ""}
                        onChange={(e) => setForm((p) => ({ ...p, profesiNonInfokom: e.target.value }))}
                        className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <Globe className="h-4 w-4" /> Lingkup Tempat Kerja
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Multinasional <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="0" value={form.internasional || ""}
                        onChange={(e) => setForm((p) => ({ ...p, internasional: e.target.value }))}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Nasional <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="0" value={form.nasional || ""}
                        onChange={(e) => setForm((p) => ({ ...p, nasional: e.target.value }))}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-600 mb-1">Wirausaha <span className="text-red-500">*</span></label>
                      <input type="number" min="0" placeholder="0" value={form.wirausaha || ""}
                        onChange={(e) => setForm((p) => ({ ...p, wirausaha: e.target.value }))}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                      : <><Save className="h-4 w-4" /> Simpan Data</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg bg-slate-900 border border-slate-800"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
