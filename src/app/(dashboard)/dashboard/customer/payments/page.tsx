import { Suspense } from "react";
import { getAllPaymentDetailsFromLoginUser } from "@/actions/payment.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { VariantProps } from "class-variance-authority";

import { Payment } from "@/types/payment";
import PaymentFilters from "@/components/dashboard/filters/admin/payment-filter";
import { PaymentSearchParams } from "@/schema/payment/payment";

type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED";

type PaymentResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Payment[];
};

export default function CustomerPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<CustomerPaymentsSkeleton />}>
      <CustomerPaymentsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CustomerPaymentsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query: PaymentSearchParams = {
    transactionId:
      typeof params.transactionId === "string"
        ? params.transactionId
        : undefined,
    status: (params.status as PaymentStatus | undefined) || undefined,
    provider:
      (params.provider as "STRIPE" | "SSLCOMMERZ" | undefined) || undefined,
    minAmount:
      typeof params.minAmount === "string"
        ? Number(params.minAmount)
        : undefined,
    maxAmount:
      typeof params.maxAmount === "string"
        ? Number(params.maxAmount)
        : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: typeof params.limit === "string" ? Number(params.limit) : 10,
    sortBy:
      (params.sortBy as "amount" | "createdAt" | "status" | undefined) ||
      "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const result = await getAllPaymentDetailsFromLoginUser(query);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Payments"
          description="Your payment history and transaction records."
        />

        <SectionCard
          title="Payment History"
          description="Unable to load your payment history."
        >
          <div className="rounded-xl border border-dashed py-16 text-center">
            <h3 className="text-lg font-semibold">Unable to load payments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.message}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  const paymentResult: PaymentResult = {
    meta: result.meta,
    data: result.data as Payment[],
  };

  const payments = paymentResult.data;
  const meta = paymentResult.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Your payment history and transaction records."
      />

     
      <PaymentFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Payment History"
        description={
          meta.totalRow > 0
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total payments`
            : "You have no payment records yet."
        }
      >
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  {/* Payment Information */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>

                      <p className="break-all font-medium text-foreground">
                        {payment.transactionId}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Info label="Booking ID" value={payment.bookingId} />
                      <Info
                        label="Amount"
                        value={`${payment.currency} ${payment.amount}`}
                      />
                      <Info
                        label="Payment Method"
                        value={payment.paymentMethod}
                      />
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

                  {/* Payment Status */}
                  <div className="shrink-0">
                    <Badge
                      variant={getStatusVariant(
                        payment.status as PaymentStatus,
                      )}
                      className="rounded-full px-3"
                    >
                      {formatStatus(payment.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPayments />
        )}
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function EmptyPayments() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">No payments found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You don&apos;t have any payment records yet.
      </p>
    </div>
  );
}

function getStatusVariant(
  status: PaymentStatus,
): VariantProps<typeof badgeVariants>["variant"] {
  switch (status) {
    case "SUCCEEDED":
      return "default";

    case "PENDING":
      return "secondary";

    case "FAILED":
      return "destructive";

    default:
      return "secondary";
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

function CustomerPaymentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-100 w-full rounded-xl" />
    </div>
  );
}
