// ponytail: Server Component for proper Suspense streaming

export default function Loading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero skeleton */}
      <div className="h-48 rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 mb-6 shadow-xl skeleton" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 skeleton" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded skeleton" />
                <div className="h-4 w-12 rounded skeleton" />
              </div>
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-4 w-1/2 rounded skeleton" />
                </div>
              </div>
              <div className="h-12 rounded-xl border-2 border-dashed skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
