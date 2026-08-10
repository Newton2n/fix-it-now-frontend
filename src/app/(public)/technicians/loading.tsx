import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="w-full px-4 py-10 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1800px] space-y-3">
            <Skeleton className="h-6 w-36 rounded-full" />

            <Skeleton className="h-10 w-full max-w-xl" />

            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-8 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* Search and filters */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="space-y-4">
              {/* Search */}
              <Skeleton className="h-11 w-full rounded-md" />

              {/* Filters */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                <Skeleton className="h-10 w-full sm:w-44" />
                <Skeleton className="h-10 w-full sm:w-44" />
              </div>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-8">
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Technician cards */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TechnicianCardSkeleton key={index} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </section>
    </main>
  );
}

function TechnicianCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="space-y-5">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Details */}
        <div className="space-y-3 border-t pt-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
