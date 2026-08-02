"use client";

import {
  CreditCard,
  Eye,
  ReceiptText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { PaymentDetails } from "@/types/payment";

type PaymentDetailsDialogProps = {
  payment: PaymentDetails;
};

function getStatusClass(status: PaymentDetails["status"]) {
  switch (status) {
    case "SUCCEEDED":
      return "bg-green-100 text-green-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

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

export function PaymentDetailsDialog({
  payment,
}: PaymentDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          <Eye className="mr-2 size-4" />
          See Payment Details
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="size-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <span className="text-sm text-muted-foreground">
              Payment Status
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                payment.status,
              )}`}
            >
              {payment.status}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Amount
            </span>

            <span className="font-semibold">
              {payment.amount} {payment.currency}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Payment Method
            </span>

            <span className="flex items-center gap-2 font-medium">
              <CreditCard className="size-4" />
              {payment.paymentMethod}
            </span>
          </div>

          {/* Provider */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Provider
            </span>

            <span className="font-medium">
              {payment.provider}
            </span>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">
              Transaction ID
            </span>

            <div className="rounded-lg bg-muted p-3">
              <p className="break-all font-mono text-xs">
                {payment.transactionId}
              </p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">
              Payment Date
            </span>

            <span className="text-right text-sm font-medium">
              {formatDate(payment.createdAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}