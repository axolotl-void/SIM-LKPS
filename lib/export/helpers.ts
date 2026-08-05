/**
 * Export Helper Functions
 * Shared data fetching for Excel, Word, PDF exports
 */

import { db } from "@/lib/db";
import { TabelStatus, Prisma } from "@prisma/client";

export interface ColumnDef {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export interface RowData {
  id: string;
  rowOrder: number;
  rowData: Record<string, unknown>;
}

export interface TableData {
  definition: {
    id: string;
    kode: string;
    nama: string;
    bab: number;
    kolomDefinitions: ColumnDef[];
  };
  lkps: {
    id: string;
    status: TabelStatus;
    rows: RowData[];
    tahunAkademik: {
      tahun: string;
      semester: string;
      prodi: {
        nama: string;
        jenjang: string;
      };
    };
  } | null;
}

/**
 * Get single table data for export
 */
export async function getTableDataForExport(
  tabelKode: string,
  tahunAkademikId: string
): Promise<TableData | null> {
  const definition = await db.tabelDefinition.findUnique({
    where: { kode: tabelKode },
  });

  if (!definition) return null;

  const lkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: definition.id,
        tahunAkademikId,
      },
    },
    include: {
      rows: { orderBy: { rowOrder: "asc" } },
      tahunAkademik: { include: { prodi: true } },
    },
  });

  // Parse kolom definitions safely
  let kolomDefs: ColumnDef[] = [];
  if (definition.kolomDefinitions) {
    try {
      if (Array.isArray(definition.kolomDefinitions)) {
        kolomDefs = definition.kolomDefinitions as unknown as ColumnDef[];
      }
    } catch {
      kolomDefs = [];
    }
  }

  // Parse row data safely
  const mappedRows: RowData[] = (lkps?.rows || []).map((row) => {
    let rowData: Record<string, unknown> = {};
    if (row.rowData && typeof row.rowData === "object") {
      rowData = row.rowData as Record<string, unknown>;
    }
    return {
      id: row.id,
      rowOrder: row.rowOrder,
      rowData,
    };
  });

  return {
    definition: {
      id: definition.id,
      kode: definition.kode,
      nama: definition.nama,
      bab: definition.bab,
      kolomDefinitions: kolomDefs,
    },
    lkps: lkps ? {
      id: lkps.id,
      status: lkps.status,
      rows: mappedRows,
      tahunAkademik: {
        tahun: lkps.tahunAkademik.tahun,
        semester: lkps.tahunAkademik.semester,
        prodi: {
          nama: lkps.tahunAkademik.prodi.nama,
          jenjang: lkps.tahunAkademik.prodi.jenjang,
        },
      },
    } : null,
  };
}

/**
 * Get all tables data for a specific BAB
 */
export async function getBabDataForExport(
  bab: number,
  tahunAkademikId: string
): Promise<TableData[]> {
  const definitions = await db.tabelDefinition.findMany({
    where: { bab },
    orderBy: { urutan: "asc" },
  });

  const tables: TableData[] = [];

  for (const def of definitions) {
    const tableData = await getTableDataForExport(def.kode, tahunAkademikId);
    if (tableData) {
      tables.push(tableData);
    }
  }

  return tables;
}

/**
 * Get all tables data for export (full report)
 */
export async function getAllTablesDataForExport(
  tahunAkademikId: string
): Promise<TableData[]> {
  const definitions = await db.tabelDefinition.findMany({
    orderBy: [{ bab: "asc" }, { urutan: "asc" }],
  });

  const tables: TableData[] = [];

  for (const def of definitions) {
    const tableData = await getTableDataForExport(def.kode, tahunAkademikId);
    if (tableData) {
      tables.push(tableData);
    }
  }

  return tables;
}

/**
 * Get active tahun akademik
 */
export async function getActiveTahunAkademik() {
  return db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
}

/**
 * Status label mapping
 */
export const STATUS_LABELS: Record<TabelStatus, string> = {
  DRAFT: "Draft",
  DIAJUKAN: "Diajukan untuk Validasi",
  DIREVISI: "Direvisi",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};
