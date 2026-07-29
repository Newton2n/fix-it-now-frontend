import { CalendarDays, CreditCard, Star, TrendingUp } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customer Dashboard"
        description="Track your bookings, payments, and reviews."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={12} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Paid Orders" value={8} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard label="Reviews" value={4} icon={<Star className="h-5 w-5" />} />
        <StatCard label="Completed" value={6} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Account Status"
        description="Your current account and booking activity overview."
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <p className="text-sm text-muted-foreground">
            You can book services, pay invoices, and leave reviews.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}