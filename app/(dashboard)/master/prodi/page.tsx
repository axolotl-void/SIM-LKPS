import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { ProdiView, type ProdiItem } from "./prodi-view";

export const metadata: Metadata = {
  title: "Master Data - Program Studi",
};

export default async function ProdiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const prodis = await db.prodi.findMany({
    orderBy: { nama: "asc" },
  });

  const items: ProdiItem[] = prodis.map((p) => ({
    id: p.id,
    nama: p.nama,
    kode: p.kode,
    jenjang: p.jenjang,
    isActive: p.isActive,
  }));

  return <ProdiView items={items} />;
}