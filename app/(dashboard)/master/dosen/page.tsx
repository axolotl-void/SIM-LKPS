import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { DosenActions } from "./DosenActions";

export const metadata: Metadata = {
  title: "Master Data - Dosen",
};

export default async function DosenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const dosens = await db.dosen.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Data Dosen</h1>
            <p className="mt-1 text-sm text-slate-300">
              {dosens.length} dosen terdaftar
            </p>
          </div>
          <Link
            href="/master/dosen/new"
            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Dosen
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  NIDN
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nama
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pendidikan
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  JK
                </th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dosens.map((dosen) => (
                <tr key={dosen.id} className="group">
                  <td className="py-3 text-sm font-mono font-semibold text-slate-700">
                    {dosen.nidn}
                  </td>
                  <td className="py-3 text-sm font-semibold text-slate-700">
                    {dosen.nama}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        dosen.status === "Tetap"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {dosen.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {dosen.pendidikanTerakhir}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {dosen.jenisKelamin}
                  </td>
                  <td className="py-3">
                    <DosenActions id={dosen.id} nama={dosen.nama} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dosens.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-4 text-sm font-semibold text-slate-400">
                Belum ada data dosen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
