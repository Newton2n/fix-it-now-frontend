import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookingById } from "@/actions/bookings.action";
import { getPaymentDetailsByBookingId } from "@/actions/payment.action";

import { PaymentResult } from "@/components/payment/payment-result";
import { Skeleton } from "@/components/ui/skeleton";

type CancelPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default function PaymentCancelPage({ params }: CancelPageProps) {
  return (
    <Suspense fallback={<PaymentCancelSkeleton />}>
      <PaymentCancelContent params={params} />
    </Suspense>
  );
}

async function PaymentCancelContent({ params }: CancelPageProps) {
  const { bookingId } = await params;

  const [bookingResult, paymentResult] = await Promise.all([
    getBookingById(bookingId),
    getPaymentDetailsByBookingId(bookingId),
  ]);

  if (!bookingResult.success || !bookingResult.data?.booking) {
    notFound();
  }

  const booking = bookingResult.data.booking;

  const payment =
    paymentResult.success && paymentResult.data?.result
      ? paymentResult.data.result
      : null;

  return (
    <PaymentResult
      bookingId={bookingId}
      booking={booking}
      payment={payment}
    />
  );
}

function PaymentCancelSkeleton() {
  return (
    <div className="mx-auto max-w-xl py-12 px-4 space-y-6 text-center">
      <Skeleton className="h-16 w-16 mx-auto rounded-full" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}