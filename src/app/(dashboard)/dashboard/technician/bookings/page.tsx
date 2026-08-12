
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

export default function TechnicianBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <TechnicianBookingsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TechnicianBookingsContent({
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
      typeof params.endDate === "string"
        ? new Date(params.endDate)
        : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: typeof params.limit === "string" ? Number(params.limit) : 10,
    sortBy:
      (params.sortBy as "createdAt" | "scheduledAt" | undefined) ||
      "createdAt",
    sortOrder:
      (params.sortOrder as "asc" | "desc" | undefined) || "desc",
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
            {/* Button to create profile */}
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
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />
      <SectionCard title="Incoming Bookings" description="Loading...">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}