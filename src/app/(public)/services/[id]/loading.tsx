import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <section className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Image */}
          <Skeleton className="h-64 w-full min-w-0 rounded-2xl sm:h-80 md:h-[30rem]" />

          {/* Content */}
          <div className="min-w-0 w-full space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-6 w-28 max-w-full rounded-full sm:w-32" />

              <Skeleton className="h-9 w-full max-w-xl sm:h-12" />

              <Skeleton className="h-4 w-full max-w-2xl" />

              <Skeleton className="h-4 w-3/4 max-w-xl" />
            </div>

            {/* Tags */}
            <div className="flex min-w-0 flex-wrap gap-2 sm:gap-3">
              <Skeleton className="h-8 w-24 shrink-0 rounded-full sm:w-28" />
              <Skeleton className="h-8 w-20 shrink-0 rounded-full sm:w-24" />
              <Skeleton className="h-8 w-28 shrink-0 rounded-full sm:w-32" />
            </div>

            {/* Description */}
            <div className="min-w-0 w-full rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="min-w-0 space-y-3">
                <Skeleton className="h-6 w-36 max-w-full sm:w-48" />

                <Skeleton className="h-4 w-48 max-w-full sm:w-64" />

                <div className="space-y-3 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 max-w-full" />
                  <Skeleton className="h-4 w-2/3 max-w-full" />
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="min-w-0 w-full rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="min-w-0 space-y-3">
                <Skeleton className="h-6 w-24 max-w-full sm:w-28" />

                <Skeleton className="h-4 w-32 max-w-full sm:w-40" />

                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 pt-2">
                  <Skeleton className="h-9 w-24 shrink-0 sm:w-28" />

                  <Skeleton className="h-10 w-full max-w-32 rounded-md sm:w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}