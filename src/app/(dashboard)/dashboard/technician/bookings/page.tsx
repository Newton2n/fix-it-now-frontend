"use client";

import { useEffect, useState } from "react";
import {
  getAllBookingsFromLoginTechnician,
  updateTechnicianBookingStatus,
} from "@/actions/bookings.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { BookingStatusBadge } from "@/components/status-badges";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/types/api";

type TechnicianBookingAction = "accept" | "decline" | "start" | "complete";

type TechnicianBookingStatus =
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED";

const statusMap: Record<TechnicianBookingAction, TechnicianBookingStatus> = {
  accept: "ACCEPTED",
  decline: "DECLINED",
  start: "IN_PROGRESS",
  complete: "COMPLETED",
};

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bookingId: string | null;
    action: TechnicianBookingAction | null;
  }>({
    open: false,
    bookingId: null,
    action: null,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getAllBookingsFromLoginTechnician();

        if (!result?.success) {
          toast.error(result?.message || "Failed to load bookings.");
          return;
        }

        const bookingsData = result.data;

        if (Array.isArray(bookingsData)) {
          setBookings(bookingsData);
        } else if (
          bookingsData &&
          "result" in bookingsData &&
          Array.isArray(bookingsData.result)
        ) {
          setBookings(bookingsData.result);
        } else if (
          bookingsData &&
          "bookings" in bookingsData &&
          Array.isArray(bookingsData.bookings)
        ) {
          setBookings(bookingsData.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAction = (bookingId: string, action: TechnicianBookingAction) => {
    setConfirmDialog({
      open: true,
      bookingId,
      action,
    });
  };

  const closeConfirmDialog = () => {
    if (actionLoading) return;

    setConfirmDialog({
      open: false,
      bookingId: null,
      action: null,
    });
  };

  const executeAction = async () => {
    const { bookingId, action } = confirmDialog;

    if (!bookingId || !action) return;

    const newStatus = statusMap[action];

    setActionLoading(bookingId);

    try {
      const result = await updateTechnicianBookingStatus(bookingId, newStatus);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // Update locally.
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
              }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Booking status update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
      setConfirmDialog({
        open: false,
        bookingId: null,
        action: null,
      });
    }
  };

  const getConfirmDialogProps = () => {
    switch (confirmDialog.action) {
      case "accept":
        return {
          title: "Accept booking?",
          description: "You are accepting this service request from the customer.",
          confirmText: "Accept Booking",
          isDestructive: false,
        };

      case "decline":
        return {
          title: "Decline booking?",
          description: "Are you sure you want to decline this booking?",
          confirmText: "Decline Booking",
          isDestructive: true,
        };

      case "start":
        return {
          title: "Start this job?",
          description: "The booking status will change to In Progress.",
          confirmText: "Start Job",
          isDestructive: false,
        };

      case "complete":
        return {
          title: "Complete this job?",
          description: "Once completed, the customer will be able to leave a review.",
          confirmText: "Mark Completed",
          isDestructive: false,
        };

      default:
        return {
          title: "Confirm action?",
          description: "Are you sure you want to continue?",
          confirmText: "Confirm",
          isDestructive: false,
        };
    }
  };

  if (loading) {
    return <BookingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <SectionCard
        title="Incoming Bookings"
        description="Manage customer requests and job progress."
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onAction={handleAction}
                isLoading={actionLoading === booking.id}
              />
            ))}
          </div>
        ) : (
          <EmptyBookings />
        )}
      </SectionCard>

      {confirmDialog.bookingId && (
        <ConfirmDialog
          {...getConfirmDialogProps()}
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              closeConfirmDialog();
            }
          }}
          onConfirm={executeAction}
          loading={actionLoading === confirmDialog.bookingId}
        />
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  onAction: (bookingId: string, action: TechnicianBookingAction) => void;
  isLoading: boolean;
}

function BookingCard({ booking, onAction, isLoading }: BookingCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Booking</p>
            <p className="break-all font-medium text-foreground">{booking.id}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Scheduled" value={formatDateTime(booking.scheduledAt)} />
            <Info label="Created" value={formatDateTime(booking.createdAt)} />
            <Info label="Updated" value={formatDateTime(booking.updatedAt)} />
            <Info label="Customer Note" value={booking.customerNote || "No note provided."} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <BookingStatusBadge status={booking.status as BookingStatus} />
          <BookingActions
            booking={booking}
            onAction={onAction}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

interface BookingActionsProps {
  booking: Booking;
  onAction: (bookingId: string, action: TechnicianBookingAction) => void;
  isLoading: boolean;
}

function BookingActions({ booking, onAction, isLoading }: BookingActionsProps) {
  switch (booking.status) {
    case "REQUESTED":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="border border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
            variant="outline"
            onClick={() => onAction(booking.id, "decline")}
            disabled={isLoading}
          >
            Decline
          </Button>

          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => onAction(booking.id, "accept")}
            disabled={isLoading}
          >
            Accept
          </Button>
        </div>
      );

    case "PAID":
      return (
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => onAction(booking.id, "start")}
          disabled={isLoading}
        >
          Start Job
        </Button>
      );

    case "IN_PROGRESS":
      return (
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => onAction(booking.id, "complete")}
          disabled={isLoading}
        >
          Mark as Complete
        </Button>
      );

    default:
      return null;
  }
}

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <SectionCard title="Incoming Bookings" description="Loading...">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-36 w-full" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">No booking requests</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You don't have any incoming booking requests right now.
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}