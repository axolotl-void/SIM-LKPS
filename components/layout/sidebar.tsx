"use client";

import { useState, memo, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  FileText,
  GraduationCap,
  BookOpen,
  Users,
  Upload,
  BarChart3,
  Settings,
  ClipboardList,
  ChevronRight,
  UserCircle2,
  ScrollText,
  Calculator,
  Award,
  Download,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  roles: string[];
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    group: "Menu Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"] },
    ],
  },
  {
    group: "Instrumen LKPS",
    items: [
      { label: "Kriteria 1 — Budaya Mutu", href: "/lkps/kriteria-1", icon: FileText, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 2 — Relevansi Pendidikan", href: "/lkps/kriteria-2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 3 — Relevansi Penelitian", href: "/lkps/kriteria-3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 4 — Relevansi PkM", href: "/lkps/kriteria-4", icon: Users, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 5 — Akuntabilitas", href: "/lkps/kriteria-5", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 6 — Diferensiasi Misi", href: "/lkps/kriteria-6", icon: Award, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
    ],
  },
  {
    group: "Instrumen LED",
    items: [
      { label: "Ringkasan LED", href: "/led", icon: ScrollText, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB I — Pendahuluan", href: "/led/bab-1", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB II — Laporan Evaluasi Diri", href: "/led/bab-2", icon: FileText, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB III — Penutup", href: "/led/bab-3", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Export Dokumen", href: "/led/export", icon: Download, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
    ],
  },
  {
    group: "Penilaian",
    items: [
      { label: "Matriks Penilaian", href: "/penilaian", icon: Calculator, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 1 — Budaya Mutu", href: "/penilaian/kriteria/C1", icon: Award, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 2 — Relevansi Pendidikan", href: "/penilaian/kriteria/C2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 3 — Relevansi Penelitian", href: "/penilaian/kriteria/C3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Kriteria 4–6 & Suplemen", href: "/penilaian/kriteria/C4", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
    ],
  },
  {
    group: "Fitur",
    items: [
      { label: "Bukti Pendukung", href: "/evidence", icon: Upload, roles: ["ADMIN", "OPERATOR"] },
      { label: "Laporan", href: "/laporan", icon: BarChart3, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"] },
    ],
  },
];

// Smooth animation variants
const sidebarVariants = {
  hidden: { x: -80, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Animasi masuk sidebar hanya boleh jalan SEKALI per sesi browser.
 *
 * Layout dashboard bisa dikirim ulang oleh Next.js saat server action selesai
 * (mis. setelah menyimpan narasi LED atau skor penilaian). Kalau animasi masuk
 * ikut jalan lagi, seluruh daftar menu terlihat "refresh" dan mengganggu.
 * Flag tingkat-modul ini bertahan lintas remount, tapi reset saat halaman
 * dimuat ulang penuh — jadi kesan pertama tetap dianimasikan.
 */
let sudahPernahTampil = false;

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: sudahPernahTampil ? 0 : 0.2 + i * 0.06,
      duration: sudahPernahTampil ? 0 : 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const itemHoverVariants = {
  rest: { scale: 1, x: 0 },
  hover: {
    scale: 1.02,
    x: 4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

interface SidebarProps {
  role: string;
}

export const Sidebar = memo(function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animasi masuk hanya sekali; remount berikutnya langsung tampil diam.
  // Nilainya ditangkap sekali saat mount (useState), BUKAN dibaca tiap render —
  // kalau dibaca tiap render, hover (yang memicu render ulang) akan membalik
  // nilainya ke false dan animasi yang sedang jalan mati mendadak.
  const [sekaliIni] = useState(() => !sudahPernahTampil);
  useEffect(() => {
    sudahPernahTampil = true;
  }, []);

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={sekaliIni ? "hidden" : false}
      animate="visible"
      className="fixed left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-72 flex-col rounded-2xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden"
    >
      {/* Header - Logo */}
      <div className="flex h-16 items-center border-b border-slate-100/80 px-5 bg-gradient-to-r from-slate-50 to-white">
        <motion.div
          initial={sekaliIni ? { scale: 0.8, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="flex items-center gap-3"
        >
          <Image
            src="/logo-ubbg.svg"
            alt="Logo Universitas Bina Bangsa Getsempena"
            width={40}
            height={40}
            priority
            className="h-10 w-10 brand-logo"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 tracking-tight">SIM-LKPS</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">UBBG</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {menuGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(role));
          if (!visibleItems.length) return null;

          return (
            <div key={group.group} className="mb-5">
              {/* Group Label */}
              <motion.p
                initial={sekaliIni ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + groupIndex * 0.1 }}
                className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                {group.group}
              </motion.p>

              {/* Menu Items */}
              <ul className="space-y-1">
                {visibleItems.map((item, itemIndex) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  const globalIndex = groupIndex * 10 + itemIndex;

                  return (
                    <motion.li
                      key={item.href}
                      custom={globalIndex}
                      variants={menuItemVariants}
                      initial={sekaliIni ? "hidden" : false}
                      animate="visible"
                      onHoverStart={() => setHoveredIndex(globalIndex)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    >
                      <Link
                        href={item.href}
                        className="block"
                      >
                      <motion.span
                        variants={itemHoverVariants}
                        initial="rest"
                        animate={hoveredIndex === globalIndex ? "hover" : "rest"}
                        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {/* Active Indicator Bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/40"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        {/* Icon */}
                        <motion.div
                          animate={{
                            scale: hoveredIndex === globalIndex && !isActive ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                        </motion.div>

                        {/* Label */}
                        <span className={`flex-1 text-left ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900"}`}>
                          {item.label}
                        </span>

                        {/* Arrow on hover */}
                        {!isActive && hoveredIndex === globalIndex && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                          </motion.span>
                        )}
                      </motion.span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer - Info Card Only */}
      <div className="p-4">
        {/*
          Kartu info program.
          Semua lapisan animasi di sini (geser gradien, denyut, kilau) SENGAJA
          tidak dipakai lagi: layout dashboard bisa dikirim ulang setiap kali
          server action selesai, dan animasi yang berulang akan selalu mulai
          dari posisi awal — terlihat seperti kartu "refresh" terus, tepat
          seperti keluhan pada sidebar. Kartu statis juga menghemat CPU.
        */}
        <div
          className="relative overflow-hidden rounded-2xl bg-slate-800 p-4 text-white shadow-lg"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.93) 55%, rgba(51, 65, 85, 0.90) 100%), url('/img/gedung-ubbg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Program Studi
            </p>
            <p className="mt-0.5 text-sm font-bold">Ilmu Komputer UBBG</p>
            <p className="mt-2 text-[11px] text-slate-400">
              Versi 0.1.0 (Soft UI)
            </p>

            <Link
              href="/developer"
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/50 hover:shadow-md"
            >
              <UserCircle2 className="h-3.5 w-3.5" />
              Developer
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  );
});

export default Sidebar;
