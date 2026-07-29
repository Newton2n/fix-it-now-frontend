import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

const payments = [
  { id: 1, service: "Plumbing Repair", amount: "$50", status: "Paid" },
  { id: 2, service: "AC Installation", amount: "$45", status: "Paid" },
  { id: 3, service: "Home Cleaning", amount: "$20", status: "Pending" },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Track all platform transactions."
      />

      <SectionCard title="Payment Records" description="Recent payment history">
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{payment.service}</p>
                <p className="text-sm text-muted-foreground">{payment.amount}</p>
              </div>
              <Badge variant="secondary">{payment.status}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}