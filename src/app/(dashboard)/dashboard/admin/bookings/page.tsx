// app/admin/bookings/page.tsx
import { Suspense } from "react";
import { getAllBooking } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingDetails } from "@/types/booking";
import { BookingStatus } from "@/types/api";
import { AdminBookingSearchParams } from "@/actions/admin.action";
import BookingsFilterBar from "@/components/dashboard/filters/admin/bookings-filter-bar";

type BookingResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: BookingDetails[];
};

// Page component receives searchParams as a prop
export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Build query object for getAllBooking from URL params
  const query: AdminBookingSearchParams = {
    status:
      (typeof params.status === "string" ? params.status : undefined) ||
      undefined,
    paymentStatus:
      (typeof params.paymentStatus === "string"
        ? params.paymentStatus
        : undefined) || undefined,
    customerId:
      (typeof params.customerId === "string" ? params.customerId : undefined) ||
      undefined,
    serviceId:
      (typeof params.serviceId === "string" ? params.serviceId : undefined) ||
      undefined,
    startDate:
      (typeof params.startDate === "string" ? params.startDate : undefined) ||
      undefined,
    endDate:
      (typeof params.endDate === "string" ? params.endDate : undefined) ||
      undefined,
    page: typeof params.page === "string" ? Number(params.page) : undefined,
    limit: typeof params.limit === "string" ? Number(params.limit) : undefined,
    sortBy:
      (params.sortBy as "scheduledAt" | "createdAt" | undefined) || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  return (
    <Suspense fallback={<AdminBookingsSkeleton />}>
      <AdminBookingsContent query={query} />
    </Suspense>
  );
}

async function AdminBookingsContent({
  query,
}: {
  query: AdminBookingSearchParams;
}) {
  const result = await getAllBooking(query);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Bookings"
          description="Monitor all booking activity on the platform."
        />

        <SectionCard title="Unable to load bookings">
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
      limit: 10,
      totalRow: 0,
      totalPage: 0,
    },
    data: [],
  };

  const bookings = bookingResult.data;
  const meta = bookingResult.meta;

  const totalPaid = bookings.filter((b) => b.status === "PAID").length;
  const totalCompleted = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const totalPending = bookings.filter((b) => b.status === "REQUESTED").length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="Monitor all booking activity on the platform."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Bookings" value={meta.totalRow} />
        <StatCard label="Paid" value={totalPaid} />
        <StatCard label="Completed" value={totalCompleted} />
        <StatCard label="Pending" value={totalPending} />
      </div>

      {/* Filter bar + pagination (client component) */}
      <BookingsFilterBar
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Booking List"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total bookings`}
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Booking
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {booking.serviceId}
                      </p>
                      <p className="break-all text-sm text-muted-foreground">
                        Booking ID: {booking.id}
                      </p>
                    </div>

                    <Badge
                      variant={getStatusVariant(booking.status)}
                      className="rounded-full px-3"
                    >
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    <Info label="Customer ID" value={booking.customerId} />
                    <Info label="Service ID" value={booking.serviceId} />
                    <Info
                      label="Scheduled At"
                      value={formatDateTime(booking.scheduledAt)}
                    />
                    <Info label="Location" value={booking.location} />
                    <Info
                      label="Customer Note"
                      value={booking.customerNote ?? "—"}
                    />
                    <Info
                      label="Created At"
                      value={formatDateTime(booking.createdAt)}
                    />
                    <Info
                      label="Updated At"
                      value={formatDateTime(booking.updatedAt)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No bookings found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no customer bookings to display right now.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value || "—"}
      </p>
    </div>
  );
}

function getStatusLabel(status: BookingStatus) {
  switch (status) {
    case "REQUESTED":
      return "Requested";
    case "ACCEPTED":
      return "Waiting for payment";
    case "PAID":
      return "Paid";
    case "IN_PROGRESS":
      return "In progress";
    case "COMPLETED":
      return "Completed";
    case "DECLINED":
      return "Declined";
    case "CANCELED":
      return "Canceled";
    default:
      return status;
  }
}

function getStatusVariant(status: BookingStatus) {
  switch (status) {
    case "REQUESTED":
      return "secondary";
    case "ACCEPTED":
      return "outline";
    case "PAID":
    case "IN_PROGRESS":
    case "COMPLETED":
      return "default";
    case "DECLINED":
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function AdminBookingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-100 w-full rounded-xl" />
    </div>
  );
}
