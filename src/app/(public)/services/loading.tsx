import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="w-full px-4 py-10 sm:py-12 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1800px]">
            <Skeleton className="mb-4 h-6 w-40 rounded-full" />
            <Skeleton className="h-10 w-full max-w-2xl sm:h-12 lg:h-14" />
            <Skeleton className="mt-4 h-4 w-full max-w-3xl" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full" />
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-8 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1800px]">
          <div className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-4 lg:p-5">
            <Skeleton className="h-11 w-full md:col-span-2" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-background p-4 shadow-sm lg:p-5"
              >
                <Skeleton className="h-52 w-full rounded-xl lg:h-56" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
