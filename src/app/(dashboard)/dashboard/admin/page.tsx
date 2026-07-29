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
        <StatCard label="Total Users" value={1240} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Technicians" value={86} icon={<Wrench className="h-5 w-5" />} />
        <StatCard label="Bookings" value={420} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard label="Revenue" value="$12,450" icon={<BadgeDollarSign className="h-5 w-5" />} />
      </div>

      <SectionCard title="Platform Status" description="Quick overview of system health">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Healthy</Badge>
          <p className="text-sm text-muted-foreground">
            All core systems are running normally.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}