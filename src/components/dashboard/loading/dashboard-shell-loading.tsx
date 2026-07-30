import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardShellLoading() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden lg:block w-[280px] border-r bg-background p-4">
        <Skeleton className="mb-6 h-10 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b bg-background p-4 md:p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-3 h-4 w-80" />
        </main>
      </div>
    </div>
  );
}
