import { auth } from "@/lib/auth";
import { hasPermission, hasAnyPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  mode?: "all" | "any";
  fallback?: React.ReactNode;
}

/**
 * Server Component: conditionally renders children based on permissions
 */
export async function PermissionGate({
  children,
  permission,
  permissions,
  mode = "any",
  fallback = null,
}: PermissionGateProps) {
  const session = await auth();
  if (!session?.user) return fallback;

  const role = session.user.role as Role;

  if (permission) {
    return hasPermission(role, permission) ? <>{children}</> : <>{fallback}</>;
  }

  if (permissions) {
    const hasAccess =
      mode === "all"
        ? permissions.every((p) => hasPermission(role, p))
        : hasAnyPermission(role, permissions);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  return <>{children}</>;
}
