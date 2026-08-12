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

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Serialized key forces Suspense to show skeleton loader when route/query params change
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <Suspense key={filterKey} fallback={<AdminPaymentsSkeleton />}>
      <AdminPaymentsContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function AdminPaymentsContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const query: PaymentSearchParams = {
    transactionId:
      typeof resolvedParams.transactionId === "string"
        ? resolvedParams.transactionId
        : undefined,
    status: (resolvedParams.status as PaymentStatus | undefined) || undefined,
    provider:
      (resolvedParams.provider as "STRIPE" | "SSLCOMMERZ" | undefined) || undefined,
    minAmount:
      typeof resolvedParams.minAmount === "string"
        ? Number(resolvedParams.minAmount)
        : undefined,
    maxAmount:
      typeof resolvedParams.maxAmount === "string"
        ? Number(resolvedParams.maxAmount)
        : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy:
      (resolvedParams.sortBy as "amount" | "createdAt" | "status" | undefined) ||
      "createdAt",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
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
                  <div className="space-y-3 flex-1">
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
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Payment Records Section Skeleton */}
      <SectionCard title="Payment Records" description="Loading transactions...">
        <div className="space-y-4">
          <SkeletonPaymentCard />
          <SkeletonPaymentCard />
          <SkeletonPaymentCard />
        </div>
      </SectionCard>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

function SkeletonPaymentCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 flex-1">
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-56" />
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-background p-3 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}