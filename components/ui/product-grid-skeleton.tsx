export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton-shimmer aspect-[4/5] rounded-2xl" />
          <div className="skeleton-shimmer mt-4 h-1.5 w-full rounded-full" />
          <div className="skeleton-shimmer mt-3 h-3 w-3/4 rounded" />
          <div className="skeleton-shimmer mt-2 h-3 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
