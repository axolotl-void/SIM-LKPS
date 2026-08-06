"use client";

import { useState } from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import { deleteUser } from "@/lib/actions/user";
import { useRouter } from "next/navigation";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  variant?: "soft" | "hard";
}

export function DeleteUserDialog({
  userId,
  userName,
  variant = "soft",
}: DeleteUserDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isHardDelete = variant === "hard";

  async function handleConfirm() {
    setIsLoading(true);
    setError("");
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Gagal menghapus user");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Hapus ${userName}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition-all duration-150 hover:border-rose-300 hover:bg-rose-50"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        Hapus
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isLoading && setIsOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start gap-4 px-6 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200/60">
                  <Trash2 className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-slate-900">
                    {isHardDelete
                      ? "Hapus Pengguna Permanen?"
                      : "Nonaktifkan Pengguna?"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {isHardDelete ? (
                      <>
                        User{" "}
                        <span className="font-semibold text-slate-900">
                          {userName}
                        </span>{" "}
                        akan dihapus permanen dari database. Tindakan ini{" "}
                        <span className="font-semibold text-rose-700">
                          tidak dapat dibatalkan
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        User{" "}
                        <span className="font-semibold text-slate-900">
                          {userName}
                        </span>{" "}
                        akan dinonaktifkan. Data historis tetap tersimpan dan
                        user tidak akan bisa login.
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !isLoading && setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <div className="mx-6 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="mt-6 flex gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  type="button"
                  onClick={() => !isLoading && setIsOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-500/20 transition-all hover:shadow-md hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading
                    ? "Memproses..."
                    : isHardDelete
                      ? "Ya, Hapus Permanen"
                      : "Ya, Nonaktifkan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
