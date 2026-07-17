"use client";

import { ROLE_LABELS } from "@/lib/utils/permissions";
import { formatDateTime } from "@/lib/utils/format";
import { deleteUser } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserTableProps {
  users: User[];
  meta: Meta;
}

const roleBadgeColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  OPERATOR: "bg-blue-100 text-blue-700",
  VALIDATOR: "bg-amber-100 text-amber-700",
  PIMPINAN: "bg-emerald-100 text-emerald-700",
};

export function UserTable({ users, meta }: UserTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`Nonaktifkan user "${userName}"?`)) return;

    setDeleting(userId);
    try {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert(result.error || "Gagal menonaktifkan user");
      }
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Tidak ada user ditemukan
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        roleBadgeColors[user.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deleting === user.id}
                        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deleting === user.id ? "..." : "Nonaktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-gray-500">
            Menampilkan {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}`}
                className={`rounded px-3 py-1 text-sm ${
                  p === meta.page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
