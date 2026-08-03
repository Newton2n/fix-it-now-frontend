import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technician Dashboard"
        description="Manage your jobs, services, availability, and earnings."
      />

      <SectionCard
        title="Technician Overview"
        description="Manage your services, bookings, availability, and technician profile."
      >
        <p className="text-sm text-muted-foreground">
          You can manage your services, respond to booking requests, update
          your availability, and manage your technician profile.
        </p>
      </SectionCard>
    </div>
  );
}