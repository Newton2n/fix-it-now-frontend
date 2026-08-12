
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateTechnicianBookingStatus } from "@/actions/bookings.action";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { BookingStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

interface TechnicianBookingsClientProps {
  initialBookings: Booking[];
  initialMeta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
}

export default function TechnicianBookingsClient({
  initialBookings,
}: TechnicianBookingsClientProps) {
  const router = useRouter();

  // Only UI state here; list comes from server via props
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

  const handleAction = (
    bookingId: string,
    action: TechnicianBookingAction,
  ) => {
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

      // Refresh to get fresh data from server (filters, counts, etc.)
      router.refresh();
    } catch (error) {
      console.error("Booking status update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
      closeConfirmDialog();
    }
  };

  const getConfirmDialogProps = () => {
    switch (confirmDialog.action) {
      case "accept":
        return {
          title: "Accept booking?",
          description:
            "You are accepting this service request from the customer.",
          confirmText: "Accept Booking",
          isDestructive: false,
        };
      case "decline":
        return {
          title: "Decline booking?",
          description:
            "Are you sure you want to decline this booking?",
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
          description:
            "Once completed, the customer will be able to leave a review.",
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

  if (initialBookings.length === 0) {
    return <EmptyBookings />;
  }

  return (
    <>
      <div className="space-y-4">
        {initialBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onAction={handleAction}
            isLoading={actionLoading === booking.id}
          />
        ))}
      </div>

      {confirmDialog.bookingId && (
        <ConfirmDialog
          {...getConfirmDialogProps()}
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open) closeConfirmDialog();
          }}
          onConfirm={executeAction}
          loading={actionLoading === confirmDialog.bookingId}
        />
      )}
    </>
  );
}

// ----- BookingCard, BookingActions, Info, EmptyBookings -----

function BookingCard({
  booking,
  onAction,
  isLoading,
}: {
  booking: Booking;
  onAction: (id: string, action: TechnicianBookingAction) => void;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Booking</p>
            <p className="break-all font-medium text-foreground">
              {booking.id}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              label="Scheduled"
              value={formatDateTime(booking.scheduledAt)}
            />
            <Info label="Created" value={formatDateTime(booking.createdAt)} />
            <Info label="Updated" value={formatDateTime(booking.updatedAt)} />
            <Info
              label="Customer Note"
              value={booking.customerNote || "No note provided."}
            />
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

function BookingActions({
  booking,
  onAction,
  isLoading,
}: {
  booking: Booking;
  onAction: (id: string, action: TechnicianBookingAction) => void;
  isLoading: boolean;
}) {
  switch (booking.status) {
    case "REQUESTED":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
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

function EmptyBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">No booking requests</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You don&apos;t have any incoming booking requests right now.
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