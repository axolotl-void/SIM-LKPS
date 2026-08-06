import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils/format";
import type { Metadata } from "next";
import { ScrollText, Activity, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Log",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AuditLogPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  if (!hasPermission(role, "audit_log.read")) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 30;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.auditLog.count(),
  ]);

  const actionColors: Record<
    string,
    { bg: string; text: string; ring: string }
  > = {
    CREATE: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200/60",
    },
    UPDATE: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200/60",
    },
    DELETE: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200/60",
    },
    LOGIN: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200/60",
    },
    LOGOUT: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      ring: "ring-slate-200/60",
    },
  };

  const todayCount = logs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;

  const uniqueUsers = new Set(logs.map((log) => log.userId).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
          <ScrollText className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Riwayat Aktivitas
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Jejak audit sistem untuk transparansi dan akuntabilitas.
          </p>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Entri
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Hari Ini
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {todayCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ScrollText className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                User Aktif (halaman)
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {uniqueUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Waktu</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Aksi</th>
                <th className="px-5 py-3.5">Entitas</th>
                <th className="px-5 py-3.5">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-slate-400"
                  >
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <ScrollText
                          className="h-5 w-5 text-slate-400"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="font-medium text-slate-500">
                        Belum ada aktivitas
                      </p>
                      <p className="text-xs text-slate-400">
                        Log aktivitas akan muncul di sini begitu ada aksi yang
                        tercatat.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const color: {
                    bg: string;
                    text: string;
                    ring: string;
                  } = actionColors[log.action] ?? actionColors.LOGOUT!;
                  return (
                    <tr
                      key={log.id}
                      className="transition-colors duration-150 hover:bg-slate-50/60"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800">
                          {log.user?.name || "System"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${color.bg} ${color.text} ${color.ring}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {log.entity}
                      </td>
                      <td className="max-w-xs truncate px-5 py-3.5 font-mono text-xs text-slate-400">
                        {log.entityId || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
