"use client";

import type { ComponentType } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MessageSquareText,
  Star,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { TechnicianDashboardData } from "@/types/stats";

type TechnicianOverview =
  TechnicianDashboardData["overview"];

type TechnicianDashboardOverviewProps = {
  overview: TechnicianOverview;
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

export default function TechnicianDashboardOverview({
  overview,
}: TechnicianDashboardOverviewProps) {
  const primaryStats: StatisticCardProps[] = [
    {
      label: "Total Bookings",
      value: formatNumber(overview.totalBookings),
      description: "All assigned bookings",
      icon: ClipboardList,
      primary: true,
    },
    {
      label: "Completed Bookings",
      value: formatNumber(
        overview.completedBookings,
      ),
      description: "Successfully completed",
      icon: CheckCircle2,
      primary: true,
    },
    {
      label: "Pending Bookings",
      value: formatNumber(overview.pendingBookings),
      description: "Require your attention",
      icon: Clock3,
      primary: true,
    },
    {
      label: "Earnings",
      value: formatNumber(overview.earnings),
      description: "Total recorded earnings",
      icon: BriefcaseBusiness,
      primary: true,
    },
  ];

  const secondaryStats: StatisticCardProps[] = [
    {
      label: "Total Services",
      value: formatNumber(overview.servicesCount),
      description: "Services you provide",
      icon: BriefcaseBusiness,
    },
    {
      label: "Active Services",
      value: formatNumber(
        overview.activeServicesCount,
      ),
      description: "Currently available services",
      icon: CheckCircle2,
    },
    {
      label: "Canceled Bookings",
      value: formatNumber(
        overview.canceledBookings,
      ),
      description: "Canceled bookings",
      icon: XCircle,
    },
    {
      label: "Reviews",
      value: formatNumber(overview.reviewsCount),
      description: "Customer reviews received",
      icon: MessageSquareText,
    },
    {
      label: "Average Rating",
      value: overview.averageRating.toFixed(1),
      description: "Average customer rating",
      icon: Star,
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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