import { getAllPaymentDetailsFromLoginUser } from "@/actions/payment.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

type PaymentStatus =
  | "SUCCEEDED"
  | "PENDING"
  | "FAILED"
  | "CANCELED";

export default async function CustomerPaymentsPage() {
  const res = await getAllPaymentDetailsFromLoginUser();

  const payments = res?.data ?? [];
  const meta = res?.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Your payment history and transaction records."
      />

      <SectionCard
        title="Payment History"
        description={
          meta
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total payments`
            : "Payment history"
        }
      >
        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>

                      <p className="break-all font-medium">
                        {payment.transactionId}
                      </p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="Booking ID"
                        value={payment.bookingId}
                      />

                      <Info
                        label="Amount"
                        value={`${payment.currency} ${payment.amount}`}
                      />

                      <Info
                        label="Method"
                        value={payment.paymentMethod}
                      />

                      <Info
                        label="Provider"
                        value={payment.provider}
                      />

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

                  <Badge
                    variant={getStatusVariant(payment.status)}
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed py-16 text-center">
              <h3 className="text-lg font-semibold">
                No payments found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                You don’t have any payment records yet.
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}


function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}


function getStatusVariant(
  status: PaymentStatus
): VariantProps<typeof badgeVariants>["variant"] {
  switch (status) {
    case "SUCCEEDED":
      return "default";

    case "PENDING":
      return "secondary";

    case "FAILED":
      return "destructive";

    case "CANCELED":
      return "outline";

    default:
      return "secondary";
  }
}