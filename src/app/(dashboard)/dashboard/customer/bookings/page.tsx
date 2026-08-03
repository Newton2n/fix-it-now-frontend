"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getAllBookingsFromLoginUser,
  cancelBooking,
} from "@/actions/bookings.action";

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

import type { Booking, BookingStatus } from "@/types/api";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();

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

  // Get bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getAllBookingsFromLoginUser();

        

        if (!result?.success) {
          toast.error(result?.message || "Failed to load bookings.");
          return;
        }

        if (Array.isArray(result.data)) {
          setBookings(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch customer bookings:", error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Cancel booking
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

  // Review submitted
  const handleReviewSuccess = () => {
    setReviewDialog({
      open: false,
      bookingId: null,
    });

    toast.success("Review submitted successfully.");

    // Refresh the booking data so the new review appears.
    window.location.reload();
  };

  // Go to payment page
  const handlePayNow = (bookingId: string) => {
    if (!bookingId) return;

    router.push(`/dashboard/customer/payment/${bookingId}`);
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
                onPayNow={() => handlePayNow(booking.id)}
                isLoading={actionLoading === booking.id}
              />
            ))}
          </div>
        ) : (
          <EmptyBookings />
        )}
      </SectionCard>

      {/* Cancel booking confirmation */}
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

      {/* Review dialog */}
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

// Booking card
interface BookingCardProps {
  booking: Booking;
  onCancel: () => void;
  onReview: () => void;
  onPayNow: () => void;
  isLoading: boolean;
}

function BookingCard({
  booking,
  onCancel,
  onReview,
  onPayNow,
  isLoading,
}: BookingCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          {/* Booking ID */}
          <div>
            <p className="text-sm text-muted-foreground">Booking</p>

            <p className="break-all font-medium text-foreground">
              {booking.id}
            </p>
          </div>

          {/* Booking information */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              label="Scheduled"
              value={formatDateTime(booking.scheduledAt)}
            />

            <Info
              label="Location"
              value={booking.location || "Not provided"}
            />

            {/* Service */}
            <div className="flex min-w-0 flex-col gap-2.5 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Service ID
                </p>

                <p className="mt-1 truncate text-sm font-medium">
                  {booking.serviceId}
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 w-full shrink-0 gap-1.5 text-xs sm:w-auto"
              >
                <Link href={`/services/${booking.serviceId}`}>
                  View Service
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>

            <Info
              label="Your Note"
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

          {/* Review */}
          {booking.review && (
            <ReviewSummary review={booking.review} />
          )}
        </div>

        {/* Status and actions */}
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <BookingStatusBadge
            status={booking.status as BookingStatus}
          />

          <BookingActions
            booking={booking}
            onCancel={onCancel}
            onReview={onReview}
            onPayNow={onPayNow}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

// Review summary
function ReviewSummary({
  review,
}: {
  review: NonNullable<Booking["review"]>;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Your Review</p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={
                star <= review.rating
                  ? "size-4 fill-yellow-400 text-yellow-400"
                  : "size-4 text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      {review.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {review.description}
        </p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Reviewed {formatDateTime(review.createdAt)}
      </p>
    </div>
  );
}

interface BookingActionsProps {
  booking: Booking;
  onCancel: () => void;
  onReview: () => void;
  onPayNow: () => void;
  isLoading: boolean;
}

function BookingActions({
  booking,
  onCancel,
  onReview,
  onPayNow,
  isLoading,
}: BookingActionsProps) {
  switch (booking.status) {
    case "REQUESTED":
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

    case "ACCEPTED":
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Booking"}
          </Button>

          <Button
            size="sm"
            onClick={onPayNow}
            disabled={isLoading}
          >
            Pay Now
          </Button>
        </div>
      );

    case "PAID":
      return (
        <span className="text-sm text-muted-foreground">
          Payment completed
        </span>
      );

    case "IN_PROGRESS":
      return null;

    case "COMPLETED":
      if (booking.review) {
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

    case "DECLINED":
    case "CANCELED":
    default:
      return null;
  }
}

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

function EmptyBookings() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">
        No bookings found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t booked any services yet. Once you create
        a booking, it will appear here.
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}