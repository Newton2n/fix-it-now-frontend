import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customer Dashboard"
        description="Track your bookings, payments, and reviews."
      />

      <SectionCard
        title="Account Overview"
        description="Manage your bookings, payments, and reviews from your dashboard."
      >
        <p className="text-sm text-muted-foreground">
          You can book services, manage your bookings, make payments, and leave
          reviews for completed services.
        </p>
      </SectionCard>
    </div>
  );
}