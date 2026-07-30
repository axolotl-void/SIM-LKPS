// ponytail: Server Component for proper Suspense streaming

export default function Loading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero skeleton */}
      <div className="h-48 rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 mb-6 shadow-xl skeleton" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-slate-500 to-slate-600 skeleton" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-slate-100 rounded w-3/4 skeleton" />
              <div className="h-3 bg-slate-50 rounded w-full skeleton" />
              <div className="h-3 bg-slate-50 rounded w-2/3 skeleton" />
              <div className="h-16 bg-slate-50 rounded-xl border-2 border-dashed skeleton mt-4" />
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 w-24 rounded skeleton" />
                <div className="h-8 w-8 rounded-lg skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
