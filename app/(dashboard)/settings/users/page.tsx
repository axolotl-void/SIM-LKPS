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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-sm text-gray-500">
            Kelola pengguna sistem SIM-LKPS ({result.meta.total} user)
          </p>
        </div>
        <PermissionGate permission="user.create">
          <CreateUserDialog />
        </PermissionGate>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          name="search"
          type="text"
          placeholder="Cari nama atau email..."
          defaultValue={search}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {/* Table */}
      <ErrorBoundary>
        <UserTable users={result.data} meta={result.meta} />
      </ErrorBoundary>
    </div>
  );
}
