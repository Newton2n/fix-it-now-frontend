"use client";

import type { ComponentType } from "react";
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileClock,
  MessageSquareText,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { CustomerDashboardData } from "@/types/stats";

type CustomerOverview =
  CustomerDashboardData["overview"];

type CustomerDashboardOverviewProps = {
  overview: CustomerOverview;
};

type StatisticCardProps = {
  label: string;
  value: string;
  description: string;
  icon: ComponentType<{
    className?: string;
  }>;
  primary?: boolean;
};

export default function CustomerDashboardOverview({
  overview,
}: CustomerDashboardOverviewProps) {
  const primaryStats: StatisticCardProps[] = [
    {
      label: "Total Bookings",
      value: formatNumber(overview.totalBookings),
      description: "All your service bookings",
      icon: ClipboardList,
      primary: true,
    },
    {
      label: "Accepted",
      value: formatNumber(
        overview.acceptedBookings,
      ),
      description: "Bookings accepted by technicians",
      icon: CheckCircle2,
      primary: true,
    },
    {
      label: "Completed",
      value: formatNumber(
        overview.completedBookings,
      ),
      description: "Successfully completed bookings",
      icon: CheckCircle2,
      primary: true,
    },
    {
      label: "Total Spent",
      value: formatNumber(overview.totalSpent) + " $",
      description: "Total recorded spending",
      icon: Wallet,
      primary: true,
    },
  ];

  const secondaryStats: StatisticCardProps[] = [
    {
      label: "Requested",
      value: formatNumber(
        overview.requestedBookings,
      ),
      description: "Waiting for confirmation",
      icon: FileClock,
    },
    {
      label: "Canceled",
      value: formatNumber(
        overview.canceledBookings,
      ),
      description: "Canceled bookings",
      icon: XCircle,
    },
    {
      label: "Reviews",
      value: formatNumber(overview.totalReviews),
      description: "Reviews submitted",
      icon: MessageSquareText,
    },
    {
      label: "Payments",
      value: formatNumber(overview.paymentsCount),
      description: "Recorded payments",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((stat) => (
          <StatisticCard
            key={stat.label}
            {...stat}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <StatisticCard
            key={stat.label}
            {...stat}
          />
        ))}
      </div>
    </div>
  );
}

function StatisticCard({
  label,
  value,
  description,
  icon: Icon,
  primary = false,
}: StatisticCardProps) {
  return (
    <Card
      className={
        primary ? "border-primary/20" : undefined
      }
    >
      <CardContent
        className={primary ? "p-5" : "p-4"}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p
              className={
                primary
                  ? "mt-2 truncate text-2xl font-bold tracking-tight"
                  : "mt-2 truncate text-xl font-semibold tracking-tight"
              }
            >
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={
              primary
                ? "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                : "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
            }
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}