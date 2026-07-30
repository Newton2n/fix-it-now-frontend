import { getAllBookingsFromLoginUser } from "@/actions/bookings.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookingResponse,
  BookingStatus,
} from "@/schema/booking/booking.schema";
import Link from "next/link";

export default async function CustomerBookingsPage() {
  const bookingResponse: BookingResponse = await getAllBookingsFromLoginUser();
  const bookings = bookingResponse?.data || [];
  console.log("all bookings response data", bookingResponse);
  const meta = bookingResponse?.meta;

  const hasBookings = bookings.length > 0;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <SectionCard
        title="Booking History"
        description={
          hasBookings
            ? `Page ${meta?.currentPage} of ${meta?.totalPage} • ${meta?.totalRow} total bookings`
            : "You have no bookings yet"
        }
      >
        {hasBookings ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>
                      <p className="font-medium break-all">{booking.id}</p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="Scheduled At"
                        value={formatDateTime(booking.scheduledAt)}
                      />
                      <Info label="Location" value={booking.location} />
                      <Info label="Service ID" value={booking.serviceId} />
                      <Info
                        label="Customer Note"
                        value={booking.customerNote}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    {getBookingAction(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <div className="max-w-md space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl">🧾</span>
              </div>
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-sm text-muted-foreground">
                You haven’t booked any services yet. Once you create a booking,
                it will appear here.
              </p>
              {/* <Button className={"cursor-pointer"}>
                {" "}
                <Link href={"/services"}>Browse Services</Link>
              </Button> */}
            </div>
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
      <p className="mt-1 text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function getStatusVariant(status: BookingStatus) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "ACCEPTED":
      return "secondary";
    case "PAID":
      return "outline";
    case "REQUESTED":
      return "secondary";
    case "DECLINED":
      return "destructive";
    case "CANCELED":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    default:
      return "secondary";
  }
}

function getBookingAction(status: BookingStatus) {
  if (["REQUESTED", "ACCEPTED", "PAID"].includes(status)) {
    return (
      <Button size="sm" variant="destructive">
        Cancel Booking
      </Button>
    );
  }

  if (status === "COMPLETED") {
    return <Button size="sm">Add Review</Button>;
  }

  return null;
}
