import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { MahasiswaForm } from "../MahasiswaForm";

export default async function NewMahasiswaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (!hasPermission(session.user.role as Role, "master_data.create")) {
    redirect("/master/mahasiswa");
  }

  return <MahasiswaForm />;
}
