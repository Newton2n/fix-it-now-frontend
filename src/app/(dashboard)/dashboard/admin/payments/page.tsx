import { Suspense } from "react";
import { getAllPayments } from "@/actions/admin.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Payment } from "@/types/payment";
import { PaymentSearchParams } from "@/schema/payment/payment";
import PaymentFilters from "@/components/dashboard/filters/admin/payment-filter";

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

export default function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<AdminPaymentsSkeleton />}>
      <AdminPaymentsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminPaymentsContent({
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

  const result = await getAllPayments(query);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Payments"
          description="Track all platform transactions."
        />
        <SectionCard title="Unable to load payments">
          <div className="rounded-xl border border-dashed py-16 text-center">
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.message || "Unable to load payments."}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  const paymentResult: PaymentResult = result.data ?? {
    meta: {
      currentPage: 1,
      limit: 10,
      totalRow: 0,
      totalPage: 0,
    },
    data: [],
  };

  const payments = paymentResult.data;
  const meta = paymentResult.meta;

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Track all platform transactions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Payments (this page)" value={payments.length} />
        <StatCard
          label="Successful Revenue"
          value={`USD ${totalRevenue.toFixed(2)}`}
        />
        <StatCard
          label="Successful Payments"
          value={payments.filter((p) => p.status === "SUCCEEDED").length}
        />
      </div>

      {/* Filters + pagination */}
      <PaymentFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Payment Records"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total transactions`}
      >
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
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
        {value || "—"}
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
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function AdminPaymentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
