"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, Bell, Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

// Smooth animation variants
const headerVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Breadcrumb translation map
const breadcrumbLabels: Record<string, string> = {
  "": "Dashboard",
  "master": "Master Data",
  "dosen": "Dosen",
  "tendik": "Tenaga Kependidikan",
  "mahasiswa": "Mahasiswa",
  "mata-kuliah": "Mata Kuliah",
  "tahun-akademik": "Tahun Akademik",
  "users": "Pengguna",
  "lkps": "Instrumen LKPS",
  "bab-1": "BAB 1 - Tata Pamong",
  "bab-2": "BAB 2 - Pendidikan",
  "bab-3": "BAB 3 - Penelitian",
  "bab-4": "BAB 4 - Pengabdian",
  "bab-5": "BAB 5 & 6",
  "bab-6": "BAB 6 - Visi Misi",
  "evidence": "Bukti Pendukung",
  "laporan": "Laporan",
  "settings": "Pengaturan",
  "validasi": "Validasi",
  "submissions": "Pengajuan",
};

const getBreadcrumbLabel = (segment: string): string => {
  return breadcrumbLabels[segment.toLowerCase()] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Generate breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: getBreadcrumbLabel(segment),
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    isLast: index === pathSegments.length - 1,
  }));

  // Get page title
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard Utama";

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between rounded-2xl bg-white border border-slate-200/60 px-6 py-4 shadow-lg shadow-slate-200/30"
    >
      {/* Left Side: Breadcrumbs & Page Title */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1"
      >
        {/* Breadcrumbs */}
        <motion.nav variants={itemVariants} className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Home</span>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          {breadcrumbs.map((crumb, index) => (
            <motion.div
              key={crumb.path}
              variants={itemVariants}
              className="flex items-center gap-1.5"
            >
              <span
                className={`font-medium transition-colors duration-200 cursor-pointer ${
                  crumb.isLast
                    ? "text-blue-600 font-semibold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {crumb.label}
              </span>
              {!crumb.isLast && (
                <ChevronRight className="h-3 w-3 text-slate-300" />
              )}
            </motion.div>
          ))}
        </motion.nav>

        {/* Page Title */}
        <motion.h1
          variants={itemVariants}
          className="text-lg font-bold text-slate-800 tracking-tight"
        >
          {pageTitle}
        </motion.h1>
      </motion.div>

      {/* Right Side: Search, Notifications & User */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        {/* Search Input */}
        <motion.div
          variants={itemVariants}
          animate={{
            width: isSearchFocused ? 260 : 220,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari menu, data..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
            title="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg shadow-red-500/30">
              3
            </span>
          </motion.button>

          {/* Avatar with Logout */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md cursor-pointer"
              title={user?.name || "User"}
            >
              {getInitials(user?.name)}
            </motion.div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 cursor-pointer"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

export default Header;
