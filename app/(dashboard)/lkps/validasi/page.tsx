import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Clock, FileText, ArrowRight, Calendar, User, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Validasi — Tabel Menunggu Review",
};

export default async function ValidasiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  // Only VALIDATOR, ADMIN, PIMPINAN can view
  if (role !== "VALIDATOR" && role !== "ADMIN" && role !== "PIMPINAN") {
    redirect("/forbidden");
  }

  // Get all DIAJUKAN tables
  const pendingTables = await db.tabelLkps.findMany({
    where: { status: "DIAJUKAN" },
    include: {
      tabelDefinition: true,
      tahunAkademik: { include: { prodi: true } },
      submittedBy: { select: { name: true } },
      _count: { select: { rows: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-50/50 via-teal-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Validasi Tabel LKPS</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Daftar tabel yang menunggu review dan keputusan
          </p>
        </div>
      </div>

      {pendingTables.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-100 p-14 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Tabel Menunggu Review</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Semua tabel sudah selesai divalidasi.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingTables.map((tabel) => (
            <Link
              key={tabel.id}
              href={`/lkps/bab-${tabel.tabelDefinition.bab}/tabel-${tabel.tabelDefinition.kode.toLowerCase().replace(/\./g, "")}`}
              className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-soft border border-slate-100/50 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)] hover:border-blue-200/60 hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 text-amber-600 border border-amber-100/50">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-lg">
                      {tabel.tabelDefinition.kode}
                    </span>
                    <span className="text-2xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                      {tabel._count.rows} data
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1.5">{tabel.tabelDefinition.nama}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-2xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {tabel.tahunAkademik.tahun} ({tabel.tahunAkademik.semester})
                    </span>
                    {tabel.submittedBy && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {tabel.submittedBy.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Review <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
