"use client";

import { Banknote } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TechnicianEarningsCardProps = {
  earnings: number;
};

export default function TechnicianEarningsCard({
  earnings,
}: TechnicianEarningsCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Earnings</CardTitle>

            <CardDescription>
              Total recorded earnings from your services.
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Banknote className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight">
          {formatNumber(earnings)}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Based on the data currently available.
        </p>
      </CardContent>
    </Card>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}