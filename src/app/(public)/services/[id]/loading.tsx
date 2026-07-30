import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl sm:h-80 md:h-[30rem]" />

          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-10 w-full max-w-xl sm:h-12" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-3/4 max-w-xl" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="space-y-3">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center justify-between gap-4 pt-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}