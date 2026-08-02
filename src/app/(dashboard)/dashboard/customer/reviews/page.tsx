"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Star } from "lucide-react";
import { toast } from "sonner";

import {
  deleteReview,
  getAllReviewDetailsFromLoginUser,
} from "@/actions/review.action";

import { ReviewForm } from "@/components/forms/review-form";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Review } from "@/types/review";

interface ReviewMeta {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
}

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [meta, setMeta] = useState<ReviewMeta>({
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  });

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        const result = await getAllReviewDetailsFromLoginUser();

        if (cancelled) return;

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setReviews(result.data);
        setMeta(result.meta);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load reviews:", error);
        toast.error("Failed to load reviews.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return;

    setDeleteLoading(true);

    try {
      const result = await deleteReview(deletingReviewId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== deletingReviewId),
      );

      setMeta((currentMeta) => ({
        ...currentMeta,
        totalRow: Math.max(0, currentMeta.totalRow - 1),
      }));

      toast.success(result.message);
      setDeletingReviewId(null);
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReviewUpdated = (updatedReview?: {
    id?: string;
    rating: number;
    description?: string;
    updatedAt?: string;
  }) => {
    if (!updatedReview?.id) return;

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === updatedReview.id
          ? {
              ...review,
              rating: updatedReview.rating,
              description: updatedReview.description ?? "",
              updatedAt: updatedReview.updatedAt ?? new Date().toISOString(),
            }
          : review,
      ),
    );

    setEditingReview(null);
  };

  if (loading) {
    return <ReviewsLoading />;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard
        title="Your Reviews"
        description={
          meta.totalRow
            ? `${meta.totalRow} total ${
                meta.totalRow === 1 ? "review" : "reviews"
              }`
            : "You haven't submitted any reviews yet."
        }
      >
        {reviews.length ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={() => setEditingReview(review)}
                onDelete={() => setDeletingReviewId(review.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyReviews />
        )}
      </SectionCard>

      <EditReviewDialog
        review={editingReview}
        onClose={() => setEditingReview(null)}
        onSuccess={handleReviewUpdated}
      />

      <ConfirmDialog
        title="Delete review?"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Keep Review"
        isDestructive
        open={Boolean(deletingReviewId)}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDeletingReviewId(null);
          }
        }}
        onConfirm={handleDeleteReview}
        loading={deleteLoading}
      />
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <article className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Rating</p>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < review.rating
                        ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                        : "h-4 w-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>

              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="hidden rounded-full sm:inline-flex"
            >
              {review.rating} Star
            </Badge>

            <ReviewActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-1 text-xs text-muted-foreground">Your review</p>

          <p className="text-sm leading-6">{review.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Info label="Booking ID" value={review.bookingId} />

          <Info label="Created" value={formatDateTime(review.createdAt)} />

          <Info label="Last Updated" value={formatDateTime(review.updatedAt)} />
        </div>
      </div>
    </article>
  );
}

interface ReviewActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewActions({ onEdit, onDelete }: ReviewActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open review actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>Edit Review</DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          Delete Review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface EditReviewDialogProps {
  review: Review | null;
  onClose: () => void;
  onSuccess: (data: { rating: number; description?: string }) => void;
}

function EditReviewDialog({
  review,
  onClose,
  onSuccess,
}: EditReviewDialogProps) {
  return (
    <Dialog
      open={Boolean(review)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>

          <DialogDescription>
            Update your rating and feedback.
          </DialogDescription>
        </DialogHeader>

        {review && (
          <ReviewForm
            mode="edit"
            reviewId={review.id}
            initialData={{
              rating: review.rating,
              description: review.description,
            }}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReviewsLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard title="Your Reviews" description="Loading your reviews...">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function EmptyReviews() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-12 text-center sm:py-16">
      <h3 className="text-lg font-semibold">No reviews found</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t submitted any reviews yet.
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 break-all text-sm font-medium">{value}</p>
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
