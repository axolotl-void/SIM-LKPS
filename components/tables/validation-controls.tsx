"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle2, X, Loader2,
  ThumbsUp, ThumbsDown, RotateCcw, AlertTriangle
} from "lucide-react";
import { submitLkpsTabel, validateLkpsTabel } from "@/lib/actions/lkps";

interface Props {
  tabelKode: string;
  tahunAkademikId: string;
  currentStatus: string;
  userRole: string;
  onChangeStatus: (status: string) => void;
  triggerToast: (message: string, type: "success" | "error") => void;
}

export default function ValidationControls({
  tabelKode,
  tahunAkademikId,
  currentStatus,
  userRole,
  onChangeStatus,
  triggerToast,
}: Props) {
  const router = useRouter();
  const [submitOpen, setSubmitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);
  const [validateAction, setValidateAction] = useState<"APPROVE" | "REJECT" | "REVISE">("APPROVE");
  const [validateComment, setValidateComment] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const canSubmit = ["DRAFT", "DIREVISI"].includes(currentStatus) && ["OPERATOR", "ADMIN"].includes(userRole);
  const canValidate = currentStatus === "DIAJUKAN" && ["VALIDATOR", "ADMIN"].includes(userRole);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitLkpsTabel(tabelKode, tahunAkademikId);
      onChangeStatus("DIAJUKAN");
      setSubmitOpen(false);
      triggerToast("Tabel berhasil diajukan untuk validasi.", "success");
      router.refresh();
    } catch (e: any) {
      triggerToast(e.message || "Gagal mengajukan.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidate = async () => {
    if ((validateAction === "REJECT" || validateAction === "REVISE") && !validateComment.trim()) {
      triggerToast("Komentar wajib diisi.", "error");
      return;
    }
    setIsValidating(true);
    try {
      await validateLkpsTabel(tabelKode, tahunAkademikId, validateAction, validateComment.trim() || undefined);
      const statusMap = { APPROVE: "DISETUJUI", REJECT: "DITOLAK", REVISE: "DIREVISI" };
      onChangeStatus(statusMap[validateAction]);
      setValidateOpen(false);
      triggerToast(
        `Tabel berhasil ${validateAction === "APPROVE" ? "disetujui" : validateAction === "REJECT" ? "ditolak" : "direvisi"}.`,
        "success"
      );
      router.refresh();
    } catch (e: any) {
      triggerToast(e.message || "Gagal validasi.", "error");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      {/* Submit Button */}
      {canSubmit && (
        <button
          onClick={() => setSubmitOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200"
        >
          <Send className="h-4 w-4" /> Ajukan Validasi
        </button>
      )}

      {/* Validate Button */}
      {canValidate && (
        <button
          onClick={() => { setValidateAction("APPROVE"); setValidateComment(""); setValidateOpen(true); }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all duration-200"
        >
          <CheckCircle2 className="h-4 w-4" /> Validasi
        </button>
      )}

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {submitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft-lg text-center relative"
            >
              <button onClick={() => setSubmitOpen(false)} className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4 shadow-soft-sm">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Ajukan Validasi</h3>
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed px-2">
                Yakin ingin mengajukan tabel ini untuk divalidasi? Data tidak dapat diedit sampai ada keputusan.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setSubmitOpen(false)} disabled={isSubmitting} className="flex-1 rounded-xl border border-slate-100 bg-white py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-soft-sm transition-colors">Batal</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim...</> : <><Send className="h-4 w-4" /> Ya, Ajukan</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Validate Modal */}
      <AnimatePresence>
        {validateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-lg rounded-3xl bg-white shadow-soft-lg border border-slate-100/50 p-7 my-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-soft-sm ${
                  validateAction === "APPROVE" ? "bg-emerald-50 text-emerald-600" :
                  validateAction === "REJECT" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {validateAction === "APPROVE" ? <ThumbsUp className="h-6 w-6" /> :
                   validateAction === "REJECT" ? <ThumbsDown className="h-6 w-6" /> : <RotateCcw className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Validasi Tabel</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Pilih tindakan validasi</p>
                </div>
              </div>

              <div className="flex gap-2 mb-5">
                {(["APPROVE", "REVISE", "REJECT"] as const).map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => { setValidateAction(act); if (act === "APPROVE") setValidateComment(""); }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      validateAction === act
                        ? act === "APPROVE" ? "bg-emerald-500 text-white shadow-soft-sm" :
                          act === "REJECT" ? "bg-red-500 text-white shadow-soft-sm" : "bg-orange-500 text-white shadow-soft-sm"
                        : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {act === "APPROVE" ? "✓ Setujui" : act === "REJECT" ? "✗ Tolak" : "↺ Revisi"}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1.5">
                  Komentar {validateAction !== "APPROVE" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={4}
                  placeholder={validateAction === "APPROVE" ? "Komentar (opsional)..." : "Jelaskan alasan..."}
                  value={validateComment}
                  onChange={(e) => setValidateComment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs transition-all focus:outline-none focus:ring-2 resize-none shadow-3xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-5 border-t border-slate-100">
                <button onClick={() => setValidateOpen(false)} disabled={isValidating} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  <X className="h-4 w-4" /> Batal
                </button>
                <button onClick={handleValidate} disabled={isValidating} className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50">
                  {isValidating ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <><CheckCircle2 className="h-4 w-4" /> Konfirmasi</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
