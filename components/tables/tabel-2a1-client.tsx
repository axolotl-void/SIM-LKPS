"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, X, ArrowLeft, Loader2, Save, Edit2,
  FileText, Users, GraduationCap, BookOpen, UserPlus,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { upsertLkpsRow } from "@/lib/actions/lkps";

interface RowData {
  id: string;
  rowOrder: number;
  rowData: Record<string, any>;
}

interface Props {
  initialRows: RowData[];
  tahunAkademikId: string;
  tabelKode: string;
}

const TS_LABELS = ["TS-3", "TS-2", "TS-1", "TS"];

const FIELD_GROUPS = [
  {
    label: "Calon Mahasiswa",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    fields: [
      { key: "dayaTampung", label: "Daya Tampung", placeholder: "cth: 120" },
      { key: "pendaftar", label: "Jumlah Pendaftar", placeholder: "cth: 1100" },
      { key: "lulusSeleksi", label: "Lulus Seleksi", placeholder: "cth: 310" },
      { key: "calonKebutuhanKhusus", label: "Kebutuhan Khusus", placeholder: "cth: 0" },
    ],
  },
  {
    label: "Mahasiswa Baru Reguler",
    icon: GraduationCap,
    color: "from-indigo-500 to-purple-500",
    fields: [
      { key: "mabaRegulerDiterima", label: "Diterima", placeholder: "cth: 290" },
      { key: "mabaRegulerAfirmasi", label: "Afirmasi", placeholder: "cth: 10" },
      { key: "mabaRegulerKhusus", label: "Kebutuhan Khusus", placeholder: "cth: 0" },
    ],
  },
  {
    label: "Mahasiswa Baru Transfer/RPL",
    icon: UserPlus,
    color: "from-purple-500 to-pink-500",
    fields: [
      { key: "mabaRplDiterima", label: "Diterima", placeholder: "cth: 20" },
      { key: "mabaRplAfirmasi", label: "Afirmasi", placeholder: "cth: 0" },
      { key: "mabaRplKhusus", label: "Kebutuhan Khusus", placeholder: "cth: 0" },
    ],
  },
  {
    label: "Mahasiswa Aktif Reguler",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
    fields: [
      { key: "aktifRegulerJumlah", label: "Jumlah", placeholder: "cth: 300" },
      { key: "aktifRegulerAfirmasi", label: "Afirmasi", placeholder: "cth: 8" },
      { key: "aktifRegulerKhusus", label: "Kebutuhan Khusus", placeholder: "cth: 0" },
    ],
  },
  {
    label: "Mahasiswa Aktif Transfer/RPL",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    fields: [
      { key: "aktifRplJumlah", label: "Jumlah", placeholder: "cth: 10" },
      { key: "aktifRplAfirmasi", label: "Afirmasi", placeholder: "cth: 0" },
      { key: "aktifRplKhusus", label: "Kebutuhan Khusus", placeholder: "cth: 0" },
    ],
  },
];

