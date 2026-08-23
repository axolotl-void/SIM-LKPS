"use client";

import { ROLE_LABELS, hasPermission } from "@/lib/utils/permissions";
import { formatDateTime } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { EditUserDialog, type EditableUser } from "@/components/forms/edit-user-dialog";
import { DeleteUserDialog } from "@/components/forms/delete-user-dialog";

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
  currentRole: Role;
}

const roleBadgeColors: Record<string, string> = {
  ADMIN: "bg-rose-50 text-rose-700 ring-rose-200/60",
  OPERATOR: "bg-blue-50 text-blue-700 ring-blue-200/60",
  VALIDATOR: "bg-amber-50 text-amber-700 ring-amber-200/60", // legacy — kept for type-safety fallback
  PIMPINAN: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
};

export function UserTable({ users, meta, currentRole }: UserTableProps) {
  const router = useRouter();
  const canEdit = hasPermission(currentRole, "user.update");
  const canDelete = hasPermission(currentRole, "user.delete");
  const hasAnyAction = canEdit || canDelete;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200/60 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Nama</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Dibuat</th>
              {hasAnyAction && (
                <th className="px-5 py-3.5 text-right">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={hasAnyAction ? 6 : 5}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
                  <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <span className="text-xl text-slate-300">∅</span>
                    </div>
                    <p className="font-medium text-slate-500">
                      Tidak ada user ditemukan
                    </p>
                    <p className="text-xs text-slate-400">
                      Coba ubah pencarian, atau tambahkan user baru.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const editable: EditableUser = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role as keyof typeof ROLE_LABELS,
                  isActive: user.isActive,
                };
                return (
                  <tr
                    key={user.id}
                    className="transition-colors duration-150 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                          {user.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          roleBadgeColors[user.role] ||
                          "bg-slate-50 text-slate-700 ring-slate-200/60"
                        }`}
                      >
                        {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ||
                          user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                    {hasAnyAction && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <EditUserDialog user={editable} />
                          )}
                          {canDelete && (
                            <DeleteUserDialog
                              userId={user.id}
                              userName={user.name}
                              variant="hard"
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
          <p className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700">
              {(meta.page - 1) * meta.limit + 1}
              –{Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            dari <span className="font-semibold text-slate-700">{meta.total}</span>
          </p>
          <div className="flex gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}`}
                className={`cursor-pointer rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  p === meta.page
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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