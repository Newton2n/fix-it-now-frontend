import { Suspense } from "react";
import { getAppStats } from "@/actions/stats.action";
import { ApplicationStats } from "./application-stats";
import { Card } from "@/components/ui/card";

async function StatsContent() {
  const response = await getAppStats();

  if (!response.success || !response.data) {
    return null; 
  }

  return <ApplicationStats stats={response.data} />;
}

function ApplicationStatsSkeleton() {
  return (
    <section className="w-full overflow-hidden py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mx-auto w-full max-w-2xl text-center space-y-3">
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-8 w-72 animate-pulse rounded bg-muted sm:w-96" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-muted" />
        </div>

        {/* Marquee Cards Skeleton Grid */}
        <div className="mt-10 flex gap-4 overflow-hidden py-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-[260px] sm:w-[280px] shrink-0">
              <Card className="flex h-full min-w-0 items-center gap-4 rounded-2xl border-border bg-card p-5">
                <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-7 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function ApplicationStatsSection() {
  return (
    <Suspense fallback={<ApplicationStatsSkeleton />}>
      <StatsContent />
    </Suspense>
  );
}