export function Tabel2A1Client({ initialRows, tahunAkademikId, tabelKode }: Props) {
  const router = useRouter();

  const [rows, setRows] = useState<RowData[]>(() => {
    const current = [...initialRows];
    if (current.length === 0) {
      return TS_LABELS.map((ts, i) => ({
        id: `temp-${i}`,
        rowOrder: i + 1,
        rowData: { ts_label: ts },
      }));
    }
    const ordered: RowData[] = [];
    for (let i = 0; i < 4; i++) {
      const ts = TS_LABELS[i];
      const existing = current.find((r) => r.rowData.ts_label === ts);
      ordered.push(existing || { id: `temp-${i}`, rowOrder: i + 1, rowData: { ts_label: ts } });
    }
    return ordered;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const tsRow = rows.find((r) => r.rowData.ts_label === "TS") || rows[3];

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openModal = () => {
    const data: Record<string, string> = {};
    for (const g of FIELD_GROUPS) {
      for (const f of g.fields) {
        const val = tsRow.rowData[f.key];
        data[f.key] = val !== undefined && val !== "" && val !== null ? String(val) : "";
      }
    }
    setFormData(data);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const rowData: Record<string, any> = { ts_label: "TS" };
      for (const g of FIELD_GROUPS) {
        for (const f of g.fields) {
          rowData[f.key] = formData[f.key] === "" ? 0 : Number(formData[f.key]) || 0;
        }
      }

      const isTemp = tsRow.id.startsWith("temp-");
      const result = await upsertLkpsRow({
        tabelKode,
        tahunAkademikId,
        rowId: isTemp ? undefined : tsRow.id,
        rowData,
      });

      const updated = { id: result.id, rowOrder: tsRow.rowOrder, rowData: result.rowData };
      setRows(rows.map((r) => (r.rowData.ts_label === "TS" ? updated : r)));
      setModalOpen(false);
      triggerToast("Data mahasiswa berhasil disimpan", "success");
      router.refresh();
    } catch {
      triggerToast("Gagal menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const val = (row: RowData, key: string) => {
    const v = row.rowData[key];
    return v !== undefined && v !== "" && v !== null ? Number(v).toLocaleString("id-ID") : "-";
  };

  const sum = (key: string) => {
    const total = rows.reduce((a, r) => a + (Number(r.rowData[key]) || 0), 0);
    return total.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/lkps/bab-2"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke BAB 2
        </Link>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
        >
          <Edit2 className="h-4 w-4" /> Edit Data TS
        </button>
      </div>

      {/* Info */}
      <div className="flex items-center gap-2 rounded-2xl bg-blue-50/50 border border-blue-100/50 px-4 py-3 text-2xs font-semibold text-blue-700">
        <Lightbulb className="h-4 w-4 shrink-0 text-blue-500" />
        <span>Data TS-3, TS-2, TS-1 otomatis dari tahun akademik sebelumnya. <strong>Klik "Edit Data TS"</strong> untuk mengisi data Tahun Sekarang.</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft border border-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th rowSpan={2} className="px-3 py-2.5 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 bg-slate-100/50 w-16">TS</th>
                <th colSpan={4} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 bg-blue-50/50">Calon Mahasiswa</th>
                <th colSpan={3} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 bg-indigo-50/50">Maba Reguler</th>
                <th colSpan={3} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 bg-purple-50/50">Maba Transfer/RPL</th>
                <th colSpan={3} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 bg-emerald-50/50">Aktif Reguler</th>
                <th colSpan={3} className="px-3 py-2 font-extrabold text-slate-500 uppercase tracking-wider text-center bg-orange-50/50">Aktif Transfer/RPL</th>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Daya Tampung</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Pendaftar</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Lulus Seleksi</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Kebutuhan Khusus</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Diterima</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Afirmasi</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Kebutuhan Khusus</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Diterima</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Afirmasi</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Kebutuhan Khusus</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Jumlah</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Afirmasi</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Kebutuhan Khusus</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Jumlah</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center border-r border-slate-100">Afirmasi</th>
                <th className="px-2 py-2 font-bold text-slate-500 text-center">Kebutuhan Khusus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => {
                const isTS = row.rowData.ts_label === "TS";
                return (
                  <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${isTS ? "bg-blue-50/20" : ""}`}>
                    <td className={`px-3 py-2.5 font-bold text-center border-r border-slate-100 ${isTS ? "text-blue-700" : "text-slate-600"}`}>
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-2xs font-bold border ${
                        isTS
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : idx === 0 ? "bg-slate-100 text-slate-600 border-slate-200"
                          : idx === 1 ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {row.rowData.ts_label}
                      </span>
                    </td>
                    {FIELD_GROUPS.flatMap((g) => g.fields).map((f) => (
                      <td key={f.key} className={`px-2 py-2.5 text-center border-r border-slate-100 last:border-r-0 ${
                        isTS ? "font-black text-slate-800" : "font-semibold text-slate-400"
                      }`}>
                        {val(row, f.key)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {/* Jumlah row */}
              <tr className="bg-slate-100/80 border-t-2 border-slate-200">
                <td className="px-3 py-2.5 font-black text-slate-800 text-center border-r border-slate-200">Jumlah</td>
                {FIELD_GROUPS.flatMap((g) => g.fields).map((f) => (
                  <td key={f.key} className="px-2 py-2.5 text-center font-black text-slate-700 border-r border-slate-200 last:border-r-0">
                    {sum(f.key)}
                  </td>
                ))}
              </tr>
            </tbody>
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
              className="w-full max-w-2xl rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7 my-8"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-soft-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Edit Data Mahasiswa — TS</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Isi data mahasiswa untuk Tahun Sekarang (TS)</p>
                </div>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                className="space-y-5"
              >
                {FIELD_GROUPS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.label} className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wide"
                        style={{ color: group.color.includes("blue") ? "#2563eb" : group.color.includes("indigo") ? "#6366f1" : group.color.includes("purple") ? "#9333ea" : group.color.includes("emerald") ? "#059669" : "#d97706" }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{group.label}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {group.fields.map((f) => (
                          <div key={f.key}>
                            <label className="block text-2xs font-bold text-slate-600 mb-1">{f.label}</label>
                            <input
                              type="number"
                              min="0"
                              placeholder={f.placeholder}
                              value={formData[f.key] || ""}
                              onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 shadow-3xs placeholder:text-slate-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={isLoading}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>
                    ) : (
                      <><Save className="h-4 w-4" /> Simpan Data</>
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
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-xs font-bold text-white shadow-soft-lg ${
              toast.type === "success" ? "bg-slate-900 border border-slate-800" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
