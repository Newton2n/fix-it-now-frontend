import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

const earnings = [
  { id: 1, service: "Plumbing Repair", amount: "$50", status: "Paid" },
  { id: 2, service: "AC Installation", amount: "$45", status: "Paid" },
];

export default function TechnicianEarningsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings"
        description="Track your completed job payments."
      />

      <SectionCard title="Earnings History" description="Recent income records">
        <div className="space-y-4">
          {earnings.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{item.service}</p>
                <p className="text-sm text-muted-foreground">{item.amount}</p>
              </div>
              <Badge variant="secondary">{item.status}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}