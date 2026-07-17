import { Role } from "@prisma/client";

/**
 * Permission definitions per role
 */
const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "user.*",
    "master_data.*",
    "tabel_lkps.*",
    "evidence.*",
    "settings.*",
    "audit_log.read",
    "dashboard.read",
    "report.*",
  ],
  OPERATOR: [
    "tabel_lkps.read",
    "tabel_lkps.create",
    "tabel_lkps.update",
    "tabel_lkps.submit",
    "evidence.create",
    "evidence.read",
    "master_data.read",
    "dashboard.read",
    "report.read",
  ],
  VALIDATOR: [
    "tabel_lkps.read",
    "tabel_lkps.validate",
    "tabel_lkps.comment",
    "evidence.read",
    "master_data.read",
    "dashboard.read",
    "report.read",
  ],
  PIMPINAN: [
    "dashboard.read",
    "tabel_lkps.read",
    "report.read",
    "report.export",
    "master_data.read",
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: string): boolean {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  return rolePermissions.some((p) => {
    // Exact match
    if (p === permission) return true;

    // Wildcard match (e.g., "user.*" matches "user.create")
    if (p.endsWith(".*")) {
      const prefix = p.slice(0, -2);
      return permission.startsWith(prefix + ".");
    }

    return false;
  });
}

/**
 * Check multiple permissions (AND logic)
 */
export function hasAllPermissions(role: Role, permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check multiple permissions (OR logic)
 */
export function hasAnyPermission(role: Role, permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): string[] {
  return PERMISSIONS[role] || [];
}

/**
 * Role display names in Indonesian
 */
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  OPERATOR: "Operator / Tim LKPS",
  VALIDATOR: "Validator / Kaprodi",
  PIMPINAN: "Pimpinan",
};
