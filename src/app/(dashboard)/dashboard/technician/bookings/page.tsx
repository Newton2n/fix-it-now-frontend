import { Suspense } from "react";
import { getAllBookingsFromLoginTechnician } from "@/actions/bookings.action";
import { getLoginTechnicianProfile } from "@/actions/technician.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { Booking } from "@/types/api";
import { UserBookingSearchParams } from "@/schema/booking/booking.schema";
import TechnicianBookingsClient from "@/components/dashboard/filters/technician/technician-bookings-client";
import TechnicianBookingFilters from "@/components/dashboard/filters/technician/technician-booking-filters";

type BookingResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Booking[];
};

export default async function TechnicianBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Key based on URL params ensures React re-triggers Suspense on filter changes
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <Suspense key={filterKey} fallback={<BookingsSkeleton />}>
      <TechnicianBookingsContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function TechnicianBookingsContent({
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
      typeof resolvedParams.endDate === "string"
        ? new Date(resolvedParams.endDate)
        : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy:
      (resolvedParams.sortBy as "createdAt" | "scheduledAt" | undefined) ||
      "createdAt",
    sortOrder:
      (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const [profileResult, bookingsResult] = await Promise.all([
    getLoginTechnicianProfile(),
    getAllBookingsFromLoginTechnician(query),
  ]);

  // Profile missing
  if (!profileResult.success || !profileResult.data?.result) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Booking Requests"
          description="Accept, decline, and update service jobs."
        />
        <SectionCard
          title="Technician Profile Required"
          description="Create your technician profile before viewing booking requests."
        >
          <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
            <h3 className="text-lg font-semibold">
              Create your technician profile first
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your booking requests are linked to your technician profile.
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  // Error loading bookings
  if (!bookingsResult.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Booking Requests"
          description="Accept, decline, and update service jobs."
        />
        <SectionCard title="Unable to load bookings">
          <Alert variant="destructive">
            <AlertDescription>{bookingsResult.message}</AlertDescription>
          </Alert>
        </SectionCard>
      </div>
    );
  }

  const bookingResult: BookingResult = {
    meta: bookingsResult.meta,
    data: bookingsResult.data as Booking[],
  };

  const bookings = bookingResult.data;
  const meta = bookingResult.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <TechnicianBookingFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Incoming Bookings"
        description={
          meta.totalRow > 0
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total bookings`
            : "You have no booking requests right now."
        }
      >
        <TechnicianBookingsClient
          initialBookings={bookings}
          initialMeta={meta}
        />
      </SectionCard>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
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

      {/* Main Section Card Skeleton */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Booking Card Items */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-5 shadow-sm space-y-4"
            >
              {/* Card Top Row: Service Title & Status Badges */}
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
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}