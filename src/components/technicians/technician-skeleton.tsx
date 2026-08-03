import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <Skeleton className="h-4 w-32" />

        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
