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
  Download,
  Search,
  Database,
  ChevronRight,
  UserCheck,
  Clock,
  Layers,
  Settings,
} from "lucide-react";
import { MasterActions } from "./MasterActions";

export const metadata: Metadata = {
  title: "Master Data",
};

// Accent color configurations
const ACCENT_CONFIG = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    borderHover: "hover:border-emerald-400/70",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-200/50",
    gradientBg: "bg-gradient-to-br from-emerald-50/80 to-teal-50/50",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200/60",
    borderHover: "hover:border-indigo-400/70",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500",
    glow: "shadow-indigo-200/50",
    gradientBg: "bg-gradient-to-br from-indigo-50/80 to-blue-50/50",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-200/60",
    borderHover: "hover:border-violet-400/70",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-200/50",
    gradientBg: "bg-gradient-to-br from-violet-50/80 to-purple-50/50",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    borderHover: "hover:border-amber-400/70",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-200/50",
    gradientBg: "bg-gradient-to-br from-amber-50/80 to-orange-50/50",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200/60",
    borderHover: "hover:border-rose-400/70",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-200/50",
    gradientBg: "bg-gradient-to-br from-rose-50/80 to-pink-50/50",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    borderHover: "hover:border-cyan-400/70",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    gradient: "from-cyan-500 to-sky-500",
    glow: "shadow-cyan-200/50",
    gradientBg: "bg-gradient-to-br from-cyan-50/80 to-sky-50/50",
  },
} as const;

type AccentKey = keyof typeof ACCENT_CONFIG;

// Compact module definitions
const COMPACT_MODULES = [
  {
    id: "matakuliah",
    title: "Mata Kuliah",
    description: "Kelola kurikulum & MK",
    icon: BookOpen,
    href: "/master/mata-kuliah",
    accent: "violet" as AccentKey,
  },
  {
    id: "tahunakademik",
    title: "Tahun Akademik",
    description: "Periode & semester",
    icon: Calendar,
    href: "/master/tahun-akademik",
    accent: "amber" as AccentKey,
  },
  {
    id: "prodi",
    title: "Program Studi",
    description: "Info program studi",
    icon: Building2,
    href: "/master/prodi",
    accent: "rose" as AccentKey,
  },
  {
    id: "pengguna",
    title: "Pengguna",
    description: "Akun & akses",
    icon: UserCog,
    href: "/settings/users",
    accent: "cyan" as AccentKey,
  },
];

