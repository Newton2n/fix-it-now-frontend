import { Badge } from "@/components/ui/badge";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionCard from "@/components/dashboard/section-card";

import {
  Users,
  CalendarDays,
  ClipboardList,
  CreditCard,
} from "lucide-react";


const stats = [
  {
    label: "Total Users",
    value: 1240,
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Bookings",
    value: 86,
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    label: "Service Requests",
    value: 42,
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Revenue",
    value: "$12,450",
    icon: <CreditCard className="h-5 w-5" />,
  },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <DashboardPageHeader
        title="Dashboard Overview"
        description="Welcome back! Here is a summary of your platform activity."
      />



      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}

      </div>




      <SectionCard
        title="System Status"
        description="Current platform activity overview."
      >

        <div className="flex items-center gap-3">

          <Badge variant="secondary">
            Active
          </Badge>

          <p className="text-sm text-muted-foreground">
            All services are operating normally.
          </p>

        </div>

      </SectionCard>


    </div>
  );
}