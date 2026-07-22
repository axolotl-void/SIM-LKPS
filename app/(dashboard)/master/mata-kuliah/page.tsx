import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { BookOpen, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MataKuliahActions } from "./MataKuliahActions";
import { SearchBar } from "./SearchBar";

export const metadata: Metadata = {
  title: "Master Data - Mata Kuliah",
};

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function MataKuliahPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = query
    ? {
        OR: [
          { kode: { contains: query, mode: "insensitive" as const } },
          { nama: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [matakuliah, total] = await Promise.all([
    db.mataKuliah.findMany({
      where,
      orderBy: [{ semester: "asc" }, { kode: "asc" }],
      skip,
      take: PAGE_SIZE,
    }),
    db.mataKuliah.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Data Mata Kuliah</h1>
            <p className="mt-1 text-sm text-slate-300">
              {total} mata kuliah terdaftar
            </p>
          </div>
          <Link
            href="/master/mata-kuliah/new"
            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Mata Kuliah
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
                  Kode
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nama
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  SKS
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Semester
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kategori
                </th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {matakuliah.map((mk) => (
                <tr key={mk.id}>
                  <td className="py-3 text-sm font-mono font-semibold text-slate-700">
                    {mk.kode}
                  </td>
                  <td className="py-3 text-sm font-semibold text-slate-700">
                    {mk.nama}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {mk.sks}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {mk.semester}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                      {mk.kategori || "Wajib"}
                    </span>
                  </td>
                  <td className="py-3">
                    <MataKuliahActions id={mk.id} nama={mk.nama} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {matakuliah.length === 0 && (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-4 text-sm font-semibold text-slate-400">
                {query ? "Mata kuliah tidak ditemukan" : "Belum ada data mata kuliah"}
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
                href={`/master/mata-kuliah?page=${page - 1}${query ? `&q=${query}` : ""}`}
                className={`rounded-lg p-2 ${page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"} transition-colors`}
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </Link>
              <span className="text-xs font-semibold text-slate-500">
                {page} / {totalPages}
              </span>
              <Link
                href={`/master/mata-kuliah?page=${page + 1}${query ? `&q=${query}` : ""}`}
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
