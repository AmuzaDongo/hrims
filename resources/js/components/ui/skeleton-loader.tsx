import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-xl">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-20" />
        </div>
      ))}
    </div>
  );
}