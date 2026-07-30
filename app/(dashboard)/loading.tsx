// ponytail: Client-side interactivity not needed - skeleton is static
// Remove "use client" to enable proper Next.js Suspense streaming
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Welcome skeleton */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg h-40 skeleton" />

      {/* Stats Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-white p-5 shadow-sm h-28">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded skeleton" />
                <div className="h-8 w-16 rounded skeleton" />
              </div>
              <div className="h-12 w-12 rounded-xl skeleton" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress & Quick Stats skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm h-64">
          <div className="h-6 w-32 rounded skeleton mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-40 rounded skeleton" />
                <div className="h-2.5 w-full rounded-full skeleton" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm h-64">
          <div className="h-6 w-32 rounded skeleton mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-24 rounded skeleton" />
                <div className="h-4 w-8 rounded skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
