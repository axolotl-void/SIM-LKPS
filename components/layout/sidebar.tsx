"use client";

import { useState, useCallback, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
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
      { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"] },
    ],
  },
  {
    group: "Instrumen LKPS",
    items: [
      { label: "BAB 1 — Tata Pamong", href: "/lkps/bab-1", icon: FileText, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB 2 — Pendidikan", href: "/lkps/bab-2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB 3 — Penelitian", href: "/lkps/bab-3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB 4 — Pengabdian", href: "/lkps/bab-4", icon: Users, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
      { label: "BAB 5 & 6", href: "/lkps/bab-5", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "PIMPINAN"] },
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

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.06,
      duration: 0.4,
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
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleNavigation = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-72 flex-col rounded-2xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden"
    >
      {/* Header - Logo */}
      <div className="flex h-16 items-center border-b border-slate-100/80 px-5 bg-gradient-to-r from-slate-50 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <span className="text-sm font-bold text-white">SL</span>
          </div>
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
                initial={{ opacity: 0 }}
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
                      initial="hidden"
                      animate="visible"
                      onHoverStart={() => setHoveredIndex(globalIndex)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    >
                      <motion.button
                        variants={itemHoverVariants}
                        initial="rest"
                        animate={hoveredIndex === globalIndex ? "hover" : "rest"}
                        onClick={() => handleNavigation(item.href)}
                        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {/* Active Indicator Bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/30"
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
                      </motion.button>
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
        {/* Program Info Card — ambient gradient + breathing pulse + shimmer */}
        <motion.div
          animate={{
            backgroundPosition: [
              "0% 50%, center",
              "100% 50%, center",
              "0% 50%, center",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 p-4 text-white shadow-lg [background-size:200%_200%,cover]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.92) 0%, rgba(67, 56, 202, 0.92) 50%, rgba(8, 145, 178, 0.92) 100%), url('/img/gedung-ubbg_11zon.png')",
            backgroundSize: "200% 200%, cover",
            backgroundPosition: "0% 50%, center",
          }}
        >
          {/* Breathing pulse layer */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl"
          />

          {/* Shimmer sweep layer */}
          <motion.div
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: "220%" }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
              Program Studi
            </p>
            <p className="mt-0.5 text-sm font-bold">Ilmu Komputer UBBG</p>
            <p className="mt-2 text-[11px] text-blue-200">
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
        </motion.div>
      </div>
    </motion.aside>
  );
});

export default Sidebar;
