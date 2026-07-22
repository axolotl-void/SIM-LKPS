import { cn } from "@/lib/utils/format";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info" | "pending";

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-slate-100 text-slate-600 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-violet-50 text-violet-700 border-violet-200",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[0.625rem] gap-1",
  md: "px-2 py-1 text-xs gap-1.5",
  lg: "px-2.5 py-1 text-sm gap-2",
};

export function StatusBadge({ variant = "default", children, icon, size = "md", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ────────────────────────────────────────────────────
   Preset status badges for LKPS workflow
   ──────────────────────────────────────────────────── */
export function DraftBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge variant="default" size={size} className="uppercase tracking-wider">
      Draft
    </StatusBadge>
  );
}

export function SubmittedBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge variant="pending" size={size} className="uppercase tracking-wider">
      Diajukan
    </StatusBadge>
  );
}

export function ApprovedBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge variant="success" size={size} className="uppercase tracking-wider">
      Disetujui
    </StatusBadge>
  );
}

export function RevisionBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge variant="warning" size={size} className="uppercase tracking-wider">
      Direvisi
    </StatusBadge>
  );
}

export function RejectedBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge variant="danger" size={size} className="uppercase tracking-wider">
      Ditolak
    </StatusBadge>
  );
}

/* ────────────────────────────────────────────────────
   Map TabelStatus to badge
   ──────────────────────────────────────────────────── */
export function TabelStatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" | "lg" }) {
  switch (status) {
    case "DIAJUKAN": return <SubmittedBadge size={size} />;
    case "DISETUJUI": return <ApprovedBadge size={size} />;
    case "DIREVISI": return <RevisionBadge size={size} />;
    case "DITOLAK": return <RejectedBadge size={size} />;
    default: return <DraftBadge size={size} />;
  }
}
