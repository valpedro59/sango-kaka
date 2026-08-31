export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-neutral-200 bg-white">
      <div className="h-40 animate-pulse bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-5 w-1/3 animate-pulse rounded bg-neutral-200 mt-4" />
      </div>
    </div>
  );
}
