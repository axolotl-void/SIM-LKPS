import { Role, TabelStatus } from "@prisma/client";

/**
 * Permission definitions per role
 *
 * 3-role system (per RANCANGAN-007):
 * - ADMIN: superuser
 * - OPERATOR: input data + submit + validate (trusted user, replaces old VALIDATOR role)
 * - PIMPINAN: read-only + export
 */
const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "user.*",
    "master_data.*",
    "master_dosen.*",
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
    "tabel_lkps.validate",
    "tabel_lkps.comment",
    "evidence.create",
    "evidence.read",
    "master_data.read",
    "master_dosen.create",
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
  PIMPINAN: "Pimpinan",
};

/**
 * Table status labels for UI display
 */
export const STATUS_LABELS: Record<TabelStatus, string> = {
  DRAFT: "Draft",
  DIAJUKAN: "Diajukan",
  DIREVISI: "Direvisi",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

/**
 * Status colors for badges
 */
export const STATUS_COLORS: Record<TabelStatus, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  DIAJUKAN: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  DIREVISI: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  DISETUJUI: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  DITOLAK: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
};

/**
 * Check if user can edit a table based on status and role
 * ADMIN: can edit all statuses
 * OPERATOR: can edit DRAFT, DIREVISI, DITOLAK only
 * PIMPINAN: cannot edit any
 */
export function canEditTable(role: Role, status: TabelStatus): boolean {
  if (role === "ADMIN") return true;
  if (role === "OPERATOR") {
    return ["DRAFT", "DIREVISI", "DITOLAK"].includes(status);
  }
  return false;
}

/**
 * Check if user can delete rows from a table based on status and role
 * Same rules as canEditTable
 */
export function canDeleteRow(role: Role, status: TabelStatus): boolean {
  return canEditTable(role, status);
}
