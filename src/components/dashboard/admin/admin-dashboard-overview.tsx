"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  MessageSquareText,
  Star,
  Users,
  UserRoundCheck,
  Wrench,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { AdminDashboardData } from "@/types/stats";

type OverviewData = AdminDashboardData["overview"];

type AdminDashboardOverviewProps = {
  overview: OverviewData;
};

type StatisticCardProps = {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  primary?: boolean;
};

export default function AdminDashboardOverview({
  overview,
}: AdminDashboardOverviewProps) {
  const primaryStats: StatisticCardProps[] = [
    {
      label: "Total Users",
      value: formatNumber(overview.activeUserCount),
      description: "Active platform users",
      icon: Users,
      primary: true,
    },
    {
      label: "Total Bookings",
      value: formatNumber(overview.bookingCount),
      description: "Bookings across the platform",
      icon: ClipboardList,
      primary: true,
    },
    {
      label: "Revenue",
      value: formatNumber(overview.revenue),
      description: "Total recorded revenue",
      icon: BriefcaseBusiness,
      primary: true,
    },
    {
      label: "Successful Payments",
      value: formatNumber(
        overview.successfulPaymentsCount,
      ),
      description: "Completed payments",
      icon: CheckCircle2,
      primary: true,
    },
  ];

  const secondaryStats: StatisticCardProps[] = [
    {
      label: "Customers",
      value: formatNumber(overview.customerCount),
      description: "Registered customers",
      icon: UserRoundCheck,
    },
    {
      label: "Technicians",
      value: formatNumber(overview.technicianCount),
      description: "Registered technicians",
      icon: Wrench,
    },
    {
      label: "Verified Technicians",
      value: formatNumber(
        overview.verifiedTechnicianCount,
      ),
      description: "Verified service providers",
      icon: UserRoundCheck,
    },
    {
      label: "Services",
      value: formatNumber(overview.servicesCount),
      description: "Available platform services",
      icon: BriefcaseBusiness,
    },
    {
      label: "Categories",
      value: formatNumber(overview.categoriesCount),
      description: "Service categories",
      icon: FolderKanban,
    },
    {
      label: "Reviews",
      value: formatNumber(overview.reviewsCount),
      description: "Customer reviews",
      icon: MessageSquareText,
    },
    {
      label: "Average Rating",
      value: formatRating(overview.averageRating),
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        primary
          ? "border-primary/20"
          : undefined
      }
    >
      <CardContent
        className={
          primary
            ? "p-5"
            : "p-4"
        }
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

function formatRating(value: number) {
  return value.toFixed(1);
}