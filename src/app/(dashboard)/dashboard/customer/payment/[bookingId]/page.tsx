import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Wrench,
} from "lucide-react";

import { getBookingById } from "@/actions/bookings.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProceedToPaymentButton } from "@/components/booking/payment-button";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default function PaymentPage({ params }: PaymentPageProps) {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent params={params} />
    </Suspense>
  );
}

async function PaymentPageContent({ params }: PaymentPageProps) {
  const { bookingId } = await params;

  const result = await getBookingById(bookingId);

  if (!result.success || !result.data?.booking) {
    notFound();
  }

  const booking = result.data.booking;
  const service = booking.service;

  const scheduledDate = new Date(booking.scheduledAt);

  const date = scheduledDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = scheduledDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const canPay = booking.status === "ACCEPTED";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Details"
        description="Review your booking details and payment status."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Booking Details */}
        <SectionCard
          title="Booking Details"
          description="Information about your service booking."
        >
          <div className="space-y-6">
            {/* Service */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Wrench className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Service</p>

                <h2 className="mt-1 text-lg font-semibold">{service.title}</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Date / Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />

                  <span className="text-sm">Scheduled Date</span>
                </div>

                <p className="mt-2 font-medium">{date}</p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />

                  <span className="text-sm">Scheduled Time</span>
                </div>

                <p className="mt-2 font-medium">{time}</p>
              </div>

              {/* Location */}
              <div className="rounded-lg border p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />

                  <span className="text-sm">Service Location</span>
                </div>

                <p className="mt-2 font-medium">{booking.location}</p>
              </div>
            </div>

            {/* Booking Status */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Booking Status
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Status Message */}
            {!canPay && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">
                  Payment is not available yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  You can make the payment once the technician accepts your
                  booking.
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Payment Summary */}
        <Card className="h-fit p-6">
          <h2 className="text-lg font-semibold">Payment Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-muted-foreground">Service</span>

              <span className="text-right text-sm font-medium">
                {service.title}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-muted-foreground">Price</span>

              <span className="text-sm font-medium">
                {service.price} {service.currency}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>

                <span className="text-xl font-bold">
                  {service.price} {service.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/customer/bookings">
                <ArrowLeft className="mr-2 size-4" />
                Back to Bookings
              </Link>
            </Button>

            {/* Only accepted bookings can be paid */}
            {canPay && <ProceedToPaymentButton bookingId={booking.id} />}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {canPay
              ? "You will be redirected to Stripe to securely complete your payment."
              : "Payment will become available after your booking is accepted."}
          </p>
        </Card>
      </div>
    </div>
  );
}

function PaymentPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-112.5 w-full rounded-xl" />
        <Skeleton className="h-95 w-full rounded-xl" />
      </div>
    </div>
  );
}