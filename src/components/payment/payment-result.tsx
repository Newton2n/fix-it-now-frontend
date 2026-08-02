import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Clock3,
  MapPin,
  ReceiptText,
  Wrench,
} from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { PaymentDetails } from "@/types/payment";

type PaymentResultProps = {
  bookingId: string;

  booking: {
    id: string;
    status: string;
    scheduledAt: string;
    location: string;
    service: {
      title: string;
      description: string;
      price: number;
      currency: string;
    };
  };

  payment: PaymentDetails | null;
};

function getPaymentStatusClass(
  status: PaymentDetails["status"],
) {
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

function getResultContent(
  payment: PaymentDetails | null,
) {
  console.log("Payment details in result page",payment)
  if (payment?.status === "SUCCEEDED") {
    return {
      title: "Payment Successful",
      description:
        "Your payment has been successfully completed.",
      heading: "Payment completed successfully",
      message:
        "Your payment was successfully processed. Your booking details and payment information are shown below.",
      icon: CheckCircle2,
      iconClass: "text-green-600",
    };
  }

  if (payment?.status === "FAILED") {
    return {
      title: "Payment Failed",
      description:
        "We could not complete your payment.",
      heading: "Payment was not completed",
      message:
        "The payment attempt failed. Your booking is still available, and you can return to it and try again.",
      icon: CircleX,
      iconClass: "text-red-600",
    };
  }

  return {
    title: "Payment Not Completed",
    description:
      "Your payment has not been completed yet.",
    heading: "Payment is still pending",
    message:
      "The payment has not been confirmed yet. If you cancelled or left Stripe Checkout, you can return to your booking and try again.",
    icon: CircleX,
    iconClass: "text-muted-foreground",
  };
}

export function PaymentResult({
  booking,
  payment,
}: PaymentResultProps) {
  const result = getResultContent(payment);

  const ResultIcon = result.icon;

  const scheduledDate = new Date(
    booking.scheduledAt,
  );

  const date = scheduledDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const time = scheduledDate.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={result.title}
        description={result.description}
      />

      {/* Result message */}
      <div className="rounded-xl border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background">
            <ResultIcon
              className={`size-6 ${result.iconClass}`}
            />
          </div>

          <div>
            <h2 className="font-semibold">
              {result.heading}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {result.message}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Booking */}
        <SectionCard
          title="Booking Details"
          description="Information about your booked service."
        >
          <div className="space-y-6">
            {/* Service */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Wrench className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Service
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {booking.service.title}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.service.description}
                </p>
              </div>
            </div>

            {/* Date / Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />

                  <span className="text-sm">
                    Scheduled Date
                  </span>
                </div>

                <p className="mt-2 font-medium">
                  {date}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />

                  <span className="text-sm">
                    Scheduled Time
                  </span>
                </div>

                <p className="mt-2 font-medium">
                  {time}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-lg border p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />

                  <span className="text-sm">
                    Service Location
                  </span>
                </div>

                <p className="mt-2 font-medium">
                  {booking.location}
                </p>
              </div>
            </div>

            {/* Booking Status */}
            <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
              <span className="text-sm text-muted-foreground">
                Booking Status
              </span>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {booking.status}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
              <span className="text-sm text-muted-foreground">
                Payment Status
              </span>

              {payment ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                    payment.status,
                  )}`}
                >
                  {payment.status}
                </span>
              ) : (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  No Payment Record
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Payment */}
        <Card className="h-fit p-6">
          <h2 className="text-lg font-semibold">
            Payment Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Service
              </span>

              <span className="text-right text-sm font-medium">
                {booking.service.title}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Price
              </span>

              <span className="text-sm font-medium">
                {booking.service.price}{" "}
                {booking.service.currency}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold">
                  {booking.service.price}{" "}
                  {booking.service.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Actual payment information */}
          {payment && (
            <div className="mt-6 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-4" />

                <span className="text-sm font-medium">
                  Payment Record
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Status
                  </span>

                  <span className="font-medium">
                    {payment.status}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Method
                  </span>

                  <span className="font-medium">
                    {payment.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Provider
                  </span>

                  <span className="font-medium">
                    {payment.provider}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/dashboard/customer/bookings">
                <ArrowLeft className="mr-2 size-4" />
                Back to Bookings
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Payment status shown here comes from your actual
            payment record.
          </p>
        </Card>
      </div>
    </div>
  );
}