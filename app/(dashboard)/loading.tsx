import { Skeleton } from "@/components/shared/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome skeleton */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-300 to-slate-200 p-6 shadow-soft">
        <Skeleton className="h-4 w-48 bg-white/30" />
        <Skeleton className="mt-2 h-7 w-64 bg-white/30" />
        <Skeleton className="mt-3 h-3 w-36 bg-white/30" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-6 w-28 rounded-xl bg-white/30" />
          <Skeleton className="h-6 w-24 rounded-xl bg-white/30" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100/50 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress per BAB skeleton */}
        <div className="col-span-2 space-y-5 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft">
          <Skeleton className="h-5 w-44" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Side skeletons */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft">
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