export default async function MasterDataPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get counts with details
  const [
    dosenCount,
    mahasiswaCount,
    tahunAktif,
    prodiCount,
    userCount,
    dosentetapCount,
    mahasiswaregCount,
  ] = await Promise.all([
    db.dosen.count({ where: { isActive: true } }),
    db.mahasiswa.count({ where: { isActive: true } }),
    db.tahunAkademik.findFirst({
      where: { isActive: true },
      select: { tahun: true, semester: true },
    }),
    db.prodi.count(),
    db.user.count({ where: { isActive: true } }),
    db.dosen.count({ where: { isActive: true, status: "Tetap" } }),
    db.mahasiswa.count({ where: { isActive: true, angkatan: { gte: 2024 } } }),
  ]);

  const accent = ACCENT_CONFIG;

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER - Sleek Command Bar */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
              <Building2 className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800">Master Data</h1>
              <p className="text-xs text-slate-500">SIM-LKPS</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden flex-1 justify-center px-8 md:flex">
            <div className="group relative w-full max-w-md cursor-pointer">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-500" />
              <input
                type="text"
                placeholder="Tekan ⌘K untuk cari data master..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-10 pr-4 text-sm text-slate-500 transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                readOnly
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* DB Status */}
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/60 px-3 py-1.5 sm:flex">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Prisma</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Sub Bar */}
        <div className="flex items-center justify-between px-5 py-2.5">
          <p className="text-xs text-slate-500">
            {tahunAktif ? `${tahunAktif.tahun} / ${tahunAktif.semester}` : "Tahun akademik belum diatur"}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{dosenCount + mahasiswaCount + userCount} total entri</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BENTO GRID - Asymmetric Layout */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* GRID 1: Featured Dosen Card (Spans 7 cols) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 animate-fade-in-up opacity-0" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
          <Link
            href="/master/dosen"
            className="group relative block h-full overflow-hidden rounded-2xl border border-emerald-200/60 bg-white shadow-sm transition-all duration-300 hover:border-emerald-300/80 hover:shadow-emerald-100/60"
          >
            {/* Accent Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 shadow-sm">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Dosen</h3>
                    <p className="text-xs text-slate-500">Tenaga pengajar tetap & tidak tetap</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>

              {/* Stats Grid */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {/* Main Count */}
                <div className="col-span-1 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white">
                  <span className="text-4xl font-bold">{dosenCount}</span>
                  <p className="mt-1 text-xs font-medium text-emerald-100">Total Dosen</p>
                </div>

                {/* Breakdown */}
                <div className="col-span-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50/80 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium text-slate-700">Dosen Tetap</span>
                    </div>
                    <span className="font-semibold text-emerald-700">{dosentetapCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-teal-50/80 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-medium text-slate-700">Dosen Tidak Tetap</span>
                    </div>
                    <span className="font-semibold text-teal-700">{Math.max(0, dosenCount - dosentetapCount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <MasterActions type="dosen" withDetailLink />
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* GRID 2: Featured Mahasiswa Card (Spans 5 cols) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <Link
            href="/master/mahasiswa"
            className="group relative block h-full overflow-hidden rounded-2xl border border-indigo-200/60 bg-white shadow-sm transition-all duration-300 hover:border-indigo-300/80 hover:shadow-indigo-100/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 shadow-sm">
                    <GraduationCap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Mahasiswa</h3>
                    <p className="text-xs text-slate-500">Data mahasiswa aktif</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-600" />
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 text-white">
                  <span className="text-3xl font-bold">{mahasiswaCount}</span>
                  <p className="mt-1 text-xs font-medium text-indigo-100">Mahasiswa Aktif</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg bg-indigo-50/80 px-3 py-2">
                    <span className="text-xs font-medium text-slate-700">Reg. 2024+</span>
                    <span className="font-semibold text-indigo-700">{mahasiswaregCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50/80 px-3 py-2">
                    <span className="text-xs font-medium text-slate-700">Status</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                      </span>
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <MasterActions type="mahasiswa" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* COMPACT GRID: 4 Cards (2x2) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {COMPACT_MODULES.map((module, index) => {
          const Icon = module.icon;
          const cfg = accent[module.accent];
          const delay = 200 + index * 75;

          // Stats mapping
          const statsMap: Record<string, { count: number; subtitle: string }> = {
            matakuliah: { count: 48, subtitle: "mata kuliah" },
            tahunakademik: {
              count: tahunAktif ? 1 : 0,
              subtitle: tahunAktif ? `${tahunAktif.tahun}/${tahunAktif.semester}` : "belum ada",
            },
            prodi: { count: prodiCount, subtitle: "program studi" },
            pengguna: { count: userCount, subtitle: "pengguna" },
          };
          const stats = statsMap[module.id];

          return (
            <div
              key={module.id}
              className="col-span-6 sm:col-span-3 lg:col-span-3 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
            >
              <Link
                href={module.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-slate-300/80 hover:shadow-md"
              >
                <div className="relative flex flex-1 flex-col p-4">
                  {/* Icon Row */}
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cfg.iconBg} shadow-sm`}>
                      <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600" />
                  </div>

                  {/* Content */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <h3 className="font-medium text-slate-800">{module.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{module.description}</p>

                    {/* Stat */}
                    <div className="mt-auto pt-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900">{stats?.count ?? 0}</span>
                        <span className="text-xs text-slate-500">{stats?.subtitle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`h-0.5 bg-gradient-to-r ${cfg.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FOOTER INFO BAR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        className="animate-fade-in-up rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 opacity-0"
        style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
              <Layers className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Modul Master Data</p>
              <p className="text-xs text-slate-500">Kelola seluruh data referensi sistem akreditasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Settings className="h-3.5 w-3.5" />
            <span>Konfigurasi master data di menu Pengaturan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
