import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen p-4 gap-4" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Sidebar */}
      <Sidebar role={(session.user as { role: string }).role} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
