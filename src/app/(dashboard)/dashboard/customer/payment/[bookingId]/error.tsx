"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
   
  }, [error]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Complete Payment"
        description="We couldn’t load the payment page."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <SectionCard
          title="Something went wrong"
          description="Please try again or go back to your bookings."
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The booking or payment details could not be loaded. You can retry
              loading this page or return to your bookings list.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={reset}>
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>

              <Button asChild variant="outline">
                <Link href="/dashboard/customer/bookings">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Bookings
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <Card className="h-fit p-6">
          <div className="space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}