import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { NewDosenForm } from "./NewDosenForm";

export default async function NewDosenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (!hasPermission(session.user.role as Role, "master.dosen.create")) {
    redirect("/master/dosen");
  }

  return <NewDosenForm />;
}
