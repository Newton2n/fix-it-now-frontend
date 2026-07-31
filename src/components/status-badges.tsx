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

export function BookingStatusBadge({
  status,
  className,
}: { status: BookingStatus } & StatusBadgeProps) {
  const config = bookingStatusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}

export function UserStatusBadge({
  status,
  className,
}: { status: UserStatus } & StatusBadgeProps) {
  const config = userStatusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}

export function TechnicianVerificationBadge({
  status,
  className,
}: { status: TechnicianVerificationStatus } & StatusBadgeProps) {
  const config = technicianVerificationConfig[status];
  const Icon = status === "VERIFIED" ? Check : status === "PENDING" ? Clock : X;

  return (
    <Badge variant={config.variant} className={cn("rounded-full gap-1", className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: { status: PaymentStatus } & StatusBadgeProps) {
  const config = paymentStatusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("rounded-full", className)}>
      {config.label}
    </Badge>
  );
}