import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role: string }).role || "OPERATOR";

  return (
    <div className="app-shell min-h-screen p-4 gap-4">
      {/* Sidebar - Fixed Position */}
      <Sidebar role={userRole} />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden ml-[calc(18rem+1rem)]">
        {/* Header */}
        <Header
          user={{
            name: session.user.name || "Admin",
            email: session.user.email || "admin@ubbg.ac.id",
            role: userRole,
          }}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto mt-4">
          {children}
        </div>
      </main>
    </div>
  );
}
