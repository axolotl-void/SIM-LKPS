import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Calendar, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Master Data - Tahun Akademik",
};

export default async function TahunAkademikPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tahunAktif = await db.tahunAkademik.findMany({
    where: { isActive: true },
  });

  const allTahun = await db.tahunAkademik.findMany({
    orderBy: [{ tahun: "desc" }, { semester: "desc" }],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <h1 className="text-xl font-bold tracking-tight">Tahun Akademik</h1>
        <p className="mt-1 text-sm text-slate-300">
          {allTahun.length} periode terdaftar
        </p>
      </div>

      {/* Active */}
      {tahunAktif.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wide">
              Tahun Akademik Aktif
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-800">
            {tahunAktif[0]?.tahun ?? "-"} — {tahunAktif[0]?.semester ?? "-"}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tahun
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Semester
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allTahun.map((ta) => (
                <tr key={ta.id}>
                  <td className="py-3 text-sm font-semibold text-slate-700">
                    {ta.tahun}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {ta.semester}
                  </td>
                  <td className="py-3">
                    {ta.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Tidak Aktif
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allTahun.length === 0 && (
            <div className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-4 text-sm font-semibold text-slate-400">
                Belum ada tahun akademik
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
