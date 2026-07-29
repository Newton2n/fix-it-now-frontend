import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";

const payments = [
  { id: 1, service: "AC Installation", amount: "$45", status: "PAID" },
  { id: 2, service: "Home Cleaning", amount: "$20", status: "PAID" },
];

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Your payment history and transaction records."
      />

      <SectionCard title="Payment History" description="Completed transactions">
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