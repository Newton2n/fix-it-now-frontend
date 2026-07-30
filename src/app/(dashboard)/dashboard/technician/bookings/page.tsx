import { getAllBookingsFromLoginTechnician } from "@/actions/bookings.action";
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

export default async function TechnicianBookingsPage() {
  const res = await getAllBookingsFromLoginTechnician();
  const bookings: Booking[] = Array.isArray(res?.result) ? res.result : [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <SectionCard
        title="Incoming Bookings"
        description="Manage customer requests and job progress"
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="break-all font-medium text-foreground">{booking.id}</p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info label="Scheduled At" value={formatDateTime(booking.scheduledAt)} />
                      <Info label="Location" value={booking.location} />
                      <Info label="Service ID" value={booking.serviceId} />
                      <Info label="Customer Note" value={booking.customerNote} />
                      <Info label="Created At" value={formatDateTime(booking.createdAt)} />
                      <Info label="Updated At" value={formatDateTime(booking.updatedAt)} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant={getStatusVariant(booking.status)} className="rounded-full px-3">
                        {getStatusLabel(booking.status)}
                      </Badge>
                      {getStatusMessage(booking.status) ? (
                        <p className="text-xs text-muted-foreground">
                          {getStatusMessage(booking.status)}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {getBookingActions(booking.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">No bookings found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You have no assigned bookings right now.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
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

function getStatusMessage(status: BookingStatus) {
  switch (status) {
    case "DECLINED":
      return "This booking was declined by the technician.";
    case "CANCELED":
      return "You canceled this booking.";
    default:
      return null;
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

function getBookingActions(status: BookingStatus) {
  if (status === "REQUESTED") {
    return (
      <>
        <Button size="sm" variant="outline">
          Decline
        </Button>
        <Button size="sm">Accept</Button>
      </>
    );
  }

  if (status === "PAID") {
    return <Button size="sm">Start Job</Button>;
  }

  if (status === "IN_PROGRESS") {
    return <Button size="sm">Mark Completed</Button>;
  }

  return null;
}