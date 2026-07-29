import { CalendarDays, ClipboardList, DollarSign, Wrench } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technician Dashboard"
        description="Manage your jobs, services, availability, and earnings."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming Jobs" value={18} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard label="Available Hours" value="40h" icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Services" value={6} icon={<Wrench className="h-5 w-5" />} />
        <StatCard label="Earnings" value="$1,240" icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <SectionCard title="Status" description="Your current technician profile status">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <p className="text-sm text-muted-foreground">
            Your profile is visible to customers.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}