import {
  CreditCard,
  Hash,
  CalendarDays,
  CircleDollarSign,
  ShieldCheck,
  Activity,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type { PaymentDetails } from "@/types/payment";

type PaymentDetailsCardProps = {
  payment: PaymentDetails;
};

function getPaymentStatusClass(status: string) {
  switch (status) {
    case "SUCCEEDED":
      return "bg-green-100 text-green-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "CANCELED":
      return "bg-muted text-muted-foreground";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PaymentDetailsCard({
  payment,
}: PaymentDetailsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <CreditCard className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Payment Details
          </h2>

          <p className="text-sm text-muted-foreground">
            Transaction information for this booking.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Payment Status */}
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Payment Status
            </span>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
              payment.status,
            )}`}
          >
            {payment.status}
          </span>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Amount
            </span>
          </div>

          <span className="font-semibold">
            {payment.amount} {payment.currency}
          </span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Payment Method
            </span>
          </div>

          <span className="text-sm font-medium capitalize">
            {payment.paymentMethod}
          </span>
        </div>

        {/* Provider */}
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Provider
            </span>
          </div>

          <span className="text-sm font-medium">
            {payment.provider}
          </span>
        </div>

        {/* Transaction ID */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Hash className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Transaction ID
            </span>
          </div>

          <p className="mt-2 break-all text-xs font-mono">
            {payment.transactionId}
          </p>
        </div>

        {/* Created At */}
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Payment Date
            </span>
          </div>

          <span className="text-right text-sm font-medium">
            {formatDate(payment.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );
}