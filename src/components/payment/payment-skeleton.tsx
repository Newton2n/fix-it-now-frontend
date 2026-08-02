import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <DashboardPageHeader
        title="Loading Payment Status..."
        description="Please wait while we retrieve your transaction and booking details."
      />

      {/* Result message skeleton */}
      <div className="rounded-xl border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Booking Details Skeleton */}
        <SectionCard
          title="Booking Details"
          description="Information about your booked service."
        >
          <div className="space-y-6">
            {/* Service info */}
            <div className="flex gap-4">
              <Skeleton className="size-11 shrink-0 rounded-lg" />
              <div className="min-w-0 space-y-2 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Date / Time Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>

              <div className="rounded-lg border p-4 sm:col-span-2 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>

            {/* Status Bars */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </SectionCard>

        {/* Payment Summary Skeleton */}
        <Card className="h-fit p-6">
          <Skeleton className="h-6 w-40 mb-6" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>

          {/* Payment Record Box Skeleton */}
          <div className="mt-6 rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-14" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </div>
          </div>

          {/* Action button skeleton */}
          <div className="mt-6">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <Skeleton className="mt-4 h-3 w-3/4 mx-auto" />
        </Card>
      </div>
    </div>
  );
}