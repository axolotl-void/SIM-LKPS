import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { GraduationCap, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MahasiswaActions } from "./MahasiswaActions";
import { SearchBar } from "./SearchBar";

export const metadata: Metadata = {
  title: "Master Data - Mahasiswa",
};

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function MahasiswaPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = query
    ? {
        OR: [
          { nim: { contains: query, mode: "insensitive" as const } },
          { nama: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [mahasiswas, total] = await Promise.all([
    db.mahasiswa.findMany({
      where,
      orderBy: { nama: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.mahasiswa.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Data Mahasiswa</h1>
            <p className="mt-1 text-sm text-slate-300">
              {total} mahasiswa terdaftar
            </p>
          </div>
          <Link
            href="/master/mahasiswa/new"
            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Mahasiswa
          </Link>
        </div>
      </div>

      {/* Search */}
      <SearchBar defaultQuery={query} />

      {/* Table */}
      <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  NIM
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nama
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Angkatan
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  JK
                </th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mahasiswas.map((mhs) => (
                <tr key={mhs.id}>
                  <td className="py-3 text-sm font-mono font-semibold text-slate-700">
                    {mhs.nim}
                  </td>
                  <td className="py-3 text-sm font-semibold text-slate-700">
                    {mhs.nama}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {mhs.angkatan}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        mhs.status === "Aktif"
                          ? "bg-emerald-100 text-emerald-700"
                          : mhs.status === "Lulus"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {mhs.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {mhs.jenisKelamin}
                  </td>
                  <td className="py-3">
                    <MahasiswaActions id={mhs.id} nama={mhs.nama} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mahasiswas.length === 0 && (
            <div className="py-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-4 text-sm font-semibold text-slate-400">
                {query ? "Mahasiswa tidak ditemukan" : "Belum ada data mahasiswa"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-400">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} dari {total}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/master/mahasiswa?page=${page - 1}${query ? `&q=${query}` : ""}`}
                className={`rounded-lg p-2 ${page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"} transition-colors`}
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </Link>
              <span className="text-xs font-semibold text-slate-500">
                {page} / {totalPages}
              </span>
              <Link
                href={`/master/mahasiswa?page=${page + 1}${query ? `&q=${query}` : ""}`}
                className={`rounded-lg p-2 ${page >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"} transition-colors`}
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
