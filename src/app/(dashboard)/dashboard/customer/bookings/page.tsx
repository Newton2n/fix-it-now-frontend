"use client";

import { useEffect, useState } from "react";

import {
  getAllBookingsFromLoginUser,
  cancelBooking,
} from "@/actions/bookings.action";

import { getAllReviewDetailsFromLoginUser } from "@/actions/review.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { BookingStatusBadge } from "@/components/status-badges";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ReviewForm } from "@/components/forms/review-form";

import { toast } from "sonner";

import type { Booking, BookingStatus } from "@/types/api";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bookingId: string | null;
  }>({
    open: false,
    bookingId: null,
  });

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    bookingId: string | null;
  }>({
    open: false,
    bookingId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResult, reviewsResult] = await Promise.all([
          getAllBookingsFromLoginUser(),
          getAllReviewDetailsFromLoginUser(),
        ]);

        console.log("Customer bookings:", bookingsResult);
        console.log("Customer reviews:", reviewsResult);

        if (!bookingsResult?.success) {
          toast.error(
            bookingsResult?.message || "Failed to load bookings.",
          );
          return;
        }

        if (Array.isArray(bookingsResult.data)) {
          setBookings(bookingsResult.data);
        }

        if (Array.isArray(reviewsResult)) {
          const reviewedBookingIds = new Set<string>(
            reviewsResult.map((review: { bookingId: string }) => review.bookingId),
          );

          setReviews(reviewedBookingIds);
        }
      } catch (error) {
        console.error("Failed to fetch customer bookings:", error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelBooking = async () => {
    const bookingId = confirmDialog.bookingId;

    if (!bookingId) return;

    setActionLoading(bookingId);

    try {
      const result = await cancelBooking(bookingId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "CANCELED" as BookingStatus,
              }
            : booking,
        ),
      );

      toast.success(result.message);

      setConfirmDialog({
        open: false,
        bookingId: null,
      });
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewSuccess = () => {
    const bookingId = reviewDialog.bookingId;

    if (bookingId) {
      setReviews((currentReviews) => {
        const updatedReviews = new Set(currentReviews);
        updatedReviews.add(bookingId);
        return updatedReviews;
      });
    }

    setReviewDialog({
      open: false,
      bookingId: null,
    });

    toast.success("Review submitted successfully.");
  };

  if (loading) {
    return <BookingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <SectionCard
        title="Booking History"
        description={
          bookings.length > 0
            ? `You have ${bookings.length} booking${
                bookings.length !== 1 ? "s" : ""
              }`
            : "You have no bookings yet"
        }
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                hasReview={reviews.has(booking.id)}
                onCancel={() =>
                  setConfirmDialog({
                    open: true,
                    bookingId: booking.id,
                  })
                }
                onReview={() =>
                  setReviewDialog({
                    open: true,
                    bookingId: booking.id,
                  })
                }
                isLoading={actionLoading === booking.id}
              />
            ))}
          </div>
        ) : (
          <EmptyBookings />
        )}
      </SectionCard>

      {/* Cancel Booking Confirmation */}
      {confirmDialog.bookingId && (
        <ConfirmDialog
          title="Cancel booking?"
          description="Are you sure you want to cancel this booking? This action cannot be undone."
          confirmText="Cancel Booking"
          cancelText="Keep Booking"
          isDestructive
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open && actionLoading) return;

            setConfirmDialog((current) => ({
              open,
              bookingId: open ? current.bookingId : null,
            }));
          }}
          onConfirm={handleCancelBooking}
          loading={actionLoading === confirmDialog.bookingId}
        />
      )}

      {/* Review Dialog */}
      {reviewDialog.bookingId && (
        <Dialog
          open={reviewDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setReviewDialog({
                open: false,
                bookingId: null,
              });
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Review</DialogTitle>

              <DialogDescription>
                Share your experience with this service.
              </DialogDescription>
            </DialogHeader>

            <ReviewForm
              mode="create"
              bookingId={reviewDialog.bookingId}
              onSuccess={handleReviewSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking Card                                                               */
/* -------------------------------------------------------------------------- */

interface BookingCardProps {
  booking: Booking;
  hasReview: boolean;
  onCancel: () => void;
  onReview: () => void;
  isLoading: boolean;
}

function BookingCard({
  booking,
  hasReview,
  onCancel,
  onReview,
  isLoading,
}: BookingCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Booking information */}
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

            <Info
              label="Location"
              value={booking.location || "Not provided"}
            />

            <Info
              label="Service ID"
              value={booking.serviceId}
            />

            <Info
              label="Customer Note"
              value={booking.customerNote || "No note"}
            />

            <Info
              label="Created"
              value={formatDateTime(booking.createdAt)}
            />

            <Info
              label="Updated"
              value={formatDateTime(booking.updatedAt)}
            />
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <BookingStatusBadge
            status={booking.status as BookingStatus}
          />

          <BookingActions
            booking={booking}
            hasReview={hasReview}
            onCancel={onCancel}
            onReview={onReview}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking Actions                                                            */
/* -------------------------------------------------------------------------- */

interface BookingActionsProps {
  booking: Booking;
  hasReview: boolean;
  onCancel: () => void;
  onReview: () => void;
  isLoading: boolean;
}

function BookingActions({
  booking,
  hasReview,
  onCancel,
  onReview,
  isLoading,
}: BookingActionsProps) {
  switch (booking.status) {
    /*
     * Customer can cancel the booking before
     * the technician starts the job.
     */
    case "REQUESTED":
    case "ACCEPTED":
    case "PAID":
      return (
        <Button
          size="sm"
          variant="destructive"
          onClick={onCancel}
          disabled={isLoading}
        >
          {isLoading ? "Cancelling..." : "Cancel Booking"}
        </Button>
      );

    /*
     * Once the technician starts the job,
     * customer cannot cancel anymore.
     */
    case "IN_PROGRESS":
      return null;

    /*
     * Customer can review a completed booking.
     */
    case "COMPLETED":
      if (hasReview) {
        return (
          <span className="text-sm text-muted-foreground">
            Review submitted
          </span>
        );
      }

      return (
        <Button
          size="sm"
          onClick={onReview}
          disabled={isLoading}
        >
          Add Review
        </Button>
      );

    /*
     * DECLINED / CANCELED
     */
    case "DECLINED":
    case "CANCELED":
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Bookings"
        description="View and manage your service bookings."
      />

      <SectionCard
        title="Booking History"
        description="Loading your bookings..."
      >
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              className="h-36 w-full"
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">
        No bookings found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t booked any services yet. Once you create a
        booking, it will appear here.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info                                                                       */
/* -------------------------------------------------------------------------- */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}