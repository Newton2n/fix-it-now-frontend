import { Suspense } from "react";
import { getAllBookingsFromLoginUser } from "@/actions/bookings.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Booking } from "@/types/api";
import { UserBookingSearchParams } from "@/schema/booking/booking.schema";
import CustomerBookingFilters from "@/components/dashboard/filters/customer/booking-filter";
import CustomerBookingsClient from "@/components/dashboard/filters/customer/customer-bookings-client";

type BookingResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Booking[];
};

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Serialized key derived from query parameters forces React Suspense to re-render on filter changes
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <Suspense key={filterKey} fallback={<BookingsSkeleton />}>
      <CustomerBookingsContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function CustomerBookingsContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const query: UserBookingSearchParams = {
    status:
      (resolvedParams.status as
        | "REQUESTED"
        | "ACCEPTED"
        | "PAID"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "DECLINED"
        | "CANCELED"
        | undefined) || undefined,
    paymentStatus:
      (resolvedParams.paymentStatus as
        | "PENDING"
        | "SUCCEEDED"
        | "FAILED"
        | undefined) || undefined,
    serviceId:
      typeof resolvedParams.serviceId === "string" ? resolvedParams.serviceId : undefined,
    startDate:
      typeof resolvedParams.startDate === "string"
        ? new Date(resolvedParams.startDate)
        : undefined,
    endDate:
      typeof resolvedParams.endDate === "string" ? new Date(resolvedParams.endDate) : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy:
      (resolvedParams.sortBy as "scheduledAt" | "createdAt" | undefined) || "createdAt",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const result = await getAllBookingsFromLoginUser(query);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Bookings"
          description="View and manage your service bookings."
        />

        <SectionCard title="Booking History">
          <div className="rounded-xl border border-dashed py-16 text-center">
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.message || "Unable to load bookings."}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  const bookingResult: BookingResult = result.data ?? {
    meta: {
      currentPage: 1,
      limit: 15,
      totalRow: 0,
      totalPage: 0,
    },
    data: [],
  };

  const bookings = bookingResult.data;
  const meta = bookingResult.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <CustomerBookingFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Booking History"
        description={
          meta.totalRow > 0
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total bookings`
            : "You have no bookings yet"
        }
      >
        <CustomerBookingsClient bookings={bookings} />
      </SectionCard>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Section Card & Booking Items Skeleton */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-5 shadow-sm space-y-4"
            >
              {/* Card Top: Title & Badges */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>

              {/* Grid with 4 Detail Blocks */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-background p-3 space-y-2"
                  >
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}