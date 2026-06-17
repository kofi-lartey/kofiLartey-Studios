const SkeletonLoader = ({ count = 3 }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="h-32 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]" />
    ))}
  </div>
);

export default SkeletonLoader;
