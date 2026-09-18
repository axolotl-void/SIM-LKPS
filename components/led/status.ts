import type { LedStatus } from "@prisma/client";
import { LED_STATUS_META, type RingkasanIsian } from "@/lib/utils/led-progress";

type MetaStatus = (typeof LED_STATUS_META)[LedStatus];

/** Akses aman ke LED_STATUS_META (tsconfig pakai noUncheckedIndexedAccess). */
export function statusMeta(status: LedStatus | undefined | null): MetaStatus {
  const fallback = LED_STATUS_META.KOSONG as MetaStatus;
  if (!status) return fallback;
  return (LED_STATUS_META[status] ?? fallback) as MetaStatus;
}

/** Kelas badge untuk tiap varian status. */
export const VARIAN_KELAS: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-violet-50 text-violet-700 border-violet-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  default: "bg-slate-50 text-slate-500 border-slate-200",
};

/** Kelas badge dari sebuah status LED. */
export function statusKelas(status: LedStatus | undefined | null): string {
  return VARIAN_KELAS[statusMeta(status).variant] ?? VARIAN_KELAS.default!;
}

/** Ringkas daftar isian menjadi satu angka progres untuk kartu. */
export function ringkasProgres(isian: RingkasanIsian[]): {
  terisi: number;
  total: number;
  persen: number;
} {
  const total = isian.length;
  const terisi = isian.filter((i) => i.status !== "KOSONG" && i.jumlahKarakter > 0).length;
  return { terisi, total, persen: total === 0 ? 0 : Math.round((terisi / total) * 100) };
}
