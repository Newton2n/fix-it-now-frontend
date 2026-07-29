import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const bookings = [
  { id: 1, service: "Plumbing Repair", status: "REQUESTED", date: "2026-07-12" },
  { id: 2, service: "Electrical Fixing", status: "PAID", date: "2026-07-14" },
  { id: 3, service: "Home Cleaning", status: "IN_PROGRESS", date: "2026-07-08" },
];

export default function TechnicianBookingsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <SectionCard title="Incoming Bookings" description="Manage customer requests">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{booking.service}</p>
                <p className="text-sm text-muted-foreground">{booking.date}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{booking.status}</Badge>

                {booking.status === "REQUESTED" ? (
                  <>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </>
                ) : null}

                {booking.status === "PAID" ? <Button size="sm">Start Job</Button> : null}
                {booking.status === "IN_PROGRESS" ? (
                  <Button size="sm">Mark Completed</Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}