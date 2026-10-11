import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TabelStatus } from "@prisma/client";
import { LaporanClient } from "./LaporanClient";

export const metadata = { title: "Laporan LKPS" };

export default async function LaporanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active tahun akademik
  // Get all definitions
  // PERF: dua query di bawah independen → jalankan paralel.
  const [activeTa, definitions] = await Promise.all([
    await db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true }, }),
    await db.tabelDefinition.findMany({ orderBy: [{ bab: "asc" }, { urutan: "asc" }], }),
  ]);

  // Get instances for active year
  let babStats: BABStats[] = [];
  let globalStats = {
    totalTables: definitions.length,
    filledTables: 0,
    approvedTables: 0,
    pendingTables: 0,
    rejectedTables: 0,
  };

  if (activeTa) {
    const instances = await db.tabelLkps.findMany({
      where: { tahunAkademikId: activeTa.id },
      select: {
        tabelDefinitionId: true,
        status: true,
        _count: { select: { rows: true } },
      },
    });

    const instanceMap = new Map<string, { status: TabelStatus; hasRows: boolean }>();
    for (const inst of instances) {
      instanceMap.set(inst.tabelDefinitionId, {
        status: inst.status,
        hasRows: inst._count.rows > 0,
      });
    }

    const babMap = new Map<number, { filled: number; total: number; disetujui: number; diajukan: number }>();

    for (const def of definitions) {
      const info = instanceMap.get(def.id);
      const hasRows = info?.hasRows || false;
      const status = info?.status || null;

      const existing = babMap.get(def.bab) || { filled: 0, total: 0, disetujui: 0, diajukan: 0 };
      existing.total = existing.total + 1;
      if (hasRows) existing.filled = existing.filled + 1;
      if (status === "DISETUJUI") existing.disetujui = existing.disetujui + 1;
      if (status === "DIAJUKAN") existing.diajukan = existing.diajukan + 1;
      babMap.set(def.bab, existing);
    }

    babStats = Array.from(babMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([bab, stats]) => ({
        num: bab,
        title: KRITERIA_TITLES[bab] || `Kriteria ${bab}`,
        tableCount: stats.total,
        filled: stats.filled,
        disetujui: stats.disetujui,
        diajukan: stats.diajukan,
      }));

    globalStats.filledTables = babStats.reduce((sum, b) => sum + b.filled, 0);
    globalStats.approvedTables = babStats.reduce((sum, b) => sum + b.disetujui, 0);
    globalStats.pendingTables = babStats.reduce((sum, b) => sum + b.diajukan, 0);
  }

  return (
    <LaporanClient
      tahunAkademik={activeTa ? `${activeTa.tahun} / ${activeTa.semester}` : null}
      prodi={activeTa?.prodi.nama || null}
      globalStats={globalStats}
      babStats={babStats}
    />
  );
}

/**
 * Nama kriteria ditulis di sini karena database hanya menyimpan nomor bab.
 * Istilah mengikuti LAM INFOKOM 2.1 (dan sama dengan yang dipakai di sidebar),
 * bukan lagi nama bab format lama — supaya pengguna melihat istilah yang sama
 * di seluruh aplikasi.
 */
const KRITERIA_TITLES: Record<number, string> = {
  1: "Budaya Mutu",
  2: "Relevansi Pendidikan",
  3: "Relevansi Penelitian",
  4: "Relevansi PkM",
  5: "Akuntabilitas",
  6: "Diferensiasi Misi",
};

interface BABStats {
  num: number;
  title: string;
  tableCount: number;
  filled: number;
  disetujui: number;
  diajukan: number;
}
