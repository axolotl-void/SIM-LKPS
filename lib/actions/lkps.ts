"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function upsertLkpsRow(params: {
  tabelKode: string;
  tahunAkademikId: string;
  rowId?: string;
  rowData: any;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Get definition id
  const def = await db.tabelDefinition.findUnique({
    where: { kode: params.tabelKode },
  });
  if (!def) throw new Error("Table definition not found");

  // Find or create TabelLkps instance
  let tabelLkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId: params.tahunAkademikId,
      },
    },
  });

  if (!tabelLkps) {
    tabelLkps = await db.tabelLkps.create({
      data: {
        tabelDefinitionId: def.id,
        tahunAkademikId: params.tahunAkademikId,
        status: "DRAFT",
      },
    });
  }

  let savedRow;

  if (params.rowId) {
    // Update existing row
    savedRow = await db.tabelLkpsRow.update({
      where: { id: params.rowId },
      data: {
        rowData: params.rowData,
      },
    });
  } else {
    // Get next order
    const lastRow = await db.tabelLkpsRow.findFirst({
      where: { tabelLkpsId: tabelLkps.id },
      orderBy: { rowOrder: "desc" },
    });
    const order = lastRow ? lastRow.rowOrder + 1 : 1;

    // Create new row
    savedRow = await db.tabelLkpsRow.create({
      data: {
        tabelLkpsId: tabelLkps.id,
        rowOrder: order,
        rowData: params.rowData,
      },
    });
  }

  revalidatePath(`/lkps/bab-${def.bab}/tabel-${params.tabelKode.toLowerCase().replace(/\./g, "")}`);
  
  return {
    id: savedRow.id,
    rowOrder: savedRow.rowOrder,
    rowData: savedRow.rowData,
  };
}

export async function deleteLkpsRow(rowId: string, path: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.tabelLkpsRow.delete({
    where: { id: rowId },
  });

  revalidatePath(path);
}

export async function createDosen(nama: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Generate a random 10-digit NIDN that doesn't conflict
  let nidn = "";
  let isUnique = false;
  while (!isUnique) {
    const rand = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existing = await db.dosen.findUnique({
      where: { nidn: rand },
    });
    if (!existing) {
      nidn = rand;
      isUnique = true;
    }
  }

  const newDosen = await db.dosen.create({
    data: {
      nidn,
      nama,
      status: "Tetap",
      pendidikanTerakhir: "S2",
      jenisKelamin: "L", // default
    },
  });

  return {
    id: newDosen.id,
    nidn: newDosen.nidn,
    nama: newDosen.nama,
  };
}
