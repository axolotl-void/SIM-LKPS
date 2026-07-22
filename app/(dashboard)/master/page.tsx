import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Building2,
  UserCog,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Master Data",
};

// Module definitions
const MODULES = [
  {
    id: "dosen",
    title: "Dosen",
    description: "Kelola data dosen tetap dan tidak tetap",
    icon: Users,
    href: "/master/dosen",
    color: "from-blue-500 to-indigo-600",
    badge: "AKTIF",
  },
  {
    id: "mahasiswa",
    title: "Mahasiswa",
    description: "Kelola data mahasiswa aktif",
    icon: GraduationCap,
    href: "/master/mahasiswa",
    color: "from-emerald-500 to-teal-600",
    badge: "AKTIF",
    disabled: false,
  },
  {
    id: "matakuliah",
    title: "Mata Kuliah",
    description: "Kelola kurikulum dan mata kuliah",
    icon: BookOpen,
    href: "/master/mata-kuliah",
    color: "from-purple-500 to-pink-600",
    badge: "AKTIF",
    disabled: false,
  },
  {
    id: "tahunakademik",
    title: "Tahun Akademik",
    description: "Kelola periode tahun dan semester",
    icon: Calendar,
    href: "/master/tahun-akademik",
    color: "from-amber-500 to-orange-600",
    badge: "AKTIF",
  },
  {
    id: "prodi",
    title: "Program Studi",
    description: "Kelola informasi program studi",
    icon: Building2,
    href: "/master/prodi",
    color: "from-rose-500 to-red-600",
    badge: "AKTIF",
  },
  {
    id: "pengguna",
    title: "Pengguna",
    description: "Kelola akun pengguna sistem",
    icon: UserCog,
    href: "/settings/users",
    color: "from-cyan-500 to-blue-600",
    badge: "AKTIF",
  },
];

export default async function MasterDataPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get counts
  const [dosenCount, mahasiswaCount, tahunAktif, prodiCount, userCount] = await Promise.all([
    db.dosen.count({ where: { isActive: true } }),
    db.mahasiswa.count({ where: { isActive: true } }),
    db.tahunAkademik.findFirst({
      where: { isActive: true },
      select: { tahun: true, semester: true },
    }),
    db.prodi.count(),
    db.user.count({ where: { isActive: true } }),
  ]);

  // Module stats
  const moduleStats: Record<string, { count: number; subtitle?: string }> = {
    dosen: { count: dosenCount, subtitle: "dosen aktif" },
    mahasiswa: { count: mahasiswaCount, subtitle: "mahasiswa aktif" },
    tahunakademik: {
      count: tahunAktif ? 1 : 0,
      subtitle: tahunAktif ? `${tahunAktif.tahun} - ${tahunAktif.semester}` : undefined,
    },
    prodi: { count: prodiCount, subtitle: "program studi" },
    pengguna: { count: userCount, subtitle: "pengguna aktif" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <h1 className="text-xl font-bold tracking-tight">Master Data</h1>
        <p className="mt-1 text-sm text-slate-300">
          Kelola data master sistem SIM-LKPS
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => {
          const Icon = module.icon;
          const stats = moduleStats[module.id];
          const isDisabled = module.disabled || !module.href;

          const cardContent = (
            <>
              <div className="flex items-start justify-between">
                <div
                  className={`h-11 w-11 flex items-center justify-center rounded-xl bg-gradient-to-br ${module.color} text-white shadow-soft-sm`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    module.badge === "AKTIF"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {module.badge}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">{module.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{module.description}</p>

              {isDisabled ? (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Backend belum tersedia</span>
                </div>
              ) : (
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-700">
                    {stats?.count ?? 0}
                  </span>
                  {stats?.subtitle && (
                    <span className="text-xs font-semibold text-slate-400">
                      {stats.subtitle}
                    </span>
                  )}
                </div>
              )}
            </>
          );

          if (isDisabled) {
            return (
              <div
                key={module.id}
                className="group rounded-2xl border-none bg-white p-5 shadow-soft opacity-60 cursor-not-allowed"
              >
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={module.id}
              href={module.href!}
              className="group rounded-2xl border-none bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-soft-lg"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Modul dalam pengembangan</p>
            <p className="mt-1 text-xs text-amber-700">
              Beberapa modul belum memiliki backend lengkap. Halaman lengkap akan tersedia setelah implementasi selesai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
