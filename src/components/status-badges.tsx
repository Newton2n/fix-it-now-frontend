"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, X } from "lucide-react";

type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type UserStatus = "ACTIVE" | "INACTIVE";

type TechnicianVerificationStatus = "PENDING" | "VERIFIED" | "SUSPENDED";

type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

interface StatusBadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const bookingStatusConfig: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  REQUESTED: { label: "Requested", variant: "outline" },
  ACCEPTED: { label: "Accepted", variant: "secondary" },
  DECLINED: { label: "Declined", variant: "destructive" },
  PAID: { label: "Paid", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  COMPLETED: { label: "Completed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

const userStatusConfig: Record<
  UserStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  ACTIVE: { label: "Active", variant: "default" },
  INACTIVE: { label: "Inactive", variant: "destructive" },
};

const technicianVerificationConfig: Record<
  TechnicianVerificationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  VERIFIED: { label: "Verified", variant: "default" },
  SUSPENDED: { label: "Suspended", variant: "destructive" },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "secondary" },
};

function fallbackConfig(status?: string | null) {
  return {
    label: status ?? "Unknown",
    variant: "secondary" as const,
  };
}

export function BookingStatusBadge({
  status,
  className,
}: { status?: string | null } & StatusBadgeProps) {
  const config = status && status in bookingStatusConfig
    ? bookingStatusConfig[status as BookingStatus]
    : fallbackConfig(status);

  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}

export function UserStatusBadge({
  status,
  className,
}: { status?: string | null } & StatusBadgeProps) {
  const config = status && status in userStatusConfig
    ? userStatusConfig[status as UserStatus]
    : fallbackConfig(status);

  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}

export function TechnicianVerificationBadge({
  status,
  className,
}: { status?: string | null } & StatusBadgeProps) {
  const config = status && status in technicianVerificationConfig
    ? technicianVerificationConfig[status as TechnicianVerificationStatus]
    : fallbackConfig(status);

  const Icon =
    status === "VERIFIED" ? Check : status === "PENDING" ? Clock : X;

  return (
    <Badge
      variant={config.variant}
      className={cn("rounded-full gap-1", className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: { status?: string | null } & StatusBadgeProps) {
  const config = status && status in paymentStatusConfig
    ? paymentStatusConfig[status as PaymentStatus]
    : fallbackConfig(status);

  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}