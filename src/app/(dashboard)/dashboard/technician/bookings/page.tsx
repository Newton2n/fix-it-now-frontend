"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllBookingsFromLoginTechnician, acceptBooking, declineBooking, startBooking, completeBooking } from "@/actions/bookings.action"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { BookingStatusBadge } from "@/components/status-badges"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import type { Booking, BookingStatus } from "@/types/api"

export default function TechnicianBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    bookingId: string | null
    action: "accept" | "decline" | "start" | "complete" | null
  }>({
    open: false,
    bookingId: null,
    action: null,
  })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookingsFromLoginTechnician()
        if (Array.isArray(res)) {
          setBookings(res)
        } else if (res?.result && Array.isArray(res.result)) {
          setBookings(res.result)
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleAction = async (
    bookingId: string,
    action: "accept" | "decline" | "start" | "complete"
  ) => {
    setConfirmDialog({
      open: true,
      bookingId,
      action,
    })
  }

  const executeAction = async () => {
    const { bookingId, action } = confirmDialog
    if (!bookingId || !action) return

    setActionLoading(bookingId)
    try {
      let result
      switch (action) {
        case "accept":
          result = await acceptBooking(bookingId)
          break
        case "decline":
          result = await declineBooking(bookingId)
          break
        case "start":
          result = await startBooking(bookingId)
          break
        case "complete":
          result = await completeBooking(bookingId)
          break
      }

      if (result.success) {
        toast.success(result.message)
        router.refresh()
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        toast.error(result.message)
      }
    } finally {
      setActionLoading(null)
      setConfirmDialog({ open: false, bookingId: null, action: null })
    }
  }

  const getConfirmDialogProps = () => {
    const { action } = confirmDialog
    const configs: Record<
      string,
      { title: string; description: string; confirmText: string; isDestructive: boolean }
    > = {
      accept: {
        title: "Accept booking?",
        description: "You are accepting this service request from the customer.",
        confirmText: "Accept Booking",
        isDestructive: false,
      },
      decline: {
        title: "Decline booking?",
        description: "Are you sure you want to decline this booking?",
        confirmText: "Decline Booking",
        isDestructive: true,
      },
      start: {
        title: "Start this job?",
        description: "The booking status will change to In Progress.",
        confirmText: "Start Job",
        isDestructive: false,
      },
      complete: {
        title: "Complete this job?",
        description: "Once completed, the customer will be able to leave a review.",
        confirmText: "Mark Completed",
        isDestructive: false,
      },
    }
    return configs[action || "accept"]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Booking Requests"
          description="Accept, decline, and update service jobs."
        />
        <SectionCard
          title="Incoming Bookings"
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
        title="Booking Requests"
        description="Accept, decline, and update service jobs."
      />

      <SectionCard
        title="Incoming Bookings"
        description="Manage customer requests and job progress"
      >
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="break-all font-medium text-foreground">
                        Booking ID: {booking.id.slice(0, 8)}...
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
                      onAction={handleAction}
                      isLoading={actionLoading === booking.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No booking requests
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don&apos;t have any incoming booking requests right now.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Confirmation Dialog */}
      {confirmDialog.bookingId && (
        <ConfirmDialog
          {...getConfirmDialogProps()}
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog({
              open,
              bookingId: open ? confirmDialog.bookingId : null,
              action: open ? confirmDialog.action : null,
            })
          }
          onConfirm={executeAction}
          loading={actionLoading === confirmDialog.bookingId}
        />
      )}
    </div>
  )
}

interface BookingActionsProps {
  booking: Booking
  onAction: (bookingId: string, action: "accept" | "decline" | "start" | "complete") => void
  isLoading: boolean
}

function BookingActions({
  booking,
  onAction,
  isLoading,
}: BookingActionsProps) {
  const status = booking.status

  if (status === "REQUESTED") {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(booking.id, "decline")}
          disabled={isLoading}
        >
          Decline
        </Button>
        <Button
          size="sm"
          onClick={() => onAction(booking.id, "accept")}
          disabled={isLoading}
        >
          Accept
        </Button>
      </div>
    )
  }

  if (status === "PAID") {
    return (
      <Button
        size="sm"
        onClick={() => onAction(booking.id, "start")}
        disabled={isLoading}
      >
        Start Job
      </Button>
    )
  }

  if (status === "IN_PROGRESS") {
    return (
      <Button
        size="sm"
        onClick={() => onAction(booking.id, "complete")}
        disabled={isLoading}
      >
        Complete Job
      </Button>
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
      <p className="mt-1 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}
