"use client";

import {
  CalendarDays,
  CreditCard,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminDashboardData } from "@/types/stats";

type RecentBooking =
  AdminDashboardData["recentBookings"][number];

type AdminRecentBookingsProps = {
  bookings: RecentBooking[];
};

export default function AdminRecentBookings({
  bookings,
}: AdminRecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>

        <CardDescription>
          The latest bookings created on the platform.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {bookings.length === 0 ? (
          <EmptyRecentBookings />
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="min-w-40">
                        <p className="font-medium">
                          {booking.user.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {booking.user.email}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="min-w-40 font-medium">
                        {booking.service.title}
                      </p>
                    </TableCell>

                    <TableCell>
                      <BookingStatusBadge
                        status={booking.status}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex min-w-32 items-center gap-2 text-sm">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <span>
                          {formatDateTime(
                            booking.scheduledAt,
                          )}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex min-w-32 items-center gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="max-w-40 truncate">
                          {booking.location || "Not provided"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium">
                        {formatNumber(
                          booking.payment?.amount ??
                            booking.service.price,
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <PaymentStatus
                        payment={booking.payment}
                      />
                    </TableCell>

                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDateTime(booking.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BookingStatusBadge({
  status,
}: {
  status: RecentBooking["status"];
}) {
  const variant = getBookingStatusVariant(status);

  return (
    <Badge
      variant={variant}
      className="whitespace-nowrap"
    >
      {formatStatus(status)}
    </Badge>
  );
}

function PaymentStatus({
  payment,
}: {
  payment: RecentBooking["payment"];
}) {
  if (!payment) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <CreditCard className="size-4" />
        Unpaid
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <p className="font-medium">
        {formatNumber(payment.amount)}
      </p>

      <Badge
        variant={getPaymentStatusVariant(payment.status)}
        className="text-[11px]"
      >
        {formatStatus(payment.status)}
      </Badge>
    </div>
  );
}

function EmptyRecentBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-12 text-center">
      <h3 className="text-base font-semibold">
        No recent bookings
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Recent booking activity will appear here when available.
      </p>
    </div>
  );
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function getBookingStatusVariant(
  status: RecentBooking["status"],
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "default";

    case "DECLINED":
    case "CANCELED":
      return "destructive";

    case "ACCEPTED":
    case "PAID":
      return "secondary";

    case "REQUESTED":
    case "IN_PROGRESS":
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(
  status: RecentBooking["payment"] extends infer Payment
    ? Payment extends {
        status: infer PaymentStatus;
      }
      ? PaymentStatus
      : never
    : never,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "SUCCEEDED":
      return "default";

    case "FAILED":
      return "destructive";

    case "PENDING":
    default:
      return "outline";
  }
}