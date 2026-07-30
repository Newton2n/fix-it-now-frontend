import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>

      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
