"use client";

import { useEffect, useState } from "react";
import { Pencil, X, Loader2 } from "lucide-react";
import { updateUser, resetUserPassword } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { ROLE_LABELS } from "@/lib/utils/permissions";

export interface EditableUser {
  id: string;
  name: string;
  email: string;
  role: keyof typeof ROLE_LABELS;
  isActive: boolean;
}

interface EditUserDialogProps {
  user: EditableUser;
  trigger?: React.ReactNode;
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setResetOpen(false);
      setNewPassword("");
      setResetMessage("");
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateUser(user.id, formData);

      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Gagal memperbarui user");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword() {
    if (newPassword.length < 8) {
      setResetMessage("Password minimal 8 karakter");
      return;
    }
    setResetLoading(true);
    setResetMessage("");
    try {
      const result = await resetUserPassword(user.id, newPassword);
      if (result.success) {
        setResetMessage("Password berhasil direset");
        setNewPassword("");
      } else {
        setResetMessage(result.error || "Gagal reset password");
      }
    } catch {
      setResetMessage("Terjadi kesalahan");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <>
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="inline-block">
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Edit Pengguna
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                <div>
                  <label
                    htmlFor={`edit-name-${user.id}`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id={`edit-name-${user.id}`}
                    name="name"
                    type="text"
                    required
                    defaultValue={user.name}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`edit-email-${user.id}`}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Email
                  </label>
                  <input
                    id={`edit-email-${user.id}`}
                    name="email"
                    type="email"
                    required
                    defaultValue={user.email}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`edit-role-${user.id}`}
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Role
                    </label>
                    <select
                      id={`edit-role-${user.id}`}
                      name="role"
                      required
                      defaultValue={user.role}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="ADMIN">Administrator</option>
                      <option value="OPERATOR">Operator / Tim LKPS</option>
                      <option value="VALIDATOR">Validator / Kaprodi</option>
                      <option value="PIMPINAN">Pimpinan</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-active-${user.id}`}
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Status
                    </label>
                    <select
                      id={`edit-active-${user.id}`}
                      name="isActive"
                      defaultValue={String(user.isActive)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                </div>

                {/* Reset password toggle */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                  <button
                    type="button"
                    onClick={() => setResetOpen((v) => !v)}
                    className="flex w-full items-center justify-between text-xs font-semibold text-slate-700"
                  >
                    Reset Password
                    <span className="text-slate-400">
                      {resetOpen ? "−" : "+"}
                    </span>
                  </button>
                  {resetOpen && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password baru (min 8 karakter)"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={resetLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-50"
                      >
                        {resetLoading && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        Simpan Password Baru
                      </button>
                      {resetMessage && (
                        <p className="text-xs text-slate-600">{resetMessage}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:shadow-blue-500/30 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
