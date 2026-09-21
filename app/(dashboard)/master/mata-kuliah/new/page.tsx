import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { MataKuliahForm } from "../MataKuliahForm";

export default async function NewMataKuliahPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (!hasPermission(session.user.role as Role, "master_data.create")) {
    redirect("/master/mata-kuliah");
  }

  return <MataKuliahForm />;
}
