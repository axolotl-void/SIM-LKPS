import { cn } from "@/lib/utils/format";

/**
 * Skeleton component untuk loading states.
 * Gunakan di loading.tsx atau sebagai fallback Suspense.
 *
 * Usage:
 *   <Skeleton className="h-4 w-24" />
 */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200",
        className,
      )}
      style={style}
    />
  );
}

/**
 * Card skeleton — cocok untuk stats cards di dashboard.
 */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100/50 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton — cocok untuk daftar baris tabel.
 */
export function TableRowSkeleton({ columns = 7 }: { columns?: number }) {
  return (
    <div className="grid grid-cols-12 gap-4 rounded-2xl bg-white p-4.5 border border-slate-100/50 shadow-soft">
      {/* No box */}
      <div className="col-span-1">
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      {/* Data columns */}
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-5" style={{ gridColumn: `span ${Math.floor(10 / (columns - 1)) || 2}` }} />
      ))}
      {/* Action column */}
      <Skeleton className="col-span-1 h-7 w-14 rounded-lg" />
    </div>
  );
}

/**
 * Form skeleton — untuk form modal/dialog.
 */
export function FormSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Table page skeleton — komplit untuk halaman tabel.
 */
export function TablePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table header */}
      <Skeleton className="h-8 w-full rounded-2xl" />

      {/* Rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
