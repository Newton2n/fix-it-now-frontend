import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Complete Payment"
        description="Review your booking details before continuing to payment."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <SectionCard
          title="Booking Details"
          description="Review the service you are paying for."
        >
          <div className="space-y-6">
            <div className="flex gap-4">
              <Skeleton className="size-11 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg sm:col-span-2" />
            </div>

            <Skeleton className="h-16 rounded-lg" />
          </div>
        </SectionCard>

        <Card className="h-fit p-6">
          <div className="space-y-6">
            <Skeleton className="h-6 w-40" />

            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="mx-auto h-3 w-72" />
          </div>
        </Card>
      </div>
    </div>
  );
}