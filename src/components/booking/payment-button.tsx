"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/payment.action";

type ProceedToPaymentButtonProps = {
  bookingId: string;
};

export function ProceedToPaymentButton({
  bookingId,
}: ProceedToPaymentButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handlePayment = async () => {
    setIsPending(true);

    try {
      const result = await createCheckoutSession(bookingId);
   

      if (!result.success || !result.data?.checkoutUrl) {
        toast.error(result.message || "Unable to start payment.");
        return;
      }

      //does not work in client component
      //   redirect(result.data.checkoutUrl);

      //use window.location.href to redirect in server component
      window.location.href = result.data.checkoutUrl;
    } catch (error) {
      

      toast.error("Unable to start payment. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      className="w-full"
      onClick={handlePayment}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Redirecting to payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 size-4" />
          Proceed to Payment
        </>
      )}
    </Button>
  );
}
