import { getAllPayments } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";

type Payment = {
  id: string;
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

type PaymentResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Payment[];
};

export default async function AdminPaymentsPage() {
  const result = await getAllPayments();
  const payments = result.data.result.data;
  const meta = result.data.result.meta;

  const totalRevenue = payments
    .filter((payment: Payment) => payment.status === "SUCCEEDED")
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Track all platform transactions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Payments" value={meta.totalRow} />
        <StatCard label="Successful Revenue" value={`USD ${totalRevenue}`} />
      </div>

      <SectionCard
        title="Payment Records"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total transactions`}
      >
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment: Payment) => (
              <div
                key={payment.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Transaction
                      </p>
                      <p className="break-all text-lg font-semibold text-foreground">
                        {payment.transactionId}
                      </p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      <Info label="Payment ID" value={payment.id} />
                      <Info label="Booking ID" value={payment.bookingId} />
                      <Info
                        label="Amount"
                        value={`${payment.currency} ${payment.amount}`}
                      />
                      <Info label="Method" value={payment.paymentMethod} />
                      <Info label="Provider" value={payment.provider} />
                      <Info
                        label="Created At"
                        value={formatDateTime(payment.createdAt)}
                      />
                      <Info
                        label="Updated At"
                        value={formatDateTime(payment.updatedAt)}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <Badge
                      variant={getStatusVariant(payment.status)}
                      className="rounded-full px-3"
                    >
                      {getStatusLabel(payment.status)}
                    </Badge>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No payments found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no transactions to display right now.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function getStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "SUCCEEDED":
      return "Succeeded";
    case "PENDING":
      return "Pending";
    case "FAILED":
      return "Failed";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
}

function getStatusVariant(status: PaymentStatus) {
  switch (status) {
    case "SUCCEEDED":
      return "default";
    case "PENDING":
      return "secondary";
    case "FAILED":
      return "destructive";
    case "REFUNDED":
      return "outline";
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}
