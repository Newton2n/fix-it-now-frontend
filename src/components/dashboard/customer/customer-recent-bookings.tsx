"use client";

import Link from "next/link";
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
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CustomerDashboardData } from "@/types/stats";

type RecentBooking =
  CustomerDashboardData["recentBookings"][number];

type CustomerRecentBookingsProps = {
  bookings: RecentBooking[];
};

export default function CustomerRecentBookings({
  bookings,
}: CustomerRecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>

        <CardDescription>
          Review your latest service bookings and payment status.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <>
            {/* Desktop and tablet table */}
            <div className="hidden w-full overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <p className="min-w-40 font-medium">
                          {booking.service.title}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="min-w-32 text-sm">
                          {getTechnicianName(booking)}
                        </span>
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
                        <span className="whitespace-nowrap font-medium">
                          {formatNumber(
                            booking.service.price ?? 0,
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        <PaymentStatus
                          payment={booking.payment}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {bookings.map((booking) => (
                <MobileBookingCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MobileBookingCard({
  booking,
}: {
  booking: RecentBooking;
}) {
  return (
    <article className="rounded-xl border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {booking.service.title}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Technician: {getTechnicianName(booking)}
          </p>
        </div>

        <BookingStatusBadge
          status={booking.status}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MobileInfo
          label="Scheduled"
          value={formatDateTime(booking.scheduledAt)}
        />

        <MobileInfo
          label="Location"
          value={booking.location || "Not provided"}
        />

        <MobileInfo
          label="Price"
          value={formatNumber(booking.service.price ?? 0)}
        />

        <div>
          <p className="text-xs text-muted-foreground">
            Payment
          </p>

          <div className="mt-1">
            <PaymentStatus
              payment={booking.payment}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function MobileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function BookingStatusBadge({
  status,
}: {
  status: RecentBooking["status"];
}) {
  return (
    <Badge
      variant={getBookingStatusVariant(status)}
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
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
        <CreditCard className="size-4" />
        Unpaid
      </span>
    );
  }

  return (
    <Badge
      variant={getPaymentStatusVariant(payment.status)}
      className="whitespace-nowrap"
    >
      {formatStatus(payment.status)}
    </Badge>
  );
}

function EmptyBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-12 text-center">
      <h3 className="text-base font-semibold">
        No recent bookings
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You have not created any bookings yet.
      </p>

      <Button
        asChild
        className="mt-5 cursor-pointer"
      >
        <Link href="/services">
          Browse Services
        </Link>
      </Button>
    </div>
  );
}

function getTechnicianName(
  booking: RecentBooking,
) {
  return (
    booking.service.technician?.user.name ||
    "Not assigned"
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

    case "CANCELED":
      return "destructive";

    case "ACCEPTED":
      return "secondary";

    case "REQUESTED":
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(
  status: "PENDING" | "SUCCEEDED" | "FAILED",
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