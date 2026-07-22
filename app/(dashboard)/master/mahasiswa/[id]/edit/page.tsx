import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { MahasiswaForm } from "../../MahasiswaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMahasiswaPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const mahasiswa = await db.mahasiswa.findUnique({ where: { id } });

  if (!mahasiswa) notFound();

  return <MahasiswaForm mahasiswa={mahasiswa} />;
}
