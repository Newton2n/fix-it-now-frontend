// app/dashboard/customer/bookings/page.tsx
import { Suspense } from "react";
import { getAllBookingsFromLoginUser } from "@/actions/bookings.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Booking, BookingStatus } from "@/types/api";
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

export default function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <CustomerBookingsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CustomerBookingsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query: UserBookingSearchParams = {
    status:
      (params.status as
        | "REQUESTED"
        | "ACCEPTED"
        | "PAID"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "DECLINED"
        | "CANCELED"
        | undefined) || undefined,
    paymentStatus:
      (params.paymentStatus as
        | "PENDING"
        | "SUCCEEDED"
        | "FAILED"
        | undefined) || undefined,
    serviceId:
      typeof params.serviceId === "string" ? params.serviceId : undefined,
    startDate:
      typeof params.startDate === "string"
        ? new Date(params.startDate)
        : undefined,
    endDate:
      typeof params.endDate === "string" ? new Date(params.endDate) : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: typeof params.limit === "string" ? Number(params.limit) : 10,
    sortBy:
      (params.sortBy as "scheduledAt" | "createdAt" | undefined) || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || "desc",
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
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <SectionCard
        title="Booking History"
        description="Loading your bookings..."
      >
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-36 w-full" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
