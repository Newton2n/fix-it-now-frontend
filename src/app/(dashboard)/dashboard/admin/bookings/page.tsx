import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const bookings = [
  { id: 1, service: "Plumbing Repair", status: "REQUESTED" },
  { id: 2, service: "AC Installation", status: "PAID" },
  { id: 3, service: "Home Cleaning", status: "COMPLETED" },
];

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="Monitor all booking activity on the platform."
      />

      <SectionCard title="Booking List" description="All customer bookings">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{booking.service}</p>
                <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{booking.status}</Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}