"use client";

import {
  BookOpen, FileText, ClipboardList, Building2, Target, Package,
  GraduationCap, Users, ScrollText, LayoutDashboard, type LucideIcon,
} from "lucide-react";

/**
 * Peta nama → komponen ikon untuk modul LED.
 *
 * Komponen (fungsi) TIDAK boleh dikirim dari Server Component ke Client
 * Component — React melempar "Functions cannot be passed directly to Client
 * Components". Jadi server mengirim NAMA ikon, klien yang me-resolve.
 */
export const IKON_LED: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  ClipboardList,
  Building2,
  Target,
  Package,
  GraduationCap,
  Users,
  ScrollText,
  LayoutDashboard,
};

/** Ambil ikon berdasarkan nama; fallback ke FileText. */
export function ikonLed(nama: string | undefined): LucideIcon {
  return (nama && IKON_LED[nama]) || FileText;
}
