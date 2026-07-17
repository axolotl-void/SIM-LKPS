import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel1A4Client } from "@/components/tables/tabel-1a4-client";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 1.A.4 — Rata-rata Beban DTPR per Semester (EWMP)",
};

export default async function Tabel1A4Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active academic year
  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Belum ada tahun akademik yang aktif. Hubungi Administrator.
      </div>
    );
  }

  // Get definition for 1.A.4
  const def = await db.tabelDefinition.findUnique({
    where: { kode: "1.A.4" },
  });

  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 1.A.4 tidak ditemukan di database. Pastikan seed data telah dijalankan.
      </div>
    );
  }

  // Query active Dosen Tetap from Master Data
  let dosenList = await db.dosen.findMany({
    where: { status: "Tetap", isActive: true },
    orderBy: { nama: "asc" },
    select: {
      id: true,
      nidn: true,
      nama: true,
    },
  });

  // Proactive Auto-Seed for DTPR Master Data if database table is empty
  if (dosenList.length === 0) {
    const seedDosenData = [
      { nidn: "0102030401", nama: "Rossiana Br Ginting, S.Kom, M.Pd", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
      { nidn: "0102030402", nama: "Mukhroji, S.ST., M.T.", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030403", nama: "Ully Muzakir, MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030404", nama: "Khairuman, S.Kom, M.Kom", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030405", nama: "Mohd. Iqbal Muttaqin", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030406", nama: "Bakruddin, S.Si. M.T", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030407", nama: "Miftahul Jannah, M.Pd", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
      { nidn: "0102030408", nama: "Muhajir, M.T", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030409", nama: "Ir. Muhibul Jamal, S.T., M.T.", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030410", nama: "Mulyati, S.Si, M.Kom", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" },
      { nidn: "0102030411", nama: "Nazuarsyah, ST, MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "L" },
      { nidn: "0102030412", nama: "Oktalia Triananda Lovita, S.ST. MT", pendidikanTerakhir: "S2", status: "Tetap", jenisKelamin: "P" }
    ];

    for (const d of seedDosenData) {
      await db.dosen.upsert({
        where: { nidn: d.nidn },
        update: { nama: d.nama, status: d.status, pendidikanTerakhir: d.pendidikanTerakhir },
        create: d,
      });
    }

    // Re-fetch after seeding
    dosenList = await db.dosen.findMany({
      where: { status: "Tetap", isActive: true },
      orderBy: { nama: "asc" },
      select: {
        id: true,
        nidn: true,
        nama: true,
      },
    });
  }

  // Query existing row records for current year (TS)
  const lkpsTs = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId: activeTa.id,
      },
    },
    include: {
      rows: {
        orderBy: { rowOrder: "asc" },
      },
    },
  });

  const rows = lkpsTs?.rows || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-indigo-500">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">
              Tabel {def.kode}
            </span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">
              {def.nama}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Ekuivalen Waktu Mengajar Penuh (EWMP) Dosen Tetap Program Studi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Academic Year Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Tahun Akademik
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeTa.tahun} ({activeTa.semester})
                </div>
              </div>
            </div>

            {/* Prodi Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Program Studi
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeTa.prodi.nama} ({activeTa.prodi.jenjang})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <Tabel1A4Client
        initialRows={rows}
        dosenList={dosenList}
        tahunAkademikId={activeTa.id}
        tabelKode={def.kode}
      />
    </div>
  );
}
