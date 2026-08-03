import { BadgeDollarSign, ClipboardList, Users, Wrench } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Admin Dashboard"
        description="Manage users, technicians, categories, services, bookings, and payments."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value="Manage users"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          label="Technicians"
          value="Manage technicians"
          icon={<Wrench className="h-5 w-5" />}
        />

        <StatCard
          label="Bookings"
          value="Manage bookings"
          icon={<ClipboardList className="h-5 w-5" />}
        />

        <StatCard
          label="Revenue"
          value="Manage payments"
          icon={<BadgeDollarSign className="h-5 w-5" />}
        />
      </div>

      <SectionCard
        title="Platform Status"
        description="Overview of the platform and its core management features"
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Platform Overview</Badge>

          <p className="text-sm text-muted-foreground">
            Manage users, technicians, categories, services, bookings, and
            payments from the admin dashboard.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}