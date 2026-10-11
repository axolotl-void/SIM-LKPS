"use client";

import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "lucide-react";

/**
 * Tombol aksi di kartu Master Data.
 *
 * CATATAN: dulu komponen ini melayani dua jenis data (dosen & mahasiswa) lewat
 * prop `type`. Menu Mahasiswa dihapus 9 Okt 2026 (tidak dipakai), jadi tinggal
 * satu jenis — propnya dibuang supaya tidak ada cabang mati yang menunjuk
 * halaman yang sudah tidak ada (`/master/mahasiswa/...`).
 */
interface MasterActionsProps {
  withDetailLink?: boolean;
}

export function MasterActions({ withDetailLink = false }: MasterActionsProps) {
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/master/dosen/new")}
        className="relative z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Dosen
      </button>
      {withDetailLink && (
        <button
          type="button"
          onClick={() => router.push("/master/dosen")}
          className="relative z-10 flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          Lihat Detail
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </>
  );
}
