"use client";

import { CreditCard, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

type CustomerSpendingCardProps = {
  totalSpent: number;
  paymentsCount: number;
};

export default function CustomerSpendingCard({
  totalSpent,
  paymentsCount,
}: CustomerSpendingCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Spending Summary</CardTitle>

            <CardDescription>
              Your payment activity across the platform.
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Spent
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {formatNumber(totalSpent) +" $"}
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />

              <span className="text-sm text-muted-foreground">
                Payments
              </span>
            </div>

            <span className="font-semibold">
              {formatNumber(paymentsCount)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Based on the payment data currently available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}