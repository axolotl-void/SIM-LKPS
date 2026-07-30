// ponytail: Server Component for proper Suspense streaming

export default function Loading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero skeleton */}
      <div className="h-48 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 mb-6 shadow-xl skeleton" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-2xl skeleton" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-slate-100 rounded w-3/4 skeleton" />
              <div className="h-16 bg-slate-50 rounded-xl skeleton" />
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 w-24 rounded skeleton" />
                <div className="h-9 w-9 rounded-xl skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
