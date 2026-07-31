import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "dd MMM yyyy", { locale: id });
  } catch {
    return "-";
  }
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatSKS(sks: number): string {
  return `${sks} SKS`;
}
