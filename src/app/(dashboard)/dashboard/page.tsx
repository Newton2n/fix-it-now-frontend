import { Badge } from "@/components/ui/badge";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionCard from "@/components/dashboard/section-card";
import { Users, CalendarDays, ClipboardList, CreditCard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Dashboard Overview"
        description="Welcome back! Here’s a quick summary of your activity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={1240} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Bookings" value={86} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Requests" value={42} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard label="Revenue" value="$12,450" icon={<CreditCard className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Quick Note"
        description="Use this area for announcements, recent activity, or important updates."
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <p className="text-sm text-muted-foreground">
            Everything is running smoothly.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}