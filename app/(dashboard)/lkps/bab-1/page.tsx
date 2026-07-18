import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, CheckCircle2, Clock, AlertCircle,
  Calendar, BookOpen, Users, Wallet, PieChart, LineChart, 
  UserCheck, ShieldCheck
} from "lucide-react";
import type { Metadata } from "next";
import { TabelStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "BAB 1 — Tata Pamong",
};

export default async function Bab1Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active academic year
  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true }
  });

  // Get definitions for BAB 1
  const definitions = await db.tabelDefinition.findMany({
    where: { bab: 1 },
    orderBy: { urutan: "asc" },
  });

  // Fetch or mock current status/instances of the tables for active TA
  const instances = activeTa
    ? await db.tabelLkps.findMany({
        where: {
          tahunAkademikId: activeTa.id,
          tabelDefinitionId: { in: definitions.map((d) => d.id) },
        },
        include: {
          _count: {
            select: { rows: true },
          },
        },
      })
    : [];

  const instanceMap = Object.fromEntries(
    instances.map((inst) => [inst.tabelDefinitionId, inst])
  );

  const getStatusBadge = (status?: TabelStatus) => {
    switch (status) {
      case TabelStatus.DISETUJUI:
        return (
          <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-emerald-600 border border-emerald-100/50">
            <CheckCircle2 className="h-3 w-3" /> Disetujui
          </span>
        );
      case TabelStatus.DIAJUKAN:
        return (
          <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-amber-600 border border-amber-100/50">
            <Clock className="h-3 w-3" /> Diajukan
          </span>
        );
      case TabelStatus.DIREVISI:
        return (
          <span className="flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-orange-600 border border-orange-100/50">
            <AlertCircle className="h-3 w-3" /> Direvisi
          </span>
        );
      case TabelStatus.DITOLAK:
        return (
          <span className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-red-600 border border-red-100/50">
            <AlertCircle className="h-3 w-3" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-slate-500 border border-slate-100/30">
            Draft
          </span>
        );
    }
  };

  // Helper to map icons for each table
  const getTableIcon = (kode: string) => {
    switch (kode) {
      case "1.A.1":
        return <Users className="h-5 w-5 text-indigo-500" />;
      case "1.A.2":
        return <Wallet className="h-5 w-5 text-indigo-500" />;
      case "1.A.3":
        return <PieChart className="h-5 w-5 text-indigo-500" />;
      case "1.A.4":
        return <LineChart className="h-5 w-5 text-indigo-500" />;
      case "1.A.5":
        return <UserCheck className="h-5 w-5 text-indigo-500" />;
      case "1.B":
        return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-indigo-500">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              BAB 1 — Tata Pamong, Tata Kelola, dan Kerja Sama
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Kriteria Budaya Mutu Program Studi Ilmu Komputer UBBG
            </p>
          </div>

          {activeTa && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Academic Year Card */}
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Tahun Akademik
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {activeTa.tahun} ({activeTa.semester})
                  </div>
                </div>
              </div>

              {/* Prodi Card */}
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Program Studi
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {activeTa.prodi.nama} ({activeTa.prodi.jenjang})
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid List of 6 Tables */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {definitions.map((def) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const status = inst?.status;

          return (
            <Link
              key={def.id}
              href={`/lkps/bab-1/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`}
              className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-soft border border-slate-100/50 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] hover:border-blue-200/60 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer overflow-hidden"
            >
              {/* Hover blue gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out rounded-3xl" />

              <div className="relative z-10">
                {/* Card Top bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm group-hover:bg-white/20 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="group-hover:[&_span]:bg-white/15 group-hover:[&_span]:border-white/20 group-hover:[&_span]:text-white transition-all duration-300">
                    {getStatusBadge(status)}
                  </div>
                </div>

                {/* Table Title Block */}
                <div className="mt-4">
                  <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                    Tabel {def.kode}
                  </span>
                  <h3 className="mt-3.5 text-sm font-bold text-slate-800 leading-snug tracking-tight group-hover:text-white transition-colors duration-300">
                    {def.nama}
                  </h3>
                </div>

                {/* Row Data count box */}
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-3 mt-4 border border-slate-100/60 shadow-3xs group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 border border-slate-100/40 shadow-2xs group-hover:bg-white/20 group-hover:border-white/10 group-hover:text-white group-hover:shadow-none transition-all duration-300">
                    {getTableIcon(def.kode)}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-slate-800 group-hover:text-white transition-colors duration-300">
                      {rowCount}
                    </span>
                    <span className="text-2xs font-semibold text-slate-400 group-hover:text-blue-100 transition-colors duration-300">
                      data dimasukkan
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-50 group-hover:border-white/20 flex items-center justify-between transition-all duration-300">
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors duration-300">
                  Kelola Data
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-2xs group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
