import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Master Data - Program Studi",
};

export default async function ProdiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const prodis = await db.prodi.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <h1 className="text-xl font-bold tracking-tight">Program Studi</h1>
        <p className="mt-1 text-sm text-slate-300">
          {prodis.length} program studi terdaftar
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {prodis.map((prodi) => (
          <div
            key={prodi.id}
            className="rounded-2xl border-none bg-white p-6 shadow-soft"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-800">{prodi.nama}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Kode: <span className="font-mono font-semibold">{prodi.kode}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    {prodi.jenjang}
                  </span>
                  {prodi.isActive && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      Aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {prodis.length === 0 && (
        <div className="rounded-2xl border-none bg-white p-12 text-center shadow-soft">
          <Building2 className="mx-auto h-12 w-12 text-slate-200" />
          <p className="mt-4 text-sm font-semibold text-slate-400">
            Belum ada program studi
          </p>
        </div>
      )}
    </div>
  );
}
