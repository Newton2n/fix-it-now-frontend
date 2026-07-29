import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const bookings = [
  { id: 1, service: "Plumbing Repair", status: "REQUESTED", date: "2026-07-12" },
  { id: 2, service: "AC Installation", status: "ACCEPTED", date: "2026-07-14" },
  { id: 3, service: "Home Cleaning", status: "COMPLETED", date: "2026-07-08" },
];

export default function CustomerBookingsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <SectionCard title="Booking History" description="Your recent service requests">
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

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{booking.status}</Badge>
                {booking.status === "ACCEPTED" ? (
                  <Button size="sm">Pay Now</Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}