"use client";

import { useState } from "react";
import {
  Upload, FileText, Trash2, Download, Loader2,
  X, CheckCircle2, AlertTriangle, File, Image, FileSpreadsheet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadEvidence, getEvidenceList, deleteEvidence, getTabelLkpsId } from "@/lib/actions/evidence";

interface EvidenceItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  version: number;
  description: string | null;
  downloadUrl: string;
  createdAt: Date;
}

interface TabelLkpsItem {
  id: string;
  tabelDefinition: { kode: string; nama: string; bab: number };
  evidence: EvidenceItem[];
}

interface Props {
  tabelLkpsWithEvidence: TabelLkpsItem[];
  allTabelLkps: TabelLkpsItem[];
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
  if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  return <File className="h-5 w-5 text-slate-500" />;
}

export function EvidenceClient({ tabelLkpsWithEvidence, allTabelLkps }: Props) {
  const [tabelLkpsWithEv, setTabelLkpsWithEv] = useState(tabelLkpsWithEvidence);
  const [allLkps, setAllLkps] = useState(allTabelLkps);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpload = async (tabelLkpsId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        triggerToast("Ukuran file maksimal 10MB", "error");
        return;
      }

      setUploadingId(tabelLkpsId);
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadEvidence(tabelLkpsId, formData);
      if (result.success && result.evidence) {
        triggerToast("File berhasil diupload", "success");
        // Refresh list
        const list = await getEvidenceList(tabelLkpsId);
        if (list.success && list.data) {
          setTabelLkpsWithEv((prev) =>
            prev.map((t) =>
              t.id === tabelLkpsId
                ? { ...t, evidence: list.data as EvidenceItem[] }
                : t
            )
          );
        }
      } else {
        triggerToast(result.error || "Gagal upload", "error");
      }
      setUploadingId(null);
    };
    input.click();
  };

  const handleDelete = async (evidenceId: string, tabelLkpsId: string) => {
    const confirmed = window.confirm("Hapus file ini?");
    if (!confirmed) return;

    const result = await deleteEvidence(evidenceId);
    if (result.success) {
      triggerToast("File berhasil dihapus", "success");
      const list = await getEvidenceList(tabelLkpsId);
      if (list.success && list.data) {
        setTabelLkpsWithEv((prev) =>
          prev.map((t) =>
            t.id === tabelLkpsId
              ? { ...t, evidence: list.data as EvidenceItem[] }
              : t
          )
        );
      }
    } else {
      triggerToast(result.error || "Gagal hapus", "error");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {tabelLkpsWithEv.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 shadow-soft border border-slate-100/50 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Belum ada bukti pendukung.</p>
          <p className="text-xs text-slate-400 mt-1">Upload file bukti dari halaman tabel masing-masing.</p>
        </div>
      ) : (
        tabelLkpsWithEv.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white shadow-soft border border-slate-100/50 overflow-hidden">
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.evidence.length > 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">
                    {item.tabelDefinition.kode} — {item.tabelDefinition.nama}
                  </p>
                  <p className="text-2xs font-semibold text-slate-400">
                    {item.evidence.length} file • BAB {item.tabelDefinition.bab}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(item.id); }}
                  disabled={uploadingId === item.id}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-2xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50"
                >
                  {uploadingId === item.id ? (
                    <><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-3 w-3" /> Upload</>
                  )}
                </button>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100">
                    {item.evidence.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-xs text-slate-400">Belum ada file. Klik Upload untuk menambah.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {item.evidence.map((ev) => (
                          <div key={ev.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/50">
                            <div className="flex items-center gap-3 min-w-0">
                              {getFileIcon(ev.mimeType)}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate max-w-[300px]">{ev.filename}</p>
                                <p className="text-2xs font-semibold text-slate-400">{formatSize(ev.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ev.downloadUrl && (
                                <a
                                  href={ev.downloadUrl}
                                  download={ev.filename}
                                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-2xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                                >
                                  <Download className="h-3 w-3" /> Download
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(ev.id, item.id)}
                                className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-2xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" /> Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-5 py-4 text-xs font-bold text-white shadow-soft-lg"
          >
            <CheckCircle2 className={`h-5 w-5 shrink-0 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
