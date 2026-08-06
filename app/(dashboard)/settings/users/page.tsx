import type { Metadata } from "next";
import { getUsers } from "@/lib/actions/user";
import { UserTable } from "@/components/tables/user-table";
import { CreateUserDialog } from "@/components/forms/create-user-dialog";
import { PermissionGate } from "@/components/shared/permission-gate";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { Users, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen User",
};

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  if (!hasPermission(role, "user.read")) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || undefined;

  const result = await getUsers(page, 20, search);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Daftar Pengguna
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Total{" "}
              <span className="font-semibold text-slate-700">
                {result.meta.total}
              </span>{" "}
              pengguna terdaftar dalam sistem.
            </p>
          </div>
        </div>
        <PermissionGate permission="user.create">
          <CreateUserDialog />
        </PermissionGate>
      </div>

      {/* Search Bar */}
      <form className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            name="search"
            type="text"
            placeholder="Cari nama atau email..."
            defaultValue={search}
            className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          Cari
        </button>
      </form>

      {/* Table */}
      <ErrorBoundary>
        <UserTable users={result.data} meta={result.meta} currentRole={role} />
      </ErrorBoundary>
    </div>
  );
}
