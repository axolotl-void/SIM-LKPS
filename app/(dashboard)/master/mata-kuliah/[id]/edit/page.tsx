import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { MataKuliahForm } from "../../MataKuliahForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMataKuliahPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const matakuliah = await db.mataKuliah.findUnique({ where: { id } });

  if (!matakuliah) notFound();

  return <MataKuliahForm matakuliah={matakuliah} />;
}
