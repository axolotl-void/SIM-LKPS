"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Users, ScrollText, Settings as SettingsIcon } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
}

const TABS: Tab[] = [
  {
    href: "/settings/users",
    label: "Manajemen User",
    icon: Users,
    description: "Kelola akun, peran, dan akses pengguna",
  },
  {
    href: "/settings/audit-log",
    label: "Audit Log",
    icon: ScrollText,
    description: "Riwayat aktivitas sistem",
  },
];

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 blur-3xl opacity-60"
        />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <SettingsIcon className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pengaturan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Konfigurasi sistem SIM-LKPS, kelola pengguna, dan tinjau jejak
              aktivitas.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav
        aria-label="Section navigation"
        className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/60 bg-white p-1.5 shadow-sm"
      >
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`group relative flex flex-1 min-w-[200px] cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-settings-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-current/10">
                <Icon
                  className={`h-4.5 w-4.5 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                  strokeWidth={2}
                />
              </div>
              <div className="relative min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-slate-800"
                  }`}
                >
                  {tab.label}
                </p>
                <p
                  className={`mt-0.5 truncate text-xs ${
                    isActive ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {tab.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
