"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllBookingsFromLoginUser, cancelBooking } from "@/actions/bookings.action"
import { getAllReviewDetailsFromLoginUser } from "@/actions/review.action"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { BookingStatusBadge } from "@/components/status-badges"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReviewForm } from "@/components/forms/review-form"
import { toast } from "sonner"
import type { Booking, BookingStatus } from "@/types/api"

export default function CustomerBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Map<string, boolean>>(new Map())
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    bookingId: string | null
  }>({
    open: false,
    bookingId: null,
  })
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    bookingId: string | null
  }>({
    open: false,
    bookingId: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, reviewsRes] = await Promise.all([
          getAllBookingsFromLoginUser(),
          getAllReviewDetailsFromLoginUser(),
        ])

        if (Array.isArray(bookingsRes)) {
          setBookings(bookingsRes)
        }

        if (Array.isArray(reviewsRes)) {
          const reviewMap = new Map(
            reviewsRes.map((r: any) => [r.bookingId, true])
          )
          setReviews(reviewMap)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCancelBooking = async () => {
    const bookingId = confirmDialog.bookingId
    if (!bookingId) return

    setActionLoading(bookingId)
    try {
      const result = await cancelBooking(bookingId)
      if (result.success) {
        toast.success(result.message)
        setBookings(bookings.filter((b) => b.id !== bookingId))
      } else {
        toast.error(result.message)
      }
    } finally {
      setActionLoading(null)
      setConfirmDialog({ open: false, bookingId: null })
    }
  }

  const handleReviewSuccess = () => {
    setReviewDialog({ open: false, bookingId: null })
    const bookingId = reviewDialog.bookingId
    if (bookingId) {
      setReviews(new Map(reviews).set(bookingId, true))
    }
    toast.success("Review submitted successfully")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Bookings"
          description="View and manage your service bookings."
        />
        <SectionCard
          title="Booking History"
          description="Loading..."
        >
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </SectionCard>
      </div>
    )
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
            ? `You have ${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
            : "You have no bookings yet"
        }
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>
                      <p className="font-medium break-all">
                        {booking.id.slice(0, 8)}...
                      </p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="Scheduled"
                        value={formatDateTime(booking.scheduledDate)}
                      />
                      <Info
                        label="Price"
                        value={`$${booking.price}`}
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

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <BookingStatusBadge status={booking.status as BookingStatus} />
                    <BookingActions
                      booking={booking}
                      hasReview={reviews.has(booking.id)}
                      onCancel={() => {
                        setConfirmDialog({
                          open: true,
                          bookingId: booking.id,
                        })
                      }}
                      onReview={() => {
                        setReviewDialog({
                          open: true,
                          bookingId: booking.id,
                        })
                      }}
                      isLoading={actionLoading === booking.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <div className="max-w-md space-y-3">
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-sm text-muted-foreground">
                You haven&apos;t booked any services yet. Once you create a
                booking, it will appear here.
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        title="Cancel booking?"
        description="Are you sure you want to cancel this booking?"
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        isDestructive
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({
            open,
            bookingId: open ? confirmDialog.bookingId : null,
          })
        }
        onConfirm={handleCancelBooking}
        loading={actionLoading === confirmDialog.bookingId}
      />

      {/* Review Dialog */}
      {reviewDialog.bookingId && (
        <Dialog
          open={reviewDialog.open}
          onOpenChange={(open) =>
            setReviewDialog({
              open,
              bookingId: open ? reviewDialog.bookingId : null,
            })
          }
        >
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this service
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
  )
}

interface BookingActionsProps {
  booking: Booking
  hasReview: boolean
  onCancel: () => void
  onReview: () => void
  isLoading: boolean
}

function BookingActions({
  booking,
  hasReview,
  onCancel,
  onReview,
  isLoading,
}: BookingActionsProps) {
  const status = booking.status

  if (["REQUESTED", "ACCEPTED", "PAID"].includes(status)) {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel Booking
      </Button>
    )
  }

  if (status === "COMPLETED" && !hasReview) {
    return (
      <Button size="sm" onClick={onReview} disabled={isLoading}>
        Leave Review
      </Button>
    )
  }

  if (status === "COMPLETED" && hasReview) {
    return (
      <div className="text-sm text-muted-foreground">
        Review submitted
      </div>
    )
  }

  return null
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-all">{value}</p>
    </div>
  )
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}
      >
        {hasBookings ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>
                      <p className="font-medium break-all">{booking.id}</p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="Scheduled At"
                        value={formatDateTime(booking.scheduledAt)}
                      />
                      <Info label="Location" value={booking.location} />
                      <Info label="Service ID" value={booking.serviceId} />
                      <Info
                        label="Customer Note"
                        value={booking.customerNote}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    {getBookingAction(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <div className="max-w-md space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl">🧾</span>
              </div>
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-sm text-muted-foreground">
                You haven’t booked any services yet. Once you create a booking,
                it will appear here.
              </p>
              {/* <Button className={"cursor-pointer"}>
                {" "}
                <Link href={"/services"}>Browse Services</Link>
              </Button> */}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function getStatusVariant(status: BookingStatus) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "ACCEPTED":
      return "secondary";
    case "PAID":
      return "outline";
    case "REQUESTED":
      return "secondary";
    case "DECLINED":
      return "destructive";
    case "CANCELED":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    default:
      return "secondary";
  }
}

function getBookingAction(status: BookingStatus) {
  if (["REQUESTED", "ACCEPTED", "PAID"].includes(status)) {
    return (
      <Button size="sm" variant="destructive">
        Cancel Booking
      </Button>
    );
  }

  if (status === "COMPLETED") {
    return <Button size="sm">Add Review</Button>;
  }

  return null;
}
