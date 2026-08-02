import { notFound } from "next/navigation";

import { getBookingById } from "@/actions/bookings.action";
import {
  getPaymentDetailsByBookingId,
} from "@/actions/payment.action";

import { PaymentResult } from "@/components/payment/payment-result";

type CancelPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function PaymentCancelPage({
  params,
}: CancelPageProps) {
  const { bookingId } = await params;

  const [bookingResult, paymentResult] =
    await Promise.all([
      getBookingById(bookingId),
      getPaymentDetailsByBookingId(bookingId),
    ]);

  if (
    !bookingResult.success ||
    !bookingResult.data?.booking
  ) {
    notFound();
  }

  const booking = bookingResult.data.booking;

  const payment =
    paymentResult.success &&
    paymentResult.data?.result
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