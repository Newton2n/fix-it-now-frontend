import { getAllBooking } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED";

type Booking = {
  id: string;
  customerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  location: string;
  customerNote: string;
  createdAt: string;
  updatedAt: string;
};

type BookingResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Booking[];
};

export default async function AdminBookingsPage() {
  const result = await getAllBooking();

  const bookings = result.data.result.data;
  const meta = result.data.result.meta;

  const totalPaid = bookings.filter(
    (booking: Booking) => booking.status === "PAID",
  ).length;
  const totalCompleted = bookings.filter(
    (booking: Booking) => booking.status === "COMPLETED",
  ).length;
  const totalPending = bookings.filter(
    (booking: Booking) => booking.status === "REQUESTED",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="Monitor all booking activity on the platform."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Bookings" value={meta.totalRow} />
        <StatCard label="Paid" value={totalPaid} />
        <StatCard label="Completed" value={totalCompleted} />
      </div>

      <SectionCard
        title="Booking List"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total bookings`}
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: Booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
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
                        value={booking.customerNote}
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

                  <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <Badge
                      variant={getStatusVariant(booking.status)}
                      className="rounded-full px-3"
                    >
                      {getStatusLabel(booking.status)}
                    </Badge>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
        {value}
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
      return "default";
    case "IN_PROGRESS":
      return "default";
    case "COMPLETED":
      return "default";
    case "DECLINED":
      return "destructive";
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}
